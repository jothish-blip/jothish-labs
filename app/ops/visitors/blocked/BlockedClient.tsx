'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { Shield, Unlock } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function BlockedClient({ initialBlocked }: { initialBlocked: any[] }) {
  const [blocked, setBlocked] = useState(initialBlocked);
  const router = useRouter();

  const handleUnblock = async (visitorId: string) => {
    if (!window.confirm('Are you sure you want to unblock this visitor?')) return;
    try {
      const res = await fetch(`/api/ops/visitors/${visitorId}/block`, { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'unblock' })
      });
      if (res.ok) {
        setBlocked(prev => prev.filter(b => b.visitor_id !== visitorId));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 25;
  const paginatedBlocked = blocked.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="space-y-8">
      <header className="mb-10 border-b border-surface pb-6">
        <h1 className="text-3xl font-semibold tracking-tight uppercase text-foreground flex items-center gap-3">
          <Shield className="text-[#E4002B]" />
          Blocked Visitors
        </h1>
        <p className="text-muted text-sm font-mono mt-2 tracking-widest uppercase">
          Access Control and Deny List Management
        </p>
      </header>

      {blocked.length > itemsPerPage && (
        <div className="flex justify-between items-center bg-surface/5 px-4 py-3 border border-surface rounded-sm mb-4">
          <span className="text-[10px] text-muted font-mono uppercase tracking-widest">
            Showing {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, blocked.length)} of {blocked.length}
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
              onClick={() => setCurrentPage(p => Math.min(Math.ceil(blocked.length / itemsPerPage), p + 1))}
              disabled={currentPage >= Math.ceil(blocked.length / itemsPerPage)}
              className="px-2 py-1 bg-surface/30 text-muted hover:text-foreground rounded-sm text-[10px] uppercase font-mono disabled:opacity-50 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}

      <div className="bg-surface/5 border border-surface rounded-sm overflow-hidden overflow-x-auto">
        <table className="w-full text-left font-mono text-xs whitespace-nowrap">
          <thead className="bg-surface/30 text-[10px] uppercase tracking-[0.2em] text-muted border-b border-surface">
            <tr>
              <th className="px-4 py-3 font-normal">SR. NO</th>
              <th className="px-4 py-3 font-normal">Visitor ID</th>
              <th className="px-4 py-3 font-normal">IP Address</th>
              <th className="px-4 py-3 font-normal">Reason</th>
              <th className="px-4 py-3 font-normal">Blocked On</th>
              <th className="px-4 py-3 font-normal text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface">
            {paginatedBlocked.length > 0 ? (
              paginatedBlocked.map((b, idx) => {
                const srNo = (currentPage - 1) * itemsPerPage + idx + 1;
                return (
                <tr key={b.id} className="hover:bg-surface/10 transition-colors">
                  <td className="px-4 py-3 text-muted">{srNo}</td>
                  <td className="px-4 py-3 text-muted">{b.visitor_id}</td>
                  <td className="px-4 py-3 text-[#E4002B]">{b.ip_address || 'Unknown'}</td>
                  <td className="px-4 py-3">{b.reason || 'Manual block'}</td>
                  <td className="px-4 py-3 text-muted">{format(new Date(b.created_at), 'MMM d, yyyy HH:mm')}</td>
                  <td className="px-4 py-3 text-right">
                    <button 
                      onClick={() => handleUnblock(b.visitor_id)} 
                      className="px-3 py-1.5 rounded-sm font-mono text-[9px] uppercase tracking-widest border border-emerald-500/30 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 transition-colors"
                    >
                      <Unlock size={10} className="inline-block mr-1 -mt-0.5" />
                      Unblock
                    </button>
                  </td>
                </tr>
              )})
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-muted uppercase tracking-widest text-[10px]">
                  No blocked visitors found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
