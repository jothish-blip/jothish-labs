"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Shield, Search, Activity, ExternalLink, Plus, 
  Target, Zap, Fingerprint, Database, Code 
} from "lucide-react";

// --- CONFIGURATION & TYPES ---
type Tier = "Practiced" | "Advanced" | "Learning";

interface Tool {
  id: string;
  name: string;
  category: "RECON" | "ANALYSIS" | "DEFENSE" | "DEVELOPMENT";
  tier: Tier;
  confidence: number; // 0 to 100
  desc: string;
  capabilities: string[];
  appliedIn: string;
  impact: string;
  reportType: string;
}

const TIER_CONFIG = {
  Advanced: { color: "text-green-500", border: "border-green-500", bg: "bg-green-500", glow: "shadow-[0_0_15px_rgba(34,197,94,0.3)]", label: "SECURE" },
  Practiced: { color: "text-orange-500", border: "border-orange-500", bg: "bg-orange-500", glow: "shadow-[0_0_15px_rgba(249,115,22,0.2)]", label: "CAUTION" },
  Learning: { color: "text-red-500", border: "border-red-500", bg: "bg-red-500", glow: "shadow-[0_0_15px_rgba(239,68,68,0.2)]", label: "RISK" },
};

const tools: Tool[] = [
  { 
    id: "01", name: "Kali Linux", category: "RECON", tier: "Advanced", confidence: 92,
    desc: "Primary OS for offensive security and forensic environments.",
    capabilities: ["Kernel Hardening", "Payload Gen"],
    appliedIn: "OSCP / TryHackMe Labs",
    impact: "Central hub for 15+ simulated network penetrations.",
    reportType: "Attack Simulation"
  },
  { 
    id: "02", name: "Nmap", category: "RECON", tier: "Advanced", confidence: 88,
    desc: "Network discovery and security auditing via NSE.",
    capabilities: ["NSE Scripting", "OS Fingerprinting"],
    appliedIn: "Internal Recon Simulation",
    impact: "Mapped 200+ nodes and identified critical misconfigurations.",
    reportType: "Audit Report"
  },
  { 
    id: "03", name: "Wireshark", category: "ANALYSIS", tier: "Practiced", confidence: 65,
    desc: "Deep packet inspection and protocol analysis.",
    capabilities: ["Traffic Filtering", "TLS Decryption"], // FIXED: TLS instead of TSL
    appliedIn: "Malware Traffic Analysis Lab",
    impact: "Identified C2 communication patterns in a breach.",
    reportType: "Analysis Report"
  },
  { 
    id: "04", name: "Splunk / Chronicle", category: "DEFENSE", tier: "Learning", confidence: 45,
    desc: "Cloud-native SIEM for log aggregation and response.",
    capabilities: ["SPL Querying", "YARA-L Rules"],
    appliedIn: "SOC Simulation Environment",
    impact: "Created detection rules for suspicious login behavior.",
    reportType: "SOC Case Study"
  },
  { 
    id: "05", name: "Python / Bash", category: "DEVELOPMENT", tier: "Practiced", confidence: 72,
    desc: "Scripting for security task automation and log parsing.",
    capabilities: ["Socket Programming", "Task Automation"],
    appliedIn: "Security Tooling Pipeline",
    impact: "Automated daily log rotation and scanning reports.",
    reportType: "Automation Script"
  },
  { 
    id: "06", name: "SQL", category: "ANALYSIS", tier: "Practiced", confidence: 78,
    desc: "Querying relational databases for forensic extraction.",
    capabilities: ["Joins/Subqueries", "Injection Mitigation"],
    appliedIn: "Web App Security Audit",
    impact: "Secured backend queries against common SQLi vectors.",
    reportType: "Vulnerability Report"
  }
];

const SkillCard = ({ tool }: { tool: Tool }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const config = TIER_CONFIG[tool.tier];

  return (
    <motion.div 
      onClick={() => setIsExpanded(!isExpanded)}
      layout
      className={`group relative w-[320px] flex-shrink-0 bg-[#050505] border-l-4 transition-all duration-300 cursor-pointer overflow-hidden
        ${isExpanded ? 'h-[480px] bg-[#080808]' : 'h-[240px] hover:bg-[#0a0a0a]'} ${config.border}`}
    >
      <div className="relative z-10 p-6 flex flex-col h-full">
        {/* Tier Badge & Live Status */}
        <div className="flex justify-between items-center mb-4">
          <div className={`flex items-center gap-2 px-2 py-0.5 border ${config.border} ${config.glow}`}>
             <span className={`w-1.5 h-1.5 rounded-full ${config.bg} animate-pulse`}></span>
             <span className={`font-mono text-[9px] font-black uppercase tracking-widest ${config.color}`}>
               {tool.tier} // {config.label}
             </span>
          </div>
          <span className="font-mono text-[9px] text-zinc-700 font-bold tracking-widest">CMD_{tool.id}</span>
        </div>

        {/* Identity */}
        <div className="space-y-1">
          <h3 className="text-3xl font-black tracking-tighter uppercase leading-none italic group-hover:text-white transition-colors">
            {tool.name}
          </h3>
          <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.2em]">{tool.category}</p>
        </div>

        {!isExpanded && (
          <p className="mt-4 text-[11px] text-zinc-400 leading-tight line-clamp-2 font-medium">
            {tool.desc}
          </p>
        )}

        {/* Progress Bar (Visible Always) */}
        <div className="mt-4 space-y-1.5">
          <div className="flex justify-between text-[8px] font-mono text-zinc-600">
             <span>CONFIDENCE_LEVEL</span>
             <span>{tool.confidence}%</span>
          </div>
          <div className="h-1 w-full bg-zinc-900 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              whileInView={{ width: `${tool.confidence}%` }}
              className={`h-full ${config.bg}`}
            />
          </div>
        </div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-6 space-y-5 border-t border-zinc-900 pt-6">
              <div className="space-y-3">
                <div>
                  <label className="block text-[8px] font-black text-zinc-600 uppercase tracking-widest mb-1">Capabilities</label>
                  <div className="flex flex-wrap gap-1.5">
                    {tool.capabilities.map(cap => (
                      <span key={cap} className="text-[8px] font-mono text-zinc-300 bg-zinc-900 px-1.5 py-0.5 border border-white/5 uppercase">{cap}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-[8px] font-black text-zinc-600 uppercase tracking-widest mb-1">Impact_Factor</label>
                  <p className="text-[11px] text-zinc-400 italic leading-relaxed">{tool.impact}</p>
                </div>
              </div>
              
              <button className={`w-full flex items-center justify-center gap-2 py-3 ${config.bg} text-black text-[10px] font-black uppercase tracking-widest hover:brightness-125 transition-all mt-auto`}>
                View {tool.reportType} <ExternalLink size={12} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {!isExpanded && (
        <div className="absolute top-6 right-6">
          <Plus size={14} className="text-zinc-800 group-hover:text-white transition-colors" />
        </div>
      )}
    </motion.div>
  );
};

export default function Skills() {
  return (
    <section id="skills" className="relative min-h-screen w-full bg-[#020202] text-white py-32 overflow-hidden border-t border-white/[0.03]">
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[linear-gradient(to_right,#00ffff_1px,transparent_1px),linear-gradient(to_bottom,#00ffff_1px,transparent_1px)] bg-[size:60px_60px]"></div>

      <div className="relative z-10 max-w-[1800px] mx-auto px-6 md:px-16 mb-24 space-y-12">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Zap size={16} className="text-cyan-500" />
              <span className="font-mono text-[10px] font-black tracking-[0.6em] text-cyan-500 uppercase">Audit_v2.5_Active</span>
            </div>
            <h2 className="text-6xl md:text-[140px] font-black tracking-tighter uppercase leading-[0.75]">
              TECH<br/><span className="text-zinc-800 italic">ARSENAL.</span>
            </h2>
          </div>
          
          {/* Skill Distribution Header */}
          <div className="bg-white/[0.02] border border-white/5 p-8 rounded-sm space-y-6 w-full max-w-md">
            <h4 className="text-[10px] font-mono text-zinc-500 uppercase tracking-[0.3em]">Fleet_Proficiency_Distribution</h4>
            <div className="space-y-4">
              {[
                { label: "Advanced", width: "w-[40%]", color: "bg-green-500" },
                { label: "Practiced", width: "w-[35%]", color: "bg-orange-500" },
                { label: "Learning", width: "w-[25%]", color: "bg-red-500" },
              ].map((bar) => (
                <div key={bar.label} className="space-y-1.5">
                  <div className="flex justify-between text-[9px] font-mono uppercase tracking-tighter">
                    <span className="text-zinc-400">{bar.label}</span>
                    <span className="text-zinc-600">{bar.width.match(/\d+/)}%</span>
                  </div>
                  <div className="h-1 w-full bg-zinc-900">
                    <div className={`h-full ${bar.color} ${bar.width}`}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Rows with Section Color Logic */}
      <div className="relative space-y-32">
        <div className="relative group">
           {/* Red Tint for RECON */}
          <div className="absolute inset-x-0 h-full bg-red-500/[0.02] pointer-events-none" />
          <SkillRow title="Infiltration_Recon" icon={Target} items={tools.filter(t => t.category === "RECON")} color="text-red-500" />
        </div>

        <div className="relative group">
           {/* Orange Tint for ANALYSIS */}
          <div className="absolute inset-x-0 h-full bg-orange-500/[0.01] pointer-events-none" />
          <SkillRow title="Security_Analytics" icon={Database} items={tools.filter(t => t.category === "ANALYSIS")} color="text-orange-500" />
        </div>

        <div className="relative group">
           {/* Green Tint for DEFENSE */}
          <div className="absolute inset-x-0 h-full bg-green-500/[0.02] pointer-events-none" />
          <SkillRow title="Infrastructure_Defense" icon={Shield} items={tools.filter(t => t.category === "DEFENSE")} color="text-green-500" />
        </div>

        <div className="relative group">
           {/* Cyan for DEVELOPMENT */}
          <div className="absolute inset-x-0 h-full bg-cyan-500/[0.02] pointer-events-none" />
          <SkillRow title="Automation_Development" icon={Code} items={tools.filter(t => t.category === "DEVELOPMENT")} color="text-cyan-500" />
        </div>
      </div>

      <div className="max-w-[1800px] mx-auto px-6 md:px-16 mt-40 flex justify-between items-center border-t border-zinc-900 pt-8">
        <div className="flex gap-10 font-mono text-[9px] font-black uppercase tracking-[0.4em] text-zinc-700">
           <div className="flex items-center gap-2">
             <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse"></div> 
             Fleet_Hardware_Secure
           </div>
           <div>Session: 2026_Audit_Verified</div>
        </div>
      </div>
    </section>
  );
}

const SkillRow = ({ title, icon: Icon, items, color }: { title: string, icon: any, items: Tool[], color: string }) => (
  <div className="space-y-8 relative z-10">
    <div className="px-6 md:px-16 flex items-center gap-4">
      <div className={`h-px flex-1 bg-gradient-to-r from-transparent via-zinc-900 to-transparent`}></div>
      <div className="flex items-center gap-2 bg-black px-4">
        <Icon size={14} className={color} />
        <h4 className={`font-black text-[10px] uppercase tracking-[0.5em] text-zinc-500`}>{title}</h4>
      </div>
      <div className={`h-px flex-1 bg-gradient-to-r from-transparent via-zinc-900 to-transparent`}></div>
    </div>
    <div className="flex gap-6 px-6 md:px-16 overflow-x-auto pb-12 no-scrollbar">
      {items.map((tool) => (
        <SkillCard key={tool.id} tool={tool} />
      ))}
    </div>
  </div>
);