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

  // Lock background scroll when mobile menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [menuOpen]);

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
      setMenuOpen(false); // Auto-close mobile menu
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
          className="group flex flex-col font-mono relative z-[101]"
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

        {/* MAIN HAMBURGER BUTTON (Visible when menu is closed) */}
        <button
          className={`md:hidden flex flex-col gap-1.5 p-3 group bg-white/5 rounded-sm border border-white/10 relative z-[101] transition-opacity ${menuOpen ? "opacity-0 pointer-events-none" : "opacity-100"}`}
          onClick={() => setMenuOpen(true)}
          aria-label="Open Menu"
        >
          <div className="h-[1px] w-5 bg-white"></div>
          <div className="h-[1px] w-3 bg-white ml-auto"></div>
          <div className="h-[1px] w-5 bg-white"></div>
        </button>
      </div>

      {/* MOBILE DROPDOWN (FULL SCREEN OVERLAY) */}
      <div 
        className={`fixed inset-0 w-full h-[100dvh] bg-black/85 backdrop-blur-xl border-b border-white/10 transition-all duration-500 ease-in-out md:hidden z-[110] ${
          menuOpen ? "translate-y-0 opacity-100 pointer-events-auto" : "-translate-y-full opacity-0 pointer-events-none"
        }`}
      >
        {/* DEDICATED CLOSE BUTTON */}
        <button 
          onClick={() => setMenuOpen(false)}
          className="absolute top-6 right-6 p-4 bg-white/5 border border-white/10 rounded-sm text-zinc-400 hover:text-white hover:bg-white/10 transition-all active:scale-95"
          aria-label="Close Menu"
        >
          <div className="w-5 h-[1px] bg-current rotate-45 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
          <div className="w-5 h-[1px] bg-current -rotate-45 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
        </button>

        <div className="flex flex-col p-8 pt-24 h-full overflow-y-auto">
          <div className="mb-10 border-b border-white/5 pb-6">
            <p className="font-mono text-[10px] text-cyan-500 tracking-[0.5em] uppercase mb-2">// Select_Destination_Node</p>
            <h3 className="text-xs font-mono text-zinc-500 uppercase">Navigation_Core.v2.5</h3>
          </div>

          <div className="flex flex-col gap-8 sm:gap-10">
            {sections.map((sec, idx) => (
              <a
                key={sec}
                href={`#${sec}`}
                onClick={(e) => smoothScroll(e, sec)}
                className="group flex items-center gap-6"
              >
                <span className={`font-mono text-xs ${active === sec ? sectionConfig[sec].color : "text-zinc-600 group-hover:text-zinc-400"}`}>
                   0{idx + 1}
                </span>
                <span className={`text-3xl sm:text-4xl font-black tracking-tighter uppercase transition-all duration-300 ${
                  active === sec ? sectionConfig[sec].color : "text-zinc-400 group-hover:text-white"
                }`}>
                  {sec}
                </span>
                {active === sec && <div className={`w-2 h-2 rounded-full animate-ping ${sectionConfig[sec].color} bg-current opacity-50`}></div>}
              </a>
            ))}
          </div>
          
          <div className="mt-auto pt-10 border-t border-white/5 font-mono text-[9px] text-zinc-600 flex justify-between items-center uppercase tracking-widest">
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