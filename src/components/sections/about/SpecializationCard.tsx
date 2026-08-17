/* eslint-disable @next/next/no-img-element */
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { GoogleSpecialization } from "./types";

// Official 4-color Google G Logo
function GoogleGIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M23.6364 12.2727C23.6364 11.4273 23.5636 10.6091 23.4182 9.81818H12V14.4545H18.5273C18.2455 15.9545 17.4091 17.2273 16.1455 18.0727V21.0545H20.0727C22.3727 18.9364 23.6364 15.8909 23.6364 12.2727Z" fill="#4285F4"/>
      <path d="M12 24C15.2727 24 18.0273 22.9091 20.0727 21.0545L16.1455 18.0727C15.0364 18.8182 13.6273 19.2727 12 19.2727C8.85455 19.2727 6.19091 17.1455 5.24545 14.2909H1.21818V17.4091C3.2 21.3455 7.27273 24 12 24Z" fill="#34A853"/>
      <path d="M5.24545 14.2909C5 13.5455 4.87273 12.7818 4.87273 12C4.87273 11.2182 5 10.4545 5.24545 9.70909V6.59091H1.21818C0.436364 8.13636 0 9.99091 0 12C0 14.0091 0.436364 15.8636 1.21818 17.4091L5.24545 14.2909Z" fill="#FBBC05"/>
      <path d="M12 4.72727C13.7818 4.72727 15.3818 5.33636 16.6364 6.53636L20.1545 3.01818C18.0182 1.02727 15.2727 0 12 0C7.27273 0 3.2 2.65455 1.21818 6.59091L5.24545 9.70909C6.19091 6.85455 8.85455 4.72727 12 4.72727Z" fill="#EA4335"/>
    </svg>
  );
}

interface Props {
  specialization: GoogleSpecialization;
  onClick: () => void;
}

export default function SpecializationCard({
  specialization,
  onClick,
}: Props) {
  return (
    <>
      <style>{`
        .spec-card-${specialization.id}:hover {
          border-color: color-mix(in srgb, var(--accent-about) 40%, transparent) !important;
          background-color: var(--surface) !important;
        }
        .spec-card-${specialization.id}:hover .spec-action-text {
          color: var(--accent-about) !important;
        }
      `}</style>

      <motion.button
        whileTap={{ scale: 0.99 }}
        onClick={onClick}
        className={`spec-card-${specialization.id} group relative flex w-full flex-col text-left overflow-hidden border border-surface bg-background rounded-md px-6 py-5 transition-all duration-300`}
      >
        {/* Ultra-subtle background image preview */}
        <div className="absolute right-0 top-0 h-48 w-64 opacity-0 transition-opacity duration-500 group-hover:opacity-[0.03] pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-l from-transparent via-background/50 to-background z-10" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background z-10" />
          <img 
            src={specialization.professionalCertificate.image} 
            alt=""
            className="h-full w-full object-cover mix-blend-luminosity grayscale"
          />
        </div>

        <div className="relative z-20 flex flex-col h-full w-full">
          
          {/* Top Section */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="mb-4">
                <GoogleGIcon />
              </div>
              <p className="text-[9px] font-mono uppercase tracking-[0.24em] text-muted mb-2">
                Professional Certificate
              </p>
              <h4 className="text-[15px] font-semibold tracking-tight uppercase text-foreground leading-snug pr-2">
                {specialization.title}
              </h4>
            </div>

            <span 
              className="shrink-0 flex items-center gap-1.5 text-[8px] font-mono uppercase tracking-[0.18em] px-2 py-1 rounded-sm border"
              style={{
                color: 'var(--accent-about)',
                backgroundColor: 'color-mix(in srgb, var(--accent-about) 10%, transparent)',
                borderColor: 'color-mix(in srgb, var(--accent-about) 20%, transparent)'
              }}
            >
              <ShieldCheck size={10} />
              Verified
            </span>
          </div>

          {/* Divider */}
          <div className="mt-5 h-px w-full bg-surface" />

          {/* Skills / Tech Chips */}
          <div className="mt-5 mb-2 flex-1">
            <p className="text-[9px] font-mono uppercase tracking-[0.24em] text-muted mb-3">
              Core Technologies
            </p>
            <div className="flex flex-wrap gap-2">
              {specialization.highlights.slice(0, 3).map((skill) => (
                <span
                  key={skill}
                  className="text-[10px] font-mono px-2 py-1 rounded-sm border border-surface bg-surface/40 text-muted transition-colors group-hover:bg-background"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="mt-6 flex items-center justify-between mb-3">
            <p className="text-[9px] font-mono uppercase tracking-[0.24em] text-muted">
              {specialization.courseCount} Courses
            </p>
            <span className="text-[10px] font-mono text-foreground">
              {specialization.professionalCertificate.issuedDate}
            </span>
          </div>

          {/* Progress Bar */}
          <div className="h-[2px] w-full rounded-full bg-surface overflow-hidden">
            <div 
              className="h-full w-full opacity-80" 
              style={{ backgroundColor: 'var(--accent-about)' }}
            />
          </div>

          {/* Bottom CTA */}
          <div className="mt-6 pt-4 border-t border-surface flex items-center justify-between">
            <p className="text-[9px] font-mono uppercase tracking-[0.24em] text-muted">
              Learning Journey
            </p>

            <div className="spec-action-text flex items-center gap-1.5 text-[9px] font-mono uppercase tracking-[0.24em] text-muted transition-colors duration-300">
              <span>view details</span>
              <ArrowRight size={12} className="transition-transform duration-300 group-hover:translate-x-1" />
            </div>
          </div>
          
        </div>
      </motion.button>
    </>
  );
}