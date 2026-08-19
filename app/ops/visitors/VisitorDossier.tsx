'use client';

import { useState, useEffect } from 'react';
import { format, formatDistanceToNow } from 'date-fns';
import { 
  Terminal, FileText, LayoutDashboard, Shield, 
  MapPin, Monitor, Globe, Clock, Activity, 
  ArrowLeftRight, Search, Mail, Eye
} from 'lucide-react';
import { VscLoading } from 'react-icons/vsc';
import SessionDossier from './SessionDossier';

type DossierData = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  visitor: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  sessions: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  pageViews: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  events: any[];
};

export default function VisitorDossier({ visitorId, onBack }: { visitorId: string, onBack: () => void }) {
  const [data, setData] = useState<DossierData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedSession, setSelectedSession] = useState<any | null>(null);

  const [isBlocked, setIsBlocked] = useState(false);
  const [blocking, setBlocking] = useState(false);

  useEffect(() => {
    let isMounted = true;
    
    async function fetchDossier() {
      try {
        const res = await fetch(`/api/ops/visitors/${visitorId}`);
        if (!res.ok) throw new Error('Failed to fetch dossier');
        const json = await res.json();
        if (isMounted) {
          setData(json);
          setIsBlocked(json.isBlocked);
        }
      } catch (e: any) {
        if (isMounted) setError(e.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    
    fetchDossier();

    const { createClient } = require('@/utils/supabase/client');
    const supabase = createClient();
    
    const channelName = `visitor-dossier-${visitorId}`;
    const channel = supabase.channel(channelName)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'portfolio_events', filter: `visitor_id=eq.${visitorId}` },
        () => fetchDossier()
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'portfolio_sessions', filter: `visitor_id=eq.${visitorId}` },
        () => fetchDossier()
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'portfolio_visitors', filter: `visitor_id=eq.${visitorId}` },
        () => fetchDossier()
      )
      .subscribe();

    return () => {
      isMounted = false;
      supabase.removeChannel(channel);
    };
  }, [visitorId]);

  const handleBlockToggle = async () => {
    setBlocking(true);
    try {
      const res = await fetch(`/api/ops/visitors/${visitorId}/block`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: isBlocked ? 'unblock' : 'block' })
      });
      if (res.ok) setIsBlocked(!isBlocked);
    } catch (e) {
      console.error(e);
    } finally {
      setBlocking(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-muted space-y-4">
        <VscLoading className="text-2xl animate-spin text-[#E4002B]" />
        <p className="font-mono text-xs uppercase tracking-widest">Reconstructing Journey...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="text-[#E4002B] font-mono text-xs uppercase tracking-widest border border-[#E4002B]/30 bg-[#E4002B]/10 p-6 rounded-sm">
        Error loading dossier: {error}
      </div>
    );
  }

  if (selectedSession) {
    return (
      <SessionDossier
        session={selectedSession}
        visitor={data.visitor}
        pageViews={data.pageViews}
        events={data.events}
        onBack={() => setSelectedSession(null)}
      />
    );
  }

  const { visitor, sessions, pageViews, events } = data;

  // Categorized Data for Panels
  const projectsViewed = events.filter(e => e.event_type === 'PROJECT_OPEN');
  const terminalCmds = events.filter(e => e.event_type === 'TERMINAL_COMMAND');
  const certsViewed = events.filter(e => e.event_type === 'CERTIFICATE_OPEN' || e.event_type === 'CERTIFICATE_VERIFY');
  const resumeActivity = events.filter(e => e.event_type === 'RESUME_VIEW' || e.event_type === 'RESUME_DOWNLOAD');
  const contacts = events.filter(e => e.event_type === 'CONTACT_SUBMIT');

  // Compute average session duration
  const now = Date.now();
  
  // Calculate dynamic duration for active sessions or fix negative historical ones
  const dynamicSessions = sessions.map(s => {
    let dur = (s as any).total_duration || s.duration || 0;
    const isOnline = now - new Date(s.updated_at || s.created_at).getTime() < 5 * 60 * 1000;
    
    // If online, duration is running. If historical and negative, fix it.
    if (isOnline) {
      dur = Math.max(dur, Math.round((now - new Date(s.created_at).getTime()) / 1000));
    } else {
      dur = Math.max(0, dur);
    }

    // Determine Entry/Exit sections precisely from events for historical accuracy
    const sessionEvents = events.filter(e => e.session_id === s.session_id);
    const sectionEnters = sessionEvents.filter(e => ['SECTION_ENTER', 'ABOUT_ENTER', 'GOOGLE_SECTION_ENTER', 'COMPTIA_SECTION_ENTER', 'IDENTITY_ENTER', 'FOCUS_ENTER'].includes(e.event_type));
    
    let computedEntry = s.entry_page;
    let computedExit = s.exit_page;
    
    if (computedEntry === '/' || !computedEntry) {
      computedEntry = sectionEnters.length > 0 
        ? (sectionEnters[0].event_data?.section || sectionEnters[0].event_name) 
        : 'Unknown';
    }
    if (computedExit === '/' || !computedExit) {
      const sectionEventsAll = sessionEvents.filter(e => e.event_type.includes('SECTION_') || e.event_type.includes('ENTER') || e.event_type.includes('EXIT'));
      computedExit = sectionEventsAll.length > 0 
        ? (sectionEventsAll[sectionEventsAll.length - 1].event_data?.section || sectionEventsAll[sectionEventsAll.length - 1].event_name) 
        : 'Unknown';
    }

    return { ...s, _duration: dur, _isOnline: isOnline, _entry: computedEntry, _exit: computedExit, _sessionEvents: sessionEvents };
  });

  const durations = dynamicSessions.map(s => s._duration);
  const totalDuration = durations.reduce((a,b) => a+b, 0);
  const avgDuration = durations.length > 0 ? Math.round(totalDuration / durations.length) : 0;
  const longestSession = durations.length > 0 ? Math.max(...durations) : 0;
  const shortestSession = durations.length > 0 ? Math.min(...durations) : 0;
  const bouncedSessions = dynamicSessions.filter(s => s.bounced || (s._duration < 10)).length;
  const bounceRate = dynamicSessions.length > 0 ? Math.round((bouncedSessions / dynamicSessions.length) * 100) : 0;

  const formatTime = (secs: number) => {
    if (secs === 0) return '0s';
    if (secs > 3600) return `${Math.floor(secs / 3600)}h ${Math.floor((secs % 3600) / 60)}m`;
    if (secs > 60) return `${Math.floor(secs / 60)}m ${secs % 60}s`;
    return `${secs}s`;
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-muted hover:text-[#E4002B] transition-colors"
      >
        ← Return to Intelligence Feed
      </button>
      
      <div className="bg-surface/5 border border-surface p-6 rounded-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-surface pb-6 mb-6 gap-4">
          <div>
            <h2 className="text-sm font-mono text-muted uppercase tracking-widest mb-1">
              Visitor Dossier: <span className="text-foreground">{visitor.visitor_id}</span>
            </h2>
            <p className="text-[10px] text-muted font-mono tracking-widest uppercase">
              Profile Generated: {format(new Date(), 'HH:mm:ss')}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleBlockToggle}
              disabled={blocking}
              className={`px-3 py-1.5 rounded-sm font-mono text-[9px] uppercase tracking-widest border transition-colors ${
                isBlocked 
                  ? 'bg-[#E4002B]/10 text-[#E4002B] border-[#E4002B]/30 hover:bg-[#E4002B]/20'
                  : 'bg-surface/30 text-muted border-surface-strong hover:bg-surface/50 hover:text-foreground'
              }`}
            >
              <Shield size={10} className="inline-block mr-1 -mt-0.5" />
              {blocking ? 'Processing...' : isBlocked ? 'Unblock Visitor' : 'Block Visitor'}
            </button>
            <div className={`px-3 py-1.5 rounded-sm font-mono text-[9px] uppercase tracking-widest border ${
               new Date().getTime() - new Date(visitor.last_visit).getTime() < 5 * 60 * 1000 
                 ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30' 
                 : 'bg-surface/30 text-muted border-surface-strong'
            }`}>
              {new Date().getTime() - new Date(visitor.last_visit).getTime() < 5 * 60 * 1000 ? '● ONLINE' : 'OFFLINE'}
            </div>
          </div>
        </div>
        
        {/* General Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-background border border-surface p-4 rounded-sm flex flex-col gap-2">
            <Clock size={14} className="text-muted" />
            <p className="text-[10px] font-mono uppercase tracking-widest text-muted">First Seen</p>
            <p className="text-sm text-foreground font-mono">{format(new Date(visitor.first_visit), 'PP pp')}</p>
          </div>
          <div className="bg-background border border-surface p-4 rounded-sm flex flex-col gap-2">
            <Activity size={14} className="text-[#E4002B]" />
            <p className="text-[10px] font-mono uppercase tracking-widest text-muted">Total Visits</p>
            <p className="text-xl text-foreground font-mono">{visitor.total_visits}</p>
          </div>
          <div className="bg-background border border-surface p-4 rounded-sm flex flex-col gap-2">
            <Monitor size={14} className="text-muted" />
            <p className="text-[10px] font-mono uppercase tracking-widest text-muted">Environment</p>
            <p className="text-xs text-foreground font-mono truncate" title={`${visitor.browser} ${visitor.browser_version}`}>
              {visitor.browser || 'Unknown'} {visitor.browser_version !== 'Unknown' && <span className="text-[10px] text-muted">{visitor.browser_version}</span>}
            </p>
            <p className="text-[10px] text-muted font-mono mt-1">
              {visitor.device_type} / {visitor.os} {visitor.os_version !== 'Unknown' && visitor.os_version}
            </p>
          </div>
          <div className="bg-background border border-surface p-4 rounded-sm flex flex-col gap-2">
            <MapPin size={14} className="text-muted" />
            <div className="flex justify-between items-center">
              <p className="text-[10px] font-mono uppercase tracking-widest text-muted">Network & Geo</p>
              <p className="text-[9px] font-mono text-emerald-500">{visitor.public_ip || '127.0.0.1'}</p>
            </div>
            <p className="text-sm text-foreground font-mono truncate" title={visitor.region ? `${visitor.city}, ${visitor.region}` : visitor.city}>
              {visitor.city ? `${visitor.city}, ` : ''}{visitor.country || 'Unknown Location'}
            </p>
            <p className="text-[10px] text-muted font-mono truncate" title={visitor.isp}>
              {visitor.isp ? `ISP: ${visitor.isp}` : (visitor.timezone || 'Unknown Timezone')}
            </p>
          </div>
        </div>

        {/* Aggregate Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-8">
           <div className="bg-background border border-surface p-3 rounded-sm">
             <p className="text-[9px] text-muted uppercase font-mono tracking-widest">Sessions</p>
             <p className="text-lg font-mono text-foreground mt-1">{sessions.length}</p>
           </div>
           <div className="bg-background border border-surface p-3 rounded-sm col-span-2 md:col-span-1">
             <p className="text-[9px] text-muted uppercase font-mono tracking-widest">Total Time</p>
             <p className="text-lg font-mono text-foreground mt-1">{formatTime(totalDuration)}</p>
           </div>
           <div className="bg-background border border-surface p-3 rounded-sm">
             <p className="text-[9px] text-muted uppercase font-mono tracking-widest">Avg Time</p>
             <p className="text-lg font-mono text-foreground mt-1">{formatTime(avgDuration)}</p>
           </div>
           <div className="bg-background border border-surface p-3 rounded-sm">
             <p className="text-[9px] text-muted uppercase font-mono tracking-widest">Longest</p>
             <p className="text-lg font-mono text-foreground mt-1">{formatTime(longestSession)}</p>
           </div>
           <div className="bg-background border border-surface p-3 rounded-sm">
             <p className="text-[9px] text-muted uppercase font-mono tracking-widest">Shortest</p>
             <p className="text-lg font-mono text-foreground mt-1">{formatTime(shortestSession)}</p>
           </div>
           <div className="bg-background border border-surface p-3 rounded-sm">
             <p className="text-[9px] text-muted uppercase font-mono tracking-widest">Projects</p>
             <p className="text-lg font-mono text-foreground mt-1">{projectsViewed.length}</p>
           </div>
           <div className="bg-background border border-surface p-3 rounded-sm">
             <p className="text-[9px] text-muted uppercase font-mono tracking-widest">Certs</p>
             <p className="text-lg font-mono text-foreground mt-1">{certsViewed.length}</p>
           </div>
           <div className="bg-background border border-surface p-3 rounded-sm">
             <p className="text-[9px] text-emerald-500 uppercase font-mono tracking-widest">Terminal</p>
             <p className="text-lg font-mono text-emerald-500 mt-1">{terminalCmds.length}</p>
           </div>
           <div className="bg-background border border-surface p-3 rounded-sm">
             <p className="text-[9px] text-emerald-500 uppercase font-mono tracking-widest">Contacts</p>
             <p className="text-lg font-mono text-emerald-500 mt-1">{contacts.length}</p>
           </div>
        </div>

        {/* Sessions & Exit Summary */}
        <div className="mb-8 border border-surface bg-background p-5 rounded-sm">
          <h3 className="text-[10px] font-mono text-muted uppercase tracking-widest mb-4 flex items-center gap-2">
            <ArrowLeftRight size={12} /> Session List (Select to investigate)
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead className="bg-surface/30 text-[9px] uppercase text-muted border-b border-surface whitespace-nowrap">
                <tr>
                  <th className="px-3 py-2 font-normal">Session ID</th>
                  <th className="px-3 py-2 font-normal">Start</th>
                  <th className="px-3 py-2 font-normal">Duration</th>
                  <th className="px-3 py-2 font-normal">Entry</th>
                  <th className="px-3 py-2 font-normal">Exit</th>
                  <th className="px-3 py-2 font-normal text-right" title="Projects Viewed">Proj</th>
                  <th className="px-3 py-2 font-normal text-right" title="Certificates Viewed">Cert</th>
                  <th className="px-3 py-2 font-normal text-right" title="Resume Downloads">Res</th>
                  <th className="px-3 py-2 font-normal text-right">Bounce</th>
                  <th className="px-3 py-2 font-normal text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface text-foreground">
                {dynamicSessions.map((s) => {
                  const projCount = s._sessionEvents.filter((e: any) => e.event_type === 'PROJECT_OPEN').length;
                  const certCount = s._sessionEvents.filter((e: any) => e.event_type.includes('CERTIFICATE') || e.event_type.includes('GOOGLE_SPECIALIZATION')).length;
                  const resCount = s._sessionEvents.filter((e: any) => e.event_type === 'RESUME_DOWNLOAD').length;
                  const isBounce = s.bounced || (s._duration < 10);
                  return (
                    <tr 
                      key={s.id} 
                      onClick={() => setSelectedSession(s)}
                      className="hover:bg-surface/10 transition-colors cursor-pointer group"
                    >
                      <td className="px-3 py-2 text-muted group-hover:text-foreground">{s.session_id.substring(0,8)}...</td>
                      <td className="px-3 py-2">{format(new Date(s.created_at), 'MMM d, HH:mm')}</td>
                      <td className="px-3 py-2 text-muted">
                        {s._isOnline ? <span className="text-emerald-500 animate-pulse flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div> {formatTime(s._duration)}</span> : formatTime(s._duration)}
                      </td>
                      <td className="px-3 py-2 text-emerald-500/80 max-w-[120px] truncate capitalize">{s._entry}</td>
                      <td className="px-3 py-2 text-[#E4002B]/80 max-w-[120px] truncate capitalize">{s._isOnline ? 'Active' : s._exit}</td>
                      <td className="px-3 py-2 text-right">{projCount}</td>
                      <td className="px-3 py-2 text-right">{certCount}</td>
                      <td className="px-3 py-2 text-right">{resCount}</td>
                      <td className="px-3 py-2 text-right">{isBounce ? 'YES' : 'NO'}</td>
                      <td className="px-3 py-2 text-center text-blue-400 group-hover:text-blue-300">
                        <Eye size={14} className="inline-block" />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
