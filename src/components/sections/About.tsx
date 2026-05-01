"use client";
import { useEffect, useState, useCallback, useRef } from "react";

// 1. PROJECT ASSETS
interface Certificate {
  id: string;
  title: string;
  path: string;
  skills: string;
}

const certificates: Certificate[] = [
  { id: "G01", title: "Foundations of Cybersecurity", path: "/Certificates/GC1.pdf", skills: "Security Ethics, NIST Framework, Risk Management" },
  { id: "G02", title: "Play It Safe: Manage Security Risks", path: "/Certificates/GC2.pdf", skills: "Security Audits, Control Frameworks, SIEM Basics" },
  { id: "G03", title: "Connect and Protect: Networks", path: "/Certificates/GC3.pdf", skills: "TCP/IP, Firewalls, Intrusion Detection Systems" },
  { id: "G04", title: "Tools of the Trade: Linux and SQL", path: "/Certificates/GC4.pdf", skills: "Bash Scripting, Database Security, Command Line Forensics" },
  { id: "G05", title: "Assets, Threats, and Vulnerabilities", path: "/Certificates/GC5.pdf", skills: "Vulnerability Scanning, Asset Classification, Cryptography" },
  { id: "G06", title: "Sound the Alarm: Detection and Response", path: "/Certificates/GC6.pdf", skills: "Incident Lifecycle, Log Analysis, Packet Sniffing" },
  { id: "G07", title: "Automate Tasks with Python", path: "/Certificates/GC7.pdf", skills: "Security Automation, Scripting for Analysts, Regular Expressions" },
  { id: "G08", title: "Put It to Work: Job Prep", path: "/Certificates/GC8.pdf", skills: "Incident Documentation, Stakeholder Communication" },
  { id: "G09", title: "Google Professional Capstone", path: "/Certificates/GC9.pdf", skills: "End-to-end Incident Response, SOC Workflow Simulation" },
];

export default function About() {
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [activeCert, setActiveCert] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const nextCert = useCallback(() => {
    setActiveCert((prev) => (prev + 1) % certificates.length);
  }, []);

  const prevCert = useCallback(() => {
    setActiveCert((prev) => (prev - 1 + certificates.length) % certificates.length);
  }, []);

  useEffect(() => {
    if (isPaused) return;
    // Slowed down to 9s for better readability
    const interval = setInterval(nextCert, 9000);
    return () => clearInterval(interval);
  }, [nextCert, isPaused]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") { nextCert(); setIsPaused(true); }
      if (e.key === "ArrowLeft") { prevCert(); setIsPaused(true); }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [nextCert, prevCert]);

  const handleTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX; };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartX.current) return;
    const touchEndX = e.changedTouches[0].clientX;
    if (touchStartX.current - touchEndX > 50) nextCert();
    if (touchStartX.current - touchEndX < -50) prevCert();
    touchStartX.current = null;
  };

  return (
    <section id="about" className="relative min-h-screen w-full bg-background text-foreground py-20 sm:py-28 lg:py-32 px-5 sm:px-8 md:px-16 lg:px-32 overflow-hidden border-t border-surface font-sans">
      
      {/* Dynamic Theme Variables */}
      <style jsx global>{`
        :root {
          --accent: #0891b2;
          --accent-soft: rgba(8, 145, 178, 0.1);
          --accent-grid: rgba(0, 0, 0, 0.04);
        }
        html.dark {
          --accent: #22d3ee;
          --accent-soft: rgba(34, 211, 238, 0.1);
          --accent-grid: rgba(255, 255, 255, 0.012);
        }
      `}</style>

      {/* Balanced Grid */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(to right, var(--accent-grid) 1px, transparent 1px), linear-gradient(to bottom, var(--accent-grid) 1px, transparent 1px)`,
          backgroundSize: '70px 70px'
        }}
      ></div>

      <div className={`relative z-10 max-w-5xl mx-auto space-y-14 transition-all duration-700 ${isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        
        {/* [1] IDENTITY BLOCK - 3 COLUMN LAYOUT */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 items-start">
          
          {/* LEFT: TEXT DATA */}
          <div className="lg:col-span-5 space-y-8 order-2 lg:order-1">
            <div className="space-y-4">
              <p className="text-[10px] font-mono text-muted tracking-widest mb-4">
                JOTHISH GANDHAM / SECURITY LEARNER
              </p>
              <div className="font-mono text-[10px] text-[var(--accent)] tracking-[0.4em] uppercase">WHO I AM</div>
              <h2 className="text-4xl sm:text-5xl lg:text-7xl font-black tracking-tighter uppercase leading-[0.85]">
                Jothish <span className="text-muted italic font-light">Gandham</span>
              </h2>
              <div className="font-mono text-xs text-muted tracking-tight border-y border-surface py-3 flex items-center justify-between">
                <span>Aspiring Security Analyst | <span className="text-[var(--accent)] font-bold">Blue Team Focus</span></span>
              </div>
            </div>
            
            <div className="border-l border-surface pl-8 space-y-6">
              <p className="text-muted text-lg font-light leading-relaxed">
                I didn't start with everything figured out — I started by trying to understand how systems actually behave.
              </p>

              <div className="w-12 h-px bg-surface"></div>
              
              <p className="text-muted text-sm leading-relaxed">
                That curiosity pulled me into exploring network traffic, logs, and simple attack scenarios — not just reading about them, but trying them out and seeing what really happens.
              </p>
              
              <p className="text-muted text-sm leading-relaxed">
                Right now, I'm building a strong foundation step by step. Learning tools like Wireshark, Linux, and SQL, and slowly understanding how detection and response works in real environments.
              </p>

              <p className="text-muted text-xs font-mono pt-2">
                I'm not trying to know everything — I focus on understanding things deeply.
              </p>

              <div className="flex flex-wrap gap-3 pt-2">
                {["Break Things to Learn", "Pattern Focused", "Hands-on Practice", "Consistency Over Time"].map((trait) => (
                  <span key={trait} className="group text-[9px] font-mono px-3 py-1 bg-surface border border-surface text-muted uppercase tracking-widest cursor-default transition-colors hover:text-foreground hover:border-[var(--accent)]">
                    {trait}
                  </span>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-6 pt-6">
                <a href="https://github.com/jothish-blip" target="_blank" className="font-mono text-[10px] text-muted hover:text-[var(--accent)] transition-colors uppercase tracking-widest">[ github ]</a>
                <a href="https://www.linkedin.com/in/jothish-gandham-5b90b334a/" target="_blank" className="font-mono text-[10px] text-muted hover:text-[var(--accent)] transition-colors uppercase tracking-widest">[ linkedin ]</a>
                <a href="/resume.pdf" target="_blank" className="font-mono text-[10px] text-[var(--accent)] border border-[var(--accent-soft)] bg-[var(--accent-soft)] px-3 py-1 hover:bg-surface transition-all uppercase tracking-widest">
                  [ access_resume ]
                </a>
              </div>
            </div>
          </div>

          {/* CENTER: PROFILE PHOTO */}
          <div className="lg:col-span-3 order-1 lg:order-2">
            <div className="relative group max-w-[280px] mx-auto lg:mx-0">
                <div className="absolute -inset-2 border border-[var(--accent-soft)] opacity-50 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                <div className="relative border border-surface p-2 bg-surface-strong backdrop-blur-sm overflow-hidden rounded-sm">
                    <div className="absolute top-0 left-0 w-full h-[1px] bg-[var(--accent)] opacity-30 animate-scan z-10 pointer-events-none"></div>
                    <img 
                        src="https://i.pinimg.com/1200x/27/74/3e/27743e3a002888b26448f35e0fe41137.jpg" 
                        alt="Jothish Gandham"
                        className="w-full h-auto object-cover md:grayscale md:brightness-75 md:group-hover:grayscale-0 md:group-hover:brightness-100 transition-all duration-700 ease-in-out border border-surface"
                    />
                </div>
                <div className="mt-3 flex justify-between items-center px-1 font-mono text-[8px] text-muted uppercase tracking-[0.2em]">
                    <span>Profile Image</span>
                    <span className="text-muted">v1.0</span>
                </div>
            </div>
          </div>

          {/* RIGHT: EDUCATION & STATUS */}
          <div className="lg:col-span-4 space-y-10 order-3 border-l border-surface pl-6 lg:pl-10">
            <div className="space-y-8">
                <h4 className="font-mono text-[10px] text-[var(--accent)] uppercase tracking-[0.4em]">EDUCATION</h4>
                <div className="space-y-6 font-mono text-[11px]">
                <div className="relative">
                    <span className="absolute -left-[30px] top-1 w-2 h-2 bg-[var(--accent)] rounded-full"></span>
                    <p className="text-foreground font-bold leading-tight">B.Tech CSE (Cyber Security)</p>
                    <p className="text-muted">Sandip University, Nashik</p>
                    <p className="text-muted text-[10px] mt-1">2024 — 2028</p>
                </div>
                <div className="relative opacity-70">
                    <span className="absolute -left-[30px] top-1 w-2 h-2 bg-surface-strong border border-surface rounded-full"></span>
                    <p className="text-foreground font-bold leading-tight">Intermediate (MPC)</p>
                    <p className="text-muted">Narayana Junior College, Vijayawada</p>
                    <p className="text-muted text-[10px] mt-1">2022 — 2024</p>
                </div>
                </div>
            </div>
            
            <div className="p-4 bg-surface border border-surface rounded-sm">
                <p className="text-[10px] font-mono text-muted uppercase tracking-widest mb-1">Status:</p>
                <p className="text-[11px] font-mono text-[var(--accent)] uppercase tracking-widest font-bold">
                    Open to Summer 2026 Internships
                </p>
            </div>
          </div>
        </div>

        {/* [2] CURRENT FOCUS & HOW I'M LEARNING */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start py-12 border-y border-surface">
          
          <div className="lg:col-span-8 space-y-6">
            <h4 className="font-mono text-[10px] text-muted uppercase tracking-widest">
              // CURRENT FOCUS
            </h4>
            <div className="space-y-4">
              <p className="text-muted text-sm leading-relaxed max-w-2xl">
                Right now, I'm focused on building a strong foundation — working with network traffic, system logs, and basic security scenarios.
              </p>
              <p className="text-muted text-sm leading-relaxed max-w-2xl">
                I spend most of my time experimenting, testing things, and trying to understand why something works — not just how.
              </p>
              <p className="text-muted text-xs font-mono pt-2">
                Most of my learning comes from testing systems and observing outcomes.
              </p>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <h4 className="font-mono text-[10px] text-muted uppercase tracking-widest">
              // LEARNING APPROACH
            </h4>
            <p className="text-muted text-[13px] leading-relaxed mb-4 max-w-md">
              These are the tools I'm using to explore and understand systems in a practical way.
            </p>

            <div className="space-y-5">
              {[
                { title: "Linux", desc: "My base environment — where I practice commands, permissions, and system-level understanding." },
                { title: "Wireshark", desc: "Used to inspect packet-level data and understand how traffic behaves in real scenarios." },
                { title: "tcpdump", desc: "Practicing command-line packet capture to observe raw traffic directly." },
                { title: "SQL", desc: "Learning how to filter and analyze data to identify patterns and anomalies." }
              ].map((tool) => (
                <div key={tool.title} className="group border-l border-surface pl-4 hover:border-[var(--accent)] transition cursor-default">
                  <p className="text-foreground text-sm font-medium flex items-center">
                    {tool.title}
                    <span className="text-[9px] text-[var(--accent)] opacity-0 group-hover:opacity-100 transition-opacity ml-2 uppercase tracking-widest">learning</span>
                  </p>
                  <p className="text-[11px] text-muted pt-1 leading-relaxed">
                    {tool.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* [3] EVIDENCE VIEWING NODES */}
        <div className="space-y-12 pb-16 max-w-3xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-4">
            <div className="space-y-3 text-center md:text-left">
              <p className="font-mono text-[10px] tracking-[0.4em] text-[var(--accent)] uppercase">CERTIFICATIONS</p>
              <h3 className="text-2xl md:text-3xl font-bold tracking-tight uppercase">Google Cybersecurity Certificate Path</h3>
              <p className="text-muted text-sm max-w-md leading-relaxed">
                As I learned these concepts, I documented the journey through structured courses and practical exercises. This is the path I've taken so far.
              </p>
              <p className="text-[10px] text-muted font-mono hidden md:block pt-2">
                Scroll to explore • Use arrows to navigate
              </p>
            </div>
            <div className="flex items-center gap-4">
              {isPaused && (
                <span className="text-[9px] text-muted font-mono uppercase tracking-widest animate-pulse">
                  [ Paused ]
                </span>
              )}
              <div className="flex justify-center gap-3">
                <button onClick={() => { prevCert(); setIsPaused(true); }} className="px-4 py-2 border border-surface text-muted hover:text-foreground hover:border-muted transition-all font-mono text-[9px] uppercase active:scale-95 bg-surface rounded-sm">Prev</button>
                <button onClick={() => { nextCert(); setIsPaused(true); }} className="px-4 py-2 border border-surface text-muted hover:text-foreground hover:border-muted transition-all font-mono text-[9px] uppercase active:scale-95 bg-surface rounded-sm">Next</button>
              </div>
            </div>
          </div>

          <div 
            className="relative bg-surface border border-surface overflow-hidden rounded-md shadow-md group mx-auto"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-surface z-20">
                <div 
                  key={activeCert}
                  className="h-full transition-all ease-linear bg-[var(--accent)]"
                  style={{ 
                    animation: isPaused ? 'none' : 'progress 9s linear infinite',
                    width: isPaused ? '100%' : '0%',
                    opacity: isPaused ? 0.3 : 1 
                  }}
                />
            </div>

            <div className="bg-surface border-b border-surface px-4 py-3 flex items-center justify-between">
              <span className="font-mono text-[8px] text-muted tracking-widest uppercase italic">Certificate ID: {certificates[activeCert].id}</span>
            </div>

            <div className="relative w-full aspect-[4/3] md:aspect-[1.3/1] bg-surface">
              {isMounted && (
                <iframe
                  key={certificates[activeCert].path}
                  src={`${certificates[activeCert].path}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
                  className="absolute inset-0 w-full h-full border-none opacity-90 transition-opacity"
                  scrolling="no"
                  title={certificates[activeCert].title}
                />
              )}
            </div>

            <div className="p-6 bg-surface-strong border-t border-surface backdrop-blur-sm">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="space-y-3 text-left">
                        <h4 className="text-sm font-bold text-foreground uppercase tracking-tight">{certificates[activeCert].title}</h4>
                        <p className="text-[10px] text-muted font-mono">
                          Completed as part of structured learning
                        </p>
                        <div className="flex flex-wrap gap-2 pt-1">
                            {certificates[activeCert].skills.split(', ').map((skill, sIdx) => (
                                <span key={sIdx} className="text-[7px] font-mono px-2 py-0.5 bg-surface text-muted border border-surface rounded-sm">{skill}</span>
                            ))}
                        </div>
                    </div>
                    <a href={certificates[activeCert].path} target="_blank" rel="noopener noreferrer" className="w-full md:w-auto text-center px-4 py-2 bg-surface hover:bg-[var(--accent-soft)] border border-surface hover:border-[var(--accent)] hover:text-foreground text-[9px] font-mono uppercase transition-all whitespace-nowrap rounded-sm">View Certificate</a>
                </div>
            </div>
          </div>
          
          <p className="text-[11px] text-muted text-center font-mono mt-10 tracking-widest uppercase">
            I'm still at the beginning — but I'm building this every day.
          </p>
        </div>
      </div>

      <style jsx>{`
        .animate-scan { animation: scan 4s linear infinite; }
        @keyframes scan {
          0% { transform: translateY(-100%); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateY(1000%); opacity: 0; }
        }
        @keyframes progress {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
    </section>
  );
}