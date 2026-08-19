"use client";

import { useEffect, useRef } from "react";

export default function FocusSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const scrollMaxRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);

  useEffect(() => {
    let isVisible = false;
    
    const handleScroll = () => {
      if (!isVisible || !sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      let visiblePercent = 0;
      if (rect.top >= viewportHeight) {
        visiblePercent = 0;
      } else if (rect.bottom <= 0) {
        visiblePercent = 100;
      } else {
        const visibleHeight = Math.min(rect.bottom, viewportHeight) - Math.max(rect.top, 0);
        visiblePercent = Math.round((visibleHeight / rect.height) * 100);
      }
      if (visiblePercent > scrollMaxRef.current) {
        scrollMaxRef.current = Math.min(visiblePercent, 100);
      }
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          isVisible = true;
          startTimeRef.current = Date.now();
          import('@/lib/telemetry/events').then(({ trackEvent, TELEMETRY_EVENTS }) => {
            trackEvent({ type: TELEMETRY_EVENTS.FOCUS_ENTER, metadata: { section: 'focus' } });
          });
          window.addEventListener('scroll', handleScroll, { passive: true });
          handleScroll();
        } else if (isVisible) {
          isVisible = false;
          window.removeEventListener('scroll', handleScroll);
          const duration = Math.round((Date.now() - startTimeRef.current) / 1000);
          import('@/lib/telemetry/events').then(({ trackEvent, TELEMETRY_EVENTS }) => {
            trackEvent({ 
              type: TELEMETRY_EVENTS.FOCUS_EXIT, 
              metadata: { section: 'focus', duration_seconds: duration, scroll_depth: scrollMaxRef.current } 
            });
          });
          scrollMaxRef.current = 0;
        }
      });
    }, { threshold: 0.1 });

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => {
      if (sectionRef.current) observer.unobserve(sectionRef.current);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toolkit = [
    {
      category: "Operating Systems",
      skills: ["Linux", "Windows", "System Administration"],
    },
    {
      category: "Network Analysis",
      skills: ["Wireshark", "tcpdump", "Packet Capture"],
    },
    {
      category: "SIEM & Detection",
      skills: ["Splunk", "Google Chronicle", "Event Correlation"],
    },
    {
      category: "Endpoint Security",
      skills: ["EDR Concepts", "Windows Event Logs", "Host Investigation"],
    },
    {
      category: "Programming",
      skills: ["Python", "SQL", "Automation & Scripting"],
    },
    {
      category: "Development",
      skills: ["Git", "GitHub", "Version Control"],
    },
  ];

  return (
    <div ref={sectionRef} className="py-16 border-t border-surface max-w-5xl mx-auto px-4 md:px-0">
      
      {/* Local Styles for dynamic accent hovers */}
      <style>{`
        .focus-card:hover {
          border-color: color-mix(in srgb, var(--accent-about) 40%, transparent) !important;
          background-color: color-mix(in srgb, var(--accent-about) 5%, transparent) !important;
        }
        .focus-card:hover .focus-card-badge {
          opacity: 1 !important;
        }
        .focus-card:hover .focus-card-line {
          background-color: color-mix(in srgb, var(--accent-about) 60%, transparent) !important;
        }
      `}</style>

      {/* SOC WORKFLOW COMMAND STRIP */}
      <div className="font-mono text-[9px] text-muted uppercase tracking-[0.24em] mb-12 flex flex-wrap gap-3 items-center">
        <span className="text-foreground">Capture</span>
        <span className="text-surface-strong">→</span>
        <span className="text-foreground">Analyze</span>
        <span className="text-surface-strong">→</span>
        <span className="text-foreground">Detect</span>
        <span className="text-surface-strong">→</span>
        <span className="text-foreground">Investigate</span>
        <span className="text-surface-strong">→</span>
        <span className="text-foreground">Improve</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-start">
        
        {/* LEFT: NARRATIVE, OBJECTIVES & INTERESTS */}
        <div className="lg:col-span-5 space-y-12">
          
          <div className="space-y-4">
            <h4 
              className="font-mono text-[9px] uppercase tracking-[0.24em]"
              style={{ color: 'var(--accent-about)' }}
            >
              {"// Current Operations"}
            </h4>
            <p className="text-[13px] text-muted leading-relaxed">
              My current learning revolves around understanding how systems generate, process, and expose security data. Through hands-on projects, I explore network traffic, endpoint activity, log analysis, and SIEM workflows while documenting everything I learn.
            </p>
          </div>

          <div className="space-y-4">
            <h5 className="font-mono text-[9px] text-muted uppercase tracking-[0.24em]">
              Current Objectives
            </h5>
            <ul className="space-y-3">
              {[
                "Build Better Projects",
                "Strengthen Detection Skills",
                "Learn Threat Hunting",
                "Contribute to Open Source"
              ].map((objective) => (
                <li key={objective} className="flex items-start gap-2.5 font-mono text-[10px] text-foreground tracking-[0.24em] uppercase">
                  <span 
                    className="mt-1 h-1 w-1 shrink-0 rounded-full"
                    style={{ backgroundColor: 'var(--accent-about)' }}
                  ></span>
                  <span className="leading-tight">{objective}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-2">
            
            {/* Current Interests */}
            <div className="space-y-4">
              <h5 className="font-mono text-[9px] text-muted uppercase tracking-[0.24em]">
                Current Interests
              </h5>
              <ul className="space-y-3">
                {[
                  "Network Traffic Analysis",
                  "Log Investigation",
                  "Detection Engineering",
                  "Blue Team Operations"
                ].map((interest) => (
                  <li key={interest} className="flex items-start gap-2.5 font-mono text-[9px] text-muted tracking-[0.24em] uppercase">
                    <span 
                      className="mt-1 h-1 w-1 shrink-0 rounded-full"
                      style={{ backgroundColor: 'color-mix(in srgb, var(--accent-about) 60%, transparent)' }}
                    ></span>
                    <span className="leading-tight">{interest}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Currently Exploring */}
            <div className="space-y-4">
              <h5 className="font-mono text-[9px] text-muted uppercase tracking-[0.24em]">
                Currently Exploring
              </h5>
              <ul className="space-y-3 opacity-70">
                {[
                  "Threat Hunting",
                  "Incident Response",
                  "Detection Rules",
                  "Windows Internals"
                ].map((exploration) => (
                  <li key={exploration} className="flex items-start gap-2.5 font-mono text-[9px] text-muted tracking-[0.24em] uppercase">
                    <span className="mt-1 h-[1px] w-1.5 shrink-0 bg-surface-strong"></span>
                    <span className="leading-tight">{exploration}</span>
                  </li>
                ))}
              </ul>
            </div>
            
          </div>
        </div>

        {/* RIGHT: TECHNICAL TOOLKIT CARDS */}
        <div className="lg:col-span-7 space-y-6 lg:pl-10 lg:border-l border-surface">
          <h4 className="font-mono text-[9px] text-muted uppercase tracking-[0.24em]">
            {"// Technical Toolkit"}
          </h4>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {toolkit.map((group) => (
              <div 
                key={group.category} 
                className="focus-card group border border-surface bg-background hover:bg-surface/10 transition-all duration-300 p-5 sm:p-6 rounded-md flex flex-col h-full overflow-hidden cursor-default"
                onMouseEnter={() => {
                  import('@/lib/telemetry/events').then(({ trackEvent, TELEMETRY_EVENTS }) => {
                    trackEvent({ type: TELEMETRY_EVENTS.SKILL_INTERACT, metadata: { skill: group.category, action: 'hover', section: 'focus' } });
                  });
                }}
              >
                <div className="flex justify-between items-start mb-6">
                  <h5 className="text-[13px] text-foreground font-semibold tracking-tight uppercase pr-2">
                    {group.category}
                  </h5>
                  <span 
                    className="focus-card-badge shrink-0 font-mono text-[8px] opacity-0 transition-opacity duration-300 uppercase tracking-[0.24em] px-1.5 py-0.5 border rounded-sm"
                    style={{
                      color: 'var(--accent-about)',
                      borderColor: 'color-mix(in srgb, var(--accent-about) 20%, transparent)',
                      backgroundColor: 'color-mix(in srgb, var(--accent-about) 5%, transparent)'
                    }}
                  >
                    Active
                  </span>
                </div>
                
                <ul className="space-y-2.5 mt-auto">
                  {group.skills.map((skill) => (
                    <li key={skill} className="font-mono text-[9px] text-muted tracking-[0.24em] uppercase flex items-center gap-2">
                      <span className="focus-card-line h-[1px] w-2 bg-surface transition-colors duration-300"></span> 
                      {skill}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}