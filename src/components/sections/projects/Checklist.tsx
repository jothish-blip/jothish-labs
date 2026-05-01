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
      <h4 className="font-mono text-[10px] text-zinc-600 tracking-[0.4em] uppercase">// CONTROLS_VERIFICATION</h4>
      <div className="bg-[#080808] rounded-sm py-1 border border-white/5">
        {(showAllChecks ? checklist : checklist.slice(0, 4)).map((item, i) => {
          const isLinked = linkedControl === item.control;
          return (
            <div key={i} className={`flex items-center justify-between px-4 py-3 border-b border-white/5 last:border-0 transition-colors duration-500 ${isLinked ? "bg-cyan-950/20 border-l-2 border-l-cyan-500" : "hover:bg-white/[0.02]"}`}>
              <div className="flex items-center gap-3">
                <div className={`w-1.5 h-1.5 rounded-full ${item.status === "YES" ? "bg-emerald-500" : "bg-red-500"} ${isLinked && "animate-pulse shadow-[0_0_8px_currentColor]"}`} />
                <div>
                  <p className={`text-[11px] font-bold tracking-tight transition-colors ${isLinked ? "text-cyan-400" : "text-zinc-300"}`}>{item.control}</p>
                  <p className="text-[10px] text-zinc-500 font-mono mt-0.5">{item.note}</p>
                </div>
              </div>
              <span className={`font-mono text-[9px] px-2 py-1 tracking-widest uppercase ${item.status === "YES" ? "text-emerald-500" : "text-red-500"}`}>
                {item.status === "YES" ? "PASS" : "FAIL"}
              </span>
            </div>
          );
        })}
        {checklist.length > 4 && !showAllChecks && (
          <button 
            onClick={() => setShowAllChecks(true)}
            className="w-full py-3 mt-1 text-[10px] font-mono text-zinc-500 hover:text-white hover:bg-white/5 transition-colors uppercase tracking-widest border-t border-white/5"
          >
            + View {checklist.length - 4} More Checks
          </button>
        )}
      </div>
    </div>
  );
}