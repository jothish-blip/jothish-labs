export type Certificate = {
  id: string;
  courseNumber: number;
  title: string;
  issuer: string;
  date: string;
  credentialId: string;
  link: string;
  status: "verified" | "in progress" | "upcoming";
  path: string;
  skills: string;
  isLatest?: boolean;
};

export type ActiveCert = {
  id: string;
  title: string;
  progress: number;
  tag: string;
  skills: string;
};