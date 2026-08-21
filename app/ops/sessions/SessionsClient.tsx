'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { Clock, Globe, Shield, Trash2, XCircle, Activity } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function SessionsClient({ initialSessions }: { initialSessions: any[] }) {
  const [sessions, setSessions] = useState(initialSessions);
  const router = useRouter();

  const handleEndSession = async (sessionId: string) => {
    if (!window.confirm('Are you sure you want to end this session?')) return;
    try {
      const res = await fetch(`/api/ops/sessions/${sessionId}/end`, { method: 'POST' });
      if (res.ok) {
        setSessions(prev => prev.map(s => s.session_id === sessionId ? { ...s, status: 'EXPIRED', session_end_time: new Date().toISOString() } : s));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteSession = async (sessionId: string) => {
    if (!window.confirm('Are you sure you want to permanently delete this session?')) return;
    try {
      const res = await fetch(`/api/ops/sessions/${sessionId}/delete`, { method: 'DELETE' });
      if (res.ok) {
        setSessions(prev => prev.filter(s => s.session_id !== sessionId));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const activeSessions = sessions.filter(s => s.status === 'ACTIVE' || (s.last_ping_at && new Date().getTime() - new Date(s.last_ping_at).getTime() < 30 * 60 * 1000));
  const expiredSessions = sessions.filter(s => !(s.status === 'ACTIVE' || (s.last_ping_at && new Date().getTime() - new Date(s.last_ping_at).getTime() < 30 * 60 * 1000)));

  const [activePage, setActivePage] = useState(1);
  const [expiredPage, setExpiredPage] = useState(1);
  const itemsPerPage = 10;

  const paginatedActive = activeSessions.slice((activePage - 1) * itemsPerPage, activePage * itemsPerPage);
  const paginatedExpired = expiredSessions.slice((expiredPage - 1) * itemsPerPage, expiredPage * itemsPerPage);

  const formatTime = (secs: number) => {
    if (secs === 0) return '0s';
    if (secs > 3600) return `${Math.floor(secs / 3600)}h ${Math.floor((secs % 3600) / 60)}m`;
    if (secs > 60) return `${Math.floor(secs / 60)}m ${secs % 60}s`;
    return `${secs}s`;
  };

  const renderTable = (
    data: any[], 
    isActive: boolean, 
    currentPage: number, 
    setCurrentPage: (p: number | ((prev: number) => number)) => void,
    totalItems: number
  ) => (
    <div className="space-y-4">
      {totalItems > itemsPerPage && (
        <div className="flex justify-between items-center bg-surface/5 px-4 py-2 border border-surface rounded-sm">
          <span className="text-[10px] text-muted font-mono uppercase tracking-widest">
            Showing {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems}
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
              onClick={() => setCurrentPage(p => Math.min(Math.ceil(totalItems / itemsPerPage), p + 1))}
              disabled={currentPage >= Math.ceil(totalItems / itemsPerPage)}
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
              <th className="px-4 py-3 font-normal">Session ID</th>
              <th className="px-4 py-3 font-normal">Started At</th>
              <th className="px-4 py-3 font-normal">Last Activity</th>
              <th className="px-4 py-3 font-normal">Duration</th>
              <th className="px-4 py-3 font-normal text-right">Pages</th>
              <th className="px-4 py-3 font-normal">Current Page</th>
              <th className="px-4 py-3 font-normal text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface">
            {data.length > 0 ? (
              data.map((s, idx) => {
                const srNo = (currentPage - 1) * itemsPerPage + idx + 1;
                return (
                <tr key={s.id} className="hover:bg-surface/10 transition-colors">
                  <td className="px-4 py-3 text-muted">{srNo}</td>
                  <td className="px-4 py-3 text-muted">{s.session_id.substring(0,8)}...</td>
                  <td className="px-4 py-3">{format(new Date(s.created_at), 'MMM d, HH:mm')}</td>
                  <td className="px-4 py-3 text-muted">{s.last_ping_at ? format(new Date(s.last_ping_at), 'MMM d, HH:mm:ss') : 'N/A'}</td>
                  <td className="px-4 py-3 text-emerald-500">{formatTime(s.session_duration || s.duration || s.active_duration || 0)}</td>
                  <td className="px-4 py-3 text-right">{s.page_view_count || s.total_page_views || 0}</td>
                  <td className="px-4 py-3 text-muted truncate max-w-[150px]" title={s.current_page || s.exit_page || '/'}>{s.current_page || s.exit_page || '/'}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      {isActive && (
                        <button onClick={() => handleEndSession(s.session_id)} className="text-amber-500 hover:text-amber-400 p-1" title="End Session">
                          <XCircle size={14} />
                        </button>
                      )}
                      <button onClick={() => handleDeleteSession(s.session_id)} className="text-red-500 hover:text-red-400 p-1" title="Delete Session">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              )})
            ) : (
              <tr>
                <td colSpan={8} className="px-6 py-12 text-center text-muted uppercase tracking-widest text-[10px]">
                  No {isActive ? 'active' : 'expired'} sessions found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <header className="mb-10 border-b border-surface pb-6">
        <h1 className="text-3xl font-semibold tracking-tight uppercase text-foreground">
          Session Management
        </h1>
        <p className="text-muted text-sm font-mono mt-2 tracking-widest uppercase">
          Active and Expired Sessions Control
        </p>
      </header>

      <div className="space-y-6">
        <h2 className="text-sm font-mono text-emerald-500 uppercase tracking-widest flex items-center gap-2">
          <Activity size={14} /> Active Sessions
        </h2>
        {renderTable(paginatedActive, true, activePage, setActivePage, activeSessions.length)}
        
        <h2 className="text-sm font-mono text-muted uppercase tracking-widest flex items-center gap-2 pt-6 border-t border-surface">
          <Clock size={14} /> Expired Sessions
        </h2>
        {renderTable(paginatedExpired, false, expiredPage, setExpiredPage, expiredSessions.length)}
      </div>
    </div>
  );
}
