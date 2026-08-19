import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy | Jothish Gandham',
  description: 'Privacy policy detailing telemetry, analytics, and visitor tracking for Jothish Gandham\'s security portfolio.',
};

export default function PrivacyPolicy() {
  return (
    <div className="max-w-3xl mx-auto py-24 px-6 relative z-10 w-full">
      <div className="mb-16">
        <Link href="/" className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted hover:text-foreground mb-8 inline-flex items-center gap-2 transition-colors">
          &larr; Back to Portfolio
        </Link>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground uppercase mt-4">Privacy Policy</h1>
        <p className="text-muted font-mono text-[11px] uppercase tracking-widest mt-6 flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-emerald-500/50" />
          Last Updated: August 2026
        </p>
      </div>

      <div className="space-y-16 text-muted leading-relaxed text-[14px]">
        <section className="space-y-4">
          <h2 className="text-sm font-mono uppercase tracking-[0.2em] text-foreground border-b border-surface pb-3">1. Information Collection</h2>
          <p>
            This portfolio acts as a live security environment and actively collects structured telemetry to analyze security operations, visitor engagement, and site performance. The following information is collected:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-foreground/80">
            <li><strong>Visitor Analytics:</strong> Page views, scrolling milestones, session duration, and active/idle time.</li>
            <li><strong>Network & Device Metadata:</strong> IP addresses, estimated geographic location (Country, Region, City), browser type, operating system, and screen resolution.</li>
            <li><strong>Interaction Data:</strong> Terminal commands executed, sections viewed, certificates expanded, and files downloaded.</li>
            <li><strong>Session Tracking:</strong> Cryptographically generated UUIDs stored in secure cookies (`pf_vid`, `pf_sid`) to track session continuity.</li>
            <li><strong>Contact Information:</strong> Data explicitly provided via the Contact form (Name, Email, Message, Intent).</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-sm font-mono uppercase tracking-[0.2em] text-foreground border-b border-surface pb-3">2. How Information is Used</h2>
          <p>
            Telemetry data is utilized exclusively for internal analytics, active threat monitoring, and maintaining the operational health of this portfolio. Contact information is used strictly to respond to your inquiries. 
          </p>
          <p>
            Your data is never sold, rented, or shared with third-party marketing entities. Aggregate analytical data may be displayed inside the restricted Portfolio Admin dashboard.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-sm font-mono uppercase tracking-[0.2em] text-foreground border-b border-surface pb-3">3. Data Storage & Security Measures</h2>
          <p>
            All analytical and contact data is stored securely in an isolated Supabase PostgreSQL database. Access to this database is protected by stringent Row Level Security (RLS) policies and requires Authenticator Assurance Level 2 (AAL2) multi-factor authentication for administrative access.
          </p>
          <p>
            Network traffic is encrypted in transit via TLS 1.3, enforced by Vercel edge routing.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-sm font-mono uppercase tracking-[0.2em] text-foreground border-b border-surface pb-3">4. Cookies & Local Storage</h2>
          <p>
            We deploy minimal cookies strictly necessary for maintaining anonymized session state and security throttling. These are functional analytics cookies that do not track you across external domains. See the <Link href="/cookie-policy" className="text-foreground underline decoration-surface-strong underline-offset-4 hover:decoration-foreground transition-all">Cookie Policy</Link> for detailed mechanics.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-sm font-mono uppercase tracking-[0.2em] text-foreground border-b border-surface pb-3">5. Third-Party Services</h2>
          <p>
            This portfolio leverages the following third-party infrastructure providers, which act as data processors:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-foreground/80">
            <li><strong>Vercel:</strong> Hosting, edge routing, and IP geographic resolution.</li>
            <li><strong>Supabase:</strong> PostgreSQL database hosting and real-time socket delivery.</li>
            <li><strong>Resend / Custom SMTP:</strong> Delivery of outbound contact form notifications.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-sm font-mono uppercase tracking-[0.2em] text-foreground border-b border-surface pb-3">6. Retention Period</h2>
          <p>
            General telemetry events and session records are retained for analytical purposes. Contact messages are retained indefinitely within the secure inbox database unless explicitly deleted by the administrator. IP addresses associated with malicious activity (e.g., rate-limit abuse, payload injection) are retained indefinitely on the permanent blocklist.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-sm font-mono uppercase tracking-[0.2em] text-foreground border-b border-surface pb-3">7. User Rights & Contact</h2>
          <p>
            You have the right to request the deletion of any personal information (e.g., contact form submissions) associated with your email address. To exercise this right or ask questions regarding this policy, please contact me directly.
          </p>
          <div className="mt-4 p-4 bg-surface/10 border border-surface rounded-sm font-mono text-[11px]">
            Security Contact: gandhamjothish1@gmail.com
          </div>
        </section>
      </div>
    </div>
  );
}
