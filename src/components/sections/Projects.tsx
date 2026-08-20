"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { projects } from "@/lib/projects/projectData";
import { ProjectData } from "@/lib/projects/types";
import { ShieldAlert, Code2, Network, Search, Archive, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

// Lazy-load the modal component to optimize initial bundle size
const ProjectModal = dynamic(() => import("./projects/ProjectModal"), {
  ssr: false,
});

// --- HELPER COMPONENTS ---

function ProjectSectionHeader({ count }: { count: number }) {
  return (
    <header className="relative mx-auto w-full max-w-4xl text-center space-y-5 py-8 flex flex-col items-center">
      <div className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center overflow-hidden">
        <div 
          className="w-[300px] h-[150px] md:w-[600px] md:h-[200px] blur-[80px] rounded-[100%] opacity-30 mix-blend-screen"
          style={{ backgroundColor: 'var(--accent-projects)' }}
        ></div>
        <div className="absolute inset-0 opacity-[0.02] bg-[radial-gradient(circle,currentColor_1px,transparent_1px)] bg-[size:12px_12px]"></div>
      </div>

      <div className="relative z-10 space-y-4 flex flex-col items-center">
        <p className="font-mono text-[9px] tracking-[0.4em] uppercase" style={{ color: 'var(--accent-projects)' }}>
          {"// Case Files"}
        </p>
        <h2 id="projects-heading" className="text-3xl md:text-5xl font-semibold tracking-tight leading-[1.1] text-foreground uppercase">
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
        <div className="w-12 h-[1px] my-2 opacity-50" style={{ backgroundColor: 'var(--accent-projects)' }} />
      </div>
    </header>
  );
}

const getStatusIcon = (status: string) => {
  switch(status.toLowerCase()) {
    case 'security audit': return <ShieldAlert size={12} />;
    case 'automation': return <Code2 size={12} />;
    case 'network analysis': return <Network size={12} />;
    case 'detection lab': return <Search size={12} />;
    case 'collection': return <Archive size={12} />;
    default: return <Code2 size={12} />;
  }
};

// --- MAIN EXPORT ---

export default function Projects() {
  const [activeProject, setActiveProject] = useState<ProjectData | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // URL State Management
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const projectId = params.get("project");
    if (projectId) {
      const targetProject = projects.find((p) => p.id === projectId);
      if (targetProject) setActiveProject(targetProject);
    }
  }, []);

  const handleOpenProject = useCallback((project: ProjectData) => {
    setActiveProject(project);
    const url = new URL(window.location.href);
    url.searchParams.set("project", project.id);
    window.history.pushState({}, "", url.toString());
  }, []);

  const handleCloseProject = useCallback(() => {
    setActiveProject(null);
    const url = new URL(window.location.href);
    url.searchParams.delete("project");
    window.history.pushState({}, "", url.toString());
  }, []);

  // Carousel Navigation Logic
  const next = useCallback(() => {
    if (currentIndex < projects.length - 1) setCurrentIndex((prev) => prev + 1);
  }, [currentIndex]);

  const prev = useCallback(() => {
    if (currentIndex > 0) setCurrentIndex((prev) => prev - 1);
  }, [currentIndex]);

  // Keyboard Support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeProject) return; // Don't trigger if modal is open
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [next, prev, activeProject]);

  return (
    <section id="projects" aria-labelledby="projects-heading" className="border-t border-surface pt-14 pb-32 w-full relative overflow-hidden">
      
      <style>{`
        .carousel-card:hover {
          border-color: color-mix(in srgb, var(--accent-projects) 50%, transparent) !important;
        }
      `}</style>

      <ProjectSectionHeader count={projects.length} />

      {projects.length === 0 ? (
        <div className="py-16 text-center font-mono text-[10px] tracking-[0.24em] uppercase text-muted border border-surface bg-surface/10 rounded-sm backdrop-blur-sm max-w-4xl mx-auto">
          <span className="opacity-50">No projects available at this time.</span>
        </div>
      ) : (
        <div className="relative w-full max-w-[100vw] mt-10">
          
          {/* 3D CAROUSEL CONTAINER */}
          <div className="relative h-[480px] md:h-[550px] w-full flex items-center justify-center perspective-[1200px]">
            {projects.map((project, index) => {
              const diff = index - currentIndex;
              const isCenter = diff === 0;
              const isLeft = diff === -1;
              const isRight = diff === 1;
              const isHidden = Math.abs(diff) > 1;

              // Spring Physics & 3D Math
              let x = "0%";
              let rotateY = 0;
              let scale = 1;
              let opacity = 1;
              let zIndex = 10;
              let filter = "brightness(1) blur(0px)";

              if (isLeft) {
                x = "-55%";
                rotateY = 18;
                scale = 0.82;
                opacity = 0.5;
                zIndex = 5;
                filter = "brightness(0.6) blur(2px)";
              } else if (isRight) {
                x = "55%";
                rotateY = -18;
                scale = 0.82;
                opacity = 0.5;
                zIndex = 5;
                filter = "brightness(0.6) blur(2px)";
              } else if (isHidden) {
                x = diff < 0 ? "-100%" : "100%";
                scale = 0.5;
                opacity = 0;
                zIndex = 0;
              }

              const coverImage = project.images?.cover || project.image;

              return (
                <motion.div
                  key={project.id}
                  initial={false}
                  animate={{ x, rotateY, scale, opacity, zIndex, filter }}
                  transition={{ type: "spring", stiffness: 220, damping: 25 }}
                  className="absolute origin-center w-[92vw] max-w-[720px] h-[450px] md:h-[500px] flex flex-col bg-background border border-surface rounded-xl overflow-hidden shadow-2xl cursor-pointer carousel-card"
                  style={{ pointerEvents: isHidden ? "none" : "auto" }}
                  
                  // Gestures: Drag to swipe, Click to Open
                  drag={isCenter ? "x" : false}
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.2}
                  onDragEnd={(e, { offset, velocity }) => {
                    const swipeConfidenceThreshold = 10000;
                    const swipePower = Math.abs(offset.x) * velocity.x;
                    if (swipePower < -swipeConfidenceThreshold) next();
                    else if (swipePower > swipeConfidenceThreshold) prev();
                  }}
                  onClick={() => {
                    if (isCenter) handleOpenProject(project);
                    else if (isLeft) prev();
                    else if (isRight) next();
                  }}
                >
                  
                  {/* CARD COVER IMAGE */}
                  <div className="relative h-[200px] md:h-[260px] w-full bg-surface/20 shrink-0 overflow-hidden border-b border-surface">
                    {coverImage ? (
                      <motion.div
                        animate={{ scale: isCenter ? 1 : 1.05 }}
                        transition={{ duration: 0.5 }}
                        className="w-full h-full relative"
                      >
                        <Image 
                          src={coverImage} 
                          alt={project.imageAlt || project.title}
                          fill
                          className="object-cover"
                        />
                      </motion.div>
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-muted/30">
                        <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(circle,currentColor_1px,transparent_1px)] bg-[size:16px_16px]" />
                        <ShieldAlert size={32} className="mb-3 opacity-40" />
                        <span className="font-mono text-[9px] tracking-[0.24em] uppercase text-muted/50">Visual Pending</span>
                      </div>
                    )}
                    
                    {/* Dark gradient overlay at the bottom of the image for text readability */}
                    <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background to-transparent" />
                  </div>

                  {/* CARD CONTENT */}
                  <div className="flex flex-col flex-1 p-6 md:p-8 w-full bg-background relative z-10">
                    
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-[10px] font-mono uppercase tracking-[0.24em] text-muted mb-2">
                          {project.projectNumber || "Project"}
                        </p>
                        <h3 className="text-xl md:text-2xl font-bold tracking-tight uppercase text-foreground leading-snug line-clamp-1">
                          {project.title}
                        </h3>
                      </div>
                      <span className="shrink-0 flex items-center gap-1.5 text-[9px] font-mono uppercase tracking-[0.18em] px-3 py-1.5 rounded-sm border border-surface bg-surface/40 text-muted">
                        {getStatusIcon(project.status)}
                        <span className="hidden sm:block">{project.status}</span>
                      </span>
                    </div>

                    <p className="mt-4 text-[13px] md:text-[14px] leading-relaxed text-muted line-clamp-2 md:line-clamp-3">
                      {project.description}
                    </p>

                    <div className="mt-auto pt-6 flex items-center justify-between">
                      {/* Tech Chips */}
                      <div className="flex flex-wrap gap-2">
                        {project.technologies.slice(0, isCenter ? 3 : 2).map((tech) => (
                          <span key={tech} className="text-[10px] font-mono px-2.5 py-1 rounded-sm border border-surface bg-surface/40 text-muted">
                            {tech}
                          </span>
                        ))}
                      </div>

                      {/* Interactive Cue */}
                      {isCenter && (
                        <div 
                          className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.2em] font-semibold animate-pulse"
                          style={{ color: 'var(--accent-projects)' }}
                        >
                          Explore <ChevronRight size={14} />
                        </div>
                      )}
                    </div>
                  </div>

                </motion.div>
              );
            })}
          </div>

          {/* HUD NAVIGATION (Controls & Indicator) */}
          <div className="max-w-[720px] mx-auto mt-8 px-6 flex items-center justify-between">
            <button 
              onClick={prev}
              disabled={currentIndex === 0}
              className="p-3 border border-surface rounded-full text-foreground bg-background hover:bg-surface/50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              aria-label="Previous Project"
            >
              <ChevronLeft size={18} />
            </button>
            
            <div className="flex flex-col items-center gap-1">
              <span className="font-mono text-[11px] tracking-[0.24em] text-foreground font-semibold">
                {String(currentIndex + 1).padStart(2, '0')} <span className="text-muted font-normal">/ {String(projects.length).padStart(2, '0')}</span>
              </span>
              <span className="text-[9px] font-mono uppercase tracking-[0.24em] text-muted">
                Swipe or use arrows
              </span>
            </div>

            <button 
              onClick={next}
              disabled={currentIndex === projects.length - 1}
              className="p-3 border border-surface rounded-full text-foreground bg-background hover:bg-surface/50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              aria-label="Next Project"
            >
              <ChevronRight size={18} />
            </button>
          </div>

        </div>
      )}

      {/* MODAL */}
      <AnimatePresence>
        {activeProject && (
          <ProjectModal
            project={activeProject}
            onClose={handleCloseProject}
          />
        )}
      </AnimatePresence>
    </section>
  );
}