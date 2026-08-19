'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShieldCheck, History, MonitorOff, Activity } from 'lucide-react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const tabs = [
    { href: '/ops/auth/logins', label: 'Login History', icon: History },
    { href: '/ops/auth/sessions', label: 'Active Sessions', icon: Activity },
    { href: '/ops/auth/rate-limits', label: 'Rate Limiting', icon: MonitorOff },
    { href: '/ops/auth/roles', label: 'Roles & Permissions', icon: ShieldCheck },
  ];

  return (
    <div className="space-y-6">
      <header className="mb-8 border-b border-surface pb-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight uppercase text-foreground flex items-center gap-3">
            Access Control
            <ShieldCheck className="text-emerald-500" size={24} />
          </h1>
          <p className="text-muted text-[10px] font-mono mt-2 tracking-[0.24em] uppercase">
            Authentication Logs & Session Management
          </p>
        </div>
        
        <nav className="flex items-center gap-2 bg-surface/10 p-1 rounded-sm border border-surface w-full md:w-auto overflow-x-auto">
          {tabs.map(tab => {
            const isActive = pathname === tab.href;
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`flex items-center gap-2 px-4 py-2 rounded-sm font-mono text-[10px] uppercase tracking-widest transition-colors whitespace-nowrap ${
                  isActive 
                    ? 'bg-background text-foreground border border-surface shadow-sm' 
                    : 'text-muted hover:text-foreground hover:bg-surface/50 border border-transparent'
                }`}
              >
                <tab.icon size={14} />
                {tab.label}
              </Link>
            );
          })}
        </nav>
      </header>

      <div className="bg-background border border-surface rounded-sm min-h-[500px]">
        {children}
      </div>
    </div>
  );
}
