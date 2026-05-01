"use client";

import { useEffect, useState, useRef } from "react";

// --- SYSTEM COLOR & LABEL CONFIG ---
const sections = ["about", "projects", "skills", "terminal", "contact"];

// Using CSS variables to handle light/dark contrast safely
const sectionConfig: Record<string, { cssVar: string; label: string }> = {
  about: { cssVar: "var(--accent-about)", label: "Profile Overview" },
  projects: { cssVar: "var(--accent-projects)", label: "Case Files" },
  skills: { cssVar: "var(--accent-skills)", label: "Tech Arsenal" },
  terminal: { cssVar: "var(--accent-terminal)", label: "Workstation" },
  contact: { cssVar: "var(--accent-contact)", label: "Contact" },
};

export default function Navbar() {
  // 4. Scroll Logic: Consolidated State for fewer re-renders
  const [navState, setNavState] = useState({
    active: "",
    scrolled: false,
    hidden: false,
    progress: 0,
  });
  
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  const lastScrollY = useRef(0);
  const scrollTimeout = useRef<number | null>(null);

  // Destructure for easier use in template
  const { active, scrolled, hidden, progress } = navState;

  // 2. Mobile UX Issues: Multi-directional swipe logic
  const touchStart = useRef<{ x: number | null; y: number | null }>({ x: null, y: null });

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStart.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    };
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStart.current.x || !touchStart.current.y) return;
    
    const diffX = e.touches[0].clientX - touchStart.current.x;
    const diffY = e.touches[0].clientY - touchStart.current.y;

    // Swipe down OR swipe right to close
    if (diffY > 80 || diffX > 80) {
      setMenuOpen(false);
      touchStart.current = { x: null, y: null };
    }
  };

  // Theme & Nav Memory Init
  useEffect(() => {
    const savedActive = localStorage.getItem("lastSection");
    if (savedActive) {
      setNavState(prev => ({ ...prev, active: savedActive }));
    }

    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark" || savedTheme === "light") {
      setTheme(savedTheme);
      document.documentElement.classList.toggle("dark", savedTheme === "dark");
      return;
    }

    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setTheme(prefersDark ? "dark" : "light");
    document.documentElement.classList.toggle("dark", prefersDark);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(10);
    setTheme((current) => (current === "dark" ? "light" : "dark"));
  };

  // Lock background scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "auto";
    return () => { document.body.style.overflow = "auto"; };
  }, [menuOpen]);

  useEffect(() => {
    const handleScroll = () => {
      if (scrollTimeout.current) return;

      scrollTimeout.current = window.requestAnimationFrame(() => {
        const currentScroll = window.scrollY;
        
        // Progress Calc
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const newProgress = (currentScroll / height) * 100;

        // Hide/Show Logic
        let newScrolled = false;
        let newHidden = false;
        
        if (currentScroll > 100) {
          newScrolled = true;
          newHidden = currentScroll > lastScrollY.current && currentScroll > 300;
        } else {
          localStorage.removeItem("lastSection");
        }
        
        lastScrollY.current = currentScroll;

        // Section Detection
        const offset = window.innerHeight * 0.25;
        const scrollPos = currentScroll + offset;
        let newActive = "";
        
        for (const section of sections) {
          const el = document.getElementById(section);
          if (el && scrollPos >= el.offsetTop && scrollPos < el.offsetTop + el.offsetHeight) {
            newActive = section;
            break;
          }
        }
        if (currentScroll < 100) newActive = "";

        // Single State Update
        setNavState(prev => {
          if (
            prev.progress !== newProgress || 
            prev.scrolled !== newScrolled || 
            prev.hidden !== newHidden || 
            prev.active !== newActive
          ) {
            if (newActive && prev.active !== newActive) {
              localStorage.setItem("lastSection", newActive);
            }
            return {
              progress: newProgress,
              scrolled: newScrolled,
              hidden: newHidden,
              active: newActive
            };
          }
          return prev;
        });

        scrollTimeout.current = null;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimeout.current) cancelAnimationFrame(scrollTimeout.current);
    };
  }, []);

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

  const smoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(10); // 7. Micro UX Upgrades
    
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

  const activeColorVar = active ? sectionConfig[active].cssVar : "var(--accent-skills)";

  return (
    <>
      {/* 6. Dark / Light Mode Dual Tokens Inline Definition (Can be moved to globals.css) */}
      <style jsx global>{`
        :root {
          --accent-about: #52525b;
          --accent-projects: #0891b2;
          --accent-skills: #059669;
          --accent-terminal: #d97706;
          --accent-contact: #2563eb;
          scroll-behavior: smooth;
          scroll-padding-top: 100px; /* 7. Scroll snap feel */
        }
        html.dark {
          --accent-about: #a1a1aa;
          --accent-projects: #22d3ee;
          --accent-skills: #34d399;
          --accent-terminal: #fbbf24;
          --accent-contact: #60a5fa;
        }
      `}</style>

      <nav
        className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 ease-out transform ${hidden ? '-translate-y-full' : 'translate-y-0'}
        before:absolute before:inset-0 before:-z-10 before:transition-all before:duration-700 before:ease-out
        ${scrolled 
          ? "py-3 bg-surface-strong backdrop-blur-2xl border-b border-surface shadow-md dark:shadow-[0_4px_20px_rgba(0,0,0,0.6)] before:opacity-[0.08] dark:before:opacity-[0.12]" 
          : "py-6 bg-transparent before:opacity-0"}`}
        style={{
          '--nav-gradient': active ? `linear-gradient(to right, transparent, ${activeColorVar}, transparent)` : 'transparent',
          ...({ '&::before': { background: 'var(--nav-gradient)' } } as any)
        }}
      >
        {/* PREMIUM GLOBAL PROGRESS TRACKER - Glow tuned down */}
        <div 
          className="absolute top-0 left-0 h-[2px] opacity-80 shadow-[0_0_6px_currentColor] transition-all duration-300 ease-out z-[102]"
          style={{ width: `${progress}%`, backgroundColor: activeColorVar, color: activeColorVar }} 
        />

        <div className={`absolute top-1.5 right-6 text-[9px] text-muted font-mono tracking-widest hidden md:block transition-opacity duration-500 ${scrolled ? 'opacity-100' : 'opacity-0'}`}>
          {Math.round(progress)}%
        </div>

        <div className="max-w-[1500px] mx-auto px-6 md:px-12 flex justify-between items-center relative">
          
          <a
            href="#"
            onClick={(e) => smoothScroll(e, "hero")}
            className="group flex flex-col font-mono relative z-[101] transition-transform duration-300 hover:scale-[1.03] active:scale-95 focus:outline-none focus:ring-1 focus:ring-cyan-500/30 rounded-sm p-1"
          >
            <div className="flex items-center gap-2">
               {/* 3. Reduced pulse noise on the logo */}
               <div className="w-1.5 h-1.5 rounded-full transition-colors duration-500 shadow-[0_0_6px_currentColor]" style={{ backgroundColor: activeColorVar, color: activeColorVar }}></div>
               <span className="text-[12px] font-black tracking-[0.2em] text-foreground uppercase group-hover:tracking-[0.25em] transition-all duration-300 ease-out">
                 JOTHISH GANDHAM
               </span>
            </div>
            <span className="text-[9px] text-muted tracking-widest font-light ml-3.5 uppercase transition-colors duration-300">
               Status: <span style={{ color: "var(--accent-skills)" }}>Active</span>
            </span>
          </a>

          <div 
            className="absolute top-full mt-4 left-1/2 -translate-x-1/2 text-[10px] font-mono tracking-widest uppercase opacity-0 md:opacity-100 transition-colors duration-500 ease-out pointer-events-none"
            style={{ color: active ? sectionConfig[active].cssVar : "var(--muted)" }}
          >
            {active || "home"}
          </div>

          <div className="hidden md:flex items-center gap-2 bg-surface-strong border border-surface rounded-full px-2 py-1">
            {sections.map((sec, idx) => {
              const isActive = active === sec;
              const cssVar = sectionConfig[sec].cssVar;

              return (
                <a
                  key={sec}
                  href={`#${sec}`}
                  onClick={(e) => smoothScroll(e, sec)}
                  // 2. Mobile/Desktop tap target size increased implicitly with min-h
                  className={`group relative min-h-[44px] flex items-center px-6 py-2 font-mono text-[11px] tracking-widest uppercase transition-all duration-500 ease-out active:scale-95 focus:outline-none focus:ring-1 focus:ring-cyan-500/30 rounded-full ${
                    isActive ? "scale-105 font-bold" : "text-muted hover:text-foreground"
                  }`}
                  style={{ color: isActive ? cssVar : undefined }}
                >
                  {/* Underline logic: shows on hover, persists on active */}
                  <div 
                    className={`absolute bottom-2 left-1/2 -translate-x-1/2 h-[1.5px] transition-all duration-300 ease-out opacity-80 ${isActive ? 'w-1/2' : 'w-0 group-hover:w-1/2'}`}
                    style={{ backgroundColor: isActive ? cssVar : 'currentColor' }}
                  ></div>

                  <div className="relative z-10 flex flex-col items-center">
                    <span className={`text-[7px] mb-0.5 transition-colors duration-500 ease-out ${isActive ? "" : "text-muted group-hover:text-foreground"}`}>
                      0{idx + 1}
                    </span>
                    <span className="transition-transform duration-500 ease-out">
                      {sec}
                    </span>
                  </div>
                  
                  {/* 3. Tooltip delay lowered to 75ms */}
                  <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 delay-75 ease-out pointer-events-none whitespace-nowrap bg-surface-strong text-[9px] px-2 py-1 rounded-sm border border-surface text-muted">
                    {sectionConfig[sec].label}
                  </div>

                  {/* 3. Removed heavy pulse animation, kept simple active glow */}
                  {isActive && (
                    <div className="absolute inset-0 opacity-15 blur-md rounded-full transition-opacity duration-500" style={{ backgroundColor: cssVar }}></div>
                  )}
                </a>
              );
            })}
          </div>

          <button
            type="button"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            className="flex items-center justify-center w-11 h-11 rounded-full border border-surface bg-surface text-muted transition-all duration-300 hover:bg-surface-strong focus:outline-none focus:ring-2 focus:ring-cyan-500/30 active:scale-95"
          >
            {theme === "dark" ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                <path d="M12 3v2m0 14v2m9-9h-2M5 12H3m15.364-6.364l-1.414 1.414M7.05 16.95l-1.414 1.414M18.364 18.364l-1.414-1.414M7.05 7.05L5.636 5.636" />
                <circle cx="12" cy="12" r="5" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                <path d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" />
              </svg>
            )}
          </button>

          <button
            className={`md:hidden flex flex-col gap-1.5 p-3 group bg-surface rounded-sm border border-surface relative z-[101] transition-opacity duration-300 ease-out focus:outline-none focus:ring-1 focus:ring-cyan-500/30 ${menuOpen ? "opacity-0 pointer-events-none" : "opacity-100 active:scale-95"}`}
            onClick={() => {
              if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(10);
              setMenuOpen(true);
            }}
            aria-label="Open Menu"
          >
            <div className="h-[1px] w-5 bg-foreground transition-all"></div>
            <div className="h-[1px] w-3 bg-foreground ml-auto transition-all"></div>
            <div className="h-[1px] w-5 bg-foreground transition-all"></div>
          </button>
        </div>

        {/* 2. Mobile Overlay refactored for performance and smooth UX */}
        <div 
          className={`fixed inset-0 w-full h-[100vh] bg-surface/95 backdrop-blur-md border-b border-surface transition-all duration-500 ease-out md:hidden z-[110] ${
            menuOpen ? "translate-y-0 opacity-100 pointer-events-auto" : "-translate-y-full opacity-0 pointer-events-none"
          }`}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
        >
          <button 
            onClick={() => setMenuOpen(false)}
            className="absolute top-6 right-6 p-4 bg-surface border border-surface rounded-sm text-muted hover:text-foreground hover:bg-surface-strong transition-all active:scale-95 focus:outline-none focus:ring-1 focus:ring-cyan-500/30"
            aria-label="Close Menu"
          >
            <div className="w-5 h-[1px] bg-current rotate-45 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
            <div className="w-5 h-[1px] bg-current -rotate-45 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
          </button>

          <div className="flex flex-col p-8 pt-24 h-full overflow-y-auto">
            <div className="mb-10 border-b border-surface pb-6 flex justify-between items-end">
              <div>
                <p className="font-mono text-[10px] tracking-[0.5em] uppercase mb-2" style={{ color: "var(--accent-projects)" }}>// Navigation</p>
                <h3 className="text-xs font-mono text-muted uppercase tracking-widest">Menu</h3>
              </div>
              <div className="text-[9px] text-muted font-mono tracking-widest text-right">Swipe down or<br/>right to close</div>
            </div>

            <div className="flex flex-col gap-8 sm:gap-10">
              {sections.map((sec, idx) => {
                const isActive = active === sec;
                const cssVar = sectionConfig[sec].cssVar;

                return (
                  <a
                    key={sec}
                    href={`#${sec}`}
                    onClick={(e) => smoothScroll(e, sec)}
                    className={`group flex items-center gap-6 active:scale-95 transition-all duration-300 ease-out focus:outline-none focus:ring-1 focus:ring-cyan-500/30 p-2 rounded-sm ${isActive ? "" : "text-muted"}`}
                    style={{ color: isActive ? cssVar : undefined }}
                  >
                    <span className="font-mono text-xs transition-colors duration-500 ease-out">
                        0{idx + 1}
                    </span>
                    <span className="text-3xl sm:text-4xl font-black tracking-tighter uppercase transition-all duration-500 ease-out hover:opacity-80">
                      {sec}
                    </span>
                  </a>
                );
              })}
            </div>
            
            <div className="mt-auto pt-10 border-t border-surface font-mono text-[9px] text-muted flex justify-between items-center uppercase tracking-widest">
              <span className="flex items-center gap-2">
                 <div className="w-1.5 h-1.5 rounded-full shadow-[0_0_6px_currentColor]" style={{ backgroundColor: "var(--accent-skills)", color: "var(--accent-skills)" }}></div>
                 System_Online
              </span>
              <span>JOTHISH GANDHAM</span>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}