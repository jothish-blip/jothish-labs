"use client";

import React, { Suspense, useState, useEffect } from "react";
import jsPDF from "jspdf";
import { toPng } from "html-to-image";
import { useRouter, useSearchParams } from "next/navigation";

function ResumeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from");
  
  // State for the auto-hiding sticky header
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      // Hide if scrolling down and past 80px, show if scrolling up
      if (window.scrollY > lastScrollY && window.scrollY > 80) {
        setIsHeaderVisible(false);
      } else {
        setIsHeaderVisible(true);
      }
      lastScrollY = window.scrollY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleDownloadPdf = async () => {
    const element = document.getElementById("resume");
    if (!element) return;

    // Scroll to top to ensure html-to-image captures everything correctly
    window.scrollTo(0, 0);

    try {
      await document.fonts.ready;

      const dataUrl = await toPng(element, {
        cacheBust: true,
        pixelRatio: 4, 
        backgroundColor: "#ffffff",
        style: {
          transform: "scale(1)",
          transformOrigin: "top left",
          margin: "0", 
        },
      });

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const img = new Image();
      img.src = dataUrl;

      img.onload = () => {
        const pageWidth = 210;
        const pageHeight = 297;

        const imgWidth = pageWidth;
        const imgHeight = (img.height * imgWidth) / img.width;

        let finalWidth = imgWidth;
        let finalHeight = imgHeight;

        if (imgHeight > pageHeight) {
          finalHeight = pageHeight;
          finalWidth = (img.width * finalHeight) / img.height;
        }

        const x = (pageWidth - finalWidth) / 2;
        const y = 0;

        pdf.addImage(dataUrl, "PNG", x, y, finalWidth, finalHeight);
        pdf.save("Jothish_Gandham_Resume.pdf");
      };

    } catch (error) {
      console.error("Failed to generate PDF:", error);
      alert("Something went wrong generating the PDF. Please try again.");
    }
  };

  return (
    <>
      {/* Sticky & Auto-Hiding Top Navigation */}
      <div 
        className={`fixed top-0 left-0 w-full z-50 bg-gray-50/90 backdrop-blur-md border-b border-gray-200/50 py-3 px-4 sm:px-6 flex justify-center items-center print:hidden transition-transform duration-300 ease-in-out ${
          isHeaderVisible ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="w-full max-w-[794px] flex justify-end gap-4">
          <button
            onClick={() => {
              if (from) {
                router.push(`/#${from}`);
              } else {
                router.push("/");
              }
            }}
            className="text-sm font-medium text-gray-500 hover:text-black transition-colors flex items-center"
          >
            ← Back
          </button>

          <button
            onClick={handleDownloadPdf}
            className="bg-slate-900 text-white px-4 py-2 text-sm rounded-md hover:bg-slate-700 transition-colors shadow-sm"
          >
            Download PDF
          </button>
        </div>
      </div>

      {/* Main Content Area - Added pt-20 to account for fixed header */}
      <main className="flex flex-col items-center min-h-screen bg-gray-50 pt-20 pb-6 px-4 sm:px-6 print:bg-white print:text-black print:shadow-none print:py-0 print:px-0 print:mt-4 print:mb-4 text-gray-800 font-sans">
        
        <div className="animate-fadeIn w-full max-w-[794px] flex flex-col items-center">
          
          {/* Resume "Paper" Card */}
          <div id="resume" className="w-full sm:w-[794px] min-h-[1123px] bg-white shadow-lg rounded-sm p-6 sm:p-8 md:p-10 print:shadow-none print:p-0 shrink-0">
            
            {/* Header */}
            <header className="text-left pb-3 mb-3">
              <h1 className="text-3xl md:text-4xl print:text-2xl font-extrabold text-slate-900 tracking-tight uppercase">
                JOTHISH GANDHAM
              </h1>
              <div className="h-1 w-16 bg-blue-600 mt-2 mb-3"></div>
              
              <p className="text-lg md:text-xl print:text-sm text-slate-600 font-medium mt-1">
                Cybersecurity-Focused Student | Network Analysis • System Security • Threat Detection
              </p>
              <p className="text-sm print:text-xs text-gray-500 mt-2 max-w-2xl">
                Hands-on experience in network analysis, system security, and practical lab-based learning.
              </p>
              
              {/* Contact Info */}
              <div className="flex flex-wrap gap-y-2 gap-x-4 mt-3 text-sm print:text-xs text-slate-600 font-medium">
                <span className="flex items-center">Nashik, Maharashtra, India</span>
                <span className="text-gray-300 print:text-gray-400">|</span>
                <span className="flex items-center">8374754009</span>
                <span className="text-gray-300 print:text-gray-400">|</span>
                <a href="mailto:jothishgandham2@gmail.com" className="hover:text-blue-600 transition-colors">
                  jothishgandham2@gmail.com
                </a>
                <span className="text-gray-300 print:text-gray-400">|</span>
                <a href="https://linkedin.com/in/jothish-gandham" target="_blank" rel="noreferrer" className="hover:text-blue-600 transition-colors">
                  <span className="font-mono text-xs">linkedin.com/in/jothish-gandham</span>
                </a>
                <span className="text-gray-300 print:text-gray-400">|</span>
                <a href="https://github.com/jothish-blip/jothish-labs" target="_blank" rel="noreferrer" className="hover:text-blue-600 transition-colors">
                  <span className="font-mono text-xs">github.com/jothish-blip/jothish-labs</span>
                </a>
              </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-4 print:gap-4 print:grid-cols-[2fr_1fr]">
              
              {/* Left Column */}
              <div className="space-y-2.5">
                <section className="break-inside-avoid">
                  <h2 className="text-xl print:text-base font-bold text-slate-900 uppercase tracking-wider border-b-2 border-blue-600 pb-1 mb-3">
                    Experience
                  </h2>
                  <div>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                      <h3 className="text-base font-semibold text-slate-800">Independent Cybersecurity Practice</h3>
                      <span className="text-xs font-medium text-slate-500 bg-slate-100 print:bg-transparent print:p-0 px-2 py-1 rounded mt-1 sm:mt-0">2026 – Present</span>
                    </div>
                    <p className="text-sm print:text-xs font-semibold text-blue-600 mb-1.5">Hands-on Labs & Security Simulations</p>
                    <ul className="list-disc list-outside ml-5 text-sm print:text-xs text-gray-700 space-y-[2px] marker:text-blue-500">
                      <li>Analyzed network traffic using Wireshark and tcpdump to isolate protocols, identify anomalies, and investigate packet-level behaviors.</li>
                      <li>Navigated and secured Linux environments, managing file permissions, user access, and troubleshooting system configurations.</li>
                      <li>Performed port and service enumeration using Nmap to identify open ports and potential attack surfaces.</li>
                      <li>Executed structured cybersecurity labs and real-world simulations to bridge theoretical concepts with practical application.</li>
                    </ul>
                  </div>
                </section>

                <section className="break-inside-avoid mt-2.5">
                  <h2 className="text-xl print:text-base font-bold text-slate-900 uppercase tracking-wider border-b-2 border-blue-600 pb-1 mb-3">
                    Projects
                  </h2>
                  <div className="space-y-2.5">
                    <div>
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                        <h3 className="text-base font-semibold text-slate-800">Nextask</h3>
                      </div>
                      <p className="text-sm print:text-xs font-semibold text-blue-600 mb-1.5">Full-Stack Productivity System</p>
                      <ul className="list-disc list-outside ml-5 text-sm print:text-xs text-gray-700 space-y-[2px] marker:text-blue-500">
                        <li>Designed and implemented a modular productivity system including task tracking, focus sessions, and structured planning workflows.</li>
                        <li>Built a clean, scalable UI architecture using React and Next.js for maintainability and performance.</li>
                        <li>Optimized user workflow visibility through structured layouts and intuitive interaction patterns.</li>
                      </ul>
                    </div>

                    <div>
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                        <h3 className="text-base font-semibold text-slate-800">Security Learning Labs</h3>
                      </div>
                      <p className="text-sm print:text-xs font-semibold text-blue-600 mb-1.5">Practical Security Lab Environment</p>
                      <ul className="list-disc list-outside ml-5 text-sm print:text-xs text-gray-700 space-y-[2px] marker:text-blue-500">
                        <li>Conducted hands-on security labs covering Linux systems, networking, and log analysis in controlled environments.</li>
                        <li>Analyzed real network traffic using Wireshark and tcpdump to identify anomalies and protocol behaviors.</li>
                        <li>Maintained structured documentation of findings and learning progress in a public repository at <a href="https://github.com/jothish-blip/jothish-labs" className="text-blue-500 hover:underline" target="_blank" rel="noreferrer">github.com/jothish-blip/jothish-labs</a>.</li>
                      </ul>
                    </div>
                  </div>
                </section>
              </div>

              {/* Right Column */}
              <div className="space-y-2.5 mt-4 md:mt-0 print:mt-0">
                <section className="break-inside-avoid">
                  <h2 className="text-xl print:text-base font-bold text-slate-900 uppercase tracking-wider border-b-2 border-blue-600 pb-1 mb-3">
                    Education
                  </h2>
                  <div className="space-y-2.5 text-sm print:text-xs">
                    <div>
                      <p className="font-semibold text-slate-800">Sandip University, Nashik</p>
                      <p className="text-gray-700 font-medium">B.Tech in Computer Science (Cybersecurity & Forensics)</p>
                      <p className="text-slate-500 text-xs mt-0.5">2024 – 2028</p>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800">Narayana Junior College</p>
                      <p className="text-gray-600">Intermediate (MPC)</p>
                      <p className="text-slate-500 text-xs mt-0.5">2022 – 2024</p>
                    </div>
                  </div>
                </section>

                <section className="break-inside-avoid mt-2.5">
                  <h2 className="text-xl print:text-base font-bold text-slate-900 uppercase tracking-wider border-b-2 border-blue-600 pb-1 mb-3">
                    Certifications
                  </h2>
                  <div className="text-sm print:text-xs">
                    <p className="font-semibold text-slate-800 mb-2">Google Cybersecurity</p>
                    <ul className="list-none space-y-[2px] text-gray-700">
                      <li className="flex items-start"><span className="text-blue-600 font-bold mr-2">✓</span> Tools of the Trade: Linux and SQL</li>
                      <li className="flex items-start"><span className="text-blue-600 font-bold mr-2">✓</span> Connect and Protect: Networks</li>
                      <li className="flex items-start"><span className="text-blue-600 font-bold mr-2">✓</span> Play It Safe: Manage Security Risks</li>
                      <li className="flex items-start"><span className="text-blue-600 font-bold mr-2">✓</span> Foundations of Cybersecurity</li>
                    </ul>
                    <div className="mt-3 p-2 print:p-0 bg-slate-50 print:bg-transparent rounded border border-gray-200 print:border-none">
                      <p className="font-semibold text-slate-800 text-xs uppercase mb-1">In Progress</p>
                      <p className="text-xs text-gray-600 leading-tight">Threats & Vulnerabilities, CompTIA Security+ (~45%), Linux+ (~35%)</p>
                    </div>
                  </div>
                </section>

                <section className="break-inside-avoid mt-2.5">
                  <h2 className="text-xl print:text-base font-bold text-slate-900 uppercase tracking-wider border-b-2 border-blue-600 pb-1 mb-3">
                    Skills
                  </h2>
                  <div className="space-y-2.5 text-sm print:text-xs">
                    <div>
                      <p className="font-semibold text-slate-800">Operating Systems</p>
                      <p className="text-gray-600">Linux (CLI, Bash), Windows (PowerShell, WSL)</p>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800">Networking & Security Tools</p>
                      <p className="text-gray-600">Wireshark, tcpdump, Nmap</p>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800">Development</p>
                      <p className="text-gray-600">React, Next.js, Git, MySQL</p>
                    </div>
                  </div>
                </section>

                <section className="break-inside-avoid mt-2.5">
                  <h2 className="text-xl print:text-base font-bold text-slate-900 uppercase tracking-wider border-b-2 border-blue-600 pb-1 mb-3">
                    Languages
                  </h2>
                  <p className="text-sm print:text-xs text-gray-600">English, Telugu</p>
                </section>

              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default function ResumePage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
      <ResumeContent />
    </Suspense>
  );
}