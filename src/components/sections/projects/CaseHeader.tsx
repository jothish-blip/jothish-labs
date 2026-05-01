interface Props {
  id: string;
  title: string;
  onClose: () => void;
}

export default function CaseHeader({ id, title, onClose }: Props) {
  return (
    <div className="sticky top-0 z-20 bg-[#050505]/95 backdrop-blur-md border-b border-white/5 p-5">
      <div className="w-full flex items-center justify-between mb-4">
        <button 
          onClick={onClose}
          className="flex items-center gap-2 px-3 py-2 text-[10px] font-mono border border-zinc-800 text-zinc-400 hover:text-white hover:border-white/30 hover:scale-[1.02] active:scale-[0.98] transition uppercase rounded-sm"
        >
          <span>←</span> Back
        </button>
        <button 
          onClick={onClose}
          className="w-9 h-9 border border-white/10 flex items-center justify-center text-zinc-500 hover:text-white hover:border-white/30 hover:scale-[1.02] active:scale-[0.98] transition-all bg-black rounded-sm"
        >
          ✕
        </button>
      </div>
      <div className="space-y-2">
        <p className="text-[10px] font-mono text-zinc-600 tracking-widest uppercase">
          CASE_FILES / {id}
        </p>
        <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-white">
          {title}
        </h2>
      </div>
    </div>
  );
}