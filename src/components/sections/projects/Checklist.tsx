"use client";
import { useState } from "react";
import { ChecklistItem } from "@/lib/projects/types";

interface Props {
  checklist: ChecklistItem[];
  linkedControl?: string | null;
}

export default function Checklist({ checklist, linkedControl }: Props) {
  const [showAllChecks, setShowAllChecks] = useState(false);

  return (
    <div className="space-y-4">
      {/* Improved Section Title */}
      <h4 className="font-mono text-[9px] text-muted uppercase tracking-widest">
        control validation
      </h4>
      
      {/* Improved Container Depth */}
      <div className="bg-surface/80 backdrop-blur-sm rounded-sm border border-surface flex flex-col">
        
        {/* Summary Row */}
        <div className="px-4 py-2 text-[9px] font-mono text-muted border-b border-surface/60 flex justify-between shrink-0">
          <span>controls checked</span>
          <span>
            {checklist.filter(c => c.status === "YES").length} / {checklist.length}
          </span>
        </div>

        {/* Scrollable Container */}
        <div className="max-h-[280px] overflow-y-auto">
          {(showAllChecks ? checklist : checklist.slice(0, 4)).map((item, i) => {
            const isLinked = linkedControl === item.control;
            
            return (
              // Improved Row Structure & Linked Highlight
              <div
                key={i}
                className={`flex items-center justify-between px-4 py-3 border-b border-surface/60 last:border-0 transition-colors duration-500 ${
                  isLinked 
                    ? "bg-[var(--accent-soft)] border-l-2 border-l-[var(--accent)]" 
                    : "hover:bg-surface-strong/80"
                }`}
              >
                <div className="flex items-center gap-3">
                  {/* Improved Dot Indicator */}
                  <div className={`w-2 h-2 rounded-full ${
                    item.status === "YES" ? "bg-[var(--success)]" : "bg-[var(--danger)]"
                  } ${isLinked ? "shadow-[0_0_6px_currentColor]" : ""}`} />
                  
                  <div>
                    {/* Improved Text Hierarchy */}
                    <p className={`text-[12px] font-semibold tracking-tight transition-colors ${
                      isLinked ? "text-[var(--accent)]" : "text-foreground/80"
                    }`}>
                      {item.control}
                    </p>
                    <p className="text-[10px] text-muted/80 font-mono mt-0.5">
                      {item.note}
                    </p>
                  </div>
                </div>
                
                {/* Improved Status Badge */}
                <span className={`text-[8px] font-mono px-2 py-1 border uppercase tracking-widest rounded-sm ${
                  item.status === "YES"
                    ? "border-[var(--success)]/30 text-[var(--success)] bg-[var(--success)]/10"
                    : "border-[var(--danger)]/30 text-[var(--danger)] bg-[var(--danger)]/10"
                }`}>
                  {item.status === "YES" ? "verified" : "failed"}
                </span>
              </div>
            );
          })}
        </div>
        
        {/* Improved Toggle Button */}
        {checklist.length > 4 && (
          <button 
            onClick={() => setShowAllChecks(!showAllChecks)}
            className="w-full py-2 text-[9px] font-mono text-muted hover:text-[var(--accent)] hover:bg-[var(--accent-soft)] transition uppercase tracking-widest border-t border-surface active:scale-[0.98] shrink-0"
          >
            {showAllChecks ? "collapse" : `expand +${checklist.length - 4}`}
          </button>
        )}
      </div>
    </div>
  );
}