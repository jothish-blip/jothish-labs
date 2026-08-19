"use client";

import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { projects } from "@/lib/projects/projectData";
import { ProjectData } from "@/lib/projects/types";

import ProjectCard from "./projects/ProjectCard";

// Lazy-load the modal component to optimize initial bundle size
const ProjectModal = dynamic(() => import("./projects/ProjectModal"), {
  ssr: false,
});

const INITIAL_COUNT = 6;

// Reusable Section Header with "Radiolucent" (X-Ray/Glowing) aesthetic tied to --accent-projects
function ProjectSectionHeader({ count }: { count: number }) {
  return (
    <header className="relative mx-auto w-full max-w-4xl text-center space-y-5 py-8 flex flex-col items-center">
      
      {/* Radiolucent Glow / X-Ray Effect Background */}
      <div className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center overflow-hidden">
        <div 
          className="w-[300px] h-[150px] md:w-[600px] md:h-[200px] blur-[80px] rounded-[100%] opacity-30 mix-blend-screen"
          style={{ backgroundColor: 'var(--accent-projects)' }}
        ></div>
        <div className="absolute inset-0 opacity-[0.02] bg-[radial-gradient(circle,currentColor_1px,transparent_1px)] bg-[size:12px_12px]"></div>
      </div>

      <div className="relative z-10 space-y-4 flex flex-col items-center">
        <p 
          className="font-mono text-[9px] tracking-[0.4em] uppercase"
          style={{ color: 'var(--accent-projects)' }}
        >
          {"// Case Files"}
        </p>

        <h2
          id="projects-heading"
          className="text-3xl md:text-5xl font-semibold tracking-tight leading-[1.1] text-foreground uppercase"
        >
          Engineering Security
          <br />
          <span className="text-muted italic font-light">Through Practical Solutions.</span>
        </h2>

        <div className="flex items-center gap-3 pt-2">
          <p 
            className="text-[9px] font-mono font-medium px-3 py-1.5 rounded-sm inline-block uppercase tracking-[0.24em] backdrop-blur-md"
            style={{ 
              color: 'var(--accent-projects)',
              backgroundColor: 'color-mix(in srgb, var(--accent-projects) 10%, transparent)',
              border: '1px solid color-mix(in srgb, var(--accent-projects) 20%, transparent)'
            }}
          >
            {count} Projects Deployed
          </p>
        </div>

        <div 
          className="w-12 h-[1px] my-2 opacity-50" 
          style={{ backgroundColor: 'var(--accent-projects)' }}
        />

        <p className="mx-auto max-w-2xl text-[13px] md:text-[14px] leading-relaxed text-muted">
          A curated collection of projects exploring offensive security,
          vulnerability research, malware analysis, cloud security, AI-driven
          security, and secure software engineering—designed to address
          real-world challenges with scalable solutions.
        </p>
      </div>
    </header>
  );
}

// Resilient Empty State component
function EmptyProjects() {
  return (
    <div className="py-16 text-center font-mono text-[10px] tracking-[0.24em] uppercase text-muted border border-surface bg-surface/10 rounded-sm backdrop-blur-sm">
      <span className="opacity-50">No projects available at this time.</span>
    </div>
  );
}

export default function Projects() {
  const [activeProject, setActiveProject] = useState<ProjectData | null>(null);
  const [showAll, setShowAll] = useState(false);

  // Stable handler references using useCallback
  const handleOpenProject = useCallback((project: ProjectData) => {
    setActiveProject(project);
  }, []);

  const handleCloseProject = useCallback(() => {
    setActiveProject(null);
  }, []);

  const visibleProjects = showAll ? projects : projects.slice(0, INITIAL_COUNT);

  return (
    <section
      id="projects"
      aria-labelledby="projects-heading"
      className="border-t border-surface pt-14 pb-24 max-w-6xl mx-auto flex flex-col gap-12 px-6 md:px-8 relative"
    >
      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .view-more-btn:hover {
          border-color: color-mix(in srgb, var(--accent-projects) 40%, transparent) !important;
          color: var(--accent-projects) !important;
        }
        .project-top-close:hover {
          color: var(--accent-projects) !important;
        }
        .project-bottom-close:hover {
          background-color: var(--accent-projects) !important;
          border-color: var(--accent-projects) !important;
          color: var(--background) !important;
        }
      `}</style>

      <ProjectSectionHeader count={projects.length} />

      {projects.length === 0 ? (
        <EmptyProjects />
      ) : (
        <>
          {/* Top Close Button - Visible only when expanded */}
          {showAll && projects.length > INITIAL_COUNT && (
            <div className="flex justify-end mb-[-1rem] relative z-10 animate-in fade-in duration-300">
              <button
                onClick={() => setShowAll(false)}
                className="project-top-close text-[9px] font-mono uppercase tracking-[0.24em] text-muted transition-colors flex items-center gap-2 bg-surface/30 px-3 py-1.5 rounded-sm hover:bg-surface border border-transparent hover:border-surface-strong"
              >
                ✕ Close
              </button>
            </div>
          )}

          <ul className="flex gap-5 overflow-x-auto snap-x snap-mandatory pb-5 no-scrollbar md:grid md:grid-cols-2 lg:grid-cols-3 md:overflow-visible relative z-10">
            {visibleProjects.map((p, index) => (
              <motion.li
                key={p.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, ease: "easeOut", delay: (index % 3) * 0.1 }}
                className="snap-center shrink-0 w-[85%] sm:w-[70%] md:w-auto h-auto flex list-none"
              >
                <ProjectCard project={p} onOpen={handleOpenProject} />
              </motion.li>
            ))}
          </ul>

          {/* Bottom Actions */}
          {projects.length > INITIAL_COUNT && (
            <div className="mt-4 flex justify-center relative z-10">
              {!showAll ? (
                <button
                  onClick={() => setShowAll(true)}
                  className="view-more-btn px-6 py-3 border border-surface bg-surface/10 rounded-sm text-[10px] font-mono uppercase tracking-[0.24em] text-muted transition-all duration-300"
                >
                  View More Projects
                </button>
              ) : (
                <button
                  onClick={() => setShowAll(false)}
                  className="project-bottom-close text-[9px] font-mono uppercase tracking-[0.24em] border border-surface px-6 py-3 rounded-sm text-foreground transition-all duration-300 bg-surface/20"
                >
                  Show Less
                </button>
              )}
            </div>
          )}
        </>
      )}

      {activeProject && (
        <ProjectModal
          project={activeProject}
          onClose={handleCloseProject}
        />
      )}
    </section>
  );
}