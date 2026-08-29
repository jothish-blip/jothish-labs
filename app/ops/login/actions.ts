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

export async function login(formData: FormData) {
  const email = String(formData.get('email') ?? '').trim().toLowerCase();
  const password = String(formData.get('password') ?? '');
  const supabase = await createClient();
  const supabaseAdmin = await createAdminClient();
  const context = await getClientContext();

  // 1. IP Check (Manual block & rate limit block)
  const { checkIpAllowed, checkAdminLocked, recordLoginAttempt } = await import('@/lib/security-service');
  const ipCheck = await checkIpAllowed(context.ip);
  if (!ipCheck.allowed) {
    return { error: ipCheck.reason || 'Access denied from this IP address.' };
  }

  // 2. Cookie Store for Device ID
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

  const { error, data } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    // Record failed login attempt
    await recordLoginAttempt({
      email,
      adminId: null,
      status: 'FAILED',
      failureReason: error.message,
      context,
      deviceId
    });

    await safeAuditInsert(supabaseAdmin, {
      admin_id: null,
      actor: email || 'unknown',
      action: 'FAILED_LOGIN',
      resource_type: 'auth',
      ip_address: context.ip,
      location: context.location,
      browser: context.browser,
      os: context.os,
      details: { ...context, email, error: error.message }
    });
    return { error: 'Invalid secure credentials' };
  }

  const adminId = data?.user?.id ?? null;

  // 3. Account Lock check
  if (adminId) {
    const lockCheck = await checkAdminLocked(adminId);
    if (lockCheck.locked) {
      await supabase.auth.signOut();
      return { error: lockCheck.reason || 'This account is locked. Please contact support.' };
    }
  }

  const { data: assurance } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();

  // Check site-wide MFA setting
  const { data: settings } = await supabaseAdmin.from('portfolio_settings').select('value').eq('key', 'enforce_mfa').single();
  const enforceMfa = settings?.value?.replace(/"/g, '') || 'strict';

  let requiresMfa = false;

  if (assurance) {
    if (assurance.nextLevel === 'aal2' && assurance.currentLevel !== 'aal2') {
      requiresMfa = true;
    } else if (assurance.nextLevel === 'aal1' && enforceMfa === 'strict') {
      requiresMfa = true;
    }
  } else {
    if (enforceMfa === 'strict') requiresMfa = true;
  }

  if (requiresMfa) {
    await safeAuditInsert(supabaseAdmin, {
      admin_id: adminId,
      actor: email || 'unknown',
      action: 'MFA_REQUIRED',
      resource_type: 'auth',
      ip_address: context.ip,
      location: context.location,
      browser: context.browser,
      os: context.os,
      details: { ...context, email, message: 'Strict MFA enforced.' }
    });
    return { requiresMfa: true, email };
  }

  // Login successful without MFA
  await recordLoginAttempt({
    email,
    adminId,
    status: 'SUCCESS',
    context,
    deviceId
  });

  await safeAuditInsert(supabaseAdmin, {
    admin_id: adminId,
    actor: email || 'unknown',
    action: 'SUCCESSFUL_LOGIN',
    resource_type: 'auth',
    ip_address: context.ip,
    location: context.location,
    browser: context.browser,
    os: context.os,
    details: { ...context, email, userId: adminId }
  });

  const sessionToken = crypto.randomUUID();
  
  if (adminId) {
    const { createAdminSession } = await import('@/lib/session-service');
    await createAdminSession({
      admin_id: adminId,
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
    
    cookieStore.set('admin_sid', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/'
    });
  }

  redirect('/ops');
}

export async function logout() {
  const supabase = await createClient();
  const supabaseAdmin = await createAdminClient();
  const context = await getClientContext();
  const { data: { session } } = await supabase.auth.getSession();

  if (session) {
    await safeAuditInsert(supabaseAdmin, {
      admin_id: session.user.id,
      actor: session.user.email || 'unknown',
      action: 'LOGOUT',
      resource_type: 'auth',
      ip_address: context.ip,
      location: context.location,
      browser: context.browser,
      os: context.os,
      details: { ...context, email: session.user.email, userId: session.user.id }
    });

    const cookieStore = await import('next/headers').then(m => m.cookies());
    const adminSid = cookieStore.get('admin_sid')?.value;
    
    if (adminSid) {
      const { expireAdmin } = await import('@/lib/session-service');
      await expireAdmin(adminSid, session.user.id);
    }
  }

  await supabase.auth.signOut();
  
  // Clear any additional cookies (e.g. telemetry cookies if admin was tracked)
  const cookieStore = await import('next/headers').then(m => m.cookies());
  cookieStore.delete('pf_vid');
  cookieStore.delete('pf_sid');
  cookieStore.delete('admin_sid');

  redirect('/');
}
