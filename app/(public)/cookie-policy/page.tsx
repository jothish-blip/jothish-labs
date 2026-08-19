import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Cookie Policy | Jothish Gandham',
  description: 'Detailed explanation of cookie usage and session management in this portfolio.',
};

export default function CookiePolicy() {
  return (
    <div className="max-w-3xl mx-auto py-24 px-6 relative z-10 w-full">
      <div className="mb-16">
        <Link href="/" className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted hover:text-foreground mb-8 inline-flex items-center gap-2 transition-colors">
          &larr; Back to Portfolio
        </Link>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground uppercase mt-4">Cookie Policy</h1>
        <p className="text-muted font-mono text-[11px] uppercase tracking-widest mt-6 flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-emerald-500/50" />
          Last Updated: August 2026
        </p>
      </div>

      <div className="space-y-16 text-muted leading-relaxed text-[14px]">
        <section className="space-y-4">
          <h2 className="text-sm font-mono uppercase tracking-[0.2em] text-foreground border-b border-surface pb-3">1. Technical Overview</h2>
          <p>
            Unlike traditional tracking portfolios that rely on invasive third-party scripts (like Google Analytics or Meta Pixels), this portfolio utilizes a custom, self-hosted telemetry engine. To maintain state and secure the infrastructure, we deploy first-party cookies.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-sm font-mono uppercase tracking-[0.2em] text-foreground border-b border-surface pb-3">2. Essential Security & Analytics Cookies</h2>
          <p>The following cookies are strictly necessary for the operation, analytics, and security of the website:</p>
          
          <div className="overflow-x-auto mt-6">
            <table className="w-full text-left font-mono text-xs border border-surface rounded-sm">
              <thead className="bg-surface/30 border-b border-surface">
                <tr>
                  <th className="px-4 py-3 font-medium text-foreground">Cookie Name</th>
                  <th className="px-4 py-3 font-medium text-foreground">Purpose</th>
                  <th className="px-4 py-3 font-medium text-foreground">Duration</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface">
                <tr>
                  <td className="px-4 py-3 text-foreground"><code>pf_vid</code></td>
                  <td className="px-4 py-3">Visitor Identifier: A cryptographically random UUID used to group telemetry events across multiple sessions. Does not contain personal data.</td>
                  <td className="px-4 py-3">1 Year</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-foreground"><code>pf_sid</code></td>
                  <td className="px-4 py-3">Session Identifier: A UUID used to track active engagement, path traversal, and duration for the current browser session.</td>
                  <td className="px-4 py-3">24 Hours</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-foreground"><code>sb-*</code></td>
                  <td className="px-4 py-3">Supabase Auth: Strictly utilized for authenticating administrators accessing the internal SOC Dashboard.</td>
                  <td className="px-4 py-3">Session</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-sm font-mono uppercase tracking-[0.2em] text-foreground border-b border-surface pb-3">3. Local Storage</h2>
          <p>
            In addition to cookies, your browser&apos;s Local Storage API is utilized to store non-identifying preferences:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-foreground/80">
            <li><strong>Theme Preference:</strong> Stores your explicit choice between Dark or Light mode.</li>
            <li><strong>Terminal History:</strong> Retains your command-line history exclusively within your local browser instance.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-sm font-mono uppercase tracking-[0.2em] text-foreground border-b border-surface pb-3">4. Managing Cookies</h2>
          <p>
            Because the cookies deployed by this site are categorized as strictly necessary for security enforcement and internal telemetry functionality, there is no opt-out banner. However, you may choose to clear or block these cookies directly through your browser settings. 
          </p>
          <p className="text-xs text-amber-500/80 mt-2">
            Note: Blocking session cookies may trigger anomaly detection heuristics and inadvertently restrict your access to interactive features.
          </p>
        </section>
      </div>
    </div>
  );
}
