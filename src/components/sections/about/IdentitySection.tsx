export default function IdentitySection() {
  return (
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
            <a href="https://github.com/jothish-blip" target="_blank" rel="noopener noreferrer" className="font-mono text-[10px] text-muted hover:text-[var(--accent)] transition-colors uppercase tracking-widest">[ github ]</a>
            <a href="https://www.linkedin.com/in/jothish-gandham-5b90b334a/" target="_blank" rel="noopener noreferrer" className="font-mono text-[10px] text-muted hover:text-[var(--accent)] transition-colors uppercase tracking-widest">[ linkedin ]</a>
            <a href="/resume.pdf" target="_blank" rel="noopener noreferrer" className="font-mono text-[10px] text-[var(--accent)] border border-[var(--accent-soft)] bg-[var(--accent-soft)] px-3 py-1 hover:bg-surface transition-all uppercase tracking-widest">
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
  );
}