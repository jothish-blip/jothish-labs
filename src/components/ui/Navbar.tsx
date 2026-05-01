"use client";

import { useEffect, useState, useRef } from "react";

// --- SYSTEM COLOR & LABEL CONFIG ---
const sections = ["about", "projects", "skills", "terminal", "contact"];

const sectionConfig: Record<string, { color: string; label: string }> = {
  about: { color: "text-zinc-300", label: "Profile Overview" },
  projects: { color: "text-cyan-400", label: "Case Files" },
  skills: { color: "text-emerald-400", label: "Tech Arsenal" },
  terminal: { color: "text-amber-400", label: "Workstation" },
  contact: { color: "text-blue-400", label: "Contact" },
};

// CSS-compatible gradient values for inline variable usage
const sectionTheme: Record<string, string> = {
  about: "#9ca3af, #52525b",      // zinc-400 to zinc-600
  projects: "#22d3ee, #3b82f6",   // cyan-400 to blue-500
  skills: "#34d399, #22c55e",     // emerald-400 to green-500
  terminal: "#fbbf24, #f97316",   // amber-400 to orange-500
  contact: "#60a5fa, #6366f1",    // blue-400 to indigo-500
};

const progressColor: Record<string, string> = {
  about: "from-zinc-400 via-zinc-500 to-zinc-600",
  projects: "from-cyan-400 via-blue-500 to-cyan-400",
  skills: "from-emerald-400 via-green-500 to-emerald-400",
  terminal: "from-amber-400 via-orange-500 to-amber-400",
  contact: "from-blue-400 via-indigo-500 to-blue-400",
};

export default function Navbar() {
  const [active, setActive] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  
  const lastScrollY = useRef(0);
  const scrollTimeout = useRef<number | null>(null);
  
  // Use a ref to access the latest 'active' state in the scroll handler without triggering re-renders
  const activeRef = useRef(active);
  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  // Mobile Swipe-to-Close Logic
  const touchStartY = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStartY.current) return;
    const currentY = e.touches[0].clientY;
    const diff = currentY - touchStartY.current;
    
    // Smooth control threshold
    if (diff > 80) {
      setMenuOpen(false);
      touchStartY.current = null;
    }
  };

  // Nav Memory Init
  useEffect(() => {
    const saved = localStorage.getItem("lastSection");
    if (saved) setActive(saved);
  }, []);

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
      if (scrollTimeout.current) return;

      scrollTimeout.current = window.requestAnimationFrame(() => {
        const currentScroll = window.scrollY;
        
        // 1. Progress Calculation
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolledPercent = (currentScroll / height) * 100;
        setProgress(scrolledPercent);

        // 2. Scroll Direction Aware Behavior (Hide/Show)
        if (currentScroll > 100) {
          setScrolled(true);
          if (currentScroll > lastScrollY.current && currentScroll > 300) {
            setHidden(true); // Scrolling down -> hide
          } else {
            setHidden(false); // Scrolling up -> show
          }
        } else {
          setScrolled(false);
          setHidden(false);
          
          // Edge case: clear memory at the very top
          localStorage.removeItem("lastSection");
        }

        lastScrollY.current = currentScroll;

        // 3. Precise Section Detection
        const offset = window.innerHeight * 0.25;
        const scrollPos = currentScroll + offset;

        let currentSection = "";
        for (const section of sections) {
          const el = document.getElementById(section);
          if (el && scrollPos >= el.offsetTop && scrollPos < el.offsetTop + el.offsetHeight) {
            currentSection = section;
            break;
          }
        }
        
        if (currentScroll < 100) currentSection = "";

        if (currentSection !== activeRef.current) {
          setActive(currentSection);
          if (currentSection) localStorage.setItem("lastSection", currentSection);
        }

        scrollTimeout.current = null;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimeout.current) cancelAnimationFrame(scrollTimeout.current);
    };
  }, []); // Empty dependency array prevents re-attaching the event listener on scroll

  // Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const num = parseInt(e.key);
      if (!isNaN(num) && num >= 1 && num <= sections.length) {
        const sec = sections[num - 1];
        const el = document.getElementById(sec);
        if (el) {
          const yOffset = -100;
          const y = el.getBoundingClientRect().top + window.scrollY + yOffset;
          window.scrollTo({ top: y, behavior: "smooth" });
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Custom scroll logic + micro UX feedback
  const smoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      document.body.style.cursor = "wait";
      
      const yOffset = -100;
      const y = el.getBoundingClientRect().top + window.scrollY + yOffset;

      window.scrollTo({ top: y, behavior: "smooth" });
      setMenuOpen(false);
      
      setTimeout(() => {
        document.body.style.cursor = "default";
      }, 300);
    }
  };

  // Safe color fallbacks to prevent errors
  const dotColor = active && sectionConfig[active]
    ? sectionConfig[active].color.replace("text-", "bg-")
    : "bg-emerald-500";
    
  const currentProgressColor = progressColor[active] || progressColor["projects"];

  return (
    <nav
      style={{
        '--nav-gradient': active && sectionTheme[active]
          ? `linear-gradient(to right, ${sectionTheme[active]})`
          : 'transparent'
      } as React.CSSProperties}
      className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 ease-out transform ${hidden ? '-translate-y-full' : 'translate-y-0'}
      before:absolute before:inset-0 before:-z-10 before:bg-[var(--nav-gradient)] before:opacity-[0.05] before:transition-all before:duration-700 before:ease-out
      ${scrolled ? "py-3 bg-black/70 backdrop-blur-2xl border-b border-white/[0.03] shadow-[0_4px_20px_rgba(0,0,0,0.4)]" : "py-6 bg-transparent"}`}
    >
      {/* 🎯 PREMIUM GLOBAL PROGRESS TRACKER */}
      <div 
        className={`absolute top-0 left-0 h-[2px] opacity-80 bg-gradient-to-r ${currentProgressColor} shadow-[0_0_10px_currentColor] transition-all duration-300 ease-out z-[102]`}
        style={{ width: `${progress}%` }} 
      />

      {/* SCROLL PROGRESS NUMBER WITH FADE */}
      <div className={`absolute top-1.5 right-6 text-[9px] text-zinc-600 font-mono tracking-widest hidden md:block transition-opacity duration-500 ${scrolled ? 'opacity-100' : 'opacity-0'}`}>
        {Math.round(progress)}%
      </div>

      <div className="max-w-[1500px] mx-auto px-6 md:px-12 flex justify-between items-center relative">
        
        {/* LOGO: IDENTITY */}
        <a
          href="#"
          onClick={(e) => smoothScroll(e, "hero")}
          className="group flex flex-col font-mono relative z-[101] transition-transform duration-300 hover:scale-[1.03] active:scale-95 focus:outline-none focus:ring-1 focus:ring-cyan-500/30 rounded-sm p-1"
        >
          <div className="flex items-center gap-2">
             <div className={`w-1.5 h-1.5 rounded-full animate-pulse transition-colors duration-500 shadow-[0_0_8px_currentColor] ${dotColor}`}></div>
             <span className="text-[12px] font-black tracking-[0.2em] text-white uppercase group-hover:tracking-[0.25em] transition-all duration-300 ease-out">
               JOTHISH GANDHAM
             </span>
          </div>
          <span className="text-[9px] text-zinc-500 tracking-widest font-light ml-3.5 uppercase transition-colors duration-300 group-hover:text-zinc-400">
             Status: <span className="text-emerald-500">Active</span>
          </span>
        </a>

        {/* ACTIVE SECTION LABEL */}
        <div className={`absolute top-full mt-4 left-1/2 -translate-x-1/2 text-[10px] font-mono tracking-widest uppercase opacity-0 md:opacity-100 transition-colors duration-500 ease-out pointer-events-none ${sectionConfig[active]?.color || "text-zinc-500"}`}>
          {active || "home"}
        </div>

        {/* DESKTOP NAV: CLEAN HUD */}
        <div className="hidden md:flex items-center gap-2 bg-white/[0.02] border border-white/5 rounded-full px-2 py-1">
          {sections.map((sec, idx) => {
            const isActive = active === sec;
            const secColorClass = sectionConfig[sec].color;

            return (
              <a
                key={sec}
                href={`#${sec}`}
                onClick={(e) => smoothScroll(e, sec)}
                className={`group relative px-5 py-2 font-mono text-[11px] tracking-widest uppercase transition-all duration-500 ease-out active:scale-95 focus:outline-none focus:ring-1 focus:ring-cyan-500/30 rounded-full ${
                  isActive ? `${secColorClass} scale-110 font-bold` : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                {/* DYNAMIC NAV HOVER LINE ANIMATION */}
                <div className={`absolute bottom-1 left-1/2 -translate-x-1/2 h-[1px] bg-current transition-all duration-300 ease-out opacity-60 ${isActive ? 'w-1/2' : 'w-0 group-hover:w-1/2'}`}></div>

                <div className="relative z-10 flex flex-col items-center">
                  <span className={`text-[7px] mb-0.5 transition-colors duration-500 ease-out ${isActive ? secColorClass : "text-zinc-700 group-hover:text-zinc-500"}`}>
                    0{idx + 1}
                  </span>
                  <span className={`transition-transform duration-500 ease-out ${isActive ? "font-bold" : ""}`}>
                    {sec}
                  </span>
                </div>
                
                {/* TOOLTIP ON HOVER WITH DELAY */}
                <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 delay-150 ease-out pointer-events-none whitespace-nowrap bg-zinc-900 text-[9px] px-2 py-1 rounded-sm border border-white/10 text-zinc-400">
                  {sectionConfig[sec].label}
                </div>

                {/* DYNAMIC ACTIVE GLOW & INDICATOR WITH SOFT PULSE */}
                {isActive && (
                  <>
                    <div className="absolute inset-0 bg-current opacity-10 blur-md rounded-full transition-opacity duration-500 animate-[pulse_2s_infinite]"></div>
                    <div className={`absolute bottom-0 left-4 right-4 h-[1.5px] rounded-full shadow-[0_0_10px_currentColor] bg-current transition-all duration-500 ease-out animate-[pulse_2s_infinite]`}></div>
                  </>
                )}
              </a>
            );
          })}
        </div>

        {/* MAIN HAMBURGER BUTTON */}
        <button
          className={`md:hidden flex flex-col gap-1.5 p-3 group bg-white/5 rounded-sm border border-white/10 relative z-[101] transition-opacity duration-300 ease-out focus:outline-none focus:ring-1 focus:ring-cyan-500/30 ${menuOpen ? "opacity-0 pointer-events-none" : "opacity-100 active:scale-95"}`}
          onClick={() => setMenuOpen(true)}
          aria-label="Open Menu"
        >
          <div className="h-[1px] w-5 bg-white transition-all group-hover:bg-cyan-400"></div>
          <div className="h-[1px] w-3 bg-white ml-auto transition-all group-hover:bg-cyan-400"></div>
          <div className="h-[1px] w-5 bg-white transition-all group-hover:bg-cyan-400"></div>
        </button>
      </div>

      {/* MOBILE DROPDOWN (FULL SCREEN OVERLAY) */}
      <div 
        className={`fixed inset-0 w-full h-[100dvh] bg-black/90 backdrop-blur-2xl border-b border-white/10 transition-all duration-500 ease-out md:hidden z-[110] ${
          menuOpen ? "translate-y-0 opacity-100 pointer-events-auto" : "-translate-y-full opacity-0 pointer-events-none"
        }`}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
      >
        <button 
          onClick={() => setMenuOpen(false)}
          className="absolute top-6 right-6 p-4 bg-white/5 border border-white/10 rounded-sm text-zinc-400 hover:text-white hover:bg-white/10 transition-all active:scale-95 focus:outline-none focus:ring-1 focus:ring-cyan-500/30"
          aria-label="Close Menu"
        >
          <div className="w-5 h-[1px] bg-current rotate-45 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
          <div className="w-5 h-[1px] bg-current -rotate-45 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
        </button>

        <div className="flex flex-col p-8 pt-24 h-full overflow-y-auto">
          <div className="mb-10 border-b border-white/5 pb-6 flex justify-between items-end">
            <div>
              <p className="font-mono text-[10px] text-cyan-500 tracking-[0.5em] uppercase mb-2">// Navigation</p>
              <h3 className="text-xs font-mono text-zinc-500 uppercase tracking-widest">Menu</h3>
            </div>
            <div className="text-[9px] text-zinc-600 font-mono tracking-widest">Swipe down to close</div>
          </div>

          <div className="flex flex-col gap-8 sm:gap-10">
            {sections.map((sec, idx) => {
              const isActive = active === sec;
              const secColorClass = sectionConfig[sec].color;

              return (
                <a
                  key={sec}
                  href={`#${sec}`}
                  onClick={(e) => smoothScroll(e, sec)}
                  className={`group flex items-center gap-6 active:scale-95 transition-all duration-300 ease-out focus:outline-none focus:ring-1 focus:ring-cyan-500/30 p-2 rounded-sm ${isActive ? secColorClass : "text-zinc-400"}`}
                >
                  <span className={`font-mono text-xs transition-colors duration-500 ease-out ${isActive ? secColorClass : "text-zinc-600 group-hover:text-zinc-400"}`}>
                     0{idx + 1}
                  </span>
                  <span className={`text-3xl sm:text-4xl font-black tracking-tighter uppercase transition-all duration-500 ease-out group-hover:text-zinc-200`}>
                    {sec}
                  </span>
                </a>
              );
            })}
          </div>
          
          <div className="mt-auto pt-10 border-t border-white/5 font-mono text-[9px] text-zinc-500 flex justify-between items-center uppercase tracking-widest">
            <span className="flex items-center gap-2">
               <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.6)]"></div>
               System_Online
            </span>
            <span>JOTHISH GANDHAM</span>
          </div>
        </div>
      </div>

      <style jsx global>{`
        html {
          scroll-behavior: smooth;
        }
        section {
          scroll-margin-top: 100px;
        }
      `}</style>
    </nav>
  );
}