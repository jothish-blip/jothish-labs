'use server';

import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export async function listMfaFactors() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
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
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return { error: 'Session expired' };

  const factors = await supabase.auth.mfa.listFactors();
  const allFactors = factors.data?.all || [];
  const verifiedFactors = allFactors.filter(f => f.status === 'verified');
  
  return { isEnrolled: verifiedFactors.length > 0 };
}

export async function enrollMfa() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return { error: 'Session expired' };

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
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return { error: 'Session expired. Please sign in again.' };
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
    return { error: verification.error.message };
  }

  // Insert session
  const { createAdminClient } = await import('@/utils/supabase/server');
  const supabaseAdmin = await createAdminClient(); 
  const sessionToken = session.access_token;
  
  await supabaseAdmin.from('portfolio_admin_sessions').insert({
    admin_id: session.user.id,
    session_token: sessionToken,
    ip_address: 'MFA Verified',
    country: 'Unknown',
    browser: 'Unknown',
    device: 'Unknown',
    os: 'Unknown',
    current_page: '/ops',
    expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  });

  redirect('/ops');
}
