'use client';

import { useState } from 'react';
import { formatDistanceToNow, format } from 'date-fns';
import { Search, Monitor, Globe, Clock, Crosshair, ArrowUpRight, ArrowLeftRight, Activity } from 'lucide-react';
import VisitorDossier from './VisitorDossier';

type Visitor = {
  id: string;
  visitor_id: string;
  first_visit: string;
  last_visit: string;
  total_visits: number;
  total_time_spent: number;
  browser: string;
  device_type: string;
  os: string;
  country: string;
  region: string;
  city: string;
};

type Session = {
  id: string;
  session_id: string;
  entry_page: string;
  exit_page: string;
  duration: number;
  bounced: boolean;
  created_at: string;
};

type Props = {
  visitors: Visitor[];
  recentSessions: Session[];
};

export default function VisitorsClient({ visitors, recentSessions }: Props) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVisitor, setSelectedVisitor] = useState<Visitor | null>(null);

  const filteredVisitors = visitors.filter(v => 
    v.visitor_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (v.browser && v.browser.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-8">
      <header className="mb-10 border-b border-surface pb-6 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight uppercase text-foreground">
            Visitor Intelligence
          </h1>
          <p className="text-muted text-sm font-mono mt-2 tracking-widest uppercase">
            Forensic Traffic Telemetry
          </p>
        </div>
      </header>

      {selectedVisitor ? (
        <VisitorDossier 
          visitorId={selectedVisitor.visitor_id} 
          onBack={() => setSelectedVisitor(null)} 
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
              <input 
                type="text" 
                placeholder="Search visitors by ID or User Agent..." 
                className="w-full bg-surface/10 border border-surface rounded-sm pl-9 pr-4 py-3 text-xs font-mono focus:outline-none focus:border-surface-strong text-foreground transition-colors"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="bg-surface/5 border border-surface rounded-sm overflow-hidden">
              <table className="w-full text-left font-mono text-sm">
                <thead className="bg-surface/30 text-[10px] uppercase tracking-[0.2em] text-muted border-b border-surface">
                  <tr>
                    <th className="px-4 py-3 font-normal">Status</th>
                    <th className="px-4 py-3 font-normal">Visitor ID</th>
                    <th className="px-4 py-3 font-normal">Environment</th>
                    <th className="px-4 py-3 font-normal text-right">Visits</th>
                    <th className="px-4 py-3 font-normal text-right">Last Active</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface text-xs">
                  {filteredVisitors.length > 0 ? (
                    filteredVisitors.map((v) => {
                      const isOnline = new Date().getTime() - new Date(v.last_visit).getTime() < 5 * 60 * 1000;
                      return (
                      <tr key={v.id} onClick={() => setSelectedVisitor(v)} className="hover:bg-surface/10 transition-colors cursor-pointer group">
                        <td className="px-4 py-3">
                          {isOnline ? (
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                          ) : (
                            <div className="w-2 h-2 rounded-full bg-surface-strong"></div>
                          )}
                        </td>
                        <td className="px-4 py-3 text-muted group-hover:text-foreground transition-colors flex items-center gap-2">
                          <Crosshair size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                          <span className="truncate max-w-[100px] md:max-w-[150px]" title={v.visitor_id}>
                            {v.visitor_id.substring(0, 12)}...
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-col">
                            <span className="text-foreground truncate max-w-[150px] md:max-w-[200px]" title={v.browser}>{v.browser || 'Unknown User Agent'}</span>
                            <span className="text-[9px] text-muted">{v.device_type}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-foreground text-right">{v.total_visits}</td>
                        <td className="px-4 py-3 text-muted text-right">
                          {formatDistanceToNow(new Date(v.last_visit), { addSuffix: true })}
                        </td>
                      </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-muted uppercase tracking-widest text-[10px]">No visitor telemetry matches your query.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-surface/5 border border-surface rounded-sm p-5">
              <h3 className="text-[10px] font-mono text-muted uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                <Monitor size={12} /> Recent Sessions
              </h3>
              <div className="space-y-4">
                {recentSessions && recentSessions.length > 0 ? recentSessions.map(session => (
                  <div key={session.id} className="border-l-2 border-surface-strong pl-3">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[10px] font-mono text-foreground truncate w-24" title={session.session_id}>
                        {session.session_id.substring(0, 8)}...
                      </span>
                      <span className="text-[9px] font-mono text-muted">
                        {formatDistanceToNow(new Date(session.created_at), { addSuffix: true })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-mono text-muted">
                      <span className="truncate w-16">{session.entry_page}</span>
                      <ArrowLeftRight size={10} />
                      <span className="truncate w-16">{session.exit_page || 'Active'}</span>
                    </div>
                  </div>
                )) : (
                  <p className="text-[10px] font-mono text-muted uppercase tracking-widest">No active sessions</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
