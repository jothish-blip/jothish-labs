"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { SkillDomain } from "./types";
import SkillChip from "./SkillChip";

interface Props {
  domain: SkillDomain;
  isExpanded: boolean;
  onToggle: () => void;
}

const VISIBLE_TECH_LIMIT = 6;

export default function SkillCard({ domain, isExpanded, onToggle }: Props) {
  const [showAllTech, setShowAllTech] = useState(false);
  
  const Icon = domain.icon;
  const coreCount = domain.coreSkills.length;
  const techCount = domain.technologies.length;

  const visibleTech = showAllTech 
    ? domain.technologies 
    : domain.technologies.slice(0, VISIBLE_TECH_LIMIT);
  
  const hiddenTechCount = domain.technologies.length - visibleTech.length;

  return (
    <div 
      className={`skill-card group flex flex-col rounded-md border bg-background transition-all duration-500 overflow-hidden ${
        isExpanded 
          ? "border-surface-strong bg-surface/10" 
          : "border-surface hover:bg-surface/20"
      }`}
      style={isExpanded ? {
        borderColor: 'color-mix(in srgb, var(--accent-skills) 40%, transparent)',
        boxShadow: '0 8px 30px color-mix(in srgb, var(--accent-skills) 8%, transparent)'
      } : {}}
    >
      <button 
        onClick={onToggle}
        className="flex w-full items-center justify-between p-4 sm:p-5 text-left focus:outline-none bg-transparent"
        aria-expanded={isExpanded}
      >
        <div className="flex items-center gap-4">
          <div 
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-sm border transition-all duration-500 ${
              isExpanded 
                ? "scale-[1.05]" 
                : "border-surface bg-surface/40 text-muted group-hover:border-surface-strong group-hover:text-foreground"
            }`}
            style={isExpanded ? {
              color: 'var(--accent-skills)',
              backgroundColor: 'color-mix(in srgb, var(--accent-skills) 10%, transparent)',
              borderColor: 'color-mix(in srgb, var(--accent-skills) 30%, transparent)'
            } : {}}
          >
            <Icon size={18} />
          </div>
          
          <div className="flex flex-col pt-0.5">
            <h3 
              className={`text-[14px] font-semibold tracking-tight uppercase transition-colors duration-300 ${isExpanded ? "" : "text-foreground"}`}
              style={isExpanded ? { color: 'var(--accent-skills)' } : {}}
            >
              {domain.title}
            </h3>
            
            <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted mt-1.5 flex items-center gap-1.5">
              <span className="font-semibold text-foreground/70">{coreCount}</span> Core 
              <span className="text-surface-strong">•</span> 
              <span className="font-semibold text-foreground/70">{techCount}</span> Tools
            </p>
          </div>
        </div>

        <div className="ml-4 flex shrink-0 items-center">
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <ChevronDown 
              size={16} 
              className={`transition-colors duration-300 ${
                isExpanded ? "" : "text-muted group-hover:text-foreground"
              }`} 
              style={isExpanded ? { color: 'var(--accent-skills)' } : {}}
            />
          </motion.div>
        </div>
      </button>

      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
          >
            <div className="border-t border-surface p-5 sm:p-6 flex flex-col gap-8 bg-background/50">
              
              <div className="max-w-3xl">
                <p className="text-[13px] leading-relaxed text-muted">
                  {domain.description}
                </p>
              </div>

              {domain.coreSkills.length > 0 && (
                <div>
                  <h4 className="font-mono text-[9px] uppercase tracking-[0.24em] text-muted flex items-center gap-2 mb-4">
                    {"// Core Competencies"}
                  </h4>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {domain.coreSkills.map((skill) => (
                      <li key={skill} className="flex items-start gap-2.5 text-[12px] text-foreground/80">
                        <span 
                          className="mt-1.5 h-1 w-1 shrink-0 rounded-full"
                          style={{ 
                            backgroundColor: 'var(--accent-skills)',
                            boxShadow: '0 0 8px color-mix(in srgb, var(--accent-skills) 50%, transparent)'
                          }}
                        ></span>
                        <span className="leading-relaxed">{skill}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {domain.technologies.length > 0 && (
                <div className="pt-2">
                  <h4 className="font-mono text-[9px] uppercase tracking-[0.24em] text-muted flex items-center gap-2 mb-4">
                    {"// Toolkit"}
                  </h4>
                  <div className="flex flex-wrap items-center gap-2">
                    {visibleTech.map((tech) => (
                      <SkillChip key={tech.name} skill={tech} />
                    ))}
                    
                    {hiddenTechCount > 0 && (
                      <button 
                        onClick={(e) => { e.stopPropagation(); setShowAllTech(true); }}
                        className="group flex items-center gap-1.5 rounded-sm border border-surface bg-surface/10 px-3 py-2 transition-all duration-300 hover:border-surface-strong hover:bg-surface/30"
                      >
                        <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted transition-colors group-hover:text-foreground">
                          +{hiddenTechCount} More
                        </span>
                      </button>
                    )}
                  </div>
                </div>
              )}

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}