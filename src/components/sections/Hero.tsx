"use client";
import { useEffect, useRef, useState } from "react";

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const container = containerRef.current;
    if (!container) return;

    let currentX = 0;
    let currentY = 0;

    const move = (e: MouseEvent) => {
      currentX = e.clientX;
      currentY = e.clientY;
    };

    const animate = () => {
      const prevX = parseFloat(container.style.getPropertyValue("--x") || "0");
      const prevY = parseFloat(container.style.getPropertyValue("--y") || "0");

      const nextX = prevX + (currentX - prevX) * 0.08;
      const nextY = prevY + (currentY - prevY) * 0.08;

      container.style.setProperty("--x", `${nextX}px`);
      container.style.setProperty("--y", `${nextY}px`);

      requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", move);
    animate();

    return () => window.removeEventListener("mousemove", move);
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen w-full bg-[#020202] text-white overflow-hidden flex flex-col items-center justify-center pt-28 md:pt-36" 
    >
      {/* 🎯 SUBTLE GRID */}
      <div className="absolute inset-0 z-[1] opacity-[0.03] pointer-events-none bg-[linear-gradient(to_right,#00ffff_1px,transparent_1px),linear-gradient(to_bottom,#00ffff_1px,transparent_1px)] bg-[size:60px_60px]" />

      {/* 🖱️ REACTIVE GLOW (Calmer & More Premium) */}
      <div
        className="pointer-events-none absolute inset-0 z-[2]"
        style={{
          background: `radial-gradient(600px circle at var(--x, -1000px) var(--y, -1000px), rgba(0, 255, 255, 0.03), transparent 70%)`,
        }}
      />

      {/* 📺 SCANLINE (Minimal) */}
      <div className="absolute inset-0 z-[3] pointer-events-none opacity-[0.02] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(0,255,255,0.01),rgba(0,255,255,0.005),rgba(0,255,255,0.01))] bg-[length:100%_2px,3px_100%]" />

      {/* MAIN CONTENT */}
      <div className="relative z-10 px-6 md:px-16 lg:px-32 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center w-full max-w-7xl">
        
        {/* Left Column: Mission Statement */}
        <div className={`lg:col-span-8 transition-all duration-1000 delay-300 ${isMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          
          {/* IMMEDIATE HUMAN ANCHOR */}
          <p className="text-[10px] font-mono text-zinc-600 mb-4 tracking-widest uppercase">
            JOTHISH GANDHAM / SECURITY LEARNER
          </p>
          
          {/* ⚡ NEUTRAL STATUS STRIP */}
          <div className="flex flex-wrap gap-3 mb-8 font-mono text-[9px] tracking-widest uppercase">
            <span className="flex items-center gap-1.5 text-zinc-500 border border-zinc-800 px-2 py-1 rounded bg-zinc-900/30">
              <span className="w-1 h-1 bg-cyan-500 rounded-full animate-pulse"></span>
              OPEN_FOR_INTERNSHIPS
            </span>
            <span className="text-zinc-600 border border-zinc-800 px-2 py-1 rounded">FOCUSED_ON_BLUE_TEAM</span>
            <span className="text-zinc-600 border border-zinc-800 px-2 py-1 rounded">AVAILABLE_FOR_LEARNING_PROJECTS</span>
          </div>

          <h1 className="text-5xl md:text-[90px] font-black tracking-tighter leading-[0.85] mb-10">
            Understanding <span className="text-zinc-800 italic">Systems</span>.<br />
            By <span className="text-cyan-500 underline decoration-1 underline-offset-[12px]">Breaking</span> Them.
          </h1>

          <div className="max-w-xl space-y-6">
            <div className="border-l-2 border-zinc-800 pl-8 space-y-4">
              <p className="text-zinc-400 text-lg md:text-xl font-light leading-relaxed">
                Jothish Gandham — <span className="text-white font-medium">Security Analyst</span> specialized in vulnerability identification and threat analysis through <span className="text-zinc-300 italic">real-world simulations</span>.
              </p>
              
              {/* HONESTY & INTENT LAYER */}
              <p className="text-zinc-500 text-sm font-light">
                I don’t know everything yet — but I focus on understanding how systems actually behave when things go wrong.
              </p>
            </div>
            
            {/* VISUAL PAUSE (Breathing Space) */}
            <div className="h-px w-16 bg-zinc-800 ml-8 my-8"></div>
            
            {/* PROOF SIGNALS (Grounded) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pl-8 font-mono">
              <div className="space-y-1">
                <p className="text-[10px] text-zinc-600 uppercase tracking-widest">Focus</p>
                <p className="text-[12px] sm:text-[13px] text-white font-bold leading-tight">Network & System Analysis</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] text-zinc-600 uppercase tracking-widest">Core Tools</p>
                <p className="text-[12px] sm:text-[13px] text-white font-bold leading-tight">Wireshark, tcpdump, SQL, Linux</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] text-zinc-600 uppercase tracking-widest">Track</p>
                <p className="text-[12px] sm:text-[13px] text-cyan-500 font-bold italic leading-tight">Learning Phase</p>
              </div>
            </div>

            {/* Competency Tags with Cleaner Micro-Interaction */}
            <div className="flex flex-wrap gap-2 pl-8 pt-2">
              {['Packet Analysis', 'Log Reading', 'Basic Threat Detection', 'System Observation'].map((tag) => (
                <span 
                  key={tag} 
                  className="group text-[8px] font-mono border border-zinc-800 px-2 py-1 rounded-sm text-zinc-500 uppercase tracking-widest hover:text-cyan-400 hover:border-cyan-900 transition-all cursor-default bg-[#050505]"
                >
                  {tag}
                  <span className="hidden group-hover:inline-block ml-1 text-cyan-500/60 text-[8px] lowercase tracking-normal animate-pulse">
                    exploring
                  </span>
                </span>
              ))}
            </div>
          </div>

          {/* PURPOSEFUL ACTION BUTTONS */}
          <div className="mt-12 flex flex-wrap items-center gap-6 pl-8">
            <a 
              href="#projects" 
              className="px-10 py-4 border border-cyan-500 text-cyan-400 font-bold text-[10px] tracking-[0.3em] uppercase transition-all hover:bg-cyan-500 hover:text-black active:scale-95 rounded-sm shadow-[0_0_15px_rgba(6,182,212,0.1)] hover:shadow-[0_0_30px_rgba(6,182,212,0.4)]"
            >
              Explore Projects
            </a>

            <a 
              href="/resume.pdf" 
              target="_blank"
              className="px-8 py-4 border border-zinc-700 text-zinc-400 hover:text-white hover:border-white font-mono text-[10px] uppercase tracking-[0.3em] transition-all active:scale-95 rounded-sm bg-[#050505]"
            >
              View Resume
            </a>

            <a 
              href="#contact" 
              className="font-mono text-[10px] text-zinc-600 hover:text-cyan-400 uppercase tracking-widest flex items-center gap-2 transition-colors ml-2"
            >
              Let's Connect
            </a>
          </div>

          {/* MICRO PERSONAL SIGNAL */}
          <p className="text-[10px] text-zinc-600 ml-8 font-mono mt-10 tracking-widest uppercase">
            Based in India • Learning every day
          </p>

        </div>

        {/* Right Column: HUD (Cyan Filtered) */}
        <div className={`lg:col-span-4 hidden lg:block transition-all duration-1000 delay-500 ${isMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <div className="border border-white/5 bg-white/[0.01] backdrop-blur-sm p-8 rounded-sm relative overflow-hidden group hover:border-cyan-500/20 transition-colors flex flex-col justify-between h-full">
            
            <div className="space-y-8">
              {/* Background SVG Decorator */}
              <div className="absolute top-0 right-0 p-4 opacity-5">
                <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-cyan-500"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              </div>
              
              <h4 className="font-mono text-[9px] tracking-[0.4em] text-zinc-500 uppercase border-b border-zinc-900 pb-4">
                Identity_Matrix
              </h4>
              
              {/* Identity Stats */}
              <div className="space-y-4 font-mono text-[10px]">
                <div className="flex justify-between border-b border-white/5 pb-2 hover:bg-white/[0.02] transition-colors">
                  <span className="text-zinc-600 uppercase tracking-tighter">Focus</span>
                  <span className="text-cyan-500">BLUE_TEAM / SOC</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2 hover:bg-white/[0.02] transition-colors">
                  <span className="text-zinc-600 uppercase tracking-tighter">Experience</span>
                  <span className="text-zinc-300">Learning Through Projects</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2 hover:bg-white/[0.02] transition-colors">
                  <span className="text-zinc-600 uppercase tracking-tighter">Status</span>
                  <span className="text-zinc-400 uppercase">Active_Learning</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2 hover:bg-white/[0.02] transition-colors">
                  <span className="text-zinc-600 uppercase tracking-tighter">Response</span>
                  <span className="text-white">Open to Connect</span>
                </div>
              </div>

              <div className="pt-2 space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse"></div>
                  <span className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest">
                    System_Status
                  </span>
                </div>
                <div className="bg-[#050505] border border-white/5 p-3 rounded-sm">
                  <p className="text-zinc-500 text-[10px] font-mono leading-relaxed">
                    Actively learning and building projects. Expanding capabilities in threat detection.
                  </p>
                </div>
              </div>
            </div>

            {/* Quiet Growth Signal */}
            <p className="text-[9px] text-zinc-600 font-mono mt-6 border-t border-white/5 pt-4 uppercase tracking-widest">
              Still building. Still learning.
            </p>

          </div>
        </div>
      </div>

      {/* 🖱️ SCROLL INDICATOR (Cyan) */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
        <p className="text-[9px] font-mono text-zinc-700 uppercase tracking-[0.3em]">
          Scroll to see my work
        </p>
        <div className="w-[1px] h-8 bg-gradient-to-b from-cyan-500 to-transparent"></div>
      </div>
    </div>
  );
}