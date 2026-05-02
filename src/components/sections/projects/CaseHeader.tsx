"use client";

interface Props {
  id: string;
  title: string;
  onClose: () => void;
}

export default function CaseHeader({ id, title, onClose }: Props) {
  return (
    <div className="
      sticky top-0 z-20 
      bg-gradient-to-b 
      from-background/90 
      via-background/85 
      to-background/80
      dark:from-background/95 
      dark:via-background/92 
      dark:to-background/90
      backdrop-blur-xl
      border-b border-surface/60 dark:border-surface/40
      shadow-sm 
      dark:shadow-[0_6px_24px_rgba(0,0,0,0.4)]
      p-5 
      transition-colors duration-300
    ">

      {/* Overlay layer for controlled opacity and depth */}
      <div className="absolute inset-0 bg-background/40 dark:bg-background/60 pointer-events-none" />

      {/* Relative wrapper to keep content above the absolute overlay */}
      <div className="relative">

        <div className="w-full flex items-center justify-between mb-4">
          
          {/* Back Button: Professional mono styling with theme-aware hover */}
          <button 
            onClick={onClose}
            className="flex items-center gap-2 px-4 py-2.5 text-[11px] font-mono border border-surface text-muted hover:text-foreground hover:border-[var(--accent)]/40 hover:bg-surface-strong transition-all uppercase rounded-sm active:scale-[0.98]"
            aria-label="Go back"
          >
            ← Back
          </button>

          {/* Close Button: Optimized tap target with subtle accent hover */}
          <button 
            onClick={onClose}
            className="w-10 h-10 border border-surface flex items-center justify-center text-muted hover:text-foreground hover:border-[var(--accent)]/40 hover:bg-[var(--accent-soft)] transition-all rounded-sm active:scale-[0.98]"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Title & Metadata: High-contrast hierarchy */}
        <div className="space-y-2">
          <p className="text-[10px] font-mono text-muted tracking-[0.3em] uppercase">
            Case Study • {id}
          </p>

          <h2 className="text-xl sm:text-3xl font-black uppercase tracking-tight text-foreground dark:text-white leading-tight">
            {title}
          </h2>
        </div>

      </div>
    </div>
  );
}