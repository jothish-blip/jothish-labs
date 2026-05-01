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
export let analytics = {
  totalCommands: 0,
  commandUsage: {} as Record<string, number>,
  lastCommand: "",
};

export let state = {
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

function stream(lines: string[], delay = 50): CommandResult {
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
AVAILABLE PROTOCOLS:
--------------------------------------------------
whoami      - Display current user identity
about       - My learning journey
skills      - Current toolset & focus
projects    - List investigative case files
contact     - Let's connect
ls          - List directory contents
cat <file>  - Read file contents
ping <tgt>  - Check connection to target
whois <dom> - Domain registry lookup
open <sec>  - Navigate portfolio (e.g., open projects)
clear       - Purge terminal buffer
exit        - Terminate terminal UI
--------------------------------------------------
SYSTEM / POWER COMMANDS:
history     - View your command history
stats       - View session statistics
time        - Display local time
search      - Query the system
echo        - Print text to screen
learn       - Enter learning mode
suggest     - Get a random command suggestion
system      - View core system status
analytics   - View session analytics breakdown
--------------------------------------------------
ALIASES: p (projects), s (skills), a (about), c (contact)`)
  },
  whoami: {
    name: "whoami",
    execute: () => output(`
USER: ${state.isRoot ? "root (Admin)" : "jothish (Analyst)"}
ROLE: Cybersecurity Learner & Builder
STATUS: Active
PERMISSIONS: ${state.isRoot ? "FULL_SYSTEM_ACCESS" : "STANDARD_USER_SHELL"}`)
  },
  about: {
    name: "about",
    execute: () => stream([
      "Loading profile...",
      "",
      "I didn’t start with everything figured out.",
      "I started by trying to understand what happens when systems break.",
      "",
      "Now I’m focused on:",
      "- observing system behavior",
      "- understanding patterns",
      "- learning through real experimentation",
      "",
      "Still learning. Still building."
    ], 60)
  },
  skills: {
    name: "skills",
    execute: () => stream([
      "Initializing skill modules...",
      "",
      "Core Tools:",
      "• Linux (daily usage)",
      "• Wireshark (packet inspection)",
      "• tcpdump (command-line capture)",
      "• SQL (data filtering)",
      "",
      "Focus Areas:",
      "• Log Analysis",
      "• Network Behavior",
      "• Pattern Detection",
      "",
      "Status: Learning & improving every day."
    ], 50)
  },
  projects: {
    name: "projects",
    execute: () => stream([
      "Fetching case files...",
      "",
      "[1] Botium Toys Audit",
      "    → Risk assessment using NIST CSF",
      "",
      "[2] Vulnerability Scan",
      "    → Automated network scanning",
      "",
      "[3] Log Parser Tool",
      "    → Python-based log analysis",
      "",
      "Tip: Use 'project 1' to inspect deeper, or 'open projects' to view UI."
    ], 50)
  },
  project: {
    name: "project",
    execute: (args) => {
      if (args[1] === "1") return output("Detailed analysis of Botium Toys:\n- Conducted risk assessment\n- Mapped to NIST CSF\n- Identified 5 critical vulnerabilities.");
      if (args[1] === "2") return output("Vulnerability Scan:\n- Used Nmap for network discovery\n- Documented open ports and services.");
      if (args[1] === "3") return output("Log Parser Tool:\n- Python script to parse auth logs\n- Extracted failed login attempts.");
      return output("usage: project <1|2|3>");
    }
  },
  open: {
    name: "open",
    execute: (args) => {
      if (args[1] === "projects") return "__OPEN_PROJECTS__";
      return output("usage: open projects");
    }
  },
  ls: {
    name: "ls",
    execute: () => output("drwxr-xr-x  jothish  staff  bio.txt\ndrwxr-xr-x  jothish  staff  skills.txt\ndrwxr-xr-x  jothish  staff  projects/")
  },
  cat: {
    name: "cat",
    execute: (args) => {
      const files: Record<string, string> = {
        "bio.txt": "I focus on learning systems through real experimentation.",
        "skills.txt": "Linux, Wireshark, tcpdump, SQL",
      };
      if (!args[1]) return output("usage: cat <file>");
      if (files[args[1]]) return output(files[args[1]]);
      return output(`cat: ${args[1]}: No such file or directory`);
    }
  },
  whois: {
    name: "whois",
    execute: (args) => {
      if (!args[1]) return output("usage: whois <domain>");
      return output(`Domain: ${args[1]}\nStatus: Active\nOwner: Public Registry\nUpdated Date: 2026-03-27\nName Server: NS1.JOTHISH.IO`);
    }
  },
  ping: {
    name: "ping",
    execute: (args) => {
      const target = args[1] || "localhost";
      return stream([
        `PING ${target} (127.0.0.1) 56(84) bytes of data.`,
        `64 bytes from 127.0.0.1: icmp_seq=1 ttl=64 time=0.04 ms`,
        `64 bytes from 127.0.0.1: icmp_seq=2 ttl=64 time=0.05 ms`,
        `64 bytes from 127.0.0.1: icmp_seq=3 ttl=64 time=0.04 ms`,
        `--- ${target} ping statistics ---`,
        `3 packets transmitted, 3 received, 0% packet loss`
      ], 100);
    }
  },
  
  // --- NEW POWER COMMANDS ---
  history: {
    name: "history",
    execute: () => output(state.cmdHistory.map((cmd, i) => `  ${i + 1}  ${cmd}`).join("\n") || "No history")
  },
  stats: {
    name: "stats",
    execute: () => output(`
Session running...
Commands executed: ${analytics.totalCommands}
Active mode: ${state.isRoot ? "ROOT" : "USER"}
`)
  },
  time: {
    name: "time",
    execute: () => output(`Current Time: ${new Date().toLocaleTimeString()}`)
  },
  search: {
    name: "search",
    execute: (args) => {
      if (!args[1]) return output("usage: search <keyword>");
      return output(`Searching for "${args[1]}"...\nNo indexed results yet.`);
    }
  },
  echo: {
    name: "echo",
    execute: (args) => output(args.slice(1).join(" "))
  },
  learn: {
    name: "learn",
    execute: () => stream([
      "Learning Mode Activated...",
      "",
      "Focus:",
      "- Observing patterns",
      "- Understanding behavior",
      "- Building systems",
      "",
      "Keep going."
    ], 60)
  },
  suggest: {
    name: "suggest",
    execute: () => {
      const cmds = Object.keys(commands);
      return output(`Try: ${cmds[Math.floor(Math.random() * cmds.length)]}`);
    }
  },
  system: {
    name: "system",
    execute: () => stream([
      "System Status:",
      "----------------",
      "Terminal: Active",
      "User Mode: " + (state.isRoot ? "Root" : "User"),
      "Commands Executed: " + analytics.totalCommands,
      "Status: Operational"
    ], 50)
  },
  analytics: {
    name: "analytics",
    execute: () => {
      const usage = Object.entries(analytics.commandUsage)
        .map(([cmd, count]) => `  ${cmd}: ${count}`)
        .join("\n");
      return output(`
[ SESSION ANALYTICS ]
---------------------------
Total Commands: ${analytics.totalCommands}
Last Command: ${analytics.lastCommand}

Usage Breakdown:
${usage || "No commands yet"}
---------------------------`);
    }
  },

  joke: {
    name: "joke",
    execute: () => output("Why do cybersecurity researchers always get lost? Because they follow the 'path' but never the breadcrumbs.")
  },
  exit: {
    name: "exit",
    execute: () => "__EXIT__"
  },
  clear: {
    name: "clear",
    execute: () => "__CLEAR__"
  },
  contact: {
    name: "contact",
    execute: () => {
      state.contactSession.active = true;
      state.contactSession.step = "name";
      state.contactSession.data = { name: "", email: "", message: "" };
      return output("Let’s connect.\nTell me your name (or type 'cancel'):");
    }
  }
};

export const availableCommands = Object.keys(commands);
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
    
    // Track analytics even during wizard
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
            "Done.",
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

  // Track Analytics
  analytics.totalCommands++;
  analytics.lastCommand = cmdName;
  analytics.commandUsage[cmdName] = (analytics.commandUsage[cmdName] || 0) + 1;

  // Hidden easter egg for sudo
  if (cmdName === "sudo" && args[1] === "su") {
    state.isRoot = true;
    return output("Escalating privileges... root access granted.");
  }

  if (commands[cmdName]) {
    return commands[cmdName].execute(args);
  }

  return output(`Unknown command: ${cmdName}.\nTry 'help' or 'suggest'`);
}