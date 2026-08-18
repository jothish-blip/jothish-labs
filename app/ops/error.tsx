'use client';

import { useEffect } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import Link from 'next/link';

export default function OpsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service natively, or insert into telemetry
    console.error('[SOC Error Boundary]', error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center bg-background border border-surface rounded-sm relative overflow-hidden">
      {/* Red accent bar */}
      <div className="absolute top-0 left-0 w-full h-1 bg-[#E4002B]"></div>
      
      <div className="bg-[#E4002B]/10 p-6 rounded-full mb-6">
        <AlertTriangle size={48} className="text-[#E4002B]" />
      </div>
      
      <h1 className="text-2xl font-mono uppercase tracking-[0.2em] text-foreground mb-4">
        System Fault Detected
      </h1>
      
      <div className="bg-surface/50 border border-surface p-4 rounded-sm text-left max-w-md w-full mb-8 overflow-hidden">
        <p className="text-[10px] font-mono text-muted uppercase tracking-widest mb-1">Diagnostic Code</p>
        <p className="text-xs font-mono text-[#E4002B] truncate">{error.message || 'Unknown Exception'}</p>
        {error.digest && (
          <p className="text-[9px] font-mono text-muted mt-2">Digest: {error.digest}</p>
        )}
      </div>

      <div className="flex gap-4">
        <button
          onClick={() => reset()}
          className="flex items-center gap-2 bg-foreground text-background px-6 py-3 rounded-sm font-mono text-xs uppercase tracking-widest hover:bg-muted transition-colors"
        >
          <RefreshCw size={14} /> Attempt Recovery
        </button>
        <Link 
          href="/ops"
          className="flex items-center gap-2 border border-surface text-foreground px-6 py-3 rounded-sm font-mono text-xs uppercase tracking-widest hover:bg-surface transition-colors"
        >
          Return to Console
        </Link>
      </div>
    </div>
  );
}
