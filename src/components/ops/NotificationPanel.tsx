'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, Check, Trash2, ShieldAlert, MessageSquare, 
  Activity, ExternalLink, Search, Filter 
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';
import { createClient } from '@/utils/supabase/client';

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

export default function NotificationPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'ALL' | 'UNREAD'>('ALL');
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const fetchNotifs = async () => {
      const { data } = await supabase
        .from('portfolio_notifications')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);
      if (data) setNotifications(data);
    };
    fetchNotifs();

    const channel = supabase
      .channel(`public:portfolio_notifications_${crypto.randomUUID()}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'portfolio_notifications' }, (payload) => {
        setNotifications(prev => [payload.new as Notification, ...prev]);
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'portfolio_notifications' }, (payload) => {
        setNotifications(prev => prev.map(n => n.id === payload.new.id ? (payload.new as Notification) : n));
      })
      .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'portfolio_notifications' }, (payload) => {
        setNotifications(prev => prev.filter(n => n.id !== payload.old.id));
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const handleMarkRead = async (id: string) => {
    await supabase.from('portfolio_notifications').update({ is_read: true }).eq('id', id);
  };

  const handleMarkAllRead = async () => {
    const unreadIds = notifications.filter(n => !n.is_read).map(n => n.id);
    if (unreadIds.length === 0) return;
    await supabase.from('portfolio_notifications').update({ is_read: true }).in('id', unreadIds);
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    await supabase.from('portfolio_notifications').delete().eq('id', id);
  };

  const handleClick = (n: Notification) => {
    if (!n.is_read) handleMarkRead(n.id);
    if (n.link) {
      router.push(n.link);
      setIsOpen(false);
    }
  };

  const filtered = notifications
    .filter(n => filter === 'ALL' || (filter === 'UNREAD' && !n.is_read))
    .filter(n => search === '' || n.title.toLowerCase().includes(search.toLowerCase()) || n.message.toLowerCase().includes(search.toLowerCase()));

  const getIcon = (cat: string) => {
    if (cat === 'CONTACT') return <MessageSquare size={14} className="text-amber-500" />;
    if (cat === 'SECURITY') return <ShieldAlert size={14} className="text-[#E4002B]" />;
    return <Activity size={14} className="text-blue-500" />;
  };

  return (
    <div className="relative" ref={containerRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-muted hover:text-foreground transition-colors rounded-sm hover:bg-surface/30"
      >
        <Bell size={16} />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#E4002B] rounded-full animate-pulse border border-background"></span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-96 bg-background border border-surface rounded-sm shadow-2xl z-50 overflow-hidden flex flex-col"
          >
            <div className="p-3 border-b border-surface flex justify-between items-center bg-surface/5">
              <span className="font-mono text-[10px] uppercase tracking-widest text-foreground font-semibold flex items-center gap-2">
                Notifications {unreadCount > 0 && <span className="bg-[#E4002B] text-white px-1.5 py-0.5 rounded-sm">{unreadCount}</span>}
              </span>
              <div className="flex gap-2">
                <button onClick={() => setFilter(f => f === 'ALL' ? 'UNREAD' : 'ALL')} className={`p-1.5 rounded-sm transition-colors ${filter === 'UNREAD' ? 'bg-surface text-foreground' : 'text-muted hover:bg-surface/50'}`} title="Toggle Unread">
                  <Filter size={12} />
                </button>
                <button onClick={handleMarkAllRead} className="text-[9px] text-[#E4002B] font-mono hover:underline px-2 py-1 bg-[#E4002B]/10 rounded-sm">Mark all read</button>
              </div>
            </div>

            <div className="p-2 border-b border-surface bg-surface/5 flex items-center gap-2">
               <Search size={12} className="text-muted ml-1" />
               <input 
                 type="text" 
                 placeholder="Search notifications..." 
                 className="bg-transparent border-none outline-none text-[10px] font-mono text-foreground w-full"
                 value={search}
                 onChange={e => setSearch(e.target.value)}
               />
            </div>
            
            <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
              {filtered.length > 0 ? filtered.map((n) => (
                <div 
                  key={n.id}
                  onClick={() => handleClick(n)}
                  className={`p-3 border-b border-surface/50 hover:bg-surface/10 transition-colors cursor-pointer group flex gap-3 ${!n.is_read ? 'bg-surface/5' : ''}`}
                >
                  <div className="mt-1 shrink-0 p-1.5 bg-background border border-surface rounded-full">
                    {getIcon(n.category)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <span className={`text-[10px] font-mono uppercase tracking-wider ${n.priority === 'HIGH' || n.priority === 'CRITICAL' ? 'text-[#E4002B]' : 'text-foreground'}`}>
                        {n.title}
                      </span>
                      <span className="text-[9px] text-muted font-mono whitespace-nowrap ml-2">
                        {formatDistanceToNow(new Date(n.created_at))} ago
                      </span>
                    </div>
                    <p className="text-[11px] text-muted line-clamp-2">{n.message}</p>
                    
                    <div className="flex items-center gap-3 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {!n.is_read && (
                        <button onClick={(e) => { e.stopPropagation(); handleMarkRead(n.id); }} className="text-[9px] font-mono text-emerald-500 hover:underline flex items-center gap-1">
                          <Check size={10} /> Mark Read
                        </button>
                      )}
                      <button onClick={(e) => handleDelete(n.id, e)} className="text-[9px] font-mono text-[#E4002B] hover:underline flex items-center gap-1">
                        <Trash2 size={10} /> Delete
                      </button>
                    </div>
                  </div>
                  {!n.is_read && (
                    <div className="w-1.5 h-1.5 rounded-full bg-[#E4002B] shrink-0 mt-1.5"></div>
                  )}
                </div>
              )) : (
                <div className="p-8 text-center text-muted font-mono text-[10px] uppercase tracking-widest">
                  No notifications found
                </div>
              )}
            </div>
            
            <div className="p-2 border-t border-surface bg-background text-center">
              <button onClick={() => { router.push('/ops/notifications'); setIsOpen(false); }} className="text-[10px] font-mono text-muted hover:text-foreground uppercase tracking-widest flex items-center justify-center gap-1.5 w-full py-1">
                View All History <ExternalLink size={10} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
