"use client";
import { TimelineEvent, PlaybackStep } from "@/lib/projects/types";

interface Props {
  steps: TimelineEvent[] | PlaybackStep[];
  activeStep: number;
  onStepChange: (step: number) => void;
  isPlaybackContext: boolean;
}

export default function Timeline({ steps, activeStep, onStepChange, isPlaybackContext }: Props) {
  return (
    <>
      {/* 2. Global Theme Tokens */}
      <style jsx global>{`
        :root {
          --accent: #0891b2;
          --accent-soft: rgba(8, 145, 178, 0.08);
        }
        html.dark {
          --accent: #22d3ee;
          --accent-soft: rgba(34, 211, 238, 0.1);
        }
      `}</style>

      <div className="space-y-6 border-b border-surface pb-8">
        {/* 1. Removed Fake/System Heading */}
        <h4 className="font-mono text-[10px] text-muted tracking-widest uppercase">
          {isPlaybackContext ? "Investigation Log" : "Investigation Timeline"}
        </h4>
        
        <div className="relative">
          {/* 8. Softened Timeline Line */}
          <div className="absolute left-[5px] top-2 bottom-2 w-[1px] bg-surface-strong"></div>
          
          <div className="space-y-4">
            {steps.map((event, i) => (
              <div 
                key={i} 
                // 6 & 10. Added py-2 for touch target and active scale feedback
                className="relative pl-6 py-2 cursor-pointer group transition-transform active:scale-[0.98]"
                onClick={() => onStepChange(i)}
              >
                {/* 3. Refined Dot: Uses CSS variables, softer shadow, clean inactive state */}
                <div className={`absolute left-0 top-3 w-2.5 h-2.5 border border-surface rounded-full transition-all duration-300 ${
                  activeStep === i 
                    ? "bg-[var(--accent)] shadow-[0_0_6px_var(--accent)] scale-110 border-transparent" 
                    : "bg-surface group-hover:bg-[var(--accent-soft)]"
                }`}></div>
                
                <div className="space-y-1.5">
                  <div className="flex items-center gap-3">
                    {/* 4. Cleaner Step Label */}
                    <p className={`text-[10px] font-mono transition-colors ${
                      activeStep === i ? "text-[var(--accent)]" : "text-muted"
                    }`}>
                      Step {String(i + 1).padStart(2, "0")}
                    </p>
                    
                    {/* 9. Upgraded Tag Styling */}
                    {'tag' in event && event.tag && (
                      <span className="text-[8px] font-mono px-1.5 py-0.5 bg-[var(--accent-soft)] border border-[var(--accent)]/20 text-muted rounded-sm tracking-widest uppercase">
                        {event.tag}
                      </span>
                    )}
                  </div>
                  
                  {/* 5 & 6. Readable Title: Increased to 14px, better hover states */}
                  <h5 className={`text-[14px] font-semibold transition-colors ${
                    activeStep === i ? "text-foreground" : "text-foreground/80 group-hover:text-[var(--accent)]"
                  }`}>
                    {event.title}
                  </h5>
                  
                  {/* 7. Smoother Description Animation */}
                  {'desc' in event && (
                    <div 
                      className={`grid transition-all duration-300 ease-out ${
                        activeStep === i ? "grid-rows-[1fr] opacity-100 mt-2" : "grid-rows-[0fr] opacity-0 mt-0"
                      }`}
                    >
                      <p className="text-[13px] leading-relaxed text-muted font-light overflow-hidden">
                        {event.desc}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
} 