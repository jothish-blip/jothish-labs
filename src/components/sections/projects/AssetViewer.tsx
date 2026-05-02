"use client";
import { useState, useEffect } from "react";
import { Asset } from "@/lib/projects/types";

interface Props {
  file: Asset;
  assets: Asset[];
  activeCaseId?: string;
  onClose: () => void;
  onNavigate: (file: Asset) => void;
}

export default function AssetViewer({ file, assets, activeCaseId, onClose, onNavigate }: Props) {
  const [loading, setLoading] = useState(true);

  const currentIndex = assets.findIndex(a => a.url === file.url);
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < assets.length - 1;

  const handlePrev = () => {
    if (hasPrev) onNavigate(assets[currentIndex - 1]);
  };

  const handleNext = () => {
    if (hasNext) onNavigate(assets[currentIndex + 1]);
  };

  // Reset loading state when navigating to a new file
  useEffect(() => {
    setLoading(true);
  }, [file]);

  // Interaction: Escape and Arrow key listener
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose, handleNext, handlePrev]); // Include dependencies

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-surface-strong/80 backdrop-blur-md p-2 sm:p-6 cursor-pointer animate-in fade-in duration-200"
      onClick={onClose}
    >
      
      <div 
        className="flex flex-col w-full h-full md:h-auto md:max-h-[90vh] md:max-w-6xl bg-surface/95 backdrop-blur border border-surface rounded-sm shadow-2xl overflow-hidden cursor-auto animate-in zoom-in-95 duration-200 ease-out"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header with Navigation */}
        <div className="flex items-center justify-between px-4 md:px-5 py-3 border-b border-surface bg-surface/80 backdrop-blur-sm shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-2.5 h-2.5 rounded-full bg-[var(--accent)] shadow-sm animate-pulse"></div>

            <div className="flex flex-col">
              <p className="text-[9px] font-mono text-muted uppercase tracking-widest flex gap-2">
                <span>Case {activeCaseId} • Asset Viewer</span>
                <span className="text-foreground opacity-50">•</span>
                <span className="text-[var(--accent)]">Asset {currentIndex + 1} / {assets.length}</span>
              </p>

              <span className="text-[11px] font-mono text-foreground truncate max-w-[200px] sm:max-w-sm mt-0.5">
                {file.name}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-5 shrink-0">
            
            {/* Asset Navigation */}
            <div className="flex items-center gap-1.5 border-r border-surface pr-3 sm:pr-5">
              <button
                onClick={handlePrev}
                disabled={!hasPrev}
                className="px-2.5 py-1 text-[11px] font-mono border border-surface rounded-sm disabled:opacity-30 hover:border-[var(--accent)] hover:bg-[var(--accent-soft)] transition"
              >
                ←
              </button>

              <button
                onClick={handleNext}
                disabled={!hasNext}
                className="px-2.5 py-1 text-[11px] font-mono border border-surface rounded-sm disabled:opacity-30 hover:border-[var(--accent)] hover:bg-[var(--accent-soft)] transition"
              >
                →
              </button>
            </div>

            <button
              onClick={onClose}
              className="text-[11px] font-mono text-muted hover:text-red-500 transition flex items-center gap-1"
            >
              ✕ close
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto bg-background flex flex-col relative">
          <div className="flex-none p-4 md:p-8 flex flex-col items-center justify-center min-h-full">
            {file.type === 'image' ? (
              <img 
                src={file.url} 
                alt={file.name} 
                className="max-w-full h-auto object-contain border border-surface rounded-sm shadow-xl mx-auto block hover:scale-[1.02] transition-transform duration-300 cursor-zoom-in" 
              />
            ) : (
              <div className="w-full flex flex-col items-center">
                
                <div className="w-full h-[75vh] md:h-[80vh] relative rounded-sm overflow-hidden border border-surface bg-surface shadow-lg">
                  
                  {/* Upgraded Loading UX */}
                  {loading && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-xs font-mono text-muted z-0 bg-background/50 backdrop-blur-sm">
                      <div className="w-6 h-6 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin"></div>
                      loading preview...
                    </div>
                  )}

                  <iframe 
                    src={file.url} 
                    title={file.name} 
                    className={`w-full h-full border-none relative z-10 transition-opacity duration-300 ${loading ? 'opacity-0' : 'opacity-100'}`}
                    onLoad={() => setLoading(false)}
                    loading="lazy"
                  />
                </div>
                
                <div className="text-center text-muted text-xs font-mono mt-4">
                  If the preview doesn't load,{" "}
                  <a
                    href={file.url}
                    target="_blank"
                    rel="noreferrer"
                    className="underline text-[var(--accent)] hover:brightness-110 transition-all"
                  >
                    open file
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Footer Area */}
          <div className="flex-none border-t border-surface bg-surface p-4 sm:p-5 flex flex-row justify-end gap-3 mt-auto shrink-0">
            
            <a
              href={file.url}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 text-[10px] border border-surface text-muted hover:text-foreground hover:border-[var(--accent)] transition uppercase font-mono tracking-widest rounded-sm"
            >
              open ↗
            </a>

            <button
              onClick={onClose}
              className="px-4 py-2 text-[10px] border border-surface text-muted hover:text-foreground hover:border-[var(--accent)] transition uppercase font-mono tracking-widest rounded-sm"
            >
              close
            </button>
            
            <a
              href={file.url}
              download
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 text-[10px] border border-[var(--accent)] text-[var(--accent)] hover:bg-[var(--accent-soft)] transition uppercase font-mono tracking-widest rounded-sm flex items-center gap-1"
            >
              download ⬇
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}