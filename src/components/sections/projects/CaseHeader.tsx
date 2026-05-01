"use client";

interface Props {
  id: string;
  title: string;
  onClose: () => void;
}

export default function CaseHeader({ id, title, onClose }: Props) {
  return (
    /* 
      FIXED: Implemented a layered gradient background.
      The fade from background/80 to background/60 combined with 
      backdrop-blur-md creates a deep, 'frosted' look that effectively 
      masks underlying text while maintaining a high-end UI aesthetic.
    */
    <div className="sticky top-0 z-20 bg-gradient-to-b from-background/80 via-background/70 to-background/60 backdrop-blur-md border-b border-surface/70 shadow-sm dark:shadow-[0_4px_20px_rgba(0,0,0,0.6)] p-5 transition-colors duration-300">
      <div className="w-full flex items-center justify-between mb-4">
        
        {/* Back Button: Professional mono styling with theme-aware hover */}
        <button 
          onClick={onClose}
          className="flex items-center gap-2 px-4 py-2.5 text-[11px] min-h-[40px] font-mono border border-surface text-muted hover:text-foreground hover:border-[var(--accent)]/40 hover:bg-surface-strong transition-all uppercase rounded-sm active:scale-[0.98]"
          aria-label="Go back"
        >
          <span>←</span> Back
        </button>

        {/* Close Button: Optimized tap target with subtle accent hover */}
        <button 
          onClick={onClose}
          className="w-10 h-10 min-h-[40px] border border-surface flex items-center justify-center text-muted hover:text-foreground hover:border-[var(--accent)]/40 hover:bg-[var(--accent-soft)] transition-all rounded-sm active:scale-[0.98]"
          aria-label="Close"
        >
          <span className="text-xs">✕</span>
        </button>
      </div>

      {/* Title & Metadata: High-contrast hierarchy */}
      <div className="space-y-2">
        <p className="text-[10px] font-mono text-muted tracking-[0.3em] uppercase">
          Document ID: {id}
        </p>
        <h2 className="text-xl sm:text-3xl font-black uppercase tracking-tighter text-foreground leading-tight">
          {title}
        </h2>
      </div>
    </div>
  );
}