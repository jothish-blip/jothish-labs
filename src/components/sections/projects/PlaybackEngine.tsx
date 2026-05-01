"use client";
import { useState, useEffect } from "react";
import { PlaybackStep } from "@/lib/projects/types";

interface Props {
  playback: PlaybackStep[];
  activeStep: number;
  onStepChange: (step: number) => void;
  onLoadingChange: (loading: boolean) => void;
}

// 4. SQL Highlight Fixes using CSS Variables
const HighlightSQL = ({ text }: { text: string }) => {
  const words = text.split(/(\s+|;)/);
  return (
    <>
      {words.map((word, i) => {
        const upper = word.toUpperCase();
        if (['SELECT', 'FROM', 'WHERE'].includes(upper)) return <span key={i} className="text-[var(--success)] font-bold">{word}</span>;
        if (['AND', 'OR', 'NOT', 'LIKE'].includes(upper)) return <span key={i} className="text-[var(--accent)] font-bold">{word}</span>;
        if (word.startsWith("'") && word.endsWith("'")) return <span key={i} className="text-[var(--warning)]">{word}</span>;
        return <span key={i}>{word}</span>;
      })}
    </>
  );
};

export default function PlaybackEngine({ playback, activeStep, onStepChange, onLoadingChange }: Props) {
  const [autoPlay, setAutoPlay] = useState(false);
  const [displayedQuery, setDisplayedQuery] = useState("");
  const [loading, setLoading] = useState(true);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        setAutoPlay(false);
        onStepChange(Math.min(activeStep + 1, playback.length - 1));
      }
      if (e.key === "ArrowLeft") {
        setAutoPlay(false);
        onStepChange(Math.max(activeStep - 1, 0));
      }
      if (e.key === " ") {
        e.preventDefault();
        setAutoPlay(prev => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeStep, playback.length, onStepChange]);

  // Autoplay Logic
  useEffect(() => {
    if (!autoPlay) return;
    const interval = setInterval(() => {
      onStepChange(activeStep >= playback.length - 1 ? activeStep : activeStep + 1);
      if (activeStep >= playback.length - 1) setAutoPlay(false);
    }, 4000);
    return () => clearInterval(interval);
  }, [autoPlay, activeStep, playback.length, onStepChange]);

  // Animation & Execution
  useEffect(() => {
    const stepData = playback[activeStep];
    if (!stepData) return;

    setDisplayedQuery("");
    setLoading(true);
    onLoadingChange(true);

    let i = 0;
    let animationFrameId: number;
    let lastTime = performance.now();

    const typeWriter = (time: number) => {
      if (time - lastTime > 20) {
        i++;
        setDisplayedQuery(stepData.query.slice(0, i));
        lastTime = time;
      }
      if (i < stepData.query.length) {
        animationFrameId = requestAnimationFrame(typeWriter);
      }
    };
    animationFrameId = requestAnimationFrame(typeWriter);

    const loadTimeout = setTimeout(() => {
      setLoading(false);
      onLoadingChange(false);
    }, 800);

    return () => {
      cancelAnimationFrame(animationFrameId);
      clearTimeout(loadTimeout);
    };
  }, [activeStep, playback, onLoadingChange]);

  const isFinalStep = activeStep === playback.length - 1;

  return (
    <>
      {/* 3. Global Theme Tokens */}
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

      <div className="space-y-6 border border-surface bg-surface p-1 rounded-sm shadow-md dark:shadow-2xl">
        {/* 5. Header UI Improvements */}
        <div className="bg-surface/95 backdrop-blur-sm p-4 flex justify-between items-center border-b border-surface">
          <div className="flex items-center gap-4">
            {/* 2. Removed Fake Labels */}
            <h4 className="font-mono text-[10px] text-[var(--accent)] tracking-[0.4em] uppercase flex items-center gap-2">
              <div className={`w-1.5 h-1.5 rounded-full ${autoPlay ? "bg-[var(--danger)] animate-pulse" : "bg-[var(--accent)]"}`}></div>
              Query Playback
            </h4>
            {/* 1. Broken Characters Fixed */}
            <span className="hidden sm:inline-block text-[9px] font-mono text-muted border border-surface px-2 py-0.5 rounded-sm">
              [←] [→] [SPACE]
            </span>
          </div>
          {/* 1. Broken Characters Fixed */}
          <button 
            onClick={() => setAutoPlay(!autoPlay)}
            className={`text-[10px] font-mono transition-colors uppercase tracking-widest ${autoPlay ? "text-[var(--danger)]" : "text-[var(--accent)] hover:brightness-110"}`}
          >
            {autoPlay ? "⏸ Pause" : "▶ Auto Play"}
          </button>
        </div>

        <div className="w-full h-[1px] bg-surface">
          {/* 6. Progress Bar Fix */}
          <div 
            className="h-full bg-[var(--accent)] transition-all duration-300 ease-out"
            style={{ width: `${((activeStep + 1) / playback.length) * 100}%` }}
          />
        </div>

        <div className="p-4 sm:p-5 space-y-6">
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-foreground tracking-tight">
              {playback[activeStep].title}
            </h3>
            {/* 2 & 3. Label & Color Fixes */}
            <div className="bg-background border border-surface p-3 rounded-sm border-l-2" style={{ borderLeftColor: 'var(--accent)' }}>
              <p className="text-[10px] text-muted font-mono uppercase mb-1">Purpose</p>
              <p className="text-[12px] text-muted leading-relaxed">
                {playback[activeStep].intent}
              </p>
            </div>
          </div>

          {/* 7. Mobile UX Fix: Increased font size to 13px */}
          <div className="bg-surface border border-surface p-4 rounded-sm font-mono text-[13px] text-muted whitespace-pre-wrap min-h-[70px] leading-relaxed shadow-inner">
            <HighlightSQL text={displayedQuery} />
            {displayedQuery.length < playback[activeStep].query.length && (
              <span className="animate-pulse w-1.5 h-3.5 inline-block ml-1 align-middle" style={{ backgroundColor: 'var(--success)' }}></span>
            )}
          </div>

          <div className="min-h-[140px]">
            {loading ? (
              <div className="h-full flex items-center justify-center p-8 border border-surface bg-surface-strong rounded-sm">
                {/* 8. Loading State Fix */}
                <p className="text-muted font-mono text-[10px] uppercase tracking-widest animate-pulse">Running query...</p>
              </div>
            ) : (
              <div className="space-y-4 animate-in fade-in duration-500">
                <div className="overflow-x-auto border border-surface rounded-sm">
                  <table className="w-full text-[11px] font-mono text-left whitespace-nowrap">
                    <thead className="text-muted bg-surface-strong border-b border-surface">
                      <tr>
                        {Object.keys(playback[activeStep].resultRows[0] || {}).map((key) => (
                          <th key={key} className="px-4 py-2.5 font-medium">{key}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="text-muted bg-surface-strong">
                      {playback[activeStep].resultRows.map((row, i) => (
                        <tr key={i} className="border-b border-surface hover:bg-surface-strong/80 transition-colors">
                          {Object.values(row).map((val, j) => (
                            // 3. Status text uses danger token
                            <td key={j} className={`px-4 py-2.5 ${val === 'FAILED' ? 'text-[var(--danger)] font-bold' : ''}`}>
                              {val}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* 1 & 9. Delta label and color fix */}
                <div className="text-[10px] font-mono border-l-2 pl-3 py-1 text-[var(--warning)]" style={{ borderLeftColor: 'var(--warning)', backgroundColor: 'var(--accent-soft)' }}>
                  Δ Change: {playback[activeStep].delta}
                </div>

                {/* 10. Anomaly Box Fix */}
                {playback[activeStep].anomaly && (
                  <div className="border p-3 font-mono text-xs animate-in slide-in-from-bottom-2" style={{ backgroundColor: 'rgba(220, 38, 38, 0.1)', borderColor: 'rgba(220, 38, 38, 0.3)', color: 'var(--danger)' }}>
                    {playback[activeStep].anomaly}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-surface space-y-1 h-[60px] overflow-hidden">
            {!loading && playback[activeStep].logs.map((log, i) => (
              <p key={i} className="text-[9px] font-mono text-muted animate-in fade-in slide-in-from-left-2" style={{ animationDelay: `${i * 150}ms`, animationFillMode: "both" }}>
                {log}
              </p>
            ))}
          </div>

          <div className="flex justify-between pt-2">
            {/* 1 & 11. Broken characters and button states fixed */}
            <button
              onClick={() => { setAutoPlay(false); onStepChange(Math.max(activeStep - 1, 0)); }}
              disabled={activeStep === 0}
              className="px-4 py-2 text-[10px] border border-surface text-muted disabled:opacity-30 hover:bg-surface-strong hover:scale-[1.02] active:scale-[0.98] transition uppercase tracking-widest rounded-sm"
            >
              ← Previous
            </button>
            <button
              onClick={() => { setAutoPlay(false); onStepChange(Math.min(activeStep + 1, playback.length - 1)); }}
              disabled={activeStep === playback.length - 1}
              className="px-6 py-2 text-[10px] bg-[var(--accent)] text-white font-mono disabled:opacity-30 hover:brightness-110 active:brightness-90 hover:scale-[1.02] active:scale-[0.98] transition uppercase tracking-widest font-bold rounded-sm shadow-sm"
            >
              Next →
            </button>
          </div>
          
          {/* 12. Final Assessment Box Fix */}
          {isFinalStep && !loading && (
            <div className="mt-4 border p-5 rounded-sm animate-in zoom-in-95 duration-500 bg-[var(--accent-soft)]" style={{ borderColor: 'var(--accent-soft)' }}>
              <h3 className="text-xs font-mono tracking-widest uppercase text-[var(--accent)]">Final Assessment</h3>
              <p className="text-[13px] text-foreground/80 mt-2 leading-relaxed">
                Investigation effectively correlated timeline, geospatial data, and access logs to pinpoint compromised accounts and lateral exposure risks. Threat profile successfully mapped for immediate mitigation.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}