import { allProjects } from "./projects";
import { allSkills, skillDomains } from "./skills";
import { googleSpecializations, activeCerts } from "./about";
import { 
  ProjectData, 
  SkillItem, 
  ResolvedSkillItem, 
  ResolvedSkillDomain,
  CertificationData
} from "./types";

// ==========================================
// RELATIONSHIP RESOLVERS
// ==========================================

export function getProjectByNumber(num: string) {
  return allProjects.find(p => p.projectNumber === num);
}

export function getProjectById(id: string) {
  return allProjects.find(p => p.id === id);
}

export function getSkillById(id: string) {
  return allSkills.find(s => s.id.toLowerCase() === id.toLowerCase() || s.name.toLowerCase() === id.toLowerCase());
}

export function getSkillsForProject(project: { skills: string[]; technologies: string[] }): SkillItem[] {
  const projectSkillIds = new Set([...project.skills, ...project.technologies].map(s => s.toLowerCase()));
  return allSkills.filter(skill => projectSkillIds.has(skill.id.toLowerCase()) || projectSkillIds.has(skill.name.toLowerCase()));
}

export function getProjectsForSkill(skill: SkillItem): ProjectData[] {
  const skillNameLower = skill.name.toLowerCase();
  const skillIdLower = skill.id.toLowerCase();
  
  return allProjects.filter(project => {
    const projSkills = [...project.skills, ...project.technologies].map(s => s.toLowerCase());
    return projSkills.includes(skillNameLower) || projSkills.includes(skillIdLower);
  });
}

export function getCertificationsForSkill(skill: SkillItem): CertificationData[] {
  const skillNameLower = skill.name.toLowerCase();
  const skillIdLower = skill.id.toLowerCase();
  
  return googleSpecializations.filter(cert => {
    const certSkills = [
      ...(cert.highlights || []),
      ...(cert.professionalCertificate?.coreTechnologies || []),
      ...(cert.professionalCertificate?.professionalSkills || [])
    ].map(s => s.toLowerCase());
    
    // Also check individual courses
    const courseSkills = cert.courses.flatMap(c => c.skills).map(s => s.toLowerCase());
    
    return certSkills.includes(skillNameLower) || certSkills.includes(skillIdLower) ||
           courseSkills.includes(skillNameLower) || courseSkills.includes(skillIdLower);
  });
}

export function getRelatedProjects(project: { id: string; skills: string[]; technologies: string[] }): ProjectData[] {
  const projectSkills = getSkillsForProject(project);
  const related = new Set<ProjectData>();
  
  projectSkills.forEach(skill => {
    const projs = getProjectsForSkill(skill);
    projs.forEach(p => {
      if (p.id !== project.id) related.add(p);
    });
  });
  
  return Array.from(related).slice(0, 3);
}

// ==========================================
// MEMOIZED RESOLVED GRAPH
// ==========================================

export const resolvedSkills: ResolvedSkillItem[] = allSkills.map(skill => ({
  ...skill,
  relatedProjects: getProjectsForSkill(skill),
  relatedCertifications: getCertificationsForSkill(skill)
}));

export const resolvedSkillDomains: ResolvedSkillDomain[] = skillDomains.map(domain => {
  const coreSkillItems = domain.coreSkills.map(skillId => {
    return resolvedSkills.find(s => s.id === skillId || s.name === skillId) || {
      id: skillId, name: skillId, relatedProjects: [], relatedCertifications: []
    };
  });
  
  const techSkillItems = domain.technologies.map(techId => {
    return resolvedSkills.find(s => s.id === techId || s.name === techId) || {
      id: techId, name: techId, relatedProjects: [], relatedCertifications: []
    };
  });
  
  return {
    ...domain,
    resolvedCoreSkills: coreSkillItems,
    resolvedTechnologies: techSkillItems
  };
});

// ==========================================
// SEARCH ENGINE
// ==========================================

export function searchKnowledgeGraph(query: string) {
  const q = query.toLowerCase();
  
  const projects = allProjects.filter(p => 
    p.title.toLowerCase().includes(q) || 
    p.description.toLowerCase().includes(q) ||
    p.category.toLowerCase().includes(q) ||
    p.skills.some(s => s.toLowerCase().includes(q)) ||
    p.technologies.some(s => s.toLowerCase().includes(q))
  );

  const skills = resolvedSkills.filter(s => 
    s.name.toLowerCase().includes(q) || 
    s.id.toLowerCase().includes(q)
  );

  const certs = googleSpecializations.filter(c => 
    c.title.toLowerCase().includes(q) || 
    c.shortDescription.toLowerCase().includes(q) ||
    c.highlights.some(h => h.toLowerCase().includes(q))
  );

  return {
    projects,
    skills,
    certs
  };
}

export { allProjects as projects, allSkills as skills, skillDomains, googleSpecializations, activeCerts };
