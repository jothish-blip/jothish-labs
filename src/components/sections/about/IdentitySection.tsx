"use client";

import { useState, useEffect, useRef } from "react";
import { ExternalLink, ChevronDown } from "lucide-react";

export default function IdentitySection() {
  const [showResumeOptions, setShowResumeOptions] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowResumeOptions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12 items-start max-w-6xl mx-auto px-4 md:px-0">
      
      {/* Local Styles for dynamic accent hovers */}
      <style>{`
        .identity-btn:hover {
          color: var(--accent-about) !important;
          border-color: color-mix(in srgb, var(--accent-about) 40%, transparent) !important;
          background-color: color-mix(in srgb, var(--accent-about) 10%, transparent) !important;
        }
        .identity-link:hover {
          color: var(--accent-about) !important;
          background-color: color-mix(in srgb, var(--accent-about) 10%, transparent) !important;
        }
      `}</style>

      {/* LEFT: TEXT DATA */}
      <div className="lg:col-span-5 space-y-10 order-2 lg:order-1">
        <div className="space-y-4">
          <div 
            className="font-mono text-[9px] tracking-[0.24em] uppercase"
            style={{ color: 'var(--accent-about)' }}
          >
            {"// Identity"}
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight uppercase leading-[0.9] text-foreground">
            Jothish <span className="text-muted italic font-light">Gandham</span>
          </h2>
          <div className="font-mono text-[10px] text-muted tracking-wide border-y border-surface py-3 flex items-center justify-between">
            <span>
              Security Learner | <span className="font-medium" style={{ color: 'var(--accent-about)' }}>Blue Team • SOC • Labs</span>
            </span>
          </div>
        </div>
        
        <div className="border-l border-surface pl-8 lg:pl-10 space-y-6">
          <p className="text-[13px] text-muted leading-relaxed">
            I enjoy understanding how systems behave instead of memorizing concepts. That curiosity led me into networking, operating systems, and defensive security.
          </p>
          <div className="w-8 h-px bg-surface"></div>
          <p className="text-[13px] text-muted leading-relaxed">
            Today I spend most of my time building projects, experimenting with tools like Linux, Wireshark, and Splunk, and documenting what I learn.
          </p>
          <p className="text-[13px] text-muted leading-relaxed">
            My goal is simple: build practical skills first, then contribute as a SOC analyst.
          </p>

          <div className="flex flex-wrap gap-2 pt-2">
            {["Linux", "Networking", "Threat Detection", "SOC Learning"].map((trait) => (
              <span key={trait} className="text-[9px] font-mono px-2 py-1 bg-surface/20 border border-surface text-muted uppercase tracking-[0.24em] cursor-default transition-colors hover:bg-background hover:text-foreground">
                {trait}
              </span>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-6">
            <a 
              href="https://github.com/jothish-blip" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="identity-btn px-4 py-2.5 border border-surface rounded-sm font-mono text-[9px] text-muted hover:border-surface-strong transition-all uppercase tracking-[0.24em] flex items-center gap-1.5"
            >
              GitHub <ExternalLink size={10} />
            </a>
            <a 
              href="https://www.linkedin.com/in/jothish-gandham-5b90b334a/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="identity-btn px-4 py-2.5 border border-surface rounded-sm font-mono text-[9px] text-muted hover:border-surface-strong transition-all uppercase tracking-[0.24em] flex items-center gap-1.5"
            >
              LinkedIn <ExternalLink size={10} />
            </a>
            
            {/* FLOATING DROPDOWN MENU */}
            <div ref={dropdownRef} className="relative">
              <button
                onClick={() => setShowResumeOptions((prev) => !prev)}
                className="px-4 py-2.5 border border-surface rounded-sm font-mono text-[9px] hover:opacity-80 transition-all uppercase tracking-[0.24em] flex items-center gap-1.5"
                style={{ color: 'var(--accent-about)' }}
              >
                Resume <ChevronDown size={12} className={`transition-transform duration-300 ${showResumeOptions ? "rotate-180" : ""}`} />
              </button>

              {showResumeOptions && (
                <div className="absolute top-full mt-2 left-0 w-[180px] border border-surface bg-background/95 backdrop-blur-sm shadow-xl z-50 rounded-sm overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                  <a
                    href="/Resume"
                    className="identity-link block px-4 py-3 text-[9px] font-mono uppercase tracking-[0.24em] text-muted transition-colors"
                    onClick={() => setShowResumeOptions(false)}
                  >
                    View Resume
                  </a>
                  <a
                    href="/Resume.pdf"
                    download
                    className="identity-link block px-4 py-3 text-[9px] font-mono uppercase tracking-[0.24em] text-muted transition-colors border-t border-surface"
                    onClick={() => setShowResumeOptions(false)}
                  >
                    Download PDF
                  </a>
                </div>
              )}
            </div>
            
          </div>
        </div>
      </div>

      {/* CENTER: PROFILE PHOTO */}
      <div className="lg:col-span-3 order-1 lg:order-2 flex flex-col items-center lg:items-start pt-2">
        <div className="relative group w-full max-w-[260px] mx-auto lg:mx-0">
            <div className="relative border border-surface p-2 bg-surface/10 rounded-md overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                    src="/images/profile.jpeg"
                    alt="Jothish Gandham"
                    className="w-full h-auto object-cover border border-surface rounded-sm transition-all duration-700 ease-in-out grayscale-0 opacity-100 lg:grayscale lg:opacity-80 group-hover:grayscale-0 group-hover:opacity-100"
                />
            </div>
            <div className="mt-4 flex justify-between items-center px-1 font-mono text-[8px] text-muted uppercase tracking-[0.24em]">
                <span>Identity Record</span>
                <span className="flex items-center gap-1.5" style={{ color: 'var(--accent-about)' }}>
                  <span className="h-1 w-1 rounded-full" style={{ backgroundColor: 'var(--accent-about)' }}></span>
                  Verified
                </span>
            </div>
        </div>
      </div>

      {/* RIGHT: EDUCATION, FOCUS & STATUS */}
      <div className="lg:col-span-4 space-y-10 order-3 lg:border-l border-surface pt-8 lg:pt-0 lg:pl-10">
        
        {/* Education & Timeline */}
        <div className="space-y-6">
            <h4 
              className="font-mono text-[9px] uppercase tracking-[0.24em]"
              style={{ color: 'var(--accent-about)' }}
            >
              {"// Education"}
            </h4>
            
            <div className="space-y-2">
                <div className="relative p-4 border border-transparent rounded-md hover:border-surface hover:bg-surface/10 transition-all duration-300">
                    <span 
                      className="hidden lg:block absolute -left-[45px] top-[26px] w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: 'var(--accent-about)' }}
                    ></span>
                    <p className="text-[13px] text-foreground font-medium leading-tight mb-1">
                      B.Tech CSE (Cyber Security)
                    </p>
                    <p className="text-[11px] text-muted">Sandip University, Nashik</p>
                    <p className="text-[9px] font-mono uppercase tracking-[0.24em] text-muted/60 mt-3">2024 — 2028</p>
                </div>
                
                {/* Mini Timeline */}
                <div className="ml-4 pl-4 border-l border-surface text-[8px] font-mono text-muted uppercase tracking-[0.24em] space-y-3 py-3">
                    <div style={{ color: 'var(--accent-about)' }}>2026</div>
                    <div className="flex items-center gap-2"><span className="h-[1px] w-2 bg-surface"></span> Started Cyber Security</div>
                    <div className="flex items-center gap-2"><span className="h-[1px] w-2 bg-surface"></span> Networking</div>
                    <div className="flex items-center gap-2"><span className="h-[1px] w-2 bg-surface"></span> Linux</div>
                    <div className="flex items-center gap-2"><span className="h-[1px] w-2 bg-surface"></span> Projects</div>
                    <div className="flex items-center gap-2"><span className="h-[1px] w-2 bg-surface"></span> SOC Learning</div>
                </div>

                <div className="relative p-4 border border-transparent rounded-md hover:border-surface hover:bg-surface/10 transition-all duration-300 opacity-70">
                    <span className="hidden lg:block absolute -left-[45px] top-[26px] w-1.5 h-1.5 bg-surface-strong rounded-full"></span>
                    <p className="text-[13px] text-foreground font-medium leading-tight mb-1">
                      Intermediate (MPC)
                    </p>
                    <p className="text-[11px] text-muted">Narayana Junior College, Vijayawada</p>
                    <p className="text-[9px] font-mono uppercase tracking-[0.24em] text-muted/60 mt-3">2022 — 2024</p>
                </div>
            </div>
        </div>

        {/* Current Focus */}
        <div className="space-y-5 border-t border-surface pt-8">
            <h4 className="font-mono text-[9px] text-muted uppercase tracking-[0.24em]">
              Current Focus
            </h4>
            <ul className="grid grid-cols-2 gap-y-3 gap-x-2 font-mono text-[9px] text-muted tracking-[0.24em] uppercase">
              {["SOC Learning", "Linux", "Network Analysis", "Splunk", "Project Dev", "Documentation"].map((item) => (
                <li key={item} className="flex items-center gap-2.5">
                  <span className="h-1 w-1 bg-surface-strong rounded-full"></span> {item}
                </li>
              ))}
            </ul>
        </div>
        
        {/* Status Card */}
        <div className="p-5 bg-background border border-surface rounded-md space-y-5">
            <p className="text-[9px] font-mono text-muted uppercase tracking-[0.24em]">
              Current Status
            </p>
            <p className="text-[11px] font-mono text-foreground uppercase tracking-[0.24em] flex items-center gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Open to Opportunities
            </p>
            <div className="flex flex-col gap-3 font-mono text-[9px] uppercase tracking-[0.24em] text-muted pt-4 border-t border-surface/50">
              <div className="flex justify-between items-center">
                <span>Location:</span>
                <span className="text-foreground">India</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Availability:</span>
                <span className="text-foreground">Immediate</span>
              </div>
            </div>
        </div>

      </div>
    </div>
  );
}