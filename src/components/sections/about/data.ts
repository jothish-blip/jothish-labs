import { Certificate, ActiveCert } from "./types";

export const certifications: Certificate[] = [
  {
    id: "G01",
    courseNumber: 1,
    title: "Foundations of Cybersecurity",
    issuer: "Google",
    date: "March 2026",
    credentialId: "WMVGH5P4O31L",
    link: "https://www.coursera.org/account/accomplishments/verify/WMVGH5P4O31L",
    status: "verified",
    path: "/Certificates/GC1.pdf",
    skills: "Security Principles • Historical Attacks • Ethics"
  },
  {
    id: "G02",
    courseNumber: 2,
    title: "Play It Safe: Manage Security Risks",
    issuer: "Google",
    date: "March 2026",
    credentialId: "U10F6GR77NV3",
    link: "https://www.coursera.org/account/accomplishments/verify/U10F6GR77NV3",
    status: "verified",
    path: "/Certificates/GC2.pdf",
    skills: "CISSP Domains • Security Frameworks • Risk Management"
  },
  {
    id: "G03",
    courseNumber: 3,
    title: "Connect and Protect: Networks and Network Security",
    issuer: "Google",
    date: "April 2026",
    credentialId: "XPET9A8VTGAN",
    link: "https://www.coursera.org/account/accomplishments/verify/XPET9A8VTGAN",
    status: "verified",
    path: "/Certificates/GC3.pdf",
    skills: "OSI Model • TCP/IP • Cloud Security"
  },
  {
    id: "G04",
    courseNumber: 4,
    title: "Tools of the Trade: Linux and SQL",
    issuer: "Google",
    date: "May 2026",
    credentialId: "563X88VIAKFC",
    link: "https://www.coursera.org/account/accomplishments/verify/563X88VIAKFC",
    status: "verified",
    path: "/Certificates/GC4.pdf",
    skills: "Linux File Systems • Bash • SQL Queries",
    isLatest: true
  },
  {
    id: "G05",
    courseNumber: 5,
    title: "Assets, Threats, and Vulnerabilities",
    issuer: "Google",
    date: "In Progress • Est. May 18, 2026",
    credentialId: "—",
    link: "#",
    status: "in progress",
    path: "",
    skills: "Assets • Vulnerability Management • Threat Modeling"
  },
  {
    id: "G06",
    courseNumber: 6,
    title: "Sound the Alarm: Detection and Response",
    issuer: "Google",
    date: "Upcoming",
    credentialId: "—",
    link: "#",
    status: "upcoming",
    path: "",
    skills: "SIEM • Incident Response • Packet Analysis"
  },
  {
    id: "G07",
    courseNumber: 7,
    title: "Automate Cybersecurity Tasks with Python",
    issuer: "Google",
    date: "Upcoming",
    credentialId: "—",
    link: "#",
    status: "upcoming",
    path: "",
    skills: "Python Syntax • Automation Scripts • API Interaction"
  }
];

export const activeCerts: ActiveCert[] = [
  {
    id: "C01",
    title: "CompTIA Security+",
    progress: 45,
    tag: "Core Security",
    skills: "Threat Detection, Risk Management, Incident Response"
  },
  {
    id: "C02",
    title: "CompTIA Linux+",
    progress: 35,
    tag: "System Security",
    skills: "Linux Hardening, Permissions, Process Monitoring"
  }
];