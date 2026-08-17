import { ProjectData } from "@/lib/projects/types";
import { ArrowRight, ShieldAlert, Code2, Network, Search, Archive } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";

interface Props {
  project: ProjectData;
  onOpen: (project: ProjectData) => void;
}

export default function ProjectCard({ project, onOpen }: Props) {
  // Try to use the new images object, fallback to legacy image
  const coverImage = project.images?.cover || project.image;
  
  const getStatusIcon = (status: string) => {
    switch(status.toLowerCase()) {
      case 'security audit': return <ShieldAlert size={10} />;
      case 'automation': return <Code2 size={10} />;
      case 'network analysis': return <Network size={10} />;
      case 'detection lab': return <Search size={10} />;
      case 'collection': return <Archive size={10} />;
      default: return null;
    }
  };

  return (
    <>
      <style>{`
        .project-card-${project.id}:hover {
          border-color: color-mix(in srgb, var(--accent-projects) 40%, transparent) !important;
          background-color: var(--surface) !important;
        }
        .project-card-${project.id}:hover .project-action-text {
          color: var(--accent-projects) !important;
        }
      `}</style>

      <motion.button
        whileTap={{ scale: 0.99 }}
        onClick={() => onOpen(project)}
        className={`project-card-${project.id} group relative flex w-full flex-col text-left overflow-hidden border border-surface bg-background rounded-md transition-all duration-300`}
      >
        {/* Project Cover Image (Full Color always visible on mobile & desktop) */}
        <div className="relative h-44 w-full overflow-hidden border-b border-surface bg-surface/20 shrink-0">
          {coverImage ? (
            <Image 
              src={coverImage} 
              alt={project.imageAlt || project.title}
              fill
              className="object-cover group-hover:scale-[1.02] transition-transform duration-700" // Grayscale filters removed completely
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-muted/30">
              <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(circle,currentColor_1px,transparent_1px)] bg-[size:16px_16px]" />
              <ShieldAlert size={20} className="mb-3 opacity-40" />
              <span className="font-mono text-[9px] tracking-[0.24em] uppercase text-muted/50">Visual Pending</span>
            </div>
          )}
        </div>

        {/* Project Content */}
        <div className="flex flex-col flex-1 p-5 lg:p-6 w-full">
          
          {/* Top Section */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[9px] font-mono uppercase tracking-[0.24em] text-muted mb-2">
                {project.projectNumber || "Project"}
              </p>
              <h4 className="text-[15px] font-semibold tracking-tight uppercase text-foreground leading-snug line-clamp-1 pr-2">
                {project.title}
              </h4>
            </div>
            
            <span className="shrink-0 flex items-center gap-1.5 text-[8px] font-mono uppercase tracking-[0.18em] px-2 py-1 rounded-sm border border-surface-strong bg-surface/40 text-muted transition-colors group-hover:bg-background group-hover:text-foreground">
              {getStatusIcon(project.status)}
              {project.status}
            </span>
          </div>

          {/* Description */}
          <p className="mt-3 text-[12px] leading-relaxed text-muted line-clamp-2">
            {project.description}
          </p>

          {/* Divider */}
          <div className="mt-5 h-px w-full bg-surface" />

          {/* Technology Chips */}
          <div className="mt-5 mb-2 flex-1">
            <p className="text-[9px] font-mono uppercase tracking-[0.24em] text-muted mb-3">
              Core Technologies
            </p>
            <div className="flex flex-wrap gap-2">
              {project.technologies.slice(0, 3).map((tech) => (
                <span 
                  key={tech} 
                  className="text-[10px] font-mono px-2 py-1 rounded-sm border border-surface bg-surface/40 text-muted transition-colors group-hover:bg-background"
                >
                  {tech}
                </span>
              ))}
              {project.technologies.length > 3 && (
                <span className="text-[10px] font-mono px-2 py-1 text-muted flex items-center">
                  +{project.technologies.length - 3}
                </span>
              )}
            </div>
          </div>

          {/* Bottom Actions Row */}
          <div className="mt-6 pt-4 border-t border-surface flex items-center justify-between">
            
            {/* GitHub Link (Stop propagation so clicking it doesn't open the modal) */}
            {project.githubUrl ? (
              <a 
                href={project.githubUrl}
                target="_blank"
                rel="noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="relative z-10 flex items-center gap-1.5 text-[9px] font-mono uppercase tracking-[0.24em] text-muted hover:text-foreground transition-colors p-1 -ml-1"
              >
                <Code2 size={12} />
                GitHub
              </a>
            ) : (
              <p className="text-[10px] font-mono uppercase tracking-[0.22em] text-muted">
                Case Study
              </p>
            )}

            {/* View Details CTA */}
            <div className="relative z-10 flex items-center gap-1.5 text-[9px] font-mono uppercase tracking-[0.22em] text-muted transition-colors duration-300 project-action-text">
              <span>view details</span>
              <ArrowRight size={12} className="transition-transform duration-300 group-hover:translate-x-1" />
            </div>
            
          </div>
        </div>
      </motion.button>
    </>
  );
}