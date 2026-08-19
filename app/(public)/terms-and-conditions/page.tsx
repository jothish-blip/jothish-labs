import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Terms & Conditions | Jothish Gandham',
  description: 'Terms of service and acceptable use policy for Jothish Gandham\'s security portfolio.',
};

export default function TermsAndConditions() {
  return (
    <div className="max-w-3xl mx-auto py-24 px-6 relative z-10 w-full">
      <div className="mb-16">
        <Link href="/" className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted hover:text-foreground mb-8 inline-flex items-center gap-2 transition-colors">
          &larr; Back to Portfolio
        </Link>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground uppercase mt-4">Terms & Conditions</h1>
        <p className="text-muted font-mono text-[11px] uppercase tracking-widest mt-6 flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-emerald-500/50" />
          Last Updated: August 2026
        </p>
      </div>

      <div className="space-y-16 text-muted leading-relaxed text-[14px]">
        <section className="space-y-4">
          <h2 className="text-sm font-mono uppercase tracking-[0.2em] text-foreground border-b border-surface pb-3">1. Website Purpose</h2>
          <p>
            This website serves as a personal portfolio, educational demonstration, and live cybersecurity laboratory. The content provided herein is intended solely for professional networking, demonstrating technical proficiency, and sharing educational insights regarding systems architecture and security operations.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-sm font-mono uppercase tracking-[0.2em] text-foreground border-b border-surface pb-3">2. Educational & Research Disclaimer</h2>
          <p>
            Any code snippets, architectural diagrams, offensive security techniques, or defensive strategies discussed on this site are strictly for educational and research purposes. You are solely responsible for how you use the information provided. The author assumes no liability for damages resulting from the misuse of this information.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-sm font-mono uppercase tracking-[0.2em] text-foreground border-b border-surface pb-3">3. Acceptable Use Policy</h2>
          <p>
            By accessing this portfolio and interacting with its systems (including the interactive Terminal and Contact endpoints), you agree to:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-foreground/80">
            <li>Not deploy automated exploitation scripts, vulnerability scanners, or denial-of-service tools against this infrastructure.</li>
            <li>Not attempt to bypass rate-limiting, authentication controls, or Row Level Security policies.</li>
            <li>Use the interactive features (e.g., Terminal) as intended, without attempting payload injection or sandbox escapes.</li>
          </ul>
          <p className="text-amber-500/80 text-xs mt-4">
            Violation of this Acceptable Use Policy will result in immediate, automated IP blacklisting enforced at the edge layer.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-sm font-mono uppercase tracking-[0.2em] text-foreground border-b border-surface pb-3">4. Intellectual Property</h2>
          <p>
            The original code, architectural designs, and written content comprising this portfolio are the intellectual property of Jothish Gandham. You may not clone, redistribute, or utilize the proprietary source code of this portfolio without explicit written consent.
          </p>
          <p>
            Third-party logos, certification badges, and trademarks (e.g., Google, CompTIA) are the property of their respective owners and are used here under fair use to demonstrate verified credentials.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-sm font-mono uppercase tracking-[0.2em] text-foreground border-b border-surface pb-3">5. No Warranty</h2>
          <p>
            This website and its interactive components are provided &quot;as is&quot; without any warranties, express or implied. Continuous uptime of the telemetry pipeline, terminal, or admin APIs is not guaranteed.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-sm font-mono uppercase tracking-[0.2em] text-foreground border-b border-surface pb-3">6. Limitation of Liability</h2>
          <p>
            In no event shall the author be liable for any indirect, incidental, special, or consequential damages arising out of or in connection with your use of this website, its external links, or its project demonstrations.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-sm font-mono uppercase tracking-[0.2em] text-foreground border-b border-surface pb-3">7. Jurisdiction</h2>
          <p>
            These Terms shall be governed and construed in accordance with standard international intellectual property guidelines. Any disputes shall be subject to the exclusive jurisdiction of the regional courts associated with the author&apos;s physical location.
          </p>
        </section>
      </div>
    </div>
  );
}
