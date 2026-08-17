export type CommandResult =
  | string
  | {
      type: "stream";
      lines: string[];
      delay?: number;
    };

type ContactSession = {
  active: boolean;
  step: "name" | "email" | "message" | "confirm";
  data: { name: string; email: string; message: string; };
};

// --- GLOBAL STATE & ANALYTICS ---
export const analytics = {
  totalCommands: 0,
  commandUsage: {} as Record<string, number>,
  lastCommand: "",
};

export const state = {
  isRoot: false,
  cmdHistory: [] as string[],
  contactSession: {
    active: false,
    step: "name",
    data: { name: "", email: "", message: "" }
  } as ContactSession,
};

// --- HELPER FUNCTIONS ---
function output(text: string): CommandResult {
  return text.trim();
}

function stream(lines: string[], delay = 30): CommandResult {
  return { type: "stream", lines, delay };
}

// --- COMMAND ENGINE ---
type Command = {
  name: string;
  execute: (args: string[]) => CommandResult;
};

const commands: Record<string, Command> = {
  help: {
    name: "help",
    execute: () => output(`
Navigation
  about           Profile and background
  projects        List investigative case files
  skills          Technical capabilities
  certifications  View achievements
  resume          Download / view resume
  education       Academic background
  experience      Professional journey

Contact
  contact         Initialize contact wizard
  social          View all links
  email           Direct email address
  github          GitHub profile
  linkedin        LinkedIn profile

Utilities
  clear           Purge terminal buffer
  whoami          Display current identity
  pwd             Print working directory
  ls              List directory contents
  cat             Read file contents
  theme           Toggle system theme
  banner          Display terminal banner
  stats           View system statistics
`)
  },
  banner: {
    name: "banner",
    execute: () => output(`
JOTHISH TERMINAL
Cybersecurity Portfolio Interface
Version 1.0.0
Status: Active

Type "help" to begin.
`)
  },
  whoami: {
    name: "whoami",
    execute: () => output(`
● Name: Jothish Gandham
● Role: Cybersecurity Learner & Builder
● Location: India
● Current Focus: SOC Operations & Detection Engineering
● Learning: Reverse Engineering, Malware Analysis
● Interests: System Internals, Automation
● Career Goal: Build resilient systems and hunt threats
`)
  },
  about: {
    name: "about",
    execute: () => stream([
      "Loading profile...",
      "",
      "I didn’t start with everything figured out.",
      "I started by trying to understand what happens when systems break.",
      "",
      "Now I’m focused on observing system behavior, understanding patterns, and learning through real experimentation.",
      "I focus heavily on SOC operations, SIEM rules, and network forensics.",
      "",
      "Still learning. Still building."
    ])
  },
  resume: {
    name: "resume",
    execute: () => "__OPEN_RESUME__"
  },
  social: {
    name: "social",
    execute: () => output(`
● Email: jothishgandham2@gmail.com
● GitHub: github.com/jothish-blip
● LinkedIn: linkedin.com/in/jothish-gandham-5b90b334a
`)
  },
  email: { name: "email", execute: () => output("jothishgandham2@gmail.com") },
  github: { name: "github", execute: () => output("github.com/jothish-blip") },
  linkedin: { name: "linkedin", execute: () => output("linkedin.com/in/jothish-gandham-5b90b334a") },
  
  skills: {
    name: "skills",
    execute: (args) => {
      if (!args[1]) {
        return output(`
📁 SOC Operations
📁 Network Security
📁 Digital Forensics
📁 Incident Response
📁 Linux
📁 Windows
📁 Threat Hunting
📁 Python
📁 Automation
📁 OSINT
📁 Cloud Security

▸ Tip: Use 'skills <category>' (e.g., 'skills linux') for details.
`);
      }
      
      const cat = args[1].toLowerCase();
      switch(cat) {
        case "soc": return output("● SOC Operations\nSIEM (Splunk, Elastic), Log Analysis, Alert Triage, Playbook execution.");
        case "network": return output("● Network Security\nWireshark, tcpdump, Snort, Suricata, Firewall configuration.");
        case "linux": return output("● Linux\nKali Linux, Ubuntu, Bash Scripting, System Administration, Hardening.");
        case "windows": return output("● Windows\nActive Directory, Sysinternals, PowerShell, Registry Analysis.");
        case "forensics": return output("● Digital Forensics\nAutopsy, Volatility, Disk imaging, Memory analysis.");
        case "python": return output("● Python\nScripting, Automation, Log Parsing, API Integration.");
        default: return output(`! Unknown skill category: ${cat}`);
      }
    }
  },
  
  certifications: {
    name: "certifications",
    execute: () => output(`
◆ Google
◆ CompTIA

Certification counts
✓ Completed: 3
▸ In Progress: 1

▸ Tip: Use 'google' or 'comptia' to see specifics.
`)
  },
  google: {
    name: "google",
    execute: (args) => {
      if (!args[1]) {
        return output(`
◆ Google Cybersecurity Professional Certificate
◆ Google Network Security Specialization
◆ Google Prompting Essentials

Completion dates: 2024-2025
Course counts: 8 core courses

▸ Tip: Use 'google cybersecurity' or 'google networking' for details.
`);
      }
      const cat = args.slice(1).join(" ").toLowerCase();
      if (cat.includes("cybersecurity")) return output("● Google Cybersecurity Professional Certificate\n8 courses.\nCore skills: SIEM, Python, Linux, SQL, Packets.\nStatus: ✓ Completed");
      if (cat.includes("networking") || cat.includes("network")) return output("● Google Network Security Specialization\nStatus: ✓ Completed");
      if (cat.includes("prompting")) return output("● Google Prompting Essentials\nStatus: ✓ Completed");
      return output(`! Unknown google certification: ${cat}`);
    }
  },
  comptia: {
    name: "comptia",
    execute: () => output(`
◆ Security+
◆ CySA+

Status: ▸ In Progress
Target completion: 2026
`)
  },
  
  projects: {
    name: "projects",
    execute: () => output(`
📁 01 SIEM Detection Lab
📁 02 Active Directory Lab
📁 03 SOC Automation
📁 04 Malware Analysis

▸ Tip: Use 'project <number>' to inspect deeper.
`)
  },
  project: {
    name: "project",
    execute: (args) => {
      if (!args[1]) return output("usage: project <number>");
      switch (args[1]) {
        case "1": return output("● 01 SIEM Detection Lab\nPurpose: Build custom detection rules for malicious behavior.\nTechnologies: Splunk, Elastic, Sysmon.\nGitHub: github.com/jothish-blip/siem-lab\nStatus: ✓ Completed\nOutcome: Created 20+ custom alerts.");
        case "2": return output("● 02 Active Directory Lab\nPurpose: Understand enterprise network vulnerabilities.\nTechnologies: Windows Server, BloodHound, Mimikatz.\nGitHub: github.com/jothish-blip/ad-lab\nStatus: ✓ Completed\nOutcome: Documented common attack paths.");
        case "3": return output("● 03 SOC Automation\nPurpose: Automate repetitive SOC tier-1 tasks.\nTechnologies: Python, TheHive, Cortex.\nGitHub: github.com/jothish-blip/soc-auto\nStatus: ▸ Active\nOutcome: Reduced triage time by 40%.");
        case "4": return output("● 04 Malware Analysis\nPurpose: Analyze live malware samples safely.\nTechnologies: REMnux, Wireshark, Ghidra.\nGitHub: Private\nStatus: ▸ Active\nOutcome: Reverse engineered 3 modern trojans.");
        default: return output(`! Project ${args[1]} not found.`);
      }
    }
  },
  
  experience: {
    name: "experience",
    execute: () => output(`
● Cybersecurity Learner (2024 - Present)
Focused on self-directed learning, building homelabs, and completing certifications.
`)
  },
  education: {
    name: "education",
    execute: () => output(`
● Degree: Self-Taught & Certifications
● Focus: Cybersecurity, Network Defense, SOC Operations
`)
  },
  
  stats: {
    name: "stats",
    execute: () => output(`
● Projects: 12
● Specializations: 2
● Courses: 14
● Certifications: 3
● Skills: 25+
● SOC Tools: 10+
● Learning Hours: 1000+
● Repositories: 15
● GitHub Contributions: Active
`)
  },
  
  theme: {
    name: "theme",
    execute: () => {
      if (typeof window !== "undefined") {
        document.documentElement.classList.toggle("dark");
      }
      return output("✓ Theme toggled.");
    }
  },
  
  // EASTER EGGS
  coffee: {
    name: "coffee",
    execute: () => output("! No caffeine detected.\nAnalyst performance unaffected.")
  },
  hack: {
    name: "hack",
    execute: () => output("! Access denied.\nUse authorized environments only.")
  },
  matrix: {
    name: "matrix",
    execute: () => {
      const chars = "0123456789ABCDEF!@#$%^&*";
      const lines = Array.from({length: 20}, () => 
        Array.from({length: 60}, () => chars[Math.floor(Math.random() * chars.length)]).join("")
      );
      return stream(lines, 20);
    }
  },

  clear: { name: "clear", execute: () => "__CLEAR__" },
  exit: { name: "exit", execute: () => "__EXIT__" },

  contact: {
    name: "contact",
    execute: () => {
      state.contactSession.active = true;
      state.contactSession.step = "name";
      state.contactSession.data = { name: "", email: "", message: "" };
      return output("Let’s connect.\nTell me your name (or type 'cancel'):");
    }
  },
  
  pwd: {
    name: "pwd",
    execute: () => output("/home/jothish/portfolio")
  },
  
  ls: {
    name: "ls",
    execute: () => output(`
drwxr-xr-x  projects/
drwxr-xr-x  skills/
drwxr-xr-x  certifications/
-rw-r--r--  about.txt
-r-xr-xr-x  resume.pdf
`)
  },
  
  cat: {
    name: "cat",
    execute: (args) => {
      if (!args[1]) return output("usage: cat <file>");
      switch(args[1].toLowerCase()) {
        case "about.txt": return commands.about.execute([]);
        case "resume.pdf": return commands.resume.execute([]);
        default: return output(`cat: ${args[1]}: No such file or directory`);
      }
    }
  }
};

export const availableCommands = Object.keys(commands).concat(["sudo hire jothish"]);
const aliases: Record<string, string> = { p: "projects", s: "skills", a: "about", c: "contact", h: "help" };

export function handleCommand(input: string): CommandResult {
  const fullCommand = input.trim();
  if (!fullCommand) return "";

  // Update State History
  state.cmdHistory.push(fullCommand);

  // --- CONTACT WIZARD INTERCEPTOR ---
  if (state.contactSession.active) {
    const session = state.contactSession;
    const lowerInput = fullCommand.toLowerCase();
    
    analytics.totalCommands++;
    analytics.lastCommand = "[contact_wizard]";
    
    if (lowerInput === "exit" || lowerInput === "cancel" || lowerInput === "quit") {
      state.contactSession.active = false;
      return output("Got it. Let me know if you change your mind.");
    }

    switch (session.step) {
      case "name":
        session.data.name = fullCommand;
        session.step = "email";
        return output(`Nice to meet you, ${session.data.name}. What’s your email?`);
      case "email":
        if (!fullCommand.includes("@") || !fullCommand.includes(".")) {
          return output("That doesn't look like an email. Try again:");
        }
        session.data.email = fullCommand;
        session.step = "message";
        return output("Got it. What would you like to talk about?");
      case "message":
        session.data.message = fullCommand;
        session.step = "confirm";
        return output(`\n--- REVIEW MESSAGE ---\nFROM: ${session.data.name}\nADDR: ${session.data.email}\nDATA: ${session.data.message}\n----------------------\nSend this message? (y/n):`);
      case "confirm":
        if (lowerInput === "y" || lowerInput === "yes") {
          state.contactSession.active = false;
          return stream([
            "Sending your message...",
            "Almost there...",
            "✓ Done.",
            "I’ll get back to you soon."
          ], 80);
        }
        state.contactSession.active = false;
        return output("Message discarded.");
    }
  }

  // --- STANDARD COMMANDS PARSING ---
  const args = fullCommand.split(/\s+/);
  const rawCmd = args[0].toLowerCase();
  const cmdName = aliases[rawCmd] || rawCmd;

  analytics.totalCommands++;
  analytics.lastCommand = cmdName;
  analytics.commandUsage[cmdName] = (analytics.commandUsage[cmdName] || 0) + 1;

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