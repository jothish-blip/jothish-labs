'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import GlobalSearch from '@/components/ops/GlobalSearch';
import NotificationSystem from '@/components/ops/NotificationSystem';
import Sidebar from '@/components/ops/Sidebar';
import AdminNavbar from '@/components/ops/AdminNavbar';

export default function OpsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

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

  return (
    <div className="flex min-h-screen bg-background font-sans text-foreground overflow-hidden">
      <head>
        <meta name="robots" content="noindex, nofollow, nosnippet, noarchive" />
        <meta name="googlebot" content="noindex, nofollow" />
      </head>
      <Sidebar setSearchOpen={setSearchOpen} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <AdminNavbar setSearchOpen={setSearchOpen} setMobileOpen={setMobileOpen} />
        
        <main id="ops-main-content" className="flex-1 overflow-auto bg-background/50 relative">
          <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.02] bg-[radial-gradient(circle,currentColor_1px,transparent_1px)] bg-[size:16px_16px]"></div>
          <div className="relative z-10 p-6 md:p-10 max-w-[1600px] mx-auto min-h-full">
            {children}
          </div>
        </main>
      </div>

      <GlobalSearch isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      <NotificationSystem />
    </div>
  );
}
