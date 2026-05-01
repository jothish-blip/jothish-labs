"use client";
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

export default function CaseCard({ data, onOpen }: Props) {
  
  const getStatusStyles = (status: string) => {
    if (status === 'CRITICAL_RISK') return 'text-[var(--danger)] border-[var(--danger)]/30';
    if (status === 'SECURED') return 'text-[var(--success)] border-[var(--success)]/30';
    return 'text-[var(--warning)] border-[var(--warning)]/30';
  };

  const getRiskScoreColor = (score: number | string) => {
    const num = typeof score === 'string' ? parseInt(score, 10) : score;
    if (isNaN(num)) return 'bg-muted'; // Progress bar uses bg-color
    if (num >= 8) return 'bg-[var(--danger)] text-[var(--danger)]';
    if (num >= 5) return 'bg-[var(--warning)] text-[var(--warning)]';
    return 'bg-[var(--success)] text-[var(--success)]';
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
    <>
      <style jsx global>{`
        :root {
          --danger: #dc2626;
          --warning: #d97706;
          --success: #059669;
        }
        html.dark {
          --danger: #ef4444;
          --warning: #f59e0b;
          --success: #10b981;
        }
      `}</style>

      {/* 2. Professional Layout: Max-width and centering */}
      <div 
        onClick={() => onOpen(data)}
        className="group max-w-4xl mx-auto border border-surface bg-surface p-4 sm:p-5 flex flex-col sm:flex-row justify-between sm:items-center gap-5 transition-all duration-200 cursor-pointer hover:border-[var(--accent)]/40 hover:bg-surface-strong/80 shadow-sm hover:shadow-md active:scale-[0.98]"
      >
        {/* LEFT: Info Section */}
        <div className="space-y-2.5 flex-1">
          <div className="flex items-center gap-3">
            <span className="font-mono text-[9px] px-2 py-0.5 bg-surface-strong/60 text-muted border border-surface">
              ID: {data.id}
            </span>
            <span className={`font-mono text-[9px] px-2 py-0.5 border uppercase tracking-widest ${getStatusStyles(data.status)}`}>
              {displayStatus}
            </span>
          </div>
          
          {/* 4. Responsive Title Hierarchy */}
          <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground group-hover:text-[var(--accent)] transition-colors uppercase tracking-tight">
            {data.title}
          </h3>
          
          <p className="text-[13px] text-muted font-light max-w-xl line-clamp-2 leading-relaxed">
            {data.description}
          </p>
        </div>

        {/* RIGHT: Visual Risk Score & Action */}
        <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto pt-2 sm:pt-0">
          
          {/* 5 & 6. Progress Bar Visualization */}
          <div className="w-full sm:w-44 lg:w-48">
            <p className="text-[9px] text-muted font-mono tracking-widest mb-1.5 hidden sm:block">
              RISK ASSESSMENT
            </p>

            <div className="flex items-center gap-3">
              <div className="w-full h-1 bg-surface-strong rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ease-out ${getRiskScoreColor(data.riskScore).split(' ')[0]}`}
                  style={{ width: `${riskPercent}%` }}
                />
              </div>

              <span className={`text-[10px] font-mono whitespace-nowrap ${getRiskTextColor(data.riskScore)}`}>
                {riskPercent}%
              </span>
            </div>
          </div>
          
          {/* 7. Compact Action Button */}
          <button className="w-10 h-10 min-h-[40px] border border-surface flex items-center justify-center group-hover:border-[var(--accent)] group-hover:bg-[var(--accent-soft)] transition-all rounded-sm active:scale-95">
            <span className="text-muted group-hover:text-[var(--accent)] font-mono transition-colors">
              →
            </span>
          </button>
        </div>
      </div>
    </>
  );
}