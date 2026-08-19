'use client';

import { useEffect, useState, useCallback } from 'react';
import { createClient } from '@/utils/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, MessageSquare, Activity, X, TerminalSquare, AlertTriangle } from 'lucide-react';

type Notification = {
  id: string;
  title: string;
  message: string;
  type: 'security' | 'contact' | 'event' | 'error';
  timestamp: Date;
};

export default function NotificationSystem() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const supabase = createClient();

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter(n => n.id !== id));
  }, []);

  const addNotification = useCallback((n: Omit<Notification, 'id' | 'timestamp'>) => {
    const newNotification: Notification = {
      ...n,
      id: crypto.randomUUID(),
      timestamp: new Date()
    };
    setNotifications((prev) => [...prev, newNotification]);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      removeNotification(newNotification.id);
    }, 5000);
  }, [removeNotification]);

  useEffect(() => {
    // 1. Listen for new contacts
    const contactsChannel = supabase.channel(`contacts_hud_${crypto.randomUUID()}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'portfolio_contacts' }, (payload) => {
        addNotification({
          title: 'Inbound Communication',
          message: `New message from ${payload.new.name} (${payload.new.intent})`,
          type: 'contact'
        });
      })
      .subscribe();

    // 2. Listen for security audit logs
    const auditChannel = supabase.channel(`audit_hud_${crypto.randomUUID()}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'portfolio_audit_logs' }, (payload) => {
        if (payload.new.action === 'FAILED_LOGIN' || payload.new.action === 'BLOCK_IP' || payload.new.action.includes('THREAT')) {
          addNotification({
            title: 'Security Alert',
            message: `${payload.new.action} triggered by ${payload.new.actor || 'Unknown'}`,
            type: 'security'
          });
        }
      })
      .subscribe();

    // 3. Listen for specific telemetry events (e.g. resume download, api errors)
    const eventsChannel = supabase.channel(`events_hud_${crypto.randomUUID()}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'portfolio_events' }, (payload) => {
        if (payload.new.event_type === 'RESUME_DOWNLOAD') {
          addNotification({
            title: 'Asset Download',
            message: `Resume downloaded by Visitor ${payload.new.visitor_id?.substring(0, 8)}`,
            type: 'event'
          });
        } else if (payload.new.event_type === 'API_ERROR') {
           addNotification({
            title: 'System Exception',
            message: `API Error: ${payload.new.event_name}`,
            type: 'error'
          });
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(contactsChannel);
      supabase.removeChannel(auditChannel);
      supabase.removeChannel(eventsChannel);
    };
  }, [supabase, addNotification]);

  const getIcon = (type: string) => {
    switch (type) {
      case 'security': return <ShieldAlert size={16} className="text-[#E4002B]" />;
      case 'contact': return <MessageSquare size={16} className="text-amber-500" />;
      case 'error': return <AlertTriangle size={16} className="text-orange-500" />;
      case 'event': return <Activity size={16} className="text-emerald-500" />;
      default: return <TerminalSquare size={16} className="text-muted" />;
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 pointer-events-none w-80">
      <AnimatePresence>
        {notifications.map((n) => (
          <motion.div
            key={n.id}
            initial={{ opacity: 0, x: 50, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
            className="pointer-events-auto bg-surface/80 backdrop-blur-md border border-surface-strong shadow-2xl rounded-sm p-4 overflow-hidden relative group"
          >
            {/* Left Accent Line */}
            <div className={`absolute top-0 left-0 w-1 h-full ${
              n.type === 'security' ? 'bg-[#E4002B]' : 
              n.type === 'contact' ? 'bg-amber-500' : 
              n.type === 'error' ? 'bg-orange-500' : 'bg-emerald-500'
            }`}></div>

            <div className="flex items-start justify-between gap-3">
              <div className="mt-0.5 p-1.5 bg-background border border-surface rounded-sm">
                {getIcon(n.type)}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <h4 className="text-xs font-semibold text-foreground uppercase tracking-widest font-mono">
                    {n.title}
                  </h4>
                  <span className="text-[9px] font-mono text-muted uppercase tracking-widest">Live</span>
                </div>
                <p className="text-[11px] font-mono text-muted leading-tight">
                  {n.message}
                </p>
              </div>
              <button 
                onClick={() => removeNotification(n.id)}
                className="text-muted hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={14} />
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
