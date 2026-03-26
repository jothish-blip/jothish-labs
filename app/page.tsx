import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Projects from "@/components/sections/Projects";
import Skills from "@/components/sections/Skills";
import Terminal from "@/components/sections/Terminal";
import Contact from "@/components/sections/Contact";
import Navbar from "@/components/ui/Navbar";

export default function Home() {
  return (
    <main className="bg-[#020202] text-white overflow-x-hidden scroll-smooth selection:bg-cyan-500/30">
      
      {/* Fixed Navbar handles its own z-index */}
      <Navbar />

      {/* HERO SECTION 
          Using min-h-screen instead of h-screen prevents content 
          from collapsing on smaller mobile devices.
      */}
      <div id="hero" className="relative min-h-screen w-full border-b border-white/[0.02]">
        <Hero />
      </div>

      {/* CONTENT SECTIONS
          We remove the extra <div> wrappers and flex-center logic here
          because your individual components (About, Projects, etc.) 
          already handle their own internal spacing and centering.
      */}
      
      <div id="about" className="relative">
        <About />
      </div>

      <div id="projects" className="relative">
        <Projects />
      </div>

      <div id="skills" className="relative">
        <Skills />
      </div>

      <div id="terminal" className="relative">
        <Terminal />
      </div>

      <div id="contact" className="relative">
        <Contact />
      </div>

      {/* Optional: Subtle global footer or bottom spacer */}
      <footer className="py-10 bg-[#020202] border-t border-white/[0.02] text-center">
        <p className="font-mono text-[8px] text-zinc-800 uppercase tracking-[0.5em]">
          End of Dossier // Data Secure
        </p>
      </footer>

    </main>
  );
}