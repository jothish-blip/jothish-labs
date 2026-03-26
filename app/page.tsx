import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Projects from "@/components/sections/Projects";
import Skills from "@/components/sections/Skills";
import Terminal from "@/components/sections/Terminal";
import Contact from "@/components/sections/Contact";
import Navbar from "@/components/ui/Navbar";

export default function Home() {
  return (
    <main className="bg-black text-white overflow-x-hidden scroll-smooth">
      
      <Navbar />

      {/* Hero Section */}
      <section id="hero" className="h-screen w-full relative">
        <Hero />
      </section>

      {/* About Section */}
      <section id="about" className="min-h-screen w-full flex items-center">
        <div className="max-w-6xl mx-auto px-6 w-full">
          <About />
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="min-h-screen w-full flex items-center">
        <div className="max-w-6xl mx-auto px-6 w-full">
          <Projects />
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="min-h-screen w-full flex items-center">
        <div className="max-w-6xl mx-auto px-6 w-full">
          <Skills />
        </div>
      </section>

      {/* Terminal Section */}
      <section id="terminal" className="min-h-screen w-full flex items-center">
        <div className="max-w-6xl mx-auto px-6 w-full">
          <Terminal />
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="min-h-screen w-full flex items-center">
        <div className="max-w-6xl mx-auto px-6 w-full">
          <Contact />
        </div>
      </section>

    </main>
  );
}