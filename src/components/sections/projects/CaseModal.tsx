"use client";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
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
  const [mounted, setMounted] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [showRecs, setShowRecs] = useState(false);
  const [playbackLoading, setPlaybackLoading] = useState(false);

  // Ensure portal only renders on the client to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Performance Fix: Reset step when case changes
  useEffect(() => {
    setActiveStep(0);
  }, [data]);

  const hasPlayback = data.playback && data.playback.length > 0;
  const linkedControl = hasPlayback && !playbackLoading ? data.playback![activeStep].linkedControl : null;

  const getStatusColor = (status: string) => {
    if (status === 'CRITICAL_RISK') return 'text-[var(--danger)]';
    if (status === 'SECURED') return 'text-[var(--success)]';
    return 'text-[var(--warning)]';
  };

  const getRiskScoreColor = (score: number | string) => {
    const num = typeof score === 'string' ? parseInt(score, 10) : score;
    if (isNaN(num)) return 'text-muted';
    if (num >= 7) return 'text-[var(--danger)]';
    return 'text-[var(--warning)]';
  };

  // Don't render until mounted on client
  if (!mounted) return null;

  // Use createPortal to escape the DOM and completely cover the Navbar
  return createPortal(
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-surface-strong/90 backdrop-blur-md p-4 sm:p-6 md:p-10 cursor-pointer animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="w-full h-full md:h-auto md:max-h-[88vh] max-w-5xl bg-surface border border-surface rounded-sm shadow-2xl flex flex-col relative overflow-hidden cursor-auto animate-in zoom-in-95 duration-200 ease-out"
        onClick={(e) => e.stopPropagation()}
      >
        <CaseHeader id={data.id} title={data.title} onClose={onClose} />

        {/* Scrollable Content Wrapper */}
        <div className="relative flex-1 overflow-y-auto">
          
          {/* Scroll Fade Effect (Premium Touch) */}
          <div className="pointer-events-none sticky top-0 left-0 right-0 h-10 bg-gradient-to-b from-surface to-transparent z-10" />

          <div className="p-5 sm:p-6 space-y-6 pt-2">
            
            <div className="space-y-4 border-b border-surface pb-5">
              <div className="flex flex-wrap gap-4 text-[10px] font-mono text-muted uppercase tracking-widest">
                <span>
                  category • <span className="text-foreground">{data.category}</span>
                </span>
                <span className={getStatusColor(data.status)}>
                  status • {statusMap[data.status] || "Moderate"}
                </span>
                <span>
                  risk • <span className={getRiskScoreColor(data.riskScore)}>{data.riskScore}/10</span>
                </span>
              </div>
              
              <p className="text-[13px] text-muted leading-relaxed max-w-2xl font-light">
                {data.description}
              </p>
            </div>
            
            {/* Additional Metadata / Stats */}
            <div className="flex flex-wrap gap-6 text-[10px] font-mono text-muted border-b border-surface pb-5 uppercase tracking-widest">
              <div className="flex gap-2">
                vulnerabilities • <span className="text-foreground">{data.vulnerabilities}</span>
              </div>
              <div className="flex gap-2">
                controls failed • <span className="text-[var(--danger)]">
                  {data.failedControls ?? (data as any).controlsFailed}
                </span>
              </div>
            </div>

            {/* Timeline + Playback Layout (Visual Balance) */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.3fr] gap-8">
              
              {/* Left Column */}
              <div className="space-y-8">
                {(data.timeline || data.playback) && (
                  <Timeline 
                    steps={data.playback || data.timeline!} 
                    activeStep={activeStep} 
                    onStepChange={setActiveStep} 
                    isPlaybackContext={!!data.playback} 
                  />
                )}

                <div className="space-y-3">
                  <h4 className="font-mono text-[9px] text-muted uppercase tracking-widest">
                    Summary
                  </h4>
                  <p className="text-[13px] text-muted leading-relaxed font-light">
                    {data.summary ?? (data as any).investigationNotes}
                  </p>
                </div>

                <div className="space-y-3 border-t border-surface pt-6">
                  <div className="flex items-center justify-between">
                    <h4 className="font-mono text-[9px] text-muted uppercase tracking-widest">
                      Mitigation Steps
                    </h4>
                    <button 
                      onClick={() => setShowRecs(!showRecs)} 
                      className="text-[10px] font-mono text-[var(--accent)] hover:opacity-80 transition-opacity uppercase"
                    >
                      {showRecs ? "collapse" : "expand"} Details
                    </button>
                  </div>
                  {showRecs && (
                    <ul className="space-y-3 pt-3 animate-in fade-in slide-in-from-top-2 duration-300">
                      {data.recommendations.map((rec, i) => (
                        <li key={i} className="flex gap-3 text-xs text-muted font-mono">
                          <span className="text-muted opacity-50">0{i+1}</span> {rec}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-8">
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

            {/* Attachments Footer */}
            <div className="pt-8 border-t border-surface">
              <h4 className="font-mono text-[9px] text-muted uppercase tracking-widest mb-4">
                Attachments
              </h4>
              <div className="flex flex-wrap gap-4">
                {data.assets.map((asset, i) => (
                  <button 
                    key={i}
                    onClick={(e) => { e.preventDefault(); onOpenAsset(asset); }}
                    className="px-4 py-2 text-[10px] font-mono uppercase tracking-widest border border-surface text-muted hover:text-foreground hover:border-[var(--accent)] hover:bg-[var(--accent-soft)] transition rounded-sm flex items-center gap-2"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="opacity-70">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                    </svg>
                    {asset.name}
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}