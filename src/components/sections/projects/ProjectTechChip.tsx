import SkillLogo from "../skills/SkillLogo";

export default function ProjectTechChip({ tech }: { tech: string }) {
  // Attempt to map the technology name to a logo file
  const logoPath = `/logos/${tech.toLowerCase().replace(/\s+/g, "-")}.svg`;
  
  return (
    <div className="group/chip flex items-center gap-1.5 rounded-sm border border-surface bg-surface/20 px-2 py-1 transition-colors hover:border-surface-strong hover:bg-surface/40">
      <SkillLogo 
        logo={logoPath} 
        size={12} 
        className="opacity-70 grayscale transition-all group-hover/chip:grayscale-0 group-hover/chip:opacity-100" 
      />
      <span className="font-mono text-[10px] uppercase tracking-widest text-muted transition-colors group-hover/chip:text-foreground">
        {tech}
      </span>
    </div>
  );
}
