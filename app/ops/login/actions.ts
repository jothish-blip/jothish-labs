'use server';

import { createClient, createAdminClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';

// Helper to extract basic OS/Browser from User Agent
function parseUserAgent(ua: string) {
  let browser = 'Unknown';
  let os = 'Unknown';

  if (ua.includes('Firefox')) browser = 'Firefox';
  else if (ua.includes('Edg')) browser = 'Edge';
  else if (ua.includes('Chrome')) browser = 'Chrome';
  else if (ua.includes('Safari') && !ua.includes('Chrome')) browser = 'Safari';

  if (ua.includes('Win')) os = 'Windows';
  else if (ua.includes('Mac')) os = 'macOS';
  else if (ua.includes('Linux')) os = 'Linux';
  else if (ua.includes('Android')) os = 'Android';
  else if (ua.includes('iOS') || ua.includes('iPhone') || ua.includes('iPad')) os = 'iOS';

  return { browser, os };
}

async function getClientContext() {
  const headersList = await headers();
  const ua = headersList.get('user-agent') || 'Unknown';
  const { browser, os } = parseUserAgent(ua);
  
  const city = headersList.get('x-vercel-ip-city') || '';
  const region = headersList.get('x-vercel-ip-country-region') || '';
  const country = headersList.get('x-vercel-ip-country') || '';
  const locationParts = [city, region, country].filter(Boolean);
  const location = locationParts.length > 0 ? locationParts.join(', ') : 'Unknown';

  return {
    ip: headersList.get('x-forwarded-for')?.split(',')[0]?.trim() || headersList.get('x-real-ip') || 'Local Development',
    userAgent: ua,
    browser,
    os,
    location,
    city: city || 'Unknown',
    region: region || 'Unknown',
    country: country || 'Unknown',
    timezone: headersList.get('x-vercel-timezone') || 'Unknown'
  };
}

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

  const fifteenMinsAgo = new Date(Date.now() - 15 * 60000).toISOString();
  
  // Rate limiting logic based on IP and Email
  const { data: recentFailures } = await supabaseAdmin
    .from('portfolio_audit_logs')
    .select('id')
    .eq('action', 'FAILED_LOGIN')
    .filter('details->>email', 'eq', email)
    .gte('created_at', fifteenMinsAgo);

  if (recentFailures && recentFailures.length >= 5) {
    await safeAuditInsert(supabaseAdmin, {
      admin_id: null,
      actor: email || 'unknown',
      action: 'ACCOUNT_LOCKOUT',
      resource_type: 'auth',
      ip_address: context.ip,
      location: context.location,
      browser: context.browser,
      os: context.os,
      details: { ...context, email, reason: 'Too many failed attempts' }
    });
    return { error: 'Account temporarily locked due to too many failed attempts. Try again later.' };
  }

  const { error, data } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
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
  const { data: assurance, error: assuranceError } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();

  if (!assuranceError && assurance && assurance.nextLevel === 'aal2' && assurance.currentLevel !== 'aal2') {
    await safeAuditInsert(supabaseAdmin, {
      admin_id: adminId,
      actor: email || 'unknown',
      action: 'MFA_REQUIRED',
      resource_type: 'auth',
      ip_address: context.ip,
      location: context.location,
      browser: context.browser,
      os: context.os,
      details: { ...context, email, nextLevel: assurance.nextLevel, currentLevel: assurance.currentLevel }
    });
    return { requiresMfa: true, email };
  }

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
  }

  await supabase.auth.signOut();
  
  // Clear any additional cookies (e.g. telemetry cookies if admin was tracked)
  const cookieStore = await import('next/headers').then(m => m.cookies());
  cookieStore.delete('pf_vid');
  cookieStore.delete('pf_sid');

  redirect('/');
}
