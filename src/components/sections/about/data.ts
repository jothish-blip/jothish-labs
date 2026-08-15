import { GoogleSpecialization } from "./types";

export const googleSpecializations: GoogleSpecialization[] = [
  {
    id: "google-cybersecurity",
    slug: "cybersecurity",
    provider: "Google",
    title: "Cybersecurity Professional Certificate",
    shortDescription:
      "Prepare for entry-level cybersecurity roles through hands-on labs and real-world security scenarios.",
    status: "completed",
    progress: 100,
    courseCount: 8,
    duration: "8 Courses",
    accent: "#4285F4",
    highlights: ["Linux", "Python", "SQL", "Risk Management", "Incident Response"],
    professionalCertificate: {
      image: "/assets/certifications/google-cybersecurity.jpg",
      credentialUrl: "https://www.coursera.org/account/accomplishments/specialization/2326Q9TS3JAC",
      issuedDate: "July 2026",
      overview: "A rigorous 8-course learning path covering the fundamentals of cybersecurity, network defense, and security operations.",
      learningOutcomes: [
        "Understand the cybersecurity landscape and threat actors.",
        "Implement network defense tactics and vulnerability assessments.",
        "Execute incident response workflows.",
        "Utilize Linux, SQL, and Python for security tasks."
      ],
      coreTechnologies: ["Linux", "Python", "SQL", "Wireshark", "SIEM (Chronicle/Splunk)"],
      professionalSkills: ["Threat Modeling", "Risk Assessment", "Network Monitoring", "Vulnerability Management"],
      careerRelevance: "Equips learners with the foundational skills necessary for Security Analyst, SOC Analyst, and IT Security Specialist roles."
    },
    credlyBadge: {
      image: "/assets/badges/google-cybersecurity.png",
      badgeUrl: "https://www.credly.com/badges/cybersecurity",
      issuedDate: "July 2026",
      explanation: "Issued by Google. Earners of this badge have demonstrated a foundational understanding of cybersecurity principles, networking, incident response, and risk management."
    },
    courses: [
      {
        id: "foundations-of-cybersecurity",
        title: "Foundations of Cybersecurity",
        description: "An introduction to the cybersecurity profession, core concepts, and ethical principles.",
        image: "/assets/certifications/course-1.jpg",
        credentialUrl: "https://coursera.org/verify/course-1",
        issuedDate: "July 2026",
        skills: ["Cybersecurity Ethics", "Historical Context", "Security Domains"],
        takeaways: [
          "Security principles (CIA Triad)",
          "Common threat actors and their motivations",
          "Ethics and privacy laws",
          "Career paths in cybersecurity"
        ]
      },
      {
        id: "play-it-safe",
        title: "Play It Safe: Manage Security Risks",
        description: "Risk management frameworks, compliance, and auditing in cybersecurity.",
        image: "/assets/certifications/course-2.jpg",
        credentialUrl: "https://coursera.org/verify/course-2",
        issuedDate: "July 2026",
        skills: ["Risk Assessment", "NIST CSF", "Auditing"],
        takeaways: [
          "NIST Cybersecurity Framework implementation",
          "Conducting security audits",
          "Risk mitigation strategies",
          "Compliance with industry standards"
        ]
      },
      {
        id: "connect-and-protect",
        title: "Connect and Protect: Networks and Network Security",
        description: "Deep dive into network architecture, defense, and operations.",
        image: "/assets/certifications/course-3.jpg",
        credentialUrl: "https://coursera.org/verify/course-3",
        issuedDate: "July 2026",
        skills: ["TCP/IP", "Wireshark", "Network Defense"],
        takeaways: [
          "OSI and TCP/IP models",
          "Network protocols (DNS, DHCP, HTTP)",
          "Packet analysis with Wireshark",
          "Firewalls and VPN configuration"
        ]
      },
      {
        id: "tools-of-the-trade",
        title: "Tools of the Trade: Linux and SQL",
        description: "Practical application of Linux CLI and SQL databases for security tasks.",
        image: "/assets/certifications/course-4.jpg",
        credentialUrl: "https://coursera.org/verify/course-4",
        issuedDate: "July 2026",
        skills: ["Linux CLI", "Bash Scripting", "SQL Queries"],
        takeaways: [
          "Navigating the Linux file system",
          "Managing permissions and processes",
          "Writing Bash scripts for automation",
          "Extracting security data with SQL"
        ]
      },
      {
        id: "assets-threats-vulnerabilities",
        title: "Assets, Threats, and Vulnerabilities",
        description: "Identifying vulnerabilities, managing threats, and understanding cryptography.",
        image: "/assets/certifications/course-5.jpg",
        credentialUrl: "https://coursera.org/verify/course-5",
        issuedDate: "July 2026",
        skills: ["Threat Modeling", "Vulnerability Assessment", "Cryptography"],
        takeaways: [
          "Symmetric and asymmetric encryption",
          "Hashing and digital signatures",
          "Conducting vulnerability scans",
          "Threat modeling methodologies"
        ]
      },
      {
        id: "detection-and-response",
        title: "Sound the Alarm: Detection and Response",
        description: "Handling security incidents, log analysis, and utilizing SIEM tools.",
        image: "/assets/certifications/course-6.jpg",
        credentialUrl: "https://coursera.org/verify/course-6",
        issuedDate: "July 2026",
        skills: ["Incident Response", "SIEM", "IDS/IPS"],
        takeaways: [
          "Incident response lifecycle",
          "Analyzing SIEM logs (Chronicle)",
          "Intrusion Detection Systems (IDS)",
          "Playbook execution"
        ]
      },
      {
        id: "automate-cybersecurity-tasks",
        title: "Automate Cybersecurity Tasks with Python",
        description: "Writing Python scripts to automate repetitive security tasks.",
        image: "/assets/certifications/course-7.jpg",
        credentialUrl: "https://coursera.org/verify/course-7",
        issuedDate: "July 2026",
        skills: ["Python", "Automation", "Data Parsing"],
        takeaways: [
          "Python syntax and data structures",
          "File handling and text parsing",
          "Regular expressions (Regex)",
          "Developing automation scripts"
        ]
      },
      {
        id: "put-it-to-work",
        title: "Put It to Work: Prepare for Cybersecurity Jobs",
        description: "Applying concepts to real-world scenarios and career readiness.",
        image: "/assets/certifications/course-8.jpg",
        credentialUrl: "https://coursera.org/verify/course-8",
        issuedDate: "July 2026",
        skills: ["Escalation", "Communication", "Career Readiness"],
        takeaways: [
          "Communicating incidents to stakeholders",
          "Escalation procedures",
          "Building a professional portfolio",
          "Interview preparation"
        ]
      },
    ],
  },
  {
    id: "google-network-security",
    slug: "network-security",
    provider: "Google",
    title: "Network Security Specialization",
    shortDescription:
      "Master network defense, cloud networking, and security infrastructure best practices.",
    status: "completed",
    progress: 100,
    courseCount: 7,
    duration: "7 Courses",
    accent: "#34A853",
    highlights: ["Networking", "Firewalls", "Cloud Security", "VPC", "Packet Analysis"],
    professionalCertificate: {
      image: "/assets/certifications/google-network-security.jpg",
      credentialUrl: "https://coursera.org/verify/professional-cert/network-security",
      issuedDate: "August 2026",
      overview: "An intensive specialization focused on architecting and defending scalable networks in modern cloud and hybrid environments.",
      learningOutcomes: [
        "Design and implement Virtual Private Clouds (VPCs).",
        "Configure complex firewall rules and IAM policies.",
        "Deploy DDoS protection and WAFs using Cloud Armor.",
        "Monitor network traffic and implement zero-trust architectures."
      ],
      coreTechnologies: ["Google Cloud VPC", "Cloud Armor", "Cloud Load Balancing", "Cloud Interconnect"],
      professionalSkills: ["Network Architecture", "Zero Trust Security", "Traffic Analysis", "Cloud Defense"],
      careerRelevance: "Ideal for Cloud Network Engineers, Security Architects, and Systems Administrators managing hybrid cloud infrastructures."
    },
    credlyBadge: {
      image: "/assets/badges/google-network-security.png",
      badgeUrl: "https://www.credly.com/badges/network-security",
      issuedDate: "August 2026",
      explanation: "Issued by Google. Earners have demonstrated proficiency in configuring, maintaining, and securing robust network infrastructures, particularly in cloud environments."
    },
    courses: [
      {
        id: "networking-fundamentals",
        title: "Networking Fundamentals in Google Cloud",
        description: "Learn the core concepts of cloud networking and architecture.",
        image: "/assets/certifications/net-course-1.jpg",
        credentialUrl: "https://coursera.org/verify/net-course-1",
        issuedDate: "August 2026",
        skills: ["VPC", "Subnets", "Routing"],
        takeaways: [
          "Virtual Private Cloud (VPC) design",
          "Subnet allocation and IP addressing",
          "Dynamic routing with Cloud Router",
          "Peering and network topology"
        ]
      },
      {
        id: "hybrid-connectivity",
        title: "Hybrid Connectivity and Network Operations",
        description: "Connect on-premise networks securely to the cloud environment.",
        image: "/assets/certifications/net-course-2.jpg",
        credentialUrl: "https://coursera.org/verify/net-course-2",
        issuedDate: "August 2026",
        skills: ["Cloud VPN", "Cloud Interconnect", "BGP"],
        takeaways: [
          "Deploying HA VPNs",
          "Configuring Dedicated Interconnects",
          "BGP routing protocols",
          "Troubleshooting hybrid connectivity"
        ]
      },
      {
        id: "network-security-vpc",
        title: "Securing the Virtual Private Cloud",
        description: "Implement advanced VPC security controls and firewall policies.",
        image: "/assets/certifications/net-course-3.jpg",
        credentialUrl: "https://coursera.org/verify/net-course-3",
        issuedDate: "August 2026",
        skills: ["Firewalls", "Identity-Aware Proxy", "VPC Service Controls"],
        takeaways: [
          "Hierarchical firewall policies",
          "VPC Service Controls perimeter setup",
          "Identity-Aware Proxy (IAP) integration",
          "Private Google Access"
        ]
      },
      {
        id: "cloud-armor-waf",
        title: "Protecting Applications with Cloud Armor",
        description: "Deploying Web Application Firewalls (WAF) to protect against exploits and DDoS.",
        image: "/assets/certifications/net-course-4.jpg",
        credentialUrl: "https://coursera.org/verify/net-course-4",
        issuedDate: "August 2026",
        skills: ["Cloud Armor", "WAF", "DDoS Protection"],
        takeaways: [
          "Configuring Cloud Armor security policies",
          "Mitigating OWASP Top 10 vulnerabilities",
          "Rate limiting and bot management",
          "Adaptive protection against DDoS"
        ]
      },
      {
        id: "load-balancing-traffic",
        title: "Load Balancing and Traffic Management",
        description: "Distributing traffic securely and efficiently across global endpoints.",
        image: "/assets/certifications/net-course-5.jpg",
        credentialUrl: "https://coursera.org/verify/net-course-5",
        issuedDate: "August 2026",
        skills: ["Cloud Load Balancing", "SSL/TLS", "Traffic Management"],
        takeaways: [
          "Global vs regional load balancers",
          "L4 and L7 traffic distribution",
          "Managing SSL/TLS certificates",
          "Advanced traffic routing"
        ]
      },
      {
        id: "network-monitoring-logging",
        title: "Network Monitoring and Logging",
        description: "Gaining visibility into network traffic anomalies and security events.",
        image: "/assets/certifications/net-course-6.jpg",
        credentialUrl: "https://coursera.org/verify/net-course-6",
        issuedDate: "August 2026",
        skills: ["VPC Flow Logs", "Packet Mirroring", "Cloud Logging"],
        takeaways: [
          "Analyzing VPC Flow Logs",
          "Setting up Packet Mirroring for IDS",
          "Network Intelligence Center usage",
          "Alerting on suspicious traffic"
        ]
      },
      {
        id: "network-security-best-practices",
        title: "Network Security Best Practices",
        description: "Implementing zero trust architectures and holistic network defense.",
        image: "/assets/certifications/net-course-7.jpg",
        credentialUrl: "https://coursera.org/verify/net-course-7",
        issuedDate: "August 2026",
        skills: ["Zero Trust", "Security Architecture", "Best Practices"],
        takeaways: [
          "Designing BeyondCorp (Zero Trust) networks",
          "Auditing network configurations",
          "Defense in depth strategies",
          "Automating security compliance"
        ]
      },
    ],
  },
  {
    id: "google-prompting-essentials",
    slug: "prompting-essentials",
    provider: "Google",
    title: "Prompting Essentials Specialization",
    shortDescription:
      "Master generative AI by designing effective, structured, and chained prompts.",
    status: "completed",
    progress: 100,
    courseCount: 4,
    duration: "4 Courses",
    accent: "#FBBC05",
    highlights: ["AI Prompting", "Generative AI", "Prompt Chaining", "Data Analysis"],
    professionalCertificate: {
      image: "/assets/certifications/google-prompting-essentials.jpg",
      credentialUrl: "https://coursera.org/verify/professional-cert/prompting-essentials",
      issuedDate: "June 2026",
      overview: "A specialized training program designed to teach the fundamentals and advanced techniques of interacting with Large Language Models (LLMs).",
      learningOutcomes: [
        "Understand how Generative AI models generate text and handle context.",
        "Design clear, highly structured prompts for complex tasks.",
        "Utilize prompt chaining to execute multi-step workflows.",
        "Analyze large datasets and extract insights using AI."
      ],
      coreTechnologies: ["Generative AI", "Large Language Models (LLMs)", "Prompt Engineering Frameworks"],
      professionalSkills: ["Prompt Engineering", "Workflow Automation", "AI Data Analysis", "Context Optimization"],
      careerRelevance: "Crucial for modern technical roles looking to leverage AI for productivity, including Developers, Data Analysts, and Security Researchers."
    },
    credlyBadge: {
      image: "/assets/badges/google-prompting-essentials.png",
      badgeUrl: "https://www.credly.com/badges/prompting-essentials",
      issuedDate: "June 2026",
      explanation: "Issued by Google. Earners have proven their ability to efficiently guide Generative AI tools to solve problems, summarize data, and automate tasks through advanced prompting methodologies."
    },
    courses: [
      {
        id: "intro-generative-ai",
        title: "Introduction to Generative AI",
        description: "Understanding LLMs and the fundamentals of AI interaction.",
        image: "/assets/certifications/ai-course-1.jpg",
        credentialUrl: "https://coursera.org/verify/ai-course-1",
        issuedDate: "June 2026",
        skills: ["Generative AI", "LLM Fundamentals", "AI Literacy"],
        takeaways: [
          "How Large Language Models work",
          "Capabilities and limitations of GenAI",
          "Recognizing hallucinations and bias",
          "Basic interaction strategies"
        ]
      },
      {
        id: "design-effective-prompts",
        title: "Design Effective Prompts",
        description: "Learning the five-step framework for specific and structured prompts.",
        image: "/assets/certifications/ai-course-2.jpg",
        credentialUrl: "https://coursera.org/verify/ai-course-2",
        issuedDate: "June 2026",
        skills: ["Prompt Engineering", "Structured Prompting", "Context Setting"],
        takeaways: [
          "The Persona, Task, Context format",
          "Zero-shot vs Few-shot prompting",
          "Formatting output constraints",
          "Iterative prompt refinement"
        ]
      },
      {
        id: "advanced-prompt-chaining",
        title: "Advanced Techniques: Prompt Chaining",
        description: "Breaking complex tasks into sequences of chained prompts.",
        image: "/assets/certifications/ai-course-3.jpg",
        credentialUrl: "https://coursera.org/verify/ai-course-3",
        issuedDate: "June 2026",
        skills: ["Prompt Chaining", "Multimodal Prompting", "Iterative Refinement"],
        takeaways: [
          "Designing sequential AI workflows",
          "Passing context between prompts",
          "Handling multimodal inputs (images/text)",
          "Error correction techniques"
        ]
      },
      {
        id: "ai-for-productivity",
        title: "AI for Data Analysis and Productivity",
        description: "Using prompts to analyze data, summarize information, and automate tasks efficiently.",
        image: "/assets/certifications/ai-course-4.jpg",
        credentialUrl: "https://coursera.org/verify/ai-course-4",
        issuedDate: "June 2026",
        skills: ["Data Analysis", "Summarization", "Workflow Automation"],
        takeaways: [
          "Extracting insights from unstructured data",
          "Summarizing long-form documents",
          "Generating boilerplate code or text",
          "Integrating AI into daily workflows"
        ]
      },
    ],
  },
];

export const activeCerts = [
  {
    id: "comptia-security-plus",
    title: "CompTIA Security+",
    skills: "Network Security, Compliance, Threats & Vulnerabilities",
    progress: 75,
  },
  {
    id: "comptia-cyso",
    title: "CompTIA CySA+",
    skills: "Threat Management, Vulnerability Management, Cyber Incident Response",
    progress: 30,
  }
];