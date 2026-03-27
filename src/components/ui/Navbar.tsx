"use client";

import { useEffect, useState } from "react";

// --- SYSTEM COLOR CONFIG ---
const sections = ["about", "projects", "skills", "terminal", "contact"];

const sectionConfig: Record<string, { color: string; label: string }> = {
  about: { color: "text-white", label: "Profile_Overview" },
  projects: { color: "text-cyan-400", label: "Case_Files" },
  skills: { color: "text-green-400", label: "Tech_Arsenal" },
  terminal: { color: "text-orange-400", label: "Workstation" },
  contact: { color: "text-red-400", label: "Comms_Uplink" },
};

export default function Navbar() {
  const [active, setActive] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      // 1. Progress Calculation
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolledPercent = (winScroll / height) * 100;
      setProgress(scrolledPercent);

      // 2. Navbar Shrink Logic
      setScrolled(window.scrollY > 50);

      // 3. Precise Section Detection
      const offset = window.innerHeight * 0.25;
      const scrollPos = window.scrollY + offset;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el && scrollPos >= el.offsetTop && scrollPos < el.offsetTop + el.offsetHeight) {
          setActive(section);
          return;
        }
      }
      if (window.scrollY < 100) setActive("");
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const smoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
      setMenuOpen(false);
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 ${
        scrolled
          ? "py-3 bg-black/60 backdrop-blur-xl border-b border-white/[0.05]"
          : "py-6 bg-transparent"
      }`}
    >
      {/* 🎯 GLOBAL PROGRESS TRACKER */}
      <div 
        className="absolute top-0 left-0 h-[1px] bg-gradient-to-r from-cyan-500 via-green-500 to-red-500 transition-all duration-150 ease-out" 
        style={{ width: `${progress}%` }} 
      />

      <div className="max-w-[1500px] mx-auto px-6 md:px-12 flex justify-between items-center">
        
        {/* LOGO: SYSTEM_ID */}
        <a
          href="#"
          onClick={(e) => smoothScroll(e, "hero")}
          className="group flex flex-col font-mono"
        >
          <div className="flex items-center gap-2">
             <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
             <span className="text-[12px] font-black tracking-[0.2em] text-white uppercase">
                JG_ANALYST_CORE
             </span>
          </div>
          <span className="text-[9px] text-zinc-600 tracking-widest font-light ml-3.5 uppercase">
             Status: <span className="text-green-900">Active_Node</span>
          </span>
        </a>

        {/* DESKTOP NAV: TACTICAL HUD */}
        <div className="hidden md:flex items-center gap-2 bg-white/[0.02] border border-white/5 rounded-full px-2 py-1">
          {sections.map((sec, idx) => {
            const isActive = active === sec;
            return (
              <a
                key={sec}
                href={`#${sec}`}
                onClick={(e) => smoothScroll(e, sec)}
                className={`group relative px-5 py-2 font-mono text-[11px] tracking-widest uppercase transition-all duration-500 ${
                  isActive ? "text-white" : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                <div className="relative z-10 flex flex-col items-center">
                  <span className={`text-[7px] mb-0.5 transition-colors ${isActive ? sectionConfig[sec].color : "text-zinc-800"}`}>
                    0{idx + 1}
                  </span>
                  <span className={`transition-transform duration-300 ${isActive ? "scale-110" : ""}`}>
                    {sec}
                  </span>
                </div>
                
                {/* TOOLTIP ON HOVER */}
                <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all pointer-events-none whitespace-nowrap bg-zinc-900 text-[8px] px-2 py-1 rounded border border-white/10 text-zinc-400">
                  {sectionConfig[sec].label}
                </div>

                {/* ACTIVE GLOW & INDICATOR */}
                {isActive && (
                  <>
                    <div className="absolute inset-0 bg-white/[0.05] blur-sm rounded-full"></div>
                    <div className={`absolute bottom-0 left-4 right-4 h-[1.5px] rounded-full shadow-[0_0_8px_currentColor] ${sectionConfig[sec].color} bg-current`}></div>
                  </>
                )}
              </a>
            );
          })}
        </div>

        {/* MOBILE TOGGLE */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2 group bg-white/5 rounded"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle Menu"
        >
          <div className={`h-[1px] w-5 bg-white transition-all ${menuOpen ? "rotate-45 translate-y-2" : ""}`}></div>
          <div className={`h-[1px] w-3 bg-white transition-all ml-auto ${menuOpen ? "opacity-0" : ""}`}></div>
          <div className={`h-[1px] w-5 bg-white transition-all ${menuOpen ? "-rotate-45 -translate-y-1.5" : ""}`}></div>
        </button>
      </div>

      {/* MOBILE DROPDOWN */}
      <div 
        className={`fixed inset-0 top-0 bg-black/98 backdrop-blur-3xl transition-all duration-500 md:hidden z-[99] ${
          menuOpen ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
        }`}
      >
        <div className="flex flex-col p-12 h-full">
          <div className="mb-12 border-b border-white/5 pb-6">
            <p className="font-mono text-[10px] text-cyan-500 tracking-[0.5em] uppercase mb-2">// Select_Destination_Node</p>
            <h3 className="text-xs font-mono text-zinc-500 uppercase">Navigation_Core.v2.5</h3>
          </div>

          <div className="flex flex-col gap-6">
            {sections.map((sec, idx) => (
              <a
                key={sec}
                href={`#${sec}`}
                onClick={(e) => smoothScroll(e, sec)}
                className="group flex items-center gap-6"
              >
                <span className={`font-mono text-xs ${active === sec ? sectionConfig[sec].color : "text-zinc-800"}`}>
                   0{idx + 1}
                </span>
                <span className={`text-5xl font-black tracking-tighter uppercase transition-all duration-300 ${
                  active === sec ? sectionConfig[sec].color : "text-zinc-800 group-hover:text-zinc-400"
                }`}>
                  {sec}
                </span>
                {active === sec && <div className={`w-3 h-3 rounded-full animate-ping ${sectionConfig[sec].color} bg-current opacity-20`}></div>}
              </a>
            ))}
          </div>
          
          <div className="mt-auto pt-12 border-t border-white/5 font-mono text-[9px] text-zinc-600 flex justify-between uppercase tracking-widest">
            <span className="flex items-center gap-2">
               <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-pulse"></div>
               Link_Secure
            </span>
            <span>2026 // JOTHISH_SYS</span>
          </div>
        </div>
      </div>
    </nav>
  );
}