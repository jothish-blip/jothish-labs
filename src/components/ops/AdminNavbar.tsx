'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, Bell, Moon, Sun, Server, Database, Clock } from 'lucide-react';
import { trackEvent, TELEMETRY_EVENTS } from '@/lib/telemetry/events';
import QuickActions from './QuickActions';
import ProfileDropdown from './ProfileDropdown';
import NotificationPanel from './NotificationPanel';

export default function AdminNavbar({ setSearchOpen, setMobileOpen }: { setSearchOpen: (val: boolean) => void, setMobileOpen?: (val: boolean) => void }) {
  const [navState, setNavState] = useState({ scrolled: false, hidden: false });
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [time, setTime] = useState('');
  
  const lastScrollY = useRef(0);
  const scrollTimeout = useRef<number | null>(null);

  useEffect(() => {
    const updateTime = () => setTime(new Date().toLocaleTimeString('en-US', { hour12: false }));
    updateTime();
    const int = setInterval(updateTime, 1000);
    return () => clearInterval(int);
  }, []);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark" || savedTheme === "light") {
      setTheme(savedTheme);
      document.documentElement.classList.toggle("dark", savedTheme === "dark");
      return;
    }
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setTheme(prefersDark ? "dark" : "light");
    document.documentElement.classList.toggle("dark", prefersDark);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (scrollTimeout.current) return;
      scrollTimeout.current = window.requestAnimationFrame(() => {
        const currentScroll = window.scrollY;
        
        let newScrolled = false;
        let newHidden = false;

        if (currentScroll > 50) {
          newScrolled = true;
          newHidden = currentScroll > lastScrollY.current && currentScroll > 100;
        }

        lastScrollY.current = currentScroll;
        setNavState(prev => {
          if (prev.scrolled !== newScrolled || prev.hidden !== newHidden) {
            return { scrolled: newScrolled, hidden: newHidden };
          }
          return prev;
        });
        scrollTimeout.current = null;
      });
    };

    const mainContent = document.getElementById('ops-main-content');
    if (mainContent) {
        mainContent.addEventListener("scroll", handleScroll, { passive: true });
    }
    return () => {
      if (mainContent) mainContent.removeEventListener("scroll", handleScroll);
      if (scrollTimeout.current) cancelAnimationFrame(scrollTimeout.current);
    };
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
    localStorage.setItem("theme", newTheme);
  };

  const { scrolled, hidden } = navState;

  return (
    <div 
      className={`sticky top-0 z-40 transition-all duration-300 ease-in-out w-full
        ${hidden ? "-translate-y-full" : "translate-y-0"}
        ${scrolled ? "bg-background/80 backdrop-blur-md border-b border-surface py-2 shadow-sm" : "bg-transparent py-4 border-b border-transparent"}
      `}
    >
      <div className="px-6 flex items-center justify-between w-full h-12">
        
        {/* Left Side: Search & System Status */}
        <div className="flex items-center gap-6">
          <button 
            onClick={() => setMobileOpen?.(true)}
            className="md:hidden p-2 -ml-2 text-muted hover:text-foreground hover:bg-surface/30 rounded-sm transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
          </button>
          <button 
            onClick={() => setSearchOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 bg-surface/30 border border-surface rounded-sm text-muted hover:text-foreground hover:bg-surface/50 transition-colors"
          >
            <Search size={14} />
            <span className="font-mono text-[10px] uppercase tracking-widest hidden sm:inline-block">Cmd+K Search</span>
          </button>
          
          <div className="hidden lg:flex items-center gap-4 border-l border-surface pl-6">
             <div className="flex items-center gap-2 text-[10px] font-mono text-emerald-500 tracking-widest uppercase">
               <Server size={12} />
               <span>v2.1.0-stable</span>
             </div>
             <div className="flex items-center gap-2 text-[10px] font-mono text-emerald-500 tracking-widest uppercase">
               <Database size={12} />
               <span>DB: Nominal</span>
             </div>
             <div className="flex items-center gap-2 text-[10px] font-mono text-muted tracking-widest uppercase">
               <Clock size={12} />
               <span>{time || '--:--:--'}</span>
             </div>
          </div>
        </div>

        {/* Right Side: Quick Actions, Notifications, Profile, Theme */}
        <div className="flex items-center gap-4">
          <QuickActions />
          <NotificationPanel />

          <button 
            onClick={toggleTheme}
            className="p-2 text-muted hover:text-foreground transition-colors rounded-sm hover:bg-surface/30"
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          <ProfileDropdown />
        </div>
      </div>
    </div>
  );
}
