import { createAdminClient } from '@/utils/supabase/server';
import { getClientContext } from '@/utils/server-context';

export function detectSuspiciousIP(ip: string, userAgent: string, asOrg: string): { isSuspicious: boolean; reason: string | null } {
  const asOrgLower = asOrg.toLowerCase();
  const suspiciousOrgs = ['hosting', 'vpn', 'proxy', 'tor', 'cloudflare', 'amazon', 'google', 'digitalocean', 'linode', 'ovh', 'm247', 'packet', 'datacenter', 'leaseweb'];
  
  for (const org of suspiciousOrgs) {
    if (asOrgLower.includes(org)) {
      return { isSuspicious: true, reason: `VPN/Proxy datacenter detected: ${asOrg}` };
    }
  }
  return { isSuspicious: false, reason: null };
}

export async function checkIpAllowed(ip: string): Promise<{ allowed: boolean; reason: string | null }> {
  const supabase = await createAdminClient();
  
  // Query rate limits table for this IP
  const { data } = await supabase.from('portfolio_rate_limits').select('*').eq('ip_address', ip).maybeSingle();
  
  if (!data) return { allowed: true, reason: null };
  
  // Check if whitelisted
  if (data.is_whitelisted) return { allowed: true, reason: null };
  
  // Check if blocked manually
  if (data.is_blocked) return { allowed: false, reason: data.reason || 'IP address has been blocked by administrator.' };
  
  // Check if temporarily rate-limit blocked
  if (data.blocked_until && new Date(data.blocked_until) > new Date()) {
    return { allowed: false, reason: `IP temporarily blocked due to rate limiting until ${new Date(data.blocked_until).toLocaleTimeString()}` };
  }
  
  return { allowed: true, reason: null };
}

export async function checkAdminLocked(adminId: string): Promise<{ locked: boolean; reason: string | null }> {
  const supabase = await createAdminClient();
  const { data } = await supabase.from('portfolio_admin_status').select('*').eq('admin_id', adminId).maybeSingle();
  
  if (data && data.is_locked) {
    return { locked: true, reason: data.locked_reason || 'This account has been locked for security reasons.' };
  }
  
  return { locked: false, reason: null };
}

export async function triggerSecurityAlert(params: {
  adminId: string | null;
  type: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  message: string;
  details: any;
}) {
  const supabase = await createAdminClient();
  
  // 1. Insert into portfolio_security_alerts
  const { error } = await supabase.from('portfolio_security_alerts').insert({
    admin_id: params.adminId,
    type: params.type,
    severity: params.severity,
    message: params.message,
    details: params.details
  });
  
  if (error) console.error('[security-service] Error inserting alert:', error);

  // 2. Insert into portfolio_notifications for the admin dashboard
  const { error: notifError } = await supabase.from('portfolio_notifications').insert({
    category: 'SECURITY',
    title: `Security Alert: ${params.type.replace(/_/g, ' ')}`,
    message: params.message,
    priority: params.severity,
    link: '/ops/security'
  });
  
  if (notifError) console.error('[security-service] Error creating notification:', notifError);
}

export async function recordLoginAttempt(params: {
  email: string;
  adminId: string | null;
  status: 'SUCCESS' | 'FAILED';
  failureReason?: string;
  context: any;
  deviceId: string;
}) {
  const supabase = await createAdminClient();
  
  // 1. Insert into portfolio_admin_logins
  const { error: logError } = await supabase.from('portfolio_admin_logins').insert({
    admin_id: params.adminId,
    username: params.email,
    status: params.status,
    failure_reason: params.failureReason || null,
    ip_address: params.context.ip,
    country: params.context.country,
    city: params.context.city,
    region: params.context.region,
    isp: params.context.isp || 'Unknown ISP',
    browser: params.context.browser,
    device: params.context.device,
    os: params.context.os,
    user_agent: params.context.userAgent,
    device_id: params.deviceId
  });
  if (logError) console.error('[security-service] Error logging attempt:', logError);

  // 2. If login failed, handle lockout and rate limit thresholds
  if (params.status === 'FAILED') {
    const { data: limitData } = await supabase.from('portfolio_rate_limits').select('*').eq('ip_address', params.context.ip).maybeSingle();
    const attempts = (limitData?.attempts || 0) + 1;
    
    let blockedUntil = null;
    let isBlocked = false;
    
    if (attempts >= 5) {
      blockedUntil = new Date(Date.now() + 15 * 60 * 1000).toISOString(); // 15 mins block
      isBlocked = true;
      
      await triggerSecurityAlert({
        adminId: params.adminId,
        type: 'FAILED_LOGINS',
        severity: 'HIGH',
        message: `Multiple failed logins from IP: ${params.context.ip}. IP blocked temporarily.`,
        details: { ip: params.context.ip, email: params.email, attempts }
      });
    }

    await supabase.from('portfolio_rate_limits').upsert({
      ip_address: params.context.ip,
      attempts,
      blocked_until: blockedUntil,
      is_blocked: limitData?.is_blocked || isBlocked,
      reason: isBlocked ? 'Too many failed login attempts' : (limitData?.reason || null),
      updated_at: new Date().toISOString()
    });

    if (params.adminId && attempts >= 5) {
      await supabase.from('portfolio_admin_status').upsert({
        admin_id: params.adminId,
        is_locked: true,
        locked_reason: 'Account locked due to excessive failed attempts',
        locked_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
      
      await triggerSecurityAlert({
        adminId: params.adminId,
        type: 'ACCOUNT_LOCKOUT',
        severity: 'CRITICAL',
        message: `Admin account locked: ${params.email} due to excessive failures.`,
        details: { email: params.email, ip: params.context.ip }
      });
    }
  }

  // 3. If login succeeded, check for device, country, impossible travel, VPN, and multiple sessions
  if (params.status === 'SUCCESS' && params.adminId) {
    // Reset rate limits on successful login
    await supabase.from('portfolio_rate_limits').update({ attempts: 0, blocked_until: null }).eq('ip_address', params.context.ip);

    // A. VPN/Proxy check
    const isVpn = detectSuspiciousIP(params.context.ip, params.context.userAgent, params.context.isp || '');
    if (isVpn.isSuspicious) {
      await triggerSecurityAlert({
        adminId: params.adminId,
        type: 'VPN_PROXY',
        severity: 'MEDIUM',
        message: `Admin logged in using VPN/Proxy: ${isVpn.reason}`,
        details: { ip: params.context.ip, isp: params.context.isp }
      });
    }

    // B. Device tracking check
    const { data: deviceData } = await supabase
      .from('portfolio_admin_devices')
      .select('*')
      .eq('admin_id', params.adminId)
      .eq('device_id', params.deviceId)
      .maybeSingle();

    if (!deviceData) {
      await supabase.from('portfolio_admin_devices').insert({
        admin_id: params.adminId,
        device_id: params.deviceId,
        browser: params.context.browser,
        os: params.context.os,
        device_type: params.context.device,
        user_agent: params.context.userAgent,
        is_trusted: false
      });

      await triggerSecurityAlert({
        adminId: params.adminId,
        type: 'NEW_DEVICE',
        severity: 'HIGH',
        message: `Login from a new device: ${params.context.browser} on ${params.context.os}`,
        details: { deviceId: params.deviceId, context: params.context }
      });
    } else {
      await supabase
        .from('portfolio_admin_devices')
        .update({ last_login_at: new Date().toISOString() })
        .eq('admin_id', params.adminId)
        .eq('device_id', params.deviceId);
    }

    // C. Country / Impossible travel check
    const { data: lastSuccessfulLogins } = await supabase
      .from('portfolio_admin_logins')
      .select('*')
      .eq('admin_id', params.adminId)
      .eq('status', 'SUCCESS')
      .order('created_at', { ascending: false })
      .limit(5);

    const pastLogins = lastSuccessfulLogins?.filter(l => l.ip_address !== params.context.ip || Math.abs(new Date(l.created_at).getTime() - Date.now()) > 5000) || [];

    if (pastLogins.length > 0) {
      const lastLogin = pastLogins[0];
      
      if (lastLogin.country && params.context.country && lastLogin.country !== params.context.country) {
        await triggerSecurityAlert({
          adminId: params.adminId,
          type: 'NEW_COUNTRY',
          severity: 'HIGH',
          message: `Login from a new country: ${params.context.country} (previously ${lastLogin.country})`,
          details: { current: params.context.country, previous: lastLogin.country }
        });

        const timeDiffMs = Math.abs(Date.now() - new Date(lastLogin.created_at).getTime());
        const timeDiffHours = timeDiffMs / (1000 * 60 * 60);
        
        if (timeDiffHours < 6) {
          await triggerSecurityAlert({
            adminId: params.adminId,
            type: 'IMPOSSIBLE_TRAVEL',
            severity: 'CRITICAL',
            message: `Impossible travel detected: logged in from ${lastLogin.country} (${lastLogin.ip_address}) and then ${params.context.country} (${params.context.ip}) within ${Math.round(timeDiffHours * 10) / 10} hours.`,
            details: {
              previous: { ip: lastLogin.ip_address, country: lastLogin.country, time: lastLogin.created_at },
              current: { ip: params.context.ip, country: params.context.country, time: new Date().toISOString() }
            }
          });
        }
      }
    }

    // D. Multiple simultaneous sessions
    const { count: activeCount } = await supabase
      .from('portfolio_admin_sessions')
      .select('*', { count: 'exact', head: true })
      .eq('admin_id', params.adminId)
      .eq('status', 'ACTIVE');

    if (activeCount && activeCount > 3) {
      await triggerSecurityAlert({
        adminId: params.adminId,
        type: 'MULTIPLE_SESSIONS',
        severity: 'MEDIUM',
        message: `Admin has multiple concurrent active sessions (${activeCount})`,
        details: { activeCount }
      });
    }
  }
}

export async function manageIpRule(ip: string, action: 'BLOCK' | 'WHITELIST' | 'REMOVE', reason?: string) {
  const supabase = await createAdminClient();
  
  if (action === 'REMOVE') {
    await supabase.from('portfolio_rate_limits').delete().eq('ip_address', ip);
  } else if (action === 'BLOCK') {
    await supabase.from('portfolio_rate_limits').upsert({
      ip_address: ip,
      is_blocked: true,
      is_whitelisted: false,
      reason: reason || 'Manual administrative block',
      blocked_until: new Date(Date.now() + 100 * 365 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date().toISOString()
    });
  } else if (action === 'WHITELIST') {
    await supabase.from('portfolio_rate_limits').upsert({
      ip_address: ip,
      is_blocked: false,
      is_whitelisted: true,
      reason: reason || 'Manual administrative whitelist',
      blocked_until: null,
      attempts: 0,
      updated_at: new Date().toISOString()
    });
  }
}

export async function manageDeviceStatus(adminId: string, deviceId: string, action: 'TRUST' | 'UNTRUST' | 'BLOCK' | 'UNBLOCK') {
  const supabase = await createAdminClient();
  
  const updates: any = {};
  if (action === 'TRUST') updates.is_trusted = true;
  if (action === 'UNTRUST') updates.is_trusted = false;
  if (action === 'BLOCK') updates.is_blocked = true;
  if (action === 'UNBLOCK') updates.is_blocked = false;
  
  await supabase.from('portfolio_admin_devices').update(updates).eq('admin_id', adminId).eq('device_id', deviceId);
}

export async function manageAdminLock(adminId: string, action: 'LOCK' | 'UNLOCK', reason?: string) {
  const supabase = await createAdminClient();
  
  if (action === 'LOCK') {
    await supabase.from('portfolio_admin_status').upsert({
      admin_id: adminId,
      is_locked: true,
      locked_reason: reason || 'Locked by administrator',
      locked_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });
    
    // Revoke all active sessions for this admin
    const { expireAllAdmins } = await import('./session-service');
    await expireAllAdmins(adminId);
  } else {
    await supabase.from('portfolio_admin_status').upsert({
      admin_id: adminId,
      is_locked: false,
      locked_reason: null,
      locked_at: null,
      updated_at: new Date().toISOString()
    });
  }
}

export async function managePasswordReset(adminId: string, action: 'FORCE' | 'CLEAR') {
  const supabase = await createAdminClient();
  await supabase.from('portfolio_admin_status').upsert({
    admin_id: adminId,
    force_password_reset: action === 'FORCE',
    updated_at: new Date().toISOString()
  });
}

export async function logAdminAction(params: {
  adminId: string;
  actor: string;
  action: string;
  resourceType: string;
  resourceId?: string;
  details?: any;
}) {
  const supabase = await createAdminClient();
  const context = await getClientContext();
  
  const { error } = await supabase.from('portfolio_audit_logs').insert({
    admin_id: params.adminId,
    actor: params.actor,
    action: params.action,
    resource_type: params.resourceType,
    resource_id: params.resourceId || null,
    ip_address: context.ip,
    location: context.location,
    browser: context.browser,
    os: context.os,
    details: {
      ...context,
      ...(params.details || {})
    }
  });
  
  if (error) console.error('[security-service] logAdminAction error:', error);
}
