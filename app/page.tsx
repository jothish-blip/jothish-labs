import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Projects from "@/components/sections/Projects";
import Skills from "@/components/sections/Skills";
import Terminal from "@/components/sections/Terminal";
import Contact from "@/components/sections/Contact";
import Navbar from "@/components/ui/Navbar";
import Resume from "./Resume/page";
export default function Home() {
  return (
    /* 1 & 5. Theme-aware colors and selection highlighting */
    <main className="bg-background text-foreground overflow-x-hidden scroll-smooth selection:bg-[var(--accent-soft)] selection:text-[var(--accent)]">
      
      {/* Fixed Navbar handles its own z-index */}
      <Navbar />

      {/* 4. HERO SECTION 
          Using min-h-[100dvh] ensures perfect height on mobile browsers 
          while remaining responsive to the global theme.
      */}
      <section id="hero" className="relative min-h-[100dvh] w-full border-b border-surface">
        <Hero />
      </section>

      {/* 2 & 3. SEMANTIC CONTENT SECTIONS
          Using <section> tags for SEO and standardized vertical padding (py-16)
          to ensure a consistent visual rhythm as the user scrolls.
      */}
      
      <section id="about" className="relative py-16 sm:py-24">
        <About />
      </section>

      <section id="projects" className="relative py-16 sm:py-24">
        <Projects />
      </section>

      <section id="skills" className="relative py-16 sm:py-24">
        <Skills />
      </section>

      {/* Terminal section acts as an interactive lab space */}
      <section id="terminal" className="relative py-16 sm:py-24">
        <Terminal />
      </section>

      <section id="contact" className="relative py-16 sm:py-24">
        <Contact />
      </section>

      {/* 6. CLEAN MINIMAL FOOTER 
          Replaced "Dossier" text with a professional, theme-respecting copyright block.
      */}
      <footer className="py-12 border-t border-surface text-center bg-background">
        <div className="max-w-6xl mx-auto px-6 space-y-4">
           <p className="font-mono text-[10px] text-muted tracking-[0.4em] uppercase">
            Built with focus on security & systems
          </p>
          <p className="text-[11px] text-muted/60 font-mono">
            © {new Date().getFullYear()} Jothish Gandham • All rights reserved
          </p>
        </div>
      </footer>

    </main>
  );
}