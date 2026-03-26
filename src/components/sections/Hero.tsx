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
      className="relative min-h-screen w-full bg-[#020202] text-white overflow-hidden flex flex-col items-center justify-center pt-20 md:pt-28" 
    >
      {/* HUD Layer: Cyber Grid */}
      <div className="absolute inset-0 z-[1] opacity-[0.03] pointer-events-none bg-[linear-gradient(to_right,#00ffff_1px,transparent_1px),linear-gradient(to_bottom,#00ffff_1px,transparent_1px)] bg-[size:60px_60px]" />

      {/* Reactive Defence Field */}
      <div
        className="pointer-events-none absolute inset-0 z-[2]"
        style={{
          background: `radial-gradient(600px circle at var(--x, -1000px) var(--y, -1000px), rgba(0, 255, 255, 0.08), transparent 70%)`,
        }}
      />

      {/* Vertical Scanline Overlay */}
      <div className="absolute inset-0 z-[3] pointer-events-none opacity-20 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.01),rgba(0,255,0,0.005),rgba(0,0,255,0.01))] bg-[length:100%_2px,3px_100%]" />

      {/* MAIN CONTENT AREA */}
      <div className="relative z-10 px-6 md:px-16 lg:px-32 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center w-full max-w-7xl">
        
        {/* Left Column: Mission Statement */}
        <div className={`lg:col-span-8 transition-all duration-1000 delay-300 ${isMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <div className="flex items-center gap-4 mb-6">
            <div className="h-[1px] w-12 bg-cyan-500/50"></div>
            <p className="font-mono text-[10px] tracking-[0.6em] text-cyan-400 uppercase">
              // TERMINAL_ACCESS_GRANTED
            </p>
          </div>

          <h1 className="text-5xl md:text-[100px] font-black tracking-tighter leading-[0.85] mb-8">
            Defending <span className="text-zinc-800 italic">Systems</span> <br />
            By <span className="text-cyan-500 underline decoration-1 underline-offset-8">Breaking</span> Rules.
          </h1>

          <div className="max-w-xl space-y-6">
            <p className="text-zinc-500 text-lg md:text-xl font-light leading-relaxed border-l border-zinc-800 pl-8">
              Jothish Gandham — A <span className="text-white">Security Analyst</span> specializing in identifying technical flaws and 
              strengthening digital infrastructure through <span className="text-zinc-300 italic">rapid adaptation</span> and adversarial logic.
            </p>
            
            <div className="flex flex-wrap gap-3 pl-8">
              {['Vulnerability Analysis', 'Network Defense', 'Quick Learner'].map((tag) => (
                <span key={tag} className="text-[9px] font-mono border border-zinc-800 px-3 py-1 rounded-full text-zinc-600 uppercase tracking-widest hover:border-cyan-500/50 hover:text-cyan-400 transition-colors">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-12 flex items-center gap-8 pl-8">
            <a 
              href="#projects" 
              className="group relative px-8 py-4 bg-transparent border border-cyan-500/50 text-cyan-400 font-bold text-[10px] tracking-[0.3em] uppercase overflow-hidden transition-all active:scale-95"
            >
              <span className="relative z-10">Initialize_Audit</span>
              <div className="absolute inset-0 bg-cyan-500 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300"></div>
            </a>

            <div className="hidden md:flex flex-col font-mono text-[9px] text-zinc-700">
               <span>LATENCY: 14MS</span>
               <span>STATUS: SECURE_LINK</span>
            </div>
          </div>
        </div>

        {/* Right Column: Live HUD Data */}
        <div className={`lg:col-span-4 hidden lg:block transition-all duration-1000 delay-500 ${isMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <div className="border border-white/5 bg-white/[0.01] backdrop-blur-sm p-8 space-y-8 rounded-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-cyan-500 animate-pulse"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            </div>
            
            <h4 className="font-mono text-[9px] tracking-[0.4em] text-zinc-500 uppercase border-b border-zinc-900 pb-4">Identity_Matrix</h4>
            
            <div className="space-y-4 font-mono text-[10px]">
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-zinc-600">NAME</span>
                <span className="text-zinc-300">JOTHISH G.</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-zinc-600">ROLE</span>
                <span className="text-cyan-500 uppercase tracking-tighter">Sec_Analyst</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-zinc-600">ADAPTABILITY</span>
                <span className="text-zinc-300 text-right">HIGH_ACCEL</span>
              </div>
              <div className="pt-4">
                 <p className="text-zinc-700 leading-relaxed italic">
                   "Focused on the Google Professional track to master enterprise defense and log forensics."
                 </p>
              </div>
            </div>

            <div className="pt-6 space-y-2">
               <div className="flex justify-between text-[8px] text-zinc-600 mb-1 font-mono uppercase tracking-widest">
                 <span>Syncing_DB</span>
                 <span>85%</span>
               </div>
               <div className="h-[1px] w-full bg-zinc-900 overflow-hidden">
                  <div className="h-full bg-cyan-500 animate-[loading_2s_ease-in-out_infinite]"></div>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Animated Edge Line */}
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-zinc-800 to-transparent"></div>
      
      <style jsx>{`
        @keyframes loading {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(0); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}