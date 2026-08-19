'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Shield, 
  Terminal as TerminalIcon, 
  Mail, 
  FileText, 
  ArrowUpRight,
  ChevronUp,
  Server,
  Database,
  Activity,
  Lock
} from 'lucide-react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { useState, useEffect } from 'react';

const SECTIONS = [
  { name: 'Overview', href: '/#hero' },
  { name: 'About', href: '/#about' },
  { name: 'Experience', href: '/#projects' },
  { name: 'Skills', href: '/#skills' },
  { name: 'Projects', href: '/#projects' },
  { name: 'Certificates', href: '/#about' },
  { name: 'Terminal', href: '/#terminal' },
  { name: 'Contact', href: '/#contact' },
];

const RESOURCES = [
  { name: 'Resume', href: '/Resume', icon: FileText, external: false },
  { name: 'GitHub', href: 'https://github.com/JothishGandham', icon: FaGithub, external: true },
  { name: 'LinkedIn', href: 'https://www.linkedin.com/in/jothish-gandham/', icon: FaLinkedin, external: true },
  { name: 'Email', href: 'mailto:gandhamjothish1@gmail.com', icon: Mail, external: true },
  { name: 'SOC Dashboard', href: '/ops', icon: Shield, external: false },
];

const LEGAL = [
  { name: 'Privacy Policy', href: '/privacy-policy' },
  { name: 'Terms & Conditions', href: '/terms-and-conditions' },
  { name: 'Cookie Policy', href: '/cookie-policy' },
  { name: 'Responsible Disclosure', href: '/responsible-disclosure' },
  { name: 'Security Policy', href: '/security-policy' },
];

export default function Footer() {
  const pathname = usePathname();
  const isHome = pathname === '/';
  
  const [buildInfo, setBuildInfo] = useState({
    version: 'v2.4.0-stable',
    updated: new Date().toISOString().split('T')[0],
    env: 'production',
    api: 'operational',
    db: 'operational'
  });

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    fetch('/api/telemetry', { method: 'POST', body: JSON.stringify({ type: 'ping' }) })
      .then(res => {
        if(res.ok) setBuildInfo(prev => ({ ...prev, api: 'operational', db: 'operational' }));
        else setBuildInfo(prev => ({ ...prev, api: 'degraded' }));
      })
      .catch(() => setBuildInfo(prev => ({ ...prev, api: 'offline' })));
  }, []);

  return (
    <footer className="w-full border-t border-surface bg-background relative z-10 overflow-hidden">
      {/* Decorative Grid */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />
      
      <div className="max-w-7xl mx-auto px-6 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">
          
          {/* SECTION 1: Brand */}
          <div className="lg:col-span-4 space-y-6">
            <Link href="/" className="inline-flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-sm bg-surface/50 border border-surface flex items-center justify-center text-foreground font-mono font-bold text-lg group-hover:border-foreground/30 transition-colors">
                JG
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold tracking-tight text-foreground uppercase">Jothish Gandham</span>
                <span className="text-[10px] font-mono text-muted uppercase tracking-[0.2em]">Security Analyst</span>
              </div>
            </Link>
            <p className="text-[13px] leading-relaxed text-muted max-w-sm">
              Building secure systems, exploring offensive and defensive security, and continuously learning modern cybersecurity.
            </p>
          </div>

          {/* SECTION 2: Navigation */}
          <div className="lg:col-span-2">
            <h3 className="text-[10px] font-mono uppercase tracking-[0.2em] text-foreground mb-6 flex items-center gap-2">
              <TerminalIcon size={12} className="text-muted" /> Navigation
            </h3>
            <ul className="space-y-3">
              {SECTIONS.map((item) => (
                <li key={item.name}>
                  <Link 
                    href={item.href}
                    className="text-[13px] text-muted hover:text-foreground transition-colors inline-flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-surface group-hover:bg-foreground transition-colors" />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* SECTION 3: Resources */}
          <div className="lg:col-span-3">
            <h3 className="text-[10px] font-mono uppercase tracking-[0.2em] text-foreground mb-6 flex items-center gap-2">
              <Server size={12} className="text-muted" /> Resources
            </h3>
            <ul className="space-y-3">
              {RESOURCES.map((item) => (
                <li key={item.name}>
                  <Link 
                    href={item.href}
                    target={item.external ? "_blank" : undefined}
                    rel={item.external ? "noreferrer" : undefined}
                    className="text-[13px] text-muted hover:text-foreground transition-colors inline-flex items-center gap-2 group"
                  >
                    <item.icon size={14} className="opacity-50 group-hover:opacity-100 transition-opacity" />
                    {item.name}
                    {item.external && <ArrowUpRight size={12} className="opacity-0 -ml-1 group-hover:opacity-50 transition-all transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* SECTION 4: Legal */}
          <div className="lg:col-span-3">
            <h3 className="text-[10px] font-mono uppercase tracking-[0.2em] text-foreground mb-6 flex items-center gap-2">
              <Lock size={12} className="text-muted" /> Legal
            </h3>
            <ul className="space-y-3">
              {LEGAL.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.name}>
                    <Link 
                      href={item.href}
                      className={`text-[13px] transition-colors inline-flex items-center gap-2 ${isActive ? 'text-foreground font-medium' : 'text-muted hover:text-foreground'}`}
                    >
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

        </div>

        {/* SECTION 5: Status Panel */}
        <div className="mt-16 pt-8 border-t border-surface/50">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="flex flex-col gap-1">
              <span className="text-[9px] font-mono text-muted uppercase tracking-widest">Version</span>
              <span className="text-[11px] font-mono text-foreground">{buildInfo.version}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[9px] font-mono text-muted uppercase tracking-widest">Updated</span>
              <span className="text-[11px] font-mono text-foreground">{buildInfo.updated}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[9px] font-mono text-muted uppercase tracking-widest">Environment</span>
              <span className="text-[11px] font-mono text-foreground capitalize flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                {buildInfo.env}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[9px] font-mono text-muted uppercase tracking-widest">API Status</span>
              <span className="text-[11px] font-mono text-foreground capitalize flex items-center gap-1.5">
                <span className={`w-1.5 h-1.5 rounded-full ${buildInfo.api === 'operational' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                {buildInfo.api}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[9px] font-mono text-muted uppercase tracking-widest">Database</span>
              <span className="text-[11px] font-mono text-foreground capitalize flex items-center gap-1.5">
                <span className={`w-1.5 h-1.5 rounded-full ${buildInfo.db === 'operational' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                {buildInfo.db}
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* BOTTOM BAR */}
      <div className="border-t border-surface bg-surface/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[10px] font-mono text-muted uppercase tracking-widest text-center sm:text-left">
            © {new Date().getFullYear()} Jothish Gandham • All Rights Reserved
          </p>
          
          <div className="flex items-center gap-4 text-[10px] font-mono text-muted uppercase tracking-widest">
            <span className="hidden sm:inline">Made with Next.js</span>
            <span className="hidden sm:inline text-surface-strong">•</span>
            <span className="hidden sm:inline">Powered by Vercel</span>
            
            <button 
              onClick={scrollToTop}
              className="ml-4 p-2 rounded-sm bg-surface/30 hover:bg-surface border border-surface transition-colors text-foreground group"
              aria-label="Back to top"
            >
              <ChevronUp size={14} className="group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
