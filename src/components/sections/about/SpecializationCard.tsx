/* eslint-disable @next/next/no-img-element */
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, BookOpen } from "lucide-react";
import GoogleWordmark from "./GoogleWordmark";
import { GoogleSpecialization } from "./types";

interface Props {
  specialization: GoogleSpecialization;
  onClick: () => void;
}

export default function SpecializationCard({
  specialization,
  onClick,
}: Props) {
  return (
    <motion.button
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      onClick={onClick}
      className="group relative flex w-full flex-col overflow-hidden rounded-xl border border-surface bg-background px-6 py-6 text-left shadow-sm transition-all duration-300 hover:shadow-md hover:border-surface-strong hover:bg-surface/40"
    >
      {/* Subtle background image preview */}
      <div className="absolute right-0 top-0 h-48 w-64 opacity-0 transition-opacity duration-500 group-hover:opacity-[0.04] pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-l from-transparent via-background/50 to-background z-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background z-10" />
        <img 
          src={specialization.professionalCertificate.image} 
          alt=""
          className="h-full w-full object-cover mix-blend-luminosity"
        />
      </div>

      <div className="relative z-20 flex flex-col h-full">
        {/* Top */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-5">
          <div className="flex flex-col">
            <div className="mb-4">
              <GoogleWordmark />
            </div>
            <p className="mb-1.5 text-[10px] font-mono uppercase tracking-[0.2em] text-muted">
              Professional Certificate
            </p>
            <h4 className="text-[17px] font-medium tracking-tight text-foreground leading-snug pr-4">
              {specialization.title}
            </h4>
          </div>

          <span className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-sm border border-emerald-500/20 bg-emerald-500/5 text-emerald-500 text-[10px] font-mono uppercase tracking-[0.15em] shadow-sm">
            <ShieldCheck size={14} />
            Verified
          </span>
        </div>

        {/* Divider */}
        <div className="mt-8 h-px w-full bg-surface" />

        {/* Skills / Technology Chips */}
        <div className="mt-6">
          <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted mb-3">
            Core Technologies
          </p>

          <div className="flex flex-wrap gap-2">
            {specialization.highlights.slice(0, 4).map((skill) => (
              <span
                key={skill}
                className="text-[11px] font-mono px-3 py-1.5 rounded-sm border border-surface bg-surface/50 text-muted transition-colors group-hover:bg-background group-hover:text-foreground/80"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="mt-10 flex items-center justify-between">
          <div className="flex items-center gap-2 text-muted transition-colors group-hover:text-foreground/70">
            <BookOpen size={14} />
            <span className="text-[11px] font-mono">
              {specialization.courseCount} Courses
            </span>
          </div>
          <span className="text-[11px] font-mono text-muted uppercase tracking-[0.15em]">
            {specialization.professionalCertificate.issuedDate}
          </span>
        </div>

        {/* Bottom CTA */}
        <div className="mt-6 pt-5 border-t border-surface flex items-center justify-between">
          <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted">
            Learning Journey
          </p>

          <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.15em] text-accent opacity-80 transition-opacity duration-300 group-hover:opacity-100">
            <span>Explore</span>
            <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
          </div>
        </div>
      </div>
    </motion.button>
  );
}