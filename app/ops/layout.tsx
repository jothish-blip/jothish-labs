'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  MessageSquare, 
  Activity, 
  Settings,
  LogOut,
  ShieldAlert,
  Search,
  FileBarChart,
  Menu,
  X
} from 'lucide-react';
import { logout } from './login/actions';
import GlobalSearch from '@/components/ops/GlobalSearch';
import NotificationSystem from '@/components/ops/NotificationSystem';

export default function OpsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  // Close mobile menu on route change
  useEffect(() => {
    if (mobileMenuOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setMobileMenuOpen(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (pathname.startsWith('/ops/login')) {
    return <>{children}</>;
  }

  const navItems = [
    { href: '/ops', label: 'Overview', icon: LayoutDashboard },
    { href: '/ops/visitors', label: 'Visitor Intel', icon: Users },
    { href: '/ops/contacts', label: 'Contacts', icon: MessageSquare },
    { href: '/ops/security', label: 'Security', icon: ShieldAlert },
    { href: '/ops/reports', label: 'Reports', icon: FileBarChart },
    { href: '/ops/audit', label: 'Audit Log', icon: Activity },
    { href: '/ops/system', label: 'System Health', icon: Activity },
    { href: '/ops/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="flex min-h-screen bg-background font-sans text-foreground">
      {/* Sidebar */}
      <aside className="w-64 border-r border-surface bg-surface/10 flex flex-col hidden md:flex">
        <div className="p-6 border-b border-surface">
          <div className="flex items-center gap-3 text-[#E4002B]">
            <ShieldAlert size={20} />
            <h2 className="font-mono text-sm tracking-[0.2em] uppercase font-semibold">SOC Console</h2>
          </div>
        </div>
        
        <div className="p-4 border-b border-surface">
          <button 
            onClick={() => setSearchOpen(true)}
            className="w-full flex items-center justify-between px-3 py-2 bg-background border border-surface rounded-sm text-muted hover:text-foreground hover:border-surface-strong transition-colors"
          >
            <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest">
              <Search size={14} /> Search
            </div>
            <div className="flex items-center gap-1 font-mono text-[9px]">
              <span className="border border-surface px-1 py-0.5 rounded-[2px] bg-surface/50 text-foreground">Cmd</span>
              <span className="border border-surface px-1.5 py-0.5 rounded-[2px] bg-surface/50 text-foreground">K</span>
            </div>
          </button>
        </div>
        
        <nav className="flex-1 py-4 flex flex-col gap-2 px-4">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            // Exact match for /ops
            const actuallyActive = item.href === '/ops' ? pathname === '/ops' : isActive;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-sm font-mono text-[11px] uppercase tracking-widest transition-colors ${
                  actuallyActive 
                    ? 'bg-surface/50 text-foreground border border-surface-strong' 
                    : 'text-muted hover:bg-surface/30 hover:text-foreground border border-transparent'
                }`}
              >
                <item.icon size={16} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-surface">
          <form action={logout}>
            <button type="submit" className="flex w-full items-center gap-3 px-4 py-3 text-muted hover:text-[#E4002B] hover:bg-[#E4002B]/10 rounded-sm font-mono text-[11px] uppercase tracking-widest transition-colors">
              <LogOut size={16} />
              End Session
            </button>
          </form>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 border-b border-surface bg-background/90 backdrop-blur-md z-40 flex items-center justify-between px-4">
        <div className="flex items-center gap-3 text-[#E4002B]">
          <ShieldAlert size={20} />
          <h2 className="font-mono text-sm tracking-[0.2em] uppercase font-semibold">SOC Console</h2>
        </div>
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="text-muted hover:text-foreground p-2"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-16 z-40 bg-background/95 backdrop-blur-lg flex flex-col border-t border-surface">
          <div className="p-4 border-b border-surface">
            <button 
              onClick={() => { setSearchOpen(true); setMobileMenuOpen(false); }}
              className="w-full flex items-center justify-between px-3 py-3 bg-surface/10 border border-surface rounded-sm text-muted hover:text-foreground hover:border-surface-strong transition-colors"
            >
              <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest">
                <Search size={16} /> Global Search
              </div>
            </button>
          </div>
          
          <nav className="flex-1 overflow-auto py-4 flex flex-col gap-1 px-4">
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
              const actuallyActive = item.href === '/ops' ? pathname === '/ops' : isActive;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-4 rounded-sm font-mono text-[12px] uppercase tracking-widest transition-colors ${
                    actuallyActive 
                      ? 'bg-surface/50 text-foreground border border-surface-strong' 
                      : 'text-muted hover:bg-surface/30 hover:text-foreground border border-transparent'
                  }`}
                >
                  <item.icon size={18} />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="p-6 border-t border-surface mt-auto">
            <form action={logout}>
              <button type="submit" className="flex w-full items-center justify-center gap-3 px-4 py-4 text-muted hover:text-[#E4002B] hover:bg-[#E4002B]/10 border border-transparent hover:border-[#E4002B]/20 rounded-sm font-mono text-[12px] uppercase tracking-widest transition-colors">
                <LogOut size={18} />
                End Session
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-auto bg-background/50 relative pt-16 md:pt-0">
        <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.02] bg-[radial-gradient(circle,currentColor_1px,transparent_1px)] bg-[size:16px_16px]"></div>
        <div className="relative z-10 p-6 md:p-10 max-w-7xl mx-auto">
          {children}
        </div>
      </main>

      <GlobalSearch isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      <NotificationSystem />
    </div>
  );
}
