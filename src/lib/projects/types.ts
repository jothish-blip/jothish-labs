export interface ProjectImages {
  cover?: string;
  gallery?: string[];
}

export interface ProjectData {
  id: string;
  projectNumber: string;
  title: string;
  description: string;
  image?: string; // Legacy support
  images?: ProjectImages;
  imageAlt?: string;
  category: string;
  status: string; // Meaningful labels like 'Case Study', 'Security Audit', 'Detection Lab'
  technologies: string[];
  skills: string[];
  githubUrl?: string;
  readmeUrl?: string;
  featured: boolean;
  childProjects?: ChildProjectData[];
  
  // Specific details for the workspace view
  whyBuilt?: string;
  whatWorkedOn?: string;
  outcome?: string;
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