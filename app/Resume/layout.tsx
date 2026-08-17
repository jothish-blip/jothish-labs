import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Resume | Jothish Gandham",
  description: "Cybersecurity portfolio resume for Jothish Gandham. View technical skills, SOC operations, SIEM projects, and certifications.",
};

export default function ResumeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
