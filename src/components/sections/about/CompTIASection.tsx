"use client";

import React, { useState } from "react";
import { activeCerts } from "./data";
import { trackEvent, TELEMETRY_EVENTS } from "@/lib/telemetry/events";

// Red specifically for the CompTIA brand wordmark
function CompTIAWordmark() {
  return (
    // REMOVED 'uppercase' class from here
    <span className="font-semibold tracking-tight text-2xl md:text-3xl text-foreground">
      <span className="text-[#E4002B]">CompTIA</span>
    </span>
  );
}

// Subtitle component tied to the About accent
function CompTIASubtitle() {
  return (
    <div className="relative inline-flex flex-col items-center">
      <p 
        className="font-mono text-[9px] tracking-[0.4em] uppercase mb-2"
        style={{ color: 'var(--accent-about)' }}
      >
        Certification Track
      </p>
      <div 
        className="h-[2px] w-full rounded-full opacity-50" 
        style={{ backgroundColor: 'var(--accent-about)' }}
      />
    </div>
  );
}

type Cert = {
  id: string;
  title: string;
  skills: string;
  progress: number;
};

function CompTIACard({ cert }: { cert: Cert }) {
  return (
    <>
      <style>{`
        .comptia-card-${cert.id}:hover {
          border-color: color-mix(in srgb, var(--accent-about) 40%, transparent) !important;
          background-color: var(--surface) !important;
        }
      `}</style>

      <div className={`comptia-card-${cert.id} group relative flex w-full flex-col text-left overflow-hidden border border-surface bg-background rounded-md px-6 py-5 transition-all duration-300`}>
        
        {/* Top Section */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[9px] font-mono uppercase tracking-[0.24em] text-muted mb-2">
              CompTIA Certification
            </p>
            <h4 className="text-[15px] font-semibold tracking-tight uppercase text-foreground leading-snug pr-2">
              {cert.title}
            </h4>
          </div>
          <span 
            className="shrink-0 flex items-center gap-1.5 text-[8px] font-mono uppercase tracking-[0.18em] px-2 py-1 rounded-sm border"
            style={{
              color: 'var(--accent-about)',
              backgroundColor: 'color-mix(in srgb, var(--accent-about) 10%, transparent)',
              borderColor: 'color-mix(in srgb, var(--accent-about) 20%, transparent)'
            }}
          >
            ACTIVE LEARNING
          </span>
        </div>

        {/* Divider */}
        <div className="mt-5 h-px w-full bg-surface" />

        {/* Skills */}
        <div className="mt-5 mb-2 flex-1">
          <p className="text-[9px] font-mono uppercase tracking-[0.24em] text-muted mb-3">
            Focus Areas
          </p>
          <div className="flex flex-wrap gap-2">
            {cert.skills
              .split(", ")
              .slice(0, 3)
              .map((skill, i) => (
                <span
                  key={i}
                  className="text-[10px] font-mono px-2 py-1 rounded-sm border border-surface bg-surface/40 text-muted transition-colors group-hover:bg-background"
                >
                  {skill}
                </span>
              ))}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[9px] font-mono uppercase tracking-[0.24em] text-muted">
              Progress
            </p>
            <span className="text-[10px] font-mono text-foreground">
              {cert.progress}%
            </span>
          </div>
          <div className="h-[2px] w-full rounded-full bg-surface overflow-hidden">
            <div
              className="h-full transition-all duration-700 opacity-90 bg-[#E4002B]"
              style={{ width: `${cert.progress}%` }}
            />
          </div>
        </div>
        
      </div>
    </>
  );
}

export default function CompTIASection() {
  const [isOpen, setIsOpen] = useState(false);
  const startTimeRef = React.useRef<number>(0);

  React.useEffect(() => {
    if (isOpen) {
      startTimeRef.current = Date.now();
      trackEvent({ type: TELEMETRY_EVENTS.COMPTIA_SECTION_ENTER, metadata: { section: 'comptia' } });
    } else if (startTimeRef.current > 0) {
      const duration = Math.round((Date.now() - startTimeRef.current) / 1000);
      trackEvent({ 
        type: TELEMETRY_EVENTS.COMPTIA_SECTION_EXIT, 
        metadata: { section: 'comptia', duration_seconds: duration } 
      });
      startTimeRef.current = 0;
    }
  }, [isOpen]);

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <section className="border-t border-surface pt-14 max-w-6xl mx-auto relative">
      
      {/* 
        LOCAL STYLES: 
        Safely handles the hover states using color-mix to avoid Next.js styled-jsx nesting errors.
      */}
      <style>{`
        .comptia-banner-btn:hover {
          border-color: color-mix(in srgb, var(--accent-about) 40%, transparent) !important;
        }
        .comptia-banner-btn:hover .comptia-expand-text {
          color: var(--accent-about) !important;
        }
        .comptia-top-close:hover {
          color: var(--accent-about) !important;
        }
        .comptia-bottom-close:hover {
          background-color: var(--accent-about) !important;
          border-color: var(--accent-about) !important;
          color: var(--background) !important;
        }
      `}</style>

      {!isOpen ? (
        // CLOSED STATE: Clickable banner to open the section
        <div className="flex flex-col items-center justify-center space-y-5">
          <CompTIASubtitle />

          <button
            onClick={handleOpen}
            className="comptia-banner-btn group flex flex-col md:flex-row items-center gap-4 px-8 py-5 border border-surface bg-background rounded-md transition-all duration-300 hover:bg-surface/50 w-full max-w-2xl"
          >
            <CompTIAWordmark />
            <div className="h-px w-full md:w-px md:h-8 bg-surface transition-colors" />
            <div className="flex flex-col items-center md:items-start">
              <span className="text-sm md:text-[15px] font-semibold tracking-tight text-foreground uppercase">
              Explore Learning Journey
              </span>
              <span className="comptia-expand-text text-[9px] font-mono text-muted uppercase tracking-[0.24em] mt-1 transition-colors">
                Click to expand
              </span>
            </div>
          </button>
        </div>
      ) : (
        // OPEN STATE: Full section content
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 relative z-10">
          
          {/* Top Close Button */}
          <div className="flex justify-end mb-[-1rem]">
            <button
              onClick={handleClose}
              className="comptia-top-close text-[9px] font-mono uppercase tracking-[0.24em] text-muted transition-colors flex items-center gap-2 bg-surface/30 px-3 py-1.5 rounded-sm hover:bg-surface border border-transparent hover:border-surface-strong"
            >
              ✕ Close
            </button>
          </div>

          {/* Header with Radiolucent / X-Ray Effect matching --accent-about */}
          <header className="relative mx-auto w-full max-w-4xl text-center space-y-5 py-4 flex flex-col items-center">
            
            {/* Radiolucent Glow */}
            <div className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center overflow-hidden">
              <div 
                className="w-[300px] h-[150px] md:w-[600px] md:h-[200px] blur-[80px] rounded-[100%] opacity-30 mix-blend-screen"
                style={{ backgroundColor: 'var(--accent-about)' }}
              ></div>
              <div className="absolute inset-0 opacity-[0.02] bg-[radial-gradient(circle,currentColor_1px,transparent_1px)] bg-[size:12px_12px]"></div>
            </div>

            <div className="relative z-10 space-y-4 flex flex-col items-center">
              <CompTIASubtitle />

              <div className="flex items-center gap-3 mt-2">
                <CompTIAWordmark />
                <span className="text-3xl md:text-3xl font-semibold tracking-tight text-foreground uppercase">
                  Certifications
                </span>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <p 
                  className="text-[9px] font-mono font-medium px-3 py-1.5 rounded-sm inline-block uppercase tracking-[0.24em] backdrop-blur-md text-[#E4002B] bg-[#E4002B]/10 border border-[#E4002B]/20"
                >
                  2 Certifications In Progress
                </p>
              </div>

              <div 
                className="w-12 h-[1px] my-2 opacity-50 bg-[#E4002B]" 
              />

              <p className="mx-auto max-w-2xl text-[13px] md:text-[14px] leading-relaxed text-muted">
                Building practical knowledge in cybersecurity, operating systems,
                networking, and security operations through structured study and
                hands-on practice.
              </p>
            </div>
          </header>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 relative z-10">
            {activeCerts.map((cert) => (
              <CompTIACard key={cert.id} cert={cert} />
            ))}
          </div>

          {/* Bottom Close Button */}
          <div className="flex justify-center pt-8">
            <button
              onClick={handleClose}
              className="comptia-bottom-close text-[9px] font-mono uppercase tracking-[0.24em] border border-surface px-6 py-3 rounded-sm text-foreground transition-all duration-300 bg-surface/20"
            >
              Close Section
            </button>
          </div>
        </div>
      )}
    </section>
  );
}