"use client";
import { useEffect, useRef, useState } from "react";

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const container = containerRef.current;
    if (!container) return;

    let currentX = 0;
    let currentY = 0;

    const move = (e: MouseEvent) => {
      currentX = e.clientX;
      currentY = e.clientY;
    };

    const animate = () => {
      const prevX = parseFloat(container.style.getPropertyValue("--x") || "0");
      const prevY = parseFloat(container.style.getPropertyValue("--y") || "0");

      const nextX = prevX + (currentX - prevX) * 0.1;
      const nextY = prevY + (currentY - prevY) * 0.1;

      container.style.setProperty("--x", `${nextX}px`);
      container.style.setProperty("--y", `${nextY}px`);

      requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", move);
    animate();

    return () => window.removeEventListener("mousemove", move);
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative min-h-[100svh] w-full bg-[#0a0a0a] text-white overflow-hidden flex flex-col justify-center pt-24 md:pt-28"
    >
      {/* Texture Layer */}
      <div 
        className="absolute inset-0 z-[1] opacity-[0.04] pointer-events-none mix-blend-screen" 
        style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/carbon-fibre.png')` }}
      />

      {/* Cyber Grid */}
      <div className="absolute inset-0 z-[2] opacity-[0.03] pointer-events-none bg-[linear-gradient(to_right,#00ffff_1px,transparent_1px),linear-gradient(to_bottom,#00ffff_1px,transparent_1px)] bg-[size:50px_50px]" />

      {/* Defence Field */}
      <div
        className="pointer-events-none absolute inset-0 z-[3]"
        style={{
          background: `
            radial-gradient(
              600px circle at var(--x, -1000px) var(--y, -1000px),
              rgba(0, 255, 255, 0.12),
              rgba(0, 255, 255, 0.05) 30%,
              transparent 70%
            )
          `,
        }}
      />

      {/* Core Glow */}
      <div
        className="pointer-events-none absolute w-[140px] h-[140px] bg-cyan-400/40 blur-[60px] z-[4]"
        style={{
          left: "calc(var(--x, -1000px) - 70px)",
          top: "calc(var(--y, -1000px) - 70px)",
          opacity: isMounted ? 1 : 0,
        }}
      />

      {/* Scan Line */}
      <div className="absolute inset-0 z-[5] pointer-events-none overflow-hidden">
        <div className="w-full h-[1px] bg-cyan-500/20 shadow-[0_0_15px_rgba(0,255,255,0.5)] animate-scan"></div>
      </div>

      {/* CONTENT */}
      <div className="relative z-10 px-6 md:px-16 lg:px-32">
        <div className={`transition-all duration-1000 ${isMounted ? "opacity-100" : "opacity-0"}`}>

          {/* System Label */}
          <p className="font-mono text-[10px] tracking-[0.8em] text-cyan-400 mb-6 drop-shadow-[0_0_8px_rgba(0,255,255,0.4)]">
            // ROLE: SECURITY_ANALYST_ACTIVE
          </p>

          {/* Heading */}
          <h1 className="text-6xl md:text-[100px] font-black tracking-tighter leading-[0.8] max-w-5xl">
            Defending systems <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-500 to-zinc-800">
              by understanding how they break.
            </span>
          </h1>

          {/* Description */}
          <p className="mt-10 text-zinc-400 max-w-lg text-lg font-light leading-relaxed border-l border-cyan-500/30 pl-6">
            I operate as a security analyst focused on identifying vulnerabilities, 
            analyzing threats, and strengthening infrastructure against real-world attack vectors.
          </p>

          {/* Actions */}
          <div className="mt-14 flex items-center gap-10">

            <a 
              href="#projects" 
              className="group relative px-10 py-4 bg-cyan-500 text-black font-bold text-xs tracking-widest uppercase overflow-hidden shadow-[0_0_30px_rgba(0,255,255,0.2)]"
            >
              <span className="relative z-10">View Investigations</span>
              <div className="absolute inset-0 bg-white translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300"></div>
            </a>

            <a 
              href="#contact" 
              className="font-mono text-[11px] text-zinc-500 hover:text-cyan-400 transition-all flex items-center gap-3"
            >
              <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></span>
              INITIATE_CONTACT
            </a>

          </div>
        </div>
      </div>

      {/* Scan Animation */}
      <style jsx>{`
        @keyframes scan {
          from { transform: translateY(-100vh); }
          to { transform: translateY(100vh); }
        }
        .animate-scan {
          animation: scan 8s linear infinite;
        }
      `}</style>

      {/* Edge Lines */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent"></div>
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-white/[0.05]"></div>
    </div>
  );
}