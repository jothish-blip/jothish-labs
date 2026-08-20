'use server';

import { createClient, createAdminClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';

function parseUserAgentDetailed(ua: string) {
  let browser = 'Unknown';
  let browser_version = 'Unknown';
  let os = 'Unknown';
  let os_version = 'Unknown';
  let device = 'Desktop';

  if (ua.includes('Firefox')) {
    browser = 'Firefox';
    browser_version = ua.match(/Firefox\/([\d.]+)/)?.[1] || 'Unknown';
  } else if (ua.includes('Edg')) {
    browser = 'Edge';
    browser_version = ua.match(/Edg\/([\d.]+)/)?.[1] || 'Unknown';
  } else if (ua.includes('Chrome')) {
    browser = 'Chrome';
    browser_version = ua.match(/Chrome\/([\d.]+)/)?.[1] || 'Unknown';
  } else if (ua.includes('Safari') && !ua.includes('Chrome')) {
    browser = 'Safari';
    browser_version = ua.match(/Version\/([\d.]+)/)?.[1] || 'Unknown';
  }

  if (ua.includes('Windows NT 10.0')) { os = 'Windows'; os_version = '10/11'; }
  else if (ua.includes('Windows NT 6.3')) { os = 'Windows'; os_version = '8.1'; }
  else if (ua.includes('Windows NT 6.2')) { os = 'Windows'; os_version = '8'; }
  else if (ua.includes('Windows NT 6.1')) { os = 'Windows'; os_version = '7'; }
  else if (ua.includes('Mac OS X')) { 
    os = 'macOS'; 
    os_version = ua.match(/Mac OS X ([\d_]+)/)?.[1]?.replace(/_/g, '.') || 'Unknown'; 
  }
  else if (ua.includes('Android')) {
    os = 'Android';
    os_version = ua.match(/Android ([\d.]+)/)?.[1] || 'Unknown';
    device = 'Mobile';
  }
  else if (ua.includes('iPhone OS') || ua.includes('iPad; CPU OS')) {
    os = 'iOS';
    os_version = ua.match(/OS ([\d_]+)/)?.[1]?.replace(/_/g, '.') || 'Unknown';
    device = 'Mobile';
  }
  else if (ua.includes('Linux')) { os = 'Linux'; }

  return { browser, browser_version, os, os_version, device };
}

async function getClientContext() {
  const headersList = await headers();
  const ua = headersList.get('user-agent') || 'Unknown';
  const { browser, browser_version, os, os_version, device } = parseUserAgentDetailed(ua);
  
  const city = headersList.get('x-vercel-ip-city') || '';
  const region = headersList.get('x-vercel-ip-country-region') || '';
  const country = headersList.get('x-vercel-ip-country') || '';
  const locationParts = [city, region, country].filter(Boolean);
  const location = locationParts.length > 0 ? locationParts.join(', ') : 'Unknown';

  return {
    ip: headersList.get('x-forwarded-for')?.split(',')[0]?.trim() || headersList.get('x-real-ip') || 'Local Development',
    userAgent: ua,
    browser,
    browser_version,
    os,
    os_version,
    device,
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
    // If we can't determine assurance level, but MFA is enforced, require it.
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

  const cookieStore = await import('next/headers').then(m => m.cookies());
  const existingSid = cookieStore.get('admin_sid')?.value;
  if (existingSid && adminId) {
    const { expireAdmin } = await import('@/lib/session-service');
    await expireAdmin(existingSid, adminId);
  }

  const sessionToken = crypto.randomUUID();
  
  if (adminId) {
    const { createAdminSession } = await import('@/lib/session-service');
    await createAdminSession({
      admin_id: adminId,
      session_token: sessionToken,
      ip_address: context.ip,
      country: context.country,
      browser: context.browser,
      device: context.device,
      os: context.os,
      current_page: '/ops',
      expires_at: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
    });
    
    const cookieStore = await import('next/headers').then(m => m.cookies());
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
