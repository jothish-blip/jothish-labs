"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Terminal as TerminalIcon, Play, Pause, Activity, ShieldCheck, Zap } from "lucide-react";

// --- TYPES ---
interface Tool {
  id: string;
  name: string;
  status: string;
  level: number;
  src: string;
  desc: string;
  metrics: string;
  useCase: string;
}

interface StreamProps {
  items: Tool[];
  direction: "left" | "right";
  title: string;
}

const tools: Tool[] = [
  { id: "SYS-KALI", name: "Kali Linux", status: "OPERATIONAL", level: 85, src: "/icons/kali.png", desc: "Primary OS for offensive security and forensic environments.", metrics: "KERNEL: HARDENED | ARCH: X64", useCase: "Pentesting" },
  { id: "SYS-NMAP", name: "Nmap", status: "OPERATIONAL", level: 80, src: "/icons/nmap.png", desc: "Network discovery and security auditing using NSE scripts.", metrics: "SCAN: SYN/UDP | SCRIPTS: NSE", useCase: "Reconnaissance" },
  { id: "SYS-WIRE", name: "Wireshark", status: "OPERATIONAL", level: 65, src: "/icons/wireshark.png", desc: "Deep packet inspection and protocol analysis.", metrics: "FILTER: TCP/UDP | DROP: 0%", useCase: "Analysis" },
  { id: "SYS-SPLK", name: "Splunk", status: "LEARNING", level: 40, src: "/icons/splunk.png", desc: "SIEM for log aggregation and security orchestration.", metrics: "INDEX: SYNCING | SPL: 40%", useCase: "SIEM" },
  { id: "SYS-THRT", name: "ThreatIntel", status: "LEARNING", level: 30, src: "/icons/intel.png", desc: "Aggregating global threat feeds for proactive defense.", metrics: "API: ACTIVE | FEED: JSON", useCase: "IOC Tracking" },
];

const SkillCard = ({ tool }: { tool: Tool }) => (
  /* INDIVIDUAL HOVER: The 'group' class starts here. 
     This ensures that hover triggers ONLY for this specific card instance.
  */
  <motion.div 
    whileHover={{ y: -5, scale: 1.02 }}
    className="group relative w-[360px] h-[200px] flex-shrink-0 bg-[#050505] border border-white/5 p-5 transition-all duration-500 hover:border-cyan-500/40 hover:bg-[#080808] rounded-sm overflow-hidden cursor-crosshair z-10 hover:z-50 shadow-2xl"
  >
    {/* Background Icon Asset */}
    <div className="absolute top-2 right-2 w-16 h-16 opacity-[0.03] group-hover:opacity-10 transition-opacity duration-700">
      <img src={tool.src} alt="" className="w-full h-full object-contain grayscale" />
    </div>

    <div className="relative z-10 h-full flex flex-col justify-between">
      <div className="space-y-3">
        <div className="flex justify-between items-start">
          <div className="flex flex-col gap-1">
            <span className="font-mono text-[8px] text-zinc-600 tracking-[0.2em]">REF: {tool.id}</span>
            <h3 className="text-2xl font-black tracking-tighter uppercase group-hover:text-cyan-400 transition-colors leading-none">
              {tool.name}
            </h3>
          </div>
          <span className={`text-[8px] font-mono px-2 py-0.5 border ${tool.status === 'OPERATIONAL' ? 'text-cyan-500 border-cyan-500/20 bg-cyan-500/5' : 'text-orange-500 border-orange-500/20 bg-orange-500/5'}`}>
            {tool.status}
          </span>
        </div>
        
        {/* Normal description - fades out on individual hover */}
        <p className="text-zinc-500 text-[10px] leading-relaxed font-light line-clamp-2 group-hover:opacity-0 transition-opacity duration-300">
          {tool.desc}
        </p>
      </div>

      {/* INDIVIDUAL DATA OVERLAY: Only appears when THIS specific card is hovered */}
      <div className="absolute inset-0 bg-[#080808] translate-y-full group-hover:translate-y-0 transition-transform duration-500 p-5 flex flex-col justify-between z-20 border-t-2 border-cyan-500">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Activity size={12} className="text-cyan-500" />
            <span className="text-[9px] font-mono text-cyan-400 tracking-widest uppercase">Telemetry_Dump</span>
          </div>
          <div className="space-y-2 font-mono">
             <p className="text-[9px] text-zinc-500 uppercase leading-none">{tool.metrics}</p>
             <p className="text-[10px] text-zinc-300 uppercase font-bold tracking-tighter">USE_CASE: {tool.useCase}</p>
          </div>
        </div>
        
        <div className="flex justify-between items-center border-t border-white/5 pt-3">
           <span className="text-[8px] font-mono text-zinc-800 tracking-widest uppercase font-bold">Protocol_Stable</span>
           <Zap size={12} className="text-cyan-500 animate-pulse" />
        </div>
      </div>

      {/* Integrity Index Bar */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-[8px] font-mono text-zinc-700 uppercase tracking-widest">
          <span>Integrity_Index</span>
          <span className="text-cyan-600">{tool.level}%</span>
        </div>
        <div className="w-full h-[1px] bg-zinc-900 overflow-hidden">
          <motion.div 
            initial={{ width: 0 }} 
            whileInView={{ width: `${tool.level}%` }} 
            transition={{ duration: 1.5, ease: "circOut" }} 
            className="h-full bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.8)]" 
          />
        </div>
      </div>
    </div>
  </motion.div>
);

const ControlledStream = ({ items, direction, title }: StreamProps) => {
  const [isPlaying, setIsPlaying] = useState(true);
  
  const duplicatedItems = [...items, ...items, ...items, ...items];

  return (
    <div className="space-y-6">
      {/* HUD CONTROLS */}
      <div className="ml-16 md:ml-32 flex items-center justify-between pr-16 md:pr-32 border-b border-zinc-900/50 pb-3">
        <div className="flex items-center gap-4">
          <div className={`h-[1px] w-12 transition-all duration-700 ${isPlaying ? 'bg-cyan-500 shadow-[0_0_8px_cyan]' : 'bg-zinc-800'}`}></div>
          <span className={`font-mono text-[9px] tracking-[0.4em] uppercase font-bold ${isPlaying ? 'text-cyan-400' : 'text-zinc-700'}`}>
            {title}
          </span>
        </div>

        <button 
          onClick={() => setIsPlaying(!isPlaying)}
          className="flex items-center gap-2 group outline-none"
        >
          <div className={`p-2 rounded-sm border transition-all ${isPlaying ? 'border-zinc-800 text-zinc-600 hover:border-red-900 hover:text-red-500' : 'border-cyan-500 text-cyan-400 animate-pulse'}`}>
            {isPlaying ? <Pause size={10} /> : <Play size={10} />}
          </div>
          <span className="font-mono text-[8px] text-zinc-700 group-hover:text-zinc-400 uppercase tracking-tighter">
            {isPlaying ? 'PAUSE_DATA' : 'RESUME_DATA'}
          </span>
        </button>
      </div>

      <div className="relative overflow-hidden group">
        <motion.div
          className="flex gap-4 w-max"
          animate={isPlaying ? {
            x: direction === "left" ? ["0%", "-25%"] : ["-25%", "0%"],
          } : {}}
          transition={{
            duration: 45,
            repeat: Infinity,
            ease: "linear",
          }}
          // Auto-stops the WHOLE row when you hover ANY card for inspection
          whileHover={{ animationPlayState: "paused" }}
        >
          {duplicatedItems.map((tool, idx) => (
            <SkillCard key={`${tool.id}-${idx}`} tool={tool} />
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default function Skills() {
  const operationalTools = tools.filter(t => t.status === "OPERATIONAL");
  const learningTools = tools.filter(t => t.status === "LEARNING");

  return (
    <section id="skills" className="relative min-h-screen w-full bg-[#020202] text-white py-32 overflow-hidden border-t border-white/[0.03]">
      {/* CRT SCANLINES */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(0,255,255,0.01),transparent,rgba(0,255,255,0.01))] z-20 pointer-events-none bg-[length:100%_2px,3px_100%] opacity-30"></div>

      <div className="relative z-10 max-w-[1800px] mx-auto px-6 md:px-16">
        <div className="mb-20 space-y-4 border-l-2 border-cyan-500 pl-8">
          <div className="flex items-center gap-2">
            <TerminalIcon size={12} className="text-cyan-500" />
            <span className="font-mono text-[9px] tracking-[0.5em] text-cyan-600 uppercase font-bold">// ANALYST_STREAM_v7.4</span>
          </div>
          <h2 className="text-5xl md:text-[100px] font-black tracking-tighter uppercase leading-[0.8]">
            CORE <span className="text-zinc-900 italic font-light tracking-widest">STACK.</span>
          </h2>
        </div>
      </div>

      <div className="relative space-y-24">
        {/* Faded Edges Mask */}
        <div className="absolute inset-y-0 left-0 w-48 bg-gradient-to-r from-[#020202] to-transparent z-30 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-48 bg-gradient-to-l from-[#020202] to-transparent z-30 pointer-events-none" />

        <ControlledStream items={operationalTools} direction="left" title="Primary_Operational_Systems" />
        <ControlledStream items={learningTools} direction="right" title="Neural_Learning_Track" />
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-32 flex flex-wrap gap-12 text-[9px] font-mono text-zinc-800 uppercase tracking-[0.4em] border-t border-zinc-900 pt-10">
        <div className="flex items-center gap-2">
          <ShieldCheck size={12} className="text-emerald-900" />
          SESSION_SECURE: 100%
        </div>
        <div className="ml-auto text-zinc-900 font-bold">
            © 2026 // J_G_ANALYST_RECORDS
        </div>
      </div>
    </section>
  );
}