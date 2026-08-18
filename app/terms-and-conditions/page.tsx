import React from 'react';
import Link from 'next/link';

export default function TermsAndConditions() {
  return (
    <div className="max-w-3xl mx-auto py-24 px-6 relative z-10">
      <div className="mb-12">
        <Link href="/" className="font-mono text-xs uppercase tracking-widest text-muted hover:text-foreground mb-8 inline-block">
          &larr; Back to Portfolio
        </Link>
        <h1 className="text-3xl font-bold tracking-tight text-foreground uppercase">Terms & Conditions</h1>
        <p className="text-muted font-mono text-xs mt-4">Last Updated: August 2026</p>
      </div>

      <div className="space-y-12 text-foreground/80 leading-relaxed">
        <section>
          <h2 className="text-lg font-mono uppercase tracking-widest text-foreground mb-4 border-b border-surface pb-2">1. Usage Agreement</h2>
          <p className="text-sm">
            By accessing this portfolio, you agree to these Terms and Conditions. The content provided is for informational, professional networking, and demonstration purposes only.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-mono uppercase tracking-widest text-foreground mb-4 border-b border-surface pb-2">2. Intellectual Property</h2>
          <p className="text-sm">
            The design, structure, custom code, and text content of this portfolio are the intellectual property of Jothish Gandham. You may not duplicate, clone, or repurpose the specific design, underlying architecture, or content without explicit permission. Project case studies and write-ups are original works.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-mono uppercase tracking-widest text-foreground mb-4 border-b border-surface pb-2">3. Acceptable Use</h2>
          <p className="text-sm">
            You agree not to misuse the provided Terminal interface, contact forms, or any interactive elements. Automated spam submissions, vulnerability scanning, penetration testing against this infrastructure, or attempts to access unauthorized administrative routes (`/ops`) are strictly prohibited and actively monitored.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-mono uppercase tracking-widest text-foreground mb-4 border-b border-surface pb-2">4. Disclaimer</h2>
          <p className="text-sm">
            The infrastructure and systems documented in the portfolio projects are for educational and professional demonstration. They are provided &quot;as is&quot; without warranty. I am not liable for any issues arising from the use of techniques or code snippets shared in the case studies.
          </p>
        </section>
      </div>
    </div>
  );
}
