"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, useScroll, useSpring, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, ShieldCheck, Lock, CheckCircle2, 
  Mail, Activity, ChevronDown, Link as LinkIcon, AlertTriangle, 
  XCircle, FileText, GraduationCap, Copyright, Globe, Scale, 
  Ban, MapPin, RefreshCw,
  ArrowRight,
  Clock
} from 'lucide-react';

const sections = [
  { id: 'purpose', title: '1. Website Purpose' },
  { id: 'acceptable-use', title: '2. Acceptable Use' },
  { id: 'education', title: '3. Educational Disclaimer' },
  { id: 'ip', title: '4. Intellectual Property' },
  { id: 'security', title: '5. Security & Testing' },
  { id: 'external-links', title: '6. External Links' },
  { id: 'warranty', title: '7. No Warranty' },
  { id: 'liability', title: '8. Limitation of Liability' },
  { id: 'termination', title: '9. Termination' },
  { id: 'jurisdiction', title: '10. Applicable Law' },
  { id: 'changes', title: '11. Changes to Terms' },
  { id: 'contact', title: '12. Contact' },
];

export default function TermsAndConditions() {
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
    <div className="min-h-screen bg-background text-foreground font-sans pb-12 relative selection:bg-indigo-500/30">
      
      <style>{`
        :root {
          --accent-terms: #6366f1; /* Indigo 500 */
        }
      `}</style>

      {/* Reading Progress Bar */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1.5 z-50 origin-left shadow-[0_0_10px_rgba(99,102,241,0.5)]"
        style={{ scaleX, backgroundColor: 'var(--accent-terms)' }}
      />

      {/* --- RADIOLUCENT (X-RAY) BACKGROUND EFFECT --- */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 z-0 pointer-events-none flex items-center justify-center overflow-hidden w-full h-[600px]">
        <div className="w-[300px] h-[150px] md:w-[700px] md:h-[300px] blur-[100px] rounded-[100%] opacity-15 mix-blend-screen" style={{ backgroundColor: 'var(--accent-terms)' }}></div>
        <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(circle,currentColor_1px,transparent_1px)] bg-[size:16px_16px]"></div>
      </div>

      {/* Top Navigation / Back */}
      <div className="max-w-[1400px] mx-auto px-6 pt-12 pb-6 relative z-10">
        <button 
          onClick={() => router.back()}
          className="font-mono text-[11px] uppercase tracking-widest text-muted hover:text-foreground inline-flex items-center gap-2 transition-colors border border-surface bg-surface/30 px-4 py-2 rounded-sm hover:bg-surface focus:outline-none focus:ring-2 focus:ring-indigo-500/50 cursor-pointer"
        >
          <ArrowLeft size={14} /> Back to Portfolio
        </button>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 relative items-start z-10">
        
        {/* Desktop Sidebar (Progress Style) */}
        <aside className="hidden lg:block lg:col-span-3 sticky top-24 max-h-[calc(100vh-120px)] overflow-y-auto no-scrollbar">
          <nav className="flex flex-col font-mono text-[11px] uppercase tracking-widest relative pb-10">
            <h3 className="text-foreground font-bold mb-6 flex items-center gap-2 tracking-[0.24em]">
              <FileText size={16} style={{ color: 'var(--accent-terms)' }} /> Document Index
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
                      <span className={`flex items-center justify-center w-[15px] h-[15px] shrink-0 bg-background transition-colors ${isActive || isPast ? '' : 'text-surface-strong'}`} style={isActive || isPast ? { color: 'var(--accent-terms)' } : {}}>
                        {isPast ? <CheckCircle2 size={14} /> : isActive ? <span className="w-1.5 h-1.5 rounded-full shadow-[0_0_8px_currentColor]" style={{ backgroundColor: 'var(--accent-terms)' }} /> : <span className="w-1.5 h-1.5 rounded-full border border-current" />}
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
              className="w-full bg-background/95 backdrop-blur-md border border-surface shadow-lg rounded-md p-4 flex items-center justify-between text-[12px] font-mono uppercase tracking-widest text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            >
              <span className="flex items-center gap-2"><FileText size={14} style={{ color: 'var(--accent-terms)' }}/> Jump to Section</span>
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
              Terms & <br />
              <span className="text-muted italic font-light">Conditions.</span>
            </motion.h1>
            
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-wrap items-center gap-3 mt-8 font-mono text-[10px] sm:text-[11px] uppercase tracking-widest"
            >
              <span className="px-3 py-1.5 border rounded-sm font-semibold flex items-center gap-2 text-foreground" style={{ backgroundColor: 'color-mix(in srgb, var(--accent-terms) 10%, transparent)', borderColor: 'color-mix(in srgb, var(--accent-terms) 30%, transparent)' }}>
                Website Usage & Legal Information
              </span>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
              className="flex flex-wrap gap-6 mt-8 pt-6 border-t border-surface text-[11px] font-mono text-muted uppercase tracking-widest"
            >
              <div className="flex flex-col gap-1">
                <span className="text-foreground/50">Status</span>
                <span className="text-emerald-500 font-semibold flex items-center gap-1.5"><span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"/> Active</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-foreground/50">Version</span>
                <span className="text-foreground font-semibold">2.0</span>
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
              These Terms & Conditions govern the use of this website and its interactive features. By accessing or interacting with this portfolio, you agree to these terms and acknowledge the acceptable use guidelines described below.
            </motion.p>
          </header>

          {/* Terms at a Glance Summary Card */}
          <div className="border border-surface bg-background rounded-xl p-8 shadow-sm">
            <h2 className="text-[13px] font-mono text-foreground uppercase tracking-[0.24em] font-bold mb-6 flex items-center gap-2 border-b border-surface pb-4">
              <FileText size={16} style={{ color: 'var(--accent-terms)' }} /> Terms at a Glance
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-5 gap-x-8 text-[14px] text-foreground/80 font-medium">
              <div className="flex items-center gap-3"><CheckCircle2 size={16} className="text-indigo-500 shrink-0" /> Educational Website</div>
              <div className="flex items-center gap-3"><CheckCircle2 size={16} className="text-indigo-500 shrink-0" /> Professional Portfolio</div>
              <div className="flex items-center gap-3"><CheckCircle2 size={16} className="text-indigo-500 shrink-0" /> Responsible Use Required</div>
              <div className="flex items-center gap-3"><CheckCircle2 size={16} className="text-indigo-500 shrink-0" /> No Unauthorized Testing</div>
              <div className="flex items-center gap-3"><CheckCircle2 size={16} className="text-indigo-500 shrink-0" /> Original Content Protected</div>
              <div className="flex items-center gap-3"><CheckCircle2 size={16} className="text-indigo-500 shrink-0" /> No Implied Warranty</div>
            </div>
          </div>

          <div className="h-px w-full bg-surface my-12" />

          {/* MAIN SECTIONS */}
          <div className="space-y-24 text-muted leading-[1.8] text-[15px] md:text-[16px]">
            
            {/* 1. Website Purpose */}
            <section id="purpose" className="scroll-mt-32 relative group outline-none" tabIndex={-1}>
              <h2 className="text-[13px] font-mono uppercase tracking-[0.24em] text-foreground border-b border-surface pb-4 mb-8 flex items-center gap-3">
                <FileText size={18} className="text-indigo-500" /> 1. Website Purpose
                <button onClick={() => handleCopyLink('purpose')} className="opacity-0 group-hover:opacity-100 transition-opacity ml-auto text-muted hover:text-foreground focus:opacity-100 outline-none p-1 rounded-sm focus:ring-2 focus:ring-indigo-500/50" aria-label="Copy link to section">
                  {copiedLink === 'purpose' ? <CheckCircle2 size={16} className="text-emerald-500" /> : <LinkIcon size={16} />}
                </button>
              </h2>
              
              <div className="space-y-6">
                <p className="text-foreground/90 font-medium">This website is intended exclusively for the following operational capacities:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-[14px]">
                  <div className="flex items-center gap-3 p-4 border border-surface rounded-sm bg-surface/5"><CheckCircle2 size={16} className="text-indigo-500 shrink-0"/> Professional portfolio</div>
                  <div className="flex items-center gap-3 p-4 border border-surface rounded-sm bg-surface/5"><CheckCircle2 size={16} className="text-indigo-500 shrink-0"/> Educational content</div>
                  <div className="flex items-center gap-3 p-4 border border-surface rounded-sm bg-surface/5"><CheckCircle2 size={16} className="text-indigo-500 shrink-0"/> Security demonstrations</div>
                  <div className="flex items-center gap-3 p-4 border border-surface rounded-sm bg-surface/5"><CheckCircle2 size={16} className="text-indigo-500 shrink-0"/> Technical blogging</div>
                  <div className="flex items-center gap-3 p-4 border border-surface rounded-sm bg-surface/5"><CheckCircle2 size={16} className="text-indigo-500 shrink-0"/> Professional networking</div>
                </div>
                <div className="p-5 border-l-2 border-amber-500 bg-amber-500/5 text-foreground/80 font-medium rounded-r-md mt-6">
                  The website is not intended to provide professional legal, financial, or security consulting services unless explicitly agreed separately.
                </div>
              </div>
            </section>

            {/* 2. Acceptable Use Policy */}
            <section id="acceptable-use" className="scroll-mt-32 relative group outline-none" tabIndex={-1}>
              <h2 className="text-[13px] font-mono uppercase tracking-[0.24em] text-foreground border-b border-surface pb-4 mb-8 flex items-center gap-3">
                <ShieldCheck size={18} className="text-emerald-500" /> 2. Acceptable Use Policy
                <button onClick={() => handleCopyLink('acceptable-use')} className="opacity-0 group-hover:opacity-100 transition-opacity ml-auto text-muted hover:text-foreground focus:opacity-100 outline-none p-1 rounded-sm focus:ring-2 focus:ring-indigo-500/50">
                  {copiedLink === 'acceptable-use' ? <CheckCircle2 size={16} className="text-emerald-500" /> : <LinkIcon size={16} />}
                </button>
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="border border-emerald-500/20 bg-emerald-500/5 rounded-xl p-6 sm:p-8">
                  <h3 className="font-mono text-[11px] uppercase tracking-widest text-emerald-500 font-bold mb-6 flex items-center gap-2">Allowed Activities</h3>
                  <ul className="space-y-4 text-[14px] text-foreground/80">
                    <li className="flex items-start gap-3"><CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" /> Browse the website</li>
                    <li className="flex items-start gap-3"><CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" /> Read documentation</li>
                    <li className="flex items-start gap-3"><CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" /> Download public resources</li>
                    <li className="flex items-start gap-3"><CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" /> Contact the author</li>
                    <li className="flex items-start gap-3"><CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" /> Report vulnerabilities responsibly</li>
                  </ul>
                </div>
                
                <div className="border border-red-500/20 bg-red-500/5 rounded-xl p-6 sm:p-8">
                  <h3 className="font-mono text-[11px] uppercase tracking-widest text-red-500 font-bold mb-6 flex items-center gap-2">Not Allowed</h3>
                  <ul className="space-y-4 text-[14px] text-foreground/80">
                    <li className="flex items-start gap-3"><XCircle size={16} className="text-red-500 shrink-0 mt-0.5" /> Attempt unauthorized access</li>
                    <li className="flex items-start gap-3"><XCircle size={16} className="text-red-500 shrink-0 mt-0.5" /> Automated attacks or scanning</li>
                    <li className="flex items-start gap-3"><XCircle size={16} className="text-red-500 shrink-0 mt-0.5" /> DoS or volumetric testing</li>
                    <li className="flex items-start gap-3"><XCircle size={16} className="text-red-500 shrink-0 mt-0.5" /> Malware delivery</li>
                    <li className="flex items-start gap-3"><XCircle size={16} className="text-red-500 shrink-0 mt-0.5" /> Credential stuffing attacks</li>
                    <li className="flex items-start gap-3"><XCircle size={16} className="text-red-500 shrink-0 mt-0.5" /> Payload injection attempts</li>
                    <li className="flex items-start gap-3"><XCircle size={16} className="text-red-500 shrink-0 mt-0.5" /> Bypassing security controls</li>
                    <li className="flex items-start gap-3"><XCircle size={16} className="text-red-500 shrink-0 mt-0.5" /> Abusing contact forms</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* 3. Educational Disclaimer */}
            <section id="education" className="scroll-mt-32 relative group outline-none" tabIndex={-1}>
              <h2 className="text-[13px] font-mono uppercase tracking-[0.24em] text-foreground border-b border-surface pb-4 mb-8 flex items-center gap-3">
                <GraduationCap size={18} className="text-blue-500" /> 3. Educational Disclaimer
                <button onClick={() => handleCopyLink('education')} className="opacity-0 group-hover:opacity-100 transition-opacity ml-auto text-muted hover:text-foreground focus:opacity-100 outline-none p-1 rounded-sm focus:ring-2 focus:ring-indigo-500/50">
                  {copiedLink === 'education' ? <CheckCircle2 size={16} className="text-emerald-500" /> : <LinkIcon size={16} />}
                </button>
              </h2>
              <div className="bg-surface/5 border border-surface p-6 md:p-8 rounded-md">
                <p className="mb-4">Content discussing cybersecurity, networking, software engineering, offensive techniques, or defensive strategies is provided solely for educational and informational purposes.</p>
                <p className="text-foreground/90 font-medium">Nothing on this website should be interpreted as authorization to perform unauthorized testing or offensive activities against systems you do not own or have explicit, documented permission to assess.</p>
              </div>
            </section>

            {/* 4. Intellectual Property */}
            <section id="ip" className="scroll-mt-32 relative group outline-none" tabIndex={-1}>
              <h2 className="text-[13px] font-mono uppercase tracking-[0.24em] text-foreground border-b border-surface pb-4 mb-8 flex items-center gap-3">
                <Copyright size={18} className="text-purple-500" /> 4. Intellectual Property
                <button onClick={() => handleCopyLink('ip')} className="opacity-0 group-hover:opacity-100 transition-opacity ml-auto text-muted hover:text-foreground focus:opacity-100 outline-none p-1 rounded-sm focus:ring-2 focus:ring-indigo-500/50">
                  {copiedLink === 'ip' ? <CheckCircle2 size={16} className="text-emerald-500" /> : <LinkIcon size={16} />}
                </button>
              </h2>
              
              <div className="space-y-8">
                <div className="overflow-x-auto border border-surface rounded-md">
                  <table className="w-full text-left text-[14px] border-collapse bg-background">
                    <thead className="bg-surface/30">
                      <tr className="border-b border-surface text-muted font-mono text-[10px] uppercase tracking-[0.2em]">
                        <th className="py-3 px-6 font-semibold">Content</th>
                        <th className="py-3 px-6 font-semibold">Ownership / License</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-surface">
                      <tr className="hover:bg-surface/10 transition-colors">
                        <td className="py-4 px-6 text-foreground font-medium">Source Code</td>
                        <td className="py-4 px-6 text-muted">Jothish Gandham</td>
                      </tr>
                      <tr className="hover:bg-surface/10 transition-colors">
                        <td className="py-4 px-6 text-foreground font-medium">Portfolio Design</td>
                        <td className="py-4 px-6 text-muted">Jothish Gandham</td>
                      </tr>
                      <tr className="hover:bg-surface/10 transition-colors">
                        <td className="py-4 px-6 text-foreground font-medium">Written Articles</td>
                        <td className="py-4 px-6 text-muted">Jothish Gandham</td>
                      </tr>
                      <tr className="hover:bg-surface/10 transition-colors">
                        <td className="py-4 px-6 text-foreground font-medium">Images & Media</td>
                        <td className="py-4 px-6 text-muted">Original or Licensed</td>
                      </tr>
                      <tr className="hover:bg-surface/10 transition-colors">
                        <td className="py-4 px-6 text-foreground font-medium">Third-party Logos</td>
                        <td className="py-4 px-6 text-muted">Property of their respective owners (Fair Use)</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="p-5 border-l-2 border-indigo-500 bg-indigo-500/5 text-foreground/80 font-medium rounded-r-md">
                  You may reference this portfolio for educational or professional purposes, but you may not reproduce substantial portions of its original source code, branding, or written content without explicit permission or in accordance with its specific open-source license if provided.
                </div>
              </div>
            </section>

            {/* 5. Security & Testing */}
            <section id="security" className="scroll-mt-32 relative group outline-none" tabIndex={-1}>
              <h2 className="text-[13px] font-mono uppercase tracking-[0.24em] text-foreground border-b border-surface pb-4 mb-8 flex items-center gap-3">
                <Lock size={18} className="text-emerald-500" /> 5. Security & Responsible Testing
                <button onClick={() => handleCopyLink('security')} className="opacity-0 group-hover:opacity-100 transition-opacity ml-auto text-muted hover:text-foreground focus:opacity-100 outline-none p-1 rounded-sm focus:ring-2 focus:ring-indigo-500/50">
                  {copiedLink === 'security' ? <CheckCircle2 size={16} className="text-emerald-500" /> : <LinkIcon size={16} />}
                </button>
              </h2>
              
              <div className="bg-surface/10 border border-surface rounded-xl p-8 shadow-sm relative overflow-hidden">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
                  <div>
                    <h3 className="text-[16px] font-bold text-foreground mb-2">Security Research</h3>
                    <p className="text-[14px] text-muted max-w-md">I welcome responsible vulnerability reports from the community. A formal safe harbor policy is actively maintained.</p>
                  </div>
                  
                  <div className="flex flex-col gap-3 shrink-0">
                    <div className="flex items-center gap-2 text-[12px] font-mono uppercase tracking-widest text-emerald-500 font-bold">
                      <CheckCircle2 size={14} /> Safe Harbor Available
                    </div>
                    <div className="flex items-center gap-2 text-[12px] font-mono uppercase tracking-widest text-red-500 font-bold">
                      <XCircle size={14} /> Unauthorized Exploitation Prohibited
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-surface relative z-10">
                  <Link href="/responsible-disclosure" className="inline-flex items-center gap-2 px-6 py-3 bg-foreground text-background font-mono text-[11px] uppercase tracking-widest font-bold rounded-sm hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-foreground/50">
                    View Disclosure Policy <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </section>

            {/* 6. External Links */}
            <section id="external-links" className="scroll-mt-32 relative group outline-none" tabIndex={-1}>
              <h2 className="text-[13px] font-mono uppercase tracking-[0.24em] text-foreground border-b border-surface pb-4 mb-8 flex items-center gap-3">
                <Globe size={18} className="text-blue-500" /> 6. External Links
                <button onClick={() => handleCopyLink('external-links')} className="opacity-0 group-hover:opacity-100 transition-opacity ml-auto text-muted hover:text-foreground focus:opacity-100 outline-none p-1 rounded-sm focus:ring-2 focus:ring-indigo-500/50">
                  {copiedLink === 'external-links' ? <CheckCircle2 size={16} className="text-emerald-500" /> : <LinkIcon size={16} />}
                </button>
              </h2>
              <p>This website may contain links to third-party websites, code repositories, certification validation portals, or social platforms. I am not responsible for the content, privacy practices, or availability of those external services.</p>
            </section>

            {/* 7. No Warranty */}
            <section id="warranty" className="scroll-mt-32 relative group outline-none" tabIndex={-1}>
              <h2 className="text-[13px] font-mono uppercase tracking-[0.24em] text-foreground border-b border-surface pb-4 mb-8 flex items-center gap-3">
                <AlertTriangle size={18} className="text-amber-500" /> 7. No Warranty
                <button onClick={() => handleCopyLink('warranty')} className="opacity-0 group-hover:opacity-100 transition-opacity ml-auto text-muted hover:text-foreground focus:opacity-100 outline-none p-1 rounded-sm focus:ring-2 focus:ring-indigo-500/50">
                  {copiedLink === 'warranty' ? <CheckCircle2 size={16} className="text-emerald-500" /> : <LinkIcon size={16} />}
                </button>
              </h2>
              <div className="p-8 md:p-10 bg-amber-500/5 border border-amber-500/20 rounded-xl text-center flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center mb-6">
                  <AlertTriangle size={24} className="text-amber-500" />
                </div>
                <h3 className="font-mono text-[12px] uppercase tracking-[0.24em] text-amber-500 font-bold mb-4">Notice</h3>
                <p className="text-[16px] md:text-[18px] text-foreground/90 font-medium max-w-lg leading-relaxed">
                  This website is provided &quot;as is&quot; without warranties of any kind. Availability, accuracy, and uninterrupted service cannot be guaranteed.
                </p>
              </div>
            </section>

            {/* 8. Limitation of Liability */}
            <section id="liability" className="scroll-mt-32 relative group outline-none" tabIndex={-1}>
              <h2 className="text-[13px] font-mono uppercase tracking-[0.24em] text-foreground border-b border-surface pb-4 mb-8 flex items-center gap-3">
                <Scale size={18} className="text-purple-500" /> 8. Limitation of Liability
                <button onClick={() => handleCopyLink('liability')} className="opacity-0 group-hover:opacity-100 transition-opacity ml-auto text-muted hover:text-foreground focus:opacity-100 outline-none p-1 rounded-sm focus:ring-2 focus:ring-indigo-500/50">
                  {copiedLink === 'liability' ? <CheckCircle2 size={16} className="text-emerald-500" /> : <LinkIcon size={16} />}
                </button>
              </h2>
              <p>To the fullest extent permitted by applicable law, the author shall not be liable for indirect, incidental, special, or consequential damages arising from the use of this website or its content.</p>
            </section>

            {/* 9. Termination */}
            <section id="termination" className="scroll-mt-32 relative group outline-none" tabIndex={-1}>
              <h2 className="text-[13px] font-mono uppercase tracking-[0.24em] text-foreground border-b border-surface pb-4 mb-8 flex items-center gap-3">
                <Ban size={18} className="text-red-500" /> 9. Termination
                <button onClick={() => handleCopyLink('termination')} className="opacity-0 group-hover:opacity-100 transition-opacity ml-auto text-muted hover:text-foreground focus:opacity-100 outline-none p-1 rounded-sm focus:ring-2 focus:ring-indigo-500/50">
                  {copiedLink === 'termination' ? <CheckCircle2 size={16} className="text-emerald-500" /> : <LinkIcon size={16} />}
                </button>
              </h2>
              <div className="bg-surface/5 border border-surface p-6 rounded-md">
                <p className="mb-4">Abusive or malicious activity may result in temporary or permanent access restrictions, including rate limiting or blocking, where appropriate. Triggers may include:</p>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3 text-[14px] text-foreground/80"><span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" /> Abusing interactive systems or APIs</li>
                  <li className="flex items-center gap-3 text-[14px] text-foreground/80"><span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" /> Attempting unauthorized access</li>
                  <li className="flex items-center gap-3 text-[14px] text-foreground/80"><span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" /> Performing denial-of-service attacks</li>
                  <li className="flex items-center gap-3 text-[14px] text-foreground/80"><span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" /> Repeatedly violating these Terms</li>
                </ul>
              </div>
            </section>

            {/* 10. Jurisdiction */}
            <section id="jurisdiction" className="scroll-mt-32 relative group outline-none" tabIndex={-1}>
              <h2 className="text-[13px] font-mono uppercase tracking-[0.24em] text-foreground border-b border-surface pb-4 mb-8 flex items-center gap-3">
                <MapPin size={18} className="text-blue-500" /> 10. Applicable Law
                <button onClick={() => handleCopyLink('jurisdiction')} className="opacity-0 group-hover:opacity-100 transition-opacity ml-auto text-muted hover:text-foreground focus:opacity-100 outline-none p-1 rounded-sm focus:ring-2 focus:ring-indigo-500/50">
                  {copiedLink === 'jurisdiction' ? <CheckCircle2 size={16} className="text-emerald-500" /> : <LinkIcon size={16} />}
                </button>
              </h2>
              <p>These Terms & Conditions are governed by the applicable laws of the jurisdiction in which the website owner resides (Andhra Pradesh, India), unless otherwise required by applicable law.</p>
            </section>

            {/* 11. Changes */}
            <section id="changes" className="scroll-mt-32 relative group outline-none" tabIndex={-1}>
              <h2 className="text-[13px] font-mono uppercase tracking-[0.24em] text-foreground border-b border-surface pb-4 mb-8 flex items-center gap-3">
                <RefreshCw size={18} className="text-amber-500" /> 11. Changes to Terms
                <button onClick={() => handleCopyLink('changes')} className="opacity-0 group-hover:opacity-100 transition-opacity ml-auto text-muted hover:text-foreground focus:opacity-100 outline-none p-1 rounded-sm focus:ring-2 focus:ring-indigo-500/50">
                  {copiedLink === 'changes' ? <CheckCircle2 size={16} className="text-emerald-500" /> : <LinkIcon size={16} />}
                </button>
              </h2>
              <div className="border border-surface bg-background rounded-md p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center gap-6 justify-between">
                <div>
                  <p className="text-foreground/90 font-medium mb-2">These Terms may be updated periodically.</p>
                  <p className="text-[14px]">Continued use of the website constitutes acceptance of the updated Terms.</p>
                </div>
                <div className="shrink-0 flex items-center gap-2 bg-surface/20 border border-surface px-4 py-2 rounded-sm">
                  <Clock size={14} className="text-muted" />
                  <span className="text-[11px] font-mono uppercase tracking-widest text-foreground">Last Updated: Aug 2026</span>
                </div>
              </div>
            </section>

            {/* 12. Contact */}
            <section id="contact" className="scroll-mt-32 relative group outline-none" tabIndex={-1}>
              <h2 className="text-[13px] font-mono uppercase tracking-[0.24em] text-foreground border-b border-surface pb-4 mb-8 flex items-center gap-3">
                <Mail size={18} className="text-indigo-500" /> 12. Contact Information
                <button onClick={() => handleCopyLink('contact')} className="opacity-0 group-hover:opacity-100 transition-opacity ml-auto text-muted hover:text-foreground focus:opacity-100 outline-none p-1 rounded-sm focus:ring-2 focus:ring-indigo-500/50">
                  {copiedLink === 'contact' ? <CheckCircle2 size={16} className="text-emerald-500" /> : <LinkIcon size={16} />}
                </button>
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="bg-surface/5 border border-surface p-6 rounded-md">
                  <h3 className="font-mono text-[10px] uppercase tracking-widest text-muted mb-4">Legal Contact</h3>
                  <p className="text-[13px] text-foreground font-medium break-all">gandhamjothish1@gmail.com</p>
                </div>
                <div className="bg-surface/5 border border-surface p-6 rounded-md">
                  <h3 className="font-mono text-[10px] uppercase tracking-widest text-muted mb-4">Security Reporting</h3>
                  <Link href="/responsible-disclosure" className="text-[13px] text-emerald-500 hover:text-emerald-400 font-medium flex items-center gap-1.5 transition-colors">
                    Responsible Disclosure <ArrowRight size={12} />
                  </Link>
                </div>
                <div className="bg-surface/5 border border-surface p-6 rounded-md">
                  <h3 className="font-mono text-[10px] uppercase tracking-widest text-muted mb-4">Privacy Questions</h3>
                  <Link href="/privacy-policy" className="text-[13px] text-indigo-500 hover:text-indigo-400 font-medium flex items-center gap-1.5 transition-colors">
                    Privacy Policy <ArrowRight size={12} />
                  </Link>
                </div>
              </div>
            </section>

          </div>
        </main>
      </div>
    </div>
  );
}