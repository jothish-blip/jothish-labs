export interface SkillItem {
  name: string;
  logo?: string; // Path to public/logos/ file (e.g. "/logos/python.svg")
  icon?: React.ComponentType<{ size?: string | number; className?: string }>;
  status?: string; // e.g. "Learning", "Certified"
  
  // Future proofing fields as requested by user
  certificationRef?: string;
  projectRef?: string;
  experienceRef?: string;
  docLink?: string;
}

export interface SkillDomain {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ size?: string | number; className?: string }>;
  coreSkills: string[];
  technologies: SkillItem[];
}
