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

  // Escape Key listener for Modals
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (viewerFile) {
          setViewerFile(null);
        } else if (activeCase) {
          setActiveCase(null);
        }
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [viewerFile, activeCase]);

  return (
    <>
      <style jsx global>{`
        :root {
          --projects-accent: #0891b2;
          --projects-accent-soft: rgba(8, 145, 178, 0.04);
        }
        html.dark {
          --projects-accent: #22d3ee;
          --projects-accent-soft: rgba(34, 211, 238, 0.06);
        }
      `}</style>

      <section id="projects" className="relative min-h-screen w-full bg-background text-foreground pt-24 sm:pt-28 md:pt-32 pb-16 px-4 sm:px-6 md:px-12 lg:px-24 overflow-hidden border-t border-surface">
        
        {/* IMPROVEMENT: Lightened gradient (from /40 to /10) to remove the muddy black shadow */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/5 dark:to-black/10 pointer-events-none z-[1]"></div>
        
        {/* IMPROVEMENT: Softened the accent glow with lower opacity for cleaner dark mode depth */}
        <div 
          className="absolute top-[20%] right-[-10%] w-[600px] h-[600px] blur-[120px] rounded-full pointer-events-none opacity-40 dark:opacity-20"
          style={{ backgroundColor: 'var(--projects-accent)' }}
        ></div>

        <div className="relative z-10 max-w-6xl lg:max-w-7xl mx-auto">
          
          <div className="mb-12 space-y-4">
            <div className="flex items-center gap-3">
              <div 
                className="w-2.5 h-2.5 rounded-full shadow-md"
                style={{ backgroundColor: 'var(--projects-accent)' }}
              ></div>
              <span 
                className="font-mono text-[10px] tracking-[0.4em] uppercase"
                style={{ color: 'var(--projects-accent)' }}
              >
                // ACTIVE PROJECTS
              </span>
            </div>
            
            <div className="space-y-2">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight uppercase leading-[0.9]">
                Case <span className="text-muted italic font-light">Studies</span>
              </h2>
              
              <p className="font-mono text-[10px] text-muted tracking-[0.2em] uppercase">
                Session 2026 • Security Analysis Portfolio
              </p>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-4 pt-2">
              <p className="text-[10px] font-mono text-[var(--projects-accent)] bg-[var(--projects-accent-soft)] border border-[var(--projects-accent)]/10 px-3 py-1 rounded-sm inline-block w-fit">
                {caseFiles.length} Case Studies Loaded
              </p>
              
              <p className="text-muted text-sm max-w-md leading-relaxed">
                Practical security research focused on analysis, detection, and mitigation of system vulnerabilities.
              </p>
            </div>

            <div className="h-px bg-surface/60 w-full mt-6"></div>
          </div>

          {/* LIST VIEW */}
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
            assets={activeCase?.assets || []}
            activeCaseId={activeCase?.id}
            onClose={() => setViewerFile(null)}
            onNavigate={setViewerFile}
          />
        )}
      </section>
    </>
  );
}