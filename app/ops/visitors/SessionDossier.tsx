import { format } from 'date-fns';
import { 
  Terminal, FileText, LayoutDashboard,
  MapPin, Monitor, Clock, Activity, 
  Search, Mail, Shield, Code, ChevronRight, FileJson
} from 'lucide-react';
import { useState } from 'react';

export default function SessionDossier({ 
  session, 
  visitor, 
  pageViews, 
  events, 
  onBack 
}: { 
  session: any, 
  visitor: any, 
  pageViews: any[], 
  events: any[], 
  onBack: () => void 
}) {
  const [showRawLog, setShowRawLog] = useState(false);

  // Strictly filter by session_id
  const sessionPageViews = pageViews.filter(pv => pv.session_id === session.session_id).sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
  const sessionEvents = events.filter(ev => ev.session_id === session.session_id).sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());

  // Combine for timeline
  const timeline = [
    ...sessionPageViews.map(pv => ({ type: 'page_view', time: new Date(pv.created_at), data: pv })),
    ...sessionEvents.map(ev => ({ type: 'event', time: new Date(ev.created_at), data: ev }))
  ].sort((a, b) => a.time.getTime() - b.time.getTime()); // Chronological (oldest first)

  // Categorized Analytics
  const projects = sessionEvents.filter(e => e.event_type === 'PROJECT_OPEN' || e.event_type === 'PROJECT_CLOSE');
  const certs = sessionEvents.filter(e => 
    e.event_type === 'CERTIFICATE_OPEN' || e.event_type === 'CERTIFICATE_VERIFY' || e.event_type === 'CERTIFICATE_CLOSE' ||
    e.event_type === 'GOOGLE_SPECIALIZATION_OPEN' || e.event_type === 'GOOGLE_SPECIALIZATION_CLOSE' || e.event_type === 'GOOGLE_VERIFY_CLICK' ||
    e.event_type === 'GOOGLE_COURSE_OPEN' || e.event_type === 'GOOGLE_COURSE_CLOSE'
  );
  const resumes = sessionEvents.filter(e => e.event_type === 'RESUME_VIEW' || e.event_type === 'RESUME_DOWNLOAD');
  const terminals = sessionEvents.filter(e => e.event_type === 'TERMINAL_COMMAND');
  const contacts = sessionEvents.filter(e => e.event_type === 'CONTACT_SUBMIT');

  // Group projects by name to compute opens/closes
  const projectMap = new Map();
  projects.forEach(p => {
    const name = p.event_data?.project || p.metadata?.project || 'Unknown';
    if (!projectMap.has(name)) {
      projectMap.set(name, { opens: [], closes: [] });
    }
    if (p.event_type === 'PROJECT_OPEN') projectMap.get(name).opens.push(p);
    if (p.event_type === 'PROJECT_CLOSE') projectMap.get(name).closes.push(p);
  });

  const certMap = new Map();
  certs.forEach(c => {
    const name = c.event_data?.title || c.metadata?.title || c.event_data?.certificate || c.metadata?.certificate || 'Unknown';
    if (!certMap.has(name)) {
      certMap.set(name, { opens: [], closes: [], verifies: [] });
    }
    if (c.event_type === 'CERTIFICATE_OPEN' || c.event_type === 'GOOGLE_SPECIALIZATION_OPEN') certMap.get(name).opens.push(c);
    if (c.event_type === 'CERTIFICATE_CLOSE' || c.event_type === 'GOOGLE_SPECIALIZATION_CLOSE') certMap.get(name).closes.push(c);
    if (c.event_type === 'CERTIFICATE_VERIFY' || c.event_type === 'GOOGLE_VERIFY_CLICK') certMap.get(name).verifies.push(c);
  });

  const getSumDuration = (eventsArray: any[], type: string) => {
    return eventsArray
      .filter(e => e.event_type === type)
      .reduce((sum, e) => sum + (e.event_data?.duration_seconds || e.metadata?.duration_seconds || 0), 0);
  };

  const aboutTotalTime = getSumDuration(sessionEvents.filter(e => (e.event_data?.section || e.metadata?.section) === 'about'), 'SECTION_EXIT');
  const identityTime = getSumDuration(sessionEvents, 'IDENTITY_EXIT');
  const focusTime = getSumDuration(sessionEvents, 'FOCUS_EXIT');
  const googleTime = getSumDuration(sessionEvents, 'GOOGLE_SECTION_EXIT');
  const comptiaTime = getSumDuration(sessionEvents, 'COMPTIA_SECTION_EXIT');

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-muted hover:text-[#E4002B] transition-colors"
      >
        ← Return to Visitor Dossier
      </button>

      <div className="bg-surface/5 border border-surface p-6 rounded-sm space-y-8">
        
        {/* Header */}
        <div className="border-b border-surface pb-6">
          <h2 className="text-lg font-mono text-foreground uppercase tracking-widest mb-2 flex items-center gap-3">
            <Shield className="text-[#E4002B]" size={18} />
            Session Dossier
          </h2>
          <p className="text-xs text-muted font-mono tracking-widest uppercase">
            Isolated Forensic Analysis • Session ID: {session.session_id}
          </p>
        </div>

        {/* Session Summary Table */}
        <div>
          <h3 className="text-xs font-mono text-muted uppercase tracking-widest border-b border-surface pb-2 mb-4">
            Session Summary
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 text-xs font-mono">
            <div className="space-y-2">
              <div className="flex justify-between"><span className="text-muted">Session ID:</span> <span className="text-foreground truncate ml-2" title={session.session_id}>{session.session_id.substring(0, 12)}...</span></div>
              <div className="flex justify-between"><span className="text-muted">Visitor ID:</span> <span className="text-foreground truncate ml-2" title={session.visitor_id}>{session.visitor_id.substring(0, 12)}...</span></div>
              <div className="flex justify-between"><span className="text-muted">Start:</span> <span className="text-foreground">{format(new Date(session.created_at), 'MMM d, yyyy HH:mm:ss')}</span></div>
              <div className="flex justify-between"><span className="text-muted">Ended:</span> <span className="text-foreground">{session._isOnline ? 'Active' : format(new Date(session.updated_at || session.created_at), 'MMM d, yyyy HH:mm:ss')}</span></div>
              <div className="flex justify-between">
                <span className="text-muted">Duration:</span> 
                <span className="text-foreground">
                  {session._isOnline ? <span className="text-emerald-500 animate-pulse flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div> Running... {session._duration > 60 ? `${Math.floor(session._duration / 60)}m ${session._duration % 60}s` : `${session._duration}s`}</span> : (session._duration > 60 ? `${Math.floor(session._duration / 60)}m ${session._duration % 60}s` : `${session._duration}s`)}
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between"><span className="text-muted">Entry Section:</span> <span className="text-emerald-500 capitalize">{session._entry || 'Unknown'}</span></div>
              <div className="flex justify-between"><span className="text-muted">Exit Section:</span> <span className="text-[#E4002B] capitalize">{session._isOnline ? 'Active' : (session._exit || 'Unknown')}</span></div>
              <div className="flex justify-between"><span className="text-muted">Sections Visited:</span> <span className="text-foreground">{new Set(sessionEvents.filter(e => e.event_type.includes('SECTION_ENTER')).map(e => e.event_data?.section || e.event_name)).size}</span></div>
              <div className="flex justify-between"><span className="text-muted">Max Scroll Depth:</span> <span className="text-foreground">{Math.max(0, ...sessionEvents.map(e => e.event_data?.scroll_depth || e.metadata?.scroll_depth || 0))}%</span></div>
              <div className="flex justify-between"><span className="text-muted">Bounce:</span> <span className="text-foreground">{session.bounced || session._duration < 10 ? 'YES' : 'NO'}</span></div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between"><span className="text-muted">Projects Viewed:</span> <span className="text-foreground">{projects.length / 2 /* open/close pairs roughly */}</span></div>
              <div className="flex justify-between"><span className="text-muted">Certs Viewed:</span> <span className="text-foreground">{certs.filter(c => c.event_type.includes('OPEN')).length}</span></div>
              <div className="flex justify-between"><span className="text-muted">Commands Run:</span> <span className="text-foreground">{terminals.length}</span></div>
              <div className="flex justify-between"><span className="text-muted">Forms Submitted:</span> <span className="text-foreground">{contacts.length}</span></div>
              <div className="flex justify-between"><span className="text-muted">Referrer:</span> <span className="text-foreground truncate max-w-[120px]" title={session.referrer}>{session.referrer || 'Direct'}</span></div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between"><span className="text-muted">Device / OS:</span> <span className="text-foreground truncate" title={`${visitor.device_type} / ${visitor.os}`}>{visitor.device_type} / {visitor.os}</span></div>
              <div className="flex justify-between"><span className="text-muted">Browser:</span> <span className="text-foreground truncate" title={visitor.browser}>{visitor.browser} {visitor.browser_version}</span></div>
              <div className="flex justify-between"><span className="text-muted">IP:</span> <span className="text-emerald-500">{visitor.public_ip || 'Unknown'}</span></div>
              <div className="flex justify-between"><span className="text-muted">Location:</span> <span className="text-foreground text-right truncate" title={visitor.city ? visitor.city+", "+visitor.country : visitor.country}>{visitor.city ? visitor.city+", " : ""}{visitor.country}</span></div>
            </div>
          </div>
        </div>

        {/* Section Journey */}
        <div>
          <h3 className="text-xs font-mono text-muted uppercase tracking-widest border-b border-surface pb-2 mb-4">
            Section Journey
          </h3>
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
            {(() => {
              // Reconstruct journey from SECTION_ENTER and SECTION_EXIT events
              const enters = sessionEvents.filter(e => e.event_type === 'SECTION_ENTER').sort((a,b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
              const exits = sessionEvents.filter(e => e.event_type === 'SECTION_EXIT').sort((a,b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
              const views = sessionEvents.filter(e => e.event_type === 'SECTION_VIEW').sort((a,b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
              
              const journeyNodes: any[] = [];
              
              if (enters.length > 0) {
                enters.forEach((enter, idx) => {
                  const section = enter.event_data?.section || enter.metadata?.section || 'Unknown';
                  // Find first exit for this section after enter
                  const exit = exits.find(ex => (ex.event_data?.section || ex.metadata?.section) === section && new Date(ex.created_at) >= new Date(enter.created_at));
                  journeyNodes.push({
                    id: enter.id,
                    section: section,
                    enterTime: new Date(enter.created_at),
                    exitTime: exit ? new Date(exit.created_at) : null,
                    duration: exit?.event_data?.duration_seconds || exit?.metadata?.duration_seconds || null,
                    scrollDepth: exit?.event_data?.scroll_depth || exit?.metadata?.scroll_depth || 0
                  });
                });
              } else if (views.length > 0) {
                 // Backwards compat
                 views.forEach(v => {
                   journeyNodes.push({
                     id: v.id,
                     section: v.event_data?.section || v.metadata?.section || 'Unknown',
                     enterTime: new Date(v.created_at), // not strictly enter time, but what we have
                     exitTime: new Date(v.created_at),
                     duration: v.event_data?.duration_seconds || v.metadata?.duration_seconds || null,
                     scrollDepth: 0
                   });
                 });
              }

              if (journeyNodes.length === 0) {
                return <span className="text-muted italic">No section tracking recorded.</span>;
              }

              return journeyNodes.map((node, i) => (
                <div key={node.id} className="flex items-center gap-2">
                  <div className="bg-surface/30 border border-surface px-3 py-1.5 rounded-sm flex flex-col">
                    <span className="text-blue-400 capitalize">{node.section}</span>
                    <div className="flex gap-3 text-[9px] text-muted mt-1">
                      <span>In: {format(node.enterTime, 'HH:mm:ss')}</span>
                      {node.exitTime && <span>Out: {format(node.exitTime, 'HH:mm:ss')}</span>}
                      {node.duration !== null && node.duration > 0 && <span>{node.duration}s</span>}
                      {node.scrollDepth > 0 && <span>Scroll: {node.scrollDepth}%</span>}
                    </div>
                  </div>
                  {i < journeyNodes.length - 1 && <ChevronRight size={14} className="text-muted" />}
                </div>
              ));
            })()}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Project Analytics */}
          <div className="border border-surface bg-background p-5 rounded-sm">
            <h3 className="text-[10px] font-mono text-muted uppercase tracking-widest mb-4 flex items-center gap-2">
              <LayoutDashboard size={12} /> Project Analytics
            </h3>
            {Array.from(projectMap.entries()).length > 0 ? (
              <div className="space-y-4">
                {Array.from(projectMap.entries()).map(([name, data]) => (
                  <div key={name} className="text-xs font-mono border-b border-surface/50 pb-2 last:border-0">
                    <div className="text-foreground font-semibold mb-1">{name}</div>
                    {data.opens.map((open: any, i: number) => {
                      const close = data.closes[i];
                      return (
                        <div key={i} className="flex justify-between text-[10px] text-muted ml-2">
                          <span>Opened: {format(new Date(open.created_at), 'HH:mm:ss')}</span>
                          <span>{close ? `Closed: ${format(new Date(close.created_at), 'HH:mm:ss')}` : 'Active'}</span>
                          {close && close.event_data?.duration_seconds && <span>{close.event_data.duration_seconds}s viewed</span>}
                        </div>
                      )
                    })}
                  </div>
                ))}
              </div>
            ) : <p className="text-[10px] text-muted/50 font-mono italic">No projects viewed.</p>}
          </div>

          {/* About Analytics */}
          <div className="border border-surface bg-background p-5 rounded-sm">
            <h3 className="text-[10px] font-mono text-muted uppercase tracking-widest mb-4 flex items-center gap-2">
              <Activity size={12} /> About Analytics
            </h3>
            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between border-b border-surface/50 pb-1">
                <span className="text-foreground">Total About Time:</span>
                <span className="text-muted">{aboutTotalTime}s</span>
              </div>
              <div className="flex justify-between border-b border-surface/50 pb-1">
                <span className="text-foreground">Identity Section:</span>
                <span className="text-muted">{identityTime}s</span>
              </div>
              <div className="flex justify-between border-b border-surface/50 pb-1">
                <span className="text-foreground">Focus Section:</span>
                <span className="text-muted">{focusTime}s</span>
              </div>
              <div className="flex justify-between border-b border-surface/50 pb-1">
                <span className="text-foreground">Google Certifications:</span>
                <span className="text-muted">{googleTime}s</span>
              </div>
              <div className="flex justify-between">
                <span className="text-foreground">CompTIA Certifications:</span>
                <span className="text-muted">{comptiaTime}s</span>
              </div>
            </div>
          </div>

          {/* Certificate Analytics */}
          <div className="border border-surface bg-background p-5 rounded-sm">
            <h3 className="text-[10px] font-mono text-muted uppercase tracking-widest mb-4 flex items-center gap-2">
              <Shield size={12} /> Certificate Analytics
            </h3>
            {Array.from(certMap.entries()).length > 0 ? (
              <div className="space-y-4 max-h-[250px] overflow-y-auto pr-2">
                <div className="grid grid-cols-2 gap-2 text-xs font-mono border-b border-surface pb-3 mb-3">
                  <div className="bg-surface/10 p-2 rounded-sm text-center">
                    <div className="text-muted text-[9px] mb-1">Specializations</div>
                    <div className="text-foreground">{sessionEvents.filter(e => e.event_type === 'GOOGLE_SPECIALIZATION_OPEN').length}</div>
                  </div>
                  <div className="bg-surface/10 p-2 rounded-sm text-center">
                    <div className="text-muted text-[9px] mb-1">Courses Viewed</div>
                    <div className="text-foreground">{sessionEvents.filter(e => e.event_type === 'GOOGLE_COURSE_OPEN').length}</div>
                  </div>
                  <div className="bg-surface/10 p-2 rounded-sm text-center">
                    <div className="text-muted text-[9px] mb-1">Verify Clicks</div>
                    <div className="text-amber-500">{sessionEvents.filter(e => e.event_type === 'GOOGLE_VERIFY_CLICK' || e.event_type === 'CERTIFICATE_VERIFY').length}</div>
                  </div>
                  <div className="bg-surface/10 p-2 rounded-sm text-center">
                    <div className="text-muted text-[9px] mb-1">Avg Course Time</div>
                    <div className="text-foreground">
                      {Math.round(getSumDuration(sessionEvents, 'GOOGLE_COURSE_CLOSE') / Math.max(sessionEvents.filter(e => e.event_type === 'GOOGLE_COURSE_CLOSE').length, 1))}s
                    </div>
                  </div>
                </div>

                {Array.from(certMap.entries()).map(([name, data]) => (
                  <div key={name} className="text-xs font-mono border-b border-surface/50 pb-2 last:border-0">
                    <div className="text-foreground font-semibold mb-1">{name}</div>
                    {data.opens.map((open: any, i: number) => {
                      const close = data.closes[i];
                      return (
                        <div key={i} className="flex justify-between text-[10px] text-muted ml-2 mb-1">
                          <span>Opened: {format(new Date(open.created_at), 'HH:mm:ss')}</span>
                          <span>{close ? `Closed: ${format(new Date(close.created_at), 'HH:mm:ss')}` : 'Active'}</span>
                          {close && (close.event_data?.duration_seconds || close.metadata?.duration_seconds) && <span>{close.event_data?.duration_seconds || close.metadata?.duration_seconds}s viewed</span>}
                        </div>
                      )
                    })}
                    {data.verifies.length > 0 && (
                      <div className="text-amber-500 text-[10px] ml-2 mt-1">Verified {data.verifies.length} time(s)</div>
                    )}
                  </div>
                ))}
              </div>
            ) : <p className="text-[10px] text-muted/50 font-mono italic">No certificates viewed.</p>}
          </div>

          {/* Resume & Terminal */}
          <div className="border border-surface bg-background p-5 rounded-sm space-y-6">
            <div>
              <h3 className="text-[10px] font-mono text-muted uppercase tracking-widest mb-3 flex items-center gap-2">
                <FileText size={12} /> Resume Analytics
              </h3>
              {resumes.length > 0 ? (
                <div className="space-y-2">
                  {resumes.map((r, i) => (
                    <div key={i} className="flex justify-between text-xs font-mono">
                      <span className={r.event_type === 'RESUME_DOWNLOAD' ? 'text-[#E4002B]' : 'text-foreground'}>
                        {r.event_type === 'RESUME_DOWNLOAD' ? 'Download' : 'Preview'}
                      </span>
                      <span className="text-muted text-[10px]">{format(new Date(r.created_at), 'HH:mm:ss')}</span>
                    </div>
                  ))}
                </div>
              ) : <p className="text-[10px] text-muted/50 font-mono italic">No resume activity.</p>}
            </div>

            <div className="border-t border-surface pt-4">
              <h3 className="text-[10px] font-mono text-muted uppercase tracking-widest mb-3 flex items-center gap-2">
                <Terminal size={12} /> Terminal Analytics
              </h3>
              {terminals.length > 0 ? (
                <div className="space-y-2 max-h-[150px] overflow-y-auto">
                  {terminals.map((t, i) => (
                    <div key={i} className="text-xs font-mono bg-surface/30 px-3 py-2 rounded-sm border border-surface border-dashed">
                      <div className="flex justify-between mb-1">
                        <span className="text-emerald-500">$ {t.event_data?.command || t.metadata?.command || t.event_name}</span>
                        <span className="text-muted text-[9px]">{format(new Date(t.created_at), 'HH:mm:ss')}</span>
                      </div>
                      {t.event_data?.result && (
                        <div className="text-muted text-[10px] mt-1 whitespace-pre-wrap truncate max-h-[40px]">{t.event_data.result}</div>
                      )}
                    </div>
                  ))}
                </div>
              ) : <p className="text-[10px] text-muted/50 font-mono italic">No terminal commands.</p>}
            </div>
          </div>

          {/* Contact Form */}
          <div className="border border-surface bg-background p-5 rounded-sm">
            <h3 className="text-[10px] font-mono text-muted uppercase tracking-widest mb-4 flex items-center gap-2">
              <Mail size={12} /> Contact Submitted
            </h3>
            {contacts.length > 0 ? (
              <div className="space-y-4">
                {contacts.map((c, i) => (
                  <div key={i} className="text-xs font-mono bg-surface/10 p-3 rounded-sm border border-surface">
                    <div className="flex justify-between mb-2 pb-2 border-b border-surface">
                      <span className="text-foreground">Submitted at:</span>
                      <span className="text-muted">{format(new Date(c.created_at), 'HH:mm:ss')}</span>
                    </div>
                    <div className="space-y-1 text-muted">
                      <div><span className="text-foreground">Intent:</span> {c.event_data?.intent || 'Unknown'}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : <p className="text-[10px] text-muted/50 font-mono italic">No contact forms submitted.</p>}
          </div>
        </div>

        {/* Forensic Timeline */}
        <div>
          <h3 className="text-xs font-mono text-muted uppercase tracking-widest border-b border-surface pb-2 mb-6">
            Session Timeline
          </h3>
          <div className="relative border-l border-surface-strong ml-3 space-y-6">
            {timeline.length > 0 ? timeline.map((item, i) => (
              <div key={i} className="relative pl-6">
                <div className={`absolute left-[-4.5px] top-1.5 w-2 h-2 rounded-full ring-4 ring-background ${item.type === 'page_view' ? 'bg-blue-500' : 'bg-amber-500'}`}></div>
                <div className="flex gap-4">
                  <div className="text-[10px] text-muted font-mono w-16 pt-0.5">
                    {format(item.time, 'HH:mm:ss')}
                  </div>
                  <div className="flex-1">
                    {item.type === 'page_view' ? (
                      <p className="text-xs font-mono text-blue-400">
                        Visitor Arrived / Viewed {item.data.path}
                      </p>
                    ) : (
                      <div className="text-xs font-mono text-amber-500">
                        {item.data.event_type === 'GOOGLE_SPECIALIZATION_OPEN' && `Opened Google Specialization: ${item.data.event_data?.title || item.data.metadata?.title || 'Unknown'}`}
                        {item.data.event_type === 'GOOGLE_SPECIALIZATION_CLOSE' && `Closed Google Specialization: ${item.data.event_data?.title || item.data.metadata?.title || 'Unknown'} (${item.data.event_data?.duration_seconds || item.data.metadata?.duration_seconds || 0}s)`}
                        {item.data.event_type === 'GOOGLE_COURSE_OPEN' && `Opened Google Course: ${item.data.event_data?.course || item.data.metadata?.course || 'Unknown'}`}
                        {item.data.event_type === 'GOOGLE_COURSE_CLOSE' && `Closed Google Course: ${item.data.event_data?.course || item.data.metadata?.course || 'Unknown'} (${item.data.event_data?.duration_seconds || item.data.metadata?.duration_seconds || 0}s)`}
                        {item.data.event_type === 'GOOGLE_VERIFY_CLICK' && `Verified Google Credential: ${item.data.event_data?.title || item.data.metadata?.title || 'Unknown'} (${item.data.event_data?.type || item.data.metadata?.type || ''})`}
                        {item.data.event_type === 'COMPTIA_SECTION_ENTER' && `Entered CompTIA Certifications`}
                        {item.data.event_type === 'COMPTIA_SECTION_EXIT' && `Exited CompTIA Certifications (${item.data.event_data?.duration_seconds || item.data.metadata?.duration_seconds || 0}s)`}
                        {item.data.event_type === 'GOOGLE_SECTION_ENTER' && `Entered Google Certifications`}
                        {item.data.event_type === 'GOOGLE_SECTION_EXIT' && `Exited Google Certifications (${item.data.event_data?.duration_seconds || item.data.metadata?.duration_seconds || 0}s)`}
                        {item.data.event_type === 'IDENTITY_ENTER' && `Entered Identity Section`}
                        {item.data.event_type === 'IDENTITY_EXIT' && `Exited Identity Section (${item.data.event_data?.duration_seconds || item.data.metadata?.duration_seconds || 0}s)`}
                        {item.data.event_type === 'FOCUS_ENTER' && `Entered Focus Section`}
                        {item.data.event_type === 'FOCUS_EXIT' && `Exited Focus Section (${item.data.event_data?.duration_seconds || item.data.metadata?.duration_seconds || 0}s)`}
                        {item.data.event_type === 'PROJECT_OPEN' && `Opened Project: ${item.data.event_data?.project || item.data.metadata?.project || 'Unknown'}`}
                        {item.data.event_type === 'PROJECT_CLOSE' && `Closed Project: ${item.data.event_data?.project || item.data.metadata?.project || 'Unknown'} (${item.data.event_data?.duration_seconds || item.data.metadata?.duration_seconds || 0}s)`}
                        {item.data.event_type === 'CERTIFICATE_OPEN' && `Opened Certificate: ${item.data.event_data?.title || item.data.metadata?.title || 'Unknown'}`}
                        {item.data.event_type === 'CERTIFICATE_VERIFY' && `Verified Certificate: ${item.data.event_data?.title || item.data.metadata?.title || 'Unknown'}`}
                        {item.data.event_type === 'CERTIFICATE_CLOSE' && `Closed Certificate: ${item.data.event_data?.title || item.data.metadata?.title || 'Unknown'}`}
                        {item.data.event_type === 'SECTION_VIEW' && `Viewed Section: ${item.data.event_data?.section || item.data.metadata?.section || 'Unknown'}`}
                        {item.data.event_type === 'SECTION_ENTER' && `Entered Section: ${item.data.event_data?.section || item.data.metadata?.section || 'Unknown'}`}
                        {item.data.event_type === 'SECTION_EXIT' && `Exited Section: ${item.data.event_data?.section || item.data.metadata?.section || 'Unknown'} (${item.data.event_data?.duration_seconds || item.data.metadata?.duration_seconds || 0}s, scroll: ${item.data.event_data?.scroll_depth || item.data.metadata?.scroll_depth || 0}%)`}
                        {item.data.event_type === 'CTA_CLICK' && `CTA Click: ${item.data.event_data?.target || item.data.metadata?.target || 'Unknown'}`}
                        {item.data.event_type === 'SOCIAL_CLICK' && `Social Click: ${item.data.event_data?.platform || item.data.metadata?.platform || 'Unknown'}`}
                        {item.data.event_type === 'GITHUB_CLICK' && `GitHub Click: ${item.data.event_data?.project || item.data.metadata?.project || 'Unknown'}`}
                        {item.data.event_type === 'DEMO_CLICK' && `Live Demo Click: ${item.data.event_data?.project || item.data.metadata?.project || 'Unknown'}`}
                        {item.data.event_type === 'SKILL_INTERACT' && `Skill Click: ${item.data.event_data?.skill || item.data.metadata?.skill || 'Unknown'}`}
                        {item.data.event_type === 'ERROR' && `Error: ${item.data.event_data?.context || item.data.metadata?.context || 'Unknown'} ${JSON.stringify(item.data.event_data?.fields || item.data.metadata?.fields || [])}`}
                        {item.data.event_type === 'RESUME_DOWNLOAD' && 'Downloaded Resume'}
                        {item.data.event_type === 'RESUME_VIEW' && 'Previewed Resume'}
                        {item.data.event_type === 'CONTACT_SUBMIT' && `Contact Form: ${item.data.event_data?.action || item.data.metadata?.action || 'submitted'} (${item.data.event_data?.intent || item.data.metadata?.intent || 'unknown'})`}
                        {item.data.event_type === 'TERMINAL_COMMAND' && `Command: ${item.data.event_data?.raw || item.data.metadata?.raw || item.data.event_name} [${(item.data.event_data?.success || item.data.metadata?.success) ? 'Success' : 'Fail'} in ${item.data.event_data?.duration_ms || item.data.metadata?.duration_ms || 0}ms]`}
                        {![
                          'PROJECT_OPEN', 'PROJECT_CLOSE', 'CERTIFICATE_OPEN', 'CERTIFICATE_CLOSE', 'CERTIFICATE_VERIFY', 'SECTION_VIEW', 
                          'SECTION_ENTER', 'SECTION_EXIT', 'CTA_CLICK', 'SOCIAL_CLICK', 'GITHUB_CLICK', 'DEMO_CLICK', 'SKILL_INTERACT', 'ERROR',
                          'RESUME_DOWNLOAD', 'RESUME_VIEW', 'CONTACT_SUBMIT', 'TERMINAL_COMMAND',
                          'GOOGLE_SPECIALIZATION_OPEN', 'GOOGLE_SPECIALIZATION_CLOSE', 'GOOGLE_COURSE_OPEN', 'GOOGLE_COURSE_CLOSE', 'GOOGLE_VERIFY_CLICK',
                          'COMPTIA_SECTION_ENTER', 'COMPTIA_SECTION_EXIT', 'GOOGLE_SECTION_ENTER', 'GOOGLE_SECTION_EXIT',
                          'IDENTITY_ENTER', 'IDENTITY_EXIT', 'FOCUS_ENTER', 'FOCUS_EXIT'
                        ].includes(item.data.event_type) && `Action: ${item.data.event_type}`}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )) : (
              <p className="text-[10px] text-muted/50 font-mono italic pl-6">No timeline events recorded.</p>
            )}
          </div>
        </div>

        {/* Raw Event Log */}
        <div>
          <button 
            onClick={() => setShowRawLog(!showRawLog)}
            className="flex items-center gap-2 text-xs font-mono text-muted uppercase tracking-widest border-b border-surface pb-2 mb-4 w-full text-left hover:text-foreground transition-colors"
          >
            <FileJson size={14} />
            Raw Event Log (Forensics)
            <span className="ml-auto">{showRawLog ? '−' : '+'}</span>
          </button>
          
          {showRawLog && (
            <div className="bg-background border border-surface p-4 rounded-sm overflow-x-auto max-h-[400px] overflow-y-auto">
              <pre className="text-[10px] font-mono text-muted whitespace-pre-wrap">
                {JSON.stringify(timeline, null, 2)}
              </pre>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
