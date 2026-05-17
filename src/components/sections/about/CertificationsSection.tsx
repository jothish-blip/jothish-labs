"use client";
import { useState } from "react";
import { certifications } from "./data";
import { Certificate } from "./types";
import CertificateCard from "./CertificateCard";
import CertificateModal from "./CertificateModal";
import GoogleWordmark from "./GoogleWordmark";

export default function CertificationsSection() {
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);

  const verifiedCerts = certifications.filter(c => c.status === "verified");
  const learningPathCerts = certifications.filter(c => c.status !== "verified");

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex flex-col items-center gap-1">
          <p className="font-mono text-[10px] tracking-[0.4em] text-[var(--accent)] uppercase">
            LICENSES & CERTIFICATIONS
          </p>
          <p className="text-[10px] font-mono text-green-400 font-bold bg-green-500/10 px-3 py-1 rounded-sm mt-2">
            <span className="text-green-400 font-bold">{verifiedCerts.length}</span> / {certifications.length} Core Courses Completed
          </p>
          <p className="text-[9px] text-muted font-mono mt-1">
            Last updated: May 18, 2026
          </p>
        </div>

        <div className="flex justify-center items-center gap-3 flex-wrap mt-4">
          <GoogleWordmark />
          <h3 className="text-xl md:text-2xl font-medium text-muted tracking-tight">
            Cybersecurity Professional Certificates
          </h3>
        </div>
        
        <div className="h-[2px] w-16 bg-gradient-to-r from-[#4285F4] via-[#FBBC05] to-[#34A853] mx-auto opacity-80"></div>
        
        <p className="text-muted text-sm max-w-md mx-auto leading-relaxed mt-4">
          Structured learning path focused on security foundations, detection, response, and real-world analyst workflows.
        </p>
      </div>

      {/* SECTION 1: VERIFIED */}
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <h4 className="text-sm font-mono text-foreground uppercase tracking-widest">Verified Certifications</h4>
          <div className="h-px bg-surface flex-1"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {verifiedCerts.map((cert) => (
            <CertificateCard key={cert.id} cert={cert} onPreview={setSelectedCert} />
          ))}
        </div>
      </div>

      <div className="h-px bg-surface/60 my-10"></div>

      {/* SECTION 2: LEARNING PATH (IN PROGRESS / UPCOMING) */}
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <h4 className="text-sm font-mono text-foreground uppercase tracking-widest">In Progress & Upcoming</h4>
          <div className="h-px bg-surface flex-1"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 opacity-70 hover:opacity-100 transition-opacity duration-300">
          {learningPathCerts.map((cert) => (
            <CertificateCard key={cert.id} cert={cert} />
          ))}
        </div>
      </div>

      {/* Modal is completely self-contained */}
      <CertificateModal 
        selectedCert={selectedCert} 
        onClose={() => setSelectedCert(null)} 
      />
    </div>
  );
}