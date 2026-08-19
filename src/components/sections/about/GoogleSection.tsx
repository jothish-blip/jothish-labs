"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

import GoogleWordmark from "./GoogleWordmark";
import SpecializationCard from "./SpecializationCard";
import SpecializationModal from "./SpecializationModal";

import { googleSpecializations } from "./data";
import { GoogleSpecialization } from "./types";
import { trackEvent, TELEMETRY_EVENTS } from "@/lib/telemetry/events";

export default function GoogleSection() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedSpecialization, setSelectedSpecialization] = useState<GoogleSpecialization | null>(null);
  
  const startTimeRef = useRef<number>(0);

  useEffect(() => {
    if (isOpen) {
      startTimeRef.current = Date.now();
      trackEvent({ type: TELEMETRY_EVENTS.GOOGLE_SECTION_ENTER, metadata: { section: 'google_certifications' } });
    } else if (startTimeRef.current > 0) {
      const duration = Math.round((Date.now() - startTimeRef.current) / 1000);
      trackEvent({ 
        type: TELEMETRY_EVENTS.GOOGLE_SECTION_EXIT, 
        metadata: { section: 'google_certifications', duration_seconds: duration } 
      });
      startTimeRef.current = 0;
    }
  }, [isOpen]);

  const handleOpenModal = (specialization: GoogleSpecialization) => {
    setSelectedSpecialization(specialization);
  };

  const handleCloseModal = () => {
    setSelectedSpecialization(null);
  };

  return (
    <>
      <section className="border-t border-surface pt-14 max-w-6xl mx-auto relative">
        {!isOpen ? (
          // CLOSED STATE: Clickable banner to open the section
          <div className="flex flex-col items-center justify-center space-y-5">
            <div className="relative inline-flex flex-col items-center">
              <p 
                className="font-mono text-[9px] tracking-[0.4em] uppercase mb-2"
                style={{ color: 'var(--accent-about)' }}
              >
                Professional Learning Paths
              </p>
              <div 
                className="h-[2px] w-full rounded-full opacity-50" 
                style={{ backgroundColor: 'var(--accent-about)' }}
              />
            </div>

            <button
              onClick={() => setIsOpen(true)}
              className="group flex flex-col md:flex-row items-center gap-4 px-8 py-5 border border-surface bg-background rounded-md transition-all duration-300 hover:bg-surface/50 w-full max-w-2xl"
              style={{ '--hover-border': 'color-mix(in srgb, var(--accent-about) 40%, transparent)' } as React.CSSProperties}
            >
              <style jsx>{`
                button:hover { border-color: var(--hover-border) !important; }
              `}</style>
              
              <GoogleWordmark />
              <div className="h-px w-full md:w-px md:h-8 bg-surface transition-colors" />
              <div className="flex flex-col items-center md:items-start">
                <span className="text-sm md:text-[15px] font-semibold tracking-tight text-foreground uppercase">
                  View {googleSpecializations.length} Specializations Completed
                </span>
                <span 
                  className="text-[9px] font-mono text-muted uppercase tracking-[0.24em] mt-1 transition-colors"
                >
                  Click to expand
                </span>
              </div>
            </button>
          </div>
        ) : (
          // OPEN STATE: Full section content
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 relative z-10">
            
            {/* Top Close Button */}
            <div className="flex justify-end mb-[-1rem]">
              <button
                onClick={() => setIsOpen(false)}
                className="text-[9px] font-mono uppercase tracking-[0.24em] text-muted transition-colors flex items-center gap-2 bg-surface/30 px-3 py-1.5 rounded-sm hover:bg-surface border border-transparent hover:border-surface-strong"
                style={{ '--hover-text': 'var(--accent-about)' } as React.CSSProperties}
              >
                <style jsx>{` button:hover { color: var(--hover-text) !important; } `}</style>
                ✕ Close
              </button>
            </div>

            {/* Header with Radiolucent / X-Ray Effect matching --accent-about */}
            <header className="relative mx-auto w-full max-w-4xl text-center space-y-5 py-4 flex flex-col items-center">
              
              {/* Radiolucent Glow */}
              <div className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center overflow-hidden">
                <div 
                  className="w-[300px] h-[150px] md:w-[600px] md:h-[200px] blur-[80px] rounded-[100%] opacity-30 mix-blend-screen"
                  style={{ backgroundColor: 'var(--accent-about)' }}
                ></div>
                <div className="absolute inset-0 opacity-[0.02] bg-[radial-gradient(circle,currentColor_1px,transparent_1px)] bg-[size:12px_12px]"></div>
              </div>

              <div className="relative z-10 space-y-4 flex flex-col items-center">
                <p 
                  className="font-mono text-[9px] tracking-[0.4em] uppercase"
                  style={{ color: 'var(--accent-about)' }}
                >
                  {"// Professional Learning Paths"}
                </p>

                <div className="flex items-center gap-3">
                  <GoogleWordmark />
                  <span className="text-3xl md:text-3xl font-semibold tracking-tight text-foreground uppercase">
                    Specializations
                  </span>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <p 
                    className="text-[9px] font-mono font-medium px-3 py-1.5 rounded-sm inline-block uppercase tracking-[0.24em] backdrop-blur-md"
                    style={{ 
                      color: 'var(--accent-about)',
                      backgroundColor: 'color-mix(in srgb, var(--accent-about) 10%, transparent)',
                      border: '1px solid color-mix(in srgb, var(--accent-about) 20%, transparent)'
                    }}
                  >
                    {googleSpecializations.length} Specializations Completed
                  </p>
                </div>

                <div 
                  className="w-12 h-[1px] my-2 opacity-50" 
                  style={{ backgroundColor: 'var(--accent-about)' }}
                />

                <p className="mx-auto max-w-2xl text-[13px] md:text-[14px] leading-relaxed text-muted">
                  Industry-recognized Google Professional Certificates verified
                  through Credly. Showcasing comprehensive learning paths, hands-on
                  labs, and real-world scenarios.
                </p>
              </div>
            </header>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 relative z-10">
              {googleSpecializations.map((specialization, index) => (
                <motion.div
                  key={specialization.id}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
                  className="h-full flex list-none"
                >
                  <SpecializationCard
                    specialization={specialization}
                    onClick={() => handleOpenModal(specialization)}
                  />
                </motion.div>
              ))}
            </div>

            {/* Bottom Close Button */}
            <div className="flex justify-center pt-8">
              <button
                onClick={() => setIsOpen(false)}
                className="text-[9px] font-mono uppercase tracking-[0.24em] border border-surface px-6 py-3 rounded-sm text-foreground transition-all duration-300 bg-surface/20"
                style={{ 
                  '--hover-bg': 'var(--accent-about)',
                  '--hover-border': 'var(--accent-about)' 
                } as React.CSSProperties}
              >
                <style jsx>{`
                  button:hover { 
                    background-color: var(--hover-bg) !important; 
                    border-color: var(--hover-border) !important;
                    color: var(--background) !important;
                  }
                `}</style>
                Close Section
              </button>
            </div>
          </div>
        )}
      </section>

      {/* Modal */}
      <SpecializationModal
        open={selectedSpecialization !== null}
        specialization={selectedSpecialization}
        onClose={handleCloseModal}
      />
    </>
  );
}