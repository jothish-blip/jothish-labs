"use client";

import { useEffect, useRef, useState } from "react";
import { Mail, Phone, ArrowRight } from "lucide-react";

// Custom SVGs to bypass lucide-react brand export errors
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
    // eslint-disable-next-line react-hooks/set-state-in-effect
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

    return () => {
      window.removeEventListener("mousemove", move);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const handleInteraction = () => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(10);
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen w-full text-foreground overflow-hidden flex flex-col items-center justify-center pt-28 md:pt-36 border-b border-surface" 
    >
      {/* 
        LOCAL STYLES: SINGLE VIBRANT ACCENT
        Consistent with your other sections, but highly saturated to provide
        that "dopamine" hit in the hero.
      */}
      <style>{`
        :root {
          --accent-hero: #6366f1; /* Vibrant Indigo */
        }
        html.dark {
          --accent-hero: #818cf8; /* Bright Indigo */
        }
        .hero-btn-primary {
          background-color: var(--accent-hero);
          color: white !important;
          border: 1px solid var(--accent-hero) !important;
        }
        .hero-btn-primary:hover {
          box-shadow: 0 0 25px color-mix(in srgb, var(--accent-hero) 50%, transparent);
          transform: translateY(-2px);
        }
        .hud-border-glow:hover {
          border-color: var(--accent-hero) !important;
          box-shadow: 0 0 30px color-mix(in srgb, var(--accent-hero) 20%, transparent);
        }
      `}</style>

      {/* --- RADIOLUCENT (X-RAY) & DOPAMINE EFFECTS --- */}
      
      {/* 1. Static X-Ray Glow (Single Color Pop on Mount) */}
      <div 
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[200px] md:w-[800px] md:h-[500px] blur-[100px] rounded-[100%] pointer-events-none transition-all duration-1000 ease-out ${isMounted ? "opacity-30 md:opacity-20 scale-100" : "opacity-0 scale-90"}`}
        style={{ 
          backgroundColor: 'var(--accent-hero)',
          mixBlendMode: 'screen'
        }}
      />

      {/* 2. Interactive Mouse Tracking Glow (Dopamine hit) */}
      <div
        className={`pointer-events-none absolute inset-0 z-[2] transition-opacity duration-1000 ${isMounted ? "opacity-100" : "opacity-0"}`}
        style={{
          background: `radial-gradient(600px circle at var(--x, -1000px) var(--y, -1000px), color-mix(in srgb, var(--accent-hero) 8%, transparent), transparent 40%)`,
        }}
      />

      {/* 3. Dotted Micro-Grid Overlay */}
      <div className="absolute inset-0 z-[1] opacity-[0.03] dark:opacity-[0.04] bg-[radial-gradient(circle,currentColor_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />

      {/* 4. Subtle Scanline */}
      <div className="absolute inset-0 z-[3] pointer-events-none opacity-[0.02] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%)] bg-[length:100%_2px]" />

      {/* --- MAIN CONTENT --- */}
      <div className="relative z-10 px-6 md:px-12 lg:px-20 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start w-full max-w-7xl mb-24 md:mb-10">
        
        {/* LEFT COLUMN */}
        <div className={`lg:col-span-8 transition-all duration-1000 delay-100 ${isMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          
          <p 
            className="text-[9px] font-mono mb-6 tracking-[0.24em] uppercase"
            style={{ color: 'var(--accent-hero)' }}
          >
            {"// Jothish Gandham · Aspiring SOC Analyst"}
          </p>
          
          {/* Availability Strip */}
          <div className="flex flex-wrap gap-3 mb-8 font-mono text-[9px] tracking-[0.24em] uppercase">
            <span className="flex items-center gap-2 text-foreground border border-surface px-3 py-1.5 rounded-sm bg-surface/30 backdrop-blur-sm shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Available for SOC Internship
            </span>
            <span className="text-muted border border-transparent px-3 py-1.5 cursor-default hover:text-foreground transition-colors">
              Continuous Learner
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-7xl lg:text-[80px] font-semibold tracking-tighter leading-[0.9] mb-10 uppercase text-foreground">
            Building <span className="italic text-muted font-light">Secure</span>.<br />
            Learning <span className="font-bold drop-shadow-sm" style={{ color: 'var(--accent-hero)' }}>Every Day</span>.
          </h1>

          <div className="max-w-2xl space-y-8">
            <div className="border-l-2 border-transparent pl-6 lg:pl-8 space-y-4" style={{ borderImage: 'linear-gradient(to bottom, var(--accent-hero), transparent) 1' }}>
              <p className="text-muted text-[14px] md:text-[15px] leading-relaxed">
                I build defensive cybersecurity skills through <span className="text-foreground font-medium">home labs, SOC simulations, SIEM investigations</span>, and hands-on projects that mirror real-world analyst workflows.
              </p>
            </div>
            
            {/* Divider fading out */}
            <div 
              className="h-[1px] w-16 ml-6 lg:ml-8 my-8" 
              style={{ background: 'linear-gradient(90deg, var(--accent-hero), transparent)' }}
            ></div>
            
            {/* Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pl-6 lg:pl-8">
              {[
                { label: "Projects", value: "12+" },
                { label: "Labs", value: "20+" },
                { label: "CTFs", value: "-" },
                { label: "Learning", value: "Daily", isAccent: true }
              ].map((stat) => (
                <div key={stat.label} className="space-y-1.5 group">
                  <p className="font-mono text-[9px] text-muted uppercase tracking-[0.24em] transition-colors group-hover:text-foreground">
                    {stat.label}
                  </p>
                  <p 
                    className={`text-xl font-semibold leading-tight ${stat.isAccent ? "italic drop-shadow-sm" : "text-foreground"}`}
                    style={stat.isAccent ? { color: 'var(--accent-hero)' } : {}}
                  >
                    {stat.value}
                  </p>
                </div>
              ))}
            </div>

            {/* Tech Tags - Vibrant Hover Effects */}
            <div className="flex flex-wrap gap-2 pl-6 lg:pl-8 pt-4">
              {['Network Security', 'Threat Detection', 'Incident Response', 'SIEM', 'Blue Team', 'Linux', 'SQL', 'Python'].map((tag) => (
                <span 
                  key={tag} 
                  className="font-mono text-[9px] border border-surface bg-surface/20 px-2.5 py-1.5 rounded-sm text-muted uppercase tracking-[0.24em] cursor-default transition-all hover:text-white hover:border-transparent"
                  style={{ '--hover-bg': 'var(--accent-hero)' } as React.CSSProperties}
                >
                  <style jsx>{` span:hover { background-color: var(--hover-bg); box-shadow: 0 0 10px color-mix(in srgb, var(--hover-bg) 40%, transparent); } `}</style>
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="mt-12 flex flex-wrap items-center gap-4 pl-6 lg:pl-8">
            <a 
              href="#projects"
              onClick={handleInteraction}
              className="hero-btn-primary px-8 py-3.5 font-mono text-[9px] tracking-[0.24em] uppercase rounded-sm flex items-center gap-2 focus:outline-none transition-all duration-300"
            >
              See Security Projects
            </a>
            <a
              href="/Resume"
              onClick={handleInteraction}
              className="px-8 py-3.5 border border-surface bg-surface/20 text-foreground hover:bg-surface font-mono text-[9px] uppercase tracking-[0.24em] transition-all duration-300 hover:-translate-y-[2px] rounded-sm flex items-center gap-2 focus:outline-none"
            >
              View Resume <ArrowRight size={12} />
            </a>
          </div>

          {/* Contact Bar */}
          <div className="mt-16 pl-6 lg:pl-8 border-t border-surface pt-8">
            <h3 className="font-mono text-[9px] tracking-[0.24em] text-muted uppercase mb-5">
              Let&apos;s Connect
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl">
              
              <a 
                href="https://linkedin.com/in/jothish-gandham" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 border border-surface bg-surface/10 hover:bg-surface/50 hover:border-surface-strong rounded-sm group transition-all"
              >
                <LinkedinIcon className="w-4 h-4 text-muted group-hover:text-foreground transition-colors" />
                <span className="text-[10px] font-mono text-muted group-hover:text-foreground tracking-[0.1em] truncate transition-colors">
                  linkedin.com/in/jothish
                </span>
              </a>
              
              <a 
                href="https://github.com/jothish-blip" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 border border-surface bg-surface/10 hover:bg-surface/50 hover:border-surface-strong rounded-sm group transition-all"
              >
                <GithubIcon className="w-4 h-4 text-muted group-hover:text-foreground transition-colors" />
                <span className="text-[10px] font-mono text-muted group-hover:text-foreground tracking-[0.1em] truncate transition-colors">
                  github.com/jothish-blip
                </span>
              </a>

              <a 
                href="mailto:jothishgandham2@gmail.com" 
                className="flex items-center gap-3 p-3 border border-surface bg-surface/10 hover:bg-surface/50 hover:border-surface-strong rounded-sm group transition-all"
              >
                <Mail className="w-4 h-4 text-muted group-hover:text-foreground transition-colors" />
                <span className="text-[9px] font-mono text-muted group-hover:text-foreground tracking-[0.1em] truncate transition-colors">
                  jothishgandham2@gmail.com
                </span>
              </a>

              <a 
                href="tel:+918374754009" 
                className="flex items-center gap-3 p-3 border border-surface bg-surface/10 hover:bg-surface/50 hover:border-surface-strong rounded-sm group transition-all"
              >
                <Phone className="w-4 h-4 text-muted group-hover:text-foreground transition-colors" />
                <span className="text-[9px] font-mono text-muted group-hover:text-foreground tracking-[0.1em] truncate transition-colors">
                  +91 8374754009
                </span>
              </a>

            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: HUD */}
        <div className={`lg:col-span-4 hidden lg:block transition-all duration-1000 delay-300 ${isMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <div className="hud-border-glow border border-surface bg-background/50 backdrop-blur-md p-8 rounded-md relative overflow-hidden flex flex-col justify-between min-h-[500px] transition-all duration-500">
            
            <div className="space-y-8 relative z-10">
              <div className="border-b border-surface pb-5">
                <h4 className="font-mono text-[10px] font-bold tracking-[0.24em] text-foreground uppercase">
                  Jothish_Gandham
                </h4>
                <p 
                  className="font-mono text-[9px] tracking-[0.24em] uppercase mt-2 font-bold drop-shadow-sm"
                  style={{ color: 'var(--accent-hero)' }}
                >
                  Aspiring SOC Analyst
                </p>
              </div>
              
              <div className="space-y-6">
                
                <div className="flex flex-col gap-2 border-b border-surface pb-4">
                  <span className="font-mono text-[9px] text-muted uppercase tracking-[0.24em]">Role</span>
                  <span 
                    className="font-mono text-[10px] uppercase tracking-[0.24em] font-medium"
                    style={{ color: 'var(--accent-hero)' }}
                  >
                    Security Operations
                  </span>
                </div>
                
                <div className="border-b border-surface pb-4">
                  <span className="font-mono text-[9px] text-muted uppercase tracking-[0.24em] block mb-3">Current Focus</span>
                  <div className="space-y-2.5 font-mono text-[9px] tracking-[0.24em] uppercase text-foreground">
                    <p className="flex items-center gap-2.5">
                      <span className="h-1.5 w-1.5 rounded-full shadow-[0_0_8px_currentColor]" style={{ backgroundColor: 'var(--accent-hero)', color: 'var(--accent-hero)' }}></span> 
                      SOC Operations
                    </p>
                    <p className="flex items-center gap-2.5">
                      <span className="h-1.5 w-1.5 rounded-full shadow-[0_0_8px_currentColor]" style={{ backgroundColor: 'var(--accent-hero)', color: 'var(--accent-hero)' }}></span> 
                      SIEM & Log Analysis
                    </p>
                    <p className="flex items-center gap-2.5">
                      <span className="h-1.5 w-1.5 rounded-full shadow-[0_0_8px_currentColor]" style={{ backgroundColor: 'var(--accent-hero)', color: 'var(--accent-hero)' }}></span> 
                      Detection Engineering
                    </p>
                    <p className="flex items-center gap-2.5">
                      <span className="h-1.5 w-1.5 rounded-full shadow-[0_0_8px_currentColor]" style={{ backgroundColor: 'var(--accent-hero)', color: 'var(--accent-hero)' }}></span> 
                      Incident Response
                    </p>
                  </div>
                </div>
                
                <div className="flex flex-col gap-3 border-b border-surface pb-4">
                  <span className="font-mono text-[9px] text-muted uppercase tracking-[0.24em]">Objective</span>
                  <span className="text-muted text-[12px] leading-relaxed">
                    Secure a SOC Internship & defend real-world infrastructure.
                  </span>
                </div>
                
                <div className="flex justify-between items-center pt-2">
                  <span className="font-mono text-[9px] text-muted uppercase tracking-[0.24em]">Status</span>
                  <span className="font-mono text-[9px] uppercase tracking-[0.24em] text-emerald-500 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_currentColor]"></span>
                    Available
                  </span>
                </div>

              </div>
            </div>

            <p className="text-[9px] text-muted font-mono mt-8 border-t border-surface pt-5 uppercase tracking-[0.24em] flex justify-between relative z-10">
              <span>Based in India</span>
              <span>Learning Daily</span>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}