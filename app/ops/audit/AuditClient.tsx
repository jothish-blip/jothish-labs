'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { Search, Filter } from 'lucide-react';

type AuditLog = {
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
};

export default function AuditClient({ initialLogs }: { initialLogs: AuditLog[] }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAction, setFilterAction] = useState('all');

  const filteredLogs = initialLogs.filter(log => {
    const actorSafe = log.actor || 'System';
    const actionSafe = log.action || 'Unknown';
    const resourceSafe = log.resource_type || '';
    
    const matchesSearch = actorSafe.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          actionSafe.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          resourceSafe.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAction = filterAction === 'all' || actionSafe.includes(filterAction);
    return matchesSearch && matchesAction;
  });

  return (
    <div className="space-y-8">
      <header className="mb-10 border-b border-surface pb-6">
        <h1 className="text-3xl font-semibold tracking-tight uppercase text-foreground">
          Audit Center
        </h1>
        <p className="text-muted text-sm font-mono mt-2 tracking-widest uppercase">
          System-Wide Action Forensics
        </p>
      </header>

      <div className="flex flex-col md:flex-row gap-4 justify-between bg-surface/10 p-4 border border-surface rounded-sm">
        <div className="relative flex-1 max-w-md">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input 
            type="text" 
            placeholder="Search by actor, action, or resource..." 
            className="w-full bg-background border border-surface rounded-sm pl-9 pr-4 py-2 text-xs font-mono focus:outline-none focus:border-surface-strong text-foreground transition-colors"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={14} className="text-muted" />
          <select 
            className="bg-background border border-surface rounded-sm px-3 py-2 text-xs font-mono focus:outline-none focus:border-surface-strong text-foreground"
            value={filterAction}
            onChange={e => setFilterAction(e.target.value)}
          >
            <option value="all">All Actions</option>
            <option value="LOGIN">Logins</option>
            <option value="FAIL">Failures</option>
            <option value="UPDATE">Updates</option>
            <option value="ARCHIVE">Archives</option>
          </select>
        </div>
      </div>

      <div className="bg-surface/5 border border-surface rounded-sm overflow-hidden">
        <table className="w-full text-left font-mono text-sm">
          <thead className="bg-surface/30 text-[10px] uppercase tracking-[0.2em] text-muted border-b border-surface">
            <tr>
              <th className="px-6 py-4 font-normal">Timestamp</th>
              <th className="px-6 py-4 font-normal">Actor</th>
              <th className="px-6 py-4 font-normal">Action</th>
              <th className="px-6 py-4 font-normal">Location</th>
              <th className="px-6 py-4 font-normal">Env</th>
              <th className="px-6 py-4 font-normal">Network</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface text-xs">
            {filteredLogs.length > 0 ? (
              filteredLogs.map((log: AuditLog) => {
                const actionSafe = log.action || 'UNKNOWN';
                const isFail = actionSafe.includes('FAIL') || actionSafe.includes('BLOCK');
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
                    <td className="px-6 py-4 text-muted">{log.location || 'Unknown'}</td>
                    <td className="px-6 py-4 text-muted uppercase tracking-widest text-[9px]">
                      {log.browser ? `${log.browser}${log.os ? ` on ${log.os}` : ''}` : '-'}
                    </td>
                    <td className="px-6 py-4 text-muted">{log.ip_address || 'Unknown'}</td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-muted uppercase tracking-widest text-[10px]">
                  No audit logs found matching criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
