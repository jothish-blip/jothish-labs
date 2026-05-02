"use client";
import { useState, useEffect } from "react";
import { PlaybackStep } from "@/lib/projects/types";

interface Props {
  playback: PlaybackStep[];
  activeStep: number;
  onStepChange: (step: number) => void;
  onLoadingChange: (loading: boolean) => void;
}

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
  const [speed, setSpeed] = useState(4000); // 11. AutoPlay Speed Control

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

  // Autoplay Logic with Speed Control
  useEffect(() => {
    if (!autoPlay) return;
    const interval = setInterval(() => {
      onStepChange(activeStep >= playback.length - 1 ? activeStep : activeStep + 1);
      if (activeStep >= playback.length - 1) setAutoPlay(false);
    }, speed);
    return () => clearInterval(interval);
  }, [autoPlay, activeStep, playback.length, onStepChange, speed]);

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
    <div className="space-y-6 border border-surface bg-surface p-1 rounded-sm shadow-md dark:shadow-2xl flex flex-col overflow-hidden">
      
      {/* 2. Premium Header */}
      <div className="bg-surface/90 backdrop-blur border-b border-surface px-4 py-3 flex justify-between items-center shrink-0">
        <div className="flex items-center gap-3">
          <div className={`w-2 h-2 rounded-full shadow-sm ${
            autoPlay ? "bg-[var(--danger)] animate-pulse" : "bg-[var(--accent)]"
          }`} />

          <p className="font-mono text-[9px] uppercase tracking-widest text-muted">
            query playback
          </p>

          <span className="text-[9px] font-mono text-muted hidden sm:inline ml-2">
            {activeStep + 1} / {playback.length}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* 11. Speed Control UI */}
          <select
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            className="text-[9px] font-mono border border-surface bg-surface px-2 py-1 rounded-sm text-muted focus:outline-none focus:border-[var(--accent)] transition-colors cursor-pointer"
          >
            <option value={2000}>fast</option>
            <option value={4000}>normal</option>
            <option value={6000}>slow</option>
          </select>

          <button 
            onClick={() => setAutoPlay(!autoPlay)}
            className={`text-[9px] font-mono transition-colors uppercase tracking-widest px-2 py-1 rounded-sm border ${
              autoPlay 
                ? "text-[var(--danger)] border-[var(--danger)]/30 bg-[var(--danger)]/10" 
                : "text-[var(--accent)] border-transparent hover:border-[var(--accent)]/30 hover:bg-[var(--accent)]/10"
            }`}
          >
            {autoPlay ? "⏸ pause" : "▶ auto play"}
          </button>
        </div>
      </div>

      {/* 3. Improved Progress Bar */}
      <div className="px-4 pb-1">
        <div className="w-full h-[3px] bg-background rounded-full overflow-hidden">
          <div
            className="h-full bg-[var(--accent)] transition-all duration-300 ease-out"
            style={{ width: `${((activeStep + 1) / playback.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="px-4 sm:px-5 pb-5 space-y-6">
        
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-foreground tracking-tight">
            {playback[activeStep].title}
          </h3>
          <div className="bg-[var(--accent-soft)] border-l-2 border-l-[var(--accent)] p-3 rounded-sm">
            <p className="text-[9px] text-muted font-mono uppercase tracking-widest mb-1.5">purpose</p>
            <p className="text-[12px] text-foreground/80 leading-relaxed">
              {playback[activeStep].intent}
            </p>
          </div>
        </div>

        {/* 4 & 5. Improved Query Box with State Indicator */}
        <div className="bg-background border border-surface rounded-sm p-4 font-mono text-[13px] text-muted leading-relaxed shadow-inner relative">
          <div className="flex justify-between items-center mb-3 border-b border-surface/60 pb-2">
            <p className="text-[9px] font-mono text-muted uppercase tracking-widest">
              query execution
            </p>
            <p className={`text-[8px] font-mono uppercase tracking-widest px-1.5 py-0.5 rounded-sm border ${
              loading 
                ? "text-[var(--warning)] border-[var(--warning)]/30 bg-[var(--warning)]/10 animate-pulse" 
                : "text-[var(--success)] border-[var(--success)]/30 bg-[var(--success)]/10"
            }`}>
              {loading ? "executing..." : "completed"}
            </p>
          </div>
          
          <div className="whitespace-pre-wrap min-h-[50px]">
            <HighlightSQL text={displayedQuery} />
            {displayedQuery.length < playback[activeStep].query.length && (
              <span className="animate-pulse w-1.5 h-3.5 inline-block ml-1 align-middle bg-[var(--success)]"></span>
            )}
          </div>
        </div>

        <div className="min-h-[140px]">
          {loading ? (
            <div className="h-full min-h-[140px] flex flex-col items-center justify-center p-8 border border-surface bg-surface-strong rounded-sm gap-3">
              <div className="w-5 h-5 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin"></div>
              <p className="text-muted font-mono text-[9px] uppercase tracking-widest">Running query...</p>
            </div>
          ) : (
            <div className="space-y-5 animate-in fade-in duration-300">
              
              {/* 6. Improved Table UI */}
              <div className="overflow-x-auto border border-surface rounded-sm">
                <table className="w-full text-[11px] font-mono text-left whitespace-nowrap">
                  <thead className="bg-surface border-b border-surface text-[10px] uppercase tracking-widest text-muted">
                    <tr>
                      {Object.keys(playback[activeStep].resultRows[0] || {}).map((key) => (
                        <th key={key} className="px-4 py-3 font-medium">{key}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-surface-strong/50">
                    {playback[activeStep].resultRows.map((row, i) => (
                      <tr key={i} className="border-b border-surface/60 hover:bg-surface/60 transition-colors last:border-0">
                        {Object.values(row).map((val, j) => (
                          <td key={j} className={`px-4 py-2.5 ${val === 'FAILED' ? 'text-[var(--danger)] font-bold' : 'text-foreground/80'}`}>
                            {val}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* 7. Improved Delta Box */}
              {playback[activeStep].delta && (
                <div className="border-l-2 border-l-[var(--warning)] bg-[var(--warning)]/10 px-4 py-3 rounded-sm">
                  <p className="text-[9px] font-mono uppercase tracking-widest mb-1 text-muted">
                    data change
                  </p>
                  <p className="text-[11px] font-mono text-[var(--warning)]">
                    {playback[activeStep].delta}
                  </p>
                </div>
              )}

              {/* 8. Improved Anomaly Box */}
              {playback[activeStep].anomaly && (
                <div className="border border-[var(--danger)]/30 bg-[var(--danger)]/10 p-3 rounded-sm animate-in slide-in-from-bottom-2">
                  <p className="text-[9px] font-mono uppercase tracking-widest mb-1 text-[var(--danger)] opacity-80">
                    anomaly detected
                  </p>
                  <p className="text-[11px] font-mono text-[var(--danger)]">
                    {playback[activeStep].anomaly}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* 9. Improved Logs Section */}
        <div className="pt-4 border-t border-surface/60 space-y-1.5 max-h-[100px] overflow-y-auto pr-2">
          {!loading && playback[activeStep].logs.map((log, i) => (
            <p key={i} className="text-[9px] font-mono text-muted animate-in fade-in slide-in-from-left-2" style={{ animationDelay: `${i * 100}ms`, animationFillMode: "both" }}>
              <span className="opacity-50 mr-2">{'>'}</span>{log}
            </p>
          ))}
        </div>

        <div className="flex justify-between pt-2 border-t border-surface/60">
          {/* 10. Improved Navigation Buttons */}
          <button
            onClick={() => { setAutoPlay(false); onStepChange(Math.max(activeStep - 1, 0)); }}
            disabled={activeStep === 0}
            className="px-4 py-2 text-[9px] font-mono uppercase tracking-widest border border-surface text-muted hover:text-foreground hover:border-[var(--accent)] transition rounded-sm disabled:opacity-30 disabled:pointer-events-none"
          >
            ← previous
          </button>
          <button
            onClick={() => { setAutoPlay(false); onStepChange(Math.min(activeStep + 1, playback.length - 1)); }}
            disabled={activeStep === playback.length - 1}
            className="px-4 py-2 text-[9px] font-mono uppercase tracking-widest border border-surface text-muted hover:text-foreground hover:border-[var(--accent)] transition rounded-sm disabled:opacity-30 disabled:pointer-events-none"
          >
            next →
          </button>
        </div>
        
        {/* 12. Improved Final Assessment Box */}
        {isFinalStep && !loading && (
          <div className="mt-6 border border-[var(--accent)]/30 bg-[var(--accent-soft)] p-5 rounded-sm animate-in zoom-in-95 duration-500">
            <p className="text-[9px] font-mono uppercase tracking-widest text-[var(--accent)] mb-2">
              final assessment
            </p>
            <p className="text-[12px] text-foreground/90 leading-relaxed font-light">
              Investigation effectively correlated timeline, geospatial data, and access logs to pinpoint compromised accounts and lateral exposure risks. Threat profile successfully mapped for immediate mitigation.
            </p>
          </div>
        )}

      </div>
    </div>
  );
}