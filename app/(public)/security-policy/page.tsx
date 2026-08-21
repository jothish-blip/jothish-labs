"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, useScroll, useSpring, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, ShieldCheck, Lock, Database, Globe, CheckCircle2, 
  Clock, Mail, Server, Activity, ChevronDown, Link as LinkIcon, 
  Shield, Layers, FileCode2, UserCheck, Target, Terminal,
  ArrowRight, CheckSquare, Zap, Eye
} from 'lucide-react';

const sections = [
  { id: 'philosophy', title: '1. Security Philosophy', icon: Shield, color: 'text-blue-500' },
  { id: 'architecture', title: '2. Architecture', icon: Layers, color: 'text-purple-500' },
  { id: 'controls', title: '3. Security Controls', icon: Lock, color: 'text-emerald-500' },
  { id: 'app-sec', title: '4. Application Security', icon: FileCode2, color: 'text-blue-500' },
  { id: 'privacy', title: '5. Privacy & Data', icon: UserCheck, color: 'text-amber-500' },
  { id: 'incident-response', title: '6. Incident Response', icon: Activity, color: 'text-red-500' },
  { id: 'headers', title: '7. Security Headers', icon: Globe, color: 'text-blue-500' },
  { id: 'technologies', title: '8. Technologies', icon: Terminal, color: 'text-purple-500' },
  { id: 'disclosure', title: '9. Responsible Disclosure', icon: Target, color: 'text-emerald-500' },
  { id: 'contact', title: '10. Contact', icon: Mail, color: 'text-blue-500' },
];

export default function SecurityPolicy() {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState<string>(sections[0].id);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

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
    <div className="min-h-screen bg-background text-foreground font-sans pb-12 relative selection:bg-cyan-500/30">
      
      <style>{`
        :root {
          --accent-security: #0ea5e9; /* Sky Blue/Cyan for Security Theme */
        }
        .security-nav-active {
          color: var(--foreground) !important;
          font-weight: 600;
        }
        .security-nav-active::before {
          content: '';
          position: absolute;
          left: -1px;
          top: 0;
          bottom: 0;
          width: 2px;
          background-color: var(--accent-security);
          box-shadow: 0 0 10px var(--accent-security);
        }
      `}</style>

      {/* Reading Progress Bar */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1.5 z-50 origin-left shadow-[0_0_10px_rgba(14,165,233,0.5)]"
        style={{ scaleX, backgroundColor: 'var(--accent-security)' }}
      />

      {/* --- RADIOLUCENT (X-RAY) BACKGROUND EFFECT --- */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 z-0 pointer-events-none flex items-center justify-center overflow-hidden w-full h-[600px]">
        <div className="w-[300px] h-[150px] md:w-[700px] md:h-[300px] blur-[100px] rounded-[100%] opacity-15 mix-blend-screen" style={{ backgroundColor: 'var(--accent-security)' }}></div>
        <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(circle,currentColor_1px,transparent_1px)] bg-[size:16px_16px]"></div>
      </div>

      {/* Top Navigation / Back */}
      <div className="max-w-[1400px] mx-auto px-6 pt-12 pb-6 relative z-10">
        <button 
          onClick={() => router.back()}
          className="font-mono text-[11px] uppercase tracking-widest text-muted hover:text-foreground inline-flex items-center gap-2 transition-colors border border-surface bg-surface/30 px-4 py-2 rounded-sm hover:bg-surface focus:outline-none focus:ring-2 focus:ring-cyan-500/50 cursor-pointer"
        >
          <ArrowLeft size={14} /> Back to Portfolio
        </button>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 relative items-start z-10">
        
        {/* Desktop Sidebar (Progress Style) */}
        <aside className="hidden lg:block lg:col-span-3 sticky top-24 max-h-[calc(100vh-120px)] overflow-y-auto no-scrollbar">
          <nav className="flex flex-col font-mono text-[11px] uppercase tracking-widest relative pb-10">
            <h3 className="text-foreground font-bold mb-6 flex items-center gap-2 tracking-[0.24em]">
              <ShieldCheck size={16} style={{ color: 'var(--accent-security)' }} /> Document Index
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
                      <span className={`flex items-center justify-center w-[15px] h-[15px] shrink-0 bg-background transition-colors ${isActive || isPast ? '' : 'text-surface-strong'}`} style={isActive || isPast ? { color: 'var(--accent-security)' } : {}}>
                        {isPast ? <CheckCircle2 size={14} /> : isActive ? <span className="w-1.5 h-1.5 rounded-full shadow-[0_0_8px_currentColor]" style={{ backgroundColor: 'var(--accent-security)' }} /> : <span className="w-1.5 h-1.5 rounded-full border border-current" />}
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
              className="w-full bg-background/95 backdrop-blur-md border border-surface shadow-lg rounded-md p-4 flex items-center justify-between text-[12px] font-mono uppercase tracking-widest text-foreground focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
            >
              <span className="flex items-center gap-2"><ShieldCheck size={14} style={{ color: 'var(--accent-security)' }}/> Jump to Section</span>
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
              Security <br />
              <span className="text-muted italic font-light">Center.</span>
            </motion.h1>
            
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-wrap items-center gap-3 mt-8 font-mono text-[10px] sm:text-[11px] uppercase tracking-widest"
            >
              <span className="px-3 py-1.5 border rounded-sm font-semibold flex items-center gap-2 text-foreground" style={{ backgroundColor: 'color-mix(in srgb, var(--accent-security) 10%, transparent)', borderColor: 'color-mix(in srgb, var(--accent-security) 30%, transparent)' }}>
                Operational Security & Infrastructure
              </span>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
              className="flex flex-wrap gap-6 mt-8 pt-6 border-t border-surface text-[11px] font-mono text-muted uppercase tracking-widest"
            >
              <div className="flex flex-col gap-1">
                <span className="text-foreground/50">Status</span>
                <span className="text-emerald-500 font-semibold flex items-center gap-1.5"><span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"/> Operational</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-foreground/50">Disclosure Program</span>
                <span className="text-foreground font-semibold">Active</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-foreground/50">Last Updated</span>
                <span className="text-foreground font-semibold">August 2026</span>
              </div>
            </motion.div>
          </header>

          {/* Security Metrics / Dashboard Banner */}
          <div className="border border-surface bg-surface/10 rounded-xl p-6 sm:p-8 relative overflow-hidden shadow-lg">
            <div className="absolute top-0 left-0 right-0 h-1" style={{ backgroundColor: 'var(--accent-security)' }} />
            <div className="flex items-center gap-2 mb-8">
              <Activity size={18} style={{ color: 'var(--accent-security)' }} />
              <h2 className="text-[12px] font-mono text-muted uppercase tracking-[0.24em] font-bold">Security Status</h2>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-y-8 gap-x-6">
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-mono text-muted uppercase tracking-widest">HTTPS</span>
                <span className="text-[13px] font-mono text-emerald-500 uppercase font-semibold flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Enabled</span>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-mono text-muted uppercase tracking-widest">Database Protection</span>
                <span className="text-[13px] font-mono text-emerald-500 uppercase font-semibold flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> RLS Active</span>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-mono text-muted uppercase tracking-widest">Authentication</span>
                <span className="text-[13px] font-mono text-emerald-500 uppercase font-semibold flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> MFA Enabled</span>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-mono text-muted uppercase tracking-widest">Monitoring</span>
                <span className="text-[13px] font-mono text-emerald-500 uppercase font-semibold flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Operational</span>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-mono text-muted uppercase tracking-widest">Telemetry</span>
                <span className="text-[13px] font-mono text-blue-500 uppercase font-semibold flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-blue-500" /> Custom</span>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-mono text-muted uppercase tracking-widest">Disclosure Program</span>
                <span className="text-[13px] font-mono text-purple-500 uppercase font-semibold flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-purple-500" /> Active</span>
              </div>
            </div>
          </div>

          {/* Security at a Glance Summary Card */}
          <div className="border border-surface bg-background rounded-xl p-8 shadow-sm">
            <h2 className="text-[13px] font-mono text-foreground uppercase tracking-[0.24em] font-bold mb-6 flex items-center gap-2 border-b border-surface pb-4">
              <Shield size={16} style={{ color: 'var(--accent-security)' }} /> Security at a Glance
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-5 gap-x-8 text-[14px] text-foreground/80 font-medium">
              <div className="flex items-center gap-3"><CheckCircle2 size={16} className="text-emerald-500 shrink-0" /> HTTPS Enforced</div>
              <div className="flex items-center gap-3"><CheckCircle2 size={16} className="text-emerald-500 shrink-0" /> Defense in Depth</div>
              <div className="flex items-center gap-3"><CheckCircle2 size={16} className="text-emerald-500 shrink-0" /> MFA Protected Admin</div>
              <div className="flex items-center gap-3"><CheckCircle2 size={16} className="text-emerald-500 shrink-0" /> Row Level Security</div>
              <div className="flex items-center gap-3"><CheckCircle2 size={16} className="text-emerald-500 shrink-0" /> Secure API Design</div>
              <div className="flex items-center gap-3"><CheckCircle2 size={16} className="text-emerald-500 shrink-0" /> Continuous Monitoring</div>
            </div>
          </div>

          <div className="h-px w-full bg-surface my-12" />

          {/* MAIN SECTIONS */}
          <div className="space-y-24 text-muted leading-[1.8] text-[15px] md:text-[16px]">
            
            {/* 1. Security Philosophy */}
            <section id="philosophy" className="scroll-mt-32 relative group outline-none" tabIndex={-1}>
              <h2 className="text-[13px] font-mono uppercase tracking-[0.24em] text-foreground border-b border-surface pb-4 mb-8 flex items-center gap-3">
                <Shield size={18} className="text-blue-500" /> 1. Security Philosophy
                <button onClick={() => handleCopyLink('philosophy')} className="opacity-0 group-hover:opacity-100 transition-opacity ml-auto text-muted hover:text-foreground focus:opacity-100 outline-none p-1 rounded-sm focus:ring-2 focus:ring-cyan-500/50" aria-label="Copy link to section">
                  {copiedLink === 'philosophy' ? <CheckCircle2 size={16} className="text-emerald-500" /> : <LinkIcon size={16} />}
                </button>
              </h2>
              <p className="mb-8">Security is integrated throughout the design and operation of this portfolio. The application follows defense-in-depth principles, combining secure development practices, infrastructure protections, and continuous monitoring to reduce risk and protect visitor data.</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="p-6 border border-surface bg-surface/5 rounded-md">
                  <div className="flex items-center gap-2 mb-3 text-blue-500 font-mono text-[11px] uppercase tracking-widest font-bold"><Layers size={16}/> Defense in Depth</div>
                  <p className="text-[13px] text-muted leading-relaxed">Multiple overlapping security controls protect the system against single points of failure.</p>
                </div>
                <div className="p-6 border border-surface bg-surface/5 rounded-md">
                  <div className="flex items-center gap-2 mb-3 text-amber-500 font-mono text-[11px] uppercase tracking-widest font-bold"><Lock size={16}/> Least Privilege</div>
                  <p className="text-[13px] text-muted leading-relaxed">Components, APIs, and database connections operate with the absolute minimum access required.</p>
                </div>
                <div className="p-6 border border-surface bg-surface/5 rounded-md">
                  <div className="flex items-center gap-2 mb-3 text-emerald-500 font-mono text-[11px] uppercase tracking-widest font-bold"><ShieldCheck size={16}/> Secure by Default</div>
                  <p className="text-[13px] text-muted leading-relaxed">Configurations default to the most secure settings, requiring explicit action to open access.</p>
                </div>
                <div className="p-6 border border-surface bg-surface/5 rounded-md">
                  <div className="flex items-center gap-2 mb-3 text-purple-500 font-mono text-[11px] uppercase tracking-widest font-bold"><Zap size={16}/> Continuous Improvement</div>
                  <p className="text-[13px] text-muted leading-relaxed">Security is an ongoing process of monitoring, evaluating, and refining defensive measures.</p>
                </div>
              </div>
            </section>

            {/* 2. Architecture */}
            <section id="architecture" className="scroll-mt-32 relative group outline-none" tabIndex={-1}>
              <h2 className="text-[13px] font-mono uppercase tracking-[0.24em] text-foreground border-b border-surface pb-4 mb-8 flex items-center gap-3">
                <Layers size={18} className="text-purple-500" /> 2. Architecture
                <button onClick={() => handleCopyLink('architecture')} className="opacity-0 group-hover:opacity-100 transition-opacity ml-auto text-muted hover:text-foreground focus:opacity-100 outline-none p-1 rounded-sm focus:ring-2 focus:ring-cyan-500/50">
                  {copiedLink === 'architecture' ? <CheckCircle2 size={16} className="text-emerald-500" /> : <LinkIcon size={16} />}
                </button>
              </h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                {/* Visual Flow */}
                <div className="bg-surface/5 border border-surface rounded-xl p-8 flex flex-col items-center gap-3 font-mono text-[10px] font-bold uppercase tracking-widest text-foreground">
                  <div className="w-full max-w-[200px] text-center border border-surface bg-background py-3 rounded-sm">Client Browser</div>
                  <ArrowRight className="text-muted rotate-90" size={16}/>
                  <div className="w-full max-w-[200px] text-center border border-surface bg-background py-3 rounded-sm shadow-[0_0_15px_rgba(16,185,129,0.1)]">Vercel Edge</div>
                  <ArrowRight className="text-muted rotate-90" size={16}/>
                  <div className="w-full max-w-[200px] text-center border border-blue-500/30 bg-blue-500/10 text-blue-500 py-3 rounded-sm shadow-[0_0_15px_rgba(59,130,246,0.1)]">Next.js Application</div>
                  <ArrowRight className="text-muted rotate-90" size={16}/>
                  <div className="w-full max-w-[200px] text-center border border-purple-500/30 bg-purple-500/10 text-purple-500 py-3 rounded-sm shadow-[0_0_15px_rgba(168,85,247,0.1)]">API Layer</div>
                  <ArrowRight className="text-muted rotate-90" size={16}/>
                  <div className="w-full max-w-[200px] text-center border border-emerald-500/30 bg-emerald-500/10 text-emerald-500 py-3 rounded-sm shadow-[0_0_15px_rgba(16,185,129,0.1)]">Supabase PostgreSQL</div>
                </div>

                {/* Table Details */}
                <div className="overflow-x-auto border border-surface rounded-md h-fit">
                  <table className="w-full text-left text-[13px] border-collapse bg-background">
                    <thead className="bg-surface/30">
                      <tr className="border-b border-surface text-foreground font-mono text-[9px] uppercase tracking-[0.2em]">
                        <th className="py-3 px-4 font-semibold">Component</th>
                        <th className="py-3 px-4 font-semibold">Purpose</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-surface">
                      <tr className="hover:bg-surface/10 transition-colors">
                        <td className="py-3 px-4 font-medium text-foreground">Next.js</td>
                        <td className="py-3 px-4 text-muted">Frontend & React Server Components</td>
                      </tr>
                      <tr className="hover:bg-surface/10 transition-colors">
                        <td className="py-3 px-4 font-medium text-foreground">Vercel</td>
                        <td className="py-3 px-4 text-muted">Hosting, Edge Network, WAF</td>
                      </tr>
                      <tr className="hover:bg-surface/10 transition-colors">
                        <td className="py-3 px-4 font-medium text-foreground">API Routes</td>
                        <td className="py-3 px-4 text-muted">Secure Backend Business Logic</td>
                      </tr>
                      <tr className="hover:bg-surface/10 transition-colors">
                        <td className="py-3 px-4 font-medium text-foreground">Supabase</td>
                        <td className="py-3 px-4 text-muted">Database & Storage</td>
                      </tr>
                      <tr className="hover:bg-surface/10 transition-colors">
                        <td className="py-3 px-4 font-medium text-foreground">Authentication</td>
                        <td className="py-3 px-4 text-muted">Admin Access Control & MFA</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            {/* 3. Security Controls */}
            <section id="controls" className="scroll-mt-32 relative group outline-none" tabIndex={-1}>
              <h2 className="text-[13px] font-mono uppercase tracking-[0.24em] text-foreground border-b border-surface pb-4 mb-8 flex items-center gap-3">
                <Lock size={18} className="text-emerald-500" /> 3. Security Controls
                <button onClick={() => handleCopyLink('controls')} className="opacity-0 group-hover:opacity-100 transition-opacity ml-auto text-muted hover:text-foreground focus:opacity-100 outline-none p-1 rounded-sm focus:ring-2 focus:ring-cyan-500/50">
                  {copiedLink === 'controls' ? <CheckCircle2 size={16} className="text-emerald-500" /> : <LinkIcon size={16} />}
                </button>
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { title: "Authentication", icon: UserCheck, color: "text-blue-500", items: ["MFA Required", "Session validation", "Role-based access"] },
                  { title: "Database", icon: Database, color: "text-purple-500", items: ["Row Level Security", "Least Privilege roles", "Server-side queries only"] },
                  { title: "Network", icon: Globe, color: "text-emerald-500", items: ["HTTPS everywhere", "Modern TLS enforced", "Secure response headers"] },
                  { title: "Monitoring", icon: Eye, color: "text-amber-500", items: ["Audit logging", "Error tracking", "Abuse telemetry"] },
                  { title: "Input Protection", icon: ShieldCheck, color: "text-cyan-500", items: ["Strict validation", "Input sanitization", "SQLi prevention"] },
                  { title: "Availability", icon: Activity, color: "text-red-500", items: ["API Rate limiting", "Request throttling", "Edge caching"] }
                ].map((ctrl, i) => (
                  <div key={i} className="bg-surface/5 border border-surface p-6 rounded-md hover:border-surface-strong transition-colors">
                    <div className="flex items-center gap-2 mb-4">
                      <ctrl.icon size={16} className={ctrl.color} />
                      <h3 className="font-bold text-[14px] text-foreground">{ctrl.title}</h3>
                    </div>
                    <ul className="space-y-2">
                      {ctrl.items.map((item, j) => (
                        <li key={j} className="text-[13px] text-muted flex items-start gap-2">
                          <span className="w-1 h-1 rounded-full bg-surface-strong shrink-0 mt-1.5" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>

            {/* 4. Application Security */}
            <section id="app-sec" className="scroll-mt-32 relative group outline-none" tabIndex={-1}>
              <h2 className="text-[13px] font-mono uppercase tracking-[0.24em] text-foreground border-b border-surface pb-4 mb-8 flex items-center gap-3">
                <FileCode2 size={18} className="text-blue-500" /> 4. Application Security
                <button onClick={() => handleCopyLink('app-sec')} className="opacity-0 group-hover:opacity-100 transition-opacity ml-auto text-muted hover:text-foreground focus:opacity-100 outline-none p-1 rounded-sm focus:ring-2 focus:ring-cyan-500/50">
                  {copiedLink === 'app-sec' ? <CheckCircle2 size={16} className="text-emerald-500" /> : <LinkIcon size={16} />}
                </button>
              </h2>
              <div className="bg-background border border-surface rounded-xl p-8 shadow-sm">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-5 gap-x-8 text-[14px] text-foreground/80 font-medium">
                  <div className="flex items-center gap-3"><CheckSquare size={16} className="text-blue-500 shrink-0" /> Input Validation on all APIs</div>
                  <div className="flex items-center gap-3"><CheckSquare size={16} className="text-blue-500 shrink-0" /> React Server-Side Output Encoding</div>
                  <div className="flex items-center gap-3"><CheckSquare size={16} className="text-blue-500 shrink-0" /> XSS Mitigation & Sanitization</div>
                  <div className="flex items-center gap-3"><CheckSquare size={16} className="text-blue-500 shrink-0" /> Environment Secrets Protection</div>
                  <div className="flex items-center gap-3"><CheckSquare size={16} className="text-blue-500 shrink-0" /> Server-Side Authentication Checks</div>
                  <div className="flex items-center gap-3"><CheckSquare size={16} className="text-blue-500 shrink-0" /> RLS Authorization Verification</div>
                </div>
              </div>
            </section>

            {/* 5. Privacy & Data */}
            <section id="privacy" className="scroll-mt-32 relative group outline-none" tabIndex={-1}>
              <h2 className="text-[13px] font-mono uppercase tracking-[0.24em] text-foreground border-b border-surface pb-4 mb-8 flex items-center gap-3">
                <UserCheck size={18} className="text-amber-500" /> 5. Privacy & Data Protection
                <button onClick={() => handleCopyLink('privacy')} className="opacity-0 group-hover:opacity-100 transition-opacity ml-auto text-muted hover:text-foreground focus:opacity-100 outline-none p-1 rounded-sm focus:ring-2 focus:ring-cyan-500/50">
                  {copiedLink === 'privacy' ? <CheckCircle2 size={16} className="text-emerald-500" /> : <LinkIcon size={16} />}
                </button>
              </h2>
              <div className="space-y-6">
                <p>Security and privacy are complementary. Security controls protect systems and data, while privacy practices govern how personal information is collected and processed.</p>
                <div className="flex flex-wrap gap-4 pt-2">
                  <Link href="/privacy-policy" className="inline-flex items-center gap-2 px-5 py-2.5 bg-surface/10 border border-surface rounded-sm text-[11px] font-mono uppercase tracking-widest text-foreground hover:bg-surface transition-colors">
                    Privacy Policy <ArrowRight size={14} />
                  </Link>
                  <Link href="/cookie-policy" className="inline-flex items-center gap-2 px-5 py-2.5 bg-surface/10 border border-surface rounded-sm text-[11px] font-mono uppercase tracking-widest text-foreground hover:bg-surface transition-colors">
                    Cookie Policy <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </section>

            {/* 6. Incident Response */}
            <section id="incident-response" className="scroll-mt-32 relative group outline-none" tabIndex={-1}>
              <h2 className="text-[13px] font-mono uppercase tracking-[0.24em] text-foreground border-b border-surface pb-4 mb-8 flex items-center gap-3">
                <Activity size={18} className="text-red-500" /> 6. Incident Response
                <button onClick={() => handleCopyLink('incident-response')} className="opacity-0 group-hover:opacity-100 transition-opacity ml-auto text-muted hover:text-foreground focus:opacity-100 outline-none p-1 rounded-sm focus:ring-2 focus:ring-cyan-500/50">
                  {copiedLink === 'incident-response' ? <CheckCircle2 size={16} className="text-emerald-500" /> : <LinkIcon size={16} />}
                </button>
              </h2>
              
              {/* IR Flow */}
              <div className="my-10 py-10 px-6 border border-surface rounded-xl bg-surface/5 overflow-hidden relative">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-0 relative z-10 max-w-5xl mx-auto">
                  <div className="hidden md:block absolute top-1/2 left-[5%] right-[5%] h-[2px] bg-surface -translate-y-1/2 z-0" />
                  
                  {[
                    { step: "Detection", sub: "Monitor & Alert" },
                    { step: "Investigation", sub: "Analyze Impact" },
                    { step: "Containment", sub: "Isolate Threat" },
                    { step: "Recovery", sub: "Restore Services" },
                    { step: "Root Cause", sub: "Post-Mortem" },
                    { step: "Improvements", sub: "Patch & Adapt" }
                  ].map((item, idx) => (
                    <div key={idx} className="relative z-10 flex flex-col items-center text-center bg-transparent px-2">
                      <div className="w-3 h-3 rounded-full bg-red-500 border-2 border-background flex items-center justify-center mb-3 shadow-[0_0_10px_rgba(239,68,68,0.5)]"></div>
                      <div className="text-[12px] font-semibold text-foreground whitespace-nowrap">{item.step}</div>
                      <div className="text-[9px] font-mono text-muted uppercase tracking-widest mt-1">{item.sub}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Targets Table */}
              <div className="overflow-x-auto border border-surface rounded-md">
                <table className="w-full text-left text-[14px] border-collapse bg-background">
                  <thead className="bg-surface/30">
                    <tr className="border-b border-surface text-muted font-mono text-[10px] uppercase tracking-[0.2em]">
                      <th className="py-3 px-6 font-semibold w-1/3">Stage</th>
                      <th className="py-3 px-6 font-semibold">Response Target</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface">
                    <tr className="hover:bg-surface/10 transition-colors">
                      <td className="py-4 px-6 font-medium text-foreground">Detection</td>
                      <td className="py-4 px-6 text-emerald-500 font-mono text-[11px] uppercase">Continuous Monitoring</td>
                    </tr>
                    <tr className="hover:bg-surface/10 transition-colors">
                      <td className="py-4 px-6 font-medium text-foreground">Triage</td>
                      <td className="py-4 px-6 text-amber-500 font-mono text-[11px] uppercase">As Soon As Possible</td>
                    </tr>
                    <tr className="hover:bg-surface/10 transition-colors">
                      <td className="py-4 px-6 font-medium text-foreground">Communication</td>
                      <td className="py-4 px-6 text-muted font-mono text-[11px] uppercase">When Appropriate</td>
                    </tr>
                    <tr className="hover:bg-surface/10 transition-colors">
                      <td className="py-4 px-6 font-medium text-foreground">Resolution</td>
                      <td className="py-4 px-6 text-muted font-mono text-[11px] uppercase">Depends on Severity</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* 7. Security Headers */}
            <section id="headers" className="scroll-mt-32 relative group outline-none" tabIndex={-1}>
              <h2 className="text-[13px] font-mono uppercase tracking-[0.24em] text-foreground border-b border-surface pb-4 mb-8 flex items-center gap-3">
                <Globe size={18} className="text-blue-500" /> 7. Security Headers
                <button onClick={() => handleCopyLink('headers')} className="opacity-0 group-hover:opacity-100 transition-opacity ml-auto text-muted hover:text-foreground focus:opacity-100 outline-none p-1 rounded-sm focus:ring-2 focus:ring-cyan-500/50">
                  {copiedLink === 'headers' ? <CheckCircle2 size={16} className="text-emerald-500" /> : <LinkIcon size={16} />}
                </button>
              </h2>
              <div className="overflow-x-auto border border-surface rounded-md">
                <table className="w-full text-left text-[14px] border-collapse bg-background">
                  <thead className="bg-surface/30">
                    <tr className="border-b border-surface text-muted font-mono text-[10px] uppercase tracking-[0.2em]">
                      <th className="py-3 px-6 font-semibold">Header</th>
                      <th className="py-3 px-6 font-semibold">Purpose</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface">
                    <tr className="hover:bg-surface/10 transition-colors">
                      <td className="py-4 px-6 font-mono text-[12px] text-foreground">Strict-Transport-Security</td>
                      <td className="py-4 px-6 text-muted">HTTPS Enforcement (HSTS)</td>
                    </tr>
                    <tr className="hover:bg-surface/10 transition-colors">
                      <td className="py-4 px-6 font-mono text-[12px] text-foreground">X-Frame-Options</td>
                      <td className="py-4 px-6 text-muted">Clickjacking Protection</td>
                    </tr>
                    <tr className="hover:bg-surface/10 transition-colors">
                      <td className="py-4 px-6 font-mono text-[12px] text-foreground">X-Content-Type-Options</td>
                      <td className="py-4 px-6 text-muted">MIME Sniffing Prevention</td>
                    </tr>
                    <tr className="hover:bg-surface/10 transition-colors">
                      <td className="py-4 px-6 font-mono text-[12px] text-foreground">Referrer-Policy</td>
                      <td className="py-4 px-6 text-muted">Information Leakage Prevention</td>
                    </tr>
                    <tr className="hover:bg-surface/10 transition-colors">
                      <td className="py-4 px-6 font-mono text-[12px] text-foreground">Permissions-Policy</td>
                      <td className="py-4 px-6 text-muted">Browser Feature Restrictions</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* 8. Technologies */}
            <section id="technologies" className="scroll-mt-32 relative group outline-none" tabIndex={-1}>
              <h2 className="text-[13px] font-mono uppercase tracking-[0.24em] text-foreground border-b border-surface pb-4 mb-8 flex items-center gap-3">
                <Terminal size={18} className="text-purple-500" /> 8. Technologies
                <button onClick={() => handleCopyLink('technologies')} className="opacity-0 group-hover:opacity-100 transition-opacity ml-auto text-muted hover:text-foreground focus:opacity-100 outline-none p-1 rounded-sm focus:ring-2 focus:ring-cyan-500/50">
                  {copiedLink === 'technologies' ? <CheckCircle2 size={16} className="text-emerald-500" /> : <LinkIcon size={16} />}
                </button>
              </h2>
              <div className="flex flex-wrap gap-3">
                {["Next.js", "Vercel", "Supabase", "TypeScript", "Tailwind CSS", "PostgreSQL", "React Server Components", "Framer Motion"].map(tech => (
                  <span key={tech} className="px-4 py-2 bg-surface/10 border border-surface rounded-sm text-[13px] font-medium text-foreground hover:border-surface-strong transition-colors">
                    {tech}
                  </span>
                ))}
              </div>
            </section>

            {/* 9. Responsible Disclosure */}
            <section id="disclosure" className="scroll-mt-32 relative group outline-none" tabIndex={-1}>
              <h2 className="text-[13px] font-mono uppercase tracking-[0.24em] text-foreground border-b border-surface pb-4 mb-8 flex items-center gap-3">
                <Target size={18} className="text-emerald-500" /> 9. Responsible Disclosure
                <button onClick={() => handleCopyLink('disclosure')} className="opacity-0 group-hover:opacity-100 transition-opacity ml-auto text-muted hover:text-foreground focus:opacity-100 outline-none p-1 rounded-sm focus:ring-2 focus:ring-cyan-500/50">
                  {copiedLink === 'disclosure' ? <CheckCircle2 size={16} className="text-emerald-500" /> : <LinkIcon size={16} />}
                </button>
              </h2>
              
              <div className="bg-surface/10 border border-surface rounded-xl p-8 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 blur-[80px] rounded-full pointer-events-none" />
                <h3 className="text-[20px] font-bold text-foreground mb-2 relative z-10">Found a Security Issue?</h3>
                <p className="text-[14px] text-muted mb-8 max-w-lg relative z-10">I value the input of independent security researchers. Please review the official disclosure policy before conducting any tests.</p>
                
                <div className="flex flex-col sm:flex-row sm:items-center gap-6 mb-8 relative z-10">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-muted">Program</span>
                    <span className="text-[13px] font-semibold text-emerald-500 flex items-center gap-1.5"><CheckCircle2 size={14} /> Active</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-muted">Safe Harbor</span>
                    <span className="text-[13px] font-semibold text-emerald-500 flex items-center gap-1.5"><ShieldCheck size={14} /> Enabled</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-muted">Response Goal</span>
                    <span className="text-[13px] font-semibold text-amber-500 flex items-center gap-1.5"><Clock size={14} /> 48 Hours</span>
                  </div>
                </div>

                <Link href="/responsible-disclosure" className="inline-flex items-center gap-2 px-6 py-3 bg-foreground text-background font-mono text-[11px] uppercase tracking-widest font-bold rounded-sm hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-foreground/50 relative z-10">
                  Read Disclosure Policy <ArrowRight size={14} />
                </Link>
              </div>
            </section>

            {/* 10. Contact */}
            <section id="contact" className="scroll-mt-32 relative group outline-none" tabIndex={-1}>
              <h2 className="text-[13px] font-mono uppercase tracking-[0.24em] text-foreground border-b border-surface pb-4 mb-8 flex items-center gap-3">
                <Mail size={18} className="text-blue-500" /> 10. Contact
                <button onClick={() => handleCopyLink('contact')} className="opacity-0 group-hover:opacity-100 transition-opacity ml-auto text-muted hover:text-foreground focus:opacity-100 outline-none p-1 rounded-sm focus:ring-2 focus:ring-cyan-500/50">
                  {copiedLink === 'contact' ? <CheckCircle2 size={16} className="text-emerald-500" /> : <LinkIcon size={16} />}
                </button>
              </h2>
              
              <div className="bg-surface/5 border border-surface p-8 rounded-xl max-w-lg">
                <h3 className="font-mono text-[10px] uppercase tracking-widest text-muted mb-6">Security Contact</h3>
                <div className="flex items-center justify-between bg-surface/20 border border-surface p-4 rounded-md mb-6">
                  <span className="font-mono text-[13px] text-foreground">gandhamjothish1@gmail.com</span>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-[13px]">
                    <span className="text-muted">Responsible Disclosure</span>
                    <span className="text-emerald-500 font-medium">Available</span>
                  </div>
                  <div className="flex items-center justify-between text-[13px]">
                    <span className="text-muted">Average Response</span>
                    <span className="text-amber-500 font-medium font-mono uppercase tracking-widest text-[10px]">48 Hours</span>
                  </div>
                </div>
              </div>
            </section>

          </div>
        </main>
      </div>

      {/* Legal specific footer */}
      <footer className="mt-32 pt-8 border-t border-surface relative z-10 max-w-[1400px] mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-wrap justify-center md:justify-start gap-x-8 gap-y-4 text-[11px] font-mono uppercase tracking-widest text-muted font-semibold">
            <Link href="/privacy-policy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
            <Link href="/cookie-policy" className="hover:text-foreground transition-colors">Cookie Policy</Link>
            <Link href="/terms-and-conditions" className="hover:text-foreground transition-colors text-foreground">Terms of Use</Link>
            <Link href="/security-policy" className="hover:text-foreground transition-colors">Security.txt</Link>
            <Link href="/responsible-disclosure" className="hover:text-foreground transition-colors">Responsible Disclosure</Link>
          </div>
          <p className="text-[10px] font-mono uppercase tracking-widest text-muted/60">
            © 2026 Jothish Gandham
          </p>
        </div>
      </footer>
    </div>
  );
}