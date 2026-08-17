"use client";

import { useEffect, useState } from "react";

// FIX: Explicitly adding "/index" stops Windows from confusing the folder with the file
import {
  IdentitySection,
  FocusSection,
  GoogleSection,
  CompTIASection,
} from "./about/index";

export default function About() {
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
  }, []);

  return (
    <section
      id="about"
      className="relative min-h-screen w-full text-foreground py-20 sm:py-28 lg:py-32 px-5 sm:px-8 md:px-16 lg:px-32 overflow-hidden border-t border-surface font-sans"
    >
      {/* Radiolucent Glow / X-Ray Effect Background tied to --accent-about */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 z-0 pointer-events-none flex items-center justify-center overflow-hidden w-full h-[500px]">
        <div 
          className="w-[300px] h-[150px] md:w-[700px] md:h-[250px] blur-[100px] rounded-[100%] opacity-30 mix-blend-screen"
          style={{ backgroundColor: 'var(--accent-about)' }}
        ></div>
        <div className="absolute inset-0 opacity-[0.02] bg-[radial-gradient(circle,currentColor_1px,transparent_1px)] bg-[size:12px_12px]"></div>
      </div>

      {/* Main Content Wrapper */}
      <div
        className={`relative z-10 max-w-6xl mx-auto space-y-16 transition-all duration-700 ${
          isMounted
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-10"
        }`}
      >
        <IdentitySection />

        <FocusSection />

        <GoogleSection />

        <CompTIASection />
      </div>
    </section>
  );
}