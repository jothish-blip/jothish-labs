import { NextResponse } from 'next/server';
import { createAdminClient } from '@/utils/supabase/server';
import { getActiveVisitors, getActiveAdmins, getCount } from '@/lib/session-service';

export async function GET() {
  try {
    const supabase = await createAdminClient();
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay())).toISOString();

    const [
      activeVisitors,
      activeAdminSessionsRes,
      sessionsToday,
      visitorsThisWeek,
      terminalUsage,
      failedLogins,
      unreadCount,
      resumeDownloads
    ] = await Promise.all([
      getActiveVisitors(),
      getActiveAdmins(),
      getCount('portfolio_sessions', {}, { created_at: startOfDay }),
      getCount('portfolio_visitors', {}, { first_visit: startOfWeek }),
      getCount('portfolio_events', { event_type: 'TERMINAL_COMMAND' }),
      getCount('portfolio_audit_logs', { action: 'FAILED_LOGIN' }, { created_at: startOfDay }),
      getCount('portfolio_contacts', { deleted_at: null }),
      getCount('portfolio_events', { event_type: 'RESUME_DOWNLOAD' })
    ]);

    const [
      allSessionsRes,
      todaysEventsRes,
      todaysPageViewsRes,
      recentLogsRes,
      liveEventsRes,
      projectEventsRes,
      certEventsRes,
      visitorsRes,
    ] = await Promise.all([
      supabase.from('portfolio_sessions').select('bounced, duration').order('created_at', { ascending: false }).limit(1000),
      supabase.from('portfolio_events').select('created_at').gte('created_at', startOfDay),
      supabase.from('portfolio_page_views').select('created_at').gte('created_at', startOfDay),
      supabase.from('portfolio_audit_logs').select('*').order('created_at', { ascending: false }).limit(5),
      supabase.from('portfolio_events').select('*').order('created_at', { ascending: false }).limit(20),
      supabase.from('portfolio_events').select('event_data').eq('event_type', 'PROJECT_OPEN'),
      supabase.from('portfolio_events').select('event_data').in('event_type', ['CERTIFICATE_OPEN', 'CERTIFICATE_VERIFY']),
      supabase.from('portfolio_visitors').select('browser, device_type')
    ]);

    const allSessions = allSessionsRes.data || [];
    let bounceRate = 0;
    let avgSessionTime = 0;
    if (allSessions.length > 0) {
      const bounces = allSessions.filter(s => s.bounced).length;
      bounceRate = Math.round((bounces / allSessions.length) * 100);
      const totalDuration = allSessions.reduce((acc, s) => acc + (s.duration || 0), 0);
      avgSessionTime = Math.round(totalDuration / allSessions.length);
    }

    const timelineActivity = [...(todaysEventsRes.data || []), ...(todaysPageViewsRes.data || [])];

    const projectCounts: Record<string, number> = {};
    (projectEventsRes.data || []).forEach(e => {
      const p = e.event_data?.project || e.event_data?.certificate || 'Unknown';
      projectCounts[p] = (projectCounts[p] || 0) + 1;
    });

    const certCounts: Record<string, number> = {};
    (certEventsRes.data || []).forEach(e => {
      const c = e.event_data?.certificate || e.event_data?.title || 'Unknown';
      certCounts[c] = (certCounts[c] || 0) + 1;
    });

    const browserCounts: Record<string, number> = {};
    const deviceCounts: Record<string, number> = {};
    (visitorsRes.data || []).forEach(v => {
      browserCounts[v.browser || 'Unknown'] = (browserCounts[v.browser || 'Unknown'] || 0) + 1;
      deviceCounts[v.device_type || 'Unknown'] = (deviceCounts[v.device_type || 'Unknown'] || 0) + 1;
    });

    return NextResponse.json({
      activeAdminSessions: activeAdminSessionsRes.count,
      activeVisitors: activeVisitors.count,
      sessionsToday,
      visitorsThisWeek,
      terminalUsage,
      bounceRate,
      avgSessionTime,
      failedLogins,
      unreadCount,
      resumeDownloads,
      recentLogs: recentLogsRes.data || [],
      liveEvents: liveEventsRes.data || [],
      timelineActivity,
      projectCounts,
      certCounts,
      browserCounts,
      deviceCounts
    });
  } catch (error) {
    console.error('[Metrics API] Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
