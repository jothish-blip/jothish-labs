"use client";

import { useState } from "react";
import { motion } from "framer-motion";

import GoogleWordmark from "./GoogleWordmark";
import SpecializationCard from "./SpecializationCard";
import SpecializationModal from "./SpecializationModal";

import { googleSpecializations } from "./data";
import { GoogleSpecialization } from "./types";

export default function GoogleSection() {
  const [selectedSpecialization, setSelectedSpecialization] =
    useState<GoogleSpecialization | null>(null);

  return (
    <>
      <section className="border-t border-surface pt-14 max-w-5xl mx-auto space-y-10">
        {/* Header matching portfolio theme */}
        <div className="space-y-4 text-center flex flex-col items-center">
          <p className="font-mono text-[10px] tracking-[0.4em] text-accent uppercase">
            Google Professional Learning Paths
          </p>

          <div className="flex items-center gap-3">
            <GoogleWordmark />
            <span className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground">
              Specializations
            </span>
          </div>

          <p className="text-[10px] font-mono text-accent font-bold bg-accent/10 px-3 py-1 rounded-sm mt-1 inline-block uppercase tracking-widest">
            {googleSpecializations.length} Specializations Completed
          </p>

          <div className="w-16 h-[2px] bg-accent opacity-70 mt-2"></div>

          <p className="text-muted text-sm max-w-2xl mx-auto leading-relaxed">
            Industry-recognized Google Professional Certificates verified
            through Credly. Showcasing comprehensive learning paths, hands-on
            labs, and real-world scenarios.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {googleSpecializations.map((specialization, index) => (
            <motion.div
              key={specialization.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
            >
              <SpecializationCard
                specialization={specialization}
                onClick={() => setSelectedSpecialization(specialization)}
              />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Modal */}
      <SpecializationModal
        open={selectedSpecialization !== null}
        specialization={selectedSpecialization}
        onClose={() => setSelectedSpecialization(null)}
      />
    </>
  );
}