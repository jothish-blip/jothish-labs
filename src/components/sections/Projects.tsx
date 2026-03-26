"use client";
import { useState } from "react";

const botiumCase = {
  id: "CASE-BT01",
  category: "SECURITY_AUDIT",
  title: "Botium Toys Audit",
  status: "CRITICAL_RISK",
  riskScore: "8/10",
  description: "Comprehensive security audit for Botium Toys to assess assets, internal networks, and compliance posture against NIST CSF.",
  investigationNotes: "The audit revealed a high-risk score due to inadequate asset management and lack of core technical controls. Key vulnerabilities include unencrypted PII/SPII and absent disaster recovery protocols.",
  
  checklist: [
    { control: "Firewall", status: "YES", note: "Security rules defined" },
    { control: "Antivirus Software", status: "YES", note: "Monitored regularly" },
    { control: "Least Privilege", status: "NO", note: "Unrestricted internal data access" },
    { control: "Data Encryption", status: "NO", note: "Local PII stored in plaintext" },
    { control: "Intrusion Detection", status: "NO", note: "IDS not implemented" },
    { control: "Disaster Recovery", status: "NO", note: "No backups or recovery plan" },
  ],

  recommendations: [
    "Enforce Least Privilege and Separation of Duties.",
    "Deploy AES-256 encryption for PCI DSS compliance.",
    "Establish a centralized Password Management system.",
    "Develop a Disaster Recovery and Backup strategy."
  ]
};

export default function Projects() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section id="projects" className="relative min-h-screen w-full bg-[#030303] text-white py-32 px-6 md:px-16 lg:px-32 overflow-hidden border-t border-white/5">
      
      {/* 🔥 7. BACKGROUND DEPTH */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60 pointer-events-none z-[1]"></div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* HUD Header */}
        <div className="mb-24 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-cyan-500 rounded-full animate-ping shadow-[0_0_10px_rgba(6,182,212,0.5)]"></div>
            <span className="font-mono text-[10px] tracking-[0.5em] text-cyan-500 uppercase">// ACTIVE_INVESTIGATIONS</span>
          </div>
          <h2 className="text-5xl md:text-[90px] font-black tracking-tighter uppercase leading-[0.8] mb-4">
            Case <span className="text-zinc-800 italic font-light">Files.</span>
          </h2>
          {/* 🔥 4. CASE TIMESTAMP */}
          <p className="font-mono text-[10px] text-zinc-700 tracking-[0.3em]">
            SESSION_ID: 2026 // AUDIT_LOG_INITIALIZED
          </p>
        </div>

        {/* 🔥 8. MICRO INTERACTION (Scale on hover) */}
        <div className={`group relative border border-white/5 bg-[#080808] transition-all duration-700 rounded-sm overflow-hidden ${
          isOpen ? "ring-1 ring-cyan-900/40" : "hover:border-zinc-700 hover:scale-[1.01]"
        }`}>
          
          {/* Card Header */}
          <div 
            className="p-8 md:p-14 cursor-pointer flex flex-col md:flex-row justify-between gap-10"
            onClick={() => setIsOpen(!isOpen)}
          >
            <div className="space-y-8 flex-grow">
              <div className="flex flex-wrap items-center gap-4">
                <span className="font-mono text-[9px] bg-zinc-900 px-3 py-1 text-zinc-500 border border-white/5 uppercase tracking-widest">REF: {botiumCase.id}</span>
                <span className="font-mono text-[9px] bg-red-950/20 px-3 py-1 text-red-500 border border-red-500/30 uppercase tracking-widest">{botiumCase.status}</span>
              </div>

              <h3 className="text-4xl md:text-7xl font-bold tracking-tight group-hover:text-cyan-400 transition-colors uppercase leading-none">
                {botiumCase.title}
              </h3>

              {/* 🔥 1. RISK SCORE VISUAL (Risk Bar) */}
              <div className="max-w-xs pt-4">
                <div className="flex justify-between text-[10px] font-mono text-zinc-500 mb-2 tracking-widest uppercase">
                  <span>RISK_EXPOSURE</span>
                  <span className="text-red-500">{botiumCase.riskScore}</span>
                </div>
                <div className="w-full h-[3px] bg-zinc-900 overflow-hidden rounded-full">
                  <div className="h-full w-[80%] bg-red-600 shadow-[0_0_10px_rgba(220,38,38,0.5)]"></div>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-end justify-between py-2">
              <div className={`w-14 h-14 rounded-full border border-zinc-900 flex items-center justify-center transition-all duration-500 bg-black ${isOpen ? "rotate-45 border-cyan-900" : "group-hover:border-zinc-500"}`}>
                 <span className={`text-4xl font-light transition-colors ${isOpen ? "text-cyan-500" : "text-zinc-800"}`}>+</span>
              </div>
              <span className="font-mono text-[9px] text-zinc-800 tracking-[0.4em] hidden md:block uppercase">View_Full_Dossier</span>
            </div>
          </div>

          {/* 🔥 3. ANIMATION UPGRADE (Origin Top) */}
          <div className={`transition-all duration-700 ease-in-out origin-top ${
            isOpen ? "max-h-[2000px] opacity-100 scale-y-100" : "max-h-0 opacity-0 scale-y-0"
          }`}>
            <div className="p-8 md:p-14 bg-black/60 border-t border-white/5 space-y-20">
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
                
                {/* Left: Notes & Mitigation */}
                <div className="space-y-12">
                  <div className="space-y-4">
                    <h4 className="font-mono text-[10px] text-cyan-700 tracking-[0.5em] uppercase">// INVESTIGATION_NOTES</h4>
                    <p className="text-zinc-500 text-lg font-light leading-relaxed">
                      {botiumCase.investigationNotes}
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-mono text-[10px] text-zinc-800 tracking-[0.5em] uppercase">// RECOMMENDED_MITIGATION</h4>
                    <ul className="space-y-4">
                      {botiumCase.recommendations.map((rec, i) => (
                        <li key={i} className="flex gap-4 text-xs text-zinc-600 font-mono hover:text-zinc-400 transition-colors">
                          <span className="text-cyan-900 font-bold">0{i+1}</span> {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Right: The Live Result Dashboard */}
                <div className="space-y-10">
                  {/* 🔥 6. THREAT SUMMARY STRIP */}
                  <div className="flex flex-wrap gap-8 text-[9px] font-mono text-zinc-600 border-b border-zinc-900 pb-6 tracking-widest uppercase">
                    <div className="flex gap-2">THREATS: <span className="text-red-900">HIGH</span></div>
                    <div className="flex gap-2">VULNERABILITIES: <span className="text-zinc-400">4</span></div>
                    <div className="flex gap-2">CONTROLS_FAILED: <span className="text-red-700">4</span></div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-mono text-[10px] text-zinc-800 tracking-[0.5em] uppercase mb-4">// CONTROLS_VERIFICATION</h4>
                    <div className="border border-white/5 rounded-sm overflow-hidden bg-zinc-950/40">
                      {botiumCase.checklist.map((item, i) => (
                        <div key={i} className="flex items-center justify-between px-8 py-5 border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors group/row">
                          <div className="flex items-center gap-4">
                            {/* 🔥 2. SEVERITY DOT */}
                            <div className={`w-1.5 h-1.5 rounded-full ${item.status === "YES" ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "bg-red-600 shadow-[0_0_8px_rgba(220,38,38,0.5)]"}`} />
                            <div className="space-y-1">
                              <p className="text-xs font-bold text-zinc-300 uppercase tracking-tight group-hover/row:text-white transition-colors">{item.control}</p>
                              <p className="text-[10px] font-mono text-zinc-600 italic tracking-wide">{item.note}</p>
                            </div>
                          </div>
                          <div className={`font-mono text-[9px] px-3 py-1 rounded-sm border tracking-widest ${item.status === "YES" ? "border-emerald-500/20 text-emerald-500 bg-emerald-500/5" : "border-red-900/20 text-red-700 bg-red-950/5"}`}>
                            {item.status === "YES" ? "PASS" : "FAIL"}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* 🔥 5. ACTION BUTTONS UPGRADE */}
              <div className="flex flex-wrap gap-6 pt-12 border-t border-zinc-900/50">
                 <a 
                   href="/reports/botium-risk.pdf" 
                   target="_blank" 
                   className="px-8 py-4 bg-white text-black text-[10px] font-bold tracking-[0.3em] uppercase hover:bg-cyan-500 hover:text-black transition-all shadow-[0_0_30px_rgba(0,255,255,0.05)] active:scale-95"
                 >
                   Open_Full_Audit.pdf
                 </a>
                 <a 
                   href="/reports/botium-checklist.pdf" 
                   target="_blank" 
                   className="px-8 py-4 border border-zinc-800 text-zinc-500 text-[10px] font-bold tracking-[0.3em] uppercase hover:text-white hover:border-zinc-400 transition-all active:scale-95"
                 >
                   Download_Checklist.pdf
                 </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Background Decorative Aura */}
      <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] bg-cyan-900/[0.02] blur-[150px] rounded-full pointer-events-none"></div>
    </section>
  );
}