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

  // Micro UX: Native app feel
  const handleInteraction = () => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(10);
    }
  };

  return (
    <>
      {/* 
        🎨 SYSTEM COLORS
      */}
      <style jsx global>{`
        :root {
          --hero-accent: #0891b2; /* Deeper for light mode */
          --hero-accent-glow: rgba(8, 145, 178, 0.03);
          --hero-accent-grid: rgba(8, 145, 178, 0.08);
        }
        html.dark {
          --hero-accent: #22d3ee; /* Vibrant for dark mode */
          --hero-accent-glow: rgba(34, 211, 238, 0.03);
          --hero-accent-grid: rgba(34, 211, 238, 0.05);
        }
      `}</style>

      <div
        ref={containerRef}
        className="relative min-h-screen w-full bg-background text-foreground overflow-hidden flex flex-col items-center justify-center pt-28 md:pt-36" 
      >
        {/* 🎯 SUBTLE GRID (Theme Aware) */}
        <div 
          className="absolute inset-0 z-[1] pointer-events-none" 
          style={{
            backgroundImage: `linear-gradient(to right, var(--hero-accent-grid) 1px, transparent 1px), linear-gradient(to bottom, var(--hero-accent-grid) 1px, transparent 1px)`,
            backgroundSize: '60px 60px'
          }}
        />

        {/* 🖱️ REACTIVE GLOW (Calmer & More Premium) */}
        <div
          className="pointer-events-none absolute inset-0 z-[2]"
          style={{
            background: `radial-gradient(600px circle at var(--x, -1000px) var(--y, -1000px), var(--hero-accent-glow), transparent 70%)`,
          }}
        />

        {/* 📺 SCANLINE (Minimal) */}
        <div className="absolute inset-0 z-[3] pointer-events-none opacity-[0.02] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%)] bg-[length:100%_2px]" />

        {/* MAIN CONTENT */}
        <div className="relative z-10 px-6 md:px-16 lg:px-32 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center w-full max-w-7xl">
          
          {/* Left Column: Mission Statement */}
          <div className={`lg:col-span-8 transition-all duration-1000 delay-300 ${isMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
            
            <p className="text-[10px] font-mono text-muted mb-4 tracking-widest uppercase">
              JOTHISH GANDHAM / SECURITY LEARNER
            </p>
            
            {/* ⚡ NEUTRAL STATUS STRIP (Cleaned up visual noise) */}
            <div className="flex flex-wrap gap-3 mb-8 font-mono text-[9px] tracking-widest uppercase">
              <span className="flex items-center gap-1.5 text-foreground border border-surface px-2 py-1 rounded-sm bg-surface shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'var(--hero-accent)' }}></span>
                OPEN_FOR_INTERNSHIPS
              </span>
              <span className="text-muted border border-surface px-2 py-1 rounded-sm">FOCUSED_ON_BLUE_TEAM</span>
              <span className="text-muted border border-surface px-2 py-1 rounded-sm">LEARNING_PROJECTS</span>
            </div>

            <h1 className="text-5xl md:text-[90px] font-black tracking-tighter leading-[0.85] mb-10">
              Understanding <span className="text-muted italic">Systems</span>.<br />
              By <span className="underline decoration-1 underline-offset-[12px]" style={{ color: 'var(--hero-accent)' }}>Breaking</span> Them.
            </h1>

            <div className="max-w-xl space-y-6">
              <div className="border-l-2 border-surface pl-8 space-y-4">
                <p className="text-muted text-lg md:text-xl font-light leading-relaxed">
                  Jothish Gandham — <span className="text-foreground font-medium">Security Analyst</span> specialized in vulnerability identification and threat analysis through <span className="text-muted italic">real-world simulations</span>.
                </p>
                <p className="text-muted text-sm font-light">
                  I don’t know everything yet — but I focus on understanding how systems actually behave when things go wrong.
                </p>
              </div>
              
              <div className="h-px w-16 bg-surface ml-8 my-8"></div>
              
              {/* PROOF SIGNALS */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pl-8 font-mono">
                <div className="space-y-1">
                  <p className="text-[10px] text-muted uppercase tracking-widest">Focus</p>
                  <p className="text-[12px] sm:text-[13px] text-foreground font-bold leading-tight">Network & System</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] text-muted uppercase tracking-widest">Core Tools</p>
                  <p className="text-[12px] sm:text-[13px] text-foreground font-bold leading-tight">Wireshark, SQL, Linux</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] text-muted uppercase tracking-widest">Track</p>
                  <p className="text-[12px] sm:text-[13px] font-bold italic leading-tight" style={{ color: 'var(--hero-accent)' }}>Learning Phase</p>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 pl-8 pt-2">
                {['Packet Analysis', 'Log Reading', 'Threat Detection', 'Observation'].map((tag) => (
                  <span 
                    key={tag} 
                    className="group text-[8px] font-mono border border-surface px-2 py-1 rounded-sm text-muted uppercase tracking-widest transition-all cursor-default bg-surface hover:text-foreground hover:border-surface-strong"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* PURPOSEFUL ACTION BUTTONS */}
            <div className="mt-12 flex flex-wrap items-center gap-6 pl-8">
              <a 
                href="#projects"
                onClick={handleInteraction}
                className="px-10 py-4 border font-bold text-[10px] tracking-[0.3em] uppercase transition-all active:scale-95 rounded-sm shadow-sm hover:shadow-md"
                style={{ 
                  borderColor: 'var(--hero-accent)', 
                  color: 'var(--hero-accent)',
                }}
              >
                Explore Projects
              </a>

              <a 
                href="/resume.pdf" 
                target="_blank"
                onClick={handleInteraction}
                className="px-8 py-4 border border-surface text-muted hover:text-foreground hover:bg-surface-strong font-mono text-[10px] uppercase tracking-[0.3em] transition-all active:scale-95 rounded-sm bg-surface"
              >
                View Resume
              </a>
            </div>

            <p className="text-[10px] text-muted ml-8 font-mono mt-10 tracking-widest uppercase">
              Based in India • Learning every day
            </p>

          </div>

          {/* Right Column: HUD */}
          <div className={`lg:col-span-4 hidden lg:block transition-all duration-1000 delay-500 ${isMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
            <div className="border border-surface bg-surface-strong/80 backdrop-blur-md p-8 rounded-sm relative overflow-hidden group transition-colors flex flex-col justify-between h-full" style={{ '--hover-border': 'var(--hero-accent)' } as React.CSSProperties}>
              
              <div className="space-y-8 relative z-10">
                <h4 className="font-mono text-[9px] tracking-[0.4em] text-muted uppercase border-b border-surface pb-4">
                  Identity_Matrix
                </h4>
                
                <div className="space-y-4 font-mono text-[10px]">
                  <div className="flex justify-between border-b border-surface pb-2 hover:bg-surface transition-colors">
                    <span className="text-muted uppercase tracking-tighter">Focus</span>
                    <span style={{ color: 'var(--hero-accent)' }}>BLUE_TEAM / SOC</span>
                  </div>
                  <div className="flex justify-between border-b border-surface pb-2 hover:bg-surface transition-colors">
                    <span className="text-muted uppercase tracking-tighter">Experience</span>
                    <span className="text-muted">Learning via Projects</span>
                  </div>
                  <div className="flex justify-between border-b border-surface pb-2 hover:bg-surface transition-colors">
                    <span className="text-muted uppercase tracking-tighter">Status</span>
                    <span className="text-muted uppercase">Active_Learning</span>
                  </div>
                </div>

                <div className="pt-2 space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'var(--hero-accent)' }}></div>
                    <span className="font-mono text-[9px] text-muted uppercase tracking-widest">
                      System_Status
                    </span>
                  </div>
                  <div className="bg-surface/50 border border-surface p-3 rounded-sm">
                    <p className="text-muted text-[10px] font-mono leading-relaxed">
                      Actively learning and building projects. Expanding capabilities in threat detection.
                    </p>
                  </div>
                </div>
              </div>

              <p className="text-[9px] text-muted font-mono mt-6 border-t border-surface pt-4 uppercase tracking-widest relative z-10">
                Still building. Still learning.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}