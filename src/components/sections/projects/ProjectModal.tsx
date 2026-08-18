"use client";

import { useState, useEffect } from "react";
import { ProjectData, ChildProjectData } from "@/lib/projects/types";
import { X, ArrowLeft, ExternalLink, ArrowRight, ShieldAlert, Code2 } from "lucide-react";
import Image from "next/image";
import { useScrollLock } from "@/hooks/useScrollLock";
import { trackEvent, TELEMETRY_EVENTS } from "@/lib/telemetry/events";

interface Props {
  project: ProjectData;
  onClose: () => void;
}

const customScrollbar = "[&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-sm [&::-webkit-scrollbar-thumb]:bg-surface-strong [&::-webkit-scrollbar-track]:bg-transparent hover:[&::-webkit-scrollbar-thumb]:bg-muted/50";

export default function ProjectModal({ project, onClose }: Props) {
  const [activeChild, setActiveChild] = useState<ChildProjectData | null>(null);

  // Prevent background scrolling safely
  useScrollLock(true);

  // Track PROJECT_OPEN and PROJECT_CLOSE
  useEffect(() => {
    const startTime = Date.now();
    trackEvent({
      type: TELEMETRY_EVENTS.PROJECT_OPEN,
      metadata: { project: project.title, project_id: project.id }
    });

    return () => {
      const durationSeconds = Math.round((Date.now() - startTime) / 1000);
      trackEvent({
        type: TELEMETRY_EVENTS.PROJECT_CLOSE,
        metadata: { project: project.title, project_id: project.id, duration_seconds: durationSeconds }
      });
    };
  }, [project.title, project.id]);

  // Handle Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (activeChild) {
          setActiveChild(null);
        } else {
          onClose();
        }
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [activeChild, onClose]);

  // Determine what data to display
  const displayData = activeChild || project;
  const isCollection = project.childProjects && project.childProjects.length > 0 && !activeChild;
  
  const coverImage = displayData.images?.cover || displayData.image;

  return (
    <>
      <style>{`
        .project-modal-hover:hover {
          border-color: color-mix(in srgb, var(--accent-projects) 40%, transparent) !important;
          background-color: var(--surface) !important;
        }
        .project-modal-hover:hover .project-modal-text {
          color: var(--accent-projects) !important;
        }
        .project-modal-btn:hover {
          background-color: color-mix(in srgb, var(--accent-projects) 10%, transparent) !important;
          border-color: color-mix(in srgb, var(--accent-projects) 40%, transparent) !important;
          color: var(--accent-projects) !important;
        }
      `}</style>

      {/* Z-[99999] and backdrop-blur-md ensures the navbar and background are completely pushed back */}
      <div className="fixed inset-0 z-[99999] flex items-center justify-center p-0 sm:p-6 bg-background/90 backdrop-blur-md">
        
        {/* Modal Container */}
        <div className="relative flex flex-col w-full max-w-5xl h-[100dvh] sm:h-[90vh] bg-background border-0 sm:border border-surface sm:rounded-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
          
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-surface bg-surface/10 shrink-0">
            <div className="flex items-center gap-4">
              {activeChild ? (
                <button 
                  onClick={() => setActiveChild(null)}
                  className="flex items-center gap-2 text-[9px] font-mono tracking-[0.24em] uppercase text-muted hover:text-foreground transition-colors"
                >
                  <ArrowLeft size={12} /> Back to Collection
                </button>
              ) : (
                <span 
                  className="font-mono text-[9px] tracking-[0.24em] uppercase"
                  style={{ color: 'var(--accent-projects)' }}
                >
                  {isCollection ? "Project Collection" : "Project Details"}
                </span>
              )}
            </div>
            
            <button 
              onClick={onClose}
              className="p-1.5 text-muted hover:text-foreground transition-colors rounded-sm hover:bg-surface border border-transparent hover:border-surface-strong"
              aria-label="Close modal"
            >
              <X size={16} />
            </button>
          </div>

          {/* Scrollable Body */}
          <div className={`flex-1 overflow-y-auto overflow-x-hidden ${customScrollbar}`}>
            
            {/* Hero Banner */}
            <div className="relative w-full aspect-[21/9] sm:aspect-[3/1] bg-surface/20 border-b border-surface overflow-hidden">
              {coverImage ? (
                <Image 
                  src={coverImage} 
                  alt={displayData.imageAlt || displayData.title}
                  fill
                  className="object-cover" // Full color enabled, grayscale and filters removed
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-muted/30">
                  <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(circle,currentColor_1px,transparent_1px)] bg-[size:20px_20px]" />
                  <ShieldAlert size={32} className="mb-3 opacity-40" />
                  <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-muted/50">Visual Pending</span>
                </div>
              )}
              
              {/* Gradient Overlay for Text Readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
              
              {/* Title Block over Image */}
              <div className="absolute bottom-6 left-6 right-6 lg:bottom-10 lg:left-10">
                <span className="inline-block font-mono text-[9px] tracking-[0.24em] uppercase bg-background border border-surface px-2 py-1 rounded-sm text-muted mb-3">
                  {displayData.projectNumber || "Project"}
                </span>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight uppercase text-foreground">
                  {displayData.title}
                </h2>
              </div>
            </div>

            {/* Content Container */}
            <div className="p-6 sm:p-10 lg:px-12 max-w-5xl mx-auto space-y-12">
              
              {/* Short Description */}
              <p className="text-[14px] sm:text-[15px] text-muted leading-relaxed max-w-3xl">
                {displayData.description}
              </p>

              {/* Links Row */}
              <div className="flex flex-wrap gap-3 pt-2">
                {displayData.githubUrl && (
                  <a 
                    href={displayData.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="project-modal-btn inline-flex items-center gap-2 px-4 py-2 border border-surface bg-surface/20 text-foreground rounded-sm text-[9px] font-mono uppercase tracking-[0.24em] transition-all"
                  >
                    <Code2 size={12} /> View on GitHub
                  </a>
                )}
                {displayData.readmeUrl && (
                  <a 
                    href={displayData.readmeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="project-modal-btn inline-flex items-center gap-2 px-4 py-2 border border-surface bg-background text-foreground rounded-sm text-[9px] font-mono uppercase tracking-[0.24em] transition-all"
                  >
                    Read Full Case Study <ExternalLink size={10} />
                  </a>
                )}
              </div>

              {/* If Collection -> Show Child Projects list */}
              {isCollection && project.childProjects && (
                <div className="space-y-6 pt-8 border-t border-surface">
                  <h3 className="text-[10px] font-mono uppercase tracking-[0.24em] text-foreground mb-4">
                    Included Projects
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {project.childProjects.map((child) => {
                      // Resolve image for the child project
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      const childImg = (child as any).images?.cover || child.image;
                      
                      return (
                        <button 
                          key={child.id}
                          onClick={() => setActiveChild(child)}
                          className="project-modal-hover group flex flex-col text-left border border-surface rounded-md bg-background transition-all duration-300 overflow-hidden"
                        >
                          {/* 16:9 Image Header for Child Project */}
                          <div className="relative w-full aspect-video bg-surface/20 border-b border-surface overflow-hidden shrink-0">
                            {childImg ? (
                              <Image 
                                src={childImg}
                                alt={child.imageAlt || child.title}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                              />
                            ) : (
                              <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-muted/30">
                                <ShieldAlert size={20} className="mb-2 opacity-40" />
                                <span className="font-mono text-[8px] tracking-[0.24em] uppercase text-muted/50">Visual Pending</span>
                              </div>
                            )}
                          </div>

                          {/* Content Section */}
                          <div className="flex flex-col p-5 flex-1 w-full">
                            <div className="flex items-center gap-3 mb-3">
                              <span className="font-mono text-[8px] uppercase tracking-[0.18em] text-muted border border-surface px-1.5 py-0.5 rounded-sm shrink-0">
                                {child.projectNumber || "Task"}
                              </span>
                              <h4 className="text-[13px] font-semibold tracking-tight uppercase group-hover:text-foreground transition-colors truncate">
                                {child.title}
                              </h4>
                            </div>
                            <p className="text-[12px] text-muted line-clamp-2 mb-5 leading-relaxed flex-1">
                              {child.description}
                            </p>
                            <div className="project-modal-text flex items-center gap-1.5 text-[9px] font-mono uppercase tracking-[0.22em] text-muted transition-colors mt-auto">
                              <span>view project</span>
                              <ArrowRight size={12} className="transition-transform group-hover:translate-x-1" />
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* If Normal Project or Child Detail -> Show details */}
              {!isCollection && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-16 pt-8 border-t border-surface">
                  
                  {/* Left Column (Main Content) */}
                  <div className="lg:col-span-2 space-y-10">
                    {((displayData as ProjectData).whyBuilt) && (
                      <div>
                        <h4 className="text-[9px] font-mono uppercase tracking-[0.24em] text-muted mb-4">
                          {"// Why I Built It"}
                        </h4>
                        <p className="text-[13px] leading-relaxed text-foreground/80">
                          {(displayData as ProjectData).whyBuilt}
                        </p>
                      </div>
                    )}
                    {((displayData as ProjectData).whatWorkedOn) && (
                      <div>
                        <h4 className="text-[9px] font-mono uppercase tracking-[0.24em] text-muted mb-4">
                          {"// What I Worked On"}
                        </h4>
                        <p className="text-[13px] leading-relaxed text-foreground/80">
                          {(displayData as ProjectData).whatWorkedOn}
                        </p>
                      </div>
                    )}
                    {displayData.outcome && (
                      <div>
                        <h4 className="text-[9px] font-mono uppercase tracking-[0.24em] text-muted mb-4">
                          {"// Outcome"}
                        </h4>
                        <p className="text-[13px] leading-relaxed text-foreground/80">
                          {displayData.outcome}
                        </p>
                      </div>
                    )}
                  </div>
                  
                  {/* Right Column (Meta Information) */}
                  <div className="space-y-10 border-t lg:border-t-0 border-surface pt-8 lg:pt-0">
                    
                    {displayData.technologies.length > 0 && (
                      <div>
                        <h4 className="text-[9px] font-mono uppercase tracking-[0.24em] text-muted mb-4">
                          Technologies
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {displayData.technologies.map((tech) => (
                            <span 
                              key={tech} 
                              className="text-[10px] font-mono px-2 py-1 rounded-sm border border-surface bg-surface/40 text-muted transition-colors hover:bg-surface"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {displayData.skills.length > 0 && (
                      <div>
                        <h4 className="text-[9px] font-mono uppercase tracking-[0.24em] text-muted mb-4">
                          Key Skills
                        </h4>
                        <ul className="space-y-3 border border-surface bg-surface/10 rounded-md p-4">
                          {displayData.skills.map((skill) => (
                            <li key={skill} className="flex items-start gap-2.5 text-[12px] text-muted">
                              <span 
                                className="mt-1.5 h-1 w-1 rounded-full shrink-0"
                                style={{ backgroundColor: 'color-mix(in srgb, var(--accent-projects) 60%, transparent)' }}
                              />
                              <span className="leading-relaxed">{skill}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                  </div>
                </div>
              )}

              {/* Bottom Spacer to ensure scroll doesn't cut off content */}
              <div className="h-8 w-full shrink-0"></div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}