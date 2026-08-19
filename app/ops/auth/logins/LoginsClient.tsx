'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { Monitor, Globe, ShieldAlert, ShieldCheck } from 'lucide-react';

type Login = {
  id: string;
  admin_id: string | null;
  username: string;
  status: 'SUCCESS' | 'FAILED';
  failure_reason: string | null;
  ip_address: string;
  country: string;
  browser: string;
  device: string;
  os: string;
  created_at: string;
};

export default function LoginsClient({ initialLogins }: { initialLogins: Login[] }) {
  const [filter, setFilter] = useState<'ALL' | 'SUCCESS' | 'FAILED'>('ALL');

  const filtered = initialLogins.filter(l => filter === 'ALL' || l.status === filter);

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-surface flex justify-between items-center bg-surface/5">
        <h2 className="text-[10px] font-mono uppercase tracking-widest text-muted">Authentication Logs</h2>
        <div className="flex gap-2">
          {['ALL', 'SUCCESS', 'FAILED'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f as any)}
              className={`px-3 py-1 font-mono text-[9px] uppercase tracking-widest border rounded-sm transition-colors ${
                filter === f 
                  ? 'bg-surface border-surface-strong text-foreground' 
                  : 'bg-transparent border-surface text-muted hover:text-foreground'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>
      
      <div className="flex-1 overflow-auto custom-scrollbar">
        <table className="w-full text-left border-collapse">
          <thead className="bg-surface/10 sticky top-0 z-10">
            <tr className="border-b border-surface text-[9px] font-mono uppercase tracking-widest text-muted">
              <th className="p-4 font-normal">Status</th>
              <th className="p-4 font-normal">Admin/User</th>
              <th className="p-4 font-normal">Time</th>
              <th className="p-4 font-normal">Network</th>
              <th className="p-4 font-normal">Environment</th>
              <th className="p-4 font-normal">Reason</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface font-mono text-xs text-foreground">
            {filtered.length > 0 ? filtered.map(log => (
              <tr key={log.id} className="hover:bg-surface/5 transition-colors group">
                <td className="p-4">
                  {log.status === 'SUCCESS' ? (
                    <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-sm bg-emerald-500/10 text-emerald-500 text-[9px] uppercase tracking-widest border border-emerald-500/20">
                      <ShieldCheck size={10} /> Success
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-sm bg-[#E4002B]/10 text-[#E4002B] text-[9px] uppercase tracking-widest border border-[#E4002B]/20">
                      <ShieldAlert size={10} /> Failed
                    </span>
                  )}
                </td>
                <td className="p-4 truncate max-w-[150px]">{log.username || 'Unknown'}</td>
                <td className="p-4 text-muted text-[10px]">{format(new Date(log.created_at), 'yyyy-MM-dd HH:mm:ss')}</td>
                <td className="p-4">
                  <div className="flex flex-col gap-1">
                    <span className="flex items-center gap-1.5"><Globe size={10} className="text-muted"/> {log.ip_address}</span>
                    <span className="text-[9px] text-muted">{log.country}</span>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex flex-col gap-1">
                    <span className="flex items-center gap-1.5"><Monitor size={10} className="text-muted"/> {log.browser} on {log.os}</span>
                    <span className="text-[9px] text-muted">{log.device}</span>
                  </div>
                </td>
                <td className={`p-4 text-[10px] ${log.status === 'FAILED' ? 'text-[#E4002B]' : 'text-muted'}`}>
                  {log.failure_reason || '-'}
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={6} className="p-8 text-center text-[10px] font-mono text-muted uppercase tracking-widest">
                  No logs found for this filter
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
