'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login } from './actions';
import { ShieldCheck, Loader2 } from 'lucide-react';

export default function OpsAuthPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const result = await login(formData);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
      return;
    }

    if (result?.requiresMfa) {
      router.push('/ops/login/mfa');
      return;
    }

    router.push('/ops');
  }

  return (
    <div className="min-h-screen w-full bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
      <div className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center">
        <div 
          className="w-[300px] h-[300px] blur-[120px] rounded-[100%] opacity-20"
          style={{ backgroundColor: '#E4002B' }}
        ></div>
        <div className="absolute inset-0 opacity-[0.02] bg-[radial-gradient(circle,currentColor_1px,transparent_1px)] bg-[size:16px_16px]"></div>
      </div>

      <div className="relative z-10 w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <div className="p-3 bg-surface/30 border border-surface rounded-sm mb-4">
            <ShieldCheck className="w-8 h-8 text-[#E4002B]" />
          </div>
          <p className="font-mono text-[10px] tracking-[0.4em] uppercase text-[#E4002B] mb-2">
            {"// Restricted Area"}
          </p>
          <h1 className="text-2xl font-bold tracking-tight text-foreground uppercase">
            Ops Console
          </h1>
        </div>

        <div className="bg-background/50 backdrop-blur-xl border border-surface p-6 sm:p-8 rounded-sm shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-[11px] font-mono uppercase tracking-widest text-muted">
                Operator ID (Email)
              </label>
              <input 
                type="email" 
                name="email"
                required
                className="w-full bg-surface/30 border border-surface rounded-sm px-4 py-2.5 text-sm focus:outline-none focus:border-[#E4002B]/50 focus:bg-surface/50 transition-colors text-foreground font-mono"
                placeholder="admin@system.local"
              />
            </div>
            
            <div className="space-y-1.5">
              <label className="text-[11px] font-mono uppercase tracking-widest text-muted">
                Passphrase
              </label>
              <input 
                type="password" 
                name="password"
                required
                className="w-full bg-surface/30 border border-surface rounded-sm px-4 py-2.5 text-sm focus:outline-none focus:border-[#E4002B]/50 focus:bg-surface/50 transition-colors text-foreground font-mono"
                placeholder="••••••••••••"
              />
            </div>

            {error && (
              <div className="p-3 border border-red-500/20 bg-red-500/10 rounded-sm">
                <p className="text-red-400 text-xs font-mono">{error}</p>
              </div>
            )}

            <button 
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 bg-foreground text-background font-mono text-[11px] uppercase tracking-widest font-semibold rounded-sm hover:bg-muted transition-colors disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Authenticate'}
            </button>
          </form>
        </div>
        
        <div className="mt-8 text-center">
          <p className="text-[10px] font-mono text-muted/50 uppercase tracking-widest">
            Unauthorized access is strictly prohibited.
          </p>
        </div>
      </div>
    </div>
  );
}
