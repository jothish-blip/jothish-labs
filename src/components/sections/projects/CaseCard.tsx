"use client";
import React from "react";
import { CaseData } from "@/lib/projects/types";

interface Props {
  data: CaseData;
  onOpen: (data: CaseData) => void;
}

const statusMap: Record<string, string> = {
  CRITICAL_RISK: "High Risk",
  SECURED: "Secured",
  WARNING: "Moderate",
};

const CaseCard = ({ data, onOpen }: Props) => {
  
  const getStatusStyles = (status: string) => {
    if (status === 'CRITICAL_RISK') return 'text-[var(--danger)] border-[var(--danger)]/30 bg-[var(--danger)]/10';
    if (status === 'SECURED') return 'text-[var(--success)] border-[var(--success)]/30 bg-[var(--success)]/10';
    return 'text-[var(--warning)] border-[var(--warning)]/30 bg-[var(--warning)]/10';
  };

  const getRiskScoreColor = (score: number | string) => {
    const num = typeof score === 'string' ? parseInt(score, 10) : score;
    if (isNaN(num)) return 'bg-muted';
    if (num >= 8) return 'bg-[var(--danger)]';
    if (num >= 5) return 'bg-[var(--warning)]';
    return 'bg-[var(--success)]';
  };

  const getRiskTextColor = (score: number | string) => {
    const num = typeof score === 'string' ? parseInt(score, 10) : score;
    if (isNaN(num)) return 'text-muted';
    if (num >= 8) return 'text-[var(--danger)]';
    if (num >= 5) return 'text-[var(--warning)]';
    return 'text-[var(--success)]';
  };

  const riskPercent = Math.min(100, Math.max(0, (typeof data.riskScore === 'string' 
    ? parseInt(data.riskScore, 10) 
    : data.riskScore) * 10));

  const displayStatus = statusMap[data.status] || "Moderate";

  return (
    <div 
      onClick={() => onOpen(data)}
      className="group relative max-w-4xl mx-auto border border-surface bg-surface p-5 sm:p-6 flex flex-col justify-between transition-all duration-300 cursor-pointer hover:border-[var(--projects-accent)]/50 hover:bg-surface-strong/80 shadow-sm hover:shadow-xl hover:-translate-y-1 rounded-md"
    >
      {/* 2. Status Badge (Top-Right Anchor) */}
      <span className={`absolute top-4 right-4 text-[8px] font-mono px-2 py-1 border uppercase tracking-widest rounded-sm ${getStatusStyles(data.status)}`}>
        {displayStatus}
      </span>

      {/* Header Info Section */}
      <div className="space-y-2 pr-20">
        {/* 3. Refined ID Label */}
        <p className="text-[9px] font-mono text-muted uppercase tracking-widest mb-1">
          Case Study • {data.id}
        </p>
        
        {/* 4. Responsive Title Hierarchy */}
        <h3 className="text-base sm:text-lg md:text-xl font-bold text-foreground group-hover:text-[var(--projects-accent)] transition-colors uppercase tracking-tight leading-tight">
          {data.title}
        </h3>
        
        {/* 5. Premium Description */}
        <p className="text-[12px] text-muted font-light max-w-xl line-clamp-2 leading-relaxed pt-1">
          {data.description}
        </p>
      </div>

      {/* 6. Divider Line */}
      <div className="h-px bg-surface/60 w-full my-5"></div>

      {/* Bottom Section: Risk & Action */}
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-5 w-full">
        
        {/* 7. Progress Bar Visualization */}
        <div className="w-full sm:flex-1 max-w-md">
          <p className="text-[9px] font-mono text-muted uppercase tracking-widest mb-2">
            risk assessment
          </p>

          <div className="flex flex-col gap-1.5">
            <div className="w-full h-[3px] bg-background rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ease-out ${getRiskScoreColor(data.riskScore)}`}
                style={{ width: `${riskPercent}%` }}
              />
            </div>

            <div className="flex justify-between items-center w-full">
              <span className="text-[9px] font-mono text-muted uppercase tracking-widest">
                severity level
              </span>
              <span className={`text-[10px] font-mono font-bold ${getRiskTextColor(data.riskScore)}`}>
                {riskPercent}% risk
              </span>
            </div>
          </div>
        </div>
        
        {/* 8. Compact Action Button */}
        <button className="w-full sm:w-auto px-6 py-2.5 border border-surface text-[9px] font-mono uppercase tracking-widest text-muted group-hover:border-[var(--projects-accent)] group-hover:bg-[var(--projects-accent-soft)] group-hover:text-[var(--projects-accent)] transition-all rounded-sm active:scale-95 shrink-0 mt-2 sm:mt-0">
          view
        </button>
      </div>
    </div>
  );
};

export default React.memo(CaseCard);