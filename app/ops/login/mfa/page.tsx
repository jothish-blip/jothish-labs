'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ScanLine, Loader2, ShieldCheck, QrCode } from 'lucide-react';
import { verifyMfa, checkMfaStatus, enrollMfa } from './actions';

export default function OpsMfaPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Enrollment state
  const [needsEnrollment, setNeedsEnrollment] = useState(false);
  const [qrCodeSvg, setQrCodeSvg] = useState<string | null>(null);
  const [secretKey, setSecretKey] = useState<string | null>(null);

  useEffect(() => {
    async function init() {
      const status = await checkMfaStatus();
      if (status.error) {
        setError(status.error);
        setInitializing(false);
        return;
      }

      if (!status.isEnrolled) {
        setNeedsEnrollment(true);
        const enrollment = await enrollMfa();
        if (enrollment.error) {
          setError(enrollment.error);
        } else {
          setQrCodeSvg(enrollment.qrCode ?? null);
          setSecretKey(enrollment.secret ?? null);
        }
      }
      setInitializing(false);
    }
    init();
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const result = await verifyMfa(formData);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
      return;
    }

    router.push('/ops');
  }

  if (initializing) {
    return (
      <div className="min-h-screen w-full bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
        <Loader2 className="h-8 w-8 animate-spin text-[#E4002B]" />
        <p className="mt-4 font-mono text-xs uppercase tracking-widest text-muted">Checking Security Posture</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
      <div className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center">
        <div className="w-[320px] h-[320px] blur-[120px] rounded-full opacity-20" style={{ backgroundColor: '#E4002B' }} />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="mb-8 flex flex-col items-center gap-4 text-center">
          <div className="rounded-sm border border-surface bg-surface/30 p-3">
            {needsEnrollment ? <QrCode className="h-8 w-8 text-[#E4002B]" /> : <ScanLine className="h-8 w-8 text-[#E4002B]" />}
          </div>
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-[#E4002B]">
              {'// '}{needsEnrollment ? 'INITIAL SETUP' : 'MFA VERIFICATION'}
            </p>
            <h1 className="mt-2 text-2xl font-bold uppercase tracking-tight text-foreground">
              {needsEnrollment ? 'Configure Authenticator' : 'Verify Identity'}
            </h1>
          </div>
        </div>

        <div className="rounded-sm border border-surface bg-background/50 p-6 shadow-2xl backdrop-blur-xl">
          <div className="mb-5 flex items-center gap-3 rounded-sm border border-surface bg-surface/20 p-3">
            <ShieldCheck className="h-4 w-4 text-green-500" />
            <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted">AAL2 Required</p>
          </div>

          {needsEnrollment && qrCodeSvg && (
            <div className="mb-6 flex flex-col items-center border border-surface bg-surface/10 p-4 rounded-sm">
              <p className="text-xs text-muted text-center mb-4">
                Scan this QR code with Google Authenticator or Authy to secure your admin account.
              </p>
              <div 
                className="bg-white p-2 rounded-sm mb-4 [&>svg]:w-40 [&>svg]:h-40" 
                dangerouslySetInnerHTML={{ __html: qrCodeSvg }} 
              />
              <p className="text-[9px] font-mono text-muted">Manual Key:</p>
              <p className="text-xs font-mono text-foreground select-all bg-surface/50 px-2 py-1 rounded-sm mt-1">
                {secretKey}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label htmlFor="code" className="text-[11px] font-mono uppercase tracking-widest text-muted">
                Authenticator Code
              </label>
              <input
                id="code"
                name="code"
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                placeholder="123456"
                suppressHydrationWarning
                className="w-full bg-surface/30 border border-surface rounded-sm px-4 py-2.5 text-sm focus:outline-none focus:border-[#E4002B]/50 focus:bg-surface/50 transition-colors text-foreground font-mono text-center tracking-[0.5em]"
                required
              />
            </div>

            {error && (
              <div className="rounded-sm border border-red-500/20 bg-red-500/10 p-3">
                <p className="text-xs font-mono text-red-400">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              suppressHydrationWarning
              className="w-full rounded-sm bg-foreground px-4 py-3 font-mono text-[11px] uppercase tracking-[0.2em] text-background transition-colors hover:bg-muted disabled:opacity-60"
            >
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" /> Verifying
                </span>
              ) : (
                needsEnrollment ? 'Verify & Enroll' : 'Confirm MFA'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
