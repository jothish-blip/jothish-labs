"use client";
import { useEffect, useState, useCallback } from "react";

// 1. PROJECT ASSETS
const certificates = [
  { id: "G01", title: "Foundations of Cybersecurity", src: "/certs/g01.png" },
  { id: "G02", title: "Play It Safe: Manage Security Risks", src: "/certs/g02.png" },
  { id: "G03", title: "Connect and Protect: Networks", src: "/certs/g03.png" },
  { id: "G04", title: "Tools of the Trade: Linux and SQL", src: "/certs/g04.png" },
  { id: "G05", title: "Assets, Threats, and Vulnerabilities", src: "/certs/g05.png" },
  { id: "G06", title: "Sound the Alarm: Detection and Response", src: "/certs/g06.png" },
  { id: "G07", title: "Automate Tasks with Python", src: "/certs/g07.png" },
  { id: "G08", title: "Put It to Work: Job Prep", src: "/certs/g08.png" },
  { id: "G09", title: "Google Professional Capstone", src: "/certs/g09.png" },
];

export default function About() {
  const [isMounted, setIsMounted] = useState(false);
  const [activeCert, setActiveCert] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

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
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") nextCert();
      if (e.key === "ArrowLeft") prevCert();
      if (e.key === "Escape") setLightboxOpen(false);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [nextCert, prevCert]);

  return (
    <section id="about" className="relative min-h-screen w-full bg-[#030303] text-white py-32 px-6 md:px-16 lg:px-32 overflow-hidden border-t border-white/5">
      
      {/* Background Texture */}
      <div className="absolute inset-0 z-0 opacity-[0.012] pointer-events-none bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:70px_70px]"></div>

      <div className={`relative z-10 max-w-6xl mx-auto space-y-32 transition-all duration-1000 ${isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        
        {/* [1] IDENTITY BLOCK */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          <div className="lg:col-span-7 space-y-12">
            <div className="space-y-4">
              <div className="font-mono text-[10px] text-zinc-700 tracking-[0.4em] mb-6 animate-pulse uppercase">
                // ANALYST_MANIFESTO_v1.1
              </div>
              
              <div className="flex items-center gap-3 mb-2">
                <span className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(6,182,212,0.5)]"></span>
                <span className="font-mono text-[9px] tracking-[0.4em] text-cyan-500 uppercase">Adaptive Neural Learning Engaged</span>
              </div>

              <h2 className="text-6xl md:text-8xl font-black tracking-tighter uppercase leading-[0.85]">
                Jothish <span className="text-zinc-600 italic font-light">Gandham</span>
              </h2>
            </div>
            
            <div className="space-y-8">
              <div className="border-l border-zinc-900 pl-8 space-y-6">
                <p className="text-zinc-400 text-lg md:text-xl font-light leading-relaxed">
                  B.Tech undergraduate at <span className="text-white">Sandip University</span>. 
                  My core strength lies in <span className="text-cyan-500">rapid technical assimilation</span>. In the world of cybersecurity where threats evolve hourly, I pride myself on being a <span className="text-white">quick learner</span> who can pivot between defense strategies with high adaptability.
                </p>
                <p className="text-zinc-500 text-base leading-relaxed font-light italic">
                  "The ability to learn, unlearn, and relearn is the strongest weapon in an analyst's toolkit. I don't just study protocols; I adapt to them."
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                 <div className="bg-white/[0.02] border border-white/5 p-6 space-y-3">
                    <h5 className="font-mono text-[10px] text-zinc-400 uppercase tracking-widest underline decoration-zinc-800 underline-offset-4">Rapid Adaptation</h5>
                    <p className="text-xs text-zinc-600 leading-relaxed font-light">
                      Possessing the agility to master new tools and environments 
                      under pressure. From zero-day awareness to rapid scripting, 
                      I close the gap between problem and solution.
                    </p>
                 </div>
                 <div className="bg-white/[0.02] border border-white/5 p-6 space-y-3">
                    <h5 className="font-mono text-[10px] text-zinc-400 uppercase tracking-widest underline decoration-zinc-800 underline-offset-4">Continuous Feedback</h5>
                    <p className="text-xs text-zinc-600 leading-relaxed font-light">
                      Every challenge is a data point. I optimize my learning curve 
                      by iterating through real-world lab failures until precision is achieved.
                    </p>
                 </div>
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-5 space-y-8">
            <div className="bg-white/[0.01] backdrop-blur-md border border-white/[0.03] p-8 space-y-8 rounded-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-[1px] bg-cyan-500/20 animate-[scan_4s_linear_infinite]"></div>
              
              <h4 className="font-mono text-[9px] tracking-[0.4em] text-zinc-500 uppercase underline underline-offset-8 decoration-zinc-800">Operational Dossier</h4>
              
              <div className="space-y-6 font-mono text-[10px]">
                <div className="space-y-4">
                  <div className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-zinc-700 uppercase">Core_Affiliation</span>
                    <span className="text-zinc-400">Sandip University (B.Tech)</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-zinc-700 uppercase">Education_Track</span>
                    <span className="text-zinc-400">2024 — 2028</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-zinc-700 uppercase">Learning_Velocity</span>
                    <span className="text-cyan-500 uppercase tracking-tighter">Accelerated / High</span>
                  </div>
                </div>

                <div className="pt-6 space-y-4">
                   <h5 className="text-[9px] text-cyan-900 tracking-[0.3em] uppercase">// FUTURE_PHASE_OBJECTIVES</h5>
                   <ul className="space-y-3 text-zinc-500">
                      <li className="flex gap-3">
                        <span className="text-cyan-950">01</span>
                        <span>Mastering Cloud Security Architectures (AWS/GCP)</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="text-cyan-950">02</span>
                        <span>Contributing to Open Source Forensics Tooling</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="text-cyan-950">03</span>
                        <span>Achieving OSCP / CISSP Red-Team Proficiency</span>
                      </li>
                   </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* [2] TACTICAL ARSENAL */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 py-20 border-y border-zinc-900/50">
          <div className="space-y-8">
            <h4 className="font-mono text-[10px] tracking-[0.4em] text-zinc-700 uppercase">// PRACTICAL_APPLICATION</h4>
            <ul className="space-y-4 font-mono text-xs text-zinc-500">
              {[
                { label: "Analyzing packets using", tool: "Wireshark" },
                { label: "Scanning networks using", tool: "Nmap" },
                { label: "Working in", tool: "Kali Linux environment" }
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 group hover:translate-x-1 transition-all cursor-default">
                  <div className="w-1 h-1 bg-cyan-950 group-hover:bg-cyan-500 transition-colors"></div> 
                  {item.label} <span className="text-zinc-200 group-hover:text-cyan-400 transition-colors">{item.tool}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-6">
             <h4 className="font-mono text-[10px] tracking-[0.4em] text-zinc-700 uppercase">// METHODOLOGY</h4>
             <p className="text-zinc-500 text-sm leading-relaxed max-w-sm font-light">
                Utilizing <span className="text-zinc-300">Google Cybersecurity Framework</span> to bridge the gap between theoretical risk and 
                <span className="text-zinc-300 italic"> technical mitigation</span>. Focused on automating repetitive defense tasks.
             </p>
          </div>
        </div>

        {/* [4] BEHAVIORAL ANALYTICS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="space-y-6">
            <h4 className="font-mono text-[10px] tracking-[0.4em] text-zinc-700 uppercase">// BEHAVIORAL_METRICS</h4>
            <p className="text-zinc-500 text-sm font-light leading-relaxed">
              Technical skill is only half the battle. I focus on developing the <span className="text-white">adversarial mindset</span> required to stay ahead of modern threats.
            </p>
          </div>
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: "Adaptability", desc: "Instinctively pivoting to new environments and unexpected security vectors." },
              { title: "Quick Learning", desc: "Aggressive absorption of complex technical documentation and hands-on tools." },
              { title: "Persistence", desc: "Deep-diving into complex logs until the anomaly is found." }
            ].map((trait, i) => (
              <div key={i} className="p-6 border border-zinc-900 bg-white/[0.01] hover:border-cyan-900/30 transition-colors">
                <h5 className="text-cyan-500 font-mono text-[10px] uppercase mb-3">{trait.title}</h5>
                <p className="text-zinc-600 text-xs leading-relaxed">{trait.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* [5] R&D PIPELINE */}
        <div className="bg-[#050505] border-l border-cyan-900/30 p-10 md:p-16 space-y-10">
          <div className="max-w-2xl space-y-4">
            <h4 className="font-mono text-[10px] tracking-[0.4em] text-cyan-600 uppercase">// R&D_PIPELINE_ACTIVE</h4>
            <h3 className="text-4xl font-bold tracking-tight">Constant Evolution Protocol</h3>
            <p className="text-zinc-500 text-lg font-light">
              I am currently expanding my research beyond the standard curriculum to include:
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-4">
              <h5 className="font-mono text-[11px] text-zinc-400 uppercase">01. Automated Forensics</h5>
              <p className="text-zinc-600 text-sm font-light">
                Exploring Python libraries like <span className="text-zinc-400 italic">Volatility</span> and <span className="text-zinc-400 italic">Autopsy</span> to speed up disk and memory image analysis.
              </p>
            </div>
            <div className="space-y-4">
              <h5 className="font-mono text-[11px] text-zinc-400 uppercase">02. Network Traffic Fingerprinting</h5>
              <p className="text-zinc-600 text-sm font-light">
                Learning to identify C2 (Command & Control) traffic patterns hidden within normal HTTPS and DNS traffic streams.
              </p>
            </div>
          </div>
        </div>

        {/* [3] CREDENTIAL FOCUS AREA */}
        <div className="space-y-12 pb-20">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2">
              <p className="font-mono text-[10px] tracking-[0.4em] text-cyan-600 uppercase">// CREDENTIAL_VERIFICATION</p>
              <h3 className="text-3xl md:text-3xl font-bold tracking-tight uppercase">Google Professional Certificates</h3>
            </div>
            <div className="flex gap-4">
              <button onClick={prevCert} className="px-5 py-3 border border-zinc-900 text-zinc-600 hover:text-white hover:border-zinc-400 transition-all font-mono text-[9px] tracking-widest uppercase active:scale-95">Prev_Node</button>
              <button onClick={nextCert} className="px-5 py-3 border border-zinc-900 text-zinc-600 hover:text-white hover:border-zinc-400 transition-all font-mono text-[9px] tracking-widest uppercase active:scale-95">Next_Node</button>
            </div>
          </div>

          <div 
            className="relative bg-white/[0.01] border border-zinc-900 group cursor-zoom-in transition-all duration-500 hover:border-cyan-900/40 overflow-hidden rounded-sm"
            onClick={() => setLightboxOpen(true)}
          >
            <div className="aspect-[16/10] md:aspect-[16/8] w-full bg-black relative overflow-hidden flex items-center justify-center">
              <img 
                src={certificates[activeCert].src} 
                alt={certificates[activeCert].title}
                className="w-full h-full object-contain opacity-75 group-hover:opacity-100 group-hover:scale-[1.02] transition-all duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent flex flex-col justify-end p-8 md:p-14 pointer-events-none">
                <span className="font-mono text-[8px] text-white/10 tracking-[0.8em] mb-3 uppercase tracking-tighter">NODE_REF: {certificates[activeCert].id}</span>
                <h4 className="text-2xl md:text-4xl font-black uppercase tracking-tighter max-w-3xl leading-none">
                  {certificates[activeCert].title}
                </h4>
              </div>
            </div>
          </div>

          <div className="flex justify-center gap-3">
            {certificates.map((_, idx) => (
              <div key={idx} className={`h-1 transition-all duration-700 ${activeCert === idx ? 'w-16 bg-cyan-900/50' : 'w-2 bg-zinc-900'}`} />
            ))}
          </div>
        </div>
      </div>

      {/* Lightbox Component */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-[1000] bg-black/98 backdrop-blur-2xl flex flex-col items-center justify-center p-6 md:p-12 cursor-zoom-out" onClick={() => setLightboxOpen(false)}>
          <button className="absolute top-10 right-10 text-white/20 hover:text-white transition-all p-4">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <img 
            src={certificates[activeCert].src} 
            alt="Expanded Certificate"
            className="max-w-full max-h-[85vh] object-contain shadow-[0_0_100px_rgba(0,0,0,0.5)]" 
            onClick={(e) => e.stopPropagation()} 
          />
          
          <div className="mt-8 font-mono text-[10px] text-zinc-500 uppercase tracking-widest text-center px-6">
            {certificates[activeCert].title}
          </div>
        </div>
      )}
    </section>
  );
}