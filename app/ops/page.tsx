import { createClient } from '@/utils/supabase/server';
import OpsDashboardClient from './OpsDashboardClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function OpsOverview() {
  const supabase = await createClient();
  
  // Date Helpers
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
  const startOfWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const fiveMinsAgo = new Date(now.getTime() - 5 * 60000).toISOString();

  // Top Row Metrics
  // 1. Active Visitors (visitors with last_visit within 5 mins)
  const { count: activeVisitors } = await supabase
    .from('portfolio_visitors')
    .select('*', { count: 'exact', head: true })
    .gte('last_visit', fiveMinsAgo);

  // 2. Sessions Today
  const { count: sessionsToday } = await supabase
    .from('portfolio_sessions')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', startOfDay);

  // Visitors This Week
  const { count: visitorsThisWeek } = await supabase
    .from('portfolio_visitors')
    .select('*', { count: 'exact', head: true })
    .gte('first_visit', startOfWeek);

  // Terminal Usage (total commands)
  const { count: terminalUsage } = await supabase
    .from('portfolio_events')
    .select('*', { count: 'exact', head: true })
    .eq('event_type', 'TERMINAL_COMMAND');

  // Bounce Rate & Avg Session Time
  const { data: allSessions } = await supabase
    .from('portfolio_sessions')
    .select('bounced, duration')
    .order('created_at', { ascending: false })
    .limit(1000);
    
  let bounceRate = 0;
  let avgSessionTime = 0;
  if (allSessions && allSessions.length > 0) {
    const bounces = allSessions.filter(s => s.bounced).length;
    bounceRate = Math.round((bounces / allSessions.length) * 100);
    const totalDuration = allSessions.reduce((acc, s) => acc + (s.duration || 0), 0);
    avgSessionTime = Math.round(totalDuration / allSessions.length);
  }

  // 3. Security Status / Failed Logins
  const { count: failedLogins } = await supabase
    .from('portfolio_audit_logs')
    .select('*', { count: 'exact', head: true })
    .eq('action', 'FAILED_LOGIN')
    .gte('created_at', startOfDay);

  // 4. Contact Submissions
  const { count: unreadCount } = await supabase
    .from('portfolio_contacts')
    .select('*', { count: 'exact', head: true })
    .is('deleted_at', null);

  // 5. Resume Downloads
  const { count: resumeDownloads } = await supabase
    .from('portfolio_events')
    .select('*', { count: 'exact', head: true })
    .eq('event_type', 'RESUME_DOWNLOAD');

  // Second Row
  // 1. Visitor Activity Timeline (We'll grab today's events + page views and process them on the client)
  const { data: todaysEvents } = await supabase
    .from('portfolio_events')
    .select('created_at')
    .gte('created_at', startOfDay);
    
  const { data: todaysPageViews } = await supabase
    .from('portfolio_page_views')
    .select('created_at')
    .gte('created_at', startOfDay);

  const timelineActivity = [...(todaysEvents || []), ...(todaysPageViews || [])];

  // 2. Recent Security Events
  const { data: recentLogs } = await supabase
    .from('portfolio_audit_logs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5);

  // 3. Live Events Feed
  const { data: liveEvents } = await supabase
    .from('portfolio_events')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(20);

  // Third Row
  // 1. Most Viewed Projects
  const { data: projectEvents } = await supabase
    .from('portfolio_events')
    .select('metadata')
    .eq('event_type', 'PROJECT_OPEN');
    
  // 2. Most Viewed Certificates
  const { data: certEvents } = await supabase
    .from('portfolio_events')
    .select('metadata')
    .in('event_type', ['CERTIFICATE_OPEN', 'CERTIFICATE_VERIFY']);

  // 3 & 4. Browser and Device Distribution
  const { data: visitors } = await supabase
    .from('portfolio_visitors')
    .select('browser, device_type');

  const projectCounts: Record<string, number> = {};
  projectEvents?.forEach((e: { metadata: Record<string, unknown> }) => {
    const p = (e.metadata?.project || e.metadata?.certificate || 'Unknown') as string;
    projectCounts[p] = (projectCounts[p] || 0) + 1;
  });

  const certCounts: Record<string, number> = {};
  certEvents?.forEach((e: { metadata: Record<string, unknown> }) => {
    const c = (e.metadata?.certificate || e.metadata?.title || 'Unknown') as string;
    certCounts[c] = (certCounts[c] || 0) + 1;
  });

  const browserCounts: Record<string, number> = {};
  const deviceCounts: Record<string, number> = {};
  visitors?.forEach((v: { browser: string | null; device_type: string | null }) => {
    browserCounts[v.browser || 'Unknown'] = (browserCounts[v.browser || 'Unknown'] || 0) + 1;
    deviceCounts[v.device_type || 'Unknown'] = (deviceCounts[v.device_type || 'Unknown'] || 0) + 1;
  });

  return (
    <OpsDashboardClient 
      activeVisitors={activeVisitors || 0}
      sessionsToday={sessionsToday || 0}
      visitorsThisWeek={visitorsThisWeek || 0}
      terminalUsage={terminalUsage || 0}
      bounceRate={bounceRate}
      avgSessionTime={avgSessionTime}
      failedLogins={failedLogins || 0}
      unreadCount={unreadCount || 0}
      resumeDownloads={resumeDownloads || 0}
      recentLogs={recentLogs || []}
      liveEvents={liveEvents || []}
      timelineActivity={timelineActivity}
      projectCounts={projectCounts}
      certCounts={certCounts}
      browserCounts={browserCounts}
      deviceCounts={deviceCounts}
    />
  );
}
