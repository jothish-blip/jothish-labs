import React from "react";
import { activeCerts } from "./data";

function CompTIAWordmark() {
  return (
    <span className="font-semibold tracking-[-0.03em] text-2xl md:text-3xl text-[#E4002B]">
      CompTIA
    </span>
  );
}

type Cert = {
  id: string;
  title: string;
  skills: string;
  progress: number;
};

function CompTIACard({ cert }: { cert: Cert }) {
  return (
    <div className="group relative border border-surface bg-background rounded-md px-6 py-5 transition-all duration-300 hover:border-[#E4002B]/40 hover:bg-surface">
      
      {/* Top */}
      <div className="flex items-start justify-between gap-4">
        
        <div>
          <p className="text-[9px] font-mono uppercase tracking-[0.24em] text-muted mb-2">
            CompTIA Certification
          </p>

          <h4 className="text-[15px] font-semibold tracking-tight uppercase text-foreground leading-snug">
            {cert.title}
          </h4>
        </div>

        <span className="shrink-0 text-[8px] font-mono uppercase tracking-[0.18em] px-2 py-1 rounded-sm border border-[#E4002B]/20 bg-[#E4002B]/5 text-[#E4002B]">
          in progress
        </span>
      </div>

      {/* Divider */}
      <div className="mt-5 h-px bg-surface" />

      {/* Skills */}
      <div className="mt-5">
        <p className="text-[9px] font-mono uppercase tracking-[0.24em] text-muted mb-3">
          Focus Areas
        </p>

        <div className="flex flex-wrap gap-2">
          {cert.skills
            .split(", ")
            .slice(0, 3)
            .map((skill, i) => (
              <span
                key={i}
                className="text-[10px] font-mono px-2 py-1 rounded-sm border border-surface bg-surface/40 text-muted"
              >
                {skill}
              </span>
            ))}
        </div>
      </div>

      {/* Progress */}
      <div className="mt-6">
        
        <div className="flex items-center justify-between mb-2">
          <p className="text-[9px] font-mono uppercase tracking-[0.24em] text-muted">
            Progress
          </p>

          <span className="text-[10px] font-mono text-foreground">
            {cert.progress}%
          </span>
        </div>

        <div className="h-[4px] w-full rounded-full bg-surface overflow-hidden">
          <div
            className="h-full bg-[#E4002B] transition-all duration-700"
            style={{ width: `${cert.progress}%` }}
          />
        </div>
      </div>

      {/* Bottom */}
      <div className="mt-6 pt-4 border-t border-surface flex items-center justify-between">
        
        <p className="text-[10px] font-mono uppercase tracking-[0.22em] text-muted">
          Active Learning
        </p>

        <button className="text-[9px] font-mono uppercase tracking-[0.22em] text-[#E4002B] hover:opacity-80 transition-opacity">
          view details
        </button>
      </div>
    </div>
  );
}

export default function CompTIASection() {
  return (
    <section className="border-t border-surface pt-14 max-w-5xl mx-auto space-y-10">
      
      {/* Header */}
      <div className="space-y-4 text-center flex flex-col items-center">
        
        <p className="font-mono text-[10px] tracking-[0.4em] text-[#E4002B] uppercase">
          Certification Track
        </p>

        <div className="flex items-center gap-3">
          <CompTIAWordmark />

          <span className="text-2xl md:text-3xl font-semibold tracking-tight">
            Certifications
          </span>
        </div>

        <p className="text-[10px] font-mono text-[#E4002B] font-bold bg-[#E4002B]/10 px-3 py-1 rounded-sm mt-1 inline-block uppercase tracking-widest">
          2 Certifications In Progress
        </p>

        <div className="w-16 h-[2px] bg-[#E4002B] opacity-70 mt-2"></div>

        <p className="text-muted text-sm max-w-2xl mx-auto leading-relaxed">
          Building practical knowledge in cybersecurity, operating systems,
          networking, and security operations through structured study and
          hands-on practice.
        </p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {activeCerts.map((cert) => (
          <CompTIACard key={cert.id} cert={cert} />
        ))}
      </div>
    </section>
  );
}