"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";

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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 items-start">
      
      {/* LEFT: TEXT DATA */}
      <div className="lg:col-span-5 space-y-10 order-2 lg:order-1">
        <div className="space-y-4">
          <div className="font-mono text-[10px] text-[var(--accent)] tracking-[0.4em] uppercase">
            IDENTITY
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-7xl font-black tracking-tighter uppercase leading-[0.85]">
            Jothish <span className="text-muted italic font-light">Gandham</span>
          </h2>
          <div className="font-mono text-xs text-muted tracking-tight border-y border-surface py-3 flex items-center justify-between">
            <span>
              Security Learner | <span className="text-[var(--accent)] font-bold">Blue Team • SOC • Hands-on Projects</span>
            </span>
          </div>
        </div>
        
        <div className="border-l border-surface pl-10 space-y-6">
          <p className="text-muted text-sm leading-relaxed">
            I enjoy understanding how systems behave instead of memorizing concepts. That curiosity led me into networking, operating systems, and defensive security.
          </p>
          <div className="w-12 h-px bg-surface"></div>
          <p className="text-muted text-sm leading-relaxed">
            Today I spend most of my time building projects, experimenting with tools like Linux, Wireshark and Splunk, and documenting what I learn.
          </p>
          <p className="text-muted text-sm leading-relaxed">
            My goal is simple: build practical skills first, then contribute as a SOC analyst.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            {["Linux", "Networking", "Threat Detection", "SOC Learning"].map((trait) => (
              <span key={trait} className="group text-[9px] font-mono px-3 py-1 bg-surface border border-surface text-muted uppercase tracking-widest cursor-default transition-colors hover:text-foreground hover:border-[var(--accent)]">
                {trait}
              </span>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-4 pt-6">
            <a href="https://github.com/jothish-blip" target="_blank" rel="noopener noreferrer" className="px-4 py-2 border border-surface rounded-sm font-mono text-[10px] text-muted hover:text-[var(--accent)] hover:border-[var(--accent)] hover:bg-surface transition-all uppercase tracking-widest flex items-center gap-1.5">
              GitHub ↗
            </a>
            <a href="https://www.linkedin.com/in/jothish-gandham-5b90b334a/" target="_blank" rel="noopener noreferrer" className="px-4 py-2 border border-surface rounded-sm font-mono text-[10px] text-muted hover:text-[var(--accent)] hover:border-[var(--accent)] hover:bg-surface transition-all uppercase tracking-widest flex items-center gap-1.5">
              LinkedIn ↗
            </a>
            
            {/* FLOATING DROPDOWN MENU */}
            <div ref={dropdownRef} className="relative">
              <button
                onClick={() => setShowResumeOptions((prev) => !prev)}
                className="px-4 py-2 border border-surface rounded-sm font-mono text-[10px] text-foreground hover:text-[var(--accent)] hover:border-[var(--accent)] hover:bg-surface transition-all uppercase tracking-widest flex items-center gap-1.5"
              >
                Resume ▼
              </button>

              {showResumeOptions && (
                <div className="absolute top-full mt-2 left-0 w-[200px] border border-surface bg-background backdrop-blur-md shadow-lg z-50 rounded-sm overflow-hidden">
                  <a
                    href="/Resume"
                    className="block px-4 py-3 text-[10px] font-mono uppercase tracking-widest text-muted hover:text-[var(--accent)] hover:bg-surface transition"
                    onClick={() => setShowResumeOptions(false)}
                  >
                    View Resume
                  </a>
                  <a
                    href="/Resume.pdf"
                    download
                    className="block px-4 py-3 text-[10px] font-mono uppercase tracking-widest text-muted hover:text-[var(--accent)] hover:bg-surface transition border-t border-surface"
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
      <div className="lg:col-span-3 order-1 lg:order-2">
        <div className="relative group max-w-[280px] mx-auto lg:mx-0">
            <div className="absolute -inset-2 border border-[var(--accent-soft)] opacity-50 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
            <div className="relative border border-surface p-2 bg-surface-strong backdrop-blur-sm overflow-hidden rounded-sm">
                <div className="absolute top-0 left-0 w-full h-[1px] bg-[var(--accent)] opacity-30 animate-scan z-10 pointer-events-none"></div>
                <img 
                    src="/images/profile.jpeg"
                    alt="Jothish Gandham"
                    className="w-full h-auto object-cover md:grayscale md:brightness-75 md:group-hover:grayscale-0 md:group-hover:brightness-100 transition-all duration-700 ease-in-out border border-surface"
                />
            </div>
            <div className="mt-3 flex justify-between items-center px-1 font-mono text-[9px] text-muted uppercase tracking-[0.2em]">
                <span>Identity Record</span>
                <span className="text-[var(--accent)]">Verified</span>
            </div>
        </div>
      </div>

      {/* RIGHT: EDUCATION, FOCUS & STATUS */}
      <div className="lg:col-span-4 space-y-10 order-3 border-l border-surface pl-6 lg:pl-10">
        
        {/* Education & Timeline */}
        <div className="space-y-6">
            <h4 className="font-mono text-[10px] text-[var(--accent)] uppercase tracking-[0.4em]">EDUCATION</h4>
            
            <div className="space-y-3 font-mono text-[11px]">
                <div className="relative p-3 border border-transparent rounded-sm hover:border-[var(--accent)] hover:bg-surface transition-all duration-300">
                    <span className="absolute -left-[35px] lg:-left-[47px] top-1/2 -translate-y-1/2 w-2 h-2 bg-[var(--accent)] rounded-full"></span>
                    <p className="text-foreground font-bold leading-tight flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
                      B.Tech CSE (Cyber Security)
                    </p>
                    <p className="text-muted mt-1">Sandip University, Nashik</p>
                    <p className="text-muted text-[10px] mt-1">2024 — 2028</p>
                </div>
                
                {/* Mini Timeline */}
                <div className="ml-4 pl-4 border-l border-surface text-[9px] font-mono text-muted uppercase tracking-widest space-y-2 py-2">
                    <div className="text-[var(--accent)] font-bold">2026</div>
                    <div>Started Cyber Security</div>
                    <div className="opacity-40">↓</div>
                    <div>Networking</div>
                    <div className="opacity-40">↓</div>
                    <div>Linux</div>
                    <div className="opacity-40">↓</div>
                    <div>Projects</div>
                    <div className="opacity-40">↓</div>
                    <div>SOC Learning</div>
                </div>

                <div className="relative p-3 border border-transparent rounded-sm hover:border-surface hover:bg-surface transition-all duration-300 opacity-70">
                    <span className="absolute -left-[35px] lg:-left-[47px] top-1/2 -translate-y-1/2 w-2 h-2 bg-surface-strong border border-surface rounded-full"></span>
                    <p className="text-foreground font-bold leading-tight flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2ZM8 7h6M8 11h8"/></svg>
                      Intermediate (MPC)
                    </p>
                    <p className="text-muted mt-1">Narayana Junior College, Vijayawada</p>
                    <p className="text-muted text-[10px] mt-1">2022 — 2024</p>
                </div>
            </div>
        </div>

        {/* Current Focus */}
        <div className="space-y-4 border-t border-surface pt-8">
            <h4 className="font-mono text-[10px] text-muted uppercase tracking-[0.4em]">CURRENT FOCUS</h4>
            <ul className="grid grid-cols-2 gap-y-3 gap-x-2 font-mono text-[10px] text-muted tracking-widest uppercase">
              <li className="flex items-center gap-2"><span className="text-[var(--accent)]">•</span> SOC Learning</li>
              <li className="flex items-center gap-2"><span className="text-[var(--accent)]">•</span> Linux</li>
              <li className="flex items-center gap-2"><span className="text-[var(--accent)]">•</span> Network Analysis</li>
              <li className="flex items-center gap-2"><span className="text-[var(--accent)]">•</span> Splunk</li>
              <li className="flex items-center gap-2"><span className="text-[var(--accent)]">•</span> Project Dev</li>
              <li className="flex items-center gap-2"><span className="text-[var(--accent)]">•</span> Documentation</li>
            </ul>
        </div>
        
        {/* Status Card */}
        <div className="p-5 bg-surface border border-surface rounded-sm space-y-4">
            <p className="text-[10px] font-mono text-muted uppercase tracking-widest">CURRENT STATUS</p>
            <p className="text-[11px] font-mono text-[var(--accent)] uppercase tracking-widest font-bold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                Open to Opportunities
            </p>
            <div className="flex flex-col gap-2 font-mono text-[10px] text-muted pt-2 border-t border-surface/50">
              <div className="flex justify-between">
                <span>Location:</span>
                <span className="text-foreground">India</span>
              </div>
              <div className="flex justify-between">
                <span>Availability:</span>
                <span className="text-foreground">Immediate</span>
              </div>
            </div>
        </div>

      </div>
    </div>
  );
}