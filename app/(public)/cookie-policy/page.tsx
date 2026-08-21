"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, useScroll, useSpring, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, ShieldCheck, Lock, Database, Globe, CheckCircle2, 
  Clock, Activity, ChevronDown, Link as LinkIcon, AlertTriangle, 
  Shield, FileCode2, Copy, Settings, Fingerprint, Box, ExternalLink,
  Cookie, LayoutGrid, Server,
  Info
} from 'lucide-react';

const sections = [
  { id: 'purpose', title: '1. Why Cookies Are Used' },
  { id: 'inventory', title: '2. Cookie Inventory' },
  { id: 'categories', title: '3. Cookie Categories' },
  { id: 'local-storage', title: '4. Local Storage' },
  { id: 'third-parties', title: '5. Third-Party Services' },
  { id: 'management', title: '6. Managing Cookies' },
  { id: 'storage-types', title: '7. Browser Storage' },
  { id: 'retention', title: '8. Cookie Retention' },
  { id: 'related', title: '9. Related Policies' },
];

export default function CookiePolicy() {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState<string>(sections[0].id);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState<string | null>(null);
  const [copiedCookie, setCopiedCookie] = useState<string | null>(null);

  // Reading Progress Bar
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  // Sidebar Progress Logic
  const activeIndex = sections.findIndex(s => s.id === activeSection);

  // Scrollspy logic
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-20% 0px -80% 0px' }
    );

    sections.forEach((sec) => {
      const element = document.getElementById(sec.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  // Copy Link Function
  const handleCopyLink = (id: string) => {
    const url = `${window.location.origin}${window.location.pathname}#${id}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(id);
    setTimeout(() => setCopiedLink(null), 2000);
  };

  const handleCopyCookie = (cookieName: string) => {
    navigator.clipboard.writeText(cookieName);
    setCopiedCookie(cookieName);
    setTimeout(() => setCopiedCookie(null), 2000);
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const yOffset = -120;
      const y = el.getBoundingClientRect().top + window.scrollY + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans pb-12 relative selection:bg-amber-500/30">
      
      <style>{`
        :root {
          --accent-cookie: #f59e0b; /* Amber 500 */
        }
      `}</style>

      {/* Reading Progress Bar */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1.5 z-50 origin-left shadow-[0_0_10px_rgba(245,158,11,0.5)]"
        style={{ scaleX, backgroundColor: 'var(--accent-cookie)' }}
      />

      {/* --- RADIOLUCENT (X-RAY) BACKGROUND EFFECT --- */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 z-0 pointer-events-none flex items-center justify-center overflow-hidden w-full h-[600px]">
        <div className="w-[300px] h-[150px] md:w-[700px] md:h-[300px] blur-[100px] rounded-[100%] opacity-15 mix-blend-screen" style={{ backgroundColor: 'var(--accent-cookie)' }}></div>
        <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(circle,currentColor_1px,transparent_1px)] bg-[size:16px_16px]"></div>
      </div>

      {/* Top Navigation / Back */}
      <div className="max-w-[1400px] mx-auto px-6 pt-12 pb-6 relative z-10">
        <button 
          onClick={() => router.back()}
          className="font-mono text-[11px] uppercase tracking-widest text-muted hover:text-foreground inline-flex items-center gap-2 transition-colors border border-surface bg-surface/30 px-4 py-2 rounded-sm hover:bg-surface focus:outline-none focus:ring-2 focus:ring-amber-500/50 cursor-pointer"
        >
          <ArrowLeft size={14} /> Back to Portfolio
        </button>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 relative items-start z-10">
        
        {/* Desktop Sidebar (Progress Style) */}
        <aside className="hidden lg:block lg:col-span-3 sticky top-24 max-h-[calc(100vh-120px)] overflow-y-auto no-scrollbar">
          <nav className="flex flex-col font-mono text-[11px] uppercase tracking-widest relative pb-10">
            <h3 className="text-foreground font-bold mb-6 flex items-center gap-2 tracking-[0.24em]">
              <Cookie size={16} style={{ color: 'var(--accent-cookie)' }} /> Document Index
            </h3>
            
            <div className="absolute left-[7px] top-[45px] bottom-[40px] w-px bg-surface z-0" />
            
            <ul className="space-y-4 relative z-10">
              {sections.map((section, idx) => {
                const isPast = idx < activeIndex;
                const isActive = idx === activeIndex;
                
                return (
                  <li key={section.id}>
                    <button 
                      onClick={() => scrollToSection(section.id)}
                      className={`flex items-center gap-4 text-left transition-colors duration-300 focus:outline-none ${isActive ? 'text-foreground font-semibold' : isPast ? 'text-muted' : 'text-muted/50 hover:text-foreground'}`}
                      aria-current={isActive ? "page" : undefined}
                    >
                      <span className={`flex items-center justify-center w-[15px] h-[15px] shrink-0 bg-background transition-colors ${isActive || isPast ? '' : 'text-surface-strong'}`} style={isActive || isPast ? { color: 'var(--accent-cookie)' } : {}}>
                        {isPast ? <CheckCircle2 size={14} /> : isActive ? <span className="w-1.5 h-1.5 rounded-full shadow-[0_0_8px_currentColor]" style={{ backgroundColor: 'var(--accent-cookie)' }} /> : <span className="w-1.5 h-1.5 rounded-full border border-current" />}
                      </span>
                      <span className="truncate">{section.title.split('. ')[1]}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="lg:col-span-9 space-y-16">
          
          {/* Mobile Jump Menu */}
          <div className="lg:hidden sticky top-4 z-40 mb-8">
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="w-full bg-background/95 backdrop-blur-md border border-surface shadow-lg rounded-md p-4 flex items-center justify-between text-[12px] font-mono uppercase tracking-widest text-foreground focus:outline-none focus:ring-2 focus:ring-amber-500/50"
            >
              <span className="flex items-center gap-2"><Cookie size={14} style={{ color: 'var(--accent-cookie)' }}/> Jump to Section</span>
              <ChevronDown size={16} className={`transition-transform duration-300 ${mobileMenuOpen ? "rotate-180" : ""}`} />
            </button>
            <AnimatePresence>
              {mobileMenuOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-background border border-surface rounded-md shadow-2xl overflow-hidden max-h-[60vh] overflow-y-auto z-50"
                >
                  {sections.map(sec => (
                    <button 
                      key={sec.id}
                      onClick={() => scrollToSection(sec.id)}
                      className="w-full text-left p-4 border-b border-surface text-[12px] font-mono uppercase tracking-widest hover:bg-surface/30 text-muted hover:text-foreground transition-colors"
                    >
                      {sec.title}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Hero Section */}
          <header className="mb-16">
            <motion.h1 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-4 uppercase leading-[1.1]"
            >
              Cookie <br />
              <span className="text-muted italic font-light">Policy.</span>
            </motion.h1>
            
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-wrap items-center gap-3 mt-8 font-mono text-[10px] sm:text-[11px] uppercase tracking-widest"
            >
              <span className="px-3 py-1.5 border rounded-sm font-semibold flex items-center gap-2 text-foreground" style={{ backgroundColor: 'color-mix(in srgb, var(--accent-cookie) 10%, transparent)', borderColor: 'color-mix(in srgb, var(--accent-cookie) 30%, transparent)' }}>
                Browser Storage & Tracking Information
              </span>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
              className="flex flex-wrap gap-6 mt-8 pt-6 border-t border-surface text-[11px] font-mono text-muted uppercase tracking-widest"
            >
              <div className="flex flex-col gap-1">
                <span className="text-foreground/50">Status</span>
                <span className="text-emerald-500 font-semibold flex items-center gap-1.5"><span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"/> Minimal Cookies</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-foreground/50">Third-Party Ads</span>
                <span className="text-foreground font-semibold">None</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-foreground/50">Last Updated</span>
                <span className="text-foreground font-semibold">August 2026</span>
              </div>
            </motion.div>
            
            <motion.p 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
              className="mt-8 text-[14px] md:text-[15px] text-muted max-w-3xl leading-relaxed"
            >
              This website uses a minimal number of first-party cookies and browser storage technologies to provide essential functionality, maintain security, and improve the visitor experience. No advertising or cross-site tracking cookies are used.
            </motion.p>
          </header>

          {/* Cookie Status Dashboard Banner */}
          <div className="border border-surface bg-surface/10 rounded-xl p-6 sm:p-8 relative overflow-hidden shadow-lg mb-12">
            <div className="absolute top-0 left-0 right-0 h-1" style={{ backgroundColor: 'var(--accent-cookie)' }} />
            <div className="flex items-center gap-2 mb-8">
              <Activity size={18} style={{ color: 'var(--accent-cookie)' }} />
              <h2 className="text-[12px] font-mono text-muted uppercase tracking-[0.24em] font-bold">Cookie Status</h2>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-y-8 gap-x-6">
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-mono text-muted uppercase tracking-widest">First-Party</span>
                <span className="text-[13px] font-mono text-emerald-500 uppercase font-semibold flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Enabled</span>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-mono text-muted uppercase tracking-widest">Third-Party Ads</span>
                <span className="text-[13px] font-mono text-surface-strong uppercase font-semibold flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-surface-strong" /> Disabled</span>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-mono text-muted uppercase tracking-widest">Cross-Site Tracking</span>
                <span className="text-[13px] font-mono text-surface-strong uppercase font-semibold flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-surface-strong" /> Disabled</span>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-mono text-muted uppercase tracking-widest">Essential Cookies</span>
                <span className="text-[13px] font-mono text-emerald-500 uppercase font-semibold flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Enabled</span>
              </div>
            </div>
          </div>

          {/* Cookies at a Glance Summary Card */}
          <div className="border border-surface bg-background rounded-xl p-8 shadow-sm">
            <h2 className="text-[13px] font-mono text-foreground uppercase tracking-[0.24em] font-bold mb-6 flex items-center gap-2 border-b border-surface pb-4">
              <Shield size={16} style={{ color: 'var(--accent-cookie)' }} /> Cookies at a Glance
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-5 gap-x-8 text-[14px] text-foreground/80 font-medium">
              <div className="flex items-center gap-3"><CheckCircle2 size={16} className="text-emerald-500 shrink-0" /> First-Party Cookies</div>
              <div className="flex items-center gap-3"><CheckCircle2 size={16} className="text-emerald-500 shrink-0" /> Minimal Browser Storage</div>
              <div className="flex items-center gap-3"><CheckCircle2 size={16} className="text-emerald-500 shrink-0" /> Security Focused</div>
              <div className="flex items-center gap-3"><CheckCircle2 size={16} className="text-emerald-500 shrink-0" /> Functional Only</div>
              <div className="flex items-center gap-3"><CheckCircle2 size={16} className="text-emerald-500 shrink-0" /> No Advertising Cookies</div>
              <div className="flex items-center gap-3"><CheckCircle2 size={16} className="text-emerald-500 shrink-0" /> No Third-Party Trackers</div>
            </div>
          </div>

          <div className="h-px w-full bg-surface my-12" />

          {/* MAIN SECTIONS */}
          <div className="space-y-24 text-muted leading-[1.8] text-[15px] md:text-[16px]">
            
            {/* 1. Why Cookies Are Used */}
            <section id="purpose" className="scroll-mt-32 relative group outline-none" tabIndex={-1}>
              <h2 className="text-[13px] font-mono uppercase tracking-[0.24em] text-foreground border-b border-surface pb-4 mb-8 flex items-center gap-3">
                <Info size={18} className="text-blue-500" /> 1. Why Cookies Are Used
                <button onClick={() => handleCopyLink('purpose')} className="opacity-0 group-hover:opacity-100 transition-opacity ml-auto text-muted hover:text-foreground focus:opacity-100 outline-none p-1 rounded-sm focus:ring-2 focus:ring-amber-500/50" aria-label="Copy link to section">
                  {copiedLink === 'purpose' ? <CheckCircle2 size={16} className="text-emerald-500" /> : <LinkIcon size={16} />}
                </button>
              </h2>
              <div className="p-6 md:p-8 bg-surface/5 border border-surface rounded-md">
                <p className="mb-4">Cookies help maintain secure sessions, remember user preferences, protect interactive features, and support basic operational analytics.</p>
                <p className="text-foreground/90 font-medium">The website does not use cookies for advertising or behavioral profiling.</p>
              </div>
            </section>

            {/* 2. Cookie Inventory */}
            <section id="inventory" className="scroll-mt-32 relative group outline-none" tabIndex={-1}>
              <h2 className="text-[13px] font-mono uppercase tracking-[0.24em] text-foreground border-b border-surface pb-4 mb-8 flex items-center gap-3">
                <Database size={18} className="text-purple-500" /> 2. Cookie Inventory
                <button onClick={() => handleCopyLink('inventory')} className="opacity-0 group-hover:opacity-100 transition-opacity ml-auto text-muted hover:text-foreground focus:opacity-100 outline-none p-1 rounded-sm focus:ring-2 focus:ring-amber-500/50">
                  {copiedLink === 'inventory' ? <CheckCircle2 size={16} className="text-emerald-500" /> : <LinkIcon size={16} />}
                </button>
              </h2>
              
              <div className="hidden md:block overflow-x-auto border border-surface rounded-md">
                <table className="w-full text-left text-[14px] border-collapse bg-background">
                  <thead className="bg-surface/30">
                    <tr className="border-b border-surface text-foreground font-mono text-[10px] uppercase tracking-[0.2em]">
                      <th className="py-4 px-6 font-semibold">Cookie</th>
                      <th className="py-4 px-4 font-semibold">Type</th>
                      <th className="py-4 px-4 font-semibold w-2/5">Purpose</th>
                      <th className="py-4 px-6 font-semibold">Retention</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface">
                    <tr className="hover:bg-surface/10 transition-colors">
                      <td className="py-5 px-6 font-mono text-[13px] text-foreground font-medium">
                        <div className="flex items-center gap-2">
                          pf_vid
                          <button onClick={() => handleCopyCookie('pf_vid')} className="p-1 hover:bg-surface rounded-sm text-muted hover:text-foreground transition-colors" title="Copy Cookie Name">
                            {copiedCookie === 'pf_vid' ? <CheckCircle2 size={12} className="text-emerald-500" /> : <Copy size={12} />}
                          </button>
                        </div>
                      </td>
                      <td className="py-5 px-4"><span className="text-amber-500 bg-amber-500/10 px-2 py-1 rounded-sm text-[11px] font-mono uppercase tracking-widest border border-amber-500/20">Analytics</span></td>
                      <td className="py-5 px-4 text-muted text-[13px]">Anonymous visitor identifier to group operational events. Contains a randomly generated identifier and is not intended to directly identify an individual.</td>
                      <td className="py-5 px-6 font-mono text-[11px] text-foreground">12 Months</td>
                    </tr>
                    <tr className="hover:bg-surface/10 transition-colors">
                      <td className="py-5 px-6 font-mono text-[13px] text-foreground font-medium">
                        <div className="flex items-center gap-2">
                          pf_sid
                          <button onClick={() => handleCopyCookie('pf_sid')} className="p-1 hover:bg-surface rounded-sm text-muted hover:text-foreground transition-colors" title="Copy Cookie Name">
                            {copiedCookie === 'pf_sid' ? <CheckCircle2 size={12} className="text-emerald-500" /> : <Copy size={12} />}
                          </button>
                        </div>
                      </td>
                      <td className="py-5 px-4"><span className="text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-sm text-[11px] font-mono uppercase tracking-widest border border-emerald-500/20">Essential</span></td>
                      <td className="py-5 px-4 text-muted text-[13px]">Session continuity identifier used to track active engagement during the current browsing session.</td>
                      <td className="py-5 px-6 font-mono text-[11px] text-foreground">24 Hours</td>
                    </tr>
                    <tr className="hover:bg-surface/10 transition-colors">
                      <td className="py-5 px-6 font-mono text-[13px] text-foreground font-medium">
                        <div className="flex items-center gap-2">
                          sb-*
                          <button onClick={() => handleCopyCookie('sb-*')} className="p-1 hover:bg-surface rounded-sm text-muted hover:text-foreground transition-colors" title="Copy Cookie Name">
                            {copiedCookie === 'sb-*' ? <CheckCircle2 size={12} className="text-emerald-500" /> : <Copy size={12} />}
                          </button>
                        </div>
                      </td>
                      <td className="py-5 px-4"><span className="text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-sm text-[11px] font-mono uppercase tracking-widest border border-emerald-500/20">Essential</span></td>
                      <td className="py-5 px-4 text-muted text-[13px]">Administrator login session and authentication tokens via Supabase. Only active for administrative endpoints.</td>
                      <td className="py-5 px-6 font-mono text-[11px] text-foreground">Session</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Mobile Stacked Cards for Inventory */}
              <div className="md:hidden space-y-4">
                {[
                  { name: "pf_vid", type: "Analytics", typeColor: "text-amber-500 bg-amber-500/10 border-amber-500/20", desc: "Anonymous visitor identifier to group operational events. Contains a randomly generated identifier and is not intended to directly identify an individual.", duration: "12 Months" },
                  { name: "pf_sid", type: "Essential", typeColor: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20", desc: "Session continuity identifier used to track active engagement during the current browsing session.", duration: "24 Hours" },
                  { name: "sb-*", type: "Essential", typeColor: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20", desc: "Administrator login session and authentication tokens via Supabase. Only active for administrative endpoints.", duration: "Session" },
                ].map(cookie => (
                  <div key={cookie.name} className="bg-surface/5 border border-surface p-5 rounded-md">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[13px] text-foreground font-semibold">{cookie.name}</span>
                        <button onClick={() => handleCopyCookie(cookie.name)} className="p-1 hover:bg-surface rounded-sm text-muted hover:text-foreground transition-colors">
                          {copiedCookie === cookie.name ? <CheckCircle2 size={12} className="text-emerald-500" /> : <Copy size={12} />}
                        </button>
                      </div>
                      <span className={`px-2 py-1 rounded-sm text-[9px] font-mono uppercase tracking-widest border ${cookie.typeColor}`}>{cookie.type}</span>
                    </div>
                    <p className="text-[13px] text-muted mb-4">{cookie.desc}</p>
                    <div className="flex items-center gap-2">
                      <Clock size={12} className="text-muted" />
                      <span className="font-mono text-[10px] uppercase tracking-widest text-foreground">{cookie.duration}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* 3. Cookie Categories */}
            <section id="categories" className="scroll-mt-32 relative group outline-none" tabIndex={-1}>
              <h2 className="text-[13px] font-mono uppercase tracking-[0.24em] text-foreground border-b border-surface pb-4 mb-8 flex items-center gap-3">
                <LayoutGrid size={18} className="text-emerald-500" /> 3. Cookie Categories
                <button onClick={() => handleCopyLink('categories')} className="opacity-0 group-hover:opacity-100 transition-opacity ml-auto text-muted hover:text-foreground focus:opacity-100 outline-none p-1 rounded-sm focus:ring-2 focus:ring-amber-500/50">
                  {copiedLink === 'categories' ? <CheckCircle2 size={16} className="text-emerald-500" /> : <LinkIcon size={16} />}
                </button>
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="p-6 border border-surface bg-surface/5 rounded-md">
                  <div className="flex items-center gap-2 mb-3 text-emerald-500 font-mono text-[11px] uppercase tracking-widest font-bold"><ShieldCheck size={16}/> Essential Cookies</div>
                  <div className="font-mono text-[9px] uppercase tracking-widest bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-2 py-1 rounded-sm w-fit mb-4">Required</div>
                  <p className="text-[13px] text-muted leading-relaxed mb-4">Cannot be disabled without affecting website functionality.</p>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2 text-[12px] text-foreground/80"><span className="w-1 h-1 rounded-full bg-emerald-500" /> Session management</li>
                    <li className="flex items-center gap-2 text-[12px] text-foreground/80"><span className="w-1 h-1 rounded-full bg-emerald-500" /> Security enforcement</li>
                    <li className="flex items-center gap-2 text-[12px] text-foreground/80"><span className="w-1 h-1 rounded-full bg-emerald-500" /> Authentication workflows</li>
                  </ul>
                </div>

                <div className="p-6 border border-surface bg-surface/5 rounded-md">
                  <div className="flex items-center gap-2 mb-3 text-blue-500 font-mono text-[11px] uppercase tracking-widest font-bold"><Settings size={16}/> Functional Cookies</div>
                  <div className="font-mono text-[9px] uppercase tracking-widest bg-blue-500/10 text-blue-500 border border-blue-500/20 px-2 py-1 rounded-sm w-fit mb-4">Optional</div>
                  <p className="text-[13px] text-muted leading-relaxed mb-4">Used to remember specific user preferences across sessions.</p>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2 text-[12px] text-foreground/80"><span className="w-1 h-1 rounded-full bg-blue-500" /> Theme selection</li>
                    <li className="flex items-center gap-2 text-[12px] text-foreground/80"><span className="w-1 h-1 rounded-full bg-blue-500" /> UI State preservation</li>
                    <li className="flex items-center gap-2 text-[12px] text-foreground/80"><span className="w-1 h-1 rounded-full bg-blue-500" /> Accessibility settings</li>
                  </ul>
                </div>

                <div className="p-6 border border-surface bg-surface/5 rounded-md">
                  <div className="flex items-center gap-2 mb-3 text-amber-500 font-mono text-[11px] uppercase tracking-widest font-bold"><Activity size={16}/> Analytics Cookies</div>
                  <div className="font-mono text-[9px] uppercase tracking-widest bg-amber-500/10 text-amber-500 border border-amber-500/20 px-2 py-1 rounded-sm w-fit mb-4">Optional</div>
                  <p className="text-[13px] text-muted leading-relaxed">This website currently does not use analytics cookies beyond those necessary for operational functionality and performance monitoring.</p>
                  <ul className="space-y-2 mt-4">
                    <li className="flex items-center gap-2 text-[12px] text-foreground/80"><span className="w-1 h-1 rounded-full bg-amber-500" /> Anonymous identifiers</li>
                    <li className="flex items-center gap-2 text-[12px] text-foreground/80"><span className="w-1 h-1 rounded-full bg-amber-500" /> First-Party only</li>
                    <li className="flex items-center gap-2 text-[12px] text-foreground/80"><span className="w-1 h-1 rounded-full bg-amber-500" /> No Cross-Site Tracking</li>
                  </ul>
                </div>

                <div className="p-6 border border-surface bg-surface/5 rounded-md flex flex-col items-center justify-center text-center">
                  <div className="flex items-center gap-2 mb-3 text-surface-strong font-mono text-[11px] uppercase tracking-widest font-bold"><Globe size={16}/> Marketing Cookies</div>
                  <div className="font-mono text-[10px] uppercase tracking-widest bg-surface-strong/20 text-muted border border-surface-strong/30 px-3 py-1.5 rounded-sm w-fit mb-2 font-bold">None</div>
                  <p className="text-[12px] text-muted">We do not serve ads or track you across the web.</p>
                </div>
              </div>
            </section>

            {/* 4. Local Storage */}
            <section id="local-storage" className="scroll-mt-32 relative group outline-none" tabIndex={-1}>
              <h2 className="text-[13px] font-mono uppercase tracking-[0.24em] text-foreground border-b border-surface pb-4 mb-8 flex items-center gap-3">
                <Box size={18} className="text-blue-500" /> 4. Local Storage
                <button onClick={() => handleCopyLink('local-storage')} className="opacity-0 group-hover:opacity-100 transition-opacity ml-auto text-muted hover:text-foreground focus:opacity-100 outline-none p-1 rounded-sm focus:ring-2 focus:ring-amber-500/50">
                  {copiedLink === 'local-storage' ? <CheckCircle2 size={16} className="text-emerald-500" /> : <LinkIcon size={16} />}
                </button>
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="p-6 border border-surface bg-background rounded-md">
                  <h3 className="text-[15px] font-semibold text-foreground mb-4">Theme Preference</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-[13px]">
                      <span className="text-muted">Stores</span>
                      <span className="text-foreground font-medium">Dark / Light Mode</span>
                    </div>
                    <div className="flex justify-between items-center text-[13px]">
                      <span className="text-muted">Expires</span>
                      <span className="text-foreground font-medium font-mono text-[11px] uppercase tracking-widest">Until Cleared</span>
                    </div>
                  </div>
                </div>

                <div className="p-6 border border-surface bg-background rounded-md">
                  <h3 className="text-[15px] font-semibold text-foreground mb-4">Terminal History</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-[13px]">
                      <span className="text-muted">Stores</span>
                      <span className="text-foreground font-medium">Command History</span>
                    </div>
                    <div className="flex justify-between items-center text-[13px]">
                      <span className="text-muted">Location</span>
                      <span className="text-foreground font-medium font-mono text-[11px] uppercase tracking-widest">Browser Only</span>
                    </div>
                    <div className="mt-3 pt-3 border-t border-surface text-[11px] text-emerald-500 flex items-center gap-2">
                      <ShieldCheck size={14} /> Never Sent to Server
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* 5. Third-Party Services */}
            <section id="third-parties" className="scroll-mt-32 relative group outline-none" tabIndex={-1}>
              <h2 className="text-[13px] font-mono uppercase tracking-[0.24em] text-foreground border-b border-surface pb-4 mb-8 flex items-center gap-3">
                <Server size={18} className="text-purple-500" /> 5. Third-Party Services
                <button onClick={() => handleCopyLink('third-parties')} className="opacity-0 group-hover:opacity-100 transition-opacity ml-auto text-muted hover:text-foreground focus:opacity-100 outline-none p-1 rounded-sm focus:ring-2 focus:ring-amber-500/50">
                  {copiedLink === 'third-parties' ? <CheckCircle2 size={16} className="text-emerald-500" /> : <LinkIcon size={16} />}
                </button>
              </h2>
              <div className="overflow-x-auto border border-surface rounded-md">
                <table className="w-full text-left text-[14px] border-collapse bg-background min-w-[500px]">
                  <thead className="bg-surface/30">
                    <tr className="border-b border-surface text-foreground font-mono text-[10px] uppercase tracking-[0.2em]">
                      <th className="py-4 px-6 font-semibold">Service</th>
                      <th className="py-4 px-4 font-semibold">Uses Cookies</th>
                      <th className="py-4 px-6 font-semibold">Purpose</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface">
                    <tr className="hover:bg-surface/10 transition-colors">
                      <td className="py-4 px-6 font-medium text-foreground">Vercel</td>
                      <td className="py-4 px-4 text-muted">Platform-managed</td>
                      <td className="py-4 px-6 text-muted">Hosting & Edge Network</td>
                    </tr>
                    <tr className="hover:bg-surface/10 transition-colors">
                      <td className="py-4 px-6 font-medium text-foreground">Supabase</td>
                      <td className="py-4 px-4 text-muted">Authentication</td>
                      <td className="py-4 px-6 text-muted">Admin Login Sessions</td>
                    </tr>
                    <tr className="hover:bg-surface/10 transition-colors">
                      <td className="py-4 px-6 font-medium text-foreground">Resend</td>
                      <td className="py-4 px-4 text-muted">No</td>
                      <td className="py-4 px-6 text-muted">Email Delivery</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* 6. Managing Cookies */}
            <section id="management" className="scroll-mt-32 relative group outline-none" tabIndex={-1}>
              <h2 className="text-[13px] font-mono uppercase tracking-[0.24em] text-foreground border-b border-surface pb-4 mb-8 flex items-center gap-3">
                <Settings size={18} className="text-emerald-500" /> 6. Managing Cookies
                <button onClick={() => handleCopyLink('management')} className="opacity-0 group-hover:opacity-100 transition-opacity ml-auto text-muted hover:text-foreground focus:opacity-100 outline-none p-1 rounded-sm focus:ring-2 focus:ring-amber-500/50">
                  {copiedLink === 'management' ? <CheckCircle2 size={16} className="text-emerald-500" /> : <LinkIcon size={16} />}
                </button>
              </h2>
              <div className="bg-surface/5 border border-surface p-6 md:p-8 rounded-md space-y-4">
                <p>Where required by applicable law, consent mechanisms may be presented before optional cookies are used. Essential cookies remain active because they are necessary for core website functionality and security.</p>
                <p className="text-foreground/90 font-medium">You can manage, view, or delete cookies through your browser settings at any time. Refer to your browser&apos;s privacy documentation for instructions.</p>
                <div className="mt-6 pt-4 border-t border-surface flex items-start gap-3">
                  <AlertTriangle size={16} className="text-amber-500 shrink-0 mt-0.5" />
                  <p className="text-[13px] text-muted">Blocking essential session cookies may reduce functionality, prevent authentication, or cause interactive features to fail.</p>
                </div>
              </div>
            </section>

            {/* 7. Browser Storage */}
            <section id="storage-types" className="scroll-mt-32 relative group outline-none" tabIndex={-1}>
              <h2 className="text-[13px] font-mono uppercase tracking-[0.24em] text-foreground border-b border-surface pb-4 mb-8 flex items-center gap-3">
                <Fingerprint size={18} className="text-blue-500" /> 7. Browser Storage Technologies
                <button onClick={() => handleCopyLink('storage-types')} className="opacity-0 group-hover:opacity-100 transition-opacity ml-auto text-muted hover:text-foreground focus:opacity-100 outline-none p-1 rounded-sm focus:ring-2 focus:ring-amber-500/50">
                  {copiedLink === 'storage-types' ? <CheckCircle2 size={16} className="text-emerald-500" /> : <LinkIcon size={16} />}
                </button>
              </h2>
              <div className="overflow-x-auto border border-surface rounded-md">
                <table className="w-full text-left text-[14px] border-collapse bg-background">
                  <thead className="bg-surface/30">
                    <tr className="border-b border-surface text-muted font-mono text-[10px] uppercase tracking-[0.2em]">
                      <th className="py-3 px-6 font-semibold">Technology</th>
                      <th className="py-3 px-6 font-semibold">Used For</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface">
                    <tr className="hover:bg-surface/10 transition-colors">
                      <td className="py-4 px-6 font-medium text-foreground">Cookies</td>
                      <td className="py-4 px-6 text-muted">Server-side sessions, authentication, and cross-page state routing.</td>
                    </tr>
                    <tr className="hover:bg-surface/10 transition-colors">
                      <td className="py-4 px-6 font-medium text-foreground">Local Storage</td>
                      <td className="py-4 px-6 text-muted">Persistent user preferences (Theme, Layout) entirely within the browser.</td>
                    </tr>
                    <tr className="hover:bg-surface/10 transition-colors">
                      <td className="py-4 px-6 font-medium text-foreground">Session Storage</td>
                      <td className="py-4 px-6 text-muted">Temporary UI state elements cleared when the tab is closed.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* 8. Cookie Retention */}
            <section id="retention" className="scroll-mt-32 relative group outline-none" tabIndex={-1}>
              <h2 className="text-[13px] font-mono uppercase tracking-[0.24em] text-foreground border-b border-surface pb-4 mb-8 flex items-center gap-3">
                <Clock size={18} className="text-amber-500" /> 8. Cookie Retention Lifecycle
                <button onClick={() => handleCopyLink('retention')} className="opacity-0 group-hover:opacity-100 transition-opacity ml-auto text-muted hover:text-foreground focus:opacity-100 outline-none p-1 rounded-sm focus:ring-2 focus:ring-amber-500/50">
                  {copiedLink === 'retention' ? <CheckCircle2 size={16} className="text-emerald-500" /> : <LinkIcon size={16} />}
                </button>
              </h2>
              
              <div className="py-12 px-6 border border-surface rounded-xl bg-surface/5 overflow-hidden relative">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-0 relative z-10 max-w-4xl mx-auto">
                  <div className="hidden md:block absolute top-1/2 left-[5%] right-[5%] h-[2px] bg-surface -translate-y-1/2 z-0" />
                  
                  {[
                    { time: "Session", desc: "Closes with tab" },
                    { time: "24 Hours", desc: "Session continuity" },
                    { time: "1 Month", desc: "Saved preferences" },
                    { time: "1 Year", desc: "Analytics identifier" },
                    { time: "Deleted", desc: "Automatically cleared" }
                  ].map((item, idx) => (
                    <div key={idx} className="relative z-10 flex flex-col items-center text-center bg-transparent px-2">
                      <div className="w-3 h-3 rounded-full bg-amber-500 border-2 border-background flex items-center justify-center mb-3 shadow-[0_0_10px_rgba(245,158,11,0.5)]"></div>
                      <div className="text-[13px] font-semibold text-foreground whitespace-nowrap">{item.time}</div>
                      <div className="text-[9px] font-mono text-muted uppercase tracking-widest mt-1">{item.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* 9. Related Policies */}
            <section id="related" className="scroll-mt-32 relative group outline-none" tabIndex={-1}>
              <h2 className="text-[13px] font-mono uppercase tracking-[0.24em] text-foreground border-b border-surface pb-4 mb-8 flex items-center gap-3">
                <LinkIcon size={18} className="text-purple-500" /> 9. Related Policies
                <button onClick={() => handleCopyLink('related')} className="opacity-0 group-hover:opacity-100 transition-opacity ml-auto text-muted hover:text-foreground focus:opacity-100 outline-none p-1 rounded-sm focus:ring-2 focus:ring-amber-500/50">
                  {copiedLink === 'related' ? <CheckCircle2 size={16} className="text-emerald-500" /> : <LinkIcon size={16} />}
                </button>
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <Link href="/privacy-policy" className="group p-6 border border-surface bg-surface/5 rounded-md hover:border-surface-strong transition-colors">
                  <h3 className="font-bold text-[15px] text-foreground mb-3 group-hover:text-blue-500 transition-colors flex items-center justify-between">
                    Privacy Policy <ExternalLink size={14} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                  </h3>
                  <p className="text-[12px] text-muted">Learn how personal information is processed and protected.</p>
                </Link>
                <Link href="/security-policy" className="group p-6 border border-surface bg-surface/5 rounded-md hover:border-surface-strong transition-colors">
                  <h3 className="font-bold text-[15px] text-foreground mb-3 group-hover:text-emerald-500 transition-colors flex items-center justify-between">
                    Security Policy <ExternalLink size={14} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                  </h3>
                  <p className="text-[12px] text-muted">Explore the operational security controls and architecture.</p>
                </Link>
                <Link href="/terms-and-conditions" className="group p-6 border border-surface bg-surface/5 rounded-md hover:border-surface-strong transition-colors">
                  <h3 className="font-bold text-[15px] text-foreground mb-3 group-hover:text-indigo-500 transition-colors flex items-center justify-between">
                    Terms of Use <ExternalLink size={14} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                  </h3>
                  <p className="text-[12px] text-muted">Review the acceptable use policies and website rules.</p>
                </Link>
              </div>
            </section>

          </div>
        </main>
      </div>
    </div>
  );
}