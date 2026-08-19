'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Settings, ShieldAlert, History, Activity, 
  Bell, LogOut, Sliders, Key
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { logout } from '../../../app/ops/login/actions';

export default function ProfileDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const LINKS = [
    { label: 'Admin Profile', icon: User, href: '/ops/settings?tab=profile' },
    { label: 'Account Settings', icon: Settings, href: '/ops/settings?tab=general' },
    { label: 'Security', icon: ShieldAlert, href: '/ops/settings?tab=security' },
    { label: 'Change Password', icon: Key, href: '/ops/settings?tab=security' },
    { label: 'Login History', icon: History, href: '/ops/auth/logins' },
    { label: 'Sessions', icon: Activity, href: '/ops/auth/sessions' },
    { label: 'Preferences', icon: Sliders, href: '/ops/settings?tab=preferences' },
    { label: 'Notifications', icon: Bell, href: '/ops/settings?tab=notifications' },
  ];

  const handleNav = (href: string) => {
    router.push(href);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={containerRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="p-1 border border-surface rounded-full overflow-hidden ml-2 hover:ring-2 hover:ring-surface transition-all group"
      >
        <div className="w-6 h-6 bg-surface/50 flex items-center justify-center text-muted group-hover:text-foreground group-hover:bg-surface transition-colors">
          <User size={14} />
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-56 bg-background border border-surface rounded-sm shadow-2xl z-50 overflow-hidden flex flex-col"
          >
            <div className="p-4 border-b border-surface bg-surface/5">
              <p className="font-mono text-xs text-foreground font-semibold">SOC Administrator</p>
              <p className="font-mono text-[9px] text-muted uppercase tracking-widest mt-1">Superadmin Access</p>
            </div>
            
            <div className="max-h-80 overflow-y-auto custom-scrollbar p-1">
              {LINKS.map((link, idx) => (
                <button
                  key={idx}
                  onClick={() => handleNav(link.href)}
                  className="w-full flex items-center gap-3 px-3 py-2 text-left rounded-sm transition-colors text-muted hover:text-foreground hover:bg-surface/50 group"
                >
                  <link.icon size={12} className="group-hover:text-emerald-500 transition-colors" />
                  <span className="font-mono text-[10px] uppercase tracking-widest">{link.label}</span>
                </button>
              ))}
              
              <div className="my-1 border-t border-surface"></div>
              
              <form action={logout}>
                <button
                  type="submit"
                  className="w-full flex items-center gap-3 px-3 py-2 text-left rounded-sm transition-colors text-muted hover:text-[#E4002B] hover:bg-[#E4002B]/10"
                >
                  <LogOut size={12} />
                  <span className="font-mono text-[10px] uppercase tracking-widest">Logout</span>
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
