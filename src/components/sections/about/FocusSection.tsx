export default function FocusSection() {
  const toolkit = [
    {
      category: "Operating Systems",
      skills: ["Linux", "Windows", "System Administration"],
    },
    {
      category: "Network Analysis",
      skills: ["Wireshark", "tcpdump", "Packet Capture"],
    },
    {
      category: "SIEM & Detection",
      skills: ["Splunk", "Google Chronicle", "Event Correlation"],
    },
    {
      category: "Endpoint Security",
      skills: ["EDR Concepts", "Windows Event Logs", "Host Investigation"],
    },
    {
      category: "Programming",
      skills: ["Python", "SQL", "Automation & Scripting"],
    },
    {
      category: "Development",
      skills: ["Git", "GitHub", "Version Control"],
    },
  ];

  return (
    <div className="py-16 border-y border-surface">
      
      {/* SOC WORKFLOW COMMAND STRIP */}
      <div className="font-mono text-[9px] text-muted uppercase tracking-widest mb-10 flex flex-wrap gap-3 items-center">
        <span className="text-foreground">Capture</span>
        <span className="opacity-40">→</span>
        <span className="text-foreground">Analyze</span>
        <span className="opacity-40">→</span>
        <span className="text-foreground">Detect</span>
        <span className="opacity-40">→</span>
        <span className="text-foreground">Investigate</span>
        <span className="opacity-40">→</span>
        <span className="text-foreground">Improve</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-start">
        
        {/* LEFT: NARRATIVE, OBJECTIVES & INTERESTS */}
        <div className="lg:col-span-5 space-y-10">
          <div className="space-y-6">
            <h4 className="font-mono text-[10px] text-[var(--accent)] uppercase tracking-[0.4em]">
              // CURRENT OPERATIONS
            </h4>
            <p className="text-muted text-sm leading-relaxed">
              My current learning revolves around understanding how systems generate, process, and expose security data. Through hands-on projects, I explore network traffic, endpoint activity, log analysis, and SIEM workflows while documenting everything I learn.
            </p>
          </div>

          <div className="space-y-4">
            <h5 className="font-mono text-[10px] text-muted uppercase tracking-widest">
              Current Objectives
            </h5>
            <ul className="space-y-2 font-mono text-[10px] text-foreground tracking-widest uppercase">
              <li className="flex items-center gap-2">
                <span className="text-[var(--accent)] font-bold">✓</span> Build Better Projects
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[var(--accent)] font-bold">✓</span> Strengthen Detection Skills
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[var(--accent)] font-bold">✓</span> Learn Threat Hunting
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[var(--accent)] font-bold">✓</span> Contribute to Open Source
              </li>
            </ul>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-2">
            {/* Current Interests */}
            <div className="space-y-4">
              <h5 className="font-mono text-[10px] text-muted uppercase tracking-widest">
                Current Interests
              </h5>
              <ul className="space-y-2 font-mono text-[10px] text-foreground tracking-widest uppercase">
                <li className="flex items-center gap-2">
                  <span className="text-[var(--accent)] opacity-60">■</span> Network Traffic Analysis
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[var(--accent)] opacity-60">■</span> Log Investigation
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[var(--accent)] opacity-60">■</span> Detection Engineering
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[var(--accent)] opacity-60">■</span> Blue Team Operations
                </li>
              </ul>
            </div>

            {/* Currently Exploring */}
            <div className="space-y-4">
              <h5 className="font-mono text-[10px] text-muted uppercase tracking-widest">
                Currently Exploring
              </h5>
              <ul className="space-y-2 font-mono text-[10px] text-foreground tracking-widest uppercase opacity-70">
                <li className="flex items-center gap-2">
                  <span className="text-surface-strong">■</span> Threat Hunting
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-surface-strong">■</span> Incident Response
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-surface-strong">■</span> Detection Rules
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-surface-strong">■</span> Windows Internals
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* RIGHT: TECHNICAL TOOLKIT CARDS */}
        <div className="lg:col-span-7 space-y-6 lg:pl-10 lg:border-l border-surface">
          <h4 className="font-mono text-[10px] text-muted uppercase tracking-[0.4em]">
            // TECHNICAL TOOLKIT
          </h4>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {toolkit.map((group) => (
              <div 
                key={group.category} 
                className="group relative border border-surface bg-transparent hover:bg-surface/30 hover:border-[var(--accent)] transition-all duration-300 p-5 rounded-sm flex flex-col h-full cursor-default overflow-hidden"
              >
                {/* Micro-animation: Expanding top accent line */}
                <div className="absolute top-0 left-0 w-0 h-[1.5px] bg-[var(--accent)] transition-all duration-500 ease-out group-hover:w-full"></div>
                
                <div className="flex justify-between items-start mb-6">
                  <h5 className="font-mono text-sm text-foreground font-bold tracking-widest uppercase">
                    {group.category}
                  </h5>
                  {/* Micro-animation: 'ACTIVE' badge appearance */}
                  <span className="font-mono text-[8px] text-[var(--accent)] opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-[0.2em] px-1.5 py-0.5 border border-[var(--accent)]/30 bg-[var(--accent)]/10">
                    Active
                  </span>
                </div>
                
                <ul className="space-y-2 mt-auto">
                  {group.skills.map((skill) => (
                    <li key={skill} className="font-mono text-[9px] text-muted tracking-widest uppercase flex items-center gap-2">
                      <span className="text-surface group-hover:text-[var(--accent)] transition-colors duration-300">—</span> {skill}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}