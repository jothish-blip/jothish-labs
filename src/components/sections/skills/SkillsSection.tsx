"use client";

import { useState, useEffect } from "react";
import { skillDomains } from "./data";
import SkillCard from "./SkillCard";

export default function SkillsSection() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch for the date
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const handleToggle = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const totalSkills = skillDomains.reduce((acc, domain) => acc + domain.coreSkills.length, 0);
  const totalTech = skillDomains.reduce((acc, domain) => acc + domain.technologies.length, 0);

  return (
    <section id="skills" className="border-t border-surface pt-14 pb-24 max-w-6xl mx-auto flex flex-col gap-12 px-6 md:px-8 relative">
      
      {/* Header with Radiolucent / X-Ray Effect matching --accent-skills */}
      <header className="relative mx-auto w-full max-w-4xl text-center space-y-5 py-8 flex flex-col items-center">
        
        {/* Radiolucent Glow / X-Ray Effect Background */}
        <div className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center overflow-hidden">
          <div 
            className="w-[300px] h-[150px] md:w-[600px] md:h-[200px] blur-[80px] rounded-[100%] opacity-30 mix-blend-screen"
            style={{ backgroundColor: 'var(--accent-skills)' }}
          ></div>
          <div className="absolute inset-0 opacity-[0.02] bg-[radial-gradient(circle,currentColor_1px,transparent_1px)] bg-[size:12px_12px]"></div>
        </div>

        <div className="relative z-10 space-y-4 flex flex-col items-center">
          <p 
            className="font-mono text-[9px] tracking-[0.4em] uppercase"
            style={{ color: 'var(--accent-skills)' }}
          >
            {"// Technical Expertise"}
          </p>

          <h2 className="text-3xl md:text-5xl font-semibold tracking-tight leading-[1.1] text-foreground uppercase">
            Skills & <span className="text-muted italic font-light">Domains</span>
          </h2>

          <div className="flex items-center gap-3 pt-2">
            <p 
              className="text-[9px] font-mono font-medium px-3 py-1.5 rounded-sm inline-block uppercase tracking-[0.24em] backdrop-blur-md"
              style={{ 
                color: 'var(--accent-skills)',
                backgroundColor: 'color-mix(in srgb, var(--accent-skills) 10%, transparent)',
                border: '1px solid color-mix(in srgb, var(--accent-skills) 20%, transparent)'
              }}
            >
              {skillDomains.length} Domains • {totalSkills + totalTech} Core Technologies
            </p>
          </div>

          <div 
            className="w-12 h-[1px] my-2 opacity-50" 
            style={{ backgroundColor: 'var(--accent-skills)' }}
          />

          <p className="mx-auto max-w-2xl text-[13px] md:text-[14px] leading-relaxed text-muted">
            Practical cybersecurity knowledge developed through professional certifications, hands-on labs, security projects, and continuous learning.
          </p>

          {mounted && (
            <p className="text-[9px] font-mono uppercase tracking-[0.24em] text-muted/50 pt-2">
              Last Updated: {new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
            </p>
          )}
        </div>
      </header>

      {/* SECTION LAYOUT (Expandable Domain Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-5 items-start relative z-10">
        {skillDomains.map((domain) => (
          <SkillCard 
            key={domain.id}
            domain={domain}
            isExpanded={expandedId === domain.id}
            onToggle={() => handleToggle(domain.id)}
          />
        ))}
      </div>

    </section>
  );
}