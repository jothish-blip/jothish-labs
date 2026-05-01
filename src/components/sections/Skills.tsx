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
        color: "text-emerald-400",
        pulse: "bg-emerald-400",
        iconBorder: "border-emerald-500/20",
        capBorder: "border-emerald-500/30",
        hoverBorder: "border-emerald-500/30",
        hoverBg: "bg-emerald-950/20",
        activeBorder: "border-emerald-500/50",
        activeBg: "bg-[#0c0c0c]",
        bgGlow: "group-hover:shadow-[0_0_30px_rgba(52,211,153,0.05)]",
        borderGlow: "group-hover:border-emerald-500/30",
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
        color: "text-red-400",
        pulse: "bg-red-400",
        iconBorder: "border-red-500/20",
        capBorder: "border-red-500/30",
        hoverBorder: "border-red-500/30",
        hoverBg: "bg-red-950/20",
        activeBorder: "border-red-500/50",
        activeBg: "bg-[#0c0c0c]",
        bgGlow: "group-hover:shadow-[0_0_30px_rgba(248,113,113,0.05)]",
        borderGlow: "group-hover:border-red-500/30",
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
        color: "text-cyan-400",
        pulse: "bg-cyan-400",
        iconBorder: "border-cyan-500/20",
        capBorder: "border-cyan-500/30",
        hoverBorder: "border-cyan-500/30",
        hoverBg: "bg-cyan-950/20",
        activeBorder: "border-cyan-500/50",
        activeBg: "bg-[#0c0c0c]",
        bgGlow: "group-hover:shadow-[0_0_30px_rgba(34,211,238,0.05)]",
        borderGlow: "group-hover:border-cyan-500/30",
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
        color: "text-blue-400",
        pulse: "bg-blue-400",
        iconBorder: "border-blue-500/20",
        capBorder: "border-blue-500/30",
        hoverBorder: "border-blue-500/30",
        hoverBg: "bg-blue-950/20",
        activeBorder: "border-blue-500/50",
        activeBg: "bg-[#0c0c0c]",
        bgGlow: "group-hover:shadow-[0_0_30px_rgba(96,165,250,0.05)]",
        borderGlow: "group-hover:border-blue-500/30",
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
        color: "text-amber-400",
        pulse: "bg-amber-400",
        iconBorder: "border-amber-500/20",
        capBorder: "border-amber-500/30",
        hoverBorder: "border-amber-500/30",
        hoverBg: "bg-amber-950/20",
        activeBorder: "border-amber-500/50",
        activeBg: "bg-[#0c0c0c]",
        bgGlow: "group-hover:shadow-[0_0_30px_rgba(251,191,36,0.05)]",
        borderGlow: "group-hover:border-amber-500/30",
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
    <section 
      id="skills" 
      onMouseEnter={() => setIsSectionHovered(true)}
      onMouseLeave={() => setIsSectionHovered(false)}
      className="relative min-h-screen w-full bg-[#030303] text-white pt-[120px] sm:pt-[110px] md:pt-[130px] pb-24 px-4 sm:px-6 md:px-12 lg:px-24 overflow-hidden border-t border-white/5"
    >
      
      {/* BACKGROUND DEPTH */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60 pointer-events-none z-[1]"></div>
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:40px_40px]"></div>

      <div className="relative z-10 max-w-4xl mx-auto">
        
        {/* HUD Header */}
        <div className="mb-16 space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Zap size={14} className="text-cyan-500" />
              <span className="font-mono text-[10px] tracking-[0.5em] text-cyan-500 uppercase">// SYSTEM_MODULES</span>
            </div>
            
            {/* MICRO SYSTEM FEEDBACK */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-[9px] font-mono text-zinc-600 tracking-widest border border-white/5 px-3 py-1.5 bg-white/[0.02] rounded-sm">
              <div className="flex gap-4">
                <span>MODULES: {String(allSkillIds.length).padStart(2, '0')}</span>
                <span>STATUS: ACTIVE</span>
              </div>
              <span className="hidden sm:inline-block border-l border-zinc-800 pl-4 text-zinc-700">
                [↑] [↓] NAVIGATE • [ENTER] INSPECT
              </span>
            </div>
          </div>
          
          <div className="space-y-3">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter uppercase leading-[0.8]">
              Technical <span className="text-zinc-800 italic font-light">Skills.</span>
            </h2>
            <p className="font-mono text-[10px] text-zinc-600 tracking-[0.3em] uppercase">
              Currently working with these tools
            </p>
          </div>
          
          {/* HUMAN TOUCH & INITIAL GUIDANCE */}
          <div className="space-y-2">
            <p className="text-zinc-500 text-[13px] sm:text-sm font-light max-w-md leading-relaxed">
              These are the tools I actively use while learning and building security-focused projects. Focused on establishing strong fundamentals in system security and network analysis.
            </p>
            <p className="text-[11px] font-mono text-zinc-700 pt-2">
              <span className="hidden sm:inline">Hover to explore • Click to inspect modules</span>
              <span className="sm:hidden">Tap to inspect modules</span>
            </p>
          </div>
        </div>

        {/* GUIDED EMPTY STATE */}
        {!activeId && (
          <p className="text-[11px] text-zinc-600 font-mono mb-6 uppercase tracking-widest animate-pulse">
            {`>`} Select a module to initialize inspection
          </p>
        )}

        {/* STRUCTURED GROUPS */}
        <div className="space-y-12">
          {skillGroups.map((group, groupIndex) => (
            <div key={groupIndex} className="space-y-5">
              
              {/* SECTION TITLE DIVIDER */}
              <div className="flex items-center gap-4">
                <div className="h-px flex-1 bg-zinc-800/50" />
                <span className="font-mono text-[10px] text-zinc-600 tracking-widest uppercase">
                  {group.title} ({String(group.items.length).padStart(2, '0')})
                </span>
                <div className="h-px flex-1 bg-zinc-800/50" />
              </div>

              {/* GRID */}
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
                      className={`group relative border p-6 flex flex-col justify-between transition-all duration-300 hover:-translate-y-[2px] cursor-pointer min-h-[280px] ${
                        isActive ? `${skill.activeBorder} ${skill.activeBg}` : `bg-[#080808] border-white/5 ${skill.bgGlow} ${skill.borderGlow}`
                      } ${isHovered && !isActive ? "scale-[1.01]" : "scale-100"}`}
                    >
                      
                      {/* Header: Icon & ID */}
                      <div className="flex justify-between items-start mb-6">
                        <div className={`p-3 border rounded-sm transition-colors duration-500 ${
                          isActive || isHovered ? `bg-white/[0.05] ${skill.iconBorder}` : "bg-white/[0.02] border-white/5"
                        }`}>
                          <Icon size={24} className={`transition-colors duration-500 ${isActive || isHovered ? skill.color : "text-zinc-500"}`} />
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <span className="font-mono text-[9px] text-zinc-600 tracking-widest uppercase">REF: {skill.id}</span>
                          <span className={`font-mono text-[8px] px-2 py-0.5 border uppercase tracking-widest transition-colors duration-500 ${
                            isActive || isHovered ? `${skill.hoverBorder} ${skill.color} ${skill.hoverBg}` : "border-white/10 text-zinc-500"
                          }`}>
                            {skill.status}
                          </span>
                        </div>
                      </div>

                      {/* Identity & Description */}
                      <div className="space-y-4 mb-8">
                        <div>
                          <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight uppercase mb-1">
                            {skill.name}
                          </h3>
                          <p className={`font-mono text-[10px] tracking-[0.2em] uppercase transition-colors duration-500 ${isActive || isHovered ? skill.color : "text-zinc-600"}`}>
                            {skill.category}
                          </p>
                        </div>
                        <p className="text-[13px] text-zinc-400 font-light leading-relaxed max-w-sm">
                          {skill.desc}
                        </p>
                      </div>

                      {/* Capabilities & Terminal Row */}
                      <div className="space-y-6 mt-auto">
                        
                        <div className="flex justify-between items-end">
                          <div className="flex flex-wrap gap-2">
                            {skill.capabilities.map((cap, i) => (
                              <span key={i} className={`text-[9px] font-mono bg-[#050505] border px-2 py-1 uppercase tracking-wider transition-colors duration-300 ${
                                isActive ? `${skill.capBorder} ${skill.color}` : "border-white/5 text-zinc-400"
                              }`}>
                                {cap}
                              </span>
                            ))}
                          </div>
                          
                          {/* VISUAL AFFORDANCE */}
                          <span className={`text-[9px] font-mono uppercase tracking-widest transition-colors duration-300 ${isActive ? skill.color : "text-zinc-600 group-hover:text-zinc-400"}`}>
                            {isActive ? "Collapse ↑" : "Inspect ↓"}
                          </span>
                        </div>

                        {/* Terminal Snippet */}
                        <div className="relative bg-black border border-white/10 p-3 rounded-sm overflow-hidden">
                          <div className={`absolute left-0 top-0 bottom-0 w-[2px] transition-colors duration-500 ${isActive || isHovered ? skill.pulse : "bg-zinc-800"}`}></div>
                          
                          <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3 overflow-hidden">
                              <ChevronRight size={14} className="text-zinc-600 flex-shrink-0" />
                              <code className="text-[11px] font-mono text-zinc-300 truncate">
                                {skill.terminalSnippet}
                                {isHovered && <span className={`animate-pulse ml-1 ${skill.color}`}>|</span>}
                              </code>
                            </div>
                            {isHovered && (
                              <span className="text-[9px] text-zinc-600 font-mono flex-shrink-0 animate-pulse hidden sm:block">
                                executing...
                              </span>
                            )}
                          </div>
                          
                          {/* FAKE OUTPUT */}
                          <div className="text-[9px] text-zinc-600 mt-1.5 ml-7 font-mono">
                            output: {skill.terminalOutput}
                          </div>
                        </div>

                        {/* EXPANDED INTERACTIVE STATE */}
                        <AnimatePresence>
                          {isActive && (
                            <motion.div 
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.3, ease: "easeInOut" }}
                              className="border-t border-white/5 pt-4 overflow-hidden"
                            >
                              <div className={`text-[9px] font-mono uppercase tracking-widest mb-4 ${skill.color}`}>
                                {`>>`} MODULE_ANALYSIS_LOADED
                              </div>
                              
                              <div className="space-y-5">
                                {/* IMPLEMENTATION CONTEXT */}
                                <div className="space-y-2">
                                  <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest">
                                    Implementation_Context
                                  </p>
                                  <p className="text-[12px] text-zinc-400 leading-relaxed border-l-2 border-zinc-800 pl-3">
                                    {skill.expandText}
                                  </p>
                                </div>
                                
                                {/* WHAT I CAN DO */}
                                <div className="space-y-2">
                                  <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest">
                                    Functional_Capabilities
                                  </p>
                                  <ul className="text-[12px] text-zinc-400 list-disc ml-4 space-y-1">
                                    {skill.capabilities.map((c, i) => (
                                      <li key={i} className="pl-1">{c}</li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                              
                              {/* SELF-CONTAINED INDICATOR (Replaced Link) */}
                              <span className={`inline-flex items-center gap-2 text-[10px] mt-6 font-mono tracking-widest uppercase ${skill.color}`}>
                                Module Details
                                <ChevronRight size={10} />
                              </span>
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
        
        {/* Footer Meta */}
        <div className="mt-16 pt-8 border-t border-white/5 flex justify-between items-center">
          <div className="flex gap-4 sm:gap-10 font-mono text-[9px] font-black uppercase tracking-[0.4em] text-zinc-600">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse"></div> 
              <span className="hidden sm:inline">Systems_Operational</span>
              <span className="sm:hidden">Online</span>
            </div>
          </div>
          <div className="font-mono text-[9px] font-black uppercase tracking-[0.4em] text-zinc-600">
            2026 // JOTHISH_CORE
          </div>
        </div>

      </div>
    </section>
  );
}