"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal, Database, Activity, Radio, ChevronRight, Zap, Monitor } from "lucide-react";

// --- GROUPED CORE ASSETS ---
const skillGroups = [
  {
    title: "PACKET ANALYSIS",
    items: [
      {
        id: "MOD-WSH",
        name: "Wireshark",
        category: "PACKET_ANALYSIS",
        icon: Activity,
        color: "text-[var(--success)]",
        pulse: "bg-[var(--success)]",
        iconBorder: "border-[var(--success)]/20",
        capBorder: "border-[var(--success)]/30",
        hoverBorder: "border-[var(--success)]/30",
        hoverBg: "bg-[var(--success)]/10",
        activeBorder: "border-[var(--success)]/50",
        activeBg: "bg-surface-strong",
        status: "LEARNING / IN USE",
        desc: "Packet inspection and protocol analysis to understand network traffic.",
        capabilities: ["Packet Filtering", "Protocol Inspection", "Traffic Flow Analysis"],
        terminalSnippet: "ip.addr == 192.168.1.100 && tcp.port == 443",
        terminalOutput: "14 packets captured",
        expandText: "Used in DNS failure analysis to trace UDP requests and identify returning ICMP unreachable errors."
      },
      {
        id: "MOD-TCP",
        name: "tcpdump",
        category: "NETWORK_RECON",
        icon: Radio,
        color: "text-[var(--danger)]",
        pulse: "bg-[var(--danger)]",
        iconBorder: "border-[var(--danger)]/20",
        capBorder: "border-[var(--danger)]/30",
        hoverBorder: "border-[var(--danger)]/30",
        hoverBg: "bg-[var(--danger)]/10",
        activeBorder: "border-[var(--danger)]/50",
        activeBg: "bg-surface-strong",
        status: "LEARNING / IN USE",
        desc: "CLI network traffic capture for lightweight logging and live monitoring.",
        capabilities: ["Packet Capture", "Traffic Inspection", "Headless Monitoring"],
        terminalSnippet: "tcpdump -i eth0 -n",
        terminalOutput: "listening on eth0, link-type EN10MB",
        expandText: "Deployed to capture raw packet data from terminal environments for rapid network troubleshooting."
      }
    ]
  },
  {
    title: "OPERATING SYSTEM",
    items: [
      {
        id: "MOD-LNX",
        name: "Linux",
        category: "SYSTEM_ENVIRONMENT",
        icon: Terminal,
        color: "text-[var(--accent)]",
        pulse: "bg-[var(--accent)]",
        iconBorder: "border-[var(--accent)]/20",
        capBorder: "border-[var(--accent)]/30",
        hoverBorder: "border-[var(--accent)]/30",
        hoverBg: "bg-[var(--accent-soft)]",
        activeBorder: "border-[var(--accent)]/50",
        activeBg: "bg-surface-strong",
        status: "LEARNING / IN USE",
        desc: "CLI usage for file management, environment configuration, and permission control.",
        capabilities: ["Permission Hardening", "CLI Navigation", "Basic Scripting"],
        terminalSnippet: "chmod 700 private_dir",
        terminalOutput: "permissions updated",
        expandText: "Applied in system audits to restrict directory access and enforce the Principle of Least Privilege."
      },
      {
        id: "MOD-WIN",
        name: "Windows",
        category: "SYSTEM_ENVIRONMENT",
        icon: Monitor,
        color: "text-[var(--accent)]",
        pulse: "bg-[var(--accent)]",
        iconBorder: "border-[var(--accent)]/20",
        capBorder: "border-[var(--accent)]/30",
        hoverBorder: "border-[var(--accent)]/30",
        hoverBg: "bg-[var(--accent-soft)]",
        activeBorder: "border-[var(--accent)]/50",
        activeBg: "bg-surface-strong",
        status: "LEARNING / IN USE",
        desc: "Using PowerShell and WSL to run Linux-style workflows natively.",
        capabilities: ["PowerShell", "WSL Integration", "Process Management"],
        terminalSnippet: "wsl --install",
        terminalOutput: "Ubuntu has been installed.",
        expandText: "Serves as the main working environment, bridging the gap between Windows GUI and Linux command-line tools."
      }
    ]
  },
  {
    title: "DATABASE",
    items: [
      {
        id: "MOD-SQL",
        name: "SQL",
        category: "DATA_INVESTIGATION",
        icon: Database,
        color: "text-[var(--warning)]",
        pulse: "bg-[var(--warning)]",
        iconBorder: "border-[var(--warning)]/20",
        capBorder: "border-[var(--warning)]/30",
        hoverBorder: "border-[var(--warning)]/30",
        hoverBg: "bg-[var(--warning)]/10",
        activeBorder: "border-[var(--warning)]/50",
        activeBg: "bg-surface-strong",
        status: "LEARNING / IN USE",
        desc: "Database querying for log filtering and identifying behavioral patterns.",
        capabilities: ["Log Filtering", "Data Correlation", "Pattern Identification"],
        terminalSnippet: "SELECT * FROM log_in_attempts WHERE success = 0;",
        terminalOutput: "3 rows returned",
        expandText: "Used heavily to parse authentication logs, track anomalies across dates, and correlate geolocation data."
      }
    ]
  }
];

// Flatten IDs for keyboard navigation
const allSkillIds = skillGroups.flatMap(group => group.items.map(item => item.id));

export default function Skills() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isSectionHovered, setIsSectionHovered] = useState(false);

  // Keyboard Navigation (Scoped to section hover)
  useEffect(() => {
    if (!isSectionHovered) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const currentIndex = hoveredId ? allSkillIds.indexOf(hoveredId) : -1;

      if (e.key === "ArrowDown" || e.key === "ArrowRight") {
        e.preventDefault();
        const nextIndex = (currentIndex + 1) % allSkillIds.length;
        setHoveredId(allSkillIds[nextIndex]);
      }
      if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
        e.preventDefault();
        const prevIndex = (currentIndex - 1 + allSkillIds.length) % allSkillIds.length;
        setHoveredId(allSkillIds[prevIndex]);
      }
      if (e.key === "Enter" && hoveredId) {
        e.preventDefault();
        setActiveId(prev => prev === hoveredId ? null : hoveredId);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [hoveredId, isSectionHovered]);

  return (
    <>
      {/* 3. Dark / Light Mode Global Tokens */}
      <style jsx global>{`
        :root {
          --accent: #0891b2;
          --accent-soft: rgba(8, 145, 178, 0.08);
          --success: #059669;
          --warning: #d97706;
          --danger: #dc2626;
        }
        html.dark {
          --accent: #22d3ee;
          --accent-soft: rgba(34, 211, 238, 0.1);
          --success: #10b981;
          --warning: #f59e0b;
          --danger: #ef4444;
        }
      `}</style>

      {/* 6. Mobile UX Fixes: Standardized Padding */}
      <section 
        id="skills" 
        onMouseEnter={() => setIsSectionHovered(true)}
        onMouseLeave={() => setIsSectionHovered(false)}
        className="relative min-h-screen w-full bg-background text-foreground pt-24 sm:pt-28 md:pt-32 pb-24 px-4 sm:px-6 md:px-12 lg:px-24 overflow-hidden border-t border-surface"
      >
        
        {/* 7. Background Issues Fixed for Light Mode */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/5 dark:to-black/60 pointer-events-none z-[1]"></div>
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.02] pointer-events-none bg-[radial-gradient(circle,currentColor_1px,transparent_1px)] bg-[size:40px_40px]"></div>

        <div className="relative z-10 max-w-4xl mx-auto">
          
          <div className="mb-16 space-y-5">
            <div className="flex items-center justify-between">
              {/* 5. Header Cleanup: Removed Fake System Words */}
              <div className="flex items-center gap-3">
                <Zap size={14} className="text-[var(--accent)]" />
                <span className="font-mono text-[10px] tracking-widest text-[var(--accent)] uppercase">Skills</span>
              </div>
              
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-[9px] font-mono text-muted tracking-widest border border-surface px-3 py-1.5 bg-surface-strong rounded-sm">
                <div className="flex gap-4">
                  <span>Modules: {String(allSkillIds.length).padStart(2, '0')}</span>
                  <span>Status: Active</span>
                </div>
                {/* 1. Broken Characters Fixed */}
                <span className="hidden sm:inline-block border-l border-surface pl-4 text-muted">
                  [↑] [↓] Navigate • [Enter] Inspect
                </span>
              </div>
            </div>
            
            <div className="space-y-3">
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter uppercase leading-[0.8]">
                Technical <span className="text-muted italic font-light">Skills.</span>
              </h2>
              <p className="font-mono text-[10px] text-muted tracking-widest uppercase">
                Currently working with these tools
              </p>
            </div>
            
            <div className="space-y-2">
              <p className="text-muted/90 text-[13px] sm:text-sm max-w-md leading-relaxed">
                These are the tools I actively use while learning and building security-focused projects. Focused on establishing strong fundamentals in system security and network analysis.
              </p>
              {/* 1. Broken Characters Fixed */}
              <p className="text-[11px] font-mono text-muted pt-2">
                <span className="hidden sm:inline">Hover to explore • Click to inspect</span>
                <span className="sm:hidden">Tap to inspect</span>
              </p>
            </div>
          </div>

          {!activeId && (
            <p className="text-[11px] text-muted font-mono mb-6 uppercase tracking-widest animate-pulse">
              {`>`} Select a module to initialize inspection
            </p>
          )}

          <div className="space-y-12">
            {skillGroups.map((group, groupIndex) => (
              <div key={groupIndex} className="space-y-5">
                
                <div className="flex items-center gap-4">
                  <div className="h-px flex-1 bg-surface-strong" />
                  <span className="font-mono text-[10px] text-muted tracking-widest uppercase">
                    {group.title} ({String(group.items.length).padStart(2, '0')})
                  </span>
                  <div className="h-px flex-1 bg-surface-strong" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                  {group.items.map((skill, index) => {
                    const Icon = skill.icon;
                    const isHovered = hoveredId === skill.id;
                    const isActive = activeId === skill.id;

                    return (
                      <motion.div
                        key={skill.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        onMouseEnter={() => setHoveredId(skill.id)}
                        onMouseLeave={() => setHoveredId(null)}
                        onClick={() => setActiveId(isActive ? null : skill.id)}
                        // 4 & 9. Reduced Over-Designed Effects, Added Click/Hover Feedback
                        // 6. Mobile UX: Adjusted min-height
                        className={`group relative border p-6 flex flex-col justify-between transition-all duration-300 hover:-translate-y-[2px] cursor-pointer min-h-[260px] sm:min-h-[280px] active:scale-[0.98] ${
                          isActive ? `${skill.activeBorder} ${skill.activeBg}` : `bg-surface border-surface hover:bg-surface-strong/80 hover:border-muted/30`
                        } ${isHovered && !isActive ? "scale-[1.01]" : "scale-100"}`}
                      >
                        
                        <div className="flex justify-between items-start mb-6">
                          <div className={`p-3 border rounded-sm transition-colors duration-500 ${
                            isActive || isHovered ? `bg-surface-strong ${skill.iconBorder}` : "bg-surface-strong border-surface"
                          }`}>
                            <Icon size={24} className={`transition-colors duration-500 ${isActive || isHovered ? skill.color : "text-muted"}`} />
                          </div>
                          <div className="flex flex-col items-end gap-1">
                            {/* 2. Removed Fake System Words */}
                            <span className="font-mono text-[9px] text-muted tracking-widest uppercase">ID: {skill.id}</span>
                            <span className={`font-mono text-[8px] px-2 py-0.5 border uppercase tracking-widest transition-colors duration-500 ${
                              isActive || isHovered ? `${skill.hoverBorder} ${skill.color} ${skill.hoverBg}` : "border-surface text-muted"
                            }`}>
                              {skill.status}
                            </span>
                          </div>
                        </div>

                        <div className="space-y-4 mb-8">
                          <div>
                            <h3 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight uppercase mb-1">
                              {skill.name}
                            </h3>
                            {/* 8. Text Hierarchy Fix */}
                            <p className={`font-mono text-[10px] tracking-widest uppercase transition-colors duration-500 ${isActive || isHovered ? skill.color : "text-muted"}`}>
                              {skill.category}
                            </p>
                          </div>
                          <p className="text-[13px] text-muted/90 leading-relaxed max-w-sm">
                            {skill.desc}
                          </p>
                        </div>

                        <div className="space-y-6 mt-auto">
                          
                          <div className="flex justify-between items-end">
                            <div className="flex flex-wrap gap-2">
                              {skill.capabilities.map((cap, i) => (
                                <span key={i} className={`text-[9px] font-mono bg-surface border px-2 py-1 uppercase tracking-wider transition-colors duration-300 ${
                                  isActive ? `${skill.capBorder} ${skill.color}` : "border-surface text-muted"
                                }`}>
                                  {cap}
                                </span>
                              ))}
                            </div>
                            
                            {/* 1. Broken Characters Fixed */}
                            <span className={`text-[9px] font-mono uppercase tracking-widest transition-colors duration-300 ${isActive ? skill.color : "text-muted group-hover:text-muted"}`}>
                              {isActive ? "Collapse ↑" : "Inspect ↓"}
                            </span>
                          </div>

                          <div className="relative bg-surface border border-surface p-3 rounded-sm overflow-hidden">
                            <div className={`absolute left-0 top-0 bottom-0 w-[2px] transition-colors duration-500 ${isActive || isHovered ? skill.pulse : "bg-surface"}`}></div>
                            
                            <div className="flex items-center justify-between gap-3">
                              <div className="flex items-center gap-3 overflow-hidden">
                                <ChevronRight size={14} className="text-muted flex-shrink-0" />
                                <code className="text-[11px] font-mono text-muted truncate">
                                  {skill.terminalSnippet}
                                  {isHovered && <span className={`animate-pulse ml-1 ${skill.color}`}>|</span>}
                                </code>
                              </div>
                              {isHovered && (
                                /* 10. Terminal Section Fixes */
                                <span className="text-[9px] text-muted font-mono flex-shrink-0 animate-pulse hidden sm:block">
                                  Running...
                                </span>
                              )}
                            </div>
                            
                            {/* 10. Terminal Section Fixes */}
                            <div className="text-[9px] text-muted mt-1.5 ml-7 font-mono">
                              Result: {skill.terminalOutput}
                            </div>
                          </div>

                          <AnimatePresence>
                            {isActive && (
                              <motion.div 
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3, ease: "easeInOut" }}
                                className="border-t border-surface pt-4 overflow-hidden"
                              >
                                {/* 2. Removed Fake System Words */}
                                <div className={`text-[9px] font-mono uppercase tracking-widest mb-4 ${skill.color}`}>
                                  {`>>`} Details Loaded
                                </div>
                                
                                <div className="space-y-5">
                                  <div className="space-y-2">
                                    <p className="text-[10px] font-mono text-muted uppercase tracking-widest">
                                      Usage Context
                                    </p>
                                    <p className="text-[12px] text-muted leading-relaxed border-l border-[var(--accent)]/30 pl-3">
                                      {skill.expandText}
                                    </p>
                                  </div>
                                  
                                  <div className="space-y-2">
                                    <p className="text-[10px] font-mono text-muted uppercase tracking-widest">
                                      Capabilities
                                    </p>
                                    <ul className="text-[12px] text-muted list-disc ml-4 space-y-1">
                                      {skill.capabilities.map((c, i) => (
                                        <li key={i} className="pl-1">{c}</li>
                                      ))}
                                    </ul>
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>

                        </div>

                      </motion.div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-16 pt-8 border-t border-surface flex justify-between items-center">
            <div className="flex gap-4 sm:gap-10 font-mono text-[9px] font-black uppercase tracking-[0.4em] text-muted">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-pulse"></div> 
                {/* 11. Footer Fixes */}
                <span className="hidden sm:inline">System Online</span>
                <span className="sm:hidden">Online</span>
              </div>
            </div>
            <div className="font-mono text-[9px] font-black uppercase tracking-[0.4em] text-muted">
              2026 • Jothish
            </div>
          </div>

        </div>
      </section>
    </>
  );
}