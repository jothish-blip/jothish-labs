"use client";

import React, { useState, useRef, useEffect } from "react";
import emailjs from "@emailjs/browser";
import { SiGithub } from "react-icons/si";
import { FaPhoneAlt, FaLinkedin, FaEnvelope } from "react-icons/fa";
import { VscLoading } from "react-icons/vsc";

// Define Intent Types
type IntentType = "conversation" | "questions" | "work" | "internship";

const intents: { id: IntentType; label: string }[] = [
  { id: "conversation", label: "Conversation" },
  { id: "questions", label: "Questions" },
  { id: "work", label: "Work" },
  { id: "internship", label: "Internship" }
];

const stepTitles = {
  1: "How would you like to connect?",
  2: "Tell me a bit about you",
  3: "Add some context (optional)",
  4: "Write your message"
};

// Tailwind-safe mapping for dynamic styling per intent
const formContent: Record<IntentType, any> = {
  conversation: {
    title: "Let’s talk",
    placeholder: "What’s on your mind?",
    story: "Sometimes a simple conversation leads to something meaningful.",
    tabActive: "border-cyan-500 text-cyan-400 bg-cyan-500/10",
    tabHover: "hover:border-cyan-500/40 hover:text-zinc-200",
    focusBorder: "focus:border-cyan-500",
    focusShadowWrapper: "focus-within:shadow-[0_0_30px_rgba(34,211,238,0.12)] focus-within:border-cyan-500/40",
    textareaFocus: "focus-within:border-cyan-500/50",
    buttonIdleText: "text-cyan-500",
    borderIdle: "border-cyan-500/40",
    progressActive: "bg-cyan-400",
    progressShadow: "shadow-[0_0_8px_rgba(34,211,238,0.4)]",
    gradientOverlay: "from-cyan-500 to-blue-500",
    step3Label: "Topic (Optional)",
    step3Placeholder: "What's the main theme?"
  },
  questions: {
    title: "Ask your question",
    placeholder: "What are you trying to understand?",
    story: "If you’re stuck or curious, I’ll try to share what I know.",
    tabActive: "border-blue-500 text-blue-400 bg-blue-500/10",
    tabHover: "hover:border-blue-500/40 hover:text-zinc-200",
    focusBorder: "focus:border-blue-500",
    focusShadowWrapper: "focus-within:shadow-[0_0_30px_rgba(59,130,246,0.12)] focus-within:border-blue-500/40",
    textareaFocus: "focus-within:border-blue-500/50",
    buttonIdleText: "text-blue-500",
    borderIdle: "border-blue-500/40",
    progressActive: "bg-blue-400",
    progressShadow: "shadow-[0_0_8px_rgba(59,130,246,0.4)]",
    gradientOverlay: "from-blue-500 to-indigo-500",
    step3Label: "Subject",
    step3Placeholder: "e.g., Threat Detection, Career advice"
  },
  work: {
    title: "Let’s work together",
    placeholder: "Tell me about the work or opportunity...",
    story: "If you’re building something and think I can contribute, I’d like to hear about it.",
    tabActive: "border-emerald-500 text-emerald-400 bg-emerald-500/10",
    tabHover: "hover:border-emerald-500/40 hover:text-zinc-200",
    focusBorder: "focus:border-emerald-500",
    focusShadowWrapper: "focus-within:shadow-[0_0_30px_rgba(16,185,129,0.12)] focus-within:border-emerald-500/40",
    textareaFocus: "focus-within:border-emerald-500/50",
    buttonIdleText: "text-emerald-500",
    borderIdle: "border-emerald-500/40",
    progressActive: "bg-emerald-400",
    progressShadow: "shadow-[0_0_8px_rgba(16,185,129,0.4)]",
    gradientOverlay: "from-emerald-500 to-teal-500",
    step3Label: "Company / Organization",
    step3Placeholder: "Enter company name"
  },
  internship: {
    title: "Internship opportunity",
    placeholder: "Share details about the role...",
    story: "I’m open to learning opportunities that help me grow in real environments.",
    tabActive: "border-amber-500 text-amber-400 bg-amber-500/10",
    tabHover: "hover:border-amber-500/40 hover:text-zinc-200",
    focusBorder: "focus:border-amber-500",
    focusShadowWrapper: "focus-within:shadow-[0_0_30px_rgba(245,158,11,0.12)] focus-within:border-amber-500/40",
    textareaFocus: "focus-within:border-amber-500/50",
    buttonIdleText: "text-amber-500",
    borderIdle: "border-amber-500/40",
    progressActive: "bg-amber-400",
    progressShadow: "shadow-[0_0_8px_rgba(245,158,11,0.4)]",
    gradientOverlay: "from-amber-500 to-orange-500",
    step3Label: "Role / Internship Type",
    step3Placeholder: "Enter role details"
  }
};

export default function Contact() {
  const formRef = useRef<HTMLFormElement>(null);
  const [step, setStep] = useState(1);
  const [intent, setIntent] = useState<IntentType>("conversation");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [payloadSize, setPayloadSize] = useState(0);
  const [isMounted, setIsMounted] = useState(false);
  const [successTimer, setSuccessTimer] = useState<NodeJS.Timeout | null>(null);

  // Soft Validation State
  const [formData, setFormData] = useState({ user_name: "", user_email: "" });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Smart Field Behavior: Autofocus per step
  useEffect(() => {
    if (step > 1 && step < 5) {
      const activeInput = document.querySelector(`[data-step="${step}"] input, [data-step="${step}"] textarea`) as HTMLElement;
      if (activeInput) activeInput.focus();
    }
  }, [step]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePayloadChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const size = new Blob([e.target.value]).size;
    setPayloadSize(size);
  };

  const nextStep = () => {
    // Soft validation: block progression if name or email is empty on step 2
    if (step === 2 && (!formData.user_name.trim() || !formData.user_email.trim())) return;
    if (step < 4) setStep((prev) => prev + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep((prev) => prev - 1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && step !== 4 && step !== 1) {
      e.preventDefault();
      nextStep();
    }
  };

  const sendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");

    // Ensure you replace these with your actual EmailJS credentials
    const SERVICE_ID = "your_service_id"; 
    const TEMPLATE_ID = "your_template_id";
    const PUBLIC_KEY = "your_public_key";

    emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, formRef.current!, PUBLIC_KEY)
      .then(() => {
        setStatus("success");
        const timer = setTimeout(() => {
          resetFlow();
        }, 5000);
        setSuccessTimer(timer);
      }, () => {
        setStatus("error");
        setTimeout(() => setStatus("idle"), 4000);
      });
  };

  const resetFlow = () => {
    if (successTimer) clearTimeout(successTimer);
    formRef.current?.reset();
    setPayloadSize(0);
    setStep(1);
    setStatus("idle");
    setFormData({ user_name: "", user_email: "" });
  };

  const getStatusColor = () => {
    if (status === "sending") return "text-orange-500 border-orange-500/40 bg-orange-950/5";
    if (status === "success") return "text-emerald-500 border-emerald-500/40 bg-emerald-950/5";
    if (status === "error") return "text-red-500 border-red-500/40 bg-red-950/5";
    if (payloadSize > 1400) return "text-amber-500 border-amber-500/40 bg-[#080808]";
    return `${formContent[intent].borderIdle} bg-[#080808]`;
  };

  return (
    <section id="contact" className="relative min-h-screen w-full bg-[#030303] text-zinc-200 py-24 px-6 md:px-16 lg:px-32 overflow-hidden border-t border-white/[0.03] flex flex-col justify-between">
      
      <div className="absolute inset-0 z-0 opacity-[0.02] pointer-events-none bg-[radial-gradient(circle,#00ffff_1px,transparent_1px)] bg-[size:40px_40px]"></div>

      <div className="relative z-10 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start flex-grow">
        
        {/* LEFT COLUMN: IDENTITY & INFO */}
        <div className={`lg:col-span-5 space-y-10 transition-all duration-700 ease-out delay-0 ${isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          
          <div className="space-y-6">
            <div className="space-y-4">
              <p className="font-mono text-[10px] tracking-[0.4em] uppercase text-zinc-500">
                CONTACT
              </p>
              <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-none">
                <span className="text-zinc-300">Let’s</span>{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-300">
                  Connect
                </span>{" "}
                <span className="text-zinc-500 italic font-medium">together.</span>
              </h2>
            </div>
            
            <div className="space-y-4">
              <p className="text-zinc-400 text-[15px] max-w-sm leading-relaxed">
                If you’ve gone through my work and felt something interesting — whether it’s curiosity, ideas, or even feedback — I’d genuinely like to hear from you.
              </p>
              <p className="text-zinc-500 text-sm max-w-sm leading-relaxed">
                I’m still learning, but I take my work seriously. And conversations are a big part of how I grow.
              </p>
            </div>

            <div className="pt-4 space-y-3">
              <p className="text-[11px] text-zinc-500 font-mono uppercase tracking-widest">
                You can reach out if —
              </p>
              <ul className="text-[13px] text-zinc-400 space-y-3 leading-relaxed pl-2 border-l border-zinc-800">
                <li className="group flex items-start gap-3 text-zinc-400 hover:text-zinc-200 transition-colors duration-300 ease-out cursor-default">
                  <span className="w-1 h-1 mt-1.5 bg-zinc-600 group-hover:bg-cyan-400 transition-colors duration-300 rounded-full flex-shrink-0"></span>
                  You have feedback on my projects
                </li>
                <li className="group flex items-start gap-3 text-zinc-400 hover:text-zinc-200 transition-colors duration-300 ease-out cursor-default">
                  <span className="w-1 h-1 mt-1.5 bg-zinc-600 group-hover:bg-cyan-400 transition-colors duration-300 rounded-full flex-shrink-0"></span>
                  You want to discuss ideas or learning paths
                </li>
                <li className="group flex items-start gap-3 text-zinc-400 hover:text-zinc-200 transition-colors duration-300 ease-out cursor-default">
                  <span className="w-1 h-1 mt-1.5 bg-zinc-600 group-hover:bg-cyan-400 transition-colors duration-300 rounded-full flex-shrink-0"></span>
                  You’re working on something and need a second perspective
                </li>
                <li className="group flex items-start gap-3 text-zinc-400 hover:text-zinc-200 transition-colors duration-300 ease-out cursor-default">
                  <span className="w-1 h-1 mt-1.5 bg-zinc-600 group-hover:bg-cyan-400 transition-colors duration-300 rounded-full flex-shrink-0"></span>
                  Or just want to connect
                </li>
              </ul>
            </div>
          </div>

          <div className={`p-6 border border-white/[0.05] bg-[#050505] space-y-6 rounded-sm shadow-xl transition-all duration-700 delay-150 ease-out ${isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            <p className="text-zinc-400 text-[13px] leading-relaxed border-b border-white/5 pb-5">
              Here’s the simplest way to reach me. I prefer direct communication — no forms, no delays.
            </p>

            <div className="space-y-5 text-sm">
              <div>
                <p className="text-zinc-600 text-[11px] mb-1 uppercase tracking-widest font-mono">Name</p>
                <p className="text-zinc-200 font-medium">Jothish Gandham</p>
              </div>

              {/* TACTICAL ACTION BUTTONS */}
              <div className="pt-2">
                <p className="text-zinc-600 text-[11px] mb-3 uppercase tracking-widest font-mono">Direct Channels</p>
                <div className="flex gap-3 flex-wrap">
                  
                  <a
                    href="mailto:jothishgandham2@gmail.com"
                    className="flex items-center gap-2 px-4 py-2 border border-cyan-500/30 text-cyan-400 text-[10px] font-mono uppercase tracking-widest rounded-sm bg-gradient-to-r from-transparent to-transparent hover:from-cyan-500 hover:to-blue-500 hover:text-black transition-all duration-300 ease-out hover:shadow-[0_0_15px_rgba(34,211,238,0.2)] hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                  >
                    <FaEnvelope size={12}/> Email
                  </a>

                  <a
                    href="https://www.linkedin.com/in/jothish-gandham-5b90b334a"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 px-4 py-2 border border-blue-500/30 text-blue-400 text-[10px] font-mono uppercase tracking-widest rounded-sm bg-gradient-to-r from-transparent to-transparent hover:from-blue-500 hover:to-blue-600 hover:text-zinc-200 transition-all duration-300 ease-out hover:shadow-[0_0_15px_rgba(59,130,246,0.2)] hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                  >
                    <FaLinkedin size={12}/> LinkedIn
                  </a>

                  <a
                    href="tel:+918374754009"
                    className="flex items-center gap-2 px-4 py-2 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono uppercase tracking-widest rounded-sm bg-gradient-to-r from-transparent to-transparent hover:from-emerald-500 hover:to-emerald-600 hover:text-zinc-200 transition-all duration-300 ease-out hover:shadow-[0_0_15px_rgba(16,185,129,0.2)] hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                  >
                    <FaPhoneAlt size={10}/> Call
                  </a>

                  <a
                    href="https://github.com/jothish-blip"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 px-4 py-2 border border-zinc-500/30 text-zinc-400 text-[10px] font-mono uppercase tracking-widest rounded-sm bg-gradient-to-r from-transparent to-transparent hover:from-zinc-200 hover:to-zinc-400 hover:text-black transition-all duration-300 ease-out hover:shadow-[0_0_15px_rgba(228,228,231,0.1)] hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                  >
                    <SiGithub size={12}/> GitHub
                  </a>

                </div>
              </div>
            </div>

            <p className="text-[11px] text-zinc-500 pt-5 border-t border-white/5 font-mono">
              I usually respond within a day.
            </p>
          </div>
        </div>

        {/* RIGHT COLUMN: DYNAMIC CONTACT FORM */}
        <div className={`lg:col-span-7 mt-8 lg:mt-0 transition-all duration-700 delay-300 ease-out ${isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          
          <div className="mb-6 space-y-6">
            <h3 className="text-[15px] font-bold text-zinc-300 tracking-wide font-mono transition-colors duration-500">
              {formContent[intent].title}
            </h3>
            <p className="text-zinc-400 text-sm leading-relaxed max-w-lg transition-colors duration-500">
              {formContent[intent].story}
            </p>
          </div>

          <div className={`relative transition-all duration-500 p-6 md:p-10 rounded-sm shadow-2xl border ${formContent[intent].focusShadowWrapper} ${getStatusColor()}`}>
            
            {/* Form Progress Bar */}
            <div className="flex gap-2 mb-8">
              {[1, 2, 3, 4].map(s => (
                <div 
                  key={s} 
                  className={`h-[2px] flex-1 transition-all duration-500 ease-out ${step >= s ? `${formContent[intent].progressActive} ${formContent[intent].progressShadow}` : "bg-zinc-800"}`} 
                />
              ))}
            </div>

            <p className="text-[11px] font-mono uppercase tracking-widest text-zinc-500 mb-6">
              {stepTitles[step as keyof typeof stepTitles]}
            </p>

            <form ref={formRef} onSubmit={sendEmail} onKeyDown={handleKeyDown} aria-label="Contact form" className="relative min-h-[220px]">
              
              {/* STEP 1: INTENT SELECTOR */}
              <div className={`transition-all duration-500 ease-out absolute inset-0 ${step === 1 ? 'opacity-100 z-10 translate-x-0' : 'opacity-0 -z-10 -translate-x-8 pointer-events-none'}`}>
                <div className="flex flex-wrap gap-3" data-step="1">
                  {intents.map((item) => (
                    <button
                      key={item.id}
                      aria-pressed={intent === item.id}
                      onClick={(e) => { 
                        e.preventDefault(); 
                        setIntent(item.id); 
                        setTimeout(() => setStep(2), 250); // Auto-flow
                      }}
                      className={`px-5 py-3 text-[11px] font-mono uppercase tracking-widest border rounded-sm transition-all duration-300 ease-out cursor-pointer hover:scale-[1.02] active:scale-[0.98]
                        ${intent === item.id 
                          ? formContent[item.id].tabActive 
                          : `border-zinc-800 text-zinc-500 ${formContent[item.id].tabHover}`}
                      `}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* STEP 2: IDENTITY */}
              <div className={`transition-all duration-500 ease-out absolute inset-0 space-y-8 ${step === 2 ? 'opacity-100 z-10 translate-x-0' : step > 2 ? 'opacity-0 -z-10 -translate-x-8 pointer-events-none' : 'opacity-0 -z-10 translate-x-8 pointer-events-none'}`}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8" data-step="2">
                  <div className="space-y-3">
                    <label className="text-[11px] uppercase tracking-widest text-zinc-500 font-mono">
                      Your Name
                    </label>
                    <input 
                      type="text" 
                      name="user_name" 
                      value={formData.user_name}
                      onChange={handleInputChange}
                      placeholder="Enter your name" 
                      className={`w-full bg-transparent border-b border-zinc-800 py-3 text-zinc-200 text-sm outline-none transition-colors duration-300 ease-out placeholder:text-zinc-700 ${formContent[intent].focusBorder}`} 
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[11px] uppercase tracking-widest text-zinc-500 font-mono">
                      Email Address
                    </label>
                    <input 
                      type="email" 
                      name="user_email" 
                      value={formData.user_email}
                      onChange={handleInputChange}
                      placeholder="Enter your email" 
                      className={`w-full bg-transparent border-b border-zinc-800 py-3 text-zinc-200 text-sm outline-none transition-colors duration-300 ease-out placeholder:text-zinc-700 ${formContent[intent].focusBorder}`} 
                    />
                  </div>
                </div>
                {step === 2 && (
                  <div className="mt-8 flex justify-between">
                    <button type="button" onClick={prevStep} className="text-[11px] text-zinc-600 font-mono uppercase tracking-widest hover:text-zinc-400 transition-colors">← Back</button>
                    <button type="button" onClick={nextStep} className={`text-[11px] font-mono uppercase tracking-widest transition-colors ${formContent[intent].buttonIdleText} hover:text-zinc-200`}>Next →</button>
                  </div>
                )}
              </div>

              {/* STEP 3: DYNAMIC CONTEXT */}
              <div className={`transition-all duration-500 ease-out absolute inset-0 space-y-8 ${step === 3 ? 'opacity-100 z-10 translate-x-0' : step > 3 ? 'opacity-0 -z-10 -translate-x-8 pointer-events-none' : 'opacity-0 -z-10 translate-x-8 pointer-events-none'}`}>
                <div className="space-y-3" data-step="3">
                  <label className="text-[11px] uppercase tracking-widest text-zinc-500 font-mono">
                    {formContent[intent].step3Label}
                  </label>
                  <input 
                    type="text" 
                    name="context_info" 
                    placeholder={formContent[intent].step3Placeholder} 
                    className={`w-full bg-transparent border-b border-zinc-800 py-3 text-zinc-200 text-sm outline-none transition-colors duration-300 ease-out placeholder:text-zinc-700 ${formContent[intent].focusBorder}`} 
                  />
                </div>
                {step === 3 && (
                  <div className="mt-12 flex justify-between">
                    <button type="button" onClick={prevStep} className="text-[11px] text-zinc-600 font-mono uppercase tracking-widest hover:text-zinc-400 transition-colors">← Back</button>
                    <button type="button" onClick={nextStep} className={`text-[11px] font-mono uppercase tracking-widest transition-colors ${formContent[intent].buttonIdleText} hover:text-zinc-200`}>Next →</button>
                  </div>
                )}
              </div>

              {/* STEP 4: MESSAGE & SUBMIT */}
              <div className={`transition-all duration-500 ease-out absolute inset-0 flex flex-col justify-between ${step === 4 ? 'opacity-100 z-10 translate-x-0' : 'opacity-0 -z-10 translate-x-8 pointer-events-none'}`}>
                <div className="space-y-3" data-step="4">
                  <div className={`relative border border-zinc-800 bg-[#050505] p-1 transition-all duration-300 ease-out rounded-sm ${formContent[intent].textareaFocus}`}>
                    <textarea 
                      name="message" 
                      required 
                      rows={5} 
                      onChange={handlePayloadChange} 
                      placeholder={formContent[intent].placeholder} 
                      className="w-full bg-transparent text-zinc-200 text-sm outline-none resize-none p-4 leading-relaxed placeholder:text-zinc-700 hover:bg-[#070707] transition-colors duration-300 ease-out" 
                    />
                  </div>
                  {payloadSize > 1200 && (
                    <p className="text-[10px] text-amber-500 mt-2">
                      Message is getting long — try to keep it concise
                    </p>
                  )}
                </div>

                <div className="mt-6">
                  {status === "success" ? (
                    <div className="flex flex-col items-center justify-center py-6 text-center animate-[fadeUp_0.5s_ease_forwards]">
                      <p className="text-emerald-400 font-mono text-[13px] tracking-widest uppercase mb-2">Message received.</p>
                      <p className="text-zinc-500 text-[11px]">I’ll get back to you soon. Thanks for reaching out — I appreciate it.</p>
                      <button 
                        type="button"
                        onClick={resetFlow}
                        className="text-[10px] text-zinc-500 mt-5 font-mono uppercase tracking-widest hover:text-zinc-200 transition-colors"
                      >
                        Send another message
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-4">
                      <button type="button" onClick={prevStep} className="text-[11px] text-zinc-600 font-mono uppercase tracking-widest hover:text-zinc-400 transition-colors">← Back</button>
                      <button 
                        type="submit" 
                        disabled={status === "sending"} 
                        className={`flex-1 bg-transparent border py-4 transition-all duration-300 ease-out flex items-center justify-center gap-3 group relative overflow-hidden hover:scale-[1.02] active:scale-[0.98] font-mono tracking-widest uppercase text-xs rounded-sm cursor-pointer ${getStatusColor()} ${status === 'idle' ? formContent[intent].buttonIdleText : ''}`}
                      >
                        {/* Interactive Gradient Overlay */}
                        <span className={`absolute inset-0 bg-gradient-to-r ${formContent[intent].gradientOverlay} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></span>
                        
                        <span className="relative z-10 flex items-center gap-2">
                          {status === "idle" && "Send Message →"}
                          {status === "sending" && <><VscLoading size={14} className="animate-spin" /> Sending...</>}
                          {status === "error" && "Something went wrong"}
                        </span>
                      </button>
                    </div>
                  )}
                </div>
              </div>

            </form>
          </div>

          <p className="text-[13px] text-zinc-500 text-center mt-12 leading-relaxed opacity-0 animate-[fadeUp_0.8s_ease_0.5s_forwards]">
            Sometimes, a simple message is all it takes to start something meaningful.
          </p>
          
          {/* EXIT CLARITY */}
          <p className="text-[11px] text-zinc-600 text-center mt-4">
            You can also reach me directly through the channels if you prefer.
          </p>

        </div>
      </div>

      {/* MINIMAL FOOTER */}
      <div className="relative z-10 mt-20 text-center w-full pb-8">
        <p className="text-[11px] text-zinc-600 font-mono tracking-widest uppercase">
          Jothish Gandham
        </p>
      </div>
      
      {/* Inline styles for custom animations */}
      <style jsx>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}