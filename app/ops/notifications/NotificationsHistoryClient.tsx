'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { format } from 'date-fns';
import { Bell, Trash2, Check, ShieldAlert, MessageSquare, Activity, ExternalLink } from 'lucide-react';
import Link from 'next/link';

type Notification = {
  id: string;
  category: string;
  title: string;
  message: string;
  link: string;
  is_read: boolean;
  priority: string;
  created_at: string;
};

export default function NotificationsHistoryClient({ initialNotifications }: { initialNotifications: Notification[] }) {
  const [notifications, setNotifications] = useState(initialNotifications);
  const supabase = createClient();

  useEffect(() => {
    const channel = supabase
      .channel('public:portfolio_notifications:history')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'portfolio_notifications' }, (payload: any) => {
        setNotifications(prev => [payload.new as Notification, ...prev]);
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'portfolio_notifications' }, (payload: any) => {
        setNotifications(prev => prev.map(n => n.id === payload.new.id ? (payload.new as Notification) : n));
      })
      .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'portfolio_notifications' }, (payload: any) => {
        setNotifications(prev => prev.filter(n => n.id !== payload.old.id));
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  const handleMarkRead = async (id: string) => {
    await supabase.from('portfolio_notifications').update({ is_read: true }).eq('id', id);
  };

  const handleMarkAllRead = async () => {
    const unreadIds = notifications.filter(n => !n.is_read).map(n => n.id);
    if (unreadIds.length === 0) return;
    await supabase.from('portfolio_notifications').update({ is_read: true }).in('id', unreadIds);
  };

  const handleDelete = async (id: string) => {
    await supabase.from('portfolio_notifications').delete().eq('id', id);
  };

  const getIcon = (cat: string) => {
    if (cat === 'CONTACT') return <MessageSquare size={16} className="text-amber-500" />;
    if (cat === 'SECURITY') return <ShieldAlert size={16} className="text-[#E4002B]" />;
    return <Activity size={16} className="text-blue-500" />;
  };

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="p-6 border-b border-surface flex justify-between items-center">
        <div>
          <h1 className="text-sm font-mono tracking-[0.2em] uppercase font-semibold text-foreground flex items-center gap-3">
            <Bell size={18} className="text-[#E4002B]" />
            Notification History
          </h1>
          <p className="text-xs text-muted mt-1 font-mono">View all system events, security alerts, and contact submissions.</p>
        </div>
        <button 
          onClick={handleMarkAllRead}
          className="px-4 py-2 bg-surface hover:bg-surface-strong text-foreground border border-surface rounded-sm text-[10px] font-mono tracking-widest uppercase transition-colors"
        >
          Mark All Read
        </button>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-4xl mx-auto space-y-3">
          {notifications.length > 0 ? notifications.map(n => (
            <div key={n.id} className={`flex gap-4 p-4 border rounded-sm transition-colors ${n.is_read ? 'bg-surface/5 border-surface' : 'bg-surface/20 border-surface-strong shadow-sm'}`}>
              <div className="shrink-0 p-2 bg-background border border-surface rounded-full h-fit">
                {getIcon(n.category)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <h3 className={`font-mono text-xs uppercase tracking-widest ${n.priority === 'HIGH' || n.priority === 'CRITICAL' ? 'text-[#E4002B]' : 'text-foreground'}`}>
                    {n.title}
                  </h3>
                  <span className="text-[10px] font-mono text-muted whitespace-nowrap">
                    {format(new Date(n.created_at), 'MMM dd, yyyy HH:mm:ss')}
                  </span>
                </div>
                <p className="text-xs text-muted mt-2 leading-relaxed">{n.message}</p>
                
                <div className="mt-4 flex items-center gap-4">
                  {n.link && (
                    <Link href={n.link} className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest text-emerald-500 hover:text-emerald-400 transition-colors">
                      <ExternalLink size={12} /> View Details
                    </Link>
                  )}
                  {!n.is_read && (
                    <button onClick={() => handleMarkRead(n.id)} className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest text-muted hover:text-foreground transition-colors">
                      <Check size={12} /> Mark Read
                    </button>
                  )}
                  <button onClick={() => handleDelete(n.id)} className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest text-muted hover:text-[#E4002B] transition-colors ml-auto">
                    <Trash2 size={12} /> Delete
                  </button>
                </div>
              </div>
            </div>
          )) : (
            <div className="text-center py-20 text-muted font-mono text-sm uppercase tracking-widest border border-dashed border-surface rounded-sm">
              No notifications found in history.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
