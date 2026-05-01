"use client";
import { useState, useEffect } from "react";
import { caseFiles } from "@/lib/projects/caseFiles";
import { CaseData, Asset } from "@/lib/projects/types";

import CaseCard from "./projects/CaseCard";
import CaseModal from "./projects/CaseModal";
import AssetViewer from "./projects/AssetViewer";

export default function Projects() {
  const [activeCase, setActiveCase] = useState<CaseData | null>(null);
  const [viewerFile, setViewerFile] = useState<Asset | null>(null);

  // Lock background scroll AND touch actions when ANY modal is open
  useEffect(() => {
    if (activeCase || viewerFile) {
      document.body.style.overflow = "hidden";
      document.body.style.touchAction = "none";
    } else {
      document.body.style.overflow = "auto";
      document.body.style.touchAction = "auto";
    }
    return () => { 
      document.body.style.overflow = "auto"; 
      document.body.style.touchAction = "auto";
    };
  }, [activeCase, viewerFile]);

  return (
    <>
      {/* 2. Theme-aware CSS Variables */}
      <style jsx global>{`
        :root {
          --projects-accent: #0891b2;
          --projects-accent-soft: rgba(8, 145, 178, 0.04);
        }
        html.dark {
          --projects-accent: #22d3ee;
          --projects-accent-soft: rgba(34, 211, 238, 0.08);
        }
      `}</style>

      {/* 4. Layout Fixes: Consistent padding and wider container */}
      <section id="projects" className="relative min-h-screen w-full bg-background text-foreground pt-24 sm:pt-28 md:pt-32 pb-16 px-4 sm:px-6 md:px-12 lg:px-24 overflow-hidden border-t border-surface">
        
        {/* 1. Theme-Aware Background Depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/5 dark:to-black/60 pointer-events-none z-[1]"></div>
        
        {/* 6. Optimized Blur for Mobile GPU */}
        <div 
          className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] blur-[100px] sm:blur-[120px] rounded-full pointer-events-none"
          style={{ backgroundColor: 'var(--projects-accent-soft)' }}
        ></div>

        <div className="relative z-10 max-w-6xl lg:max-w-7xl mx-auto">
          
          {/* 3 & 9. Improved Header: Cleaner, less fake terminal noise */}
          <div className="mb-12 space-y-3">
            <div className="flex items-center gap-3">
              <div 
                className="w-2 h-2 rounded-full shadow-sm"
                style={{ backgroundColor: 'var(--projects-accent)' }}
              ></div>
              <span 
                className="font-mono text-[10px] tracking-[0.4em] uppercase"
                style={{ color: 'var(--projects-accent)' }}
              >
                // ACTIVE PROJECTS
              </span>
            </div>
            
            {/* 5. Typography: softer line-height and cleaner word choice */}
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight uppercase leading-[0.9]">
              Case <span className="text-muted italic font-light">Studies</span>
            </h2>
            
            <p className="font-mono text-[10px] text-muted tracking-[0.2em] uppercase">
              Session 2026 • Security Analysis Portfolio
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
    </>
  );
}