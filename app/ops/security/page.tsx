import { createClient, createAdminClient } from '@/utils/supabase/server';
import SecurityClient from './SecurityClient';
import os from 'os';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export type SystemDetails = {
  server: string;
  os: string;
  node: string;
  runtime: string;
  environment: string;
  cpu: string;
  memory: string;
  uptime: string;
  build: string;
};

export type SuspiciousActor = {
  visitorId: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  rulesBroken: string[];
  eventCount: number;
  lastSeen: string;
};

export type FailedLoginChain = {
  ip: string;
  country: string;
  browser: string;
  device: string;
  attempts: number;
  lastAttempt: string;
};

export default async function OpsSecurity() {
  const supabase = await createClient();
  const supabaseAdmin = await createAdminClient();

  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

  // 1. Fetch Audit Logs
  const { data: logs } = await supabaseAdmin
    .from('portfolio_audit_logs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(500);

  // 2. Fetch Active Admin Sessions
  const { data: activeSessions } = await supabaseAdmin
    .from('portfolio_admin_sessions')
    .select('*')
    .eq('is_revoked', false)
    .gt('expires_at', new Date().toISOString())
    .order('last_activity_at', { ascending: false });

  // 3. Fetch Registered Devices
  const { data: devices } = await supabaseAdmin
    .from('portfolio_admin_devices')
    .select('*')
    .order('last_login_at', { ascending: false });

  // 4. Fetch Security Alerts
  const { data: alerts } = await supabaseAdmin
    .from('portfolio_security_alerts')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100);

  // 5. Fetch IP Rules (Blocked/Whitelisted)
  const { data: ipRules } = await supabaseAdmin
    .from('portfolio_rate_limits')
    .select('*')
    .or('is_blocked.eq.true,is_whitelisted.eq.true')
    .order('updated_at', { ascending: false });

  // 6. Fetch Admins
  let adminsList: any[] = [];
  try {
    const { data: { users } } = await supabaseAdmin.auth.admin.listUsers();
    
    const { data: userRoles } = await supabaseAdmin.from('portfolio_user_roles').select('admin_id, portfolio_roles(name)');
    const rolesMap = (userRoles || []).reduce((acc: any, r: any) => {
      acc[r.admin_id] = r.portfolio_roles?.name || 'viewer';
      return acc;
    }, {});

    const { data: statusList } = await supabaseAdmin.from('portfolio_admin_status').select('*');
    const statusMap = (statusList || []).reduce((acc: any, s: any) => {
      acc[s.admin_id] = s;
      return acc;
    }, {});

    adminsList = (users || []).map((u: any) => ({
      id: u.id,
      email: u.email,
      role: rolesMap[u.id] || 'viewer',
      is_locked: statusMap[u.id]?.is_locked || false,
      locked_reason: statusMap[u.id]?.locked_reason || null,
      locked_at: statusMap[u.id]?.locked_at || null,
      force_password_reset: statusMap[u.id]?.force_password_reset || false
    }));
  } catch (err) {
    console.error('[OpsSecurity] Error fetching admins:', err);
  }

  // Fetch all events from the last 24h
  const { data: recentEvents } = await supabaseAdmin
    .from('portfolio_events')
    .select('*')
    .gte('created_at', twentyFourHoursAgo);

  const { getCount } = await import('@/lib/session-service');
  const failedLogins = await getCount('portfolio_audit_logs', { action: 'FAILED_LOGIN' });
  const successfulLogins = await getCount('portfolio_audit_logs', { action: 'SUCCESSFUL_LOGIN' });

  // Parse Failed Login Chains
  const failedLoginChains: Record<string, FailedLoginChain> = {};
  logs?.filter(l => l.action === 'FAILED_LOGIN').forEach(log => {
    const ip = log.details?.ip || log.ip_address || 'Unknown IP';
    const browser = log.details?.browser || log.browser || 'Unknown';
    const device = log.details?.device || log.device || 'Unknown';
    const country = log.details?.country || log.location || 'Unknown';
    
    if (!failedLoginChains[ip]) {
      failedLoginChains[ip] = { ip, country, browser, device, attempts: 0, lastAttempt: log.created_at };
    }
    failedLoginChains[ip].attempts += 1;
    if (new Date(log.created_at) > new Date(failedLoginChains[ip].lastAttempt)) {
      failedLoginChains[ip].lastAttempt = log.created_at;
    }
  });

  const failedChainsArray = Object.values(failedLoginChains).sort((a, b) => b.attempts - a.attempts);

  // Threat Detection Engine
  const suspiciousActorsMap: Record<string, SuspiciousActor> = {};
  
  if (recentEvents) {
    const eventsByVisitor = recentEvents.reduce((acc, event) => {
      if (!acc[event.visitor_id]) acc[event.visitor_id] = [];
      acc[event.visitor_id].push(event);
      return acc;
    }, {} as Record<string, any[]>);

    for (const [visitorId, rawEvents] of Object.entries(eventsByVisitor)) {
      const events = rawEvents as any[];
      const rulesBroken: string[] = [];
      let severityPoints = 0;

      const contacts = events.filter((e: any) => e.event_type === 'CONTACT_SUBMIT').length;
      if (contacts > 3) {
        rulesBroken.push(`Spam Contact Submissions (${contacts})`);
        severityPoints += 20;
      }

      const terminalCmds = events.filter((e: any) => e.event_type === 'TERMINAL_COMMAND').length;
      if (terminalCmds > 50) {
        rulesBroken.push(`Excessive Terminal Commands (${terminalCmds})`);
        severityPoints += 10;
      }

      if (events.length > 200) {
        rulesBroken.push(`Too Many Requests (${events.length})`);
        severityPoints += 15;
      }

      if (rulesBroken.length > 0) {
        let severity: 'Low' | 'Medium' | 'High' | 'Critical' = 'Low';
        if (severityPoints >= 30) severity = 'Critical';
        else if (severityPoints >= 20) severity = 'High';
        else if (severityPoints >= 10) severity = 'Medium';

        suspiciousActorsMap[visitorId] = {
          visitorId,
          severity,
          rulesBroken,
          eventCount: events.length,
          lastSeen: events.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0].created_at
        };
      }
    }
  }

  const suspiciousActors = Object.values(suspiciousActorsMap).sort((a: SuspiciousActor, b: SuspiciousActor) => {
    const sMap = { 'Critical': 4, 'High': 3, 'Medium': 2, 'Low': 1 };
    return sMap[b.severity] - sMap[a.severity];
  });

  const systemDetails: SystemDetails = {
    server: os.hostname(),
    os: `${os.type()} ${os.release()} (${os.arch()})`,
    node: process.version,
    runtime: 'Node.js',
    environment: process.env.NODE_ENV || 'production',
    cpu: os.cpus()[0]?.model || 'Unknown CPU',
    memory: `${Math.round(os.totalmem() / (1024 ** 3))}GB Total`,
    uptime: `${Math.round(os.uptime() / 3600)} Hours`,
    build: 'v2.1.0-stable'
  };

  return (
    <SecurityClient 
      logs={logs || []}
      failedLogins={failedLogins || 0}
      successfulLogins={successfulLogins || 0}
      blockedIPs={ipRules?.filter(r => r.is_blocked).length || 0}
      rlsEnabled={true} 
      failedLoginChains={failedChainsArray}
      suspiciousActors={suspiciousActors}
      systemDetails={systemDetails}
      activeSessions={activeSessions || []}
      devices={devices || []}
      alerts={alerts || []}
      ipRules={ipRules || []}
      admins={adminsList}
    />
  );
}
