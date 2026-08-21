"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, useScroll, useSpring, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, ShieldCheck, Lock, CheckCircle2, 
  Clock, Mail, Info, Activity, ChevronDown, 
  Link as LinkIcon, AlertTriangle, XCircle, Shield, Target,
  FileCode2, Terminal, UserCheck, Copy, Award,
  Scale
} from 'lucide-react';

const sections = [
  { id: 'commitment', title: '1. Security Commitment' },
  { id: 'safe-harbor', title: '2. Safe Harbor' },
  { id: 'guidelines', title: '3. Reporting Guidelines' },
  { id: 'scope', title: '4. Scope' },
  { id: 'good-report', title: '5. Good Report Criteria' },
  { id: 'process', title: '6. Disclosure Process' },
  { id: 'timeline', title: '7. Response Timeline' },
  { id: 'recognition', title: '8. Recognition' },
  { id: 'contact', title: '9. Contact' },
  { id: 'legal', title: '10. Legal Notice' },
];

export default function ResponsibleDisclosure() {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState<string>(sections[0].id);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState<string | null>(null);
  const [copiedEmail, setCopiedEmail] = useState(false);

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

  const handleCopyEmail = () => {
    navigator.clipboard.writeText("gandhamjothish1@gmail.com");
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
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
      
      {/* Reading Progress Bar */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1.5 z-50 origin-left bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]"
        style={{ scaleX }}
      />

      {/* --- RADIOLUCENT (X-RAY) BACKGROUND EFFECT --- */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 z-0 pointer-events-none flex items-center justify-center overflow-hidden w-full h-[600px]">
        <div className="w-[300px] h-[150px] md:w-[700px] md:h-[300px] blur-[100px] rounded-[100%] opacity-10 bg-amber-500 mix-blend-screen"></div>
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
              <ShieldCheck size={16} className="text-amber-500" /> Document Index
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
                      <span className={`flex items-center justify-center w-[15px] h-[15px] shrink-0 bg-background transition-colors ${isActive ? 'text-amber-500' : isPast ? 'text-amber-500' : 'text-surface-strong'}`}>
                        {isPast ? <CheckCircle2 size={14} /> : isActive ? <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.8)]" /> : <span className="w-1.5 h-1.5 rounded-full border border-current" />}
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
              <span className="flex items-center gap-2"><ShieldCheck size={14} className="text-amber-500"/> Jump to Section</span>
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
              Responsible <br />
              <span className="text-muted italic font-light">Disclosure.</span>
            </motion.h1>
            
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-wrap items-center gap-3 mt-8 font-mono text-[10px] sm:text-[11px] uppercase tracking-widest"
            >
              <span className="px-3 py-1.5 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded-sm font-semibold flex items-center gap-2">
                Security Vulnerability Policy
              </span>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
              className="flex flex-wrap gap-6 mt-8 pt-6 border-t border-surface text-[11px] font-mono text-muted uppercase tracking-widest"
            >
              <div className="flex flex-col gap-1">
                <span className="text-foreground/50">Status</span>
                <span className="text-emerald-500 font-semibold flex items-center gap-1.5"><span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"/> Accepting Reports</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-foreground/50">Safe Harbor</span>
                <span className="text-foreground font-semibold">Enabled</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-foreground/50">Average Response</span>
                <span className="text-foreground font-semibold">48 Hours</span>
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
              Security is a core principle of this portfolio. I welcome responsible vulnerability reports from security researchers and members of the cybersecurity community. This policy outlines how to report security issues responsibly and what you can expect throughout the disclosure process.
            </motion.p>
          </header>

          {/* Security Dashboard / Banner */}
          <div className="border border-surface bg-surface/10 rounded-xl p-6 sm:p-8 relative overflow-hidden shadow-lg">
            <div className="absolute top-0 left-0 right-0 h-1 bg-amber-500" />
            <div className="flex items-center gap-2 mb-8">
              <Activity size={18} className="text-amber-500" />
              <h2 className="text-[12px] font-mono text-muted uppercase tracking-[0.24em] font-bold">Security Status</h2>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-y-8 gap-x-6">
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-mono text-muted uppercase tracking-widest">Disclosure Program</span>
                <span className="text-[13px] font-mono text-emerald-500 uppercase font-semibold flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Active</span>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-mono text-muted uppercase tracking-widest">Safe Harbor</span>
                <span className="text-[13px] font-mono text-emerald-500 uppercase font-semibold flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Enabled</span>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-mono text-muted uppercase tracking-widest">Bug Bounty</span>
                <span className="text-[13px] font-mono text-surface-strong uppercase font-semibold flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-surface-strong" /> Not Available</span>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-mono text-muted uppercase tracking-widest">Reports Accepted</span>
                <span className="text-[13px] font-mono text-emerald-500 uppercase font-semibold flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Yes</span>
              </div>
            </div>
          </div>

          {/* Disclosure at a Glance Summary Card */}
          <div className="border border-surface bg-background rounded-xl p-8 shadow-sm">
            <h2 className="text-[13px] font-mono text-foreground uppercase tracking-[0.24em] font-bold mb-6 flex items-center gap-2 border-b border-surface pb-4">
              <Target size={16} className="text-amber-500" /> Disclosure at a Glance
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-5 gap-x-8 text-[14px] text-foreground/80 font-medium">
              <div className="flex items-center gap-3"><CheckCircle2 size={16} className="text-emerald-500 shrink-0" /> Safe Harbor Included</div>
              <div className="flex items-center gap-3"><CheckCircle2 size={16} className="text-emerald-500 shrink-0" /> Responsible Research Encouraged</div>
              <div className="flex items-center gap-3"><CheckCircle2 size={16} className="text-amber-500 shrink-0" /> No Monetary Bug Bounty</div>
              <div className="flex items-center gap-3"><CheckCircle2 size={16} className="text-emerald-500 shrink-0" /> 48 Hour Initial Response</div>
              <div className="flex items-center gap-3"><CheckCircle2 size={16} className="text-emerald-500 shrink-0" /> Coordinated Disclosure</div>
              <div className="flex items-center gap-3"><CheckCircle2 size={16} className="text-emerald-500 shrink-0" /> Public Credit Available</div>
            </div>
          </div>

          <div className="h-px w-full bg-surface my-12" />

          {/* MAIN SECTIONS */}
          <div className="space-y-24 text-muted leading-[1.8] text-[15px] md:text-[16px]">
            
            {/* 1. Security Commitment */}
            <section id="commitment" className="scroll-mt-32 relative group outline-none" tabIndex={-1}>
              <h2 className="text-[13px] font-mono uppercase tracking-[0.24em] text-foreground border-b border-surface pb-4 mb-8 flex items-center gap-3">
                <ShieldCheck size={18} className="text-blue-500" /> 1. Security Commitment
                <button onClick={() => handleCopyLink('commitment')} className="opacity-0 group-hover:opacity-100 transition-opacity ml-auto text-muted hover:text-foreground focus:opacity-100 outline-none p-1 rounded-sm focus:ring-2 focus:ring-amber-500/50" aria-label="Copy link to section">
                  {copiedLink === 'commitment' ? <CheckCircle2 size={16} className="text-emerald-500" /> : <LinkIcon size={16} />}
                </button>
              </h2>
              <div className="p-6 md:p-8 bg-surface/5 border border-surface rounded-md">
                <p>This website is designed and maintained using security best practices. Despite ongoing testing and monitoring, vulnerabilities may still exist. Responsible disclosure helps improve the security of this portfolio while protecting visitors and infrastructure.</p>
              </div>
            </section>

            {/* 2. Safe Harbor */}
            <section id="safe-harbor" className="scroll-mt-32 relative group outline-none" tabIndex={-1}>
              <h2 className="text-[13px] font-mono uppercase tracking-[0.24em] text-foreground border-b border-surface pb-4 mb-8 flex items-center gap-3">
                <Lock size={18} className="text-emerald-500" /> 2. Safe Harbor
                <button onClick={() => handleCopyLink('safe-harbor')} className="opacity-0 group-hover:opacity-100 transition-opacity ml-auto text-muted hover:text-foreground focus:opacity-100 outline-none p-1 rounded-sm focus:ring-2 focus:ring-amber-500/50">
                  {copiedLink === 'safe-harbor' ? <CheckCircle2 size={16} className="text-emerald-500" /> : <LinkIcon size={16} />}
                </button>
              </h2>
              <div className="space-y-6">
                <p className="text-foreground/90 font-medium">Researchers acting in good faith and following this policy will not be subject to legal action for their security research. This safe harbor applies only to activities that remain within the scope and guidelines described below.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[14px]">
                  <div className="flex items-center gap-3 p-4 border border-surface rounded-sm"><CheckCircle2 size={16} className="text-emerald-500 shrink-0"/> Good faith research is authorized</div>
                  <div className="flex items-center gap-3 p-4 border border-surface rounded-sm"><CheckCircle2 size={16} className="text-emerald-500 shrink-0"/> No legal action for compliant research</div>
                  <div className="flex items-center gap-3 p-4 border border-surface rounded-sm"><CheckCircle2 size={16} className="text-emerald-500 shrink-0"/> Public disclosure by mutual agreement</div>
                  <div className="flex items-center gap-3 p-4 border border-surface rounded-sm"><CheckCircle2 size={16} className="text-emerald-500 shrink-0"/> Reports handled confidentially</div>
                </div>
              </div>
            </section>

            {/* 3. Reporting Guidelines */}
            <section id="guidelines" className="scroll-mt-32 relative group outline-none" tabIndex={-1}>
              <h2 className="text-[13px] font-mono uppercase tracking-[0.24em] text-foreground border-b border-surface pb-4 mb-8 flex items-center gap-3">
                <AlertTriangle size={18} className="text-amber-500" /> 3. Reporting Guidelines
                <button onClick={() => handleCopyLink('guidelines')} className="opacity-0 group-hover:opacity-100 transition-opacity ml-auto text-muted hover:text-foreground focus:opacity-100 outline-none p-1 rounded-sm focus:ring-2 focus:ring-amber-500/50">
                  {copiedLink === 'guidelines' ? <CheckCircle2 size={16} className="text-emerald-500" /> : <LinkIcon size={16} />}
                </button>
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="border border-emerald-500/20 bg-emerald-500/5 rounded-xl p-6 sm:p-8">
                  <h3 className="font-mono text-[11px] uppercase tracking-widest text-emerald-500 font-bold mb-6 flex items-center gap-2">Allowed Activities</h3>
                  <ul className="space-y-4 text-[14px] text-foreground/80">
                    <li className="flex items-start gap-3"><CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" /> Verify the vulnerability</li>
                    <li className="flex items-start gap-3"><CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" /> Minimal proof-of-concept</li>
                    <li className="flex items-start gap-3"><CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" /> Responsible disclosure</li>
                    <li className="flex items-start gap-3"><CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" /> Preserve evidence</li>
                    <li className="flex items-start gap-3"><CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" /> Respect privacy</li>
                  </ul>
                </div>
                
                <div className="border border-red-500/20 bg-red-500/5 rounded-xl p-6 sm:p-8">
                  <h3 className="font-mono text-[11px] uppercase tracking-widest text-red-500 font-bold mb-6 flex items-center gap-2">Not Allowed</h3>
                  <ul className="space-y-4 text-[14px] text-foreground/80">
                    <li className="flex items-start gap-3"><XCircle size={16} className="text-red-500 shrink-0 mt-0.5" /> DoS / DDoS attacks</li>
                    <li className="flex items-start gap-3"><XCircle size={16} className="text-red-500 shrink-0 mt-0.5" /> Spam or volumetric fuzzing</li>
                    <li className="flex items-start gap-3"><XCircle size={16} className="text-red-500 shrink-0 mt-0.5" /> Brute force attacks</li>
                    <li className="flex items-start gap-3"><XCircle size={16} className="text-red-500 shrink-0 mt-0.5" /> Social Engineering / Phishing</li>
                    <li className="flex items-start gap-3"><XCircle size={16} className="text-red-500 shrink-0 mt-0.5" /> Data Exfiltration or modification</li>
                    <li className="flex items-start gap-3"><XCircle size={16} className="text-red-500 shrink-0 mt-0.5" /> Malware deployment</li>
                    <li className="flex items-start gap-3"><XCircle size={16} className="text-red-500 shrink-0 mt-0.5" /> Physical attacks</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* 4. Scope */}
            <section id="scope" className="scroll-mt-32 relative group outline-none" tabIndex={-1}>
              <h2 className="text-[13px] font-mono uppercase tracking-[0.24em] text-foreground border-b border-surface pb-4 mb-8 flex items-center gap-3">
                <Target size={18} className="text-blue-500" /> 4. Scope
                <button onClick={() => handleCopyLink('scope')} className="opacity-0 group-hover:opacity-100 transition-opacity ml-auto text-muted hover:text-foreground focus:opacity-100 outline-none p-1 rounded-sm focus:ring-2 focus:ring-amber-500/50">
                  {copiedLink === 'scope' ? <CheckCircle2 size={16} className="text-emerald-500" /> : <LinkIcon size={16} />}
                </button>
              </h2>
              
              <div className="space-y-8">
                <div>
                  <h3 className="font-mono text-[11px] uppercase tracking-widest text-foreground font-bold mb-4">In Scope</h3>
                  <div className="overflow-x-auto border border-surface rounded-md">
                    <table className="w-full text-left text-[14px] border-collapse bg-background">
                      <thead className="bg-surface/30">
                        <tr className="border-b border-surface text-muted font-mono text-[10px] uppercase tracking-[0.2em]">
                          <th className="py-3 px-6 font-semibold">Target</th>
                          <th className="py-3 px-6 font-semibold w-32 text-center">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-surface">
                        <tr className="hover:bg-surface/10 transition-colors">
                          <td className="py-4 px-6 font-mono text-[13px] text-foreground">Main Portfolio</td>
                          <td className="py-4 px-6 text-center"><CheckCircle2 size={16} className="text-emerald-500 mx-auto" /></td>
                        </tr>
                        <tr className="hover:bg-surface/10 transition-colors">
                          <td className="py-4 px-6 font-mono text-[13px] text-foreground bg-surface/30 rounded-sm inline-block m-2 border border-surface">/api/*</td>
                          <td className="py-4 px-6 text-center"><CheckCircle2 size={16} className="text-emerald-500 mx-auto" /></td>
                        </tr>
                        <tr className="hover:bg-surface/10 transition-colors">
                          <td className="py-4 px-6 font-mono text-[13px] text-foreground">Contact Form</td>
                          <td className="py-4 px-6 text-center"><CheckCircle2 size={16} className="text-emerald-500 mx-auto" /></td>
                        </tr>
                        <tr className="hover:bg-surface/10 transition-colors">
                          <td className="py-4 px-6 font-mono text-[13px] text-foreground">Authentication</td>
                          <td className="py-4 px-6 text-center"><CheckCircle2 size={16} className="text-emerald-500 mx-auto" /></td>
                        </tr>
                        <tr className="hover:bg-surface/10 transition-colors">
                          <td className="py-4 px-6 font-mono text-[13px] text-foreground">Supabase RLS</td>
                          <td className="py-4 px-6 text-center"><CheckCircle2 size={16} className="text-emerald-500 mx-auto" /></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div>
                  <h3 className="font-mono text-[11px] uppercase tracking-widest text-foreground font-bold mb-4">Out of Scope</h3>
                  <div className="overflow-x-auto border border-surface rounded-md">
                    <table className="w-full text-left text-[14px] border-collapse bg-background">
                      <thead className="bg-surface/30">
                        <tr className="border-b border-surface text-muted font-mono text-[10px] uppercase tracking-[0.2em]">
                          <th className="py-3 px-6 font-semibold">Target</th>
                          <th className="py-3 px-6 font-semibold">Reason</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-surface">
                        <tr className="hover:bg-surface/10 transition-colors">
                          <td className="py-4 px-6 text-foreground font-medium">Vercel Infrastructure</td>
                          <td className="py-4 px-6 text-muted">Third Party</td>
                        </tr>
                        <tr className="hover:bg-surface/10 transition-colors">
                          <td className="py-4 px-6 text-foreground font-medium">Supabase Platform</td>
                          <td className="py-4 px-6 text-muted">Third Party</td>
                        </tr>
                        <tr className="hover:bg-surface/10 transition-colors">
                          <td className="py-4 px-6 text-foreground font-medium">Browser Extensions</td>
                          <td className="py-4 px-6 text-muted">Not Controlled</td>
                        </tr>
                        <tr className="hover:bg-surface/10 transition-colors">
                          <td className="py-4 px-6 text-foreground font-medium">DNS Providers</td>
                          <td className="py-4 px-6 text-muted">Third Party</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </section>

            {/* 5. Good Report Criteria */}
            <section id="good-report" className="scroll-mt-32 relative group outline-none" tabIndex={-1}>
              <h2 className="text-[13px] font-mono uppercase tracking-[0.24em] text-foreground border-b border-surface pb-4 mb-8 flex items-center gap-3">
                <FileCode2 size={18} className="text-purple-500" /> 5. What Makes a Good Report
                <button onClick={() => handleCopyLink('good-report')} className="opacity-0 group-hover:opacity-100 transition-opacity ml-auto text-muted hover:text-foreground focus:opacity-100 outline-none p-1 rounded-sm focus:ring-2 focus:ring-amber-500/50">
                  {copiedLink === 'good-report' ? <CheckCircle2 size={16} className="text-emerald-500" /> : <LinkIcon size={16} />}
                </button>
              </h2>
              <div className="bg-surface/5 border border-surface rounded-md p-6 sm:p-8">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-6 gap-x-4 text-[14px] text-foreground/90 font-medium">
                  <div className="flex items-center gap-3"><CheckCircle2 size={16} className="text-blue-500 shrink-0" /> Clear description</div>
                  <div className="flex items-center gap-3"><CheckCircle2 size={16} className="text-blue-500 shrink-0" /> Reproduction steps</div>
                  <div className="flex items-center gap-3"><CheckCircle2 size={16} className="text-blue-500 shrink-0" /> Impact assessment</div>
                  <div className="flex items-center gap-3"><CheckCircle2 size={16} className="text-blue-500 shrink-0" /> Screenshots</div>
                  <div className="flex items-center gap-3"><CheckCircle2 size={16} className="text-blue-500 shrink-0" /> Relevant Logs</div>
                  <div className="flex items-center gap-3"><CheckCircle2 size={16} className="text-blue-500 shrink-0" /> Proof of Concept (PoC)</div>
                </div>
                <div className="mt-8 pt-6 border-t border-surface text-[13px] text-muted flex items-center gap-3">
                  <Info size={16} className="text-surface-strong" /> Suggested fixes or mitigations are optional but highly appreciated.
                </div>
              </div>
            </section>

            {/* 6. Disclosure Process */}
            <section id="process" className="scroll-mt-32 relative group outline-none" tabIndex={-1}>
              <h2 className="text-[13px] font-mono uppercase tracking-[0.24em] text-foreground border-b border-surface pb-4 mb-8 flex items-center gap-3">
                <Activity size={18} className="text-emerald-500" /> 6. Disclosure Process
                <button onClick={() => handleCopyLink('process')} className="opacity-0 group-hover:opacity-100 transition-opacity ml-auto text-muted hover:text-foreground focus:opacity-100 outline-none p-1 rounded-sm focus:ring-2 focus:ring-amber-500/50">
                  {copiedLink === 'process' ? <CheckCircle2 size={16} className="text-emerald-500" /> : <LinkIcon size={16} />}
                </button>
              </h2>
              
              <div className="relative max-w-2xl mx-auto py-8">
                <div className="absolute left-[23px] sm:left-[27px] top-10 bottom-10 w-[2px] bg-surface z-0" />
                
                {[
                  { step: "1", title: "Report Submitted", desc: "Researcher sends details securely." },
                  { step: "2", title: "Acknowledgement", desc: "Within 48 hours." },
                  { step: "3", title: "Validation", desc: "Verifying the vulnerability and impact." },
                  { step: "4", title: "Patch Development", desc: "Building and testing the fix." },
                  { step: "5", title: "Deployment", desc: "Patch pushed to production." },
                  { step: "6", title: "Coordinated Disclosure", desc: "Mutual agreement on public release." },
                  { step: "7", title: "Researcher Credit", desc: "Added to the Hall of Thanks." }
                ].map((item, idx) => (
                  <div key={idx} className="relative z-10 flex items-start gap-6 mb-8 last:mb-0">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-background border-2 border-surface flex items-center justify-center font-mono text-[12px] font-bold text-muted shadow-sm shrink-0">
                      0{item.step}
                    </div>
                    <div className="pt-2 sm:pt-3">
                      <h4 className="text-[15px] font-bold text-foreground">{item.title}</h4>
                      <p className="text-[13px] text-muted mt-1">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* 7. Response Timeline */}
            <section id="timeline" className="scroll-mt-32 relative group outline-none" tabIndex={-1}>
              <h2 className="text-[13px] font-mono uppercase tracking-[0.24em] text-foreground border-b border-surface pb-4 mb-8 flex items-center gap-3">
                <Clock size={18} className="text-amber-500" /> 7. Response Timeline
                <button onClick={() => handleCopyLink('timeline')} className="opacity-0 group-hover:opacity-100 transition-opacity ml-auto text-muted hover:text-foreground focus:opacity-100 outline-none p-1 rounded-sm focus:ring-2 focus:ring-amber-500/50">
                  {copiedLink === 'timeline' ? <CheckCircle2 size={16} className="text-emerald-500" /> : <LinkIcon size={16} />}
                </button>
              </h2>
              <div className="overflow-x-auto border border-surface rounded-md">
                <table className="w-full text-left text-[14px] border-collapse bg-background">
                  <thead className="bg-surface/30">
                    <tr className="border-b border-surface text-muted font-mono text-[10px] uppercase tracking-[0.2em]">
                      <th className="py-4 px-6 font-semibold w-1/3">Stage</th>
                      <th className="py-4 px-6 font-semibold">Target Timeline</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface">
                    <tr className="hover:bg-surface/10 transition-colors">
                      <td className="py-5 px-6 font-medium text-foreground">Acknowledge</td>
                      <td className="py-5 px-6 text-amber-500 font-mono text-[12px]">48 Hours</td>
                    </tr>
                    <tr className="hover:bg-surface/10 transition-colors">
                      <td className="py-5 px-6 font-medium text-foreground">Initial Review</td>
                      <td className="py-5 px-6 text-amber-500 font-mono text-[12px]">5 Business Days</td>
                    </tr>
                    <tr className="hover:bg-surface/10 transition-colors">
                      <td className="py-5 px-6 font-medium text-foreground">Status Update</td>
                      <td className="py-5 px-6 text-muted font-mono text-[12px]">As Needed</td>
                    </tr>
                    <tr className="hover:bg-surface/10 transition-colors">
                      <td className="py-5 px-6 font-medium text-foreground">Resolution</td>
                      <td className="py-5 px-6 text-muted font-mono text-[12px]">Depends on Severity</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* 8. Recognition */}
            <section id="recognition" className="scroll-mt-32 relative group outline-none" tabIndex={-1}>
              <h2 className="text-[13px] font-mono uppercase tracking-[0.24em] text-foreground border-b border-surface pb-4 mb-8 flex items-center gap-3">
                <Award size={18} className="text-blue-500" /> 8. Recognition
                <button onClick={() => handleCopyLink('recognition')} className="opacity-0 group-hover:opacity-100 transition-opacity ml-auto text-muted hover:text-foreground focus:opacity-100 outline-none p-1 rounded-sm focus:ring-2 focus:ring-amber-500/50">
                  {copiedLink === 'recognition' ? <CheckCircle2 size={16} className="text-emerald-500" /> : <LinkIcon size={16} />}
                </button>
              </h2>
              
              <div className="bg-surface/5 border border-surface rounded-xl p-8 mb-8 text-center">
                <h3 className="text-[16px] font-bold text-foreground mb-2 uppercase tracking-widest">Hall of Thanks</h3>
                <p className="text-[14px] text-muted max-w-lg mx-auto mb-8">Researchers who responsibly disclose valid vulnerabilities may receive:</p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
                  <div className="flex items-center gap-2 text-foreground font-medium"><CheckCircle2 size={16} className="text-emerald-500"/> Public Credit</div>
                  <div className="flex items-center gap-2 text-foreground font-medium"><CheckCircle2 size={16} className="text-emerald-500"/> Changelog Mention</div>
                  <div className="flex items-center gap-2 text-foreground font-medium"><CheckCircle2 size={16} className="text-emerald-500"/> Linked Profile</div>
                </div>
              </div>

              <div className="flex items-start gap-4 p-5 border border-surface-strong bg-background rounded-md">
                <Info size={20} className="text-surface-strong shrink-0 mt-0.5" />
                <p className="text-[13px] text-muted">
                  This portfolio does not currently operate a monetary bug bounty program. I appreciate the community's efforts in helping secure open and personal projects.
                </p>
              </div>
            </section>

            {/* 9. Contact */}
            <section id="contact" className="scroll-mt-32 relative group outline-none" tabIndex={-1}>
              <h2 className="text-[13px] font-mono uppercase tracking-[0.24em] text-foreground border-b border-surface pb-4 mb-8 flex items-center gap-3">
                <Terminal size={18} className="text-amber-500" /> 9. Contact
                <button onClick={() => handleCopyLink('contact')} className="opacity-0 group-hover:opacity-100 transition-opacity ml-auto text-muted hover:text-foreground focus:opacity-100 outline-none p-1 rounded-sm focus:ring-2 focus:ring-amber-500/50">
                  {copiedLink === 'contact' ? <CheckCircle2 size={16} className="text-emerald-500" /> : <LinkIcon size={16} />}
                </button>
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-background border border-surface p-6 sm:p-8 rounded-xl shadow-sm">
                  <h3 className="font-mono text-[10px] uppercase tracking-widest text-muted mb-6">Security Contact</h3>
                  <div className="flex items-center justify-between bg-surface/20 border border-surface p-4 rounded-md">
                    <span className="font-mono text-[13px] text-foreground">gandhamjothish1@gmail.com</span>
                    <button 
                      onClick={handleCopyEmail}
                      className="p-2 text-muted hover:text-foreground hover:bg-surface rounded-sm transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                      aria-label="Copy email address"
                    >
                      {copiedEmail ? <CheckCircle2 size={16} className="text-emerald-500" /> : <Copy size={16} />}
                    </button>
                  </div>
                </div>

                <div className="flex flex-col justify-center gap-6">
                  <div>
                    <h4 className="font-mono text-[10px] uppercase tracking-widest text-muted mb-2">Preferred Format</h4>
                    <p className="text-[14px] font-medium text-foreground">Encrypted Email (PGP if available)</p>
                    <p className="text-[12px] text-muted mt-2">Reports may be submitted via standard email. If a PGP public key is added in the future, encrypted submissions will be supported and preferred.</p>
                  </div>
                  <div>
                    <h4 className="font-mono text-[10px] uppercase tracking-widest text-muted mb-2">Response Window</h4>
                    <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded-sm font-mono text-[11px] uppercase tracking-widest font-bold">
                      48 Hours
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* 10. Legal Notice */}
            <section id="legal" className="scroll-mt-32 relative group outline-none" tabIndex={-1}>
              <h2 className="text-[13px] font-mono uppercase tracking-[0.24em] text-foreground border-b border-surface pb-4 mb-8 flex items-center gap-3">
                <Scale size={18} className="text-purple-500" /> 10. Legal Notice
                <button onClick={() => handleCopyLink('legal')} className="opacity-0 group-hover:opacity-100 transition-opacity ml-auto text-muted hover:text-foreground focus:opacity-100 outline-none p-1 rounded-sm focus:ring-2 focus:ring-amber-500/50">
                  {copiedLink === 'legal' ? <CheckCircle2 size={16} className="text-emerald-500" /> : <LinkIcon size={16} />}
                </button>
              </h2>
              <div className="bg-surface/5 border border-surface p-6 rounded-md">
                <p className="mb-4 text-foreground/90 font-medium">This policy applies only to systems owned and operated by Jothish Gandham.</p>
                <p>Testing against third-party services, hosting providers, or vendors is outside the scope of this policy and should be reported directly through their official disclosure programs.</p>
              </div>
            </section>
            
          </div>
        </main>
      </div>
    </div>
  );
}