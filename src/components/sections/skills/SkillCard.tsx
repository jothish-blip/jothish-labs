"use client";

import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { SkillDomain } from "./types";
import SkillChip from "./SkillChip";

interface Props {
  domain: SkillDomain;
  isExpanded: boolean;
  onToggle: () => void;
}

export default function SkillCard({ domain, isExpanded, onToggle }: Props) {
  const Icon = domain.icon;
  const totalSkills = domain.coreSkills.length + domain.technologies.length;

  return (
    <div 
      className={`group flex flex-col rounded-md border bg-background transition-all duration-300 overflow-hidden ${
        isExpanded 
          ? "border-surface-strong bg-surface/10" 
          : "border-surface hover:bg-surface/20"
      }`}
      style={isExpanded ? {
        borderColor: 'color-mix(in srgb, var(--accent-skills) 40%, transparent)'
      } : {}}
    >
      {/* Header (Always visible) */}
      <button 
        onClick={onToggle}
        className="flex w-full items-center justify-between p-4 sm:p-5 text-left focus:outline-none bg-transparent"
        aria-expanded={isExpanded}
      >
        <div className="flex items-center gap-4">
          <div 
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-sm border transition-colors duration-300 ${
              isExpanded 
                ? "" 
                : "border-surface bg-surface/40 text-muted group-hover:border-surface-strong group-hover:text-foreground"
            }`}
            style={isExpanded ? {
              color: 'var(--accent-skills)',
              backgroundColor: 'color-mix(in srgb, var(--accent-skills) 10%, transparent)',
              borderColor: 'color-mix(in srgb, var(--accent-skills) 30%, transparent)'
            } : {}}
          >
            <Icon size={16} />
          </div>
          
          <div className="flex flex-col">
            <h3 className="text-[13px] font-semibold tracking-tight uppercase text-foreground">
              {domain.title}
            </h3>
            <p className="text-[11px] text-muted line-clamp-1 max-w-[220px] sm:max-w-md mt-1 leading-relaxed">
              {domain.description}
            </p>
          </div>
        </div>

        <div className="ml-4 flex shrink-0 items-center gap-4">
          <span className="hidden sm:inline-block font-mono text-[9px] uppercase tracking-[0.24em] text-muted">
            {totalSkills} Skills
          </span>
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <ChevronDown 
              size={14} 
              className={`transition-colors duration-300 ${
                isExpanded ? "" : "text-muted group-hover:text-foreground"
              }`} 
              style={isExpanded ? { color: 'var(--accent-skills)' } : {}}
            />
          </motion.div>
        </div>
      </button>

      {/* Expanded Content with Framer Motion */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="border-t border-surface p-5 sm:p-6 flex flex-col gap-8 bg-background/50">
              
              {/* Detailed Description */}
              <div className="max-w-3xl">
                <p className="text-[13px] leading-relaxed text-muted">
                  {domain.description}
                </p>
              </div>

              {/* Core Skills List */}
              {domain.coreSkills.length > 0 && (
                <div>
                  <h4 className="font-mono text-[9px] uppercase tracking-[0.24em] text-foreground mb-4">
                    Core Competencies
                  </h4>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {domain.coreSkills.map((skill) => (
                      <li key={skill} className="flex items-start gap-2.5 text-[12px] text-muted">
                        <span 
                          className="mt-1.5 h-1 w-1 shrink-0 rounded-full"
                          style={{ backgroundColor: 'color-mix(in srgb, var(--accent-skills) 60%, transparent)' }}
                        ></span>
                        <span className="leading-relaxed">{skill}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Tools & Technologies */}
              {domain.technologies.length > 0 && (
                <div className="pt-2">
                  <h4 className="font-mono text-[9px] uppercase tracking-[0.24em] text-foreground mb-4">
                    Tools & Technologies
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {domain.technologies.map((tech) => (
                      <SkillChip key={tech.name} skill={tech} />
                    ))}
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