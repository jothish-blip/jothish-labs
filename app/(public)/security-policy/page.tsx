import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Security Policy | Jothish Gandham',
  description: 'Security practices and operational standards for Jothish Gandham\'s portfolio.',
};

export default function SecurityPolicy() {
  return (
    <div className="max-w-3xl mx-auto py-24 px-6 relative z-10 w-full">
      <div className="mb-16">
        <Link href="/" className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted hover:text-foreground mb-8 inline-flex items-center gap-2 transition-colors">
          &larr; Back to Portfolio
        </Link>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground uppercase mt-4">Security Policy</h1>
        <p className="text-muted font-mono text-[11px] uppercase tracking-widest mt-6 flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-emerald-500/50" />
          Last Updated: August 2026
        </p>
      </div>

      <div className="space-y-16 text-muted leading-relaxed text-[14px]">
        <section className="space-y-4">
          <h2 className="text-sm font-mono uppercase tracking-[0.2em] text-foreground border-b border-surface pb-3">1. Operational Architecture</h2>
          <p>
            This portfolio operates as a hardened Next.js edge-rendered application. Security is implemented through defense-in-depth principles across the presentation, API, and database layers.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-sm font-mono uppercase tracking-[0.2em] text-foreground border-b border-surface pb-3">2. Core Security Practices</h2>
          <ul className="list-disc pl-5 space-y-3 text-foreground/80">
            <li>
              <strong>Authentication & Authorization:</strong> Administrative access to the underlying SOC Dashboard mandates Authenticator Assurance Level 2 (AAL2) Multi-Factor Authentication via TOTP. 
            </li>
            <li>
              <strong>Row Level Security (RLS):</strong> The Supabase PostgreSQL database implements strict RLS policies. Client-side queries are bound explicitly to authenticated sessions; unauthenticated traffic operates strictly via server-side API routes operating under principle-of-least-privilege service roles.
            </li>
            <li>
              <strong>Rate Limiting & Throttling:</strong> Anomalous traffic patterns, particularly against contact endpoints and the terminal component, trigger automated rate limiting and IP blacklisting mechanisms.
            </li>
            <li>
              <strong>Data Sanitization:</strong> All user-supplied inputs (including terminal commands and contact form payloads) undergo aggressive sanitization to mitigate Cross-Site Scripting (XSS) and SQL Injection (SQLi) vectors.
            </li>
            <li>
              <strong>Transport Security:</strong> All connections are strictly enforced over TLS 1.3, ensuring encrypted transit between clients, the Vercel edge network, and Supabase.
            </li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-sm font-mono uppercase tracking-[0.2em] text-foreground border-b border-surface pb-3">3. Privacy & Tracking</h2>
          <p>
            We deploy a custom telemetry engine that replaces invasive third-party trackers. Session tracking relies on cryptographically secure UUIDs, avoiding the collection of Personally Identifiable Information (PII) beyond what is explicitly submitted via forms. For detailed mechanics, refer to the <Link href="/privacy-policy" className="text-foreground underline decoration-surface-strong underline-offset-4 hover:decoration-foreground transition-all">Privacy Policy</Link>.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-sm font-mono uppercase tracking-[0.2em] text-foreground border-b border-surface pb-3">4. Incident Response & Disclosure</h2>
          <p>
            We actively monitor internal audit logs and real-time telemetry. In the event of a theoretical data breach impacting contact submissions, affected parties will be notified via email within 72 hours.
          </p>
          <p>
            Independent security researchers are encouraged to report vulnerabilities under our <Link href="/responsible-disclosure" className="text-foreground underline decoration-surface-strong underline-offset-4 hover:decoration-foreground transition-all">Responsible Disclosure</Link> safe harbor.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-sm font-mono uppercase tracking-[0.2em] text-foreground border-b border-surface pb-3">5. Contact</h2>
          <div className="mt-4 p-4 bg-surface/10 border border-surface rounded-sm font-mono text-[11px] inline-block">
            Security Contact: gandhamjothish1@gmail.com
          </div>
        </section>
      </div>
    </div>
  );
}
