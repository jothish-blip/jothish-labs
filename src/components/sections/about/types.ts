export interface CourseCertificate {
  id: string;
  title: string;
  description: string;
  image: string;
  credentialUrl: string;
  issuedDate: string;
  skills: string[];
  takeaways: string[];
}

export interface CredlyBadge {
  image: string;
  badgeUrl: string;
  issuedDate: string;
  explanation: string;
}

export interface ProfessionalCertificate {
  image: string;
  credentialUrl: string;
  issuedDate: string;
  overview: string;
  learningOutcomes: string[];
  coreTechnologies: string[];
  professionalSkills: string[];
  careerRelevance: string;
}

export interface GoogleSpecialization {
  id: string;
  slug: string;
  title: string;
  provider: "Google";
  shortDescription: string;
  status: string;
  progress: number;
  courseCount: number;
  duration: string;
  accent: string;
  highlights: string[];
  professionalCertificate: ProfessionalCertificate;
  credlyBadge: CredlyBadge;
  courses: CourseCertificate[];
}