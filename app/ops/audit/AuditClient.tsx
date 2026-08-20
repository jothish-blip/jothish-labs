'use client';

import { useState, useMemo, useEffect } from 'react';
import { format } from 'date-fns';
import { Search, Filter, ShieldAlert, Activity, Monitor, Globe } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

type AdminLog = {
  id: string;
  action: string;
  actor: string;
  resource_type: string;
  resource_id?: string;
  ip_address?: string;
  created_at: string;
  location?: string;
  browser?: string;
  os?: string;
  details?: any;
};

type PortfolioLog = {
  id: string;
  created_at: string;
  event_type: string;
  event_name?: string;
  visitor_id: string;
  session_id: string;
  metadata?: any;
  event_data?: any;
};

export default function AuditClient({ initialAdminLogs, initialPortfolioLogs }: { initialAdminLogs: AdminLog[], initialPortfolioLogs: PortfolioLog[] }) {
  const [activeTab, setActiveTab] = useState<'admin' | 'portfolio'>('admin');
  
  // Admin Log State
  const [adminSearch, setAdminSearch] = useState('');
  const [adminFilter, setAdminFilter] = useState('');

  // Portfolio Log State
  const [portfolioSearch, setPortfolioSearch] = useState('');
  const [portfolioFilter, setPortfolioFilter] = useState('all');

  const [adminLogs, setAdminLogs] = useState(initialAdminLogs);
  const [portfolioLogs, setPortfolioLogs] = useState(initialPortfolioLogs);

  useEffect(() => {
    const supabase = createClient();
    const channelName = `audit-channel-${crypto.randomUUID()}`;
    
    const channel = supabase
      .channel(channelName)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'portfolio_audit_logs' }, (payload: any) => {
        setAdminLogs(prev => [payload.new as AdminLog, ...prev]);
      })
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'portfolio_events' }, (payload: any) => {
        setPortfolioLogs(prev => [payload.new as PortfolioLog, ...prev]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Filter Admin Logs
  const filteredAdminLogs = useMemo(() => {
    return adminLogs.filter(log => {
      const actorSafe = log.actor || 'System';
      const actionSafe = log.action || 'Unknown';
      const resourceSafe = log.resource_type || '';
      
      const matchesSearch = actorSafe.toLowerCase().includes(adminSearch.toLowerCase()) || 
                            actionSafe.toLowerCase().includes(adminSearch.toLowerCase()) ||
                            resourceSafe.toLowerCase().includes(adminSearch.toLowerCase());
                            
      const matchesAdminFilter = adminFilter === '' || actorSafe.toLowerCase().includes(adminFilter.toLowerCase());
      
      return matchesSearch && matchesAdminFilter;
    });
  }, [initialAdminLogs, adminSearch, adminFilter]);

  // Filter Portfolio Logs
  const filteredPortfolioLogs = useMemo(() => {
    return portfolioLogs.filter(log => {
      const typeSafe = log.event_type || '';
      const nameSafe = log.event_name || '';
      const vidSafe = log.visitor_id || '';
      
      const matchesSearch = typeSafe.toLowerCase().includes(portfolioSearch.toLowerCase()) || 
                            nameSafe.toLowerCase().includes(portfolioSearch.toLowerCase()) ||
                            vidSafe.toLowerCase().includes(portfolioSearch.toLowerCase());
                            
      const matchesFilter = portfolioFilter === 'all' || typeSafe === portfolioFilter;
      
      return matchesSearch && matchesFilter;
    });
  }, [portfolioLogs, portfolioSearch, portfolioFilter]);

  return (
    <div className="space-y-8 flex flex-col h-full">
      <header className="mb-6 border-b border-surface pb-6 shrink-0">
        <h1 className="text-3xl font-semibold tracking-tight uppercase text-foreground">
          Audit Center
        </h1>
        <p className="text-muted text-sm font-mono mt-2 tracking-widest uppercase">
          System-Wide Action Forensics & Telemetry
        </p>
      </header>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-surface pb-1 shrink-0">
        <button 
          onClick={() => setActiveTab('admin')}
          className={`flex items-center gap-2 px-4 py-2 font-mono text-xs uppercase tracking-widest transition-colors border-b-2 ${activeTab === 'admin' ? 'border-emerald-500 text-foreground' : 'border-transparent text-muted hover:text-foreground'}`}
        >
          <ShieldAlert size={14} className={activeTab === 'admin' ? 'text-emerald-500' : ''} />
          Admin Activity Logs
        </button>
        <button 
          onClick={() => setActiveTab('portfolio')}
          className={`flex items-center gap-2 px-4 py-2 font-mono text-xs uppercase tracking-widest transition-colors border-b-2 ${activeTab === 'portfolio' ? 'border-blue-500 text-foreground' : 'border-transparent text-muted hover:text-foreground'}`}
        >
          <Activity size={14} className={activeTab === 'portfolio' ? 'text-blue-500' : ''} />
          Portfolio Telemetry
        </button>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col gap-6">
        {activeTab === 'admin' && (
          <>
            {/* Admin Controls */}
            <div className="flex flex-col md:flex-row gap-4 justify-between bg-surface/10 p-4 border border-surface rounded-sm shrink-0">
              <div className="relative flex-1 max-w-md">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                <input 
                  type="text" 
                  placeholder="Search actions or resources..." 
                  className="w-full bg-background border border-surface rounded-sm pl-9 pr-4 py-2 text-xs font-mono focus:outline-none focus:border-surface-strong text-foreground transition-colors"
                  value={adminSearch}
                  onChange={e => setAdminSearch(e.target.value)}
                />
              </div>
              <div className="relative w-full md:w-64">
                <Filter size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                <input 
                  type="text" 
                  placeholder="Filter by Admin Email..." 
                  className="w-full bg-background border border-surface rounded-sm pl-9 pr-4 py-2 text-xs font-mono focus:outline-none focus:border-surface-strong text-foreground transition-colors"
                  value={adminFilter}
                  onChange={e => setAdminFilter(e.target.value)}
                />
              </div>
            </div>

            {/* Admin Table */}
            <div className="bg-surface/5 border border-surface rounded-sm overflow-hidden flex-1 flex flex-col">
              <div className="overflow-y-auto custom-scrollbar flex-1">
                <table className="w-full text-left font-mono text-sm">
                  <thead className="bg-surface/30 text-[10px] uppercase tracking-[0.2em] text-muted border-b border-surface sticky top-0 z-10 backdrop-blur-sm">
                    <tr>
                      <th className="px-6 py-4 font-normal whitespace-nowrap">Timestamp</th>
                      <th className="px-6 py-4 font-normal">Actor</th>
                      <th className="px-6 py-4 font-normal">Action</th>
                      <th className="px-6 py-4 font-normal">Resource</th>
                      <th className="px-6 py-4 font-normal">Network IP</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface text-xs">
                    {filteredAdminLogs.length > 0 ? (
                      filteredAdminLogs.map((log: AdminLog) => {
                        const actionSafe = log.action || 'UNKNOWN';
                        const isFail = actionSafe.includes('FAIL') || actionSafe.includes('BLOCK') || actionSafe.includes('DELETE');
                        return (
                          <tr key={log.id} className="hover:bg-surface/10 transition-colors">
                            <td className="px-6 py-4 text-muted whitespace-nowrap">
                              {format(new Date(log.created_at), 'yyyy-MM-dd HH:mm:ss')}
                            </td>
                            <td className="px-6 py-4 text-foreground truncate max-w-[150px]" title={log.actor || 'System'}>
                              {log.actor || 'System'}
                            </td>
                            <td className="px-6 py-4">
                              <span className={`px-2 py-1 rounded-sm border ${isFail ? 'bg-[#E4002B]/10 border-[#E4002B]/30 text-[#E4002B]' : 'bg-surface/30 border-surface-strong text-foreground'}`}>
                                {actionSafe}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-muted truncate max-w-[150px]">
                              {log.resource_type || 'System'} {log.resource_id ? `(${log.resource_id.split('-')[0]})` : ''}
                            </td>
                            <td className="px-6 py-4 text-muted">{log.ip_address || 'Unknown'}</td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={5} className="px-6 py-12 text-center text-muted uppercase tracking-widest text-[10px]">
                          No admin activity logs found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {activeTab === 'portfolio' && (
          <>
            {/* Portfolio Controls */}
            <div className="flex flex-col md:flex-row gap-4 justify-between bg-surface/10 p-4 border border-surface rounded-sm shrink-0">
              <div className="relative flex-1 max-w-md">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                <input 
                  type="text" 
                  placeholder="Search events or visitor IDs..." 
                  className="w-full bg-background border border-surface rounded-sm pl-9 pr-4 py-2 text-xs font-mono focus:outline-none focus:border-surface-strong text-foreground transition-colors"
                  value={portfolioSearch}
                  onChange={e => setPortfolioSearch(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter size={14} className="text-muted" />
                <select 
                  className="bg-background border border-surface rounded-sm px-3 py-2 text-xs font-mono focus:outline-none focus:border-surface-strong text-foreground"
                  value={portfolioFilter}
                  onChange={e => setPortfolioFilter(e.target.value)}
                >
                  <option value="all">All Events</option>
                  <option value="PROJECT_OPEN">Project Views</option>
                  <option value="CERTIFICATE_OPEN">Certificate Views</option>
                  <option value="RESUME_DOWNLOAD">Downloads</option>
                  <option value="CONTACT_SUBMIT">Contact Submits</option>
                </select>
              </div>
            </div>

            {/* Portfolio Table */}
            <div className="bg-surface/5 border border-surface rounded-sm overflow-hidden flex-1 flex flex-col">
              <div className="overflow-y-auto custom-scrollbar flex-1">
                <table className="w-full text-left font-mono text-sm">
                  <thead className="bg-surface/30 text-[10px] uppercase tracking-[0.2em] text-muted border-b border-surface sticky top-0 z-10 backdrop-blur-sm">
                    <tr>
                      <th className="px-6 py-4 font-normal whitespace-nowrap">Timestamp</th>
                      <th className="px-6 py-4 font-normal">Visitor ID</th>
                      <th className="px-6 py-4 font-normal">Event Type</th>
                      <th className="px-6 py-4 font-normal">Event Name</th>
                      <th className="px-6 py-4 font-normal">Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface text-xs">
                    {filteredPortfolioLogs.length > 0 ? (
                      filteredPortfolioLogs.map((log: PortfolioLog) => {
                        const details = log.event_data || log.metadata || {};
                        const detailString = Object.keys(details).length > 0 ? JSON.stringify(details).substring(0, 50) + '...' : '-';
                        return (
                          <tr key={log.id} className="hover:bg-surface/10 transition-colors">
                            <td className="px-6 py-4 text-muted whitespace-nowrap">
                              {format(new Date(log.created_at), 'yyyy-MM-dd HH:mm:ss')}
                            </td>
                            <td className="px-6 py-4 text-muted font-mono text-[10px] truncate max-w-[120px]" title={log.visitor_id}>
                              {log.visitor_id.split('-')[0]}...
                            </td>
                            <td className="px-6 py-4">
                              <span className="px-2 py-1 rounded-sm border bg-surface/30 border-surface-strong text-foreground uppercase tracking-widest text-[9px]">
                                {log.event_type}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-foreground truncate max-w-[200px]">
                              {log.event_name || '-'}
                            </td>
                            <td className="px-6 py-4 text-muted text-[10px] truncate max-w-[200px]" title={JSON.stringify(details)}>
                              {detailString}
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={5} className="px-6 py-12 text-center text-muted uppercase tracking-widest text-[10px]">
                          No telemetry events found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
