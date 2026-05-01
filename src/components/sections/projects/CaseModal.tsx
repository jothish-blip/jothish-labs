"use client";
import { useState } from "react";
import { CaseData, Asset } from "@/lib/projects/types";
import CaseHeader from "./CaseHeader";
import Timeline from "./Timeline";
import PlaybackEngine from "./PlaybackEngine";
import Checklist from "./Checklist";

interface Props {
  data: CaseData;
  onClose: () => void;
  onOpenAsset: (asset: Asset) => void;
}

const statusMap: Record<string, string> = {
  CRITICAL_RISK: "High Risk",
  SECURED: "Secured",
  WARNING: "Moderate",
};

export default function CaseModal({ data, onClose, onOpenAsset }: Props) {
  const [activeStep, setActiveStep] = useState(0);
  const [showRecs, setShowRecs] = useState(false);
  const [playbackLoading, setPlaybackLoading] = useState(false);

  const hasPlayback = data.playback && data.playback.length > 0;
  const linkedControl = hasPlayback && !playbackLoading ? data.playback![activeStep].linkedControl : null;

  const getStatusColor = (status: string) => {
    if (status === 'CRITICAL_RISK') return 'text-[var(--danger)]';
    if (status === 'SECURED') return 'text-[var(--success)]';
    return 'text-[var(--warning)]';
  };

  // Handles both string and number for riskScore to prevent build errors
  const getRiskScoreColor = (score: number | string) => {
    const num = typeof score === 'string' ? parseInt(score, 10) : score;
    if (isNaN(num)) return 'text-muted';
    if (num >= 7) return 'text-[var(--danger)]';
    return 'text-[var(--warning)]';
  };

  return (
    <>
      <style jsx global>{`
        :root {
          --accent: #0891b2;
          --accent-soft: rgba(8, 145, 178, 0.08);
          --danger: #dc2626;
          --warning: #d97706;
          --success: #059669;
        }
        html.dark {
          --accent: #22d3ee;
          --accent-soft: rgba(34, 211, 238, 0.1);
          --danger: #ef4444;
          --warning: #f59e0b;
          --success: #10b981;
        }
      `}</style>

      <div className="fixed inset-0 z-40 pt-[80px] md:pt-[100px] px-0 pb-0 sm:px-6 sm:pb-6 bg-surface/95 backdrop-blur-md flex flex-col items-center overflow-hidden">
        <div 
          className="w-full h-full max-w-5xl bg-surface sm:border border-surface sm:rounded-md shadow-2xl flex flex-col relative overflow-y-auto animate-in fade-in zoom-in-95 duration-300 ease-out" 
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          <CaseHeader id={data.id} title={data.title} onClose={onClose} />

          <div className="p-4 sm:p-6 space-y-6">
            <div className="space-y-4 border-b border-surface pb-5">
              <div className="flex flex-wrap gap-4 text-[10px] font-mono text-muted uppercase tracking-widest">
                <span>Category: <span className="text-foreground">{data.category}</span></span>
                <span className={getStatusColor(data.status)}>
                  Status: {statusMap[data.status] || "Moderate"}
                </span>
                <span>Risk Level: <span className={data.riskLevel === 'High' ? 'text-[var(--danger)]' : 'text-[var(--warning)]'}>{data.riskLevel}</span></span>
              </div>
              
              <p className="text-[13px] text-muted leading-relaxed max-w-2xl font-light">{data.description}</p>
            </div>
            
            <div className="flex flex-wrap gap-6 text-[10px] font-mono text-muted border-b border-surface pb-5 uppercase tracking-widest">
              <div className="flex gap-2">Risk Score: <span className={getRiskScoreColor(data.riskScore)}>{data.riskScore}/10</span></div>
              <div className="flex gap-2">Vulnerabilities: <span className="text-foreground">{data.vulnerabilities}</span></div>
              
              {/* FIXED: Uses type casting to handle the transition from 'controlsFailed' to 'failedControls' safely */}
              <div className="flex gap-2">
                Controls Failed: <span className="text-[var(--danger)]">
                  {data.failedControls ?? (data as any).controlsFailed}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-5 space-y-8">
                {(data.timeline || data.playback) && (
                  <Timeline 
                    steps={data.playback || data.timeline!} 
                    activeStep={activeStep} 
                    onStepChange={setActiveStep} 
                    isPlaybackContext={!!data.playback} 
                  />
                )}

                <div className="space-y-3">
                  <h4 className="font-mono text-[10px] text-muted tracking-widest uppercase">Summary</h4>
                  {/* FIXED: Safely handles renaming of investigationNotes to summary */}
                  <p className="text-[13px] text-muted leading-relaxed font-light">
                    {data.summary ?? (data as any).investigationNotes}
                  </p>
                </div>

                <div className="space-y-3 border-t border-surface pt-6">
                  <div className="flex items-center justify-between">
                    <h4 className="font-mono text-[10px] text-muted tracking-widest uppercase">Mitigation Steps</h4>
                    <button 
                      onClick={() => setShowRecs(!showRecs)} 
                      className="text-[10px] font-mono text-[var(--accent)] hover:opacity-80 transition-opacity uppercase"
                    >
                      {showRecs ? "Hide" : "View"} Details
                    </button>
                  </div>
                  {showRecs && (
                    <ul className="space-y-3 pt-3 animate-in fade-in slide-in-from-top-2 duration-300">
                      {data.recommendations.map((rec, i) => (
                        <li key={i} className="flex gap-3 text-xs text-muted font-mono">
                          <span className="text-muted">0{i+1}</span> {rec}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              <div className="lg:col-span-7 space-y-8">
                {hasPlayback && (
                  <PlaybackEngine 
                    playback={data.playback!} 
                    activeStep={activeStep} 
                    onStepChange={setActiveStep} 
                    onLoadingChange={setPlaybackLoading}
                  />
                )}
                <Checklist checklist={data.checklist} linkedControl={linkedControl} />
              </div>
            </div>

            <div className="pt-8 border-t border-surface">
              <h4 className="font-mono text-[10px] text-muted tracking-widest uppercase mb-4">Attachments</h4>
              <div className="flex flex-wrap gap-4">
                {data.assets.map((asset, i) => (
                  <button 
                    key={i}
                    onClick={(e) => { e.preventDefault(); onOpenAsset(asset); }}
                    className={`px-6 py-3 text-[10px] font-bold tracking-[0.2em] uppercase hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 rounded-sm ${
                      asset.isPrimary 
                        ? "bg-[var(--accent)] text-white hover:brightness-110 shadow-sm" 
                        : "border border-surface text-muted hover:text-foreground hover:border-[var(--accent)]/40 bg-surface"
                    }`}
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="opacity-70"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
                    {asset.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}