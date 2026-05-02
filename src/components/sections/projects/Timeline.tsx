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
    <div className="space-y-6 border-b border-surface pb-8">
      
      {/* 2 & 12. Improved Section Title & Completion Indicator */}
      <div className="flex items-center justify-between">
        <h4 className="font-mono text-[9px] text-muted uppercase tracking-widest">
          {isPlaybackContext ? "investigation flow" : "timeline"}
        </h4>
        <p className="text-[9px] font-mono text-muted uppercase tracking-widest">
          step {activeStep + 1} / {steps.length}
        </p>
      </div>
      
      <div className="relative">
        {/* 3. Softened Gradient Timeline Line */}
        <div className="absolute left-[5px] top-2 bottom-2 w-[1px] bg-gradient-to-b from-surface to-surface-strong"></div>
        
        {/* 11. Scrollable Container for scaling */}
        <div className="max-h-[300px] overflow-y-auto pr-2 space-y-4">
          {steps.map((event, i) => (
            <div 
              key={i} 
              className="relative pl-6 py-2 cursor-pointer group transition-transform duration-300 active:scale-[0.98] hover:translate-x-[2px]"
              onClick={() => onStepChange(i)}
            >
              {/* 10. Hover Preview (translate-x) applied to wrapper above */}
              {/* 4. Stronger Active Step Emphasis vs Clean Inactive State */}
              <div className={`absolute left-0 top-3 w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                activeStep === i 
                  ? "bg-[var(--accent)] shadow-[0_0_10px_var(--accent)] scale-110 border-transparent" 
                  : "bg-surface border border-surface/60 group-hover:bg-[var(--accent-soft)]"
              }`}></div>
              
              <div className="space-y-1.5">
                <div className="flex items-center gap-3">
                  {/* 6. Improved Step Label */}
                  <p className={`text-[9px] font-mono uppercase tracking-widest transition-colors ${
                    activeStep === i ? "text-[var(--accent)]" : "text-muted"
                  }`}>
                    step {String(i + 1).padStart(2, "0")}
                  </p>
                  
                  {/* 5. Clear Current Step Indicator */}
                  {activeStep === i && (
                    <span className="text-[8px] font-mono text-[var(--accent)] uppercase tracking-widest">
                      current
                    </span>
                  )}
                  
                  {/* 7. Upgraded Tag Styling */}
                  {'tag' in event && event.tag && (
                    <span className="text-[8px] font-mono px-2 py-0.5 border border-[var(--accent)]/30 text-[var(--accent)] bg-[var(--accent)]/10 rounded-sm uppercase tracking-widest">
                      {event.tag}
                    </span>
                  )}
                </div>
                
                {/* 8. Improved Title Hierarchy */}
                <h5 className={`text-[13px] font-semibold tracking-tight transition-colors ${
                  activeStep === i ? "text-foreground" : "text-foreground/80 group-hover:text-[var(--accent)]"
                }`}>
                  {event.title}
                </h5>
                
                {/* 9. Smoother Description Animation */}
                {'desc' in event && (
                  <div 
                    className={`grid transition-all duration-300 ease-in-out ${
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
  );
}