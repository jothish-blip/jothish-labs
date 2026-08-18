import { createAdminClient } from '@/utils/supabase/server';
import ReportsClient from './ReportsClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function OpsReports() {
  const supabaseAdmin = await createAdminClient();

  const now = new Date();
  const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();

  // 1. Daily Visitor Report (last 24h)
  const { data: dailyVisitors } = await supabaseAdmin
    .from('portfolio_sessions')
    .select('id, visitor_id, created_at, referrer')
    .gte('created_at', oneDayAgo);

  // 2. Weekly Security Summary
  const { data: weeklySecurity } = await supabaseAdmin
    .from('portfolio_audit_logs')
    .select('action, created_at')
    .gte('created_at', sevenDaysAgo)
    .in('action', ['FAILED_LOGIN', 'MFA_REQUIRED', 'BLOCK_IP']);

  const failedLoginsWeekly = weeklySecurity?.filter(l => l.action === 'FAILED_LOGIN').length || 0;
  const blockedIPsWeekly = weeklySecurity?.filter(l => l.action === 'BLOCK_IP').length || 0;

  // 3. Monthly Analytics (Total Sessions)
  const { count: monthlySessionsCount } = await supabaseAdmin
    .from('portfolio_sessions')
    .select('id', { count: 'exact', head: true })
    .gte('created_at', thirtyDaysAgo);

  // 4. Contact Statistics (All time)
  const { data: contacts } = await supabaseAdmin
    .from('portfolio_contacts')
    .select('intent, status');
  
  const contactStats = (contacts || []).reduce((acc: Record<string, number>, curr) => {
    acc.total = (acc.total || 0) + 1;
    acc[curr.intent] = (acc[curr.intent] || 0) + 1;
    if (curr.status === 'unread') acc.unread = (acc.unread || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // 5. Top Projects & Resume Downloads (All time)
  const { data: events } = await supabaseAdmin
    .from('portfolio_events')
    .select('event_type, event_name, event_data');

  let resumeDownloads = 0;
  const projectViews: Record<string, number> = {};

  if (events) {
    events.forEach(e => {
      if (e.event_type === 'RESUME_DOWNLOAD') {
        resumeDownloads++;
      } else if (e.event_type === 'PROJECT_OPEN') {
        const projName = e.event_name || e.event_data?.project;
        if (projName) {
          projectViews[projName] = (projectViews[projName] || 0) + 1;
        }
      }
    });
  }

  const topProjects = Object.entries(projectViews)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([name, views]) => ({ name, views }));

  const reportData = {
    generatedAt: now.toISOString(),
    daily: {
      visitors: dailyVisitors?.length || 0,
      uniqueVisitors: new Set(dailyVisitors?.map(v => v.visitor_id)).size,
    },
    weekly: {
      failedLogins: failedLoginsWeekly,
      blockedIPs: blockedIPsWeekly,
    },
    monthly: {
      totalSessions: monthlySessionsCount || 0,
    },
    contacts: contactStats,
    topProjects,
    resumeDownloads
  };

  return <ReportsClient reportData={reportData} />;
}
