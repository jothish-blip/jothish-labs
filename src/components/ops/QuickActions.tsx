'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, Search, LayoutDashboard, Users, Activity, 
  FileBarChart, MessageSquare, Award, Box, ShieldAlert, 
  Settings, LogOut 
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { logout } from '../../../app/ops/login/actions';

const ACTIONS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, href: '/ops' },
  { id: 'visitors', label: 'Visitor Intelligence', icon: Users, href: '/ops/visitors' },
  { id: 'sessions', label: 'Live Sessions', icon: Activity, href: '/ops/auth/sessions' },
  { id: 'reports', label: 'Reports', icon: FileBarChart, href: '/ops/reports' },
  { id: 'contacts', label: 'Contacts', icon: MessageSquare, href: '/ops/contacts' },
  { id: 'security', label: 'Security', icon: ShieldAlert, href: '/ops/security' },
  { id: 'audit', label: 'Audit Logs', icon: Activity, href: '/ops/audit' },
  { id: 'settings', label: 'Settings', icon: Settings, href: '/ops/settings' }
];

export default function QuickActions() {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const filteredActions = ACTIONS.filter(a => a.label.toLowerCase().includes(search.toLowerCase()));

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

  const toggleOpen = () => {
    if (!isOpen) {
      setSelectedIndex(0);
      setSearch('');
    }
    setIsOpen(!isOpen);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % (filteredActions.length + 1)); // +1 for logout
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 < 0 ? filteredActions.length : prev - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex === filteredActions.length) {
        // Logout action
        const form = document.getElementById('quick-logout-form') as HTMLFormElement;
        form?.submit();
      } else if (filteredActions[selectedIndex]) {
        router.push(filteredActions[selectedIndex].href);
        setIsOpen(false);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div className="relative" ref={containerRef}>
      <button 
        onClick={toggleOpen}
        className="hidden sm:flex items-center gap-2 text-[10px] font-mono tracking-widest uppercase text-muted hover:text-foreground transition-colors border border-surface px-3 py-1.5 rounded-sm bg-surface/10 hover:bg-surface/30"
      >
        <Zap size={12} className="text-amber-500" />
        <span>Quick Actions</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-64 bg-background border border-surface rounded-sm shadow-2xl z-50 overflow-hidden flex flex-col"
          >
            <div className="p-2 border-b border-surface flex items-center gap-2 bg-surface/5">
              <Search size={12} className="text-muted" />
              <input 
                type="text" 
                placeholder="Find action..." 
                className="bg-transparent border-none outline-none text-xs font-mono text-foreground w-full placeholder:text-muted/50"
                value={search}
                onChange={e => { setSearch(e.target.value); setSelectedIndex(0); }}
                onKeyDown={handleKeyDown}
                autoFocus
              />
            </div>
            
            <div className="max-h-64 overflow-y-auto custom-scrollbar p-1">
              {filteredActions.length > 0 ? filteredActions.map((action, idx) => (
                <button
                  key={action.id}
                  onClick={() => { router.push(action.href); setIsOpen(false); }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`w-full flex items-center gap-3 px-3 py-2 text-left rounded-sm transition-colors ${
                    selectedIndex === idx ? 'bg-surface/50 text-foreground' : 'text-muted hover:text-foreground'
                  }`}
                >
                  <action.icon size={14} className={selectedIndex === idx ? 'text-amber-500' : ''} />
                  <span className="font-mono text-[10px] uppercase tracking-widest">{action.label}</span>
                </button>
              )) : (
                <div className="p-4 text-center text-xs font-mono text-muted">No actions found</div>
              )}
              
              <div className="my-1 border-t border-surface"></div>
              
              <form action={logout} id="quick-logout-form">
                <button
                  type="submit"
                  onMouseEnter={() => setSelectedIndex(filteredActions.length)}
                  className={`w-full flex items-center gap-3 px-3 py-2 text-left rounded-sm transition-colors ${
                    selectedIndex === filteredActions.length ? 'bg-[#E4002B]/10 text-[#E4002B]' : 'text-muted hover:text-[#E4002B]'
                  }`}
                >
                  <LogOut size={14} />
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
