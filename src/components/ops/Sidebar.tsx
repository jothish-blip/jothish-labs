'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, Users, MessageSquare, Activity, Settings, 
  LogOut, ShieldAlert, FileBarChart, Lock, ChevronLeft, ChevronRight, Pin, Clock, X
} from 'lucide-react';
import { logout } from '../../../app/ops/login/actions';
import { motion, AnimatePresence } from 'framer-motion';

const ALL_NAV_ITEMS = [
  { id: 'overview', href: '/ops', label: 'Overview', icon: LayoutDashboard },
  { id: 'visitors', href: '/ops/visitors', label: 'Visitor Intel', icon: Users },
  { id: 'contacts', href: '/ops/contacts', label: 'Contacts', icon: MessageSquare },
  { id: 'security', href: '/ops/security', label: 'Security', icon: ShieldAlert },
  { id: 'auth', href: '/ops/auth', label: 'Access Control', icon: Lock },
  { id: 'reports', href: '/ops/reports', label: 'Reports', icon: FileBarChart },
  { id: 'audit', href: '/ops/audit', label: 'Audit Log', icon: Activity },
  { id: 'system', href: '/ops/system', label: 'System Health', icon: Activity },
  { id: 'settings', href: '/ops/settings', label: 'Settings', icon: Settings },
];

export default function Sidebar({ setSearchOpen, mobileOpen, setMobileOpen }: { setSearchOpen: (val: boolean) => void, mobileOpen?: boolean, setMobileOpen?: (val: boolean) => void }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [pinnedItems, setPinnedItems] = useState<string[]>([]);
  const [recentItems, setRecentItems] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Read local storage on mount
    const savedState = localStorage.getItem('sidebar_collapsed');
    const savedPinned = localStorage.getItem('sidebar_pinned');
    const savedRecent = localStorage.getItem('sidebar_recent');

    if (savedState) setCollapsed(savedState === 'true');
    if (savedPinned) setPinnedItems(JSON.parse(savedPinned));
    if (savedRecent) setRecentItems(JSON.parse(savedRecent));
    
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const currentItem = ALL_NAV_ITEMS.find(item => item.href === '/ops' ? pathname === '/ops' : pathname.startsWith(item.href));
    if (currentItem) {
      setTimeout(() => {
        setRecentItems(prev => {
          const newRecent = [currentItem.id, ...prev.filter(id => id !== currentItem.id)].slice(0, 3);
          if (JSON.stringify(newRecent) !== JSON.stringify(prev)) {
            localStorage.setItem('sidebar_recent', JSON.stringify(newRecent));
            return newRecent;
          }
          return prev;
        });
      }, 0);
    }
    
    // Close on navigation in mobile
    if (mobileOpen && setMobileOpen) {
      setMobileOpen(false);
    }
  }, [pathname, mounted]);

  const toggleCollapse = () => {
    const newState = !collapsed;
    setCollapsed(newState);
    localStorage.setItem('sidebar_collapsed', String(newState));
  };

  const togglePin = (id: string) => {
    setPinnedItems(prev => {
      const newPinned = prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id];
      localStorage.setItem('sidebar_pinned', JSON.stringify(newPinned));
      return newPinned;
    });
  };

  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData('text/plain', id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    const sourceId = e.dataTransfer.getData('text/plain');
    if (sourceId === targetId) return;

    setPinnedItems(prev => {
      const sourceIndex = prev.indexOf(sourceId);
      const targetIndex = prev.indexOf(targetId);
      const newPinned = [...prev];
      newPinned.splice(sourceIndex, 1);
      newPinned.splice(targetIndex, 0, sourceId);
      localStorage.setItem('sidebar_pinned', JSON.stringify(newPinned));
      return newPinned;
    });
  };

  if (!mounted) return <aside className="w-64 border-r border-surface bg-surface/10 hidden md:flex" />;

  const pinnedNavItems = pinnedItems.map(id => ALL_NAV_ITEMS.find(item => item.id === id)).filter(Boolean) as typeof ALL_NAV_ITEMS;
  const unpinnedNavItems = ALL_NAV_ITEMS.filter(item => !pinnedItems.includes(item.id));
  const recentNavItems = recentItems.map(id => ALL_NAV_ITEMS.find(item => item.id === id)).filter(Boolean) as typeof ALL_NAV_ITEMS;

  const renderNavContent = (isMobile = false) => (
    <>
      <div className="p-6 border-b border-surface h-12 flex items-center shrink-0 justify-between">
        <div className="flex items-center gap-3 text-[#E4002B] overflow-hidden whitespace-nowrap">
          <ShieldAlert size={20} className="shrink-0" />
          {(!collapsed || isMobile) && <h2 className="font-mono text-sm tracking-[0.2em] uppercase font-semibold">SOC Console</h2>}
        </div>
        {isMobile && setMobileOpen && (
          <button onClick={() => setMobileOpen(false)} className="text-muted hover:text-foreground">
            <X size={18} />
          </button>
        )}
      </div>
      
      <nav className="flex-1 overflow-y-auto py-4 flex flex-col gap-6 px-4 custom-scrollbar">
        {pinnedNavItems.length > 0 && (
          <div className="flex flex-col gap-1">
            {(!collapsed || isMobile) && <p className="text-[9px] font-mono uppercase tracking-widest text-muted px-2 mb-1">Pinned</p>}
            {pinnedNavItems.map((item) => {
              const isActive = item.href === '/ops' ? pathname === '/ops' : pathname.startsWith(item.href);
              return (
                <div 
                  key={item.id}
                  draggable={!isMobile}
                  onDragStart={(e) => handleDragStart(e, item.id)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, item.id)}
                  className="relative group cursor-grab active:cursor-grabbing"
                >
                  <Link
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-sm font-mono text-[11px] uppercase tracking-widest transition-colors ${
                      isActive ? 'bg-surface/50 text-foreground border border-surface-strong' : 'text-muted hover:bg-surface/30 hover:text-foreground border border-transparent'
                    } ${collapsed && !isMobile ? 'justify-center' : ''}`}
                    title={collapsed && !isMobile ? item.label : undefined}
                  >
                    <item.icon size={16} className="shrink-0" />
                    {(!collapsed || isMobile) && <span className="truncate">{item.label}</span>}
                  </Link>
                  {(!collapsed || isMobile) && (
                    <button 
                      onClick={() => togglePin(item.id)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 p-1 text-muted hover:text-[#E4002B] transition-opacity"
                    >
                      <Pin size={12} className="fill-current" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {(!collapsed || isMobile) && recentNavItems.length > 0 && (
          <div className="flex flex-col gap-1">
            <p className="text-[9px] font-mono uppercase tracking-widest text-muted px-2 mb-1 flex items-center gap-1"><Clock size={10}/> Recent</p>
            {recentNavItems.map((item) => (
              <Link
                key={`recent-${item.id}`}
                href={item.href}
                className="flex items-center gap-3 px-3 py-1.5 rounded-sm font-mono text-[10px] uppercase tracking-widest transition-colors text-muted/70 hover:bg-surface/30 hover:text-foreground"
              >
                <item.icon size={12} className="shrink-0" />
                <span className="truncate">{item.label}</span>
              </Link>
            ))}
          </div>
        )}

        <div className="flex flex-col gap-1">
          {(!collapsed || isMobile) && <p className="text-[9px] font-mono uppercase tracking-widest text-muted px-2 mb-1">All Pages</p>}
          {unpinnedNavItems.map((item) => {
            const isActive = item.href === '/ops' ? pathname === '/ops' : pathname.startsWith(item.href);
            return (
              <div key={item.id} className="relative group">
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-sm font-mono text-[11px] uppercase tracking-widest transition-colors ${
                    isActive ? 'bg-surface/50 text-foreground border border-surface-strong' : 'text-muted hover:bg-surface/30 hover:text-foreground border border-transparent'
                  } ${collapsed && !isMobile ? 'justify-center' : ''}`}
                  title={collapsed && !isMobile ? item.label : undefined}
                >
                  <item.icon size={16} className="shrink-0" />
                  {(!collapsed || isMobile) && <span className="truncate">{item.label}</span>}
                </Link>
                {(!collapsed || isMobile) && (
                  <button 
                    onClick={() => togglePin(item.id)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 p-1 text-muted hover:text-foreground transition-opacity"
                  >
                    <Pin size={12} />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </nav>

      <div className="p-4 border-t border-surface shrink-0">
        <form action={logout}>
          <button type="submit" className={`flex w-full items-center gap-3 py-3 text-muted hover:text-[#E4002B] hover:bg-[#E4002B]/10 rounded-sm font-mono text-[11px] uppercase tracking-widest transition-colors ${collapsed && !isMobile ? 'justify-center px-0' : 'px-4'}`} title={collapsed && !isMobile ? "End Session" : undefined}>
            <LogOut size={16} className="shrink-0" />
            {(!collapsed || isMobile) && "End Session"}
          </button>
        </form>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className={`border-r border-surface bg-surface/10 flex-col hidden md:flex transition-all duration-300 relative ${collapsed ? 'w-20' : 'w-64'}`}>
        <button 
          onClick={toggleCollapse}
          className="absolute -right-3 top-8 bg-background border border-surface rounded-full p-1 text-muted hover:text-foreground z-10 shadow-sm"
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
        {renderNavContent(false)}
      </aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen?.(false)}
              className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', bounce: 0, duration: 0.3 }}
              className="fixed inset-y-0 left-0 z-50 w-3/4 max-w-sm flex flex-col border-r border-surface bg-background md:hidden shadow-xl"
            >
              {renderNavContent(true)}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
