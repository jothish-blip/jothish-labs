'use client';

import { useState } from 'react';
import { formatDistanceToNow, format } from 'date-fns';
import { ShieldBan, RefreshCcw, Unlock } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

type RateLimit = {
  ip_address: string;
  attempts: number;
  blocked_until: string | null;
  reason: string | null;
  created_at: string;
  updated_at: string;
};

export default function RateLimitsClient({ initialLimits }: { initialLimits: RateLimit[] }) {
  const [limits, setLimits] = useState(initialLimits);
  const supabase = createClient();

  const handleUnblock = async (ip: string) => {
    await supabase.from('portfolio_rate_limits').update({ blocked_until: null, attempts: 0 }).eq('ip_address', ip);
    setLimits(prev => prev.map(l => l.ip_address === ip ? { ...l, blocked_until: null, attempts: 0 } : l));
  };

  const handleReset = async (ip: string) => {
    await supabase.from('portfolio_rate_limits').update({ attempts: 0 }).eq('ip_address', ip);
    setLimits(prev => prev.map(l => l.ip_address === ip ? { ...l, attempts: 0 } : l));
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-surface flex justify-between items-center bg-surface/5">
        <h2 className="text-[10px] font-mono uppercase tracking-widest text-muted">IP Rate Limiting & Blocks</h2>
      </div>
      
      <div className="flex-1 overflow-auto custom-scrollbar">
        <table className="w-full text-left border-collapse">
          <thead className="bg-surface/10 sticky top-0 z-10">
            <tr className="border-b border-surface text-[9px] font-mono uppercase tracking-widest text-muted">
              <th className="p-4 font-normal">IP Address</th>
              <th className="p-4 font-normal text-center">Attempts</th>
              <th className="p-4 font-normal">Status / Blocked Until</th>
              <th className="p-4 font-normal">Reason</th>
              <th className="p-4 font-normal text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface font-mono text-xs text-foreground">
            {limits.length > 0 ? limits.map(limit => {
              const isBlocked = limit.blocked_until && new Date(limit.blocked_until) > new Date();
              return (
                <tr key={limit.ip_address} className={`transition-colors group ${isBlocked ? 'bg-[#E4002B]/5 hover:bg-[#E4002B]/10' : 'hover:bg-surface/5'}`}>
                  <td className="p-4 font-semibold">{limit.ip_address}</td>
                  <td className="p-4 text-center">
                    <span className={`px-2 py-0.5 rounded-sm ${limit.attempts > 10 ? 'bg-amber-500/20 text-amber-500 border border-amber-500/30' : 'bg-surface text-muted'}`}>
                      {limit.attempts}
                    </span>
                  </td>
                  <td className="p-4">
                    {isBlocked ? (
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-sm bg-[#E4002B]/10 text-[#E4002B] text-[9px] uppercase tracking-widest border border-[#E4002B]/20">
                          <ShieldBan size={10} /> Blocked
                        </span>
                        <span className="text-[9px] text-muted">{formatDistanceToNow(new Date(limit.blocked_until!))} left</span>
                      </div>
                    ) : (
                      <span className="text-[9px] uppercase tracking-widest text-emerald-500">Active</span>
                    )}
                  </td>
                  <td className="p-4 text-[10px] text-muted truncate max-w-[200px]" title={limit.reason || ''}>
                    {limit.reason || '-'}
                  </td>
                  <td className="p-4 text-right flex justify-end gap-2">
                    {isBlocked ? (
                      <button 
                        onClick={() => handleUnblock(limit.ip_address)}
                        className="flex items-center gap-1.5 px-2 py-1 border border-[#E4002B]/30 hover:bg-[#E4002B]/10 text-[#E4002B] rounded-sm text-[9px] uppercase tracking-widest transition-colors"
                      >
                        <Unlock size={10} /> Unblock
                      </button>
                    ) : (
                      <button 
                        onClick={() => handleReset(limit.ip_address)}
                        className="flex items-center gap-1.5 px-2 py-1 border border-surface-strong hover:bg-surface/30 text-muted hover:text-foreground rounded-sm text-[9px] uppercase tracking-widest transition-colors"
                        disabled={limit.attempts === 0}
                      >
                        <RefreshCcw size={10} /> Reset
                      </button>
                    )}
                  </td>
                </tr>
              );
            }) : (
              <tr>
                <td colSpan={5} className="p-8 text-center text-[10px] font-mono text-muted uppercase tracking-widest">
                  No rate limit records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
