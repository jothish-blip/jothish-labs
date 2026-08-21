'use client';

import { useState, useEffect, useRef } from 'react';
import { formatDistanceToNow, format } from 'date-fns';
import { Search, Monitor, Globe, Clock, Crosshair, ArrowUpRight, ArrowLeftRight, Activity } from 'lucide-react';
import { useRouter } from 'next/navigation';
import VisitorDossier from './VisitorDossier';
import { createClient } from '@/utils/supabase/client';

type Visitor = {
  id: string;
  visitor_id: string;
  first_visit: string;
  last_visit: string;
  total_visits: number;
  total_time_spent: number;
  browser: string;
  browser_version: string;
  device_type: string;
  os: string;
  os_version: string;
  country: string;
  region: string;
  city: string;
  public_ip: string;
  isp: string;
  timezone: string;
  language: string;
  screen_width: number;
  screen_height: number;
  referrer: string;
  visitor_name?: string;
  cookie_consent?: boolean;
  policy_accepted?: boolean;
  accepted_at?: string;
  policy_version?: string;
  cookie_version?: string;
};

type Props = {
  visitors: Visitor[];
  recentSessions: any[];
};

export default function VisitorsClient({ visitors: initialVisitors, recentSessions }: Props) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVisitor, setSelectedVisitor] = useState<Visitor | null>(null);
  const [visitors, setVisitors] = useState<Visitor[]>(initialVisitors);
  const [mounted, setMounted] = useState(false);
  const supabaseRef = useRef(createClient());
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const supabase = supabaseRef.current;
    let retryCount = 0;
    let retryTimer: ReturnType<typeof setTimeout> | null = null;
    let channel: ReturnType<typeof supabase.channel> | null = null;
    let isComponentMounted = true;
    
    const connectChannel = () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
      
      channel = supabase
        .channel('visitors-feed')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'portfolio_visitors' },
          (payload: any) => {
            if (!isComponentMounted) return;
            
            if (payload.eventType === 'INSERT') {
              setVisitors(prev => [payload.new as Visitor, ...prev]);
            } else if (payload.eventType === 'UPDATE') {
              setVisitors(prev => prev.map(v => v.visitor_id === (payload.new as Visitor).visitor_id ? (payload.new as Visitor) : v));
            } else if (payload.eventType === 'DELETE') {
              setVisitors(prev => prev.filter(v => v.id !== payload.old.id));
            }
          }
        );
        
      channel.subscribe((status: string) => {
        if (status === 'SUBSCRIBED') {
          retryCount = 0;
        }
        if (status === 'CHANNEL_ERROR' || status === 'CLOSED') {
          // Unlimited retries with exponential backoff (max 30s)
          if (isComponentMounted) {
            retryCount++;
            const delay = Math.min(2000 * Math.pow(1.5, retryCount - 1), 30000);
            retryTimer = setTimeout(() => {
              if (isComponentMounted) connectChannel();
            }, delay);
          }
        }
      });
    };

    connectChannel();

    return () => {
      isComponentMounted = false;
      if (retryTimer) clearTimeout(retryTimer);
      if (channel) supabase.removeChannel(channel);
    };
  }, []);

  const filteredVisitors = visitors.filter(v => 
    v.visitor_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (v.browser && v.browser.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (v.public_ip && v.public_ip.includes(searchTerm)) ||
    (v.city && v.city.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (v.visitor_name && v.visitor_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (v.device_type && v.device_type.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (v.country && v.country.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (v.os && v.os.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 25;
  const paginatedVisitors = filteredVisitors.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="space-y-8">
      <header className="mb-10 border-b border-surface pb-6 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight uppercase text-foreground">
            Visitor Intelligence
          </h1>
          <p className="text-muted text-sm font-mono mt-2 tracking-widest uppercase">
            Forensic Traffic Telemetry (Level 1)
          </p>
        </div>
      </header>

      {selectedVisitor ? (
        <VisitorDossier 
          visitorId={selectedVisitor.visitor_id} 
          onBack={() => setSelectedVisitor(null)} 
        />
      ) : (
        <div className="space-y-6">
          <div className="relative w-full max-w-md">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input 
              type="text" 
              placeholder="Search visitors by ID, IP, User Agent, Location..." 
              className="w-full bg-surface/10 border border-surface rounded-sm pl-9 pr-4 py-3 text-xs font-mono focus:outline-none focus:border-surface-strong text-foreground transition-colors"
              value={searchTerm}
              onChange={e => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
          {/* Pagination Controls */}
          <div className="flex justify-between items-center bg-surface/5 px-4 py-3 border border-surface rounded-sm mb-4">
            <span className="text-[10px] text-muted font-mono uppercase tracking-widest">
              Showing {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filteredVisitors.length)} of {filteredVisitors.length}
            </span>
            <div className="flex gap-2">
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-2 py-1 bg-surface/30 text-muted hover:text-foreground rounded-sm text-[10px] uppercase font-mono disabled:opacity-50 transition-colors"
              >
                Prev
              </button>
              <button 
                onClick={() => setCurrentPage(p => Math.min(Math.ceil(filteredVisitors.length / itemsPerPage), p + 1))}
                disabled={currentPage >= Math.ceil(filteredVisitors.length / itemsPerPage)}
                className="px-2 py-1 bg-surface/30 text-muted hover:text-foreground rounded-sm text-[10px] uppercase font-mono disabled:opacity-50 transition-colors"
              >
                Next
              </button>
            </div>
          </div>

          <div className="bg-surface/5 border border-surface rounded-sm overflow-hidden overflow-x-auto">
            <table className="w-full text-left font-mono text-xs whitespace-nowrap">
              <thead className="bg-surface/30 text-[10px] uppercase tracking-[0.2em] text-muted border-b border-surface">
                <tr>
                  <th className="px-4 py-3 font-normal">SR. NO</th>
                  <th className="px-4 py-3 font-normal">Status</th>
                  <th className="px-4 py-3 font-normal">Visitor / Name</th>
                  <th className="px-4 py-3 font-normal">IP & ISP</th>
                  <th className="px-4 py-3 font-normal">Location</th>
                  <th className="px-4 py-3 font-normal">Consent</th>
                  <th className="px-4 py-3 font-normal">Environment</th>
                  <th className="px-4 py-3 font-normal text-right">Sessions</th>
                  <th className="px-4 py-3 font-normal text-right">Time Spent</th>
                  <th className="px-4 py-3 font-normal">First Seen</th>
                  <th className="px-4 py-3 font-normal">Last Seen</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface">
                {paginatedVisitors.length > 0 ? (
                  paginatedVisitors.map((v, index) => {
                    const srNo = (currentPage - 1) * itemsPerPage + index + 1;
                    const isOnline = mounted && new Date().getTime() - new Date(v.last_visit).getTime() < 30 * 60 * 1000;
                    return (
                    <tr key={v.id} onClick={() => setSelectedVisitor(v)} className="hover:bg-surface/10 transition-colors cursor-pointer group">
                      <td className="px-4 py-3 text-muted">{srNo}</td>
                      <td className="px-4 py-3">
                        {isOnline ? (
                          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                        ) : (
                          <div className="w-2 h-2 rounded-full bg-surface-strong"></div>
                        )}
                      </td>
                      <td className="px-4 py-3 text-muted group-hover:text-foreground transition-colors">
                        <span className="flex flex-col gap-0.5">
                          <span className="text-foreground font-medium">{v.visitor_name && v.visitor_name !== 'Anonymous' ? v.visitor_name : `VIS-${v.visitor_id.substring(0, 6).toUpperCase()}`}</span>
                          <span className="flex items-center gap-1 text-[10px] opacity-70">
                            <Crosshair size={10} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                            <span title={v.visitor_id}>{v.visitor_id.substring(0, 8)}...</span>
                          </span>
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-col">
                          <span className="text-emerald-500">{v.public_ip || 'Unknown'}</span>
                          <span className="text-[9px] text-muted truncate max-w-[120px]" title={v.isp}>{v.isp || 'Unknown ISP'}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-col">
                          <span className="text-foreground truncate max-w-[120px]" title={v.city ? `${v.city}, ${v.country}` : v.country}>{v.city ? `${v.city}, ` : ''}{v.country || 'Unknown'}</span>
                          <span className="text-[9px] text-muted">{v.timezone}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-col gap-0.5">
                          {v.policy_accepted ? (
                            <span className="text-emerald-500 font-medium">Accepted</span>
                          ) : (
                            <span className="text-amber-500/70">Not Provided</span>
                          )}
                          {v.policy_accepted && (
                            <span className="text-[9px] text-muted">
                              v{v.policy_version} • {v.accepted_at ? format(new Date(v.accepted_at), 'dd MMM yyyy') : ''}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-col">
                          <span className="text-foreground truncate max-w-[150px]" title={`${v.browser} ${v.browser_version}`}>
                            {v.browser} {v.browser_version !== 'Unknown' && v.browser_version}
                          </span>
                          <span className="text-[9px] text-muted">
                            {v.os} • {v.device_type} • {v.screen_width}x{v.screen_height}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-foreground text-right">{v.total_visits}</td>
                      <td className="px-4 py-3 text-muted text-right">
                        {v.total_time_spent > 0 ? (
                          v.total_time_spent > 3600 
                            ? `${Math.floor(v.total_time_spent / 3600)}h ${Math.floor((v.total_time_spent % 3600) / 60)}m`
                            : v.total_time_spent > 60
                              ? `${Math.floor(v.total_time_spent / 60)}m ${v.total_time_spent % 60}s`
                              : `${v.total_time_spent}s`
                        ) : '0s'}
                      </td>
                      <td className="px-4 py-3 text-muted">
                        {format(new Date(v.first_visit), 'MMM d, yyyy')}
                      </td>
                      <td className="px-4 py-3 text-muted">
                        {mounted ? formatDistanceToNow(new Date(v.last_visit), { addSuffix: true }) : format(new Date(v.last_visit), 'MMM d, yyyy')}
                      </td>
                    </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={10} className="px-6 py-12 text-center text-muted uppercase tracking-widest text-[10px]">No visitor telemetry matches your query.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
