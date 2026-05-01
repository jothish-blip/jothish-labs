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
    <>
      {/* 2. Dark / Light Mode Global Tokens */}
      <style jsx global>{`
        :root {
          --accent: #0891b2;
          --accent-soft: rgba(8, 145, 178, 0.08);
          --success: #059669;
          --danger: #dc2626;
        }
        html.dark {
          --accent: #22d3ee;
          --accent-soft: rgba(34, 211, 238, 0.1);
          --success: #10b981;
          --danger: #ef4444;
        }
      `}</style>

      <div className="space-y-4">
        {/* 1. Remove Fake/System Wording */}
        <h4 className="font-mono text-[10px] text-muted tracking-widest uppercase">
          Controls Verification
        </h4>
        
        <div className="bg-surface rounded-sm py-1 border border-surface">
          {(showAllChecks ? checklist : checklist.slice(0, 4)).map((item, i) => {
            const isLinked = linkedControl === item.control;
            return (
              <div 
                key={i} 
                // 5 & 8. Softer row highlight and improved hover states
                className={`flex items-center justify-between px-4 py-3 border-b border-surface last:border-0 transition-colors duration-500 ${
                  isLinked 
                    ? "bg-[var(--accent-soft)] border-l border-l-[var(--accent)]" 
                    : "hover:bg-surface-strong/80"
                }`}
              >
                <div className="flex items-center gap-3">
                  {/* 4. Toned down highlight: Removed pulse, softened shadow, theme variables */}
                  <div className={`w-1.5 h-1.5 rounded-full ${
                    item.status === "YES" ? "bg-[var(--success)]" : "bg-[var(--danger)]"
                  } ${isLinked && "shadow-[0_0_4px_currentColor]"}`} />
                  
                  <div>
                    {/* 6 & 9. Bumped to 12px, better visual hierarchy for unlinked text */}
                    <p className={`text-[12px] font-bold tracking-tight transition-colors ${
                      isLinked ? "text-[var(--accent)]" : "text-foreground/80"
                    }`}>
                      {item.control}
                    </p>
                    <p className="text-[10px] text-muted/80 font-mono mt-0.5">
                      {item.note}
                    </p>
                  </div>
                </div>
                
                {/* 3. Improved Wording: Verified/Failed instead of PASS/FAIL */}
                <span className={`font-mono text-[9px] px-2 py-1 tracking-widest uppercase ${
                  item.status === "YES" ? "text-[var(--success)]" : "text-[var(--danger)]"
                }`}>
                  {item.status === "YES" ? "Verified" : "Failed"}
                </span>
              </div>
            );
          })}
          
          {/* 7. Interaction Polish: Toggle expand/collapse, active feedback */}
          {checklist.length > 4 && (
            <button 
              onClick={() => setShowAllChecks(!showAllChecks)}
              className="w-full py-3 mt-1 text-[10px] font-mono text-muted hover:text-foreground hover:bg-surface transition-colors uppercase tracking-widest border-t border-surface active:scale-[0.98]"
            >
              {showAllChecks ? "Show Less" : `View ${checklist.length - 4} More`}
            </button>
          )}
        </div>
      </div>
    </>
  );
}