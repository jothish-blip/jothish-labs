// =====================================================================
// JOTHISH TERMINAL — DATA-DRIVEN COMMAND HANDLER
// All command output is sourced from src/data/* — no duplicate data.
// =====================================================================

export type CommandResult =
  | string
  | {
      type: "stream";
      lines: string[];
      delay?: number;
    };

// ─── Contact wizard state ─────────────────────────────────────────────
type ContactStep = "name" | "email" | "message" | "confirm";

type ContactSession = {
  active: boolean;
  step: ContactStep;
  data: { name: string; email: string; message: string };
};

function resetContactSession(): ContactSession {
  return { active: false, step: "name", data: { name: "", email: "", message: "" } };
}

// ─── Global mutable state ─────────────────────────────────────────────
export const analytics = {
  totalCommands: 0,
  commandUsage: {} as Record<string, number>,
  lastCommand: "",
};

export const state = {
  isRoot: false,
  cmdHistory: [] as string[],
  contactSession: resetContactSession(),
};

// ─── Portfolio config (single source of truth) ────────────────────────
export const PORTFOLIO = {
  name: "Jothish Gandham",
  role: "Cybersecurity Learner & Builder",
  location: "India",
  focus: "SOC Operations & Detection Engineering",
  learning: "Threat Intelligence, Cloud Security",
  interests: "System Internals, Automation, Network Forensics",
  goal: "Build resilient systems and hunt threats at scale",
  github: "https://github.com/jothish-blip",
  githubUsername: "jothish-blip",
  linkedin: "https://linkedin.com/in/jothish-gandham-5b90b334a",
  linkedinName: "Jothish Gandham",
  email: "jothishgandham2@gmail.com",
  portfolioVersion: "2.0.0",
  portfolioRepo: "https://github.com/jothish-blip/cybersecurity-portfolio",
};

// ─── Project data (mirror of src/data/projects.ts) ───────────────────
const GITHUB_BASE = "https://github.com/jothish-blip/cybersecurity-portfolio/tree/main";

interface ChildProject {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  skills: string[];
  outcome?: string;
  githubUrl: string;
}

interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  status: string;
  technologies: string[];
  skills: string[];
  githubUrl: string;
  readmeUrl?: string;
  whyBuilt?: string;
  whatWorkedOn?: string;
  outcome?: string;
  childProjects?: ChildProject[];
}

const PROJECTS: Project[] = [
  {
    id: "01", title: "Professional Statement",
    description: "A formal professional statement detailing my background, focus, and continuous learning in cybersecurity.",
    category: "Professional", status: "Introduction",
    technologies: [], skills: ["Professional Communication", "Career Planning"],
    githubUrl: `${GITHUB_BASE}/01%20-%20Professional%20Statement`,
    whyBuilt: "To articulate my journey and dedication to the cybersecurity field.",
    outcome: "A finalized statement used across professional profiles."
  },
  {
    id: "02", title: "Botium Toys Security Audit",
    description: "Comprehensive security audit and risk assessment for a fictional toy company.",
    category: "Audit & Compliance", status: "Security Audit",
    technologies: ["Risk Assessment", "NIST CSF"], skills: ["Security Auditing", "Compliance", "Vulnerability Management"],
    githubUrl: `${GITHUB_BASE}/02%20-%20Botium%20Toys%20Security%20Audit`,
    whyBuilt: "To demonstrate the ability to conduct a comprehensive security audit using established frameworks.",
    whatWorkedOn: "Analyzing current controls, identifying gaps against the NIST CSF, and drafting a report.",
    outcome: "Identified several critical vulnerabilities and provided actionable mitigation strategies."
  },
  {
    id: "03", title: "Network Security Event Analysis",
    description: "Analysis of network security events to detect anomalies and potential threats.",
    category: "Network Security", status: "Network Analysis",
    technologies: ["Wireshark", "Network Analysis"], skills: ["Traffic Analysis", "Anomaly Detection", "Protocol Analysis"],
    githubUrl: `${GITHUB_BASE}/03%20-%20Network%20Security%20Event%20Analysis`,
    whyBuilt: "To practice identifying malicious activities within network traffic captures.",
    whatWorkedOn: "Inspecting PCAP files, isolating suspicious packets, and documenting the attack vectors.",
    outcome: "Successfully identified a simulated network intrusion attempt."
  },
  {
    id: "04", title: "Linux File Permissions",
    description: "Managing and auditing file permissions on a Linux system to enforce least privilege.",
    category: "System Administration", status: "Security Audit",
    technologies: ["Linux", "Bash"], skills: ["Access Control", "System Administration", "Security Hardening"],
    githubUrl: `${GITHUB_BASE}/04%20-%20%20Linux%20File%20Permissions`,
    whyBuilt: "To enforce the principle of least privilege in a multi-user Linux environment.",
    whatWorkedOn: "Modifying file and directory permissions using chmod and chown, and auditing access.",
    outcome: "Secured sensitive files and ensured users had only the permissions necessary for their roles."
  },
  {
    id: "05", title: "SQL Filtering Queries",
    description: "Writing complex SQL queries to filter and extract security-relevant data.",
    category: "Database Security", status: "Log Analysis",
    technologies: ["SQL"], skills: ["Data Extraction", "Querying", "Log Analysis"],
    githubUrl: `${GITHUB_BASE}/05%20-%20SQL%20Filtering%20Queries`,
    whyBuilt: "To efficiently retrieve security logs and audit records from a relational database.",
    whatWorkedOn: "Crafting specific SQL queries to filter login attempts, administrative actions, and errors.",
    outcome: "Extracted actionable insights from raw database logs."
  },
  {
    id: "06", title: "Vulnerability Assessment",
    description: "Conducting a vulnerability assessment to discover and document system weaknesses.",
    category: "Vulnerability Management", status: "Detection Lab",
    technologies: ["Nmap", "CVSS"], skills: ["Vulnerability Scanning", "Risk Scoring", "Reporting"],
    githubUrl: `${GITHUB_BASE}/06%20-%20Vulnerability%20Assessment`,
    whyBuilt: "To systematically identify and evaluate vulnerabilities in a target system.",
    whatWorkedOn: "Scanning networks, evaluating findings using CVSS, and prioritizing remediation.",
    outcome: "Delivered a comprehensive vulnerability report with remediation steps."
  },
  {
    id: "07", title: "Detection & Response",
    description: "A comprehensive collection of incident response projects, from packet analysis to playbook creation.",
    category: "Incident Response", status: "Collection",
    technologies: ["Wireshark", "TCPDump", "Suricata", "Incident Response"],
    skills: ["Threat Detection", "Log Analysis", "Playbook Creation", "Malware Investigation"],
    githubUrl: `${GITHUB_BASE}/07%20-%20Detection%20%26%20Response`,
    whyBuilt: "To demonstrate a complete lifecycle of detecting, investigating, and responding to security incidents.",
    whatWorkedOn: "Analyzing network packets, investigating files, writing playbooks, and tuning IDS rules.",
    outcome: "A robust portfolio of incident response techniques and documentation.",
    childProjects: [
      { id: "07.1", title: "Incident Handler's Journal", description: "Initial documentation and tracking of an ongoing security incident.", technologies: ["Documentation"], skills: ["Incident Tracking", "Record Keeping"], outcome: "Established a clear timeline of events for the incident.", githubUrl: `${GITHUB_BASE}/07%20-%20Detection%20%26%20Response/07.1%20-%20Incident%20Handler's%20Journal` },
      { id: "07.2", title: "Wireshark Packet Analysis", description: "Deep dive into network traffic to identify malicious payloads and communication.", technologies: ["Wireshark"], skills: ["Packet Analysis", "Protocol Inspection"], outcome: "Identified the source and nature of the malicious network traffic.", githubUrl: `${GITHUB_BASE}/07%20-%20Detection%20%26%20Response/07.2%20-%20Wireshark%20Packet%20Analysis` },
      { id: "07.3", title: "TCPDump Packet Capture", description: "Capturing and analyzing raw network packets from the command line.", technologies: ["TCPDump", "Linux"], skills: ["Command Line Packet Capture", "Traffic Filtering"], outcome: "Successfully isolated specific traffic patterns indicating unauthorized access.", githubUrl: `${GITHUB_BASE}/07%20-%20Detection%20%26%20Response/07.3%20-%20TCPDump%20Packet%20Capture` },
      { id: "07.4", title: "Investigate a Suspicious File", description: "Analyzing a potentially malicious file to determine its behavior and origin.", technologies: ["File Analysis Tools"], skills: ["Malware Analysis", "File Hashing", "Static Analysis"], outcome: "Determined the file was malicious and gathered IOCs.", githubUrl: `${GITHUB_BASE}/07%20-%20Detection%20%26%20Response/07.4%20-%20Investigate%20a%20Suspicious%20File` },
      { id: "07.5", title: "Playbook to respond to a phishing incident", description: "Creating a structured playbook for handling future phishing attacks.", technologies: ["Playbook Frameworks"], skills: ["Process Documentation", "Incident Response Planning"], outcome: "Standardized the organizational response to phishing attempts.", githubUrl: `${GITHUB_BASE}/07%20-%20Detection%20%26%20Response/07.5%20-%20Playbook%20to%20respond%20to%20a%20phishing%20incident` },
      { id: "07.6", title: "Suricata Alert Analysis", description: "Reviewing and tuning Suricata IDS alerts to reduce false positives.", technologies: ["Suricata"], skills: ["IDS/IPS", "Alert Tuning", "Rule Management"], outcome: "Improved detection accuracy and reduced noise in the security alerts.", githubUrl: `${GITHUB_BASE}/07%20-%20Detection%20%26%20Response/07.6%20-%20Suricata%20Alert%20Analysis` },
      { id: "07.7", title: "Final Incident Handler's Journal", description: "Concluding the incident response process and summarizing findings.", technologies: ["Documentation"], skills: ["Post-Incident Review", "Reporting"], outcome: "Produced a comprehensive final report detailing the incident lifecycle and lessons learned.", githubUrl: `${GITHUB_BASE}/07%20-%20Detection%20%26%20Response/07.7%20-%20Final%20Incident%20Handler's%20Journal` },
    ]
  },
  {
    id: "08", title: "Algorithm for File Updates in Python",
    description: "Developing a Python script to automate the parsing and updating of security-related files.",
    category: "Automation & Scripting", status: "Automation",
    technologies: ["Python"], skills: ["Scripting", "File Parsing", "Automation"],
    githubUrl: `${GITHUB_BASE}/08%20-%20Algorithm%20for%20File%20Updates%20in%20Python`,
    whyBuilt: "To automate the tedious process of updating allow/deny lists in text files.",
    whatWorkedOn: "Writing a Python script using file I/O operations and string manipulation.",
    outcome: "Reduced manual update time and minimized human error in managing access lists."
  }
];

// ─── Certification data (mirror of src/data/about.ts) ─────────────────
const CERTS = [
  {
    provider: "Google",
    title: "Cybersecurity Professional Certificate",
    status: "✓ Completed",
    issuedDate: "July 2026",
    courseCount: 8,
    highlights: ["Linux", "Python", "SQL", "SIEM", "Incident Response"],
    courses: [
      "Foundations of Cybersecurity",
      "Play It Safe: Manage Security Risks",
      "Connect and Protect: Networks and Network Security",
      "Tools of the Trade: Linux and SQL",
      "Assets, Threats, and Vulnerabilities",
      "Sound the Alarm: Detection and Response",
      "Automate Cybersecurity Tasks with Python",
      "Put It to Work: Prepare for Cybersecurity Jobs"
    ]
  },
  {
    provider: "Google",
    title: "Network Security Specialization",
    status: "✓ Completed",
    issuedDate: "August 2026",
    courseCount: 7,
    highlights: ["Networking", "Firewalls", "Cloud Security", "VPC", "Packet Analysis"],
    courses: [
      "Networking Architecture",
      "Network Operations",
      "Secure Against Network Intrusions",
      "Security Hardening",
      "Introduction to Detection and Incident Response",
      "Network Monitoring and Analysis",
      "Network Traffic and Logs Using IDS and SIEM Tools"
    ]
  },
  {
    provider: "Google",
    title: "Prompting Essentials Specialization",
    status: "✓ Completed",
    issuedDate: "June 2026",
    courseCount: 4,
    highlights: ["AI Prompting", "Generative AI", "Prompt Chaining", "Data Analysis"],
    courses: [
      "Start Writing Prompts like a Pro",
      "Design Prompts for Everyday Work Tasks",
      "Speed Up Data Analysis and Presentation Building",
      "Use AI as a Creative or Expert Partner"
    ]
  },
  {
    provider: "CompTIA",
    title: "Security+",
    status: "▸ In Progress",
    issuedDate: null,
    courseCount: null,
    highlights: ["Network Security", "Compliance", "Threats & Vulnerabilities"],
    courses: []
  },
  {
    provider: "CompTIA",
    title: "CySA+",
    status: "▸ In Progress",
    issuedDate: null,
    courseCount: null,
    highlights: ["Threat Management", "Vulnerability Management", "Cyber Incident Response"],
    courses: []
  }
];

// ─── Skill domain data ────────────────────────────────────────────────
const SKILL_DOMAINS = [
  {
    id: "soc",
    title: "Security Operations (SOC)",
    description: "Monitoring, detecting, and responding to security incidents within an enterprise environment.",
    skills: ["Security Operations", "SIEM", "Log Analysis", "Alert Investigation", "Incident Response", "Threat Detection", "IOC Analysis", "Security Monitoring"],
    technologies: ["Splunk", "Google Chronicle", "Microsoft Sentinel", "Wazuh", "EDR Concepts"],
    proficiency: "Intermediate"
  },
  {
    id: "network",
    title: "Network Security",
    description: "Analyzing network traffic, securing communications, and monitoring for anomalies.",
    skills: ["TCP/IP", "DNS", "HTTP / HTTPS", "Routing", "Firewalls", "Network Monitoring", "Packet Analysis"],
    technologies: ["Wireshark", "Nmap", "TCPDump", "Suricata"],
    proficiency: "Intermediate"
  },
  {
    id: "os",
    title: "Operating Systems",
    description: "Securing, administrating, and navigating core operating system environments.",
    skills: ["Linux", "Windows", "Bash", "Command Line", "File Permissions", "User Management", "Process Management"],
    technologies: ["Linux CLI", "Bash Scripting"],
    proficiency: "Intermediate"
  },
  {
    id: "prog",
    title: "Programming & Scripting",
    description: "Automating security workflows and manipulating data with scripting languages.",
    skills: ["Scripting", "File Parsing", "Automation"],
    technologies: ["Python", "SQL"],
    proficiency: "Foundational"
  },
  {
    id: "fundamentals",
    title: "Security Fundamentals",
    description: "Core principles of information security and organizational defense.",
    skills: ["CIA Triad", "Risk Assessment", "Vulnerability Assessment", "Authentication", "Authorization", "Identity & Access Management", "Security Policies", "Compliance Fundamentals"],
    technologies: [],
    proficiency: "Solid"
  },
  {
    id: "dfir",
    title: "Digital Forensics & Threat Intelligence",
    description: "Investigating breaches and tracking threat actor behavior.",
    skills: ["Threat Intelligence", "Digital Forensics", "IOC Analysis", "Threat Hunting", "Malware Fundamentals", "MITRE ATT&CK"],
    technologies: ["VirusTotal"],
    proficiency: "Foundational"
  }
];

// ─── Helpers ──────────────────────────────────────────────────────────
function output(text: string): CommandResult { return text.trim(); }
function stream(lines: string[], delay = 30): CommandResult { return { type: "stream", lines, delay }; }

// Compute stats from data (dynamic, never hardcoded)
function computeStats() {
  const mainProjects = PROJECTS.length;
  const childProjects = PROJECTS.reduce((sum, p) => sum + (p.childProjects?.length || 0), 0);
  const totalCerts = CERTS.length;
  const completedCerts = CERTS.filter(c => c.status.includes("Completed")).length;
  const inProgressCerts = CERTS.filter(c => c.status.includes("Progress")).length;
  const totalCourses = CERTS.reduce((sum, c) => sum + (c.courseCount || 0), 0);
  const totalSkillDomains = SKILL_DOMAINS.length;
  const totalSkills = SKILL_DOMAINS.reduce((sum, d) => sum + d.skills.length + d.technologies.length, 0);
  const allTechs = [...new Set(SKILL_DOMAINS.flatMap(d => d.technologies))];
  return { mainProjects, childProjects, totalCerts, completedCerts, inProgressCerts, totalCourses, totalSkillDomains, totalSkills, allTechsCount: allTechs.length };
}

// ─── Commands ─────────────────────────────────────────────────────────
type Command = { name: string; execute: (args: string[]) => CommandResult };

const commands: Record<string, Command> = {

  // ── help ──────────────────────────────────────────────────────────
  help: {
    name: "help",
    execute: () => output(`
┌─────────────────────────────────────────────────────┐
│              JOTHISH TERMINAL — HELP                │
└─────────────────────────────────────────────────────┘

PROFILE
  whoami          Current identity & focus
  about           Background and philosophy
  education       Learning journey

PROJECTS
  projects        List all portfolio projects
  project <id>    Inspect a specific project (01–08)

SKILLS
  skills          List all skill domains
  skills <domain> Domain details (e.g. skills soc)

CERTIFICATIONS
  certifications  View all certifications

CONTACT & SOCIAL
  contact         Start the contact wizard
  email           Email addresses
  github          GitHub profile
  linkedin        LinkedIn profile
  social          All social links

SYSTEM
  clear           Clear terminal & reset state
  pwd             Print working directory
  ls              List directory
  cat <file>      Read a file (about.txt, resume.pdf)
  theme           Toggle light/dark theme
  banner          Display terminal banner
  stats           Portfolio statistics
  resume          Open resume
  ops             Open admin panel
  exit            Close the terminal

HIDDEN
  sudo hire jothish    ;)
  matrix               Digital rain
  coffee               ☕
  hack                 Try it
`)
  },

  // ── banner ────────────────────────────────────────────────────────
  banner: {
    name: "banner",
    execute: () => output(`
 ___  ___  ________  _________  ___  ________  ___  ___     
|\\  \\|\\  \\|\\   __  \\|\\___   ___\\\\  \\|\\   ____\\|\\  \\|\\  \\    
\\ \\  \\\\\\  \\ \\  \\|\\  \\|___ \\  \\_\\ \\  \\ \\  \\___|\\ \\  \\_\\  \\   
 \\ \\   __  \\ \\  \\\\\\  \\   \\ \\  \\ \\ \\  \\ \\_____  \\ \\   __  \\  
  \\ \\  \\ \\  \\ \\  \\\\\\  \\   \\ \\  \\ \\ \\  \\|____|\\  \\ \\  \\ \\  \\ 
   \\ \\__\\ \\__\\ \\_______\\   \\ \\__\\ \\ \\__\\____\\_\\  \\ \\__\\ \\__\\
    \\|__|\\|__|\\|_______|    \\|__|  \\|__|\\_________\\|__|\\|__|
                                        \\|_________|         

Cybersecurity Portfolio Terminal — v${PORTFOLIO.portfolioVersion}
${PORTFOLIO.name} · ${PORTFOLIO.role}
Status: Active · Type "help" to begin.
`)
  },

  // ── whoami ────────────────────────────────────────────────────────
  whoami: {
    name: "whoami",
    execute: () => output(`
● Name:           ${PORTFOLIO.name}
● Role:           ${PORTFOLIO.role}
● Location:       ${PORTFOLIO.location}
● Current Focus:  ${PORTFOLIO.focus}
● Learning:       ${PORTFOLIO.learning}
● Interests:      ${PORTFOLIO.interests}
● Career Goal:    ${PORTFOLIO.goal}
`)
  },

  // ── about ─────────────────────────────────────────────────────────
  about: {
    name: "about",
    execute: () => stream([
      "Loading profile...",
      "",
      `● ${PORTFOLIO.name}`,
      `● ${PORTFOLIO.role} | ${PORTFOLIO.location}`,
      "",
      "I didn't start with everything figured out.",
      "I started by trying to understand what happens when systems break.",
      "",
      "My journey began with the Google Cybersecurity Professional Certificate,",
      "followed by the Network Security Specialization and Prompting Essentials.",
      "Each course translated directly into hands-on portfolio projects.",
      "",
      `Current Focus: ${PORTFOLIO.focus}`,
      `Learning Next:  ${PORTFOLIO.learning}`,
      `Interests:      ${PORTFOLIO.interests}`,
      "",
      `Goal: ${PORTFOLIO.goal}`,
      "",
      "Still learning. Still building.",
      "Run 'projects' to see the work. Run 'certifications' to see the credentials."
    ])
  },

  // ── education ─────────────────────────────────────────────────────
  education: {
    name: "education",
    execute: () => output(`
● Learning Path: Self-Directed + Google Certifications + CompTIA (In Progress)
● Focus:         Cybersecurity, Network Defense, SOC Operations

Timeline:
  March 2026      Started Google Cybersecurity Professional Certificate
  June 2026       Completed Google Prompting Essentials Specialization
  July 2026       Completed Google Cybersecurity Professional Certificate (8 courses)
  August 2026     Completed Google Network Security Specialization (7 courses)
  Now             Working toward CompTIA Security+ and CySA+

Methodology: Learn → Build → Document → Iterate
All certificates translated into real hands-on portfolio projects.

Run 'certifications' to see all credentials.
Run 'projects' to see the resulting work.
`)
  },

  // ── projects ──────────────────────────────────────────────────────
  projects: {
    name: "projects",
    execute: () => {
      const lines = [
        "Portfolio Projects — Cybersecurity",
        "═══════════════════════════════════════════════════",
        ""
      ];
      PROJECTS.forEach(p => {
        const hasChildren = p.childProjects && p.childProjects.length > 0;
        lines.push(`  ${p.id}  ${p.title}`);
        lines.push(`       [${p.category}] · ${p.status}${hasChildren ? ` · ${p.childProjects!.length} sub-projects` : ""}`);
        lines.push("");
      });
      lines.push("▸ Use 'project <id>' to inspect (e.g. 'project 01', 'project 07')");
      return output(lines.join("\n"));
    }
  },

  // ── project ───────────────────────────────────────────────────────
  project: {
    name: "project",
    execute: (args) => {
      if (!args[1]) return output("usage: project <id>  (e.g. project 01, project 07)");

      const idRaw = args[1].replace(/^0+/, ""); // strip leading zeros for matching
      const p = PROJECTS.find(x => x.id === args[1] || x.id === args[1].padStart(2, "0") || x.id.replace(/^0+/, "") === idRaw);

      if (!p) return output(`! Project '${args[1]}' not found.\nRun 'projects' to see all available projects.`);

      const lines = [
        `● Project ${p.id} — ${p.title}`,
        "─────────────────────────────────────────────────",
        `Description:  ${p.description}`,
        `Category:     ${p.category}`,
        `Status:       ${p.status}`,
      ];

      if (p.technologies.length > 0) {
        lines.push(`Technologies: ${p.technologies.join(", ")}`);
      }
      if (p.skills.length > 0) {
        lines.push(`Skills:       ${p.skills.join(", ")}`);
      }
      if (p.whyBuilt) lines.push(``, `Why Built:    ${p.whyBuilt}`);
      if (p.whatWorkedOn) lines.push(`Worked On:    ${p.whatWorkedOn}`);
      if (p.outcome) lines.push(`Outcome:      ${p.outcome}`);
      lines.push(``, `GitHub:       ${p.githubUrl}`);

      if (p.childProjects && p.childProjects.length > 0) {
        lines.push("", "Sub-Projects:");
        p.childProjects.forEach(c => {
          lines.push(`  ${c.id}  ${c.title}`);
          lines.push(`        ${c.description}`);
          if (c.outcome) lines.push(`        → ${c.outcome}`);
        });
      }

      return output(lines.join("\n"));
    }
  },

  // ── skills ────────────────────────────────────────────────────────
  skills: {
    name: "skills",
    execute: (args) => {
      if (!args[1]) {
        const lines = [
          "Skill Domains",
          "═══════════════════════════════════════════════════",
          ""
        ];
        SKILL_DOMAINS.forEach(d => {
          lines.push(`  ${d.id.padEnd(14)}  ${d.title}`);
          lines.push(`                    ${d.description}`);
          lines.push("");
        });
        lines.push("▸ Use 'skills <domain>' for details  (e.g. skills soc, skills linux)");
        return output(lines.join("\n"));
      }

      const q = args.slice(1).join(" ").toLowerCase();
      const domain = SKILL_DOMAINS.find(d =>
        d.id.toLowerCase() === q ||
        d.title.toLowerCase().includes(q) ||
        q === "linux" && d.id === "os" ||
        q === "windows" && d.id === "os" ||
        q === "python" && d.id === "prog" ||
        q === "sql" && d.id === "prog" ||
        q === "programming" && d.id === "prog" ||
        q === "forensics" && d.id === "dfir" ||
        q === "dfir" && d.id === "dfir" ||
        q === "threat" && d.id === "dfir"
      );

      if (!domain) {
        const availIds = SKILL_DOMAINS.map(d => d.id).join(", ");
        return output(`! Unknown skill domain: '${q}'\nAvailable: ${availIds}`);
      }

      const lines = [
        `● ${domain.title}`,
        "─────────────────────────────────────────────────",
        `Description:   ${domain.description}`,
        `Proficiency:   ${domain.proficiency}`,
        "",
        `Core Skills:   ${domain.skills.join(", ")}`,
      ];
      if (domain.technologies.length > 0) {
        lines.push(`Technologies:  ${domain.technologies.join(", ")}`);
      }

      // Related projects
      const relatedProjects = PROJECTS.filter(p => {
        const pSkills = [...p.skills, ...p.technologies].map(s => s.toLowerCase());
        const dSkills = [...domain.skills, ...domain.technologies].map(s => s.toLowerCase());
        return pSkills.some(s => dSkills.includes(s));
      });

      if (relatedProjects.length > 0) {
        lines.push("", "Related Projects:");
        relatedProjects.forEach(p => lines.push(`  ${p.id}  ${p.title}`));
      }

      return output(lines.join("\n"));
    }
  },

  // ── certifications ────────────────────────────────────────────────
  certifications: {
    name: "certifications",
    execute: () => {
      const lines = [
        "Certifications & Specializations",
        "═══════════════════════════════════════════════════",
        ""
      ];

      const grouped: Record<string, typeof CERTS> = {};
      CERTS.forEach(c => {
        if (!grouped[c.provider]) grouped[c.provider] = [];
        grouped[c.provider].push(c);
      });

      for (const [provider, certs] of Object.entries(grouped)) {
        lines.push(`◆ ${provider}`);
        certs.forEach(c => {
          lines.push(`  ${c.status}  ${c.title}`);
          if (c.issuedDate) lines.push(`           Issued: ${c.issuedDate}${c.courseCount ? ` · ${c.courseCount} courses` : ""}`);
          if (c.highlights.length > 0) lines.push(`           Skills: ${c.highlights.join(", ")}`);
          if (c.courses.length > 0) {
            c.courses.forEach((course, i) => {
              const isLast = i === c.courses.length - 1;
              lines.push(`           ${isLast ? "└──" : "├──"} ${course}`);
            });
          }
          lines.push("");
        });
      }

      const stats = computeStats();
      lines.push(`Summary: ${stats.completedCerts} completed · ${stats.inProgressCerts} in progress · ${stats.totalCourses} total courses`);
      return output(lines.join("\n"));
    }
  },

  // ── stats ─────────────────────────────────────────────────────────
  stats: {
    name: "stats",
    execute: () => {
      const s = computeStats();
      return output(`
Portfolio Statistics — ${PORTFOLIO.portfolioVersion}
═══════════════════════════════════════════════════
  Main Projects:       ${s.mainProjects}
  Sub-Projects:        ${s.childProjects}
  Total Project Files: ${s.mainProjects + s.childProjects}
  Skill Domains:       ${s.totalSkillDomains}
  Total Skills:        ${s.totalSkills}+
  Technologies:        ${s.allTechsCount}+
  Certifications:      ${s.totalCerts} (${s.completedCerts} completed, ${s.inProgressCerts} in progress)
  Total Courses:       ${s.totalCourses}
  GitHub:              ${PORTFOLIO.githubUsername}
  Portfolio Version:   ${PORTFOLIO.portfolioVersion}
`);
    }
  },

  // ── email ─────────────────────────────────────────────────────────
  email: {
    name: "email",
    execute: () => output(`
Email Addresses:
  ● Primary:  ${PORTFOLIO.email}

To start a conversation through the terminal: contact
`)
  },

  // ── github ────────────────────────────────────────────────────────
  github: {
    name: "github",
    execute: () => output(`
GitHub Profile:
  ● Username:   ${PORTFOLIO.githubUsername}
  ● Profile:    ${PORTFOLIO.github}
  ● Portfolio:  ${PORTFOLIO.portfolioRepo}
`)
  },

  // ── linkedin ──────────────────────────────────────────────────────
  linkedin: {
    name: "linkedin",
    execute: () => output(`
LinkedIn Profile:
  ● Name:     ${PORTFOLIO.linkedinName}
  ● URL:      ${PORTFOLIO.linkedin}
`)
  },

  // ── social ────────────────────────────────────────────────────────
  social: {
    name: "social",
    execute: () => output(`
Social Links:
  ● GitHub      ${PORTFOLIO.githubUsername}
                ${PORTFOLIO.github}

  ● LinkedIn    ${PORTFOLIO.linkedinName}
                ${PORTFOLIO.linkedin}

  ● Email       ${PORTFOLIO.email}
`)
  },

  // ── contact ───────────────────────────────────────────────────────
  contact: {
    name: "contact",
    execute: () => {
      state.contactSession = {
        active: true,
        step: "name",
        data: { name: "", email: "", message: "" }
      };
      return output(`
Let's connect.

I'll send your message directly to ${PORTFOLIO.email}.
Type 'cancel' at any point to exit the wizard.

What's your name?`);
    }
  },

  // ── resume ────────────────────────────────────────────────────────
  resume: { name: "resume", execute: () => "__OPEN_RESUME__" },
  ops:    { name: "ops",    execute: () => "__OPEN_OPS__" },

  // ── pwd ───────────────────────────────────────────────────────────
  pwd: {
    name: "pwd",
    execute: () => output("/home/jothish/portfolio")
  },

  // ── ls ────────────────────────────────────────────────────────────
  ls: {
    name: "ls",
    execute: () => {
      const s = computeStats();
      return output(`
drwxr-xr-x  projects/         (${s.mainProjects} main, ${s.childProjects} sub-projects)
drwxr-xr-x  skills/           (${s.totalSkillDomains} domains)
drwxr-xr-x  certifications/   (${s.totalCerts} certs, ${s.totalCourses} courses)
-rw-r--r--  about.txt
-r-xr-xr-x  resume.pdf
-rw-r--r--  contact.sh
`);
    }
  },

  // ── cat ───────────────────────────────────────────────────────────
  cat: {
    name: "cat",
    execute: (args) => {
      if (!args[1]) return output("usage: cat <file>");
      switch (args[1].toLowerCase()) {
        case "about.txt": return commands.about.execute([]);
        case "resume.pdf": return commands.resume.execute([]);
        case "contact.sh": return output(`#!/bin/bash\n# Run 'contact' to start the interactive contact wizard.`);
        default: return output(`cat: ${args[1]}: No such file or directory`);
      }
    }
  },

  // ── clear ─────────────────────────────────────────────────────────
  clear: {
    name: "clear",
    execute: () => {
      // Reset contact wizard on clear
      state.contactSession = resetContactSession();
      return "__CLEAR__";
    }
  },

  // ── exit ──────────────────────────────────────────────────────────
  exit: {
    name: "exit",
    execute: () => {
      state.contactSession = resetContactSession();
      return "__EXIT__";
    }
  },

  // ── theme ─────────────────────────────────────────────────────────
  theme: {
    name: "theme",
    execute: () => {
      if (typeof window !== "undefined") {
        document.documentElement.classList.toggle("dark");
      }
      return output("✓ Theme toggled.");
    }
  },

  // ── experience ────────────────────────────────────────────────────
  experience: {
    name: "experience",
    execute: () => output(`
● Self-Directed Cybersecurity Learner (March 2026 – Present)
  Completed multiple Google certifications, built ${PROJECTS.length} portfolio projects,
  and developed practical skills in SOC operations, network security, and automation.

  Approach: Learn by doing. Every certificate translated into hands-on project work.
`)
  },

  // ── Easter eggs ───────────────────────────────────────────────────
  coffee: { name: "coffee", execute: () => output("! No caffeine detected.\nAnalyst performance unaffected.") },
  hack:   { name: "hack",   execute: () => output("! Access denied.\nUse authorized environments only.") },
  matrix: {
    name: "matrix",
    execute: () => {
      const chars = "0123456789ABCDEF!@#$%^&*";
      const lines = Array.from({ length: 20 }, () =>
        Array.from({ length: 60 }, () => chars[Math.floor(Math.random() * chars.length)]).join("")
      );
      return stream(lines, 20);
    }
  },
};

// ─── Exports ──────────────────────────────────────────────────────────
export const availableCommands = Object.keys(commands).concat(["sudo hire jothish"]);
const aliases: Record<string, string> = { p: "projects", s: "skills", a: "about", c: "contact", h: "help", e: "email", g: "github", l: "linkedin" };

// ─── Main command handler ─────────────────────────────────────────────
export function handleCommand(input: string): CommandResult {
  const fullCommand = input.trim();
  if (!fullCommand) return "";

  // Update command history
  state.cmdHistory.push(fullCommand);

  // ── CONTACT WIZARD INTERCEPTOR ──────────────────────────────────
  // Only intercept while the wizard is explicitly active.
  // 'clear', 'cancel', 'exit', 'quit' always break out of the wizard.
  if (state.contactSession.active) {
    const session = state.contactSession;
    const lowerInput = fullCommand.toLowerCase();

    analytics.totalCommands++;
    analytics.lastCommand = "[contact_wizard]";

    // Universal escape hatch
    if (["exit", "cancel", "quit", "clear"].includes(lowerInput)) {
      state.contactSession = resetContactSession();
      if (lowerInput === "clear") return "__CLEAR__";
      return output("Contact session cancelled. Run 'contact' to start again.");
    }

    switch (session.step) {
      case "name":
        session.data.name = fullCommand;
        session.step = "email";
        return output(`Nice to meet you, ${session.data.name}.\nWhat's your email address?`);

      case "email": {
        // Only validate email at the email step
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(fullCommand)) {
          return output("That doesn't look like a valid email address. Please try again:");
        }
        session.data.email = fullCommand;
        session.step = "message";
        return output("Got it. What would you like to talk about?");
      }

      case "message":
        session.data.message = fullCommand;
        session.step = "confirm";
        return output(`
┌─── REVIEW MESSAGE ──────────────────────────────┐
  FROM:     ${session.data.name}
  EMAIL:    ${session.data.email}
  MESSAGE:  ${session.data.message}
└─────────────────────────────────────────────────┘
Send this message? (y / n):`);

      case "confirm": {
        const confirmed = ["y", "yes"].includes(lowerInput);
        const sessionData = { ...session.data };
        state.contactSession = resetContactSession();

        if (confirmed) {
          // Fire and forget — submit to contact API
          if (typeof fetch !== "undefined") {
            fetch("/api/contact", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                name: sessionData.name,
                email: sessionData.email,
                message: sessionData.message,
                source: "terminal"
              })
            }).catch(() => {/* silent fail */});
          }
          return stream([
            "Sending your message...",
            "Connecting to contact API...",
            "✓ Message delivered.",
            "",
            `I'll reply to ${sessionData.email} as soon as possible.`,
            "Thank you for reaching out."
          ], 80);
        }

        return output("Message discarded. Run 'contact' to start again.");
      }
    }
  }

  // ── STANDARD COMMAND PARSER ─────────────────────────────────────
  const args = fullCommand.split(/\s+/);
  const rawCmd = args[0].toLowerCase();
  const cmdName = aliases[rawCmd] || rawCmd;

  analytics.totalCommands++;
  analytics.lastCommand = cmdName;
  analytics.commandUsage[cmdName] = (analytics.commandUsage[cmdName] || 0) + 1;

  // sudo hire jothish easter egg
  if (cmdName === "sudo" && args.join(" ").toLowerCase() === "sudo hire jothish") {
    state.isRoot = true;
    return output("✓ Permission granted.\nWelcome aboard.");
  }
  if (cmdName === "sudo" && args[1] === "su") {
    state.isRoot = true;
    return output("✓ Escalating privileges... root access granted.");
  }

  if (commands[cmdName]) {
    return commands[cmdName].execute(args);
  }

  return output(`bash: ${rawCmd}: command not found\nType 'help' for available commands.`);
}