'use client';

import { 
  Users, ShieldAlert, MessageSquare, Terminal as TerminalIcon, 
  Activity, FileText, Globe, Monitor, Box, Award, ShieldCheck
} from 'lucide-react';
import { formatDistanceToNow, format, parseISO } from 'date-fns';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

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
  event_data: Record<string, unknown>;
  metadata?: Record<string, unknown>;
  created_at: string;
};

type DashboardProps = {
  activeVisitors: number;
  sessionsToday: number;
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
  failedLogins,
  unreadCount,
  resumeDownloads,
  recentLogs,
  liveEvents,
  timelineActivity,
  projectCounts,
  certCounts,
  browserCounts,
  deviceCounts
}: DashboardProps) {
  const [mounted, setMounted] = useState(false);
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    setCurrentTime(format(new Date(), 'HH:mm:ss'));
    
    const interval = setInterval(() => {
      setCurrentTime(format(new Date(), 'HH:mm:ss'));
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

  // Simulate live health score fluctuation
  const [healthScore, setHealthScore] = useState(100 - (failedLogins * 5));
  
  useEffect(() => {
    const interval = setInterval(() => {
      setHealthScore(() => {
        const base = 100 - (failedLogins * 5);
        const shift = Math.floor(Math.random() * 3) - 1; // -1, 0, or 1
        return Math.min(100, Math.max(0, base + shift));
      });
    }, 5000);
    return () => clearInterval(interval);
  }, [failedLogins]);

  // Process Timeline Activity into Hourly Bins
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const hourlyActivity = new Array(24).fill(0);
  
  timelineActivity.forEach(activity => {
    const date = parseISO(activity.created_at);
    if (date.getDate() === new Date().getDate()) {
      hourlyActivity[date.getHours()]++;
    }
  });

  const maxActivity = Math.max(...hourlyActivity, 1); // Avoid div by 0

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const itemVariants: import('framer-motion').Variants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
  };

  const sortedProjects = Object.entries(projectCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const sortedCerts = Object.entries(certCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);

  return (
    <motion.div 
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      <header className="mb-8 border-b border-surface pb-6 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight uppercase text-foreground flex items-center gap-3">
            Mission Control 
            <motion.div 
              animate={{ opacity: [1, 0.5, 1] }} 
              transition={{ repeat: Infinity, duration: 2 }}
              className="w-2 h-2 rounded-full bg-[#E4002B]"
            />
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

      {/* TOP ROW: Core Metrics (6 columns) */}
      <motion.div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4" variants={containerVariants}>
        
        {/* Active Visitors */}
        <motion.div variants={itemVariants} className="bg-background border border-surface p-5 rounded-sm relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500"></div>
          <p className="text-[9px] font-mono uppercase tracking-[0.2em] text-muted mb-4 flex items-center gap-2">
            <Users size={12} className="text-emerald-500" /> Active Visitors
          </p>
          <p className="text-3xl font-mono text-foreground">{activeVisitors}</p>
        </motion.div>

        {/* Sessions Today */}
        <motion.div variants={itemVariants} className="bg-background border border-surface p-5 rounded-sm relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
          <p className="text-[9px] font-mono uppercase tracking-[0.2em] text-muted mb-4 flex items-center gap-2">
            <Activity size={12} className="text-blue-500" /> Sessions Today
          </p>
          <p className="text-3xl font-mono text-foreground">{sessionsToday}</p>
        </motion.div>

        {/* Threat Level */}
        <motion.div variants={itemVariants} className="bg-background border border-surface p-5 rounded-sm relative overflow-hidden group">
          <div className={`absolute top-0 left-0 w-1 h-full ${failedLogins > 0 ? 'bg-[#E4002B]' : 'bg-emerald-500'}`}></div>
          <p className="text-[9px] font-mono uppercase tracking-[0.2em] text-muted mb-4 flex items-center gap-2">
            <ShieldAlert size={12} className={failedLogins > 0 ? 'text-[#E4002B]' : 'text-emerald-500'} /> Security Status
          </p>
          <p className={`text-xl font-mono mt-2 ${failedLogins > 0 ? 'text-[#E4002B]' : 'text-emerald-500'}`}>
            {failedLogins > 0 ? 'ELEVATED' : 'NOMINAL'}
          </p>
        </motion.div>

        {/* Unread Contacts */}
        <motion.div variants={itemVariants} className="bg-background border border-surface p-5 rounded-sm relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-amber-500"></div>
          <p className="text-[9px] font-mono uppercase tracking-[0.2em] text-muted mb-4 flex items-center gap-2">
            <MessageSquare size={12} className="text-amber-500" /> Inbound Comms
          </p>
          <p className="text-3xl font-mono text-foreground">{unreadCount}</p>
        </motion.div>

        {/* Resume Downloads */}
        <motion.div variants={itemVariants} className="bg-background border border-surface p-5 rounded-sm relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-purple-500"></div>
          <p className="text-[9px] font-mono uppercase tracking-[0.2em] text-muted mb-4 flex items-center gap-2">
            <FileText size={12} className="text-purple-500" /> Resume DLs
          </p>
          <p className="text-3xl font-mono text-foreground">{resumeDownloads}</p>
        </motion.div>

        {/* Threat Score / Health */}
        <motion.div variants={itemVariants} className="bg-background border border-surface p-5 rounded-sm relative overflow-hidden group">
          <div className={`absolute top-0 left-0 w-1 h-full ${healthScore < 80 ? 'bg-[#E4002B]' : 'bg-emerald-500'}`}></div>
          <p className="text-[9px] font-mono uppercase tracking-[0.2em] text-muted mb-4 flex items-center gap-2">
            <ShieldCheck size={12} className={healthScore < 80 ? 'text-[#E4002B]' : 'text-emerald-500'} /> Threat Score
          </p>
          <p className={`text-3xl font-mono ${healthScore < 80 ? 'text-[#E4002B]' : 'text-emerald-500'}`}>
            {healthScore}%
          </p>
        </motion.div>

      </motion.div>

      {/* SECOND ROW: Timelines and Feeds */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Activity Timeline (Graph) */}
        <motion.div variants={itemVariants} className="lg:col-span-1 bg-background border border-surface rounded-sm flex flex-col">
          <div className="p-4 border-b border-surface bg-surface/10">
            <h3 className="text-[10px] font-mono text-muted uppercase tracking-[0.2em] flex items-center gap-2">
              <Activity size={12} /> Today&apos;s Activity Pulse
            </h3>
          </div>
          <div className="p-6 flex-1 flex flex-col justify-end">
            <div className="flex items-end justify-between gap-1 h-32 mb-4">
              {hours.map(hour => {
                const count = hourlyActivity[hour];
                const height = maxActivity > 0 ? (count / maxActivity) * 100 : 0;
                return (
                  <div key={hour} className="w-full relative group">
                    <div 
                      className="w-full bg-[#E4002B] opacity-80 rounded-t-sm transition-all duration-500 group-hover:opacity-100 group-hover:bg-[#E4002B]" 
                      style={{ height: `${height}%`, minHeight: count > 0 ? '4px' : '0' }}
                    ></div>
                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-surface text-foreground font-mono text-[9px] px-2 py-1 rounded-sm border border-surface-strong whitespace-nowrap z-10 pointer-events-none">
                      {hour}:00 - {count} events
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="flex justify-between text-[9px] font-mono text-muted border-t border-surface pt-2">
              <span>00:00</span>
              <span>12:00</span>
              <span>23:59</span>
            </div>
          </div>
        </motion.div>

        {/* Live Events Feed */}
        <motion.div variants={itemVariants} className="lg:col-span-1 bg-background border border-surface rounded-sm flex flex-col">
          <div className="p-4 border-b border-surface bg-surface/10 flex justify-between items-center">
            <h3 className="text-[10px] font-mono text-muted uppercase tracking-[0.2em] flex items-center gap-2">
              <TerminalIcon size={12} /> Live Event Feed
            </h3>
            <div className="w-1.5 h-1.5 rounded-full bg-[#E4002B] animate-pulse"></div>
          </div>
          <div className="p-4 flex-1 overflow-y-auto max-h-[300px] space-y-3">
            {liveEvents && liveEvents.length > 0 ? (
              liveEvents.map((e) => (
                <div key={e.id} className="text-xs font-mono border-l-2 border-surface pl-3 py-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[#E4002B] uppercase text-[9px] tracking-wider">{e.event_type}</span>
                    <span className="text-muted text-[9px]">{formatDistanceToNow(new Date(e.created_at))} ago</span>
                  </div>
                  <span className="text-foreground">{(e.event_data?.command as string) || (e.metadata?.command as string) || (e.metadata?.project as string) || (e.metadata?.certificate as string) || e.event_name}</span>
                </div>
              ))
            ) : (
               <p className="text-[10px] font-mono text-muted italic">Awaiting incoming telemetry...</p>
            )}
          </div>
        </motion.div>

        {/* Recent Security Events */}
        <motion.div variants={itemVariants} className="lg:col-span-1 bg-background border border-surface rounded-sm flex flex-col">
          <div className="p-4 border-b border-surface bg-surface/10">
            <h3 className="text-[10px] font-mono text-muted uppercase tracking-[0.2em] flex items-center gap-2">
              <ShieldAlert size={12} className="text-amber-500" /> Audit & Security Logs
            </h3>
          </div>
          <div className="p-4 flex-1 overflow-y-auto max-h-[300px] space-y-3">
            {recentLogs && recentLogs.length > 0 ? (
              recentLogs.map((log) => (
                <div key={log.id} className="bg-surface/5 border border-surface p-3 rounded-sm flex flex-col gap-1">
                  <div className="flex justify-between items-center">
                    <span className={`text-[10px] font-mono uppercase tracking-wider ${log.action.includes('FAILED') ? 'text-[#E4002B]' : 'text-emerald-500'}`}>
                      {log.action}
                    </span>
                    <span className="text-[9px] font-mono text-muted">
                      {format(new Date(log.created_at), 'HH:mm:ss')}
                    </span>
                  </div>
                  <span className="text-[9px] font-mono text-muted truncate">Actor: {log.actor}</span>
                </div>
              ))
            ) : (
              <p className="text-[10px] font-mono text-muted italic">No recent security events.</p>
            )}
          </div>
        </motion.div>

      </div>

      {/* THIRD ROW: Distributions and Aggregations */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Most Viewed Projects */}
        <motion.div variants={itemVariants} className="bg-background border border-surface rounded-sm p-5">
          <h3 className="text-[10px] font-mono text-muted uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
            <Box size={12} /> Top Projects
          </h3>
          <ul className="space-y-3">
            {sortedProjects.length > 0 ? sortedProjects.map(([name, count], idx) => (
              <li key={name} className="flex justify-between items-center text-xs font-mono">
                <span className="text-foreground truncate pr-2">{idx + 1}. {name}</span>
                <span className="text-muted bg-surface px-1.5 py-0.5 rounded-sm">{count}</span>
              </li>
            )) : <p className="text-[10px] font-mono text-muted italic">No data yet.</p>}
          </ul>
        </motion.div>

        {/* Most Viewed Certificates */}
        <motion.div variants={itemVariants} className="bg-background border border-surface rounded-sm p-5">
          <h3 className="text-[10px] font-mono text-muted uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
            <Award size={12} /> Top Certificates
          </h3>
          <ul className="space-y-3">
            {sortedCerts.length > 0 ? sortedCerts.map(([name, count], idx) => (
              <li key={name} className="flex justify-between items-center text-xs font-mono">
                <span className="text-foreground truncate pr-2">{idx + 1}. {name}</span>
                <span className="text-muted bg-surface px-1.5 py-0.5 rounded-sm">{count}</span>
              </li>
            )) : <p className="text-[10px] font-mono text-muted italic">No data yet.</p>}
          </ul>
        </motion.div>

        {/* Browser Distribution */}
        <motion.div variants={itemVariants} className="bg-background border border-surface rounded-sm p-5">
          <h3 className="text-[10px] font-mono text-muted uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
            <Globe size={12} /> Browsers
          </h3>
          <ul className="space-y-3">
            {Object.entries(browserCounts).sort((a,b) => b[1] - a[1]).slice(0, 5).map(([name, count]) => (
              <li key={name} className="flex justify-between items-center text-xs font-mono">
                <span className="text-foreground truncate pr-2">{name}</span>
                <span className="text-muted">{count}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Device Distribution */}
        <motion.div variants={itemVariants} className="bg-background border border-surface rounded-sm p-5">
          <h3 className="text-[10px] font-mono text-muted uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
            <Monitor size={12} /> Devices
          </h3>
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
