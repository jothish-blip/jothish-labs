"use client";
import { useEffect, useRef, useState } from "react";
import { Mail, Phone } from "lucide-react";

// ✅ Custom SVGs to bypass lucide-react brand export errors
const GithubIcon = ({ className }: { className?: string }) => (
  <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3-.3 6-1.5 6-6.5a5.4 5.4 0 0 0-1.5-3.8 5.3 5.3 0 0 0-.1-3.8s-1.2-.4-3.9 1.4a13.3 13.3 0 0 0-7 0C6.2 1.6 5 2 5 2a5.3 5.3 0 0 0-.1 3.8A5.4 5.4 0 0 0 3.5 9.5c0 5 3 6.2 6 6.5a4.8 4.8 0 0 0-1 3.2v4"></path>
    <path d="M9 18c-4.5 1.6-5-2.5-7-3"></path>
  </svg>
);

const LinkedinIcon = ({ className }: { className?: string }) => (
  <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
    <rect width="4" height="12" x="2" y="9"></rect>
    <circle cx="4" cy="4" r="2"></circle>
  </svg>
);

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const container = containerRef.current;
    if (!container) return;

    let currentX = 0;
    let currentY = 0;
    let animationFrameId: number;

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

      animationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", move);
    animate();

    // ✅ Performance: Cleanup event listener and animation frame
    return () => {
      window.removeEventListener("mousemove", move);
      cancelAnimationFrame(animationFrameId);
    };
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
          --hero-accent: #0891b2;
          --hero-accent-glow: rgba(8, 145, 178, 0.03);
          --hero-accent-grid: rgba(8, 145, 178, 0.08);
        }
        html.dark {
          --hero-accent: #22d3ee;
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

        {/* 🖱️ REACTIVE GLOW */}
        <div
          className="pointer-events-none absolute inset-0 z-[2]"
          style={{
            background: `radial-gradient(600px circle at var(--x, -1000px) var(--y, -1000px), var(--hero-accent-glow), transparent 70%)`,
          }}
        />

        {/* 📺 SCANLINE */}
        <div className="absolute inset-0 z-[3] pointer-events-none opacity-[0.02] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%)] bg-[length:100%_2px]" />

        {/* MAIN CONTENT */}
        <div className="relative z-10 px-6 md:px-16 lg:px-32 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center w-full max-w-7xl mb-24 md:mb-0">
          
          {/* Left Column */}
          <div className={`lg:col-span-8 transition-all duration-1000 delay-300 ${isMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
            
            <p className="text-[10px] font-mono text-muted mb-4 tracking-widest uppercase">
              JOTHISH GANDHAM / ASPIRING SOC ANALYST
            </p>
            
            {/* ⚡ AVAILABILITY STRIP */}
            <div className="flex flex-wrap gap-3 mb-8 font-mono text-[9px] tracking-widest uppercase transition-all">
              <span className="flex items-center gap-1.5 text-foreground border border-surface px-2 py-1 rounded-sm bg-surface shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                AVAILABLE FOR SOC INTERNSHIP
              </span>
              <span className="text-muted border border-surface px-2 py-1 rounded-sm hover:text-foreground transition-colors cursor-default">CONTINUOUS LEARNER</span>
            </div>

            <h1 className="text-5xl md:text-[80px] font-black tracking-tighter leading-[0.85] mb-10">
  Building <span className="italic" style={{ color: 'var(--hero-accent)' }}>Secure</span>.<br />
  Learning <span className="underline decoration-1 underline-offset-[12px]" style={{ color: 'var(--hero-accent)' }}>Every Day</span>.
</h1>

            <div className="max-w-2xl space-y-6">
              <div className="border-l-2 border-surface pl-8 space-y-4">
                {/* 🔥 PROOF-BASED INTRO */}
                <p className="text-muted text-lg md:text-xl font-light leading-relaxed">
                  I build defensive cybersecurity skills through <span className="text-foreground font-medium">home labs, SOC simulations, SIEM investigations</span>, and hands-on projects that mirror real-world analyst workflows.
                </p>
              </div>
              
              <div className="h-px w-16 bg-surface ml-8 my-8"></div>
              
              {/* 🔥 QUANTIFIABLE PROOF SIGNALS */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pl-8 font-mono">
                <div className="space-y-1 group">
                  <p className="text-[10px] text-muted uppercase tracking-widest transition-colors group-hover:text-foreground">Projects</p>
                  <p className="text-lg sm:text-xl text-foreground font-bold leading-tight">12+</p>
                </div>
                <div className="space-y-1 group">
                  <p className="text-[10px] text-muted uppercase tracking-widest transition-colors group-hover:text-foreground">Labs</p>
                  <p className="text-lg sm:text-xl text-foreground font-bold leading-tight">20+</p>
                </div>
                <div className="space-y-1 group">
                  <p className="text-[10px] text-muted uppercase tracking-widest transition-colors group-hover:text-foreground">CTFs</p>
                  <p className="text-lg sm:text-xl text-foreground font-bold leading-tight">-</p>
                </div>
                <div className="space-y-1 group">
                  <p className="text-[10px] text-muted uppercase tracking-widest transition-colors group-hover:text-foreground">Learning</p>
                  <p className="text-sm sm:text-base font-bold italic leading-tight mt-1" style={{ color: 'var(--hero-accent)' }}>Daily</p>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 pl-8 pt-4">
                {['Network Security', 'Threat Detection', 'Incident Response', 'SIEM', 'Blue Team', 'Linux' , 'SQL' , 'Python' ].map((tag, i) => (
                  <span 
                    key={tag} 
                    className="group text-[8px] font-mono border border-surface px-2 py-1 rounded-sm text-muted uppercase tracking-widest transition-all cursor-default bg-surface hover:text-foreground hover:border-surface-strong hover:-translate-y-[1px]"
                    style={{ transitionDelay: `${i * 50}ms` }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* 🔥 STRONGER CTA & 1-CLICK RESUME */}
            <div className="mt-12 flex flex-wrap items-center gap-6 pl-8">
              <a 
                href="#projects"
                onClick={handleInteraction}
                className="px-10 py-4 border font-bold text-[10px] tracking-[0.3em] uppercase transition-all hover:-translate-y-[2px] active:scale-95 rounded-sm shadow-sm hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                style={{ 
                  borderColor: 'var(--hero-accent)', 
                  color: 'var(--hero-accent)',
                  outlineColor: 'var(--hero-accent)'
                }}
              >
                See Security Projects
              </a>

              <a
                href="/Resume"
                onClick={handleInteraction}
                className="px-8 py-4 border border-surface text-muted hover:text-foreground hover:bg-surface-strong font-mono text-[10px] uppercase tracking-[0.3em] transition-all hover:-translate-y-[2px] active:scale-95 rounded-sm bg-surface flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-surface-strong"
              >
                View Resume →
              </a>
            </div>

            {/* 🔥 RESTRUCTURED CONTACT BAR */}
            <div className="mt-16 pl-8">
              <div className="mb-6">
                <h3 className="text-sm font-semibold tracking-[0.2em] text-foreground uppercase mb-2">
                  Let's Connect
                </h3>
              </div>

              <div className="flex flex-col gap-3 max-w-xl">
                {/* Primary Contacts - Larger */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <a 
                    href="https://linkedin.com/in/jothish-gandham" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    aria-label="LinkedIn Profile"
                    className="flex items-center gap-4 p-4 border border-surface bg-surface/40 hover:bg-surface hover:border-surface-strong rounded-sm group transition-all hover:-translate-y-[2px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-surface-strong"
                  >
                    <LinkedinIcon className="w-5 h-5 text-muted group-hover:text-foreground transition-colors" />
                    <span className="text-[10px] font-mono text-muted group-hover:text-foreground tracking-widest truncate transition-colors">
                      linkedin.com/in/jothish
                    </span>
                  </a>
                  
                  <a 
                    href="https://github.com/jothish-blip" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    aria-label="GitHub Profile"
                    className="flex items-center gap-4 p-4 border border-surface bg-surface/40 hover:bg-surface hover:border-surface-strong rounded-sm group transition-all hover:-translate-y-[2px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-surface-strong"
                  >
                    <GithubIcon className="w-5 h-5 text-muted group-hover:text-foreground transition-colors" />
                    <span className="text-[10px] font-mono text-muted group-hover:text-foreground tracking-widest truncate transition-colors">
                      github.com/jothish-blip
                    </span>
                  </a>
                </div>

                {/* Secondary Contacts - Smaller */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <a 
                    href="mailto:jothishgandham2@gmail.com" 
                    aria-label="Email Me"
                    className="flex items-center gap-3 p-3 border border-surface bg-surface/20 hover:bg-surface/60 hover:border-surface-strong rounded-sm group transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-surface-strong"
                  >
                    <Mail className="w-4 h-4 text-muted group-hover:text-foreground transition-colors" />
                    <span className="text-[9px] font-mono text-muted group-hover:text-foreground tracking-widest truncate transition-colors">
                      jothishgandham2@gmail.com
                    </span>
                  </a>

                  <a 
                    href="tel:+918374754009" 
                    aria-label="Call Me"
                    className="flex items-center gap-3 p-3 border border-surface bg-surface/20 hover:bg-surface/60 hover:border-surface-strong rounded-sm group transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-surface-strong"
                  >
                    <Phone className="w-4 h-4 text-muted group-hover:text-foreground transition-colors" />
                    <span className="text-[9px] font-mono text-muted group-hover:text-foreground tracking-widest truncate transition-colors">
                      +91 8374754009
                    </span>
                  </a>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: HUD */}
          <div className={`lg:col-span-4 hidden lg:block transition-all duration-1000 delay-500 ${isMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
            <div className="border border-surface bg-surface-strong/80 backdrop-blur-md p-8 rounded-sm relative overflow-hidden group transition-all hover:border-[var(--hero-accent)] flex flex-col justify-between h-full shadow-lg hover:shadow-xl hover:-translate-y-1" style={{ '--hover-border': 'var(--hero-accent)' } as React.CSSProperties}>
              
              <div className="space-y-8 relative z-10">
                <div className="border-b border-surface pb-4">
                  <h4 className="font-mono text-[10px] font-bold tracking-[0.4em] text-foreground uppercase">
                    JOTHISH_GANDHAM
                  </h4>
                  <p className="font-mono text-[8px] tracking-[0.2em] text-muted uppercase mt-2">
                    ASPIRING SOC ANALYST
                  </p>
                </div>
                
                <div className="space-y-4 font-mono text-[10px]">
                  <div className="flex justify-between border-b border-surface pb-2">
                    <span className="text-muted uppercase tracking-tighter">Role</span>
                    <span style={{ color: 'var(--hero-accent)' }}>Security Operations</span>
                  </div>
                  
                  {/* 🔥 CLEANER FOCUS LIST */}
                  <div className="border-b border-surface pb-2">
                    <span className="text-muted uppercase tracking-tighter block mb-3">Current Focus</span>
                    <div className="space-y-2 text-foreground pl-1 text-[9px] tracking-widest">
                      <p className="flex items-center gap-2"><span style={{ color: 'var(--hero-accent)' }}>✓</span> SOC Operations</p>
                      <p className="flex items-center gap-2"><span style={{ color: 'var(--hero-accent)' }}>✓</span> SIEM & Log Analysis</p>
                      <p className="flex items-center gap-2"><span style={{ color: 'var(--hero-accent)' }}>✓</span> Detection Engineering</p>
                      <p className="flex items-center gap-2"><span style={{ color: 'var(--hero-accent)' }}>✓</span> Incident Response</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2 border-b border-surface pb-2">
                    <span className="text-muted uppercase tracking-tighter">Objective</span>
                    <span className="text-muted text-[9px] leading-relaxed">Secure a SOC Internship & defend real-world infrastructure.</span>
                  </div>
                  
                  <div className="flex justify-between pt-1">
                    <span className="text-muted uppercase tracking-tighter">Status</span>
                    <span className="uppercase flex items-center gap-1.5" style={{ color: 'var(--hero-accent)' }}>
                      <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse"></span>
                      Open to Opportunities
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-[9px] text-muted font-mono mt-8 border-t border-surface pt-4 uppercase tracking-widest relative z-10">
                Based in India • Learning Daily
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}