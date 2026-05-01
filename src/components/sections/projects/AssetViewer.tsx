"use client";
import { useEffect } from "react";
import { Asset } from "@/lib/projects/types";

interface Props {
  file: Asset;
  activeCaseId?: string;
  onClose: () => void;
}

export default function AssetViewer({ file, activeCaseId, onClose }: Props) {
  // 6. Interaction: Escape key listener
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    // 4. Visual Balance: Reduced blur to md for performance
    <div className="fixed inset-0 z-50 pt-[80px] md:pt-[100px] px-0 pb-0 sm:px-6 sm:pb-6 bg-surface-strong backdrop-blur-md flex flex-col items-center justify-center overflow-hidden">
      
      {/* 4 & 5. Mobile/Desktop sizing + shadow adjustments */}
      <div className="w-full min-h-[100dvh] md:h-auto md:max-h-[95vh] md:w-[92vw] md:max-w-6xl bg-surface md:border md:border-surface md:rounded-sm shadow-lg dark:shadow-2xl flex flex-col overflow-hidden relative animate-in fade-in zoom-in-95 duration-300 ease-out">
        
        {/* 6. Interaction: Top-Right Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-muted hover:text-foreground transition z-20"
          aria-label="Close viewer"
        >
          ✕
        </button>

        <div className="flex-none flex items-center justify-between p-4 md:p-5 border-b border-surface bg-surface-strong">
          <div className="flex items-center gap-4">
            {/* 3. Dark/Light Mode: Accent variable instead of cyan-500 */}
            <div className="w-2 h-2 rounded-full animate-pulse bg-[var(--accent)]"></div>
            <div className="flex flex-col space-y-1">
              {/* 2. Professional Wording */}
              <p className="text-[10px] font-mono text-muted tracking-widest uppercase pr-8">
                Case {activeCaseId} • Asset
              </p>
              <span className="font-mono text-[10px] md:text-xs text-muted tracking-widest uppercase truncate pr-8">
                {file.name}
              </span>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto bg-background flex flex-col relative" style={{ WebkitOverflowScrolling: "touch" }}>
          <div className="flex-none p-4 md:p-8 flex flex-col items-center justify-center">
            {file.type === 'image' ? (
              <img 
                src={file.url} 
                alt={file.name} 
                className="max-w-full h-auto object-contain border border-surface rounded-sm shadow-lg mx-auto block" 
              />
            ) : (
              <div className="w-full flex flex-col items-center">
                <div className="w-full h-[70vh] md:h-[75vh] relative rounded-sm overflow-hidden border border-surface bg-surface shadow-lg">
                  <iframe 
                    src={file.url} 
                    title={file.name} 
                    className="w-full h-full border-none"
                  />
                </div>
                {/* 7. PDF Viewer UX: Fallback message outside the iframe */}
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

          <div className="flex-none border-t border-surface bg-surface p-4 sm:p-6 flex flex-row justify-end gap-4 mt-auto">
            {/* 8 & 9. Button UI/UX: Clean text, better sizing, theme variables */}
            <button
              onClick={onClose}
              className="flex-1 sm:flex-none px-6 py-3.5 text-[11px] min-h-[44px] border border-surface text-foreground hover:bg-surface-strong transition uppercase font-mono tracking-widest rounded-sm flex items-center justify-center"
            >
              Close
            </button>
            <a
              href={file.url}
              download
              target="_blank"
              rel="noreferrer"
              className="flex-1 sm:flex-none px-6 py-3.5 text-[11px] min-h-[44px] bg-[var(--accent)] text-white hover:brightness-110 active:brightness-90 transition-all uppercase font-mono tracking-widest rounded-sm shadow-md flex items-center justify-center text-center"
            >
              Download
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}