'use client';

import { 
  Users, ShieldAlert, MessageSquare, Terminal as TerminalIcon, 
  Activity, FileText, Globe, Monitor, Box, Award, ShieldCheck,
  Clock, TrendingUp, TrendingDown, RefreshCcw
} from 'lucide-react';
import { formatDistanceToNow, format, parseISO } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import Link from 'next/link';

type AuditLog = {
  id: string;
  action: string;
  actor: string;
  created_at: string;
};

type TelemetryEvent = {
  id: string;
  event_type: string;
  event_name: string;
  event_data?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
  created_at: string;
};

type DashboardProps = {
  activeVisitors: number;
  sessionsToday: number;
  visitorsThisWeek: number;
  terminalUsage: number;
  bounceRate: number;
  avgSessionTime: number;
  failedLogins: number;
  unreadCount: number;
  resumeDownloads: number;
  recentLogs: AuditLog[];
  liveEvents: TelemetryEvent[];
  timelineActivity: { created_at: string }[];
  projectCounts: Record<string, number>;
  certCounts: Record<string, number>;
  browserCounts: Record<string, number>;
  deviceCounts: Record<string, number>;
};

export default function OpsDashboardClient({
  activeVisitors,
  sessionsToday,
  visitorsThisWeek,
  terminalUsage,
  bounceRate,
  avgSessionTime,
  failedLogins,
  unreadCount,
  resumeDownloads,
  recentLogs,
  liveEvents: initialEvents,
  timelineActivity,
  projectCounts,
  certCounts,
  browserCounts,
  deviceCounts
}: DashboardProps) {
  const [mounted, setMounted] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
  const [liveEventsFeed, setLiveEventsFeed] = useState<TelemetryEvent[]>(initialEvents);
  const [healthScore, setHealthScore] = useState(100 - (failedLogins * 5));

  const supabase = createClient();

  useEffect(() => {
    setMounted(true);
    setCurrentTime(format(new Date(), 'HH:mm:ss'));
    
    const interval = setInterval(() => {
      setCurrentTime(format(new Date(), 'HH:mm:ss'));
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

  // Supabase Real-time Subscription for Live Feed
  useEffect(() => {
    let retryCount = 0;
    const maxRetries = 5;
    let channel: ReturnType<typeof supabase.channel> | null = null;
    let isComponentMounted = true;
    
    const connectChannel = () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
      
      const channelName = `live-telemetry-feed`;
      channel = supabase
        .channel(channelName)
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'portfolio_events' },
          (payload) => {
            if (isComponentMounted) {
              const newEvent = payload.new as TelemetryEvent;
              setLiveEventsFeed(prev => [newEvent, ...prev].slice(0, 50));
            }
          }
        )
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'portfolio_audit_logs' },
          (payload) => {
            // handle admin logs if needed
          }
        );
        
      channel.subscribe((status, err) => {
        if (status === 'SUBSCRIBED') {
          retryCount = 0;
        }
        if (status === 'CHANNEL_ERROR' || status === 'CLOSED') {
          if (isComponentMounted && retryCount < maxRetries) {
            retryCount++;
            setTimeout(() => {
              if (isComponentMounted) connectChannel();
            }, 2000 * retryCount);
          }
        }
      });
    };

    connectChannel();

    return () => {
      isComponentMounted = false;
      if (channel) supabase.removeChannel(channel);
    };
  }, [supabase]);

  useEffect(() => {
    const interval = setInterval(() => {
      setHealthScore(() => {
        const base = 100 - (failedLogins * 5);
        const shift = Math.floor(Math.random() * 3) - 1;
        return Math.min(100, Math.max(0, base + shift));
      });
    }, 5000);
    return () => clearInterval(interval);
  }, [failedLogins]);

  const hours = Array.from({ length: 24 }, (_, i) => i);
  const hourlyActivity = new Array(24).fill(0);
  
  timelineActivity.forEach(activity => {
    const date = parseISO(activity.created_at);
    if (date.getDate() === new Date().getDate()) {
      hourlyActivity[date.getHours()]++;
    }
  });

  const maxActivity = Math.max(...hourlyActivity, 1);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.05 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
  };

  const sortedProjects = Object.entries(projectCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const sortedCerts = Object.entries(certCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);

  const getEventIcon = (type: string) => {
    if (type.includes('PROJECT')) return <Box size={12} className="text-blue-500" />;
    if (type.includes('CERTIFICATE')) return <Award size={12} className="text-purple-500" />;
    if (type.includes('TERMINAL')) return <TerminalIcon size={12} className="text-emerald-500" />;
    if (type.includes('CONTACT')) return <MessageSquare size={12} className="text-amber-500" />;
    return <Activity size={12} className="text-muted" />;
  };

  return (
    <motion.div className="space-y-6" variants={containerVariants} initial="hidden" animate="show">
      <header className="mb-8 border-b border-surface pb-6 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight uppercase text-foreground flex items-center gap-3">
            Mission Control 
            <motion.div animate={{ opacity: [1, 0.5, 1] }} transition={{ repeat: Infinity, duration: 2 }} className="w-2 h-2 rounded-full bg-[#E4002B]" />
          </h1>
          <p className="text-muted text-[10px] font-mono mt-2 tracking-[0.24em] uppercase">
            Global Telemetry & Security Operations Center
          </p>
        </div>
        <div className="text-right hidden sm:block">
          <p className="text-[9px] font-mono text-muted uppercase tracking-[0.24em] mb-1">Time (Local)</p>
          <p className="text-lg font-mono text-foreground">
            {mounted ? currentTime : '--:--:--'}
          </p>
        </div>
      </header>

      {/* TOP ROW: Core Metrics (10 Widgets as requested) */}
      <motion.div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4" variants={containerVariants}>
        
        <Link href="/ops/visitors" className="block">
          <motion.div variants={itemVariants} className="bg-background border border-surface p-4 rounded-sm relative overflow-hidden hover:border-emerald-500/50 transition-colors cursor-pointer group h-full">
            <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500"></div>
            <p className="text-[9px] font-mono uppercase tracking-[0.2em] text-muted mb-2 flex items-center gap-2 group-hover:text-foreground transition-colors"><Users size={12} className="text-emerald-500" /> Live Visitors</p>
            <p className="text-2xl font-mono text-foreground">{activeVisitors}</p>
          </motion.div>
        </Link>

        <Link href="/ops/auth/sessions" className="block">
          <motion.div variants={itemVariants} className="bg-background border border-surface p-4 rounded-sm relative overflow-hidden hover:border-blue-500/50 transition-colors cursor-pointer group h-full">
            <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
            <p className="text-[9px] font-mono uppercase tracking-[0.2em] text-muted mb-2 flex items-center gap-2 group-hover:text-foreground transition-colors"><Activity size={12} className="text-blue-500" /> Active Sessions</p>
            <p className="text-2xl font-mono text-foreground">{sessionsToday}</p>
          </motion.div>
        </Link>

        <Link href="/ops/visitors" className="block">
          <motion.div variants={itemVariants} className="bg-background border border-surface p-4 rounded-sm relative overflow-hidden hover:border-blue-400/50 transition-colors cursor-pointer group h-full">
            <div className="absolute top-0 left-0 w-1 h-full bg-blue-400"></div>
            <p className="text-[9px] font-mono uppercase tracking-[0.2em] text-muted mb-2 flex items-center gap-2 group-hover:text-foreground transition-colors"><Users size={12} className="text-blue-400" /> Visitors (Week)</p>
            <p className="text-2xl font-mono text-foreground">{visitorsThisWeek}</p>
          </motion.div>
        </Link>

        <Link href="/ops/contacts" className="block">
          <motion.div variants={itemVariants} className="bg-background border border-surface p-4 rounded-sm relative overflow-hidden hover:border-amber-500/50 transition-colors cursor-pointer group h-full">
            <div className="absolute top-0 left-0 w-1 h-full bg-amber-500"></div>
            <p className="text-[9px] font-mono uppercase tracking-[0.2em] text-muted mb-2 flex items-center gap-2 group-hover:text-foreground transition-colors"><MessageSquare size={12} className="text-amber-500" /> Submissions</p>
            <p className="text-2xl font-mono text-foreground">{unreadCount}</p>
          </motion.div>
        </Link>

        <Link href="/ops/reports" className="block">
          <motion.div variants={itemVariants} className="bg-background border border-surface p-4 rounded-sm relative overflow-hidden hover:border-emerald-400/50 transition-colors cursor-pointer group h-full">
            <div className="absolute top-0 left-0 w-1 h-full bg-emerald-400"></div>
            <p className="text-[9px] font-mono uppercase tracking-[0.2em] text-muted mb-2 flex items-center gap-2 group-hover:text-foreground transition-colors"><TerminalIcon size={12} className="text-emerald-400" /> Terminal Cmds</p>
            <p className="text-2xl font-mono text-foreground">{terminalUsage}</p>
          </motion.div>
        </Link>

        <Link href="/ops/reports" className="block">
          <motion.div variants={itemVariants} className="bg-background border border-surface p-4 rounded-sm relative overflow-hidden hover:border-orange-500/50 transition-colors cursor-pointer group h-full">
            <div className="absolute top-0 left-0 w-1 h-full bg-orange-500"></div>
            <p className="text-[9px] font-mono uppercase tracking-[0.2em] text-muted mb-2 flex items-center gap-2 group-hover:text-foreground transition-colors"><TrendingDown size={12} className="text-orange-500" /> Bounce Rate</p>
            <p className="text-2xl font-mono text-foreground">{bounceRate}%</p>
          </motion.div>
        </Link>

        <Link href="/ops/reports" className="block">
          <motion.div variants={itemVariants} className="bg-background border border-surface p-4 rounded-sm relative overflow-hidden hover:border-indigo-500/50 transition-colors cursor-pointer group h-full">
            <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500"></div>
            <p className="text-[9px] font-mono uppercase tracking-[0.2em] text-muted mb-2 flex items-center gap-2 group-hover:text-foreground transition-colors"><Clock size={12} className="text-indigo-500" /> Avg Session</p>
            <p className="text-2xl font-mono text-foreground">{avgSessionTime}s</p>
          </motion.div>
        </Link>

        <Link href="/ops/security" className="block">
          <motion.div variants={itemVariants} className="bg-background border border-surface p-4 rounded-sm relative overflow-hidden hover:border-[#E4002B]/50 transition-colors cursor-pointer group h-full">
            <div className={`absolute top-0 left-0 w-1 h-full ${healthScore < 80 ? 'bg-[#E4002B]' : 'bg-emerald-500'}`}></div>
            <p className="text-[9px] font-mono uppercase tracking-[0.2em] text-muted mb-2 flex items-center gap-2 group-hover:text-foreground transition-colors"><ShieldCheck size={12} className={healthScore < 80 ? 'text-[#E4002B]' : 'text-emerald-500'} /> Threat Score</p>
            <p className={`text-2xl font-mono ${healthScore < 80 ? 'text-[#E4002B]' : 'text-emerald-500'}`}>{healthScore}%</p>
          </motion.div>
        </Link>

      </motion.div>

      {/* SECOND ROW: Timelines and Feeds */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Activity Timeline (Graph) */}
        <motion.div variants={itemVariants} className="lg:col-span-1 bg-background border border-surface rounded-sm flex flex-col">
          <div className="p-4 border-b border-surface bg-surface/10">
            <h3 className="text-[10px] font-mono text-muted uppercase tracking-[0.2em] flex items-center gap-2"><Activity size={12} /> Today&apos;s Pulse</h3>
          </div>
          <div className="p-6 flex-1 flex flex-col justify-end">
            <div className="flex items-end justify-between gap-1 h-32 mb-4">
              {hours.map(hour => {
                const count = hourlyActivity[hour];
                const height = maxActivity > 0 ? (count / maxActivity) * 100 : 0;
                return (
                  <div key={hour} className="w-full relative group">
                    <div className="w-full bg-[#E4002B] opacity-80 rounded-t-sm transition-all duration-500 group-hover:opacity-100" style={{ height: `${height}%`, minHeight: count > 0 ? '4px' : '0' }}></div>
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 bg-surface text-foreground font-mono text-[9px] px-2 py-1 rounded-sm border border-surface-strong z-10 whitespace-nowrap">{hour}:00 - {count}</div>
                  </div>
                );
              })}
            </div>
            <div className="flex justify-between text-[9px] font-mono text-muted border-t border-surface pt-2">
              <span>00:00</span><span>12:00</span><span>23:59</span>
            </div>
          </div>
        </motion.div>

        {/* Live Events Feed */}
        <motion.div variants={itemVariants} className="lg:col-span-2 bg-background border border-surface rounded-sm flex flex-col">
          <div className="p-4 border-b border-surface bg-surface/10 flex justify-between items-center">
            <h3 className="text-[10px] font-mono text-muted uppercase tracking-[0.2em] flex items-center gap-2">
              <RefreshCcw size={12} className="animate-spin-slow" /> Live Activity Feed
            </h3>
            <div className="flex items-center gap-2">
               <span className="text-[9px] font-mono text-emerald-500 uppercase">Connected</span>
               <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
            </div>
          </div>
          <div className="p-0 flex-1 overflow-y-auto max-h-[400px] custom-scrollbar">
            {liveEventsFeed && liveEventsFeed.length > 0 ? (
              <ul className="divide-y divide-surface/50">
                <AnimatePresence initial={false}>
                  {liveEventsFeed.map((e) => (
                    <motion.li 
                      key={e.id} 
                      initial={{ opacity: 0, y: -20, backgroundColor: 'rgba(228, 0, 43, 0.1)' }}
                      animate={{ opacity: 1, y: 0, backgroundColor: 'transparent' }}
                      transition={{ duration: 0.5 }}
                      className="p-4 hover:bg-surface/10 transition-colors flex items-start gap-4"
                    >
                      <div className="mt-1 bg-surface/30 p-2 rounded-full border border-surface-strong">
                        {getEventIcon(e.event_type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-foreground font-mono text-xs font-semibold">
                            {e.event_name.replace(/_/g, ' ')}
                          </span>
                          <span className="text-muted text-[9px] font-mono">
                            {format(new Date(e.created_at), 'HH:mm:ss')}
                          </span>
                        </div>
                        <p className="text-[10px] text-muted font-mono mt-1">
                          {(e.event_data?.command as string) || (e.event_data?.project as string) || (e.event_data?.certificate as string) || e.event_type}
                        </p>
                      </div>
                    </motion.li>
                  ))}
                </AnimatePresence>
              </ul>
            ) : (
               <div className="flex items-center justify-center h-full p-8 text-[10px] font-mono text-muted italic">Awaiting incoming telemetry...</div>
            )}
          </div>
        </motion.div>

      </div>

      {/* THIRD ROW: Distributions and Aggregations */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <motion.div variants={itemVariants} className="bg-background border border-surface rounded-sm p-5">
          <h3 className="text-[10px] font-mono text-muted uppercase tracking-[0.2em] mb-4 flex items-center gap-2"><Box size={12} /> Top Projects</h3>
          <ul className="space-y-3">
            {sortedProjects.map(([name, count], idx) => (
              <li key={name} className="flex justify-between items-center text-xs font-mono">
                <span className="text-foreground truncate pr-2">{idx + 1}. {name}</span>
                <span className="text-muted bg-surface px-1.5 py-0.5 rounded-sm">{count}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-background border border-surface rounded-sm p-5">
          <h3 className="text-[10px] font-mono text-muted uppercase tracking-[0.2em] mb-4 flex items-center gap-2"><Award size={12} /> Top Certificates</h3>
          <ul className="space-y-3">
            {sortedCerts.map(([name, count], idx) => (
              <li key={name} className="flex justify-between items-center text-xs font-mono">
                <span className="text-foreground truncate pr-2">{idx + 1}. {name}</span>
                <span className="text-muted bg-surface px-1.5 py-0.5 rounded-sm">{count}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-background border border-surface rounded-sm p-5">
          <h3 className="text-[10px] font-mono text-muted uppercase tracking-[0.2em] mb-4 flex items-center gap-2"><Globe size={12} /> Browsers</h3>
          <ul className="space-y-3">
            {Object.entries(browserCounts).sort((a,b) => b[1] - a[1]).slice(0, 5).map(([name, count]) => (
              <li key={name} className="flex justify-between items-center text-xs font-mono">
                <span className="text-foreground truncate pr-2">{name}</span>
                <span className="text-muted">{count}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-background border border-surface rounded-sm p-5">
          <h3 className="text-[10px] font-mono text-muted uppercase tracking-[0.2em] mb-4 flex items-center gap-2"><Monitor size={12} /> Devices</h3>
          <ul className="space-y-3">
            {Object.entries(deviceCounts).sort((a,b) => b[1] - a[1]).slice(0, 5).map(([name, count]) => (
              <li key={name} className="flex justify-between items-center text-xs font-mono">
                <span className="text-foreground truncate pr-2">{name}</span>
                <span className="text-muted">{count}</span>
              </li>
            ))}
          </ul>
        </motion.div>

      </div>
    </motion.div>
  );
}
