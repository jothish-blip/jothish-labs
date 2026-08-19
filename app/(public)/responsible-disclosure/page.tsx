import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Responsible Disclosure | Jothish Gandham',
  description: 'Vulnerability reporting and responsible disclosure policy for Jothish Gandham\'s portfolio.',
};

export default function ResponsibleDisclosure() {
  return (
    <div className="max-w-3xl mx-auto py-24 px-6 relative z-10 w-full">
      <div className="mb-16">
        <Link href="/" className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted hover:text-foreground mb-8 inline-flex items-center gap-2 transition-colors">
          &larr; Back to Portfolio
        </Link>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground uppercase mt-4">Responsible Disclosure</h1>
        <p className="text-muted font-mono text-[11px] uppercase tracking-widest mt-6 flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-emerald-500/50" />
          Last Updated: August 2026
        </p>
      </div>

      <div className="space-y-16 text-muted leading-relaxed text-[14px]">
        <section className="space-y-4">
          <h2 className="text-sm font-mono uppercase tracking-[0.2em] text-foreground border-b border-surface pb-3">1. Security Stance</h2>
          <p>
            As a cybersecurity professional, I take the security of my infrastructure seriously. I value the input of independent security researchers and the broader infosec community. If you discover a vulnerability within this portfolio or its underlying infrastructure, I encourage you to report it responsibly.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-sm font-mono uppercase tracking-[0.2em] text-foreground border-b border-surface pb-3">2. Safe Harbor</h2>
          <p>
            I will not initiate legal action or file complaints against researchers who discover and report vulnerabilities in good faith, provided they adhere strictly to the guidelines outlined in this policy.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-sm font-mono uppercase tracking-[0.2em] text-foreground border-b border-surface pb-3">3. Reporting Guidelines</h2>
          <p>To ensure a mutually beneficial disclosure process, please adhere to the following:</p>
          <ul className="list-disc pl-5 space-y-2 text-foreground/80">
            <li><strong>Do Not Exploit:</strong> Do not exploit the vulnerability beyond what is strictly necessary to prove its existence. Do not exfiltrate, delete, or manipulate data.</li>
            <li><strong>No Destructive Testing:</strong> Do not perform Denial of Service (DoS/DDoS) attacks, spam the contact endpoints, or execute volumetric fuzzing that degrades site performance.</li>
            <li><strong>No Social Engineering:</strong> Do not attempt social engineering, phishing, or physical attacks against me or the hosting providers (Vercel, Supabase).</li>
            <li><strong>Provide Details:</strong> Include clear, reproducible steps, proof-of-concept code, and potential impact in your report.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-sm font-mono uppercase tracking-[0.2em] text-foreground border-b border-surface pb-3">4. Scope</h2>
          <p>The following targets are considered IN SCOPE:</p>
          <ul className="list-disc pl-5 space-y-2 text-foreground/80">
            <li>The primary domain: <code>webjothishanalyst.site</code></li>
            <li>API routes under <code>/api/*</code></li>
            <li>Supabase RLS bypasses leading to unauthorized data access.</li>
          </ul>
          <p className="mt-4 text-xs text-muted/80">
            Note: Vulnerabilities in third-party services (Vercel, Supabase backend infrastructure) should be reported directly to those vendors.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-sm font-mono uppercase tracking-[0.2em] text-foreground border-b border-surface pb-3">5. Expected Response Timeline</h2>
          <p>
            I will make a best-effort attempt to triage your report within <strong>48 hours</strong> and provide an estimated timeline for a patch. Once patched, you will be credited in the site&apos;s changelog if you desire.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-sm font-mono uppercase tracking-[0.2em] text-foreground border-b border-surface pb-3">6. Contact</h2>
          <p>
            Please email your findings securely.
          </p>
          <div className="mt-4 p-4 bg-surface/10 border border-surface rounded-sm font-mono text-[11px] inline-block">
            Security Contact: gandhamjothish1@gmail.com
          </div>
        </section>
      </div>
    </div>
  );
}
