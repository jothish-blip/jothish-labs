import { SkillDomain } from "./types";
import { 
  ShieldAlert, 
  Network, 
  Terminal, 
  Code, 
  Lock, 
  Search, 
  Wrench,
  Server,
  FileSearch,
  Cpu,
  Database,
  Activity
} from "lucide-react";

export const skillDomains: SkillDomain[] = [
  {
    id: "domain-soc",
    title: "Security Operations (SOC)",
    description: "Monitoring, detecting, and responding to security incidents within an enterprise environment.",
    icon: ShieldAlert,
    coreSkills: [
      "Security Operations",
      "SIEM",
      "Log Analysis",
      "Alert Investigation",
      "Incident Response",
      "Threat Detection",
      "IOC Analysis",
      "Security Monitoring"
    ],
    technologies: [
      { name: "Splunk", logo: "/logos/splunk.png", icon: Activity },
      { name: "Google Chronicle", logo: "/logos/chronicle.png", icon: Search },
      { name: "Microsoft Sentinel", logo: "/logos/sentinel.png", icon: ShieldAlert },
      { name: "Wazuh", logo: "/logos/wazuh-1.png", icon: Server },
      { name: "EDR Concepts", icon: ShieldAlert }
    ]
  },
  {
    id: "domain-network",
    title: "Network Security",
    description: "Analyzing network traffic, securing communications, and monitoring for anomalies.",
    icon: Network,
    coreSkills: [
      "TCP/IP",
      "DNS",
      "HTTP / HTTPS",
      "Routing",
      "Firewalls",
      "Network Monitoring",
      "Packet Analysis"
    ],
    technologies: [
      { name: "Wireshark", logo: "/logos/wireshark.png", icon: Network },
      { name: "Nmap", logo: "/logos/nmap-2.png", icon: Search }
    ]
  },
  {
    id: "domain-os",
    title: "Operating Systems",
    description: "Securing, administrating, and navigating core operating system environments.",
    icon: Terminal,
    coreSkills: [
      "Linux",
      "Windows",
      "Bash",
      "Command Line",
      "File Permissions",
      "User Management",
      "Process Management"
    ],
    technologies: [
      { name: "Linux", logo: "/logos/linux.png", icon: Terminal },
      { name: "Windows", logo: "/logos/windows.png", icon: Cpu }
    ]
  },
  {
    id: "domain-prog",
    title: "Programming & Scripting",
    description: "Automating security workflows and manipulating data with scripting languages.",
    icon: Code,
    coreSkills: [],
    technologies: [
      { name: "Python", logo: "/logos/python.png", icon: Code },
      { name: "SQL", logo: "/logos/sql-1.png", icon: Database }
    ]
  },
  {
    id: "domain-fundamentals",
    title: "Security Fundamentals",
    description: "Core principles of information security and organizational defense.",
    icon: Lock,
    coreSkills: [
      "CIA Triad",
      "Risk Assessment",
      "Vulnerability Assessment",
      "Authentication",
      "Authorization",
      "Identity & Access Management",
      "Security Policies",
      "Compliance Fundamentals"
    ],
    technologies: []
  },
  {
    id: "domain-dfir",
    title: "Digital Forensics & Threat Intelligence",
    description: "Investigating breaches and tracking threat actor behavior.",
    icon: FileSearch,
    coreSkills: [
      "Threat Intelligence",
      "Digital Forensics",
      "IOC Analysis",
      "Threat Hunting",
      "Malware Fundamentals",
      "MITRE ATT&CK"
    ],
    technologies: []
  },
  {
    id: "domain-tools",
    title: "Security Tools",
    description: "Practical toolkit used for active defense and investigation.",
    icon: Wrench,
    coreSkills: [],
    technologies: [
      { name: "Splunk", logo: "/logos/splunk.png", icon: Activity },
      { name: "Google Chronicle", logo: "/logos/chronicle.png", icon: Search },
      { name: "Microsoft Sentinel", logo: "/logos/sentinel.png", icon: ShieldAlert },
      { name: "Wazuh", logo: "/logos/wazuh.png", icon: Server },
      { name: "Wireshark", logo: "/logos/wireshark.png", icon: Network },
      { name: "Nmap", logo: "/logos/nmap.png", icon: Search },
      { name: "VirusTotal", logo: "/logos/virustotal.png", icon: Search },
      { name: "Linux Terminal", logo: "/logos/linux.png", icon: Terminal }
    ]
  }
];
