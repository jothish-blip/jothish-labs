'use client';

import { useState, useEffect } from 'react';
import { format, formatDistanceToNow } from 'date-fns';
import { 
  Terminal, FileText, LayoutDashboard, Shield, 
  MapPin, Monitor, Globe, Clock, Activity, 
  ArrowLeftRight, Search, Mail, Eye
} from 'lucide-react';
import { VscLoading } from 'react-icons/vsc';

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

  useEffect(() => {
    async function fetchDossier() {
      try {
        const res = await fetch(`/api/ops/visitors/${visitorId}`);
        if (!res.ok) throw new Error('Failed to fetch dossier');
        const json = await res.json();
        setData(json);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    fetchDossier();
  }, [visitorId]);

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

  const { visitor, sessions, pageViews, events } = data;

  // Combine Page Views and Events into a single Forensic Timeline
  const timeline = [
    ...pageViews.map(pv => ({ type: 'page_view', time: new Date(pv.created_at), data: pv })),
    ...events.map(ev => ({ type: 'event', time: new Date(ev.created_at), data: ev }))
  ].sort((a, b) => b.time.getTime() - a.time.getTime()); // Newest first

  // Categorized Data for Panels
  const projectsViewed = events.filter(e => e.event_type === 'PROJECT_OPEN');
  const terminalCmds = events.filter(e => e.event_type === 'TERMINAL_COMMAND');
  const certsViewed = events.filter(e => e.event_type === 'CERTIFICATE_OPEN' || e.event_type === 'CERTIFICATE_VERIFY');
  const resumeActivity = events.filter(e => e.event_type === 'RESUME_VIEW' || e.event_type === 'RESUME_DOWNLOAD');
  const contacts = events.filter(e => e.event_type === 'CONTACT_SUBMIT');

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
          <div className={`px-3 py-1.5 rounded-sm font-mono text-[9px] uppercase tracking-widest border ${
             new Date().getTime() - new Date(visitor.last_visit).getTime() < 5 * 60 * 1000 
               ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30' 
               : 'bg-surface/30 text-muted border-surface-strong'
          }`}>
            {new Date().getTime() - new Date(visitor.last_visit).getTime() < 5 * 60 * 1000 ? '● ONLINE' : 'OFFLINE'}
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

        {/* Feature Specific Data */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Projects & Code */}
          <div className="border border-surface bg-background p-5 rounded-sm">
            <h3 className="text-[10px] font-mono text-muted uppercase tracking-widest mb-4 flex items-center gap-2">
              <LayoutDashboard size={12} /> Project Engagement
            </h3>
            {projectsViewed.length > 0 ? (
              <ul className="space-y-2">
                {projectsViewed.slice(0, 5).map(e => (
                  <li key={e.id} className="text-xs font-mono text-foreground flex justify-between">
                    <span className="truncate max-w-[150px]">{e.event_data?.certificate || e.event_data?.project || e.metadata?.project || 'Unknown Project'}</span>
                    <span className="text-muted text-[9px]">{formatDistanceToNow(new Date(e.created_at))} ago</span>
                  </li>
                ))}
              </ul>
            ) : <p className="text-[10px] text-muted/50 font-mono italic">No projects viewed.</p>}
          </div>

          {/* Terminal */}
          <div className="border border-surface bg-background p-5 rounded-sm">
            <h3 className="text-[10px] font-mono text-muted uppercase tracking-widest mb-4 flex items-center gap-2">
              <Terminal size={12} /> Terminal Commands
            </h3>
            {terminalCmds.length > 0 ? (
              <div className="space-y-2">
                {terminalCmds.slice(0, 5).map(e => (
                  <div key={e.id} className="text-xs font-mono bg-surface/30 px-2 py-1 rounded-sm flex justify-between items-center border border-surface border-dashed">
                    <span className="text-emerald-500">$ {e.event_data?.command || e.metadata?.command || e.event_name}</span>
                  </div>
                ))}
              </div>
            ) : <p className="text-[10px] text-muted/50 font-mono italic">No terminal interactions.</p>}
          </div>

          {/* Resume & Certs */}
          <div className="border border-surface bg-background p-5 rounded-sm">
            <h3 className="text-[10px] font-mono text-muted uppercase tracking-widest mb-4 flex items-center gap-2">
              <FileText size={12} /> Professional Artifacts
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-muted">Resume Views:</span>
                <span className="text-foreground">{resumeActivity.filter(r => r.event_type === 'RESUME_VIEW').length}</span>
              </div>
              <div className="flex justify-between text-xs font-mono">
                <span className="text-muted">Resume Downloads:</span>
                <span className="text-[#E4002B]">{resumeActivity.filter(r => r.event_type === 'RESUME_DOWNLOAD').length}</span>
              </div>
              <div className="flex justify-between text-xs font-mono">
                <span className="text-muted">Certs Inspected:</span>
                <span className="text-foreground">{certsViewed.length}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sessions & Exit Summary */}
        <div className="mb-8 border border-surface bg-background p-5 rounded-sm">
          <h3 className="text-[10px] font-mono text-muted uppercase tracking-widest mb-4 flex items-center gap-2">
            <ArrowLeftRight size={12} /> Session Summary & Exit Vectors
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
                </tr>
              </thead>
              <tbody className="divide-y divide-surface text-foreground">
                {sessions.map((s) => {
                  const sessionEvents = events.filter(e => e.session_id === s.session_id);
                  const projCount = sessionEvents.filter(e => e.event_type === 'PROJECT_OPEN').length;
                  const certCount = sessionEvents.filter(e => e.event_type === 'CERTIFICATE_OPEN' || e.event_type === 'CERTIFICATE_VERIFY').length;
                  const resCount = sessionEvents.filter(e => e.event_type === 'RESUME_DOWNLOAD').length;
                  return (
                    <tr key={s.id}>
                      <td className="px-3 py-2 text-muted">{s.session_id.substring(0,8)}...</td>
                      <td className="px-3 py-2">{format(new Date(s.created_at), 'MMM d, HH:mm')}</td>
                      <td className="px-3 py-2 text-muted">{s.duration ? `${Math.floor(s.duration / 60)}m ${s.duration % 60}s` : 'Active'}</td>
                      <td className="px-3 py-2 text-emerald-500/80">{s.entry_page}</td>
                      <td className="px-3 py-2 text-[#E4002B]/80">{s.exit_page || 'Active'}</td>
                      <td className="px-3 py-2 text-right">{projCount}</td>
                      <td className="px-3 py-2 text-right">{certCount}</td>
                      <td className="px-3 py-2 text-right">{resCount}</td>
                      <td className="px-3 py-2 text-right">{s.bounced ? 'YES' : 'NO'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Forensic Timeline */}
        <div>
          <h3 className="text-xs font-mono text-muted uppercase tracking-widest border-b border-surface pb-2 mb-6">
            Forensic Event Timeline
          </h3>
          <div className="relative border-l border-surface-strong ml-3 space-y-6">
            {timeline.slice(0, 50).map((item, i) => (
              <div key={i} className="relative pl-6">
                {item.type === 'page_view' ? (
                  <>
                    <div className="absolute left-[-4.5px] top-1.5 w-2 h-2 rounded-full bg-blue-500 ring-4 ring-background"></div>
                    <p className="text-[10px] font-mono text-blue-500 uppercase tracking-widest mb-1 flex items-center gap-2">
                      <Search size={10} /> PAGE VIEW
                      <span className="text-muted/50 normal-case tracking-normal">{format(item.time, 'HH:mm:ss')}</span>
                    </p>
                    <p className="text-xs text-foreground font-mono bg-background border border-surface p-2 rounded-sm inline-block">
                      {item.data.path}
                    </p>
                  </>
                ) : (
                  <>
                    <div className="absolute left-[-4.5px] top-1.5 w-2 h-2 rounded-full bg-amber-500 ring-4 ring-background"></div>
                    <p className="text-[10px] font-mono text-amber-500 uppercase tracking-widest mb-1 flex items-center gap-2">
                      <Activity size={10} /> 
                      {item.data.event_type === 'PROJECT_OPEN' && 'PROJECT VIEWED'}
                      {item.data.event_type === 'CERTIFICATE_OPEN' && 'CERTIFICATE VIEWED'}
                      {item.data.event_type === 'SECTION_VIEW' && 'SECTION VIEWED'}
                      {item.data.event_type === 'RESUME_DOWNLOAD' && 'RESUME DOWNLOADED'}
                      {item.data.event_type === 'RESUME_VIEW' && 'RESUME PREVIEWED'}
                      {item.data.event_type === 'CONTACT_SUBMIT' && 'CONTACT SUBMITTED'}
                      {item.data.event_type === 'TERMINAL_COMMAND' && 'TERMINAL USED'}
                      {![
                        'PROJECT_OPEN', 'CERTIFICATE_OPEN', 'SECTION_VIEW', 
                        'RESUME_DOWNLOAD', 'RESUME_VIEW', 'CONTACT_SUBMIT', 'TERMINAL_COMMAND'
                      ].includes(item.data.event_type) && item.data.event_type}
                      
                      <span className="text-muted/50 normal-case tracking-normal">{format(item.time, 'HH:mm:ss')}</span>
                    </p>
                    <div className="text-xs text-muted font-mono bg-background border border-surface p-2 rounded-sm inline-block">
                      {item.data.event_type === 'PROJECT_OPEN' || item.data.event_type === 'PROJECT_CLOSE' ? (
                        <span>Project: {item.data.event_data?.project || item.data.metadata?.project} {item.data.event_data?.duration_seconds ? `(${item.data.event_data.duration_seconds}s)` : ''}</span>
                      ) : item.data.event_type === 'SECTION_VIEW' ? (
                        <span>Section: {item.data.event_data?.section || item.data.metadata?.section} {item.data.event_data?.duration_seconds ? `(${item.data.event_data.duration_seconds}s)` : ''}</span>
                      ) : item.data.event_type === 'CERTIFICATE_OPEN' || item.data.event_type === 'CERTIFICATE_CLOSE' ? (
                        <span>Certificate: {item.data.event_data?.title || item.data.metadata?.title} {item.data.event_data?.duration_seconds ? `(${item.data.event_data.duration_seconds}s)` : ''}</span>
                      ) : item.data.event_type === 'TERMINAL_COMMAND' ? (
                        <span className="text-emerald-500">$ {item.data.event_data?.command || item.data.metadata?.command || item.data.event_name}</span>
                      ) : Object.keys(item.data.event_data || {}).length > 0 || Object.keys(item.data.metadata || {}).length > 0 ? (
                        <pre className="whitespace-pre-wrap">
                          {JSON.stringify(item.data.event_data || item.data.metadata, null, 2)}
                        </pre>
                      ) : (
                        <span>{item.data.event_name}</span>
                      )}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
          {timeline.length > 50 && (
            <p className="text-xs font-mono text-muted text-center mt-6">Showing most recent 50 events.</p>
          )}
        </div>

      </div>
    </div>
  );
}
