"use client";

import React, { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Globe, 
  Download, 
  ArrowLeft, 
  ShieldCheck,
  Briefcase,
  GraduationCap
} from "lucide-react";

// Custom SVGs to bypass lucide-react brand export errors
const GithubIcon = ({ className, size = 24 }: { className?: string, size?: number }) => (
  <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3-.3 6-1.5 6-6.5a5.4 5.4 0 0 0-1.5-3.8 5.3 5.3 0 0 0-.1-3.8s-1.2-.4-3.9 1.4a13.3 13.3 0 0 0-7 0C6.2 1.6 5 2 5 2a5.3 5.3 0 0 0-.1 3.8A5.4 5.4 0 0 0 3.5 9.5c0 5 3 6.2 6 6.5a4.8 4.8 0 0 0-1 3.2v4"></path>
    <path d="M9 18c-4.5 1.6-5-2.5-7-3"></path>
  </svg>
);

const LinkedinIcon = ({ className, size = 24 }: { className?: string, size?: number }) => (
  <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
    <rect width="4" height="12" x="2" y="9"></rect>
    <circle cx="4" cy="4" r="2"></circle>
  </svg>
);

function SmartBackButton() {
  const searchParams = useSearchParams();
  const fromTerminal = searchParams.get("from") === "terminal";

  if (fromTerminal) {
    return (
      <Link 
        href="/#terminal" 
        className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.24em] text-muted hover:text-foreground transition-colors group w-fit"
      >
        <span className="p-2 rounded-sm border border-surface bg-surface/20 group-hover:bg-surface transition-colors">
          <ArrowLeft size={14} />
        </span>
        Return to Terminal
      </Link>
    );
  }

  return (
    <Link 
      href="/" 
      className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.24em] text-muted hover:text-foreground transition-colors group w-fit"
    >
      <span className="p-2 rounded-sm border border-surface bg-surface/20 group-hover:bg-surface transition-colors">
        <ArrowLeft size={14} />
      </span>
      Back to Portfolio
    </Link>
  );
}

export default function ResumePage() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
  }, []);

  return (
    <div className="relative min-h-screen w-full bg-background text-foreground selection:bg-blue-500/30 font-sans overflow-hidden">
      
      {/* LOCAL STYLES: Defining the Resume specific accent (Dark Slate Blue adapted for dark/light mode) */}
      <style>{`
        :root {
          --accent-resume: #1f4e79; /* Original Dark Slate Blue for Light Mode */
        }
        html.dark {
          --accent-resume: #3b82f6; /* Brighter Blue for Dark Mode */
        }
        .resume-link {
          color: var(--accent-resume);
          text-decoration: none;
          transition: all 0.3s ease;
        }
        .resume-link:hover {
          opacity: 0.8;
          text-decoration: underline;
          text-underline-offset: 4px;
        }
        .resume-border {
          border-color: color-mix(in srgb, var(--accent-resume) 30%, transparent);
        }
      `}</style>

      {/* --- RADIOLUCENT (X-RAY) BACKGROUND EFFECT --- */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 z-0 pointer-events-none flex items-center justify-center overflow-hidden w-full h-[600px]">
        <div 
          className={`w-[400px] h-[200px] md:w-[800px] md:h-[300px] blur-[100px] rounded-[100%] transition-all duration-1000 ease-out mix-blend-screen ${isMounted ? "opacity-20 scale-100" : "opacity-0 scale-90"}`}
          style={{ backgroundColor: 'var(--accent-resume)' }}
        ></div>
        <div className="absolute inset-0 opacity-[0.02] bg-[radial-gradient(circle,currentColor_1px,transparent_1px)] bg-[size:16px_16px]"></div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-12 md:py-20">
        
        {/* TOP TOOLBAR */}
        <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10 transition-all duration-700 delay-100 ${isMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
          <Suspense fallback={
            <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.24em] text-muted w-fit">
              <span className="p-2 rounded-sm border border-surface bg-surface/20 opacity-50">
                <ArrowLeft size={14} />
              </span>
              Loading...
            </div>
          }>
            <SmartBackButton />
          </Suspense>

          <a 
            href="/Jothish_Gandham_Cybersecurity_Resume_Optimized.pdf" 
            download 
            aria-label="Download Jothish Gandham Cybersecurity Resume as PDF"
            className="flex items-center justify-center gap-2 px-6 py-3 border rounded-sm text-[10px] font-mono uppercase tracking-[0.24em] transition-all duration-300 w-fit"
            style={{ 
              borderColor: 'color-mix(in srgb, var(--accent-resume) 40%, transparent)',
              backgroundColor: 'color-mix(in srgb, var(--accent-resume) 10%, transparent)',
              color: 'var(--accent-resume)'
            }}
          >
            <Download size={14} aria-hidden="true" />
            Download PDF
          </a>
        </div>

        {/* RESUME PAPER CONTAINER */}
        <div className={`bg-background border border-surface shadow-2xl rounded-sm p-6 sm:p-12 md:p-16 transition-all duration-1000 delay-200 ${isMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          
          {/* HEADER SECTION */}
          <header className="text-center border-b-[2px] resume-border pb-8 mb-10">
            <h1 
              className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight uppercase mb-6"
              style={{ color: 'var(--accent-resume)' }}
            >
              Gandham Jothish
            </h1>
            
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-[13px] md:text-[14px] text-muted font-medium mb-4">
              <span className="flex items-center gap-1.5"><MapPin size={14} /> Nashik, Maharashtra, India</span>
              <span className="hidden sm:inline text-surface-strong">|</span>
              <span className="flex items-center gap-1.5"><Phone size={14} /> +91 8374754009</span>
              <span className="hidden sm:inline text-surface-strong">|</span>
              <span className="flex items-center gap-1.5"><Mail size={14} /> jothishgandham2@gmail.com</span>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-[13px] md:text-[14px] font-medium">
              <span className="flex items-center gap-1.5">
                <LinkedinIcon size={14} className="text-muted" /> 
                <a href="https://linkedin.com/in/jothish-gandham" target="_blank" rel="noreferrer" className="resume-link">linkedin.com/in/jothish-gandham</a>
              </span>
              <span className="hidden sm:inline text-surface-strong">|</span>
              <span className="flex items-center gap-1.5">
                <GithubIcon size={14} className="text-muted" /> 
                <a href="https://github.com/jothish-blip" target="_blank" rel="noreferrer" className="resume-link">github.com/jothish-blip</a>
              </span>
              <span className="hidden sm:inline text-surface-strong">|</span>
              <span className="flex items-center gap-1.5">
                <Globe size={14} className="text-muted" /> 
                <a href="https://jothish-labs.vercel.app/" target="_blank" rel="noreferrer" className="resume-link">jothish-labs.vercel.app</a>
              </span>
            </div>
          </header>

          <div className="space-y-12">
            
            {/* PROFESSIONAL SUMMARY */}
            <section>
              <h2 className="flex items-center gap-2 text-[15px] font-bold uppercase tracking-widest border-b border-surface pb-2 mb-4" style={{ color: 'var(--accent-resume)' }}>
                Professional Summary
              </h2>
              <p className="text-[14px] md:text-[15px] leading-relaxed text-foreground/90">
                B.Tech Computer Science student specializing in Cyber Security & Forensics with expertise in SOC Operations and Blue Team defense. Certified Google Cybersecurity Professional skilled in incident response, threat hunting, network security, and SIEM configuration. Proven ability to engineer defense mechanisms, analyze threat intelligence, and remediate vulnerabilities to harden enterprise architectures against sophisticated cyber threats.
              </p>
            </section>

            {/* TECHNICAL SKILLS */}
            <section>
              <h2 className="flex items-center gap-2 text-[15px] font-bold uppercase tracking-widest border-b border-surface pb-2 mb-5" style={{ color: 'var(--accent-resume)' }}>
                Technical Skills
              </h2>
              <div className="space-y-3 text-[14px] md:text-[15px] leading-relaxed">
                <p><strong className="text-foreground">Security Operations:</strong> <span className="text-muted">Incident Response, Threat Detection, Phishing Analysis, Malware Investigation, Log Analysis</span></p>
                <p><strong className="text-foreground">SIEM & Security Tools:</strong> <span className="text-muted">Splunk, Google Chronicle, Wireshark, TCPDump, Suricata, VirusTotal</span></p>
                <p><strong className="text-foreground">Networking:</strong> <span className="text-muted">Network Security, TCP/IP, Network Traffic Analysis</span></p>
                <p><strong className="text-foreground">Frameworks & Standards:</strong> <span className="text-muted">NIST Cybersecurity Framework (CSF), NIST SP 800-30, MITRE ATT&CK</span></p>
                <p><strong className="text-foreground">Programming & OS:</strong> <span className="text-muted">Python, SQL, Linux</span></p>
              </div>
            </section>

            {/* PROJECTS */}
            <section>
              <h2 className="flex items-center gap-2 text-[15px] font-bold uppercase tracking-widest border-b border-surface pb-2 mb-6" style={{ color: 'var(--accent-resume)' }}>
                Projects
              </h2>
              
              <div className="space-y-8">
                {/* Project 1 */}
                <div className="relative pl-4 border-l-2 resume-border">
                  <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-background border-2 resume-border"></div>
                  <h3 className="text-[16px] font-bold text-foreground mb-3 flex items-center gap-2">
                    <ShieldCheck size={16} style={{ color: 'var(--accent-resume)' }} /> 
                    Detection & Response Operations
                  </h3>
                  <ul className="space-y-2.5 text-[14px] md:text-[15px] text-muted list-disc list-outside ml-5 marker:text-surface-strong">
                    <li>Remediated 50+ simulated phishing incidents by parsing SMTP/IMAP email headers to extract Indicators of Compromise (IOCs) and isolate attack vectors.</li>
                    <li>Engineered packet capture analysis workflows using Wireshark and TCPDump, inspecting over 10,000 TCP/UDP packets to identify anomalous payload signatures.</li>
                    <li>Configured Suricata IDS rulesets to monitor live network streams, reducing false-positive alert volume by 15% during simulated intrusion tests.</li>
                    <li>Executed complex SPL queries in Splunk and Google Chronicle to parse 5,000+ security events and reconstruct attack kill chains.</li>
                    <li>Synthesized threat intelligence from VirusTotal and OSINT frameworks to classify 20+ malware variants based on behavioral heuristics.</li>
                    <li>Authored 15+ standardized incident response reports mapping threat actor techniques to the MITRE ATT&CK framework for stakeholder review.</li>
                  </ul>
                </div>

                {/* Project 2 */}
                <div className="relative pl-4 border-l-2 resume-border">
                  <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-background border-2 resume-border"></div>
                  <h3 className="text-[16px] font-bold text-foreground mb-3 flex items-center gap-2">
                    <Briefcase size={16} style={{ color: 'var(--accent-resume)' }} />
                    Enterprise Vulnerability Assessment
                  </h3>
                  <ul className="space-y-2.5 text-[14px] md:text-[15px] text-muted list-disc list-outside ml-5 marker:text-surface-strong">
                    <li>Orchestrated qualitative risk assessments adhering to NIST SP 800-30 guidelines across 30+ simulated enterprise assets.</li>
                    <li>Quantified threat likelihood and business impact metrics, prioritizing 10 critical vulnerabilities for immediate patching.</li>
                    <li>Formulated actionable remediation strategies that projected a 40% reduction in overall exploit surface area.</li>
                  </ul>
                </div>

                {/* Project 3 */}
                <div className="relative pl-4 border-l-2 resume-border">
                  <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-background border-2 resume-border"></div>
                  <h3 className="text-[16px] font-bold text-foreground mb-3 flex items-center gap-2">
                    <Code2 size={16} style={{ color: 'var(--accent-resume)' }} />
                    Automated Access Control (Python)
                  </h3>
                  <ul className="space-y-2.5 text-[14px] md:text-[15px] text-muted list-disc list-outside ml-5 marker:text-surface-strong">
                    <li>Programmed an automated Python script utilizing regular expressions (Regex) to dynamically update IP allow lists and enforce access controls.</li>
                    <li>Automated file processing and string manipulation operations, decreasing manual firewall configuration time by 80% and eliminating human syntax errors.</li>
                  </ul>
                </div>

                {/* Project 4 */}
                <div className="relative pl-4 border-l-2 resume-border">
                  <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-background border-2 resume-border"></div>
                  <h3 className="text-[16px] font-bold text-foreground mb-3 flex items-center gap-2">
                    <ShieldCheck size={16} style={{ color: 'var(--accent-resume)' }} />
                    NIST Compliance & Security Audit
                  </h3>
                  <ul className="space-y-2.5 text-[14px] md:text-[15px] text-muted list-disc list-outside ml-5 marker:text-surface-strong">
                    <li>Audited organizational security controls across 5 core domains of the NIST Cybersecurity Framework (Identify, Protect, Detect, Respond, Recover).</li>
                    <li>Pinpointed 12 key compliance gaps and engineered step-by-step security hardening plans for cross-functional engineering teams.</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* EDUCATION */}
            <section>
              <h2 className="flex items-center gap-2 text-[15px] font-bold uppercase tracking-widest border-b border-surface pb-2 mb-5" style={{ color: 'var(--accent-resume)' }}>
                Education
              </h2>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-1">
                <div className="text-[16px] font-bold text-foreground flex items-center gap-2">
                  <GraduationCap size={16} style={{ color: 'var(--accent-resume)' }} />
                  Sandip University
                </div>
                <div className="text-[14px] font-semibold text-muted mt-1 sm:mt-0">Nashik, Maharashtra</div>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2">
                <div className="text-[14px] md:text-[15px] text-muted italic">Bachelor of Technology (B.Tech) - Computer Science & Engineering</div>
                <div className="text-[14px] font-semibold text-muted mt-1 sm:mt-0">Expected Graduation: 2028</div>
              </div>
              <p className="text-[14px] md:text-[15px] text-foreground/80">Specialization: <strong className="text-foreground">Cyber Security & Forensics (CSF)</strong></p>
            </section>

            {/* CERTIFICATIONS */}
            <section>
              <h2 className="flex items-center gap-2 text-[15px] font-bold uppercase tracking-widest border-b border-surface pb-2 mb-5" style={{ color: 'var(--accent-resume)' }}>
                Certifications
              </h2>
              <ul className="space-y-2 text-[14px] md:text-[15px] text-foreground/90 list-disc list-inside marker:text-surface-strong pl-2">
                <li>Google Cybersecurity Professional Certificate</li>
                <li>Google Network Security Specialization</li>
                <li>AI Prompt Engineering Certificate</li>
              </ul>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
}

// Ensure Code2 icon is available for the UI
function Code2({ size = 24, className = "", style = {} }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
      style={style}
    >
      <polyline points="16 18 22 12 16 6"></polyline>
      <polyline points="8 6 2 12 8 18"></polyline>
    </svg>
  );
}