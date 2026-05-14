"use client";

import { ShieldCheck, Terminal, Cpu } from "lucide-react";
import { activeCerts } from "./data";

export default function CompTIASection() {
  return (
    <section className="relative border-t border-white/10 pt-20 pb-12">
      {/* Subtle Background */}
      <div className="absolute inset-0 -z-10 bg-black" />

      {/* Soft Glow */}
      <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-[#E4002B]/5 blur-3xl -z-10" />

      {/* Minimal Grid */}
      <div
        className="absolute inset-0 opacity-[0.03] -z-10"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)
          `,
          backgroundSize: "42px 42px",
        }}
      />

      <div className="max-w-5xl mx-auto px-6 space-y-14">
        {/* Header */}
        <div className="text-center space-y-5">
          <p className="font-mono text-[11px] tracking-[0.35em] text-[#E4002B] uppercase">
            Certification Track
          </p>

          <h3 className="text-3xl md:text-4xl font-semibold tracking-tight text-white">
            <span className="text-[#E4002B]">CompTIA</span> Certifications
          </h3>

          <div className="inline-flex items-center gap-2 border border-[#E4002B]/20 bg-[#E4002B]/5 px-4 py-2 rounded-md">
            <div className="w-2 h-2 rounded-full bg-[#E4002B]" />

            <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#E4002B]">
              2 Certifications In Progress
            </span>
          </div>

          <div className="w-16 h-[1px] bg-[#E4002B]/40 mx-auto" />

          <p className="text-zinc-400 text-sm max-w-lg mx-auto leading-relaxed">
            Focused on Security+ and Linux+ while building hands-on experience
            through labs, projects, and consistent study.
          </p>
        </div>

        {/* Cards */}
        <div className="flex flex-wrap justify-center gap-6">
          {activeCerts.map((cert) => {
            const Icon =
              cert.title.includes("Security")
                ? ShieldCheck
                : cert.title.includes("Linux")
                ? Terminal
                : Cpu;

            return (
              <div
                key={cert.id}
                className="group relative w-[300px] rounded-xl border border-white/10 bg-white/[0.02] backdrop-blur-md p-6 transition-all duration-300 hover:border-[#E4002B]/30 hover:-translate-y-1"
              >
                {/* Top Accent */}
                <div className="absolute top-0 left-0 h-[2px] w-full bg-gradient-to-r from-[#E4002B]/80 to-transparent opacity-70" />

                {/* Watermark SVG */}
                <div className="absolute bottom-4 right-4 opacity-[0.04]">
                  <svg
                    width="90"
                    height="90"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#E4002B"
                    strokeWidth="1"
                  >
                    <path d="M12 2L4 5V11C4 16 7.5 20.5 12 22C16.5 20.5 20 16 20 11V5L12 2Z" />
                    <path d="M9 12L11 14L15 10" />
                  </svg>
                </div>

                <div className="relative z-10">
                  {/* Status */}
                  <div className="absolute top-0 right-0 text-[8px] font-mono uppercase tracking-[0.2em] border border-[#E4002B]/20 bg-[#E4002B]/5 text-[#E4002B] px-2 py-1 rounded-sm">
                    In Progress
                  </div>

                  {/* Icon */}
                  <div className="w-12 h-12 rounded-lg border border-white/10 bg-white/[0.03] flex items-center justify-center mb-5">
                    <Icon className="w-5 h-5 text-[#E4002B]" />
                  </div>

                  {/* Label */}
                  <p className="text-[10px] font-mono uppercase tracking-[0.25em] text-zinc-500 mb-2">
                    CompTIA Certification
                  </p>

                  {/* Title */}
                  <h4 className="text-lg font-semibold text-white tracking-tight">
                    {cert.title}
                  </h4>

                  {/* Description */}
                  <p className="mt-3 text-sm text-zinc-400 leading-relaxed">
                    Strengthening foundational cybersecurity and system
                    administration knowledge through practical learning.
                  </p>

                  {/* Skills */}
                  <div className="mt-6">
                    <p className="text-[10px] font-mono uppercase tracking-[0.25em] text-zinc-500 mb-3">
                      Focus Areas
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {cert.skills
                        .split(", ")
                        .slice(0, 3)
                        .map((skill, i) => (
                          <span
                            key={i}
                            className="text-[10px] font-mono px-3 py-1 rounded-md border border-white/10 bg-black/20 text-zinc-300"
                          >
                            {skill}
                          </span>
                        ))}
                    </div>
                  </div>

                  {/* Progress */}
                  <div className="mt-8">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-500">
                        Progress
                      </p>

                      <p className="text-sm font-medium text-white">
                        {cert.progress}%
                      </p>
                    </div>

                    <div className="h-[5px] bg-white/5 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-[#E4002B] transition-all duration-500"
                        style={{
                          width: `${cert.progress}%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Footer */}
                  {cert.progress >= 40 && (
                    <div className="mt-5 flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-400" />

                      <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-emerald-400">
                        Active Focus
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}