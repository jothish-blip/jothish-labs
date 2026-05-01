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
        if (['SELECT', 'FROM', 'WHERE'].includes(upper)) return <span key={i} className="text-green-400 font-bold">{word}</span>;
        if (['AND', 'OR', 'NOT', 'LIKE'].includes(upper)) return <span key={i} className="text-cyan-400 font-bold">{word}</span>;
        if (word.startsWith("'") && word.endsWith("'")) return <span key={i} className="text-amber-300">{word}</span>;
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
    <div className="space-y-6 border border-white/5 bg-[#080808] p-1 rounded-sm shadow-2xl">
      <div className="bg-[#050505] p-4 flex justify-between items-center border-b border-white/5">
        <div className="flex items-center gap-4">
          <h4 className="font-mono text-[10px] text-cyan-500 tracking-[0.4em] uppercase flex items-center gap-2">
            <div className={`w-1.5 h-1.5 rounded-full ${autoPlay ? "bg-red-500 animate-pulse" : "bg-cyan-500"}`}></div>
            // QUERY_PLAYBACK
          </h4>
          <span className="hidden sm:inline-block text-[9px] font-mono text-zinc-600 border border-zinc-800 px-2 py-0.5 rounded-sm">
            [←] [→] [SPACE]
          </span>
        </div>
        <button 
          onClick={() => setAutoPlay(!autoPlay)}
          className={`text-[10px] font-mono transition-colors uppercase tracking-widest ${autoPlay ? "text-red-400" : "text-cyan-500 hover:text-cyan-400"}`}
        >
          {autoPlay ? "⏸ Pause" : "▶ Auto Play"}
        </button>
      </div>

      <div className="w-full h-[1px] bg-white/5">
        <div 
          className="h-full bg-cyan-500 transition-all duration-300 ease-out"
          style={{ width: `${((activeStep + 1) / playback.length) * 100}%` }}
        />
      </div>

      <div className="p-4 sm:p-5 space-y-6">
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-white tracking-tight">
            {playback[activeStep].title}
          </h3>
          <div className="bg-[#030303] border border-white/5 p-3 rounded-sm border-l-2 border-l-cyan-900">
            <p className="text-[10px] text-zinc-600 font-mono uppercase mb-1">// INTENT</p>
            <p className="text-[12px] text-zinc-400 leading-relaxed">
              {playback[activeStep].intent}
            </p>
          </div>
        </div>

        <div className="bg-black border border-white/10 p-4 rounded-sm font-mono text-[12px] text-zinc-300 whitespace-pre-wrap min-h-[70px] leading-relaxed shadow-inner">
          <HighlightSQL text={displayedQuery} />
          {displayedQuery.length < playback[activeStep].query.length && (
            <span className="animate-pulse bg-green-400 w-1.5 h-3.5 inline-block ml-1 align-middle"></span>
          )}
        </div>

        <div className="min-h-[140px]">
          {loading ? (
            <div className="h-full flex items-center justify-center p-8 border border-white/5 bg-black/50 rounded-sm">
              <p className="text-zinc-600 font-mono text-[10px] uppercase tracking-widest animate-pulse">Executing query...</p>
            </div>
          ) : (
            <div className="space-y-4 animate-in fade-in duration-500">
              <div className="overflow-x-auto border border-white/5 rounded-sm">
                <table className="w-full text-[11px] font-mono text-left whitespace-nowrap">
                  <thead className="text-zinc-500 bg-zinc-950/50 border-b border-white/10">
                    <tr>
                      {Object.keys(playback[activeStep].resultRows[0] || {}).map((key) => (
                        <th key={key} className="px-4 py-2 font-medium">{key}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="text-zinc-300 bg-black/50">
                    {playback[activeStep].resultRows.map((row, i) => (
                      <tr key={i} className="border-b border-white/5 hover:bg-white/[0.02]">
                        {Object.values(row).map((val, j) => (
                          <td key={j} className={`px-4 py-2 ${val === 'FAILED' ? 'text-red-400' : ''}`}>
                            {val}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="text-[10px] font-mono text-amber-400 border-l-2 border-amber-500/50 pl-3 py-1 bg-amber-500/5">
                Δ CHANGE: {playback[activeStep].delta}
              </div>

              {playback[activeStep].anomaly && (
                <div className="bg-red-950/20 border border-red-500/30 p-3 text-red-400 font-mono text-xs animate-in slide-in-from-bottom-2">
                  {playback[activeStep].anomaly}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="pt-4 border-t border-white/5 space-y-1 h-[60px] overflow-hidden">
          {!loading && playback[activeStep].logs.map((log, i) => (
            <p key={i} className="text-[9px] font-mono text-zinc-600 animate-in fade-in slide-in-from-left-2" style={{ animationDelay: `${i * 150}ms`, animationFillMode: "both" }}>
              {log}
            </p>
          ))}
        </div>

        <div className="flex justify-between pt-2">
          <button
            onClick={() => { setAutoPlay(false); onStepChange(Math.max(activeStep - 1, 0)); }}
            disabled={activeStep === 0}
            className="px-4 py-2 text-[10px] border border-zinc-800 text-zinc-400 disabled:opacity-30 hover:scale-[1.02] active:scale-[0.98] transition uppercase tracking-widest"
          >
            ← Previous
          </button>
          <button
            onClick={() => { setAutoPlay(false); onStepChange(Math.min(activeStep + 1, playback.length - 1)); }}
            disabled={activeStep === playback.length - 1}
            className="px-6 py-2 text-[10px] bg-cyan-500 text-black font-mono disabled:opacity-30 hover:bg-cyan-400 hover:scale-[1.02] active:scale-[0.98] transition uppercase tracking-widest font-bold"
          >
            Next →
          </button>
        </div>
        
        {isFinalStep && !loading && (
          <div className="mt-4 border border-cyan-500/30 bg-cyan-950/10 p-5 rounded-sm animate-in zoom-in-95 duration-500">
            <h3 className="text-xs font-mono text-cyan-400 tracking-widest uppercase">// FINAL_ASSESSMENT</h3>
            <p className="text-[13px] text-zinc-300 mt-2 leading-relaxed">
              Investigation effectively correlated timeline, geospatial data, and access logs to pinpoint compromised accounts and lateral exposure risks. Threat profile successfully mapped for immediate mitigation.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}