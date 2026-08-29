'use server';

import { createClient, createAdminClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { getClientContext } from '@/utils/server-context';

const safeAuditInsert = async (supabaseAdmin: Awaited<ReturnType<typeof createAdminClient>>, payload: Record<string, unknown>) => {
  try {
    const { error } = await supabaseAdmin.from('portfolio_audit_logs').insert(payload);
    if (error) {
      console.warn('[Audit] insert failed:', error.message);
    }
  } catch (error) {
    console.warn('[Audit] insert exception:', error instanceof Error ? error.message : 'unknown');
  }
};

export async function listMfaFactors() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/ops/login');
  }

  const { data, error } = await supabase.auth.mfa.listFactors();

  if (error) {
    return { factors: [], error: error.message };
  }

  return { factors: data ?? [], error: null };
}

export async function checkMfaStatus() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Session expired' };

  const factors = await supabase.auth.mfa.listFactors();
  const allFactors = factors.data?.all || [];
  const verifiedFactors = allFactors.filter(f => f.status === 'verified');
  
  return { isEnrolled: verifiedFactors.length > 0 };
}

export async function enrollMfa() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Session expired' };

  // Unenroll ALL existing unverified factors to prevent orphaned factors from Strict Mode
  const factors = await supabase.auth.mfa.listFactors();
  const allFactors = factors.data?.all || [];
  const unverifiedFactors = allFactors.filter(f => f.status === 'unverified');
  
  for (const f of unverifiedFactors) {
    await supabase.auth.mfa.unenroll({ factorId: f.id });
  }

  const friendlyName = `Admin_${Date.now()}`;
  const { data, error } = await supabase.auth.mfa.enroll({ 
    factorType: 'totp', 
    issuer: 'Jothish_SOC',
    friendlyName 
  });
  
  if (error) return { error: error.message };

  return { 
    factorId: data.id, 
    qrCode: data.totp.qr_code, 
    secret: data.totp.secret,
    uri: data.totp.uri 
  };
}

export async function verifyMfa(formData: FormData) {
  const supabase = await createClient();
  const supabaseAdmin = await createAdminClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Session expired. Please sign in again.' };
  }

  const context = await getClientContext();

  // Retrieve or generate Device ID from cookies
  const cookieStore = await import('next/headers').then(m => m.cookies());
  let deviceId = cookieStore.get('ops_device_id')?.value;
  if (!deviceId) {
    deviceId = crypto.randomUUID();
    cookieStore.set('ops_device_id', deviceId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 365 * 24 * 60 * 60,
    });
  }

  const factors = await supabase.auth.mfa.listFactors();
  const enrollment = factors.data?.all ?? [];
  
  // Target unverified factor if enrolling, otherwise target the verified factor
  const unverifiedFactor = enrollment.find(f => f.status === 'unverified');
  const verifiedFactor = enrollment.find(f => f.status === 'verified');
  const defaultFactor = unverifiedFactor || verifiedFactor;

  if (!defaultFactor) {
    return { error: 'No MFA factor found. Please reload to enroll.' };
  }

  const code = String(formData.get('code') ?? '').trim();
  if (!code) {
    return { error: 'Enter the 6-digit verification code from your authenticator app.' };
  }

  const challenge = await supabase.auth.mfa.challenge({ factorId: defaultFactor.id });
  if (challenge.error) {
    return { error: challenge.error.message };
  }

  const verification = await supabase.auth.mfa.verify({
    factorId: defaultFactor.id,
    challengeId: challenge.data.id,
    code,
  });

  if (verification.error) {
    const { recordLoginAttempt } = await import('@/lib/security-service');
    await recordLoginAttempt({
      email: user.email || 'unknown',
      adminId: user.id,
      status: 'FAILED',
      failureReason: verification.error.message,
      context,
      deviceId: deviceId || 'unknown'
    });

    await safeAuditInsert(supabaseAdmin, {
      admin_id: user.id,
      actor: user.email || 'unknown',
      action: 'FAILED_LOGIN',
      resource_type: 'auth',
      ip_address: context.ip,
      location: context.location,
      browser: context.browser,
      os: context.os,
      details: { ...context, email: user.email, error: verification.error.message, reason: 'Incorrect MFA code' }
    });
    return { error: verification.error.message };
  }

  // Insert session
  const sessionToken = crypto.randomUUID();
  const { createAdminSession } = await import('@/lib/session-service');
  
  await createAdminSession({
    admin_id: user.id,
    session_token: sessionToken,
    device_id: deviceId,
    ip_address: context.ip,
    country: context.country,
    city: context.city,
    region: context.region,
    isp: context.isp || 'Unknown ISP',
    browser: context.browser,
    device: context.device,
    os: context.os,
    user_agent: context.userAgent,
    current_page: '/ops',
    expires_at: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
  });

  const { recordLoginAttempt: recordSuccess } = await import('@/lib/security-service');
  await recordSuccess({
    email: user.email || 'unknown',
    adminId: user.id,
    status: 'SUCCESS',
    context,
    deviceId
  });

  await safeAuditInsert(supabaseAdmin, {
    admin_id: user.id,
    actor: user.email || 'unknown',
    action: 'SUCCESSFUL_LOGIN',
    resource_type: 'auth',
    ip_address: context.ip,
    location: context.location,
    browser: context.browser,
    os: context.os,
    details: { ...context, email: user.email, userId: user.id, mfaVerified: true }
  });

  cookieStore.set('admin_sid', sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/'
  });

  redirect('/ops');
}
