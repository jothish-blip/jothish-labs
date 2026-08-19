'use client';

import { useState } from 'react';
import { formatDistanceToNow, format } from 'date-fns';
import { Monitor, Globe, Activity, Ban, LogOut } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

type Session = {
  id: string;
  admin_id: string;
  session_token: string;
  ip_address: string;
  country: string;
  browser: string;
  device: string;
  os: string;
  current_page: string;
  started_at: string;
  last_activity_at: string;
  expires_at: string;
  is_revoked: boolean;
};

export default function SessionsClient({ initialSessions }: { initialSessions: Session[] }) {
  const [sessions, setSessions] = useState(initialSessions);
  const supabase = createClient();
  const router = useRouter();

  const handleRevoke = async (id: string) => {
    if (!confirm('Revoke this session? The user will be logged out immediately.')) return;
    
    await supabase.from('portfolio_admin_sessions').update({ is_revoked: true }).eq('id', id);
    setSessions(prev => prev.filter(s => s.id !== id));
    router.refresh();
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-surface flex justify-between items-center bg-surface/5">
        <h2 className="text-[10px] font-mono uppercase tracking-widest text-muted">Active Admin Sessions</h2>
        <span className="text-[9px] font-mono text-emerald-500 uppercase tracking-widest px-2 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-sm">
          {sessions.length} Active
        </span>
      </div>
      
      <div className="flex-1 overflow-auto custom-scrollbar p-4">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {sessions.length > 0 ? sessions.map(session => (
            <div key={session.id} className="bg-surface/5 border border-surface p-4 rounded-sm hover:border-surface-strong transition-colors group">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-surface flex items-center justify-center text-muted group-hover:text-foreground transition-colors">
                    <Activity size={14} />
                  </div>
                  <div>
                    <p className="font-mono text-sm text-foreground truncate max-w-[200px]" title={session.admin_id}>{session.admin_id}</p>
                    <p className="text-[9px] font-mono uppercase tracking-widest text-emerald-500 flex items-center gap-1 mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Active Now
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => handleRevoke(session.id)}
                    className="p-1.5 text-muted hover:text-[#E4002B] hover:bg-[#E4002B]/10 rounded-sm transition-colors"
                    title="Force Logout / Revoke"
                  >
                    <Ban size={14} />
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-xs font-mono mb-4 border-t border-surface pt-4">
                 <div>
                   <p className="text-[9px] uppercase tracking-widest text-muted mb-1 flex items-center gap-1.5"><Globe size={10} /> Network</p>
                   <p className="text-foreground">{session.ip_address}</p>
                   <p className="text-[10px] text-muted">{session.country}</p>
                 </div>
                 <div>
                   <p className="text-[9px] uppercase tracking-widest text-muted mb-1 flex items-center gap-1.5"><Monitor size={10} /> Client</p>
                   <p className="text-foreground">{session.browser}</p>
                   <p className="text-[10px] text-muted">{session.os} ({session.device})</p>
                 </div>
              </div>

              <div className="flex justify-between items-end border-t border-surface pt-4">
                 <div>
                   <p className="text-[9px] font-mono uppercase tracking-widest text-muted mb-1">Current Page</p>
                   <p className="font-mono text-[10px] bg-surface/30 px-2 py-1 rounded-sm text-foreground inline-block border border-surface-strong">
                     {session.current_page || '/ops'}
                   </p>
                 </div>
                 <div className="text-right">
                   <p className="text-[9px] font-mono text-muted">Started: {format(new Date(session.started_at), 'HH:mm')}</p>
                   <p className="text-[9px] font-mono text-muted">Last seen: {formatDistanceToNow(new Date(session.last_activity_at))} ago</p>
                 </div>
              </div>
            </div>
          )) : (
            <div className="col-span-full py-12 flex flex-col items-center justify-center text-muted">
               <LogOut size={32} className="opacity-20 mb-4" />
               <p className="text-[10px] font-mono uppercase tracking-widest">No active sessions found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
