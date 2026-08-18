import React from 'react';
import Link from 'next/link';

export default function PrivacyPolicy() {
  return (
    <div className="max-w-3xl mx-auto py-24 px-6 relative z-10">
      <div className="mb-12">
        <Link href="/" className="font-mono text-xs uppercase tracking-widest text-muted hover:text-foreground mb-8 inline-block">
          &larr; Back to Portfolio
        </Link>
        <h1 className="text-3xl font-bold tracking-tight text-foreground uppercase">Privacy Policy</h1>
        <p className="text-muted font-mono text-xs mt-4">Last Updated: August 2026</p>
      </div>

      <div className="space-y-12 text-foreground/80 leading-relaxed">
        <section>
          <h2 className="text-lg font-mono uppercase tracking-widest text-foreground mb-4 border-b border-surface pb-2">1. Information Collection</h2>
          <p className="mb-4">
            This portfolio collects basic telemetry to analyze security operations, visitor engagement, and site performance. We collect:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-sm text-muted">
            <li>Anonymized session identifiers (UUIDs) stored in cookies to track session duration and return visits.</li>
            <li>Technical information such as browser type, operating system, and screen resolution.</li>
            <li>Interaction data including page views, terminal commands executed, and component engagement.</li>
            <li>Information explicitly provided through the contact form (Name, Email, Message, Intent).</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-mono uppercase tracking-widest text-foreground mb-4 border-b border-surface pb-2">2. Use of Information</h2>
          <p className="text-sm">
            Telemetry data is utilized exclusively for internal analytics, monitoring, and maintaining the operational health of this portfolio. Contact information is used strictly to respond to your inquiries. Your data is never sold, rented, or shared with third-party marketing entities.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-mono uppercase tracking-widest text-foreground mb-4 border-b border-surface pb-2">3. Data Storage & Security</h2>
          <p className="text-sm">
            All analytical and contact data is stored securely in an isolated Supabase PostgreSQL database equipped with Row Level Security (RLS) policies. Access to this data is restricted to authenticated administrators.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-mono uppercase tracking-widest text-foreground mb-4 border-b border-surface pb-2">4. Cookies</h2>
          <p className="text-sm">
            We use minimal cookies (`pf_vid`, `pf_sid`) to maintain anonymized session state. These are strictly functional analytics cookies that do not track you across other websites.
          </p>
        </section>
      </div>
    </div>
  );
}
