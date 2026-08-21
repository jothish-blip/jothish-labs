"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, useScroll, useSpring, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, ShieldCheck, Lock, Database, Globe, CheckCircle2, 
  Scale, Clock, Mail, User, Info, Server, Activity, ChevronDown, 
  Link as LinkIcon, AlertTriangle, XCircle, Shield
} from 'lucide-react';

const sections = [
  { id: 'data-controller', title: '1. Data Controller', icon: User, color: 'text-blue-500' },
  { id: 'information-collected', title: '2. Information Collection', icon: Database, color: 'text-blue-500' },
  { id: 'legal-basis', title: '3. Legal Basis', icon: Scale, color: 'text-purple-500' },
  { id: 'usage', title: '4. How It Is Used', icon: Activity, color: 'text-blue-500' },
  { id: 'cookies', title: '5. Cookies & Tracking', icon: Globe, color: 'text-amber-500' },
  { id: 'third-parties', title: '6. Third-Party Processors', icon: Server, color: 'text-blue-500' },
  { id: 'international', title: '7. International Transfers', icon: Globe, color: 'text-blue-500' },
  { id: 'retention', title: '8. Data Retention', icon: Clock, color: 'text-amber-500' },
  { id: 'security', title: '9. Security Measures', icon: ShieldCheck, color: 'text-emerald-500' },
  { id: 'rights', title: '10. Your Privacy Rights', icon: Lock, color: 'text-purple-500' },
  { id: 'children', title: '11. Children\'s Privacy', icon: Info, color: 'text-blue-500' },
  { id: 'updates-contact', title: '12. Updates & Contact', icon: Mail, color: 'text-blue-500' },
];

export default function PrivacyPolicy() {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState<string>(sections[0].id);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [securityExpanded, setSecurityExpanded] = useState(false);
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
    <div className="min-h-screen bg-background text-foreground font-sans pb-12 relative selection:bg-emerald-500/30">
      
      {/* Reading Progress Bar */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1.5 z-50 origin-left bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"
        style={{ scaleX }}
      />

      {/* --- RADIOLUCENT (X-RAY) BACKGROUND EFFECT --- */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 z-0 pointer-events-none flex items-center justify-center overflow-hidden w-full h-[600px]">
        <div className="w-[300px] h-[150px] md:w-[700px] md:h-[300px] blur-[100px] rounded-[100%] opacity-10 bg-emerald-500 mix-blend-screen"></div>
        <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(circle,currentColor_1px,transparent_1px)] bg-[size:16px_16px]"></div>
      </div>

      {/* Top Navigation / Back */}
      <div className="max-w-[1400px] mx-auto px-6 pt-12 pb-6 relative z-10">
        <button 
          onClick={() => router.back()}
          className="font-mono text-[11px] uppercase tracking-widest text-muted hover:text-foreground inline-flex items-center gap-2 transition-colors border border-surface bg-surface/30 px-4 py-2 rounded-sm hover:bg-surface focus:outline-none focus:ring-2 focus:ring-emerald-500/50 cursor-pointer"
        >
          <ArrowLeft size={14} /> Back to Portfolio
        </button>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 relative items-start z-10">
        
        {/* Desktop Sidebar (Progress Style) */}
        <aside className="hidden lg:block lg:col-span-3 sticky top-24 max-h-[calc(100vh-120px)] overflow-y-auto no-scrollbar">
          <nav className="flex flex-col font-mono text-[11px] uppercase tracking-widest relative pb-10">
            <h3 className="text-foreground font-bold mb-6 flex items-center gap-2 tracking-[0.24em]">
              <ShieldCheck size={16} className="text-emerald-500" /> Document Index
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
                      <span className={`flex items-center justify-center w-[15px] h-[15px] shrink-0 bg-background transition-colors ${isActive ? 'text-emerald-500' : isPast ? 'text-emerald-500' : 'text-surface-strong'}`}>
                        {isPast ? <CheckCircle2 size={14} /> : isActive ? <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" /> : <span className="w-1.5 h-1.5 rounded-full border border-current" />}
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
              className="w-full bg-background/95 backdrop-blur-md border border-surface shadow-lg rounded-md p-4 flex items-center justify-between text-[12px] font-mono uppercase tracking-widest text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            >
              <span className="flex items-center gap-2"><ShieldCheck size={14} className="text-emerald-500"/> Jump to Section</span>
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
              Privacy & Data <br />
              <span className="text-muted italic font-light">Protection Policy.</span>
            </motion.h1>
            
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-wrap items-center gap-3 mt-8 font-mono text-[10px] sm:text-[11px] uppercase tracking-widest"
            >
              <span className="px-3 py-1.5 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-sm font-semibold flex items-center gap-2">
                Privacy-First Design
              </span>
              <span className="px-3 py-1.5 bg-surface/30 text-muted border border-surface rounded-sm">GDPR Principles</span>
              <span className="px-3 py-1.5 bg-surface/30 text-muted border border-surface rounded-sm">DPDP Principles</span>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
              className="flex flex-wrap gap-6 mt-8 pt-6 border-t border-surface text-[11px] font-mono text-muted uppercase tracking-widest"
            >
              <div className="flex flex-col gap-1">
                <span className="text-foreground/50">Version</span>
                <span className="text-foreground font-semibold">2.2</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-foreground/50">Published</span>
                <span className="text-foreground font-semibold">20 August 2026</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-foreground/50">Last Reviewed</span>
                <span className="text-emerald-500 font-semibold flex items-center gap-1.5"><span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"/> 20 August 2026</span>
              </div>
            </motion.div>
          </header>

          {/* Privacy at a Glance Summary Card */}
          <div className="border border-surface bg-surface/10 rounded-xl p-8 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-emerald-500" />
            <h2 className="text-[13px] font-mono text-emerald-500 uppercase tracking-[0.24em] font-bold mb-6 flex items-center gap-2">
              <Shield size={16} /> Privacy at a Glance
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-8 text-[14px] text-foreground/80 font-medium">
              <div className="flex items-center gap-3"><CheckCircle2 size={16} className="text-emerald-500 shrink-0" /> No data is sold</div>
              <div className="flex items-center gap-3"><CheckCircle2 size={16} className="text-emerald-500 shrink-0" /> No advertising trackers</div>
              <div className="flex items-center gap-3"><CheckCircle2 size={16} className="text-emerald-500 shrink-0" /> Minimal essential cookies</div>
              <div className="flex items-center gap-3"><CheckCircle2 size={16} className="text-emerald-500 shrink-0" /> HTTPS enforced globally</div>
              <div className="flex items-center gap-3"><CheckCircle2 size={16} className="text-emerald-500 shrink-0" /> Contact data used only to reply</div>
              <div className="flex items-center gap-3"><CheckCircle2 size={16} className="text-emerald-500 shrink-0" /> You can request full deletion</div>
            </div>
          </div>

          {/* Privacy Principles */}
          <div>
            <h2 className="text-[16px] font-bold uppercase tracking-widest text-foreground mb-6">Our Privacy Principles</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="p-6 border border-surface bg-background rounded-md">
                <div className="flex items-center gap-2 mb-3 text-blue-500 font-mono text-[11px] uppercase tracking-widest font-bold"><Info size={16}/> Transparency</div>
                <p className="text-[14px] text-muted leading-relaxed">We explain exactly what we collect, why we collect it, and how it is used in plain language.</p>
              </div>
              <div className="p-6 border border-surface bg-background rounded-md">
                <div className="flex items-center gap-2 mb-3 text-amber-500 font-mono text-[11px] uppercase tracking-widest font-bold"><Database size={16}/> Data Minimization</div>
                <p className="text-[14px] text-muted leading-relaxed">Only absolutely necessary information is processed to keep the infrastructure running securely.</p>
              </div>
              <div className="p-6 border border-surface bg-background rounded-md">
                <div className="flex items-center gap-2 mb-3 text-emerald-500 font-mono text-[11px] uppercase tracking-widest font-bold"><ShieldCheck size={16}/> Security</div>
                <p className="text-[14px] text-muted leading-relaxed">Strong technical safeguards protect your data, including modern encryption and access controls.</p>
              </div>
              <div className="p-6 border border-surface bg-background rounded-md">
                <div className="flex items-center gap-2 mb-3 text-purple-500 font-mono text-[11px] uppercase tracking-widest font-bold"><Lock size={16}/> Control</div>
                <p className="text-[14px] text-muted leading-relaxed">You remain in complete control of your personal information and can request deletion at any time.</p>
              </div>
            </div>
          </div>

          {/* What We Don't Do */}
          <div className="border border-red-500/20 bg-red-500/5 rounded-xl p-8">
            <h2 className="text-[13px] font-mono text-red-500 uppercase tracking-[0.24em] font-bold mb-6 flex items-center gap-2">
              <AlertTriangle size={16} /> What We NEVER Do
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[14px] text-foreground/80 font-medium">
              <div className="flex items-center gap-3"><XCircle size={16} className="text-red-500 shrink-0" /> Sell personal information</div>
              <div className="flex items-center gap-3"><XCircle size={16} className="text-red-500 shrink-0" /> Display advertising</div>
              <div className="flex items-center gap-3"><XCircle size={16} className="text-red-500 shrink-0" /> Share data with advertisers</div>
              <div className="flex items-center gap-3"><XCircle size={16} className="text-red-500 shrink-0" /> Use hidden tracking scripts</div>
              <div className="flex items-center gap-3"><XCircle size={16} className="text-red-500 shrink-0" /> Record plaintext passwords</div>
              <div className="flex items-center gap-3"><XCircle size={16} className="text-red-500 shrink-0" /> Store payment information</div>
            </div>
          </div>

          {/* Security Banner (SOC Dashboard Style) */}
          <div className="border border-surface bg-surface/10 rounded-xl p-6 sm:p-8 relative overflow-hidden shadow-lg">
            <div className="flex items-center gap-2 mb-8">
              <Activity size={18} className="text-emerald-500" />
              <h2 className="text-[12px] font-mono text-muted uppercase tracking-[0.24em] font-bold">Privacy Ops Status</h2>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-y-8 gap-x-6">
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-mono text-muted uppercase tracking-widest">Encryption</span>
                <span className="text-[13px] font-mono text-emerald-500 uppercase font-semibold flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Operational</span>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-mono text-muted uppercase tracking-widest">Database Security</span>
                <span className="text-[13px] font-mono text-emerald-500 uppercase font-semibold flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Protected</span>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-mono text-muted uppercase tracking-widest">Authentication</span>
                <span className="text-[13px] font-mono text-emerald-500 uppercase font-semibold flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> MFA Enabled</span>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-mono text-muted uppercase tracking-widest">Cookie Usage</span>
                <span className="text-[13px] font-mono text-amber-500 uppercase font-semibold flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> Minimal</span>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-mono text-muted uppercase tracking-widest">Advertising</span>
                <span className="text-[13px] font-mono text-surface-strong uppercase font-semibold flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-surface-strong" /> Disabled</span>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-mono text-muted uppercase tracking-widest">Monitoring</span>
                <span className="text-[13px] font-mono text-blue-500 uppercase font-semibold flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" /> Active</span>
              </div>
            </div>
          </div>

          <div className="h-px w-full bg-surface my-12" />

          {/* MAIN LEGAL SECTIONS */}
          <div className="space-y-24 text-muted leading-[1.8] text-[15px] md:text-[16px]">
            
            {/* 1. Data Controller */}
            <section id="data-controller" className="scroll-mt-32 relative group outline-none" tabIndex={-1}>
              <h2 className="text-[13px] font-mono uppercase tracking-[0.24em] text-foreground border-b border-surface pb-4 mb-8 flex items-center gap-3">
                <User size={18} className="text-blue-500" /> 1. Data Controller
                <button onClick={() => handleCopyLink('data-controller')} className="opacity-0 group-hover:opacity-100 transition-opacity ml-auto text-muted hover:text-foreground focus:opacity-100 outline-none p-1 rounded-sm focus:ring-2 focus:ring-emerald-500/50" aria-label="Copy link to section">
                  {copiedLink === 'data-controller' ? <CheckCircle2 size={16} className="text-emerald-500" /> : <LinkIcon size={16} />}
                </button>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-8 gap-x-12 bg-surface/5 border border-surface p-8 rounded-md">
                <div><span className="block text-[10px] font-mono text-muted uppercase tracking-widest mb-2">Full Name</span><span className="text-[16px] text-foreground font-medium">Jothish Gandham</span></div>
                <div><span className="block text-[10px] font-mono text-muted uppercase tracking-widest mb-2">Email</span><span className="text-[16px] text-foreground font-medium">jothishgandham2@gmail.com</span></div>
                <div><span className="block text-[10px] font-mono text-muted uppercase tracking-widest mb-2">Country</span><span className="text-[16px] text-foreground font-medium">India</span></div>
                <div><span className="block text-[10px] font-mono text-muted uppercase tracking-widest mb-2">Scope</span><span className="text-[16px] text-foreground font-medium">Portfolio & NeXUP Ecosystem</span></div>
              </div>
            </section>

            {/* Compliance Timeline */}
            <div className="my-16 py-12 px-6 border border-surface rounded-xl bg-background overflow-hidden relative">
              <div className="absolute inset-0 opacity-[0.02] bg-[radial-gradient(circle,currentColor_1px,transparent_1px)] bg-[size:16px_16px]"></div>
              <h3 className="text-[11px] font-mono uppercase tracking-[0.2em] text-foreground mb-10 text-center font-bold relative z-10">Data Lifecycle</h3>
              
              <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-0 relative z-10 max-w-4xl mx-auto">
                <div className="hidden md:block absolute top-1/2 left-[10%] right-[10%] h-[2px] bg-surface -translate-y-1/2 z-0" />
                
                {[
                  { step: "1", label: "Visit Site", sub: "Anonymous IP" },
                  { step: "2", label: "Essential Cookie", sub: "Session State" },
                  { step: "3", label: "Security Processing", sub: "Rate Limiting" },
                  { step: "4", label: "Storage", sub: "Encrypted DB" },
                  { step: "5", label: "Automatic Deletion", sub: "Post Retention" }
                ].map((item, idx) => (
                  <div key={idx} className="relative z-10 flex flex-col items-center text-center bg-background px-4">
                    <div className="w-8 h-8 rounded-full bg-surface border-2 border-background text-foreground flex items-center justify-center font-mono text-[10px] font-bold mb-3 shadow-md">
                      {item.step}
                    </div>
                    <div className="text-[13px] font-semibold text-foreground whitespace-nowrap">{item.label}</div>
                    <div className="text-[10px] font-mono text-muted uppercase tracking-widest mt-1">{item.sub}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. Information We Collect */}
            <section id="information-collected" className="scroll-mt-32 relative group outline-none" tabIndex={-1}>
              <h2 className="text-[13px] font-mono uppercase tracking-[0.24em] text-foreground border-b border-surface pb-4 mb-8 flex items-center gap-3">
                <Database size={18} className="text-blue-500" /> 2. Information We Collect
                <button onClick={() => handleCopyLink('information-collected')} className="opacity-0 group-hover:opacity-100 transition-opacity ml-auto text-muted hover:text-foreground focus:opacity-100 outline-none p-1 rounded-sm focus:ring-2 focus:ring-emerald-500/50">
                  {copiedLink === 'information-collected' ? <CheckCircle2 size={16} className="text-emerald-500" /> : <LinkIcon size={16} />}
                </button>
              </h2>
              <div className="overflow-x-auto border border-surface rounded-md">
                <table className="w-full text-left text-[14px] border-collapse bg-background min-w-[600px]">
                  <thead className="bg-surface/30">
                    <tr className="border-b border-surface text-foreground font-mono text-[10px] uppercase tracking-[0.2em]">
                      <th className="py-4 pl-6 pr-4 font-semibold">Category</th>
                      <th className="py-4 px-4 font-semibold">Collected Data</th>
                      <th className="py-4 px-4 font-semibold">Purpose</th>
                      <th className="py-4 px-6 font-semibold">Retention</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface">
                    <tr className="hover:bg-surface/10 transition-colors">
                      <td className="py-5 pl-6 pr-4 font-medium text-foreground">Device & Network</td>
                      <td className="py-5 px-4 text-muted">IP Address, Browser Type, OS</td>
                      <td className="py-5 px-4 text-muted">Abuse prevention, compatibility</td>
                      <td className="py-5 px-6 text-amber-500 font-mono text-[11px]">365 Days</td>
                    </tr>
                    <tr className="hover:bg-surface/10 transition-colors">
                      <td className="py-5 pl-6 pr-4 font-medium text-foreground">Direct Contact</td>
                      <td className="py-5 px-4 text-muted">Name, Email, Message contents</td>
                      <td className="py-5 px-4 text-muted">Responding to inquiries</td>
                      <td className="py-5 px-6 text-amber-500 font-mono text-[11px]">Until Deleted</td>
                    </tr>
                    <tr className="hover:bg-surface/10 transition-colors">
                      <td className="py-5 pl-6 pr-4 font-medium text-foreground">Analytics</td>
                      <td className="py-5 px-4 text-muted">Session duration, Click events</td>
                      <td className="py-5 px-4 text-muted">Improving UI/UX functionality</td>
                      <td className="py-5 px-6 text-amber-500 font-mono text-[11px]">12 Months</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* 3. Legal Basis */}
            <section id="legal-basis" className="scroll-mt-32 relative group outline-none" tabIndex={-1}>
              <h2 className="text-[13px] font-mono uppercase tracking-[0.24em] text-foreground border-b border-surface pb-4 mb-8 flex items-center gap-3">
                <Scale size={18} className="text-purple-500" /> 3. Legal Basis for Processing
                <button onClick={() => handleCopyLink('legal-basis')} className="opacity-0 group-hover:opacity-100 transition-opacity ml-auto text-muted hover:text-foreground focus:opacity-100 outline-none p-1 rounded-sm focus:ring-2 focus:ring-emerald-500/50">
                  {copiedLink === 'legal-basis' ? <CheckCircle2 size={16} className="text-emerald-500" /> : <LinkIcon size={16} />}
                </button>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-surface/5 border border-surface p-8 rounded-md transition-colors hover:border-surface-strong">
                  <div className="font-mono text-[10px] tracking-widest text-emerald-500 font-bold uppercase mb-3">Legitimate Interest</div>
                  <div className="text-foreground font-semibold text-[16px] mb-3">Security Logs & Telemetry</div>
                  <div className="text-[15px] text-muted">Processing is necessary to detect threats, prevent network abuse, and ensure infrastructure stability for all visitors.</div>
                </div>
                <div className="bg-surface/5 border border-surface p-8 rounded-md transition-colors hover:border-surface-strong">
                  <div className="font-mono text-[10px] tracking-widest text-blue-500 font-bold uppercase mb-3">User Consent</div>
                  <div className="text-foreground font-semibold text-[16px] mb-3">Contact Form Data</div>
                  <div className="text-[15px] text-muted">Information provided voluntarily through contact forms is processed solely to fulfill your direct request for communication.</div>
                </div>
              </div>
            </section>

            {/* 4. How Information Is Used */}
            <section id="usage" className="scroll-mt-32 relative group outline-none" tabIndex={-1}>
              <h2 className="text-[13px] font-mono uppercase tracking-[0.24em] text-foreground border-b border-surface pb-4 mb-8 flex items-center gap-3">
                <Activity size={18} className="text-blue-500" /> 4. How Your Information Is Used
                <button onClick={() => handleCopyLink('usage')} className="opacity-0 group-hover:opacity-100 transition-opacity ml-auto text-muted hover:text-foreground focus:opacity-100 outline-none p-1 rounded-sm focus:ring-2 focus:ring-emerald-500/50">
                  {copiedLink === 'usage' ? <CheckCircle2 size={16} className="text-emerald-500" /> : <LinkIcon size={16} />}
                </button>
              </h2>
              <div className="space-y-6">
                <p>All telemetry and operational data collected is utilized exclusively for internal analytics, active threat monitoring, and maintaining the structural health of this web environment.</p>
                <div className="p-6 border-l-2 border-emerald-500 bg-emerald-500/5 text-foreground font-medium rounded-r-md">
                  Personal information is never sold, rented, or shared with third parties for advertising or marketing purposes under any circumstances.
                </div>
              </div>
            </section>

            {/* 5. Cookies */}
            <section id="cookies" className="scroll-mt-32 relative group outline-none" tabIndex={-1}>
              <h2 className="text-[13px] font-mono uppercase tracking-[0.24em] text-foreground border-b border-surface pb-4 mb-8 flex items-center gap-3">
                <Globe size={18} className="text-amber-500" /> 5. Cookies & Similar Technologies
                <button onClick={() => handleCopyLink('cookies')} className="opacity-0 group-hover:opacity-100 transition-opacity ml-auto text-muted hover:text-foreground focus:opacity-100 outline-none p-1 rounded-sm focus:ring-2 focus:ring-emerald-500/50">
                  {copiedLink === 'cookies' ? <CheckCircle2 size={16} className="text-emerald-500" /> : <LinkIcon size={16} />}
                </button>
              </h2>
              <div className="space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between p-6 bg-surface/5 border border-surface rounded-md gap-4">
                  <div>
                    <div className="text-foreground font-semibold text-[16px] mb-2">Essential Cookies</div>
                    <div className="text-[14px] text-muted">Required for security throttling, CSRF protection, and session state.</div>
                  </div>
                  <span className="text-[10px] font-mono bg-surface text-foreground border border-surface-strong px-3 py-1.5 rounded-sm uppercase tracking-widest w-fit font-bold shadow-sm">Required</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between p-6 bg-surface/5 border border-surface rounded-md gap-4">
                  <div>
                    <div className="text-foreground font-semibold text-[16px] mb-2">Marketing & Tracking Cookies</div>
                    <div className="text-[14px] text-muted">Cross-site tracking pixels and advertising networks.</div>
                  </div>
                  <span className="text-[10px] font-mono bg-red-500/10 text-red-500 border border-red-500/20 px-3 py-1.5 rounded-sm uppercase tracking-widest w-fit font-bold">None Used</span>
                </div>
              </div>
            </section>

            {/* 6. Third-Party Processors */}
            <section id="third-parties" className="scroll-mt-32 relative group outline-none" tabIndex={-1}>
              <h2 className="text-[13px] font-mono uppercase tracking-[0.24em] text-foreground border-b border-surface pb-4 mb-8 flex items-center gap-3">
                <Server size={18} className="text-blue-500" /> 6. Third-Party Processors
                <button onClick={() => handleCopyLink('third-parties')} className="opacity-0 group-hover:opacity-100 transition-opacity ml-auto text-muted hover:text-foreground focus:opacity-100 outline-none p-1 rounded-sm focus:ring-2 focus:ring-emerald-500/50">
                  {copiedLink === 'third-parties' ? <CheckCircle2 size={16} className="text-emerald-500" /> : <LinkIcon size={16} />}
                </button>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="p-6 border border-surface bg-surface/5 rounded-md text-center hover:border-surface-strong transition-colors">
                  <div className="font-bold text-[16px] text-foreground mb-3">Vercel</div>
                  <div className="text-[11px] font-mono uppercase tracking-widest text-muted">Hosting & Edge</div>
                </div>
                <div className="p-6 border border-surface bg-surface/5 rounded-md text-center hover:border-surface-strong transition-colors">
                  <div className="font-bold text-[16px] text-foreground mb-3">Supabase</div>
                  <div className="text-[11px] font-mono uppercase tracking-widest text-muted">Database</div>
                </div>
                <div className="p-6 border border-surface bg-surface/5 rounded-md text-center hover:border-surface-strong transition-colors">
                  <div className="font-bold text-[16px] text-foreground mb-3">Resend</div>
                  <div className="text-[11px] font-mono uppercase tracking-widest text-muted">Transactional Email</div>
                </div>
              </div>
            </section>

            {/* 7. International Transfers */}
            <section id="international" className="scroll-mt-32 relative group outline-none" tabIndex={-1}>
              <h2 className="text-[13px] font-mono uppercase tracking-[0.24em] text-foreground border-b border-surface pb-4 mb-8 flex items-center gap-3">
                <Globe size={18} className="text-blue-500" /> 7. International Transfers
                <button onClick={() => handleCopyLink('international')} className="opacity-0 group-hover:opacity-100 transition-opacity ml-auto text-muted hover:text-foreground focus:opacity-100 outline-none p-1 rounded-sm focus:ring-2 focus:ring-emerald-500/50">
                  {copiedLink === 'international' ? <CheckCircle2 size={16} className="text-emerald-500" /> : <LinkIcon size={16} />}
                </button>
              </h2>
              <div className="p-6 md:p-8 bg-surface/10 border border-surface rounded-xl">
                <h3 className="font-mono text-[11px] uppercase tracking-[0.2em] text-foreground font-bold mb-4 flex items-center gap-2">
                  <AlertTriangle size={16} className="text-amber-500"/> Notice Regarding Data Locality
                </h3>
                <p className="mb-4">Your information may be processed outside your country of residence because modern cloud infrastructure and edge providers operate globally.</p>
                <p className="text-foreground/80 font-medium">All data transfers strictly utilize encrypted connections, and appropriate technical safeguards are enforced at the network edge to maintain privacy standards regardless of region.</p>
              </div>
            </section>

            {/* 8. Data Retention */}
            <section id="retention" className="scroll-mt-32 relative group outline-none" tabIndex={-1}>
              <h2 className="text-[13px] font-mono uppercase tracking-[0.24em] text-foreground border-b border-surface pb-4 mb-8 flex items-center gap-3">
                <Clock size={18} className="text-amber-500" /> 8. Data Retention
                <button onClick={() => handleCopyLink('retention')} className="opacity-0 group-hover:opacity-100 transition-opacity ml-auto text-muted hover:text-foreground focus:opacity-100 outline-none p-1 rounded-sm focus:ring-2 focus:ring-emerald-500/50">
                  {copiedLink === 'retention' ? <CheckCircle2 size={16} className="text-emerald-500" /> : <LinkIcon size={16} />}
                </button>
              </h2>
              <div className="bg-background border border-surface rounded-md overflow-hidden">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-4 border-b border-surface gap-3">
                  <span className="text-foreground font-medium text-[15px]">Contact Form Submissions</span>
                  <span className="font-mono text-[11px] uppercase tracking-widest text-amber-500 bg-amber-500/10 px-3 py-1.5 rounded-sm">Until Resolved / Deleted</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-4 border-b border-surface gap-3">
                  <span className="text-foreground font-medium text-[15px]">Security & Telemetry Logs</span>
                  <span className="font-mono text-[11px] uppercase tracking-widest text-amber-500 bg-amber-500/10 px-3 py-1.5 rounded-sm">90–365 Days</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-4 border-b border-surface gap-3">
                  <span className="text-foreground font-medium text-[15px]">Session State Cookies</span>
                  <span className="font-mono text-[11px] uppercase tracking-widest text-amber-500 bg-amber-500/10 px-3 py-1.5 rounded-sm">End of Session</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-4 gap-3">
                  <span className="text-foreground font-medium text-[15px]">Malicious IPs / Banned Entities</span>
                  <span className="font-mono text-[11px] text-red-500 uppercase tracking-widest bg-red-500/10 px-3 py-1.5 rounded-sm border border-red-500/20 font-bold">Up to 365 Days</span>
                </div>
              </div>
            </section>

            {/* 9. Expandable Details for Security Measures */}
            <section id="security" className="scroll-mt-32 relative group outline-none" tabIndex={-1}>
              <h2 className="text-[13px] font-mono uppercase tracking-[0.24em] text-foreground border-b border-surface pb-4 mb-8 flex items-center gap-3">
                <ShieldCheck size={18} className="text-emerald-500" /> 9. Security Architecture
                <button onClick={() => handleCopyLink('security')} className="opacity-0 group-hover:opacity-100 transition-opacity ml-auto text-muted hover:text-foreground focus:opacity-100 outline-none p-1 rounded-sm focus:ring-2 focus:ring-emerald-500/50">
                  {copiedLink === 'security' ? <CheckCircle2 size={16} className="text-emerald-500" /> : <LinkIcon size={16} />}
                </button>
              </h2>
              
              <div className="border border-surface rounded-md bg-surface/5 overflow-hidden">
                <button 
                  onClick={() => setSecurityExpanded(!securityExpanded)}
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-surface/20 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  aria-expanded={securityExpanded}
                >
                  <span className="font-bold text-[16px] text-foreground">Technical Safeguards</span>
                  <ChevronDown size={20} className={`text-muted transition-transform duration-300 ${securityExpanded ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {securityExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t border-surface"
                    >
                      <div className="p-6 md:p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-6 gap-x-8 text-[14px]">
                        <div className="flex items-start gap-3"><CheckCircle2 size={18} className="text-emerald-500 shrink-0 mt-0.5" /> <span className="font-medium text-foreground/90">TLS 1.3 Strict Transit</span></div>
                        <div className="flex items-start gap-3"><CheckCircle2 size={18} className="text-emerald-500 shrink-0 mt-0.5" /> <span className="font-medium text-foreground/90">Row Level Security (RLS)</span></div>
                        <div className="flex items-start gap-3"><CheckCircle2 size={18} className="text-emerald-500 shrink-0 mt-0.5" /> <span className="font-medium text-foreground/90">Strict Rate Limiting</span></div>
                        <div className="flex items-start gap-3"><CheckCircle2 size={18} className="text-emerald-500 shrink-0 mt-0.5" /> <span className="font-medium text-foreground/90">Database Encryption at Rest</span></div>
                        <div className="flex items-start gap-3"><CheckCircle2 size={18} className="text-emerald-500 shrink-0 mt-0.5" /> <span className="font-medium text-foreground/90">Admin MFA Enforced</span></div>
                        <div className="flex items-start gap-3"><CheckCircle2 size={18} className="text-emerald-500 shrink-0 mt-0.5" /> <span className="font-medium text-foreground/90">Least-Privilege API Keys</span></div>
                        <div className="flex items-start gap-3"><CheckCircle2 size={18} className="text-emerald-500 shrink-0 mt-0.5" /> <span className="font-medium text-foreground/90">Automated Audit Logs</span></div>
                        <div className="flex items-start gap-3"><CheckCircle2 size={18} className="text-emerald-500 shrink-0 mt-0.5" /> <span className="font-medium text-foreground/90">Secrets Management</span></div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </section>

            {/* 10. Your Privacy Rights */}
            <section id="rights" className="scroll-mt-32 relative group outline-none" tabIndex={-1}>
              <h2 className="text-[13px] font-mono uppercase tracking-[0.24em] text-foreground border-b border-surface pb-4 mb-8 flex items-center gap-3">
                <Lock size={18} className="text-purple-500" /> 10. Your Privacy Rights
                <button onClick={() => handleCopyLink('rights')} className="opacity-0 group-hover:opacity-100 transition-opacity ml-auto text-muted hover:text-foreground focus:opacity-100 outline-none p-1 rounded-sm focus:ring-2 focus:ring-emerald-500/50">
                  {copiedLink === 'rights' ? <CheckCircle2 size={16} className="text-emerald-500" /> : <LinkIcon size={16} />}
                </button>
              </h2>
              <p className="mb-8">Depending on your jurisdiction, you retain full operational rights over your personal data submitted to this infrastructure:</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center mb-10">
                <div className="bg-surface/5 border border-surface p-5 rounded-md text-[14px] font-medium text-foreground">Access Data</div>
                <div className="bg-surface/5 border border-surface p-5 rounded-md text-[14px] font-medium text-foreground">Correct Data</div>
                <div className="bg-surface/5 border border-surface p-5 rounded-md text-[14px] font-medium text-foreground">Delete Data</div>
                <div className="bg-surface/5 border border-surface p-5 rounded-md text-[14px] font-medium text-foreground">Revoke Consent</div>
              </div>
            </section>

            {/* 11. Children's Privacy */}
            <section id="children" className="scroll-mt-32 relative group outline-none" tabIndex={-1}>
              <h2 className="text-[13px] font-mono uppercase tracking-[0.24em] text-foreground border-b border-surface pb-4 mb-8 flex items-center gap-3">
                <Info size={18} className="text-blue-500" /> 11. Children&apos;s Privacy
                <button onClick={() => handleCopyLink('children')} className="opacity-0 group-hover:opacity-100 transition-opacity ml-auto text-muted hover:text-foreground focus:opacity-100 outline-none p-1 rounded-sm focus:ring-2 focus:ring-emerald-500/50">
                  {copiedLink === 'children' ? <CheckCircle2 size={16} className="text-emerald-500" /> : <LinkIcon size={16} />}
                </button>
              </h2>
              <p>This technical portfolio is strictly intended for professionals and is not directed toward children under the applicable minimum age in their jurisdiction. Personal information is not knowingly collected from minors.</p>
            </section>

            {/* 12. Updates & Action Buttons */}
            <section id="updates-contact" className="scroll-mt-32 relative group outline-none" tabIndex={-1}>
              <h2 className="text-[13px] font-mono uppercase tracking-[0.24em] text-foreground border-b border-surface pb-4 mb-8 flex items-center gap-3">
                <Mail size={18} className="text-blue-500" /> 12. Updates & Contact
                <button onClick={() => handleCopyLink('updates-contact')} className="opacity-0 group-hover:opacity-100 transition-opacity ml-auto text-muted hover:text-foreground focus:opacity-100 outline-none p-1 rounded-sm focus:ring-2 focus:ring-emerald-500/50">
                  {copiedLink === 'updates-contact' ? <CheckCircle2 size={16} className="text-emerald-500" /> : <LinkIcon size={16} />}
                </button>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                <div>
                  <h3 className="text-foreground font-bold mb-4 text-[16px]">Policy Revisions</h3>
                  <p className="text-[15px] text-muted leading-relaxed">Whenever this policy changes, the &quot;Last Reviewed&quot; revision date will be updated at the top of the document. Significant operational changes affecting privacy will be highlighted visually.</p>
                </div>
                <div className="bg-surface/5 border border-surface p-8 rounded-md">
                  <h3 className="text-foreground font-bold mb-6 text-[16px]">Privacy Controller Contact</h3>
                  <div className="space-y-5 text-[14px]">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <span className="text-muted font-mono uppercase tracking-widest text-[10px]">Email Destination</span>
                      <span className="text-foreground font-medium">jothishgandham2@gmail.com</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <span className="text-muted font-mono uppercase tracking-widest text-[10px]">SLA Response Time</span>
                      <span className="text-[11px] font-mono uppercase tracking-widest text-emerald-500 bg-emerald-500/10 px-3 py-1.5 rounded-sm border border-emerald-500/20 w-fit font-bold">Within 30 Days</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Action Buttons */}
              <div className="flex flex-wrap gap-4 pt-8 border-t border-surface">
                <a href="mailto:jothishgandham2@gmail.com?subject=Data Access Request" className="px-6 py-3 bg-foreground text-background font-mono text-[11px] uppercase tracking-widest font-bold rounded-sm hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-foreground/50">
                  Request My Data
                </a>
                <a href="mailto:jothishgandham2@gmail.com?subject=Data Deletion Request" className="px-6 py-3 border border-red-500/50 text-red-500 bg-red-500/10 hover:bg-red-500 hover:text-white font-mono text-[11px] uppercase tracking-widest font-bold rounded-sm transition-all focus:outline-none focus:ring-2 focus:ring-red-500/50">
                  Request Deletion
                </a>
                <a href="mailto:jothishgandham2@gmail.com?subject=Privacy Concern" className="px-6 py-3 border border-surface bg-surface/20 text-foreground hover:bg-surface font-mono text-[11px] uppercase tracking-widest font-bold rounded-sm transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500/50">
                  Report Concern
                </a>
              </div>
            </section>

          </div>
        </main>
      </div>
    </div>
  );
}