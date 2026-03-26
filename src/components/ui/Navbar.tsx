"use client";

import { useEffect, useState } from "react";

const sections = ["about", "projects", "skills", "terminal", "contact"];

export default function Navbar() {
  const [active, setActive] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      const scrollPos = window.scrollY + 150; // Offset for detection

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

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 ${
        scrolled
          ? "py-3 bg-black/40 backdrop-blur-xl border-b border-white/[0.05]"
          : "py-6 bg-transparent"
      }`}
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex justify-between items-center">
        
        {/* Logo / System ID */}
        <a
          href="#"
          className="group flex items-center gap-3 font-mono text-[11px] tracking-[0.2em] text-white"
        >
          <div className="relative w-2 h-2">
             <div className="absolute inset-0 bg-cyan-500 rounded-full animate-ping opacity-20"></div>
             <div className="relative w-2 h-2 bg-cyan-500 rounded-full"></div>
          </div>
          <span className="opacity-70 group-hover:opacity-100 transition-opacity">
            JOTHISH_LABS <span className="text-zinc-600 font-light">v2.0.4</span>
          </span>
        </a>

        {/* Desktop Navigation - HUD Style */}
        <div className="hidden md:flex items-center gap-1">
          {sections.map((sec, idx) => (
            <a
              key={sec}
              href={`#${sec}`}
              className={`group relative px-5 py-2 font-mono text-[10px] tracking-widest uppercase transition-all duration-300 ${
                active === sec ? "text-white" : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              <span className="relative z-10 flex items-center gap-2">
                <span className={`text-[8px] ${active === sec ? "text-cyan-500" : "text-zinc-800"}`}>
                  0{idx + 1}
                </span>
                {sec}
              </span>
              
              {/* Subtle active state - No heavy underline */}
              {active === sec && (
                <div className="absolute inset-0 bg-white/[0.03] border-x border-white/10 rounded-sm"></div>
              )}
            </a>
          ))}
        </div>

        {/* Action Toggle (Mobile) */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2 group"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle Menu"
        >
          <div className={`h-[1px] w-6 bg-white transition-all ${menuOpen ? "rotate-45 translate-y-2" : ""}`}></div>
          <div className={`h-[1px] w-6 bg-white transition-all ${menuOpen ? "opacity-0" : ""}`}></div>
          <div className={`h-[1px] w-6 bg-white transition-all ${menuOpen ? "-rotate-45 -translate-y-1.5" : ""}`}></div>
        </button>
      </div>

      {/* Mobile Dropdown - Full Screen Blur */}
      <div 
        className={`fixed inset-0 top-[60px] bg-black/95 backdrop-blur-2xl transition-all duration-500 md:hidden overflow-hidden ${
          menuOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        <div className="flex flex-col p-8 gap-8">
          {sections.map((sec, idx) => (
            <a
              key={sec}
              href={`#${sec}`}
              onClick={() => setMenuOpen(false)}
              className="group flex items-baseline gap-4 border-b border-white/5 pb-4"
            >
              <span className="font-mono text-[10px] text-cyan-500">0{idx + 1}</span>
              <span className="text-3xl font-bold tracking-tighter uppercase group-hover:pl-4 transition-all">
                {sec}
              </span>
            </a>
          ))}
          
          <div className="mt-auto font-mono text-[10px] text-zinc-600 flex justify-between uppercase">
            <span>Security_Verified</span>
            <span>2026 // ALL_RIGHTS_RESERVED</span>
          </div>
        </div>
      </div>
    </nav>
  );
}