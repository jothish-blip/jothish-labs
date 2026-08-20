import { createClient } from '@/utils/supabase/server';
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

  // eslint-disable-next-line react-hooks/purity
  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

  // Fetch recent audit logs
  const { data: logs } = await supabase
    .from('portfolio_audit_logs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100);

  // Fetch all events from the last 24h
  const { data: recentEvents } = await supabase
    .from('portfolio_events')
    .select('*')
    .gte('created_at', twentyFourHoursAgo);

  const { getCount } = await import('@/lib/session-service');
  const failedLogins = await getCount('portfolio_audit_logs', { action: 'FAILED_LOGIN' });
  const successfulLogins = await getCount('portfolio_audit_logs', { action: 'SUCCESSFUL_LOGIN' });

  // Parse Failed Login Chains
  const failedLoginChains: Record<string, FailedLoginChain> = {};
  logs?.filter(l => l.action === 'FAILED_LOGIN').forEach(log => {
    // Try to extract IP/Browser from details
    const ip = log.details?.ip || 'Unknown IP';
    const browser = log.details?.browser || 'Unknown';
    const device = log.details?.device || 'Unknown';
    const country = log.details?.country || 'Unknown';
    
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
    }, {} as Record<string, Record<string, unknown>[]>);

    for (const [visitorId, rawEvents] of Object.entries(eventsByVisitor)) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const events = rawEvents as any[];
      const rulesBroken: string[] = [];
      let severityPoints = 0;

      // Rule 1: Spam Contact
      const contacts = events.filter(e => e.event_type === 'CONTACT_SUBMIT').length;
      if (contacts > 3) {
        rulesBroken.push(`Spam Contact Submissions (${contacts})`);
        severityPoints += 20;
      }

      // Rule 2: Excessive Terminal
      const terminalCmds = events.filter(e => e.event_type === 'TERMINAL_COMMAND').length;
      if (terminalCmds > 50) {
        rulesBroken.push(`Excessive Terminal Commands (${terminalCmds})`);
        severityPoints += 10;
      }

      // Rule 3: Rapid Navigation / Bot Behavior
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
          lastSeen: events.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0].created_at
        };
      }
    }
  }

  const suspiciousActors = Object.values(suspiciousActorsMap).sort((a, b) => {
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
      blockedIPs={failedChainsArray.filter(c => c.attempts > 5).length} // Simulate blocks for > 5 attempts
      rlsEnabled={true} 
      failedLoginChains={failedChainsArray}
      suspiciousActors={suspiciousActors}
      systemDetails={systemDetails}
    />
  );
}
