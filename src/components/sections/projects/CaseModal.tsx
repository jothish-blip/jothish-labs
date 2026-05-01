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

export default function CaseModal({ data, onClose, onOpenAsset }: Props) {
  const [activeStep, setActiveStep] = useState(0);
  const [showRecs, setShowRecs] = useState(false);
  const [playbackLoading, setPlaybackLoading] = useState(false);

  const hasPlayback = data.playback && data.playback.length > 0;
  const linkedControl = hasPlayback && !playbackLoading ? data.playback![activeStep].linkedControl : null;

  return (
    <div className="fixed inset-0 z-40 pt-[80px] md:pt-[100px] px-0 pb-0 sm:px-6 sm:pb-6 bg-black/95 backdrop-blur-xl flex flex-col items-center overflow-hidden">
      <div 
        className="w-full h-full max-w-5xl bg-[#050505] sm:border border-white/10 sm:rounded-md shadow-2xl flex flex-col relative overflow-y-auto animate-in fade-in zoom-in-95 duration-300 ease-out" 
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        <CaseHeader id={data.id} title={data.title} onClose={onClose} />

        <div className="p-5 space-y-8">
          <div className="space-y-4 border-b border-white/5 pb-5">
            <div className="flex flex-wrap gap-4 text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
              <span>CATEGORY: {data.category}</span>
              <span className={data.status === 'CRITICAL_RISK' ? 'text-red-500' : data.status === 'SECURED' ? 'text-emerald-500' : 'text-amber-500'}>
                STATUS: {data.status}
              </span>
              <span>RISK_LEVEL: <span className={data.riskLevel === 'HIGH' ? 'text-red-500' : 'text-amber-500'}>{data.riskLevel}</span></span>
            </div>
            <p className="text-[13px] text-zinc-400 leading-relaxed max-w-2xl font-light">{data.description}</p>
          </div>
          
          <div className="flex flex-wrap gap-6 text-[10px] font-mono text-zinc-500 border-b border-white/5 pb-5 uppercase tracking-widest">
            <div className="flex gap-2">RISK_SCORE: <span className={parseInt(data.riskScore) >= 7 ? "text-red-500" : "text-amber-500"}>{data.riskScore}</span></div>
            <div className="flex gap-2">VULNERABILITIES: <span className="text-zinc-300">{data.vulnerabilities}</span></div>
            <div className="flex gap-2">CONTROLS_FAILED: <span className="text-red-500">{data.controlsFailed}</span></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left Column */}
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
                <h4 className="font-mono text-[10px] text-cyan-700 tracking-[0.4em] uppercase">// INVESTIGATION_NOTES</h4>
                <p className="text-[13px] text-zinc-400 leading-relaxed font-light">{data.investigationNotes}</p>
              </div>

              <div className="space-y-3 border-t border-white/5 pt-6">
                <div className="flex items-center justify-between">
                  <h4 className="font-mono text-[10px] text-zinc-600 tracking-[0.4em] uppercase">// MITIGATION</h4>
                  <button onClick={() => setShowRecs(!showRecs)} className="text-[10px] font-mono text-cyan-500 hover:text-cyan-400 transition-colors uppercase">
                    {showRecs ? "[-]" : "[+]"} {showRecs ? "Hide" : "Show"} Details
                  </button>
                </div>
                {showRecs && (
                  <ul className="space-y-3 pt-3 animate-in fade-in slide-in-from-top-2 duration-300">
                    {data.recommendations.map((rec, i) => (
                      <li key={i} className="flex gap-3 text-xs text-zinc-400 font-mono">
                        <span className="text-zinc-600">0{i+1}</span> {rec}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* Right Column */}
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

          {/* Bottom Document Assets */}
          <div className="pt-8 border-t border-white/5">
            <h4 className="font-mono text-[10px] text-zinc-600 tracking-[0.4em] uppercase mb-4">// ATTACHED_ASSETS</h4>
            <div className="flex flex-wrap gap-4">
              {data.assets.map((asset, i) => (
                <button 
                  key={i}
                  onClick={(e) => { e.preventDefault(); onOpenAsset(asset); }}
                  className={`px-6 py-3 text-[10px] font-bold tracking-[0.2em] uppercase hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 rounded-sm ${
                    asset.isPrimary ? "bg-white text-black hover:bg-cyan-500" : "border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-500 bg-[#080808]"
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
  );
}