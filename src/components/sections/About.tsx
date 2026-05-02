"use client";
import { useEffect, useState } from "react";

// FIX: Explicitly adding "/index" stops Windows from confusing the folder with the file
import { 
  IdentitySection, 
  FocusSection, 
  CertificationsSection, 
  CompTIASection 
} from "./about/index"; 

export default function About() {
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <section id="about" className="relative min-h-screen w-full bg-background text-foreground py-20 sm:py-28 lg:py-32 px-5 sm:px-8 md:px-16 lg:px-32 overflow-hidden border-t border-surface font-sans">
      
      {/* Background Grid Pattern */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(to right, var(--accent-grid) 1px, transparent 1px), linear-gradient(to bottom, var(--accent-grid) 1px, transparent 1px)`,
          backgroundSize: '70px 70px'
        }}
      ></div>

      {/* Main Content Wrapper with Mount Animation */}
      <div className={`relative z-10 max-w-5xl mx-auto space-y-14 transition-all duration-700 ${isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        
        <IdentitySection />
        <FocusSection />
        <CertificationsSection />
        <CompTIASection />

      </div>
    </section>
  );
}