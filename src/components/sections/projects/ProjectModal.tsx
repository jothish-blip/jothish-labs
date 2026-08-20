"use client";

import { useState, useEffect, useRef } from "react";
import { ProjectData, ChildProjectData } from "@/lib/projects/types";
import { projects } from "@/lib/projects/projectData";
import { X, ArrowLeft, ExternalLink, ArrowRight, ShieldAlert, Code2, Check, Clock, User, Briefcase } from "lucide-react";
import Image from "next/image";
import { useScrollLock } from "@/hooks/useScrollLock";
import { trackEvent, TELEMETRY_EVENTS } from "@/lib/telemetry/events";
import { motion, useScroll, useSpring } from "framer-motion";

interface Props {
  project: ProjectData;
  onClose: () => void;
}

const customScrollbar = "[&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-sm [&::-webkit-scrollbar-thumb]:bg-surface-strong [&::-webkit-scrollbar-track]:bg-transparent hover:[&::-webkit-scrollbar-thumb]:bg-muted/50";

export default function ProjectModal({ project, onClose }: Props) {
  const [activeChild, setActiveChild] = useState<ChildProjectData | null>(null);
  const [isHeaderSticky, setIsHeaderSticky] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({ container: scrollRef });
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  useScrollLock(true);

  // Telemetry
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
        if (activeChild) setActiveChild(null);
        else onClose();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [activeChild, onClose]);

  // Scroll Listener for Sticky Header
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const handleScroll = () => {
      // Show sticky header when scrolled past hero (approx 300px)
      setIsHeaderSticky(el.scrollTop > 300);
    };
    el.addEventListener("scroll", handleScroll);
    return () => el.removeEventListener("scroll", handleScroll);
  }, []);

  // Determine what data to display
  const displayData = activeChild || project;
  const isCollection = project.childProjects && project.childProjects.length > 0 && !activeChild;
  const coverImage = displayData.images?.cover || displayData.image;

  // Next / Previous Project Logic
  const currentIndex = projects.findIndex(p => p.id === project.id);
  const nextProject = currentIndex < projects.length - 1 ? projects[currentIndex + 1] : null;
  const prevProject = currentIndex > 0 ? projects[currentIndex - 1] : null;

  const navigateTo = (targetProject: ProjectData) => {
    setActiveChild(null);
    scrollRef.current?.scrollTo({ top: 0, behavior: 'auto' });
    
    // Update URL silently
    const url = new URL(window.location.href);
    url.searchParams.set("project", targetProject.id);
    window.history.pushState({}, "", url.toString());

    // We must mimic changing the parent state. Since we are inside the modal, 
    // ideally the parent handles navigation, but we can force a reload via window event 
    // or rely on a wrapper. For simplicity in a closed component, we just trigger the URL.
    // Assuming the parent component listens to pushState changes (which it does via useEffect).
    window.dispatchEvent(new Event("popstate"));
  };

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
        .project-btn-primary {
          background-color: var(--accent-projects);
          color: white !important;
        }
        .project-btn-primary:hover {
          box-shadow: 0 4px 15px color-mix(in srgb, var(--accent-projects) 40%, transparent);
          transform: translateY(-1px);
        }
      `}</style>

      <div className="fixed inset-0 z-[99999] flex items-center justify-center p-0 sm:p-6 bg-background/90 backdrop-blur-md">
        
        {/* Modal Container */}
        <div className="relative flex flex-col w-full max-w-5xl h-[100dvh] sm:h-[90vh] bg-background border-0 sm:border border-surface sm:rounded-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
          
          {/* 4. READING PROGRESS BAR */}
          <motion.div 
            className="absolute top-0 left-0 right-0 h-1 z-50 origin-left"
            style={{ backgroundColor: 'var(--accent-projects)', scaleX }}
          />

          {/* MAIN HEADER (Top Bar) */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-surface bg-background shrink-0 z-40 relative">
            <div className="flex items-center gap-4">
              {activeChild ? (
                <button 
                  onClick={() => setActiveChild(null)}
                  className="flex items-center gap-2 text-[9px] font-mono tracking-[0.24em] uppercase text-muted hover:text-foreground transition-colors"
                >
                  <ArrowLeft size={12} /> Back to Collection
                </button>
              ) : (
                <span className="font-mono text-[9px] tracking-[0.24em] uppercase" style={{ color: 'var(--accent-projects)' }}>
                  {isCollection ? "Project Collection" : "Case Study"}
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

          {/* 1. STICKY PROJECT HEADER (Appears on scroll) */}
          <div 
            className={`absolute top-[53px] left-0 right-0 bg-background/95 backdrop-blur-md border-b border-surface px-6 py-3 z-30 flex items-center justify-between transition-all duration-300 ${isHeaderSticky ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0 pointer-events-none"}`}
          >
            <h3 className="text-sm font-semibold uppercase tracking-tight text-foreground truncate max-w-[50%]">
              {displayData.title}
            </h3>
            <div className="flex items-center gap-3">
              {displayData.githubUrl && (
                <a 
                  href={displayData.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="hidden sm:flex text-[9px] font-mono uppercase tracking-widest text-muted hover:text-foreground transition-colors"
                >
                  GitHub
                </a>
              )}
              {displayData.readmeUrl && (
                <a 
                  href={displayData.readmeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="project-btn-primary px-4 py-1.5 rounded-sm text-[9px] font-mono uppercase tracking-[0.2em] transition-all"
                >
                  View Case Study
                </a>
              )}
            </div>
          </div>

          {/* Scrollable Body */}
          <div ref={scrollRef} className={`flex-1 overflow-y-auto overflow-x-hidden ${customScrollbar} relative`}>
            
            {/* Hero Banner */}
            <div className="relative w-full aspect-[16/9] sm:aspect-[21/9] lg:aspect-[2.5/1] bg-surface/20 border-b border-surface overflow-hidden">
              {coverImage ? (
                <Image 
                  src={coverImage} 
                  alt={displayData.imageAlt || displayData.title}
                  fill
                  className="object-cover transition-transform duration-700 hover:scale-105"
                  priority
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-muted/30">
                  <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(circle,currentColor_1px,transparent_1px)] bg-[size:20px_20px]" />
                  <ShieldAlert size={32} className="mb-3 opacity-40" />
                  <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-muted/50">Visual Pending</span>
                </div>
              )}
              
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
              
              {/* 14. IMAGE CONTROLS / OVERLAYS */}
              <div className="absolute top-6 left-6 px-3 py-1 bg-background/80 backdrop-blur-md border border-surface rounded-sm">
                <span className="font-mono text-[9px] tracking-widest uppercase text-foreground">
                  {displayData.projectNumber || "Project"}
                </span>
              </div>
              <div className="absolute top-6 right-6 px-3 py-1 bg-background/80 backdrop-blur-md border border-surface rounded-sm" style={{ color: 'var(--accent-projects)' }}>
                <span className="font-mono text-[9px] tracking-widest uppercase flex items-center gap-1.5 font-semibold">
                  <span className="w-1 h-1 rounded-full bg-current"></span> {'status' in displayData ? String(displayData.status) : 'Sub-Project'}
                </span>
              </div>
              
              <div className="absolute bottom-6 left-6 right-6 lg:bottom-10 lg:left-10 z-10">
                <motion.h2 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight uppercase text-foreground leading-[1.1]"
                >
                  {displayData.title}
                </motion.h2>
              </div>
            </div>

            {/* Content Container */}
            <div className="p-6 sm:p-10 lg:p-12 max-w-5xl mx-auto">
              
              {/* Description & 3. BETTER CTA HIERARCHY */}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start justify-between">
                <p className="text-[14px] sm:text-[15px] text-muted leading-relaxed max-w-2xl flex-1">
                  {displayData.description}
                </p>
                <div className="flex flex-col gap-3 shrink-0 w-full sm:w-auto">
                  {displayData.readmeUrl && (
                    <a 
                      href={displayData.readmeUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="project-btn-primary inline-flex items-center justify-center gap-2 px-6 py-3 rounded-sm text-[10px] font-mono uppercase tracking-[0.24em] transition-all"
                    >
                      Read Case Study <ExternalLink size={12} />
                    </a>
                  )}
                  {displayData.githubUrl && (
                    <a 
                      href={displayData.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-surface bg-surface/10 hover:bg-surface text-foreground rounded-sm text-[10px] font-mono uppercase tracking-[0.24em] transition-all"
                    >
                      <Code2 size={12} /> View on GitHub
                    </a>
                  )}
                </div>
              </motion.div>

              {/* 2. QUICK FACTS ROW */}
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="grid grid-cols-2 md:grid-cols-4 gap-6 py-10 mt-10 border-y border-surface">
                <div className="space-y-1">
                  <p className="font-mono text-[9px] uppercase tracking-widest text-muted flex items-center gap-1.5"><Clock size={10}/> Status</p>
                  <p className="text-[13px] font-medium text-foreground">{String('status' in displayData ? displayData.status : 'Sub-Project')}</p>
                </div>
                <div className="space-y-1">
                  <p className="font-mono text-[9px] uppercase tracking-widest text-muted flex items-center gap-1.5"><Briefcase size={10}/> Role</p>
                  <p className="text-[13px] font-medium text-foreground">Security Engineer</p>
                </div>
                <div className="space-y-1">
                  <p className="font-mono text-[9px] uppercase tracking-widest text-muted flex items-center gap-1.5"><User size={10}/> Type</p>
                  <p className="text-[13px] font-medium text-foreground">Independent Project</p>
                </div>
                <div className="space-y-1">
                  <p className="font-mono text-[9px] uppercase tracking-widest text-muted flex items-center gap-1.5"><Code2 size={10}/> Core Tech</p>
                  <p className="text-[13px] font-medium text-foreground truncate">{displayData.technologies[0] || "Multiple"}</p>
                </div>
              </motion.div>

              {/* If Collection -> Show Child Projects list */}
              {isCollection && project.childProjects && (
                <div className="space-y-8 mt-12">
                  <div>
                    <h3 className="text-[12px] font-mono uppercase tracking-[0.24em] text-foreground flex items-center gap-2 mb-2">
                      <span className="w-1.5 h-1.5 bg-surface-strong rounded-full"></span> Collection Includes
                    </h3>
                    <p className="text-[13px] text-muted">{project.childProjects.length} distinct laboratory environments and automated scripts.</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {project.childProjects.map((child) => (
                      <button 
                        key={child.id}
                        onClick={() => setActiveChild(child)}
                        className="project-modal-hover group flex flex-col text-left p-6 border border-surface rounded-md bg-background transition-all duration-300"
                      >
                        <div className="flex items-center gap-3 mb-4">
                          <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted border border-surface bg-surface/30 px-2 py-1 rounded-sm">
                            {child.projectNumber}
                          </span>
                          <h4 className="text-[14px] font-semibold tracking-tight uppercase group-hover:text-foreground transition-colors truncate">
                            {child.title}
                          </h4>
                        </div>
                        <p className="text-[13px] text-muted line-clamp-2 mb-6 leading-relaxed flex-1">
                          {child.description}
                        </p>
                        <div className="project-modal-text flex items-center gap-1.5 text-[9px] font-mono uppercase tracking-[0.22em] text-muted transition-colors mt-auto font-semibold">
                          <span>Explore Project</span>
                          <ArrowRight size={12} className="transition-transform group-hover:translate-x-1" />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* If Normal Project or Child Detail -> Show details */}
              {!isCollection && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mt-16">
                  
                  {/* Left Column (Main Editorial Content) */}
                  <div className="lg:col-span-8 space-y-16">
                    
                    {/* 5. BETTER SECTION DIVIDERS & 18. ACCENT LINE */}
                    {((displayData as ProjectData).whyBuilt) && (
                      <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="relative pl-6">
                        <div className="absolute left-0 top-0 bottom-0 w-[2px]" style={{ backgroundColor: 'var(--accent-projects)' }}></div>
                        <h4 className="flex items-center gap-3 text-[10px] font-mono uppercase tracking-[0.24em] text-muted mb-6">
                          <span className="font-bold text-foreground">01</span> Why I Built It
                        </h4>
                        <p className="text-[14px] leading-[1.8] text-foreground/80">
                          {(displayData as ProjectData).whyBuilt}
                        </p>
                      </motion.div>
                    )}

                    {((displayData as ProjectData).whatWorkedOn) && (
                      <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="relative pl-6">
                        <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-surface-strong"></div>
                        <h4 className="flex items-center gap-3 text-[10px] font-mono uppercase tracking-[0.24em] text-muted mb-6">
                          <span className="font-bold text-foreground">02</span> Technical Implementation
                        </h4>
                        <p className="text-[14px] leading-[1.8] text-foreground/80">
                          {(displayData as ProjectData).whatWorkedOn}
                        </p>
                      </motion.div>
                    )}

                    {/* 8. HIGHLIGHT ONE SENTENCE */}
                    {displayData.outcome && (
                      <motion.div initial={{ opacity: 0, scale: 0.98 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="border border-surface bg-surface/10 p-6 md:p-8 rounded-sm my-12 text-center relative overflow-hidden">
                        <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(circle,currentColor_1px,transparent_1px)] bg-[size:16px_16px]"></div>
                        <h4 className="text-[9px] font-mono uppercase tracking-[0.24em] text-muted mb-4">Key Takeaway</h4>
                        <p className="text-[16px] md:text-[18px] font-semibold text-foreground leading-relaxed max-w-2xl mx-auto">
                          "{displayData.outcome}"
                        </p>
                      </motion.div>
                    )}
                  </div>
                  
                  {/* Right Column (Meta Information & Sidebar) */}
                  <div className="lg:col-span-4 space-y-12">
                    
                    {displayData.technologies.length > 0 && (
                      <div className="bg-background border border-surface p-6 rounded-sm">
                        <h4 className="text-[10px] font-mono uppercase tracking-[0.24em] text-foreground mb-5 flex items-center gap-2">
                          <Layers size={12}/> Technologies
                        </h4>
                        <div className="flex flex-col gap-2">
                          {displayData.technologies.map((tech) => (
                            <span 
                              key={tech} 
                              className="text-[11px] font-mono px-3 py-2 rounded-sm border border-surface bg-surface/20 text-muted transition-colors hover:bg-surface/50 hover:text-foreground w-full"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 7. BETTER SKILLS LIST */}
                    {displayData.skills.length > 0 && (
                      <div>
                        <h4 className="text-[10px] font-mono uppercase tracking-[0.24em] text-muted mb-5 border-b border-surface pb-3">
                          Acquired Skills
                        </h4>
                        <ul className="space-y-3.5">
                          {displayData.skills.map((skill) => (
                            <li key={skill} className="flex items-start gap-3 text-[13px] text-foreground/80 font-medium">
                              <Check size={14} style={{ color: 'var(--accent-projects)' }} className="shrink-0 mt-0.5" />
                              <span className="leading-relaxed">{skill}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                  </div>
                </div>
              )}

              {/* 13 & 15. BETTER FOOTER & NEXT/PREV NAVIGATION */}
              {!activeChild && (
                <div className="mt-24 pt-12 border-t border-surface flex flex-col items-center">
                  <p className="text-[13px] text-muted mb-8 text-center italic">Thanks for reading this case study.</p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl">
                    {prevProject ? (
                      <button 
                        onClick={() => navigateTo(prevProject)}
                        className="group flex flex-col text-left p-5 border border-surface rounded-sm hover:border-surface-strong transition-colors"
                      >
                        <span className="text-[9px] font-mono uppercase tracking-widest text-muted mb-2 flex items-center gap-1.5"><ArrowLeft size={10}/> Previous</span>
                        <span className="text-[13px] font-semibold text-foreground uppercase truncate w-full">{prevProject.title}</span>
                      </button>
                    ) : <div className="hidden sm:block"></div>}

                    {nextProject ? (
                      <button 
                        onClick={() => navigateTo(nextProject)}
                        className="group flex flex-col text-right items-end p-5 border border-surface rounded-sm hover:border-surface-strong transition-colors"
                      >
                        <span className="text-[9px] font-mono uppercase tracking-widest text-muted mb-2 flex items-center gap-1.5">Next <ArrowRight size={10}/></span>
                        <span className="text-[13px] font-semibold text-foreground uppercase truncate w-full">{nextProject.title}</span>
                      </button>
                    ) : <div className="hidden sm:block"></div>}
                  </div>
                </div>
              )}

            </div>
          </div>

        </div>
      </div>
    </>
  );
}

// Ensure missing icons are available
function Layers({ size = 24, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
      <polyline points="2 12 12 17 22 12"></polyline>
      <polyline points="2 17 12 22 22 17"></polyline>
    </svg>
  );
}