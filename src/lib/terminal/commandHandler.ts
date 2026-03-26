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

export let state = {
  isRoot: false,
  contactSession: {
    active: false,
    step: "name",
    data: { name: "", email: "", message: "" }
  } as ContactSession,
};

export function handleCommand(input: string): CommandResult {
  const fullCommand = input.trim();
  if (!fullCommand) return "";

  // --- CONTACT WIZARD INTERCEPTOR ---
  if (state.contactSession.active) {
    const session = state.contactSession;
    const lowerInput = fullCommand.toLowerCase();
    
    if (lowerInput === "exit" || lowerInput === "cancel" || lowerInput === "quit") {
      state.contactSession.active = false;
      return "System: Secure channel closed. Buffer cleared.";
    }

    switch (session.step) {
      case "name":
        session.data.name = fullCommand;
        session.step = "email";
        return "System: Identity recorded. Please provide your [ CONTACT_EMAIL ]:";
      case "email":
        if (!fullCommand.includes("@") || !fullCommand.includes(".")) {
          return "Error: Invalid protocol. Please provide a valid email address:";
        }
        session.data.email = fullCommand;
        session.step = "message";
        return "System: Link established. Input your [ MESSAGE_PAYLOAD ]:";
      case "message":
        session.data.message = fullCommand;
        session.step = "confirm";
        return `\n--- REVIEW PACKET ---\nFROM: ${session.data.name}\nADDR: ${session.data.email}\nDATA: ${session.data.message}\n----------------------\nTransmit this packet? (y/n):`;
      case "confirm":
        if (lowerInput === "y" || lowerInput === "yes") {
          state.contactSession.active = false;
          return {
            type: "stream",
            delay: 80,
            lines: [
              "Parsing header...",
              "Encrypting with AES-256...",
              "Routing through secure nodes...",
              "[ SUCCESS ] Packet sent to Jothish's inbox."
            ]
          };
        }
        state.contactSession.active = false;
        return "System: Transmission aborted. Cache purged.";
    }
  }

  // --- STANDARD COMMANDS PARSING ---
  const args = fullCommand.split(/\s+/);
  const cmd = args[0].toLowerCase();

  switch (cmd) {
    case "help":
      return `
AVAILABLE PROTOCOLS:
--------------------------------------------------
whoami      - Display current user identity
about       - Full analyst profile & education
skills      - View technical capability matrix
projects    - List investigative case files
contact     - Initialize secure messaging uplink
socials     - List external connection nodes
clear       - Purge terminal buffer
--------------------------------------------------
UTILITIES:
sudo su     - Escalate to root privileges
neofetch    - System & identity overview
uptime      - View session duration
date        - Server local time
matrix      - Engage data stream simulation
hack        - Run penetration test simulation
ls          - List directory contents
cat <file>  - Read file contents (e.g., cat bio.txt)
exit        - Terminate terminal UI
--------------------------------------------------`;

    case "whoami":
      return `
USER: ${state.isRoot ? "root (Admin)" : "jothish (Analyst)"}
ROLE: Cybersecurity Student & Researcher
STATUS: Active
PERMISSIONS: ${state.isRoot ? "FULL_SYSTEM_ACCESS" : "STANDARD_USER_SHELL"}`;

    case "about":
      return `
[ PROFILE DOSSIER ]
--------------------------------------------------
NAME: Jothish Gandham
ACADEMIC: B.Tech (2024-2028)
ORG: Sandip University, Nashik
FOCUS: Google Professional Cybersecurity Track
LOCATION: Maharashtra, India
MOTTO: "Understanding how they break to build them better."
--------------------------------------------------
Rapid adaptability and accelerated learning are my core 
operational traits. Currently deep-diving into network 
forensics and automated threat detection.`;

    case "skills":
      return `
[ CAPABILITY MATRIX ]
--------------------------------------------------
OFFENSIVE: Nmap, Kali Linux, Python Scripting
DEFENSIVE: Wireshark, SIEM (Splunk/Chronicle), NIST CSF
SYSTEMS:   Linux (Debian/Arch), SQL, Bash Automation
SOFT:      Quick Learner, Adaptive Thinker, Persistent
--------------------------------------------------`;

    case "projects":
      return `
[ CASE FILES ]
--------------------------------------------------
1. Botium Toys Audit     - NIST CSF risk assessment
2. Vulnerability Scan    - Automated network recon
3. Python Automation     - Secure log parsing tools
--------------------------------------------------
Use 'cat' command to read more or view UI Projects section.`;

    case "ls":
      return "drwxr-xr-x  jothish  staff  bio.txt\ndrwxr-xr-x  jothish  staff  projects/\ndrwxr-xr-x  jothish  staff  certs/";

    case "cat":
      if (!args[1]) return "usage: cat <filename>";
      if (args[1] === "bio.txt") return "I am a Cybersecurity Analyst in training, focused on the intersection of network security and automation.";
      return `cat: ${args[1]}: No such file or directory`;

    case "neofetch":
      return {
        type: "stream",
        delay: 30,
        lines: [
          "          .      jothish@kali",
          "         / \\     ------------",
          "        /   \\    OS: Kali Linux x86_64",
          "       /     \\   Host: Sandip University Terminal",
          "      /       \\  Kernel: 6.1.0-kali7-amd64",
          "     /_________\\ Uptime: 2 hours, 15 mins",
          "                 Packages: 2450 (dpkg)",
          "                 Shell: zsh 5.9",
          "                 CPU: Adaptive Learner Core i7",
          "                 Memory: 16GB / 32GB"
        ]
      };

    case "socials":
      return `
EXTERNAL NODES:
--------------------------------------------------
LinkedIn: linkedin.com/in/jothishgandham
GitHub:   github.com/jothish-blip
Email:    jothishgandham2@gmail.com
--------------------------------------------------`;

    case "sudo":
      if (args[1] === "su") {
        state.isRoot = true;
        return "Escalating privileges... root access granted.";
      }
      return "usage: sudo su";

    case "uptime":
      return `System Uptime: ${Math.floor(Math.random() * 100)} days, ${Math.floor(Math.random() * 24)} hours.`;

    case "date":
      return new Date().toLocaleString();

    case "matrix":
      return {
        type: "stream",
        delay: 40,
        lines: Array.from({ length: 15 }, () => 
          Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
        )
      };

    case "hack":
      return {
        type: "stream",
        delay: 150,
        lines: [
          "[ TASK ] Initiating brute force simulation...",
          "[ WARN ] Target firewall detected.",
          "[ INFO ] Bypassing proxy...",
          "[ OK ] Handshake successful.",
          "[ DONE ] Root access simulated."
        ]
      };

      case "joke":
      const jokes = [
        "Why do cybersecurity researchers always get lost? Because they follow the 'path' but never the breadcrumbs.",
        "How do you get a hacker to do what you want? Tell them it's 'impossible'.",
        "A SQL query walks into a bar, walks up to two tables and asks: 'Can I join you?'",
        "I’d tell you a DNS joke but it might take 24 hours for everyone to get it."
      ];
      return jokes[Math.floor(Math.random() * jokes.length)];

    case "weather":
      return "Location: Nashik, MH | Condition: CLEAR | Temp: 28°C | Winds: 5 knots | Visibility: HIGH";

    case "coffee":
      return {
        type: "stream",
        delay: 200,
        lines: ["Grinding beans...", "Brewing java.exe...", "Injecting caffeine into analyst...", "[ DONE ] System focus improved by 200%."]
      };

    case "secret":
      return "ID_PASS: 'admin123' ... Just kidding. You'll have to try harder than that, Analyst.";

    case "whois":
      if(!args[1]) return "usage: whois <domain>";
      return `Registrar: Jothish Network Services\nUpdated Date: 2026-03-27\nStatus: clientTransferProhibited\nName Server: NS1.JOTHISH.IO`;

    case "ping":
      if(!args[1]) return "usage: ping <target>";
      return {
        type: "stream",
        delay: 100,
        lines: [
          `PING ${args[1]} (127.0.0.1) 56(84) bytes of data.`,
          "64 bytes from 127.0.0.1: icmp_seq=1 ttl=64 time=0.04 ms",
          "64 bytes from 127.0.0.1: icmp_seq=2 ttl=64 time=0.05 ms",
          "--- loopback ping statistics ---",
          "2 packets transmitted, 2 received, 0% packet loss"
        ]
      };

    case "exit":
      return "__EXIT__";

    case "clear":
      return "__CLEAR__";

    default:
      return `zsh: command not found: ${cmd}. Type 'help' for authorized protocols.`;
  }
}