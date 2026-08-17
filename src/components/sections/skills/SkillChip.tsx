import { SkillItem } from "./types";
import SkillLogo from "./SkillLogo";

interface Props {
  skill: SkillItem;
}

export default function SkillChip({ skill }: Props) {
  return (
    <div className="skill-chip group flex items-center gap-2.5 rounded-sm border border-surface bg-surface/20 px-3 py-2 transition-all duration-300 ease-out cursor-default">
      <SkillLogo 
        logo={skill.logo} 
        icon={skill.icon} 
        size={16} 
        className="text-foreground/80 grayscale opacity-70 transition-all duration-300 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-110" 
      />
      <span className="skill-text font-mono text-[10px] uppercase tracking-[0.15em] text-muted transition-colors duration-300 mt-0.5">
        {skill.name}
      </span>
      
      {skill.status && (
        <span className="ml-1 text-[8px] font-mono px-1.5 py-0.5 rounded-sm border border-surface bg-background text-muted uppercase tracking-widest mt-0.5 opacity-60">
          {skill.status}
        </span>
      )}
    </div>
  );
}