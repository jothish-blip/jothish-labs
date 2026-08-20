"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { skillDomains } from "./data";
import { Check, ArrowRight, Search, FileText, Award } from "lucide-react";
import SkillCard from "./SkillCard";
import SkillChip from "./SkillChip";
import { SkillItem } from "./types";

const INITIAL_DOMAINS_MOBILE = 4;

// 6. HELPER: Categorize Technologies for the "Documentation" feel
const categorizeTech = (techs: SkillItem[]) => {
  const categories: Record<string, SkillItem[]> = {
    Languages: [],
    Frameworks: [],
    Platforms: [],
    Tools: []
  };

  techs.forEach(t => {
    const n = t.name.toLowerCase();
    if (['python', 'bash', 'powershell', 'go', 'javascript', 'sql', 'c++', 'rust'].includes(n)) {
      categories.Languages.push(t);
    } else if (['aws', 'azure', 'gcp', 'docker', 'kubernetes', 'linux', 'windows'].includes(n)) {
      categories.Platforms.push(t);
    } else if (['metasploit', 'burp', 'splunk', 'impacket', 'nmap', 'wireshark', 'suricata'].some(k => n.includes(k))) {
      categories.Frameworks.push(t);
    } else {
      categories.Tools.push(t);
    }
  });

  // Remove empty categories
  return Object.entries(categories).filter(([_, items]) => items.length > 0);
};

export default function SkillsSection() {
  const [mounted, setMounted] = useState(false);
  
  // Mobile State
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showAllMobile, setShowAllMobile] = useState(false);
  
  // Desktop State
  const [searchQuery, setSearchQuery] = useState("");
  const [activeDomainId, setActiveDomainId] = useState<string>(skillDomains[0].id);
  const [hoveredDomainId, setHoveredDomainId] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 7. Search Logic
  const filteredDomains = skillDomains.filter(d => 
    d.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    d.technologies.some(t => t.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const activeDomain = skillDomains.find(d => d.id === activeDomainId) || skillDomains[0];

  // 8. Keyboard Navigation (VS Code Style)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only process if user is focused inside the window and not in an input
      if (document.activeElement?.tagName === "INPUT") return;
      
      const currentIndex = filteredDomains.findIndex(d => d.id === activeDomainId);
      
      if (e.key === "ArrowDown") {
        e.preventDefault();
        if (currentIndex < filteredDomains.length - 1) {
          setActiveDomainId(filteredDomains[currentIndex + 1].id);
        }
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        if (currentIndex > 0) {
          setActiveDomainId(filteredDomains[currentIndex - 1].id);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeDomainId, filteredDomains]);

  const totalSkills = skillDomains.reduce((acc, domain) => acc + domain.coreSkills.length, 0);
  const totalTech = skillDomains.reduce((acc, domain) => acc + domain.technologies.length, 0);

  const visibleMobileDomains = showAllMobile 
    ? skillDomains 
    : skillDomains.slice(0, INITIAL_DOMAINS_MOBILE);

  return (
    <section id="skills" className="border-t border-surface pt-14 pb-32 max-w-7xl mx-auto flex flex-col gap-12 px-6 md:px-8 relative min-h-screen">
      
      <style>{`
        .skill-nav-btn:hover {
          background-color: color-mix(in srgb, var(--accent-skills) 5%, transparent);
        }
        .view-more-skills:hover {
          border-color: color-mix(in srgb, var(--accent-skills) 50%, transparent) !important;
          color: var(--accent-skills) !important;
        }
        /* Custom scrollbar for the right panel */
        .doc-scrollbar::-webkit-scrollbar { width: 6px; }
        .doc-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .doc-scrollbar::-webkit-scrollbar-thumb { background: var(--surface-strong); border-radius: 4px; }
        .doc-scrollbar:hover::-webkit-scrollbar-thumb { background: var(--muted); }
      `}</style>
      
      {/* 19. BETTER HEADER */}
      <header className="relative mx-auto w-full max-w-4xl text-center space-y-5 py-8 flex flex-col items-center">
        <div className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center overflow-hidden">
          <div 
            className="w-[300px] h-[150px] md:w-[600px] md:h-[200px] blur-[80px] rounded-[100%] opacity-30 mix-blend-screen"
            style={{ backgroundColor: 'var(--accent-skills)' }}
          ></div>
          <div className="absolute inset-0 opacity-[0.02] bg-[radial-gradient(circle,currentColor_1px,transparent_1px)] bg-[size:12px_12px]"></div>
        </div>

        <div className="relative z-10 space-y-4 flex flex-col items-center">
          <p className="font-mono text-[9px] tracking-[0.4em] uppercase" style={{ color: 'var(--accent-skills)' }}>
            {"// Technical Expertise"}
          </p>

          <h2 className="text-3xl md:text-5xl font-semibold tracking-tight leading-[1.1] text-foreground uppercase">
            Explore how I design, <br />
            <span className="text-muted italic font-light">secure and automate systems.</span>
          </h2>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2 font-mono text-[9px] tracking-[0.24em] uppercase text-muted">
            <span className="px-3 py-1.5 border border-surface bg-surface/20 rounded-sm">{skillDomains.length} Domains</span>
            <span className="px-3 py-1.5 border border-surface bg-surface/20 rounded-sm">{totalTech} Technologies</span>
            <span className="px-3 py-1.5 border border-surface bg-surface/20 rounded-sm">{totalSkills} Competencies</span>
          </div>

          <div className="w-12 h-[1px] my-2 opacity-50" style={{ backgroundColor: 'var(--accent-skills)' }} />
        </div>
      </header>

      {/* ========================================== */}
      {/* MOBILE LAYOUT (ACCORDION)                  */}
      {/* ========================================== */}
      <div className="block lg:hidden space-y-4 relative z-10">
        {visibleMobileDomains.map((domain, index) => (
          <motion.div
            key={domain.id}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <SkillCard 
              domain={domain}
              isExpanded={expandedId === domain.id}
              onToggle={() => setExpandedId(prev => prev === domain.id ? null : domain.id)}
            />
          </motion.div>
        ))}

        {skillDomains.length > INITIAL_DOMAINS_MOBILE && (
          <div className="mt-6 flex justify-center">
            <button
              onClick={() => setShowAllMobile(!showAllMobile)}
              className="view-more-skills px-6 py-3 border border-surface bg-surface/10 rounded-sm text-[10px] font-mono uppercase tracking-[0.24em] text-muted transition-all duration-300"
            >
              {showAllMobile ? "Show Less" : "View More Skills"}
            </button>
          </div>
        )}
      </div>

      {/* ========================================== */}
      {/* DESKTOP LAYOUT (VS CODE / DOCS STYLE)      */}
      {/* ========================================== */}
      <div className="hidden lg:grid grid-cols-12 gap-6 items-start relative z-10 max-w-7xl mx-auto w-full">
        
        {/* LEFT NAV (VS Code Explorer Style) */}
        <div className="col-span-4 flex flex-col sticky top-32 h-[calc(100vh-150px)]">
          
          {/* 7. Search Bar */}
          <div className="relative mb-6">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input 
              type="text" 
              placeholder="Search skills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-background border border-surface border-b-surface-strong focus:border-[var(--accent-skills)] outline-none rounded-sm py-2.5 pl-9 pr-4 text-[12px] font-mono text-foreground placeholder:text-muted transition-colors"
            />
          </div>

          <div className="flex-1 overflow-y-auto doc-scrollbar pr-2 space-y-1 pb-10">
            <div className="text-[9px] font-mono uppercase tracking-[0.24em] text-muted mb-4 pl-2 font-bold">
              Explorer
            </div>
            
            {filteredDomains.map((domain, idx) => {
              const isActive = activeDomainId === domain.id;
              
              return (
                <button
                  key={domain.id}
                  onClick={() => setActiveDomainId(domain.id)}
                  onMouseEnter={() => setHoveredDomainId(domain.id)}
                  onMouseLeave={() => setHoveredDomainId(null)}
                  className={`group w-full flex items-center justify-between px-2 py-2.5 rounded-sm transition-all duration-200 outline-none ${
                    isActive ? "bg-surface/40" : "hover:bg-surface/20"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {/* 2 & 3. Folder / Active Dot Indicators */}
                    <span className="w-4 flex justify-center text-muted">
                      {isActive ? (
                        <motion.span 
                          layoutId="active-dot"
                          initial={{ scale: 0.8 }}
                          animate={{ scale: 1 }}
                          className="w-1.5 h-1.5 rounded-full" 
                          style={{ backgroundColor: 'var(--accent-skills)', boxShadow: '0 0 8px var(--accent-skills)' }} 
                        />
                      ) : (
                        <span className="text-[10px]">▸</span>
                      )}
                    </span>
                    
                    {/* 16. Nav Counter & Title */}
                    <span className="font-mono text-[10px] text-muted/50">
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    
                    <span className={`text-[13px] tracking-tight transition-transform duration-200 ${isActive ? "text-foreground font-semibold" : "text-muted group-hover:text-foreground group-hover:translate-x-1"}`}>
                      {domain.title}
                    </span>
                  </div>
                </button>
              );
            })}

            {filteredDomains.length === 0 && (
              <div className="text-[11px] text-muted font-mono pl-6 pt-4">No matching domains.</div>
            )}
          </div>
        </div>

        {/* RIGHT PANEL (Documentation Style) */}
        <div className="col-span-8 h-[calc(100vh-150px)]">
          {/* 15. Hover Preview via conditional border color */}
          <div 
            className="flex flex-col h-full bg-background border rounded-md shadow-2xl overflow-hidden transition-colors duration-500 relative"
            style={{ borderColor: hoveredDomainId || activeDomainId ? 'color-mix(in srgb, var(--accent-skills) 30%, var(--border))' : 'var(--border)' }}
          >
            {/* 13. Tiny Background Pattern */}
            <div className="absolute inset-0 z-0 opacity-5 bg-[radial-gradient(circle,currentColor_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />

            {/* Panel Inner Scroll Area */}
            <div className="flex-1 overflow-y-auto doc-scrollbar relative z-10">
              
              {/* 9. Slide Transitions */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeDomain.id}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="pb-16"
                >
                  
                  {/* 21 & 14 & 5. HERO BANNER INSIDE PANEL */}
                  <div className="relative px-10 py-12 border-b border-surface overflow-hidden bg-surface/5">
                    {/* Accent Glow Background */}
                    <div className="absolute inset-0 opacity-[0.15] mix-blend-screen" style={{ background: 'linear-gradient(135deg, var(--accent-skills), transparent)' }} />
                    
                    <div className="relative z-10 flex flex-col gap-4">
                      <div className="flex items-center gap-3">
                        <activeDomain.icon size={20} className="text-[var(--accent-skills)]" />
                        <h3 
                          className="text-3xl font-bold uppercase tracking-tight text-foreground"
                          style={{ textShadow: '0 0 30px color-mix(in srgb, var(--accent-skills) 50%, transparent)' }}
                        >
                          {activeDomain.title}
                        </h3>
                      </div>
                      
                      <p className="text-[14px] text-muted max-w-2xl leading-relaxed">
                        {activeDomain.description}
                      </p>

                      {/* 17. Mini Statistics */}
                      <div className="flex gap-10 mt-6 pt-6 border-t border-surface/50">
                        <div>
                          <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted mb-1">Core</p>
                          <p className="text-2xl font-bold text-foreground">{String(activeDomain.coreSkills.length).padStart(2, '0')}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted mb-1">Tools</p>
                          <p className="text-2xl font-bold text-foreground">{String(activeDomain.technologies.length).padStart(2, '0')}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted mb-1">Updated</p>
                          <p className="text-2xl font-bold text-foreground">2026</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 4. DOCUMENTATION STYLE SECTIONS */}
                  <div className="px-10 py-8 space-y-12">
                    
                    {/* Core Competencies */}
                    <section>
                      <h4 className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted mb-6 pb-2 border-b border-surface">
                        Core Competencies
                      </h4>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {activeDomain.coreSkills.map((skill, i) => (
                          <motion.li 
                            key={skill}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="flex items-start gap-3 text-[13px] text-foreground/90 font-medium"
                          >
                            <Check size={16} style={{ color: 'var(--accent-skills)' }} className="shrink-0 mt-0.5" />
                            <span className="leading-relaxed">{skill}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </section>

                    {/* 6. ORGANIZED TOOLKIT */}
                    <section>
                      <h4 className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted mb-6 pb-2 border-b border-surface">
                        Toolkit
                      </h4>
                      <div className="space-y-8">
                        {categorizeTech(activeDomain.technologies).map(([category, techs], catIdx) => (
                          <div key={category}>
                            <h5 className="text-[11px] font-semibold uppercase tracking-widest text-foreground/70 mb-4">
                              {category}
                            </h5>
                            {/* 10. ANIMATED SKILL CHIPS */}
                            <motion.div 
                              className="flex flex-wrap gap-2"
                              initial="hidden"
                              animate="show"
                              variants={{
                                hidden: {},
                                show: { transition: { staggerChildren: 0.04, delayChildren: catIdx * 0.1 } }
                              }}
                            >
                              {techs.map((tech) => (
                                <motion.div 
                                  key={tech.name}
                                  variants={{
                                    hidden: { opacity: 0, scale: 0.9, y: 10 },
                                    show: { opacity: 1, scale: 1, y: 0 }
                                  }}
                                >
                                  <SkillChip skill={tech} />
                                </motion.div>
                              ))}
                            </motion.div>
                          </div>
                        ))}
                      </div>
                    </section>

                    {/* 12 & 18. RELATED WORK & CERTIFICATIONS (Mocked based on domain context) */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-8">
                      <section>
                        <h4 className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted mb-4 pb-2 border-b border-surface">
                          Related Work
                        </h4>
                        <div className="space-y-2">
                          <a href="#projects" className="flex items-center gap-3 p-3 rounded-sm border border-surface bg-surface/10 hover:bg-surface/30 transition-colors group">
                            <FileText size={14} className="text-muted group-hover:text-foreground" />
                            <span className="text-[12px] font-medium transition-colors group-hover:text-[var(--accent-skills)]">Threat Detection Platform</span>
                          </a>
                          <a href="#projects" className="flex items-center gap-3 p-3 rounded-sm border border-surface bg-surface/10 hover:bg-surface/30 transition-colors group">
                            <FileText size={14} className="text-muted group-hover:text-foreground" />
                            <span className="text-[12px] font-medium transition-colors group-hover:text-[var(--accent-skills)]">Active Directory Lab</span>
                          </a>
                        </div>
                      </section>

                      <section>
                        <h4 className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted mb-4 pb-2 border-b border-surface">
                          Related Certifications
                        </h4>
                        <div className="space-y-2">
                          <div className="flex items-center gap-3 p-3 rounded-sm border border-surface bg-surface/10">
                            <Award size={14} className="text-muted" style={{ color: 'var(--accent-skills)' }} />
                            <span className="text-[12px] font-medium">Google Cybersecurity Professional</span>
                          </div>
                          <div className="flex items-center gap-3 p-3 rounded-sm border border-surface bg-surface/10">
                            <Award size={14} className="text-muted" style={{ color: 'var(--accent-skills)' }} />
                            <span className="text-[12px] font-medium">CompTIA Security+ (In Progress)</span>
                          </div>
                        </div>
                      </section>
                    </div>

                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

      </div>

    </section>
  );
}