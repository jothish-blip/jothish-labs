import React from "react";

export interface ProjectImages {
  cover?: string;
  gallery?: string[];
}

export interface ChildProjectData {
  id: string;
  projectNumber: string;
  title: string;
  description: string;
  image?: string;
  images?: ProjectImages;
  imageAlt?: string;
  technologies: string[];
  skills: string[];
  outcome?: string;
  githubUrl?: string;
  readmeUrl?: string;
}

export interface ProjectData {
  id: string;
  projectNumber: string;
  title: string;
  description: string;
  image?: string;
  images?: ProjectImages;
  imageAlt?: string;
  category: string;
  status: string; 
  technologies: string[];
  skills: string[];
  githubUrl?: string;
  readmeUrl?: string;
  featured: boolean;
  childProjects?: ChildProjectData[];
  whyBuilt?: string;
  whatWorkedOn?: string;
  outcome?: string;
}

export interface SkillItem {
  id: string; // The primary key
  name: string;
  logo?: string; 
  icon?: React.ComponentType<{ size?: string | number; className?: string }>;
  status?: string; 
}

export interface SkillDomain {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ size?: string | number; className?: string }>;
  coreSkills: string[]; // references skill ids
  technologies: string[]; // references skill ids
}

export interface CourseData {
  id: string;
  title: string;
  description: string;
  image: string;
  credentialUrl: string;
  issuedDate: string;
  skills: string[];
  takeaways: string[];
}

export interface CertificationData {
  id: string;
  slug: string;
  provider: string;
  title: string;
  shortDescription: string;
  status: string;
  progress: number;
  courseCount: number;
  duration: string;
  accent: string;
  highlights: string[];
  professionalCertificate: {
    image: string;
    credentialUrl: string;
    issuedDate: string;
    overview: string;
    learningOutcomes: string[];
    coreTechnologies: string[];
    professionalSkills: string[];
    careerRelevance: string;
  };
  credlyBadge?: {
    image: string;
    badgeUrl: string;
    issuedDate: string;
    explanation: string;
  };
  courses: CourseData[];
}

export interface ActiveCertData {
  id: string;
  title: string;
  skills: string;
  progress: number;
}

export interface ResolvedSkillItem extends SkillItem {
  relatedProjects: ProjectData[];
  relatedCertifications: CertificationData[];
}

export interface ResolvedSkillDomain extends SkillDomain {
  resolvedCoreSkills: ResolvedSkillItem[];
  resolvedTechnologies: ResolvedSkillItem[];
}
