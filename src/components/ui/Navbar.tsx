"use client";

import { useEffect, useState, useRef } from "react";
import { useScrollLock } from "@/hooks/useScrollLock";
import { trackEvent, TELEMETRY_EVENTS } from "@/lib/telemetry/events";

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
  // Scroll Logic: Consolidated State for fewer re-renders
  const [navState, setNavState] = useState({
    active: "",
    scrolled: false,
    hidden: false,
    progress: 0,
  });

  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [showResumeOptions, setShowResumeOptions] = useState(false); // NEW: Resume Modal State

  const lastScrollY = useRef(0);
  const scrollTimeout = useRef<number | null>(null);

  // Destructure for easier use in template
  const { active, scrolled, hidden, progress } = navState;

  // Mobile UX Issues: Multi-directional swipe logic
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

  // Theme Init
  useEffect(() => {

    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark" || savedTheme === "light") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTheme(savedTheme);
      document.documentElement.classList.toggle("dark", savedTheme === "dark");
      return;
    }

    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setTheme(prefersDark ? "dark" : "light");
    document.documentElement.classList.toggle("dark", prefersDark);
  }, []);

  const toggleTheme = () => {
    if (typeof navigator !== "undefined" && navigator.vibrate) navigator.vibrate(10);
    
    // Calculate new theme
    const newTheme = theme === "dark" ? "light" : "dark";
    
    // 1. Update React state
    setTheme(newTheme);
    
    // 2. Update DOM immediately
    document.documentElement.classList.toggle("dark", newTheme === "dark");
    
    // 3. Persist to localStorage
    localStorage.setItem("theme", newTheme);

    // Track Theme Change
    trackEvent({
      type: TELEMETRY_EVENTS.THEME_CHANGE,
      metadata: { theme: newTheme }
    });
  };

  // Lock background scroll when mobile menu or resume modal is open
  useScrollLock(menuOpen || showResumeOptions);

  useEffect(() => {
    const handleScroll = () => {
      if (scrollTimeout.current) return;

      scrollTimeout.current = window.requestAnimationFrame(() => {
        const currentScroll = window.scrollY;

        // Progress Calc
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const newProgress = height > 0 ? (currentScroll / height) * 100 : 0;

        // Hide/Show Logic
        let newScrolled = false;
        let newHidden = false;

        if (currentScroll > 100) {
          newScrolled = true;
          // IMPORTANT FIX: 400px threshold buffer to prevent scroll flicker
          newHidden = currentScroll > lastScrollY.current && currentScroll > 400;
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
        setNavState((prev) => {
          if (
            prev.progress !== newProgress ||
            prev.scrolled !== newScrolled ||
            prev.hidden !== newHidden ||
            prev.active !== newActive
          ) {
            return {
              progress: newProgress,
              scrolled: newScrolled,
              hidden: newHidden,
              active: newActive,
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
    if (typeof navigator !== "undefined" && navigator.vibrate) navigator.vibrate(10); 

    const el = document.getElementById(id);
    if (el) {
      document.body.style.cursor = "wait";
      const yOffset = -100;
      const y = el.getBoundingClientRect().top + window.scrollY + yOffset;

      // Close menu first to unlock scroll
      setMenuOpen(false);

      // Give React time to remove overflow:hidden
      setTimeout(() => {
        window.scrollTo({ top: y, behavior: "smooth" });
      }, 50);

      setTimeout(() => {
        document.body.style.cursor = "default";
      }, 300);
    }
  };

  const activeColorVar = active ? sectionConfig[active].cssVar : "var(--accent-hero)";

  return (
    <>
      {/* Dark / Light Mode Dual Tokens Inline Definition */}
      <style jsx global>{`
        :root {
          --accent-hero: #6366f1;
          --accent-about: #52525b;
          --accent-projects: #ca8a04;
          --accent-skills: #059669;
          --accent-terminal: #dc2626;
          --accent-contact: #2563eb;
          scroll-behavior: smooth;
          scroll-padding-top: 100px;
        }
        html.dark {
          --accent-hero: #818cf8;
          --accent-about: #a1a1aa;
          --accent-projects: #fb923c;
          --accent-skills: #34d399;
          --accent-terminal: #ef4444;
          --accent-contact: #60a5fa;
        }
      `}</style>

      <nav
        className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 ease-out transform ${
          hidden ? "-translate-y-full" : "translate-y-0"
        }
        before:absolute before:inset-0 before:-z-10 before:transition-all before:duration-700 before:ease-out
        ${
          scrolled
            ? "py-3 bg-background/80 backdrop-blur-2xl border-b border-surface shadow-sm dark:shadow-[0_4px_20px_rgba(0,0,0,0.4)] before:opacity-100"
            : "py-6 bg-transparent before:opacity-0"
        }`}
        style={{
          "--nav-gradient": active
            ? `linear-gradient(to right, transparent, color-mix(in srgb, ${activeColorVar} 15%, transparent), transparent)`
            : "transparent",
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ...({ "&::before": { background: "var(--nav-gradient)" } } as any),
        }}
      >
        {/* PREMIUM GLOBAL PROGRESS TRACKER WITH DOPAMINE GLOW */}
        <div
          className="absolute top-0 left-0 h-[2px] transition-all duration-300 ease-out z-[102]"
          style={{ 
            width: `${progress}%`, 
            backgroundColor: activeColorVar, 
            boxShadow: `0 0 10px 1px color-mix(in srgb, ${activeColorVar} 80%, transparent), 0 0 20px 2px color-mix(in srgb, ${activeColorVar} 40%, transparent)` 
          }}
        />

        {/* PROGRESS PERCENTAGE: Visible on both mobile and desktop when scrolled */}
        <div
          className={`absolute top-4 right-16 md:top-2 md:right-6 text-[9px] font-bold font-mono tracking-widest block transition-colors duration-500 ${
            scrolled ? "opacity-100" : "opacity-0"
          }`}
          style={{ color: activeColorVar }}
        >
          {Math.round(progress)}%
        </div>

        <div className="max-w-[1500px] mx-auto px-6 md:px-12 flex justify-between items-center relative">
          <a
            href="#"
            onClick={(e) => smoothScroll(e, "hero")}
            className="group flex flex-col font-mono relative z-[101] transition-transform duration-300 hover:scale-[1.03] active:scale-95 focus:outline-none focus:ring-1 focus:ring-cyan-500/30 rounded-sm p-1"
          >
            <div className="flex items-center gap-2">
              <div
                className="w-1.5 h-1.5 rounded-full transition-all duration-500 animate-pulse"
                style={{ 
                  backgroundColor: activeColorVar, 
                  boxShadow: `0 0 8px ${activeColorVar}` 
                }}
              ></div>
              <span className="text-[12px] font-black tracking-[0.2em] text-foreground uppercase group-hover:tracking-[0.25em] transition-all duration-300 ease-out">
                JOTHISH GANDHAM
              </span>
            </div>
            <span 
              className="text-[9px] tracking-widest font-light ml-3.5 uppercase transition-colors duration-300"
              style={{ color: activeColorVar }}
            >
              Status: <span className="font-medium">Active</span>
            </span>
          </a>

          {/* ACTIVE SECTION SUB-LABEL: Visible on desktop and mobile when scrolled */}
          <div
            className={`absolute top-full mt-6 md:mt-4 left-1/2 -translate-x-1/2 text-[10px] font-mono tracking-widest uppercase transition-all duration-500 ease-out pointer-events-none font-semibold ${
              scrolled ? "opacity-100" : "opacity-0 md:opacity-100"
            }`}
            style={{ 
              color: activeColorVar,
              textShadow: `0 0 15px color-mix(in srgb, ${activeColorVar} 50%, transparent)`
            }}
          >
            {active || "home"}
          </div>

          <div className="hidden md:flex items-center gap-2 bg-background/50 border border-surface rounded-full px-2 py-1 shadow-sm backdrop-blur-md">
            {sections.map((sec, idx) => {
              const isActive = active === sec;
              const cssVar = sectionConfig[sec].cssVar;

              return (
                <a
                  key={sec}
                  href={`#${sec}`}
                  onClick={(e) => smoothScroll(e, sec)}
                  className={`group relative min-h-[44px] flex items-center px-6 py-2 font-mono text-[11px] tracking-widest uppercase transition-all duration-500 ease-out active:scale-95 focus:outline-none focus:ring-1 focus:ring-cyan-500/30 rounded-full ${
                    isActive ? "scale-105 font-bold" : "text-muted hover:text-foreground hover:bg-surface/30"
                  }`}
                  style={{ 
                    color: isActive ? cssVar : undefined,
                    backgroundColor: isActive ? `color-mix(in srgb, ${cssVar} 10%, transparent)` : undefined,
                    border: isActive ? `1px solid color-mix(in srgb, ${cssVar} 20%, transparent)` : '1px solid transparent'
                  }}
                >
                  <div className="relative z-10 flex flex-col items-center">
                    <span
                      className={`text-[7px] mb-0.5 transition-colors duration-500 ease-out ${
                        isActive ? "" : "text-muted group-hover:text-foreground"
                      }`}
                    >
                      0{idx + 1}
                    </span>
                    <span className="transition-transform duration-500 ease-out">{sec}</span>
                  </div>

                  <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 delay-75 ease-out pointer-events-none whitespace-nowrap bg-background text-[9px] px-2 py-1 rounded-sm border border-surface text-muted shadow-md">
                    {sectionConfig[sec].label}
                  </div>

                  {isActive && (
                    <div
                      className="absolute inset-0 opacity-20 blur-md rounded-full transition-opacity duration-500"
                      style={{ backgroundColor: cssVar }}
                    ></div>
                  )}
                </a>
              );
            })}
          </div>

          {/* RIGHT ACTIONS: Resume & Theme Toggle Grouped */}
          <div className="flex items-center gap-3 relative z-[101]">
            <button
              onClick={() => {
                if (typeof navigator !== "undefined" && navigator.vibrate) navigator.vibrate(10);
                setShowResumeOptions(true);
              }}
              className="hidden md:flex items-center gap-2 px-5 py-2 border rounded-full font-mono text-[11px] tracking-widest uppercase transition-all duration-300 active:scale-95 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 shadow-sm"
              style={{ 
                borderColor: `color-mix(in srgb, ${activeColorVar} 30%, transparent)`, 
                color: activeColorVar,
                backgroundColor: `color-mix(in srgb, ${activeColorVar} 5%, transparent)`
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
              Resume
            </button>

            <button
              type="button"
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
              className="flex items-center justify-center w-11 h-11 rounded-full border border-surface bg-background shadow-sm text-muted transition-all duration-300 hover:text-foreground focus:outline-none focus:ring-2 focus:ring-cyan-500/30 active:scale-95"
              style={{
                borderColor: `color-mix(in srgb, ${activeColorVar} 20%, transparent)`,
              }}
            >
              {theme === "dark" ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                  <path d="M12 3v2m0 14v2m9-9h-2M5 12H3m15.364-6.364l-1.414 1.414M7.05 16.95l-1.414 1.414M18.364 18.364l-1.414-1.414M7.05 7.05L5.636 5.636" />
                  <circle cx="12" cy="12" r="5" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                  <path d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" />
                </svg>
              )}
            </button>

            <button
              className={`md:hidden flex items-center justify-center p-2.5 group bg-background rounded-sm border transition-all duration-300 ease-out focus:outline-none focus:ring-1 focus:ring-cyan-500/30 ${
                menuOpen ? "opacity-0 pointer-events-none" : "opacity-100 active:scale-95"
              }`}
              style={{
                borderColor: `color-mix(in srgb, ${activeColorVar} 30%, transparent)`,
              }}
              onClick={() => {
                if (typeof navigator !== "undefined" && navigator.vibrate) navigator.vibrate(10);
                setMenuOpen(true);
              }}
              aria-label="Open Menu"
            >
              <svg 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke={activeColorVar} 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="w-5 h-5 transition-colors"
              >
                <line x1="4" y1="6" x2="20" y2="6"></line>
                <line x1="4" y1="12" x2="20" y2="12"></line>
                <line x1="4" y1="18" x2="20" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>

        {/* --- FIXED OVERLAY SECTION --- */}
        <div
          className={`fixed inset-0 w-full h-[100dvh] bg-background/95 backdrop-blur-md transition-all duration-500 ease-out md:hidden z-[110] ${
            menuOpen ? "translate-y-0 opacity-100 pointer-events-auto" : "-translate-y-full opacity-0 pointer-events-none"
          }`}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
        >
          <button
            onClick={() => setMenuOpen(false)}
            className="absolute top-4 right-4 p-2.5 bg-surface/30 border border-surface rounded-md text-foreground hover:bg-surface transition-all active:scale-95 focus:outline-none z-[115]"
            aria-label="Close Menu"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>

          <div className="flex flex-col p-6 pt-20 h-full overflow-y-auto">
            <div className="mb-8 border-b border-surface pb-6 flex justify-between items-end">
              <div>
                <h3 className="text-[10px] font-mono text-muted uppercase tracking-[0.24em]">Navigation</h3>
              </div>
              <div className="text-[9px] text-muted font-mono tracking-[0.24em] text-right uppercase">
                Swipe down or
                <br />
                right to close
              </div>
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
                    className={`group flex items-center gap-6 active:scale-95 transition-all duration-300 ease-out focus:outline-none p-2 rounded-sm ${
                      isActive ? "text-foreground" : "text-muted"
                    }`}
                    style={{ color: isActive ? cssVar : undefined }}
                  >
                    <span className="font-mono text-xs transition-colors duration-500 ease-out">0{idx + 1}</span>
                    <span className="text-3xl sm:text-4xl font-semibold tracking-tight uppercase transition-all duration-500 ease-out hover:opacity-80">
                      {sec}
                    </span>
                  </a>
                );
              })}

              <div className="w-full h-px bg-surface my-1" />

              <button
                onClick={() => {
                  if (typeof navigator !== "undefined" && navigator.vibrate) navigator.vibrate(10);
                  setMenuOpen(false);
                  setShowResumeOptions(true);
                }}
                className="group flex items-center gap-6 active:scale-95 transition-all duration-300 ease-out focus:outline-none p-2 rounded-sm text-muted w-full text-left"
              >
                <span className="font-mono text-[10px] transition-colors duration-500 ease-out uppercase tracking-widest">
                  RS
                </span>
                <span className="text-3xl sm:text-4xl font-semibold tracking-tight uppercase transition-all duration-500 ease-out hover:opacity-80 text-foreground">
                  Resume
                </span>
              </button>
            </div>

            <div className="mt-auto pt-10 border-t border-surface font-mono text-[9px] text-muted flex justify-between items-center uppercase tracking-[0.24em]">
              <span className="flex items-center gap-2">
                <div
                  className="w-1.5 h-1.5 rounded-full shadow-[0_0_6px_currentColor]"
                  style={{ backgroundColor: activeColorVar, color: activeColorVar }}
                ></div>
                System_Online
              </span>
              <span>Jothish Gandham</span>
            </div>
          </div>
        </div>
      </nav>

      {/* MODAL UI (Shared for Desktop and Mobile) */}
      {showResumeOptions && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-background/80 backdrop-blur-md" onClick={() => setShowResumeOptions(false)}>
          <div className="bg-background border border-surface rounded-md p-6 w-[320px] space-y-4 shadow-2xl animate-in fade-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-[10px] font-mono uppercase tracking-[0.24em] text-muted text-center pb-3 border-b border-surface">
              Resume Options
            </h3>
            
            <a
              href="/Resume"
              className="block w-full text-center px-4 py-3.5 border border-surface bg-surface/20 hover:bg-surface text-foreground text-[10px] font-mono uppercase tracking-[0.24em] transition-all rounded-sm"
              onClick={() => setShowResumeOptions(false)}
            >
              View Resume (Web)
            </a>

            <a
              href="/GANDHAM_JOTHISH_Resume.pdf"
              download
              className="block w-full text-center px-4 py-3.5 border border-surface bg-surface/20 hover:bg-surface text-foreground text-[10px] font-mono uppercase tracking-[0.24em] transition-all rounded-sm"
              onClick={() => setShowResumeOptions(false)}
            >
              Download Resume (PDF)
            </a>

            <button
              onClick={() => setShowResumeOptions(false)}
              className="text-[9px] font-mono tracking-[0.24em] text-muted hover:text-foreground uppercase w-full mt-4 transition-colors pt-2"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* SIDEBAR NAVIGATION: Progress Line + Nodes + Centered Labels */}
      <aside
        className={`fixed left-4 lg:left-6 top-1/2 -translate-y-1/2 z-[105] hidden md:flex flex-col items-start transition-all duration-500 group/sidebar ${
          hidden ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-6 pointer-events-none"
        }`}
      >
        <div
          className="w-4 flex justify-center text-[9px] font-mono font-bold tracking-[0.24em] mb-5 transition-colors duration-300 overflow-visible whitespace-nowrap"
          style={{ 
            color: activeColorVar,
            textShadow: `0 0 10px color-mix(in srgb, ${activeColorVar} 50%, transparent)`
          }}
        >
          {Math.round(progress)}%
        </div>

        <div className="relative flex flex-col gap-8 py-2 ml-[7px]">
          {/* Faded Background Track */}
          <div className="absolute left-[0.5px] top-0 bottom-0 w-[1px] bg-surface-strong/50 z-0"></div>

          {/* Active Vertical Progress Line with Dopamine Glow */}
          <div
            className="absolute left-[0.5px] top-0 w-[1px] transition-all duration-300 z-0"
            style={{
              height: `${progress}%`,
              backgroundColor: activeColorVar,
              boxShadow: `0 0 8px ${activeColorVar}`
            }}
          ></div>

          {/* Interactive Section Nodes */}
          {sections.map((sec, idx) => {
            const isActive = active === sec;
            const cssVar = sectionConfig[sec].cssVar;

            return (
              <a
                key={sec}
                href={`#${sec}`}
                onClick={(e) => smoothScroll(e, sec)}
                className="group/node flex items-center relative z-10 focus:outline-none h-4"
                aria-label={`Scroll to ${sec}`}
              >
                {/* Node Target Circle */}
                <div
                  className={`w-3 h-3 -ml-[5px] rounded-full border transition-all duration-300 shrink-0 bg-background ${
                    isActive ? "scale-125 border-[1.5px]" : "border-surface opacity-60 group-hover/node:opacity-100 group-hover/node:scale-110"
                  }`}
                  style={isActive ? {
                    borderColor: cssVar,
                    boxShadow: `0 0 10px color-mix(in srgb, ${cssVar} 50%, transparent)`
                  } : {}}
                />

                {/* Vertical-Centered Label Container */}
                <div className="flex items-center ml-4 cursor-pointer leading-none">
                  {/* Always-visible Mini Label */}
                  <span
                    className={`text-[9px] font-mono leading-none transition-colors duration-300 ${
                      isActive ? "font-bold" : "text-muted"
                    }`}
                    style={{ color: isActive ? cssVar : undefined }}
                  >
                    0{idx + 1}
                  </span>

                  {/* Full Text Expanding on Hover */}
                  <div className="overflow-hidden transition-all duration-300 ease-out max-w-0 opacity-0 group-hover/sidebar:max-w-[120px] group-hover/sidebar:opacity-100 flex items-center">
                    <span
                      className="pl-3 text-[9px] font-mono leading-none uppercase tracking-[0.24em] whitespace-nowrap"
                      style={{ color: isActive ? cssVar : "var(--muted)" }}
                    >
                      {sec}
                    </span>
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      </aside>
    </>
  );
}