import { Asset } from "@/lib/projects/types";

interface Props {
  file: Asset;
  activeCaseId?: string;
  onClose: () => void;
}

export default function AssetViewer({ file, activeCaseId, onClose }: Props) {
  return (
    <div className="fixed inset-0 z-50 pt-[80px] md:pt-[100px] px-0 pb-0 sm:px-6 sm:pb-6 bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center overflow-hidden">
      <div className="w-full h-[100dvh] md:h-auto md:max-h-[95vh] md:w-[90vw] md:max-w-5xl bg-[#050505] md:border md:border-white/10 md:rounded-sm shadow-2xl flex flex-col overflow-hidden relative animate-in fade-in zoom-in-95 duration-300 ease-out">
        <div className="flex-none flex items-center justify-between p-4 md:p-5 border-b border-white/5 bg-[#0a0a0a]">
          <div className="flex items-center gap-4">
            <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse"></div>
            <div className="flex flex-col space-y-1">
              <p className="text-[10px] font-mono text-zinc-600 tracking-widest uppercase">
                CASE_FILES / {activeCaseId} / ASSET
              </p>
              <span className="font-mono text-[10px] md:text-xs text-zinc-400 tracking-widest uppercase truncate">
                VIEWING_ASSET // {file.name}
              </span>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto bg-[#030303] flex flex-col relative" style={{ WebkitOverflowScrolling: "touch" }}>
          <div className="flex-none p-4 md:p-8 flex flex-col items-center justify-center">
            {file.type === 'image' ? (
              <img src={file.url} alt={file.name} className="max-w-full h-auto object-contain border border-white/10 rounded-sm shadow-lg mx-auto block" />
            ) : (
              <div className="w-full h-[70vh] md:h-[75vh] relative rounded-sm overflow-hidden border border-white/10 bg-zinc-900/50 shadow-lg">
                <iframe src={file.url} title={file.name} className="w-full h-full border-none">
                  <div className="flex flex-col items-center justify-center h-full space-y-4 text-center p-4">
                    <p className="font-mono text-zinc-400">Unable to render PDF inline.</p>
                    <a href={file.url} target="_blank" rel="noreferrer" className="text-cyan-500 underline font-mono text-xs hover:text-cyan-400">Download to view</a>
                  </div>
                </iframe>
              </div>
            )}
          </div>

          <div className="flex-none border-t border-white/5 bg-[#080808] p-4 sm:p-6 flex flex-row justify-end gap-4 mt-auto">
            <button 
              onClick={onClose}
              className="flex-1 sm:flex-none sm:w-auto px-6 py-3 text-[10px] border border-white/20 text-white hover:bg-white/5 tracking-widest uppercase font-mono rounded-sm transition-colors hover:scale-[1.02] active:scale-[0.98]"
            >
              ← Back to Case
            </button>
            <a 
              href={file.url}
              download
              target="_blank"
              rel="noreferrer"
              className="flex-1 sm:flex-none sm:w-auto px-6 py-3 text-[10px] bg-cyan-500 text-black transition-colors hover:bg-cyan-400 active:bg-cyan-600 tracking-widest uppercase font-mono font-bold rounded-sm shadow-md flex items-center justify-center text-center hover:scale-[1.02] active:scale-[0.98]"
            >
              Download
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}