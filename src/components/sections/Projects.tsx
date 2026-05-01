"use client";
import { useState, useEffect } from "react";
import { caseFiles } from "@/lib/projects/caseFiles";
import { CaseData, Asset } from "@/lib/projects/types";

// 🎯 FIXED IMPORTS: Now pointing to the new 'projects' subfolder
import CaseCard from "./projects/CaseCard";
import CaseModal from "./projects/CaseModal";
import AssetViewer from "./projects/AssetViewer";

export default function Projects() {
  const [activeCase, setActiveCase] = useState<CaseData | null>(null);
  const [viewerFile, setViewerFile] = useState<Asset | null>(null);

  // Lock background scroll when ANY modal is open
  useEffect(() => {
    if (activeCase || viewerFile) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => { document.body.style.overflow = "auto"; };
  }, [activeCase, viewerFile]);

  return (
    <section id="projects" className="relative min-h-screen w-full bg-[#030303] text-white pt-[120px] sm:pt-[110px] md:pt-[130px] pb-16 px-4 sm:px-6 md:px-12 lg:px-24 overflow-hidden border-t border-white/5">
      
      {/* BACKGROUND DEPTH */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60 pointer-events-none z-[1]"></div>
      <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] bg-cyan-900/[0.02] blur-[150px] rounded-full pointer-events-none"></div>

      <div className="relative z-10 max-w-5xl mx-auto">
        
        {/* HUD Header */}
        <div className="mb-16 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-cyan-500 rounded-full animate-ping shadow-[0_0_10px_rgba(6,182,212,0.5)]"></div>
            <span className="font-mono text-[10px] tracking-[0.5em] text-cyan-500 uppercase">// ACTIVE_INVESTIGATIONS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter uppercase leading-[0.8] mb-4">
            Case <span className="text-zinc-800 italic font-light">Files.</span>
          </h2>
          <p className="font-mono text-[10px] text-zinc-700 tracking-[0.3em]">
            SESSION_ID: 2026 // AUDIT_LOG_INITIALIZED
          </p>
        </div>

        {/* COMPACT LIST VIEW */}
        <div className="space-y-4">
          {caseFiles.map((c) => (
            <CaseCard key={c.id} data={c} onOpen={setActiveCase} />
          ))}
        </div>
      </div>

      {/* FULLSCREEN DOSSIER MODAL */}
      {activeCase && (
        <CaseModal
          data={activeCase}
          onClose={() => setActiveCase(null)}
          onOpenAsset={setViewerFile}
        />
      )}

      {/* LOCAL VIEWER MODAL */}
      {viewerFile && (
        <AssetViewer
          file={viewerFile}
          activeCaseId={activeCase?.id}
          onClose={() => setViewerFile(null)}
        />
      )}
    </section>
  );
}