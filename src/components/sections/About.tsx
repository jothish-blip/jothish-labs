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
    const interval = setInterval(nextCert, 7000);
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
    <section id="about" className="relative min-h-screen w-full bg-[#030303] text-white py-32 px-6 md:px-16 lg:px-32 overflow-hidden border-t border-white/5 font-sans">
      
      <div className="absolute inset-0 z-0 opacity-[0.012] pointer-events-none bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:70px_70px]"></div>

      <div className={`relative z-10 max-w-7xl mx-auto space-y-24 transition-all duration-1000 ${isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        
        {/* [1] IDENTITY BLOCK - 3 COLUMN LAYOUT */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 items-start">
          
          {/* LEFT: TEXT DATA */}
          <div className="lg:col-span-5 space-y-8 order-2 lg:order-1">
            <div className="space-y-4">
              <div className="font-mono text-[10px] text-cyan-500 tracking-[0.4em] uppercase">// ANALYST_IDENTITY_VERIFIED</div>
              <h2 className="text-6xl lg:text-7xl font-black tracking-tighter uppercase leading-[0.85]">
                Jothish <span className="text-zinc-600 italic font-light">Gandham</span>
              </h2>
              <div className="font-mono text-xs text-zinc-400 tracking-tight border-y border-white/5 py-3">
                Aspiring Security Analyst | <span className="text-cyan-500 font-bold">Blue Team Focus</span>
              </div>
            </div>
            
            <div className="border-l-2 border-cyan-900 pl-8 space-y-6">
              <p className="text-zinc-400 text-lg font-light leading-relaxed">
                B.Tech undergraduate at <span className="text-white font-medium">Sandip University</span> with hands-on experience in 
                Linux, networking fundamentals, and security analysis. Active learner in threat detection and incident response workflows.
              </p>

              <div className="flex flex-wrap gap-3 pt-2">
                {["Quick Learner", "Consistent Discipline", "Analytical Mindset", "Builder Mentality"].map((trait) => (
                  <span key={trait} className="text-[9px] font-mono px-3 py-1 border border-cyan-900/40 text-cyan-500 bg-cyan-950/10 uppercase tracking-widest">
                    {trait}
                  </span>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-6 pt-6">
                <a href="https://github.com/jothish-blip" target="_blank" className="font-mono text-[10px] text-zinc-500 hover:text-cyan-500 transition-colors uppercase tracking-widest">[ github ]</a>
                <a href="https://www.linkedin.com/in/jothish-gandham-5b90b334a/" target="_blank" className="font-mono text-[10px] text-zinc-500 hover:text-cyan-500 transition-colors uppercase tracking-widest">[ linkedin ]</a>
                <a href="/resume.pdf" target="_blank" className="font-mono text-[10px] text-cyan-500 border border-cyan-900/40 px-3 py-1 hover:bg-cyan-500/10 transition-all uppercase tracking-widest">
                  [ access_resume ]
                </a>
              </div>
            </div>
          </div>

          {/* CENTER: PROFILE PHOTO (Added as requested) */}
          <div className="lg:col-span-3 order-1 lg:order-2">
            <div className="relative group max-w-[280px] mx-auto lg:mx-0">
                {/* Secure Frame */}
                <div className="absolute -inset-2 border border-cyan-500/10 opacity-50 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                <div className="relative border border-white/10 p-2 bg-zinc-950/50 backdrop-blur-sm overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-[1px] bg-cyan-500/30 animate-scan z-10 pointer-events-none"></div>
                    <img 
                        src="https://i.pinimg.com/1200x/27/74/3e/27743e3a002888b26448f35e0fe41137.jpg" 
                        alt="Jothish Gandham"
                        className="w-full h-auto object-cover grayscale brightness-75 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-700 ease-in-out border border-white/5"
                    />
                </div>
                <div className="mt-3 flex justify-between items-center px-1 font-mono text-[8px] text-zinc-600 uppercase tracking-[0.2em]">
                    <span>Asset_01.jpg</span>
                    <span className="text-cyan-900">Verified_Live</span>
                </div>
            </div>
          </div>

          {/* RIGHT: EDUCATION & STATUS */}
          <div className="lg:col-span-4 space-y-10 order-3 border-l border-zinc-900/50 pl-6 lg:pl-10">
            <div className="space-y-8">
                <h4 className="font-mono text-[10px] text-cyan-600 uppercase tracking-[0.4em]">// EDUCATION_LOG</h4>
                <div className="space-y-6 font-mono text-[11px]">
                <div className="relative">
                    <span className="absolute -left-[30px] top-1 w-2 h-2 bg-cyan-500 rounded-full"></span>
                    <p className="text-zinc-300 font-bold leading-tight">B.Tech CSE (Cyber Security)</p>
                    <p className="text-zinc-500">Sandip University, Nashik</p>
                    <p className="text-zinc-600 text-[10px]">2024 — 2028</p>
                </div>
                <div className="relative opacity-70">
                    <span className="absolute -left-[30px] top-1 w-2 h-2 bg-cyan-900 rounded-full"></span>
                    <p className="text-zinc-300 font-bold leading-tight">Intermediate (MPC)</p>
                    <p className="text-zinc-500">Narayana Junior College, Vijayawada</p>
                    <p className="text-zinc-600 text-[10px]">2022 — 2024</p>
                </div>
                </div>
            </div>
            
            <div className="p-4 bg-white/[0.02] border border-white/5">
                <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-1">Status:</p>
                <p className="text-[11px] font-mono text-cyan-500 uppercase tracking-widest font-bold animate-pulse">
                    Open to Summer 2026 Internships
                </p>
            </div>
          </div>
        </div>

        {/* [2] TOOLKIT & ANALYSIS CASE */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start py-16 border-y border-zinc-900/50">
          <div className="lg:col-span-4 space-y-6">
            <h4 className="font-mono text-[10px] text-zinc-700 uppercase tracking-widest">// CURRENT_PHASE</h4>
            <ul className="space-y-4 font-mono text-[10px] text-zinc-400">
              <li className="flex gap-3"><span className="text-cyan-900">01</span> <span>Active Labs: TryHackMe (SOC Level 1)</span></li>
              <li className="flex gap-3"><span className="text-cyan-900">02</span> <span>SIEM: Exploring Splunk Dashboards</span></li>
              <li className="flex gap-3"><span className="text-cyan-900">03</span> <span>Tooling: Mastering Wireshark filtering</span></li>
            </ul>
          </div>

          <div className="lg:col-span-5 space-y-6">
            <h4 className="font-mono text-[10px] text-zinc-700 uppercase tracking-widest">// TOOLKIT_STRENGTH</h4>
            <div className="grid grid-cols-3 gap-3">
              {[
                { name: "Linux", lv: "Int" }, { name: "Wireshark", lv: "Beg" },
                { name: "SQL", lv: "Int" }, { name: "Python", lv: "Beg" },
                { name: "Nmap", lv: "Beg" }, { name: "TCP/IP", lv: "Int" }
              ].map((tool) => (
                <div key={tool.name} className="p-2 border border-white/5 bg-white/[0.01]">
                  <p className="text-[9px] text-white font-mono uppercase">{tool.name}</p>
                  <p className="text-[7px] text-cyan-700 font-mono uppercase tracking-tighter">{tool.lv}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-3 bg-cyan-950/5 border border-cyan-900/20 p-6 rounded-sm">
             <h4 className="font-mono text-[9px] text-cyan-700 uppercase tracking-widest mb-3">// MOCK_ANALYSIS</h4>
             <div className="space-y-2 font-mono text-[10px] text-zinc-500 italic">
                <p className="text-zinc-400 border-b border-white/5 pb-1 italic leading-tight">Scenario: Brute-Force Detection</p>
                <p>» Identified 50+ failed logins / 2m</p>
                <p>» Classification: True Positive.</p>
             </div>
          </div>
        </div>

        {/* [3] EVIDENCE VIEWING NODES */}
        <div className="space-y-12 pb-20 max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-4">
            <div className="space-y-2 text-center md:text-left">
              <p className="font-mono text-[10px] tracking-[0.4em] text-cyan-600 uppercase">// EVIDENCE_VERIFICATION</p>
              <h3 className="text-2xl md:text-3xl font-bold tracking-tight uppercase">Google Cybersecurity Stack</h3>
            </div>
            <div className="flex justify-center gap-3">
              <button onClick={() => { prevCert(); setIsPaused(true); }} className="px-4 py-2 border border-zinc-900 text-zinc-600 hover:text-white hover:border-zinc-400 transition-all font-mono text-[9px] uppercase active:scale-95">Prev</button>
              <button onClick={() => { nextCert(); setIsPaused(true); }} className="px-4 py-2 border border-zinc-900 text-zinc-600 hover:text-white hover:border-zinc-400 transition-all font-mono text-[9px] uppercase active:scale-95">Next</button>
            </div>
          </div>

          <div 
            className="relative bg-black border border-white/10 overflow-hidden rounded-md shadow-2xl mx-auto group"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-white/5 z-20">
                <div 
                  key={activeCert}
                  className="h-full bg-cyan-500 transition-all ease-linear"
                  style={{ 
                    animation: isPaused ? 'none' : 'progress 7s linear infinite',
                    width: isPaused ? '100%' : '0%',
                    opacity: isPaused ? 0.3 : 1 
                  }}
                />
            </div>

            <div className="bg-zinc-900/50 border-b border-white/5 px-4 py-3 flex items-center justify-between">
              <span className="font-mono text-[8px] text-zinc-600 tracking-widest uppercase italic">NODE: {certificates[activeCert].id} // DOC_SECURE_VIEW</span>
            </div>

            <div className="relative w-full aspect-[1.414/1] bg-[#080808]">
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

            <div className="p-6 bg-zinc-950/60 border-t border-white/5 backdrop-blur-md">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="space-y-3 text-left">
                        <h4 className="text-sm font-bold text-white uppercase tracking-tight">{certificates[activeCert].title}</h4>
                        <div className="flex flex-wrap gap-2">
                            {certificates[activeCert].skills.split(', ').map((skill, sIdx) => (
                                <span key={sIdx} className="text-[7px] font-mono px-2 py-0.5 bg-cyan-950/20 text-cyan-600 border border-cyan-900/30 rounded-sm">{skill}</span>
                            ))}
                        </div>
                    </div>
                    <a href={certificates[activeCert].path} target="_blank" rel="noopener noreferrer" className="w-full md:w-auto text-center px-4 py-2 bg-white/5 hover:bg-cyan-500/20 border border-white/10 text-[9px] font-mono uppercase transition-all whitespace-nowrap">Download_Evidence</a>
                </div>
            </div>
          </div>
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