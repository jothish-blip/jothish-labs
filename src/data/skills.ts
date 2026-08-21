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
import { SkillItem, SkillDomain } from "./types";

export const allSkills: SkillItem[] = [
  // SOC Core
  { id: "Security Operations", name: "Security Operations" },
  { id: "SIEM", name: "SIEM" },
  { id: "Log Analysis", name: "Log Analysis" },
  { id: "Alert Investigation", name: "Alert Investigation" },
  { id: "Incident Response", name: "Incident Response" },
  { id: "Threat Detection", name: "Threat Detection" },
  { id: "IOC Analysis", name: "IOC Analysis" },
  { id: "Security Monitoring", name: "Security Monitoring" },
  // SOC Tech
  { id: "Splunk", name: "Splunk", logo: "/logos/splunk.png", icon: Activity },
  { id: "Google Chronicle", name: "Google Chronicle", logo: "/logos/chronicle.png", icon: Search },
  { id: "Microsoft Sentinel", name: "Microsoft Sentinel", logo: "/logos/sentinel.png", icon: ShieldAlert },
  { id: "Wazuh", name: "Wazuh", logo: "/logos/wazuh-1.png", icon: Server },
  { id: "EDR Concepts", name: "EDR Concepts", icon: ShieldAlert },

  // Network Core
  { id: "TCP/IP", name: "TCP/IP" },
  { id: "DNS", name: "DNS" },
  { id: "HTTP / HTTPS", name: "HTTP / HTTPS" },
  { id: "Routing", name: "Routing" },
  { id: "Firewalls", name: "Firewalls" },
  { id: "Network Monitoring", name: "Network Monitoring" },
  { id: "Packet Analysis", name: "Packet Analysis" },
  // Network Tech
  { id: "Wireshark", name: "Wireshark", logo: "/logos/wireshark.png", icon: Network },
  { id: "Nmap", name: "Nmap", logo: "/logos/nmap-2.png", icon: Search },
  { id: "TCPDump", name: "TCPDump", icon: Terminal },
  { id: "Suricata", name: "Suricata", icon: ShieldAlert },

  // OS Core
  { id: "Linux", name: "Linux", logo: "/logos/linux.png", icon: Terminal },
  { id: "Windows", name: "Windows", logo: "/logos/windows.png", icon: Cpu },
  { id: "Bash", name: "Bash" },
  { id: "Command Line", name: "Command Line" },
  { id: "File Permissions", name: "File Permissions" },
  { id: "User Management", name: "User Management" },
  { id: "Process Management", name: "Process Management" },

  // Prog Core
  { id: "Python", name: "Python", logo: "/logos/python.png", icon: Code },
  { id: "SQL", name: "SQL", logo: "/logos/sql-1.png", icon: Database },
  { id: "Scripting", name: "Scripting", icon: Code },
  { id: "File Parsing", name: "File Parsing", icon: Code },
  { id: "Automation", name: "Automation", icon: Code },

  // Fundamentals
  { id: "CIA Triad", name: "CIA Triad" },
  { id: "Risk Assessment", name: "Risk Assessment" },
  { id: "Vulnerability Assessment", name: "Vulnerability Assessment" },
  { id: "Authentication", name: "Authentication" },
  { id: "Authorization", name: "Authorization" },
  { id: "Identity & Access Management", name: "Identity & Access Management" },
  { id: "Security Policies", name: "Security Policies" },
  { id: "Compliance Fundamentals", name: "Compliance Fundamentals" },

  // DFIR
  { id: "Threat Intelligence", name: "Threat Intelligence" },
  { id: "Digital Forensics", name: "Digital Forensics" },
  { id: "Threat Hunting", name: "Threat Hunting" },
  { id: "Malware Fundamentals", name: "Malware Fundamentals" },
  { id: "MITRE ATT&CK", name: "MITRE ATT&CK" },

  // Tools
  { id: "VirusTotal", name: "VirusTotal", logo: "/logos/virustotal.png", icon: Search },
  { id: "Linux Terminal", name: "Linux Terminal", logo: "/logos/linux.png", icon: Terminal },
  
  // Other Skills derived from projects
  { id: "Professional Communication", name: "Professional Communication" },
  { id: "Career Planning", name: "Career Planning" },
  { id: "Security Auditing", name: "Security Auditing" },
  { id: "Compliance", name: "Compliance" },
  { id: "Vulnerability Management", name: "Vulnerability Management" },
  { id: "Traffic Analysis", name: "Traffic Analysis" },
  { id: "Anomaly Detection", name: "Anomaly Detection" },
  { id: "Protocol Analysis", name: "Protocol Analysis" },
  { id: "Access Control", name: "Access Control" },
  { id: "System Administration", name: "System Administration" },
  { id: "Security Hardening", name: "Security Hardening" },
  { id: "Data Extraction", name: "Data Extraction" },
  { id: "Querying", name: "Querying" },
  { id: "Vulnerability Scanning", name: "Vulnerability Scanning" },
  { id: "Risk Scoring", name: "Risk Scoring" },
  { id: "Reporting", name: "Reporting" },
  { id: "Playbook Creation", name: "Playbook Creation" },
  { id: "Malware Investigation", name: "Malware Investigation" },
  { id: "Incident Tracking", name: "Incident Tracking" },
  { id: "Record Keeping", name: "Record Keeping" },
  { id: "Protocol Inspection", name: "Protocol Inspection" },
  { id: "Command Line Packet Capture", name: "Command Line Packet Capture" },
  { id: "Traffic Filtering", name: "Traffic Filtering" },
  { id: "Malware Analysis", name: "Malware Analysis" },
  { id: "File Hashing", name: "File Hashing" },
  { id: "Static Analysis", name: "Static Analysis" },
  { id: "Process Documentation", name: "Process Documentation" },
  { id: "Incident Response Planning", name: "Incident Response Planning" },
  { id: "IDS/IPS", name: "IDS/IPS" },
  { id: "Alert Tuning", name: "Alert Tuning" },
  { id: "Rule Management", name: "Rule Management" },
  { id: "Post-Incident Review", name: "Post-Incident Review" },
  
  // Additional technologies from projects not explicitly covered
  { id: "NIST CSF", name: "NIST CSF" },
  { id: "Network Analysis", name: "Network Analysis" },
  { id: "CVSS", name: "CVSS" },
  { id: "Documentation", name: "Documentation" },
  { id: "File Analysis Tools", name: "File Analysis Tools" },
  { id: "Playbook Frameworks", name: "Playbook Frameworks" }
];

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
      "Splunk",
      "Google Chronicle",
      "Microsoft Sentinel",
      "Wazuh",
      "EDR Concepts"
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
      "Wireshark",
      "Nmap"
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
      "Linux",
      "Windows"
    ]
  },
  {
    id: "domain-prog",
    title: "Programming & Scripting",
    description: "Automating security workflows and manipulating data with scripting languages.",
    icon: Code,
    coreSkills: [],
    technologies: [
      "Python",
      "SQL"
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
      "Splunk",
      "Google Chronicle",
      "Microsoft Sentinel",
      "Wazuh",
      "Wireshark",
      "Nmap",
      "VirusTotal",
      "Linux Terminal"
    ]
  }
];
