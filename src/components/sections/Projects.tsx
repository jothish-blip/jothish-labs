"use client";
import { MouseEvent, SetStateAction, useState, useEffect } from "react";

interface Asset {
  name: string;
  type: string;
  url: string;
  isPrimary: boolean;
}

// Centralized data for all case files
const caseFiles = [
  {
    id: "CASE-BT01",
    category: "SECURITY_AUDIT",
    title: "Botium Toys Audit",
    status: "CRITICAL_RISK",
    riskScore: "8/10",
    riskLevel: "HIGH",
    vulnerabilities: 4,
    controlsFailed: 4,
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
    ],
    assets: [
      { name: "Open_Full_Audit.pdf", type: "pdf", url: "/reports/botium-risk.pdf", isPrimary: true },
      { name: "Download_Checklist.pdf", type: "pdf", url: "/reports/botium-checklist.pdf", isPrimary: false }
    ]
  },
  {
    id: "CASE-DNS02",
    category: "NETWORK_ANALYSIS",
    title: "DNS Failure Analysis",
    status: "INVESTIGATED",
    riskScore: "6/10",
    riskLevel: "MODERATE",
    vulnerabilities: 2,
    controlsFailed: 1,
    description: "Analyze network traffic using tcpdump to identify why a website was unreachable. Focus on ICMP & UDP protocol investigation.",
    investigationNotes: "Users reported that the website was not loading, showing the error 'Destination port unreachable'. Traffic analysis revealed that the system sent DNS requests using UDP (port 53), but the DNS server responded with an ICMP error ('port 53 unreachable'). This indicates the DNS service was not accessible.",
    checklist: [
      { control: "tcpdump Capture", status: "YES", note: "Network traffic successfully captured" },
      { control: "UDP Inspection", status: "YES", note: "Identified port 53 requests" },
      { control: "ICMP Analysis", status: "YES", note: "Error response confirmed" },
      { control: "DNS Service", status: "NO", note: "Service down or unreachable" },
      { control: "Firewall Config", status: "NO", note: "Potential block on port 53" },
    ],
    recommendations: [
      "Restart the DNS service.",
      "Check firewall rules to ensure port 53 is open.",
      "Verify DNS server configuration parameters.",
      "Implement continuous monitoring for DNS availability."
    ],
    assets: [
      { name: "View_Traffic_Log.png", type: "image", url: "/reports/tcpdump-screenshot.png", isPrimary: true },
      { name: "Open_Analysis_Doc.pdf", type: "pdf", url: "/reports/dns-analysis.pdf", isPrimary: false }
    ]
  },
  {
    id: "CASE-LNX03",
    category: "LINUX_SECURITY",
    title: "Linux Permissions Hardening",
    status: "SECURED",
    riskScore: "7/10",
    riskLevel: "HIGH",
    vulnerabilities: 3,
    controlsFailed: 3,
    description: "System-wide audit and remediation of Linux file permissions to enforce the Principle of Least Privilege (PoLP).",
    investigationNotes: "Initial system scan revealed critical directory vulnerabilities where 'Others' and 'Group' had unauthorized write access. Sensitive hidden project files were exposed to the entire user environment. Remediation involved recursive permission stripping and specific owner-only locks.",
    checklist: [
      { control: "Permission Audit", status: "YES", note: "Used ls -la to map vulnerabilities" },
      { control: "Group Write Lock", status: "YES", note: "chmod g-w enforced on project root" },
      { control: "Others Access Strip", status: "YES", note: "chmod o-w applied to system drafts" },
      { control: "Hidden File Shield", status: "YES", note: ".project_x.txt restricted to owner" },
      { control: "Dir Access Control", status: "YES", note: "Restricted drafts directory to 700" },
    ],
    recommendations: [
      "Implement automated cron jobs to audit file permissions weekly.",
      "Standardize on 755 for public dirs and 700 for private data.",
      "Audit hidden files (.dotfiles) for SPII leaks.",
      "Enforce umask settings to prevent insecure default permissions."
    ],
    assets: [
      { name: "Open_Security_Report.pdf", type: "pdf", url: "/linux/project.pdf", isPrimary: true }
    ]
  }
];

export default function Projects() {
  const [openCaseId, setOpenCaseId] = useState<string | null>(null);
  const [viewerFile, setViewerFile] = useState<Asset | null>(null);

  // Lock background scroll when modal is open
  useEffect(() => {
    if (viewerFile) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [viewerFile]);

  const toggleCase = (id: string) => {
    setOpenCaseId(openCaseId === id ? null : id);
  };

  const openViewer = (file: Asset, e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setViewerFile(file);
  };

  const closeViewer = () => {
    setViewerFile(null);
  };

  return (
    <section id="projects" className="relative min-h-screen w-full bg-[#030303] text-white py-16 px-4 sm:px-6 md:px-12 lg:px-24 overflow-hidden border-t border-white/5">
      
      {/* BACKGROUND DEPTH */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60 pointer-events-none z-[1]"></div>
      <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] bg-cyan-900/[0.02] blur-[150px] rounded-full pointer-events-none"></div>

      <div className="relative z-10 max-w-6xl mx-auto">
        
        {/* HUD Header */}
        <div className="mb-24 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-cyan-500 rounded-full animate-ping shadow-[0_0_10px_rgba(6,182,212,0.5)]"></div>
            <span className="font-mono text-[10px] tracking-[0.5em] text-cyan-500 uppercase">// ACTIVE_INVESTIGATIONS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-6xl lg:text-[90px] font-black tracking-tighter uppercase leading-[0.8] mb-4">
            Case <span className="text-zinc-800 italic font-light">Files.</span>
          </h2>
          <p className="font-mono text-[10px] text-zinc-700 tracking-[0.3em]">
            SESSION_ID: 2026 // AUDIT_LOG_INITIALIZED
          </p>
        </div>

        {/* Dynamic Project List */}
        <div className="space-y-6">
          {caseFiles.map((projectCase) => {
            const isOpen = openCaseId === projectCase.id;

            return (
              <div 
                key={projectCase.id}
                className={`group relative border border-white/5 bg-[#080808] transition-all duration-700 rounded-sm overflow-hidden ${
                isOpen ? "ring-1 ring-cyan-900/40 shadow-[0_0_30px_rgba(6,182,212,0.03)]" : "hover:border-zinc-700 hover:scale-[1.01]"
              }`}>
                
                {/* Card Header */}
                <div 
                  className="p-5 sm:p-6 md:p-10 cursor-pointer flex flex-col md:flex-row justify-between gap-10"
                  onClick={() => toggleCase(projectCase.id)}
                >
                  <div className="space-y-8 flex-grow">
                    <div className="flex flex-wrap items-center gap-4">
                      <span className="font-mono text-[9px] bg-zinc-900 px-3 py-1 text-zinc-500 border border-white/5 uppercase tracking-widest">REF: {projectCase.id}</span>
                      <span className={`font-mono text-[9px] px-3 py-1 border uppercase tracking-widest ${
                        projectCase.status === 'CRITICAL_RISK' ? 'bg-red-950/20 text-red-500 border-red-500/30' : 
                        projectCase.status === 'SECURED' ? 'bg-emerald-950/20 text-emerald-500 border-emerald-500/30' :
                        'bg-amber-950/20 text-amber-500 border-amber-500/30'
                      }`}>
                        {projectCase.status}
                      </span>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-2xl sm:text-3xl md:text-5xl font-bold tracking-tight group-hover:text-cyan-400 transition-colors uppercase leading-none">
                        {projectCase.title}
                      </h3>
                      <p className="text-zinc-500 text-sm font-light max-w-2xl pt-2">
                        {projectCase.description}
                      </p>
                    </div>

                    {/* RISK SCORE VISUAL (Risk Bar) */}
                    <div className="max-w-xs pt-2">
                      <div className="flex justify-between text-[10px] font-mono text-zinc-500 mb-2 tracking-widest uppercase">
                        <span>RISK_EXPOSURE</span>
                        <span className={parseInt(projectCase.riskScore) >= 7 ? "text-red-500" : "text-amber-500"}>{projectCase.riskScore}</span>
                      </div>
                      <div className="w-full h-[3px] bg-zinc-900 overflow-hidden rounded-full">
                        <div 
                          className={`h-full ${parseInt(projectCase.riskScore) >= 7 ? "bg-red-600 shadow-[0_0_10px_rgba(220,38,38,0.5)]" : "bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]"}`}
                          style={{ width: `${(parseInt(projectCase.riskScore) / 10) * 100}%` }}
                        ></div>
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

                {/* EXPANDABLE CONTENT */}
                <div className={`transition-all duration-700 ease-in-out origin-top ${
                  isOpen ? "max-h-[2000px] opacity-100 scale-y-100" : "max-h-0 opacity-0 scale-y-0"
                }`}>
                  <div className="p-5 sm:p-6 md:p-10 bg-black/60 border-t border-white/5 space-y-20">
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16">
                      
                      {/* Left: Notes & Mitigation */}
                      <div className="space-y-12">
                        <div className="space-y-4">
                          <h4 className="font-mono text-[10px] text-cyan-700 tracking-[0.5em] uppercase">// INVESTIGATION_NOTES</h4>
                          <p className="text-zinc-400 text-base font-light leading-relaxed">
                            {projectCase.investigationNotes}
                          </p>
                        </div>

                        <div className="space-y-4">
                          <h4 className="font-mono text-[10px] text-zinc-800 tracking-[0.5em] uppercase">// RECOMMENDED_MITIGATION</h4>
                          <ul className="space-y-4">
                            {projectCase.recommendations.map((rec, i) => (
                              <li key={i} className="flex gap-4 text-xs text-zinc-500 font-mono hover:text-zinc-300 transition-colors">
                                <span className="text-cyan-900 font-bold">0{i+1}</span> {rec}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Right: The Live Result Dashboard */}
                      <div className="space-y-10">
                        {/* THREAT SUMMARY STRIP */}
                        <div className="flex flex-wrap gap-8 text-[9px] font-mono text-zinc-600 border-b border-zinc-900 pb-6 tracking-widest uppercase">
                          <div className="flex gap-2">THREATS: <span className={projectCase.riskLevel === 'HIGH' ? "text-red-900" : "text-amber-700"}>{projectCase.riskLevel}</span></div>
                          <div className="flex gap-2">VULNERABILITIES: <span className="text-zinc-400">{projectCase.vulnerabilities}</span></div>
                          <div className="flex gap-2">CONTROLS_FAILED: <span className="text-red-700">{projectCase.controlsFailed}</span></div>
                        </div>

                        <div className="space-y-2">
                          <h4 className="font-mono text-[10px] text-zinc-800 tracking-[0.5em] uppercase mb-4">// CONTROLS_VERIFICATION</h4>
                          <div className="border border-white/5 rounded-sm overflow-hidden bg-zinc-950/40">
                            {projectCase.checklist.map((item, i) => (
                              <div key={i} className="flex items-center justify-between px-8 py-5 border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors group/row">
                                <div className="flex items-center gap-4">
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

                    {/* ACTION BUTTONS (View/Download Documents) */}
                    <div className="flex flex-wrap gap-6 pt-12 border-t border-zinc-900/50">
                      {projectCase.assets.map((asset, i) => (
                        <button 
                          key={i}
                          onClick={(e) => openViewer(asset, e)}
                          className={`px-5 py-3 text-[9px] sm:text-[10px] font-bold tracking-[0.3em] uppercase transition-all active:scale-95 ${
                            asset.isPrimary 
                            ? "bg-white text-black hover:bg-cyan-500 shadow-[0_0_30px_rgba(0,255,255,0.05)]" 
                            : "border border-zinc-800 text-zinc-500 hover:text-white hover:border-zinc-400"
                          }`}
                        >
                          {asset.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 🟢 LOCAL VIEWER MODAL 🟢 */}
      {viewerFile && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col items-center justify-center p-0 md:p-8 overflow-hidden">
          
          <div className="w-full h-[100dvh] md:h-auto md:max-h-[95vh] md:w-[90vw] md:max-w-5xl bg-[#050505] md:border md:border-white/10 md:rounded-sm shadow-2xl flex flex-col overflow-hidden ring-0 md:ring-1 md:ring-cyan-900/50 relative">
            
            <div className="flex-none flex items-center justify-between p-4 md:p-5 border-b border-white/5 bg-[#0a0a0a]">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse"></div>
                <span className="font-mono text-[10px] md:text-xs text-zinc-400 tracking-widest uppercase truncate">
                  VIEWING_ASSET // {viewerFile.name}
                </span>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto bg-[#030303] flex flex-col relative" style={{ WebkitOverflowScrolling: "touch" }}>
              
              <div className="flex-none p-4 md:p-8 flex flex-col items-center justify-center">
                {viewerFile.type === 'image' ? (
                  <img 
                    src={viewerFile.url} 
                    alt={viewerFile.name} 
                    className="max-w-full h-auto object-contain border border-white/10 rounded-sm shadow-lg mx-auto block"
                  />
                ) : (
                  <div className="w-full h-[70vh] md:h-[75vh] relative rounded-sm overflow-hidden border border-white/10 bg-zinc-900/50 shadow-lg">
                    <iframe 
                      src={viewerFile.url} 
                      title={viewerFile.name}
                      className="w-full h-full border-none"
                    >
                      <div className="flex flex-col items-center justify-center h-full space-y-4 text-center p-4">
                        <p className="font-mono text-zinc-400">Unable to render PDF inline.</p>
                        <a href={viewerFile.url} target="_blank" className="text-cyan-500 underline font-mono text-xs">Download to view</a>
                      </div>
                    </iframe>
                  </div>
                )}
              </div>

              <div className="flex-none border-t border-white/5 bg-[#080808] p-4 sm:p-8 flex flex-row justify-end gap-4 mt-auto">
                <button 
                  onClick={closeViewer}
                  className="flex-1 sm:flex-none sm:w-auto px-4 sm:px-8 py-4 text-xs border border-white/20 text-white transition-colors hover:bg-white/10 active:bg-white/20 tracking-widest uppercase font-mono rounded-sm shadow-md"
                >
                  Close
                </button>

                <a 
                  href={viewerFile.url}
                  download
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 sm:flex-none sm:w-auto px-4 sm:px-8 py-4 text-xs bg-cyan-500 text-black transition-colors hover:bg-cyan-400 active:bg-cyan-600 tracking-widest uppercase font-mono font-bold rounded-sm shadow-md flex items-center justify-center text-center"
                >
                  Download
                </a>
              </div>

            </div>
          </div>
        </div>
      )}
    </section>
  );
}