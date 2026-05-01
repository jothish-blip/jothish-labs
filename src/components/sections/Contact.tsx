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

// Unified Content Mapping (Styling removed, only content remains)
const formContent: Record<IntentType, { title: string; placeholder: string; story: string; step3Label: string; step3Placeholder: string }> = {
  conversation: {
    title: "Let's talk",
    placeholder: "What's on your mind?",
    story: "Sometimes a simple conversation leads to something meaningful.",
    step3Label: "Topic (Optional)",
    step3Placeholder: "What's the main theme?"
  },
  questions: {
    title: "Ask your question",
    placeholder: "What are you trying to understand?",
    story: "If you're stuck or curious, I'll try to share what I know.",
    step3Label: "Subject",
    step3Placeholder: "e.g., Threat Detection, Career advice"
  },
  work: {
    title: "Let's work together",
    placeholder: "Tell me about the work or opportunity...",
    story: "If you're building something and think I can contribute, I'd like to hear about it.",
    step3Label: "Company / Organization",
    step3Placeholder: "Enter company name"
  },
  internship: {
    title: "Internship opportunity",
    placeholder: "Share details about the role...",
    story: "I'm open to learning opportunities that help me grow in real environments.",
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
  const [formData, setFormData] = useState({ user_name: "", user_email: "", context_info: "", message: "" });

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePayloadChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    handleInputChange(e);
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
    setFormData({ user_name: "", user_email: "", context_info: "", message: "" });
  };

  // Unified Status Color Helper
  const getStatusColor = () => {
    if (status === "sending") return "border-[var(--warning)]/40 bg-[var(--warning)]/5";
    if (status === "success") return "border-[var(--success)]/40 bg-[var(--success)]/5";
    if (status === "error") return "border-[var(--danger)]/40 bg-[var(--danger)]/5";
    if (payloadSize > 1400) return "border-[var(--warning)]/40 bg-surface";
    return "border-[var(--accent)]/40 bg-surface";
  };

  return (
    <>
      {/* COMBINED STYLE BLOCK: Global Tokens + Animations */}
      <style jsx global>{`
        :root {
          --accent: #0891b2;
          --accent-soft: rgba(8, 145, 178, 0.08);
          --success: #059669;
          --warning: #d97706;
          --danger: #dc2626;
        }
        html.dark {
          --accent: #22d3ee;
          --accent-soft: rgba(34, 211, 238, 0.1);
          --success: #10b981;
          --warning: #f59e0b;
          --danger: #ef4444;
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <section id="contact" className="relative min-h-screen w-full bg-background text-muted py-24 px-6 md:px-16 lg:px-32 overflow-hidden border-t border-surface flex flex-col justify-between">
        
        {/* Softened Background Grid */}
        <div className="absolute inset-0 z-0 opacity-[0.03] dark:opacity-[0.02] pointer-events-none bg-[radial-gradient(circle,currentColor_1px,transparent_1px)] bg-[size:40px_40px]"></div>

        <div className="relative z-10 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start flex-grow w-full">
          
          {/* LEFT COLUMN: IDENTITY & INFO */}
          <div className={`lg:col-span-5 space-y-10 transition-all duration-700 ease-out delay-0 ${isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            
            <div className="space-y-6">
              <div className="space-y-4">
                <p className="font-mono text-[10px] tracking-[0.4em] uppercase text-[var(--accent)]">
                  CONTACT
                </p>
                <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-none text-foreground">
                  Let's Connect <span className="text-muted italic font-medium">together.</span>
                </h2>
              </div>
              
              <div className="space-y-4">
                <p className="text-muted text-[15px] max-w-sm leading-relaxed">
                  If you've gone through my work and found something interesting, I'd like to hear from you.
                </p>
                <p className="text-muted text-sm max-w-sm leading-relaxed">
                  I'm still learning, and I take my work seriously. And conversations are a big part of how I grow.
                </p>
              </div>

              <div className="pt-4 space-y-3">
                <p className="text-[11px] text-muted font-mono uppercase tracking-widest">
                  You can reach out if —
                </p>
                <ul className="text-[13px] text-muted space-y-3 leading-relaxed pl-2 border-l border-surface">
                  <li className="group flex items-start gap-3 text-muted hover:text-foreground transition-colors duration-300 ease-out cursor-default">
                    <span className="w-1 h-1 mt-1.5 bg-muted group-hover:bg-[var(--accent)] transition-colors duration-300 rounded-full flex-shrink-0"></span>
                    You have feedback on my projects
                  </li>
                  <li className="group flex items-start gap-3 text-muted hover:text-foreground transition-colors duration-300 ease-out cursor-default">
                    <span className="w-1 h-1 mt-1.5 bg-muted group-hover:bg-[var(--accent)] transition-colors duration-300 rounded-full flex-shrink-0"></span>
                    You want to discuss ideas or learning paths
                  </li>
                  <li className="group flex items-start gap-3 text-muted hover:text-foreground transition-colors duration-300 ease-out cursor-default">
                    <span className="w-1 h-1 mt-1.5 bg-muted group-hover:bg-[var(--accent)] transition-colors duration-300 rounded-full flex-shrink-0"></span>
                    You're working on something and need a second perspective
                  </li>
                  <li className="group flex items-start gap-3 text-muted hover:text-foreground transition-colors duration-300 ease-out cursor-default">
                    <span className="w-1 h-1 mt-1.5 bg-muted group-hover:bg-[var(--accent)] transition-colors duration-300 rounded-full flex-shrink-0"></span>
                    Or just want to connect
                  </li>
                </ul>
              </div>
            </div>

            <div className={`p-6 border border-surface bg-surface space-y-6 rounded-sm shadow-md transition-all duration-700 delay-150 ease-out ${isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
              <p className="text-muted text-[13px] leading-relaxed border-b border-surface pb-5">
                Here's the simplest way to reach me. I prefer direct communication — no forms, no delays.
              </p>

              <div className="space-y-5 text-sm">
                <div>
                  <p className="text-muted text-[11px] mb-1 uppercase tracking-widest font-mono">Name</p>
                  <p className="text-foreground font-medium">Jothish Gandham</p>
                </div>

                {/* TACTICAL ACTION BUTTONS - Cleaned up and unified */}
                <div className="pt-2">
                  <p className="text-muted text-[11px] mb-3 uppercase tracking-widest font-mono">Direct Channels</p>
                  <div className="flex gap-3 flex-wrap">
                    
                    <a
                      href="mailto:jothishgandham2@gmail.com"
                      className="flex items-center gap-2 px-4 py-2 min-h-[44px] border border-surface text-muted text-[10px] font-mono uppercase tracking-widest rounded-sm hover:bg-[var(--accent-soft)] hover:border-[var(--accent)]/40 hover:text-foreground transition-all duration-300 ease-out hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                    >
                      <FaEnvelope size={12}/> Email
                    </a>

                    <a
                      href="https://www.linkedin.com/in/jothish-gandham-5b90b334a"
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 px-4 py-2 min-h-[44px] border border-surface text-muted text-[10px] font-mono uppercase tracking-widest rounded-sm hover:bg-[var(--accent-soft)] hover:border-[var(--accent)]/40 hover:text-foreground transition-all duration-300 ease-out hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                    >
                      <FaLinkedin size={12}/> LinkedIn
                    </a>

                    <a
                      href="tel:+918374754009"
                      className="flex items-center gap-2 px-4 py-2 min-h-[44px] border border-surface text-muted text-[10px] font-mono uppercase tracking-widest rounded-sm hover:bg-[var(--accent-soft)] hover:border-[var(--accent)]/40 hover:text-foreground transition-all duration-300 ease-out hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                    >
                      <FaPhoneAlt size={10}/> Call
                    </a>

                    <a
                      href="https://github.com/jothish-blip"
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 px-4 py-2 min-h-[44px] border border-surface text-muted text-[10px] font-mono uppercase tracking-widest rounded-sm hover:bg-surface-strong hover:text-foreground transition-all duration-300 ease-out hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                    >
                      <SiGithub size={12}/> GitHub
                    </a>

                  </div>
                </div>
              </div>

              <p className="text-[11px] text-muted pt-5 border-t border-surface font-mono">
                I usually respond within a day.
              </p>
            </div>
          </div>

          {/* RIGHT COLUMN: DYNAMIC CONTACT FORM */}
          <div className={`lg:col-span-7 mt-8 lg:mt-0 transition-all duration-700 delay-300 ease-out ${isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            
            <div className="mb-6 space-y-6">
              <h3 className="text-[15px] font-bold text-foreground tracking-wide font-mono transition-colors duration-500">
                {formContent[intent].title}
              </h3>
              <p className="text-muted text-sm leading-relaxed max-w-lg transition-colors duration-500">
                {formContent[intent].story}
              </p>
            </div>

            <div className={`relative transition-all duration-500 p-6 md:p-10 rounded-sm shadow-lg border focus-within:border-[var(--accent)]/40 focus-within:shadow-xl ${getStatusColor()}`}>
              
              {/* Form Progress Bar */}
              <div className="flex gap-2 mb-8">
                {[1, 2, 3, 4].map(s => (
                  <div 
                    key={s} 
                    className={`h-[2px] flex-1 transition-all duration-500 ease-out ${step >= s ? "bg-[var(--accent)] shadow-[0_0_6px_var(--accent)]" : "bg-surface-strong"}`} 
                  />
                ))}
              </div>

              <p className="text-[11px] font-mono uppercase tracking-widest text-muted mb-6">
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
                        className={`px-5 py-3 min-h-[44px] text-[11px] font-mono uppercase tracking-widest border rounded-sm transition-all duration-300 ease-out cursor-pointer hover:scale-[1.02] active:scale-[0.98]
                          ${intent === item.id 
                            ? "border-[var(--accent)] text-[var(--accent)] bg-[var(--accent-soft)]" 
                            : "border-surface text-muted hover:border-[var(--accent)]/40 hover:text-foreground"}
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
                      <label htmlFor="user_name" className="text-[11px] uppercase tracking-widest text-muted font-mono block">
                        Your Name
                      </label>
                      {/* Fully bordered inputs for mobile UX */}
                      <input 
                        id="user_name"
                        type="text" 
                        name="user_name" 
                        value={formData.user_name}
                        onChange={handleInputChange}
                        placeholder="Enter your name" 
                        className="w-full bg-surface border border-surface rounded-sm px-4 py-3.5 text-foreground text-sm outline-none transition-colors duration-300 ease-out placeholder:text-muted focus:border-[var(--accent)]" 
                      />
                    </div>
                    <div className="space-y-3">
                      <label htmlFor="user_email" className="text-[11px] uppercase tracking-widest text-muted font-mono block">
                        Email Address
                      </label>
                      <input 
                        id="user_email"
                        type="email" 
                        name="user_email" 
                        value={formData.user_email}
                        onChange={handleInputChange}
                        placeholder="Enter your email" 
                        className="w-full bg-surface border border-surface rounded-sm px-4 py-3.5 text-foreground text-sm outline-none transition-colors duration-300 ease-out placeholder:text-muted focus:border-[var(--accent)]" 
                      />
                    </div>
                  </div>
                  {step === 2 && (
                    <div className="mt-8 flex justify-between">
                      <button type="button" onClick={prevStep} className="px-4 min-h-[44px] text-[11px] text-muted font-mono uppercase tracking-widest hover:text-foreground transition-colors">← Previous</button>
                      <button type="button" onClick={nextStep} className="px-4 min-h-[44px] text-[11px] font-mono uppercase tracking-widest transition-colors text-[var(--accent)] hover:brightness-110">Continue →</button>
                    </div>
                  )}
                </div>

                {/* STEP 3: DYNAMIC CONTEXT */}
                <div className={`transition-all duration-500 ease-out absolute inset-0 space-y-8 ${step === 3 ? 'opacity-100 z-10 translate-x-0' : step > 3 ? 'opacity-0 -z-10 -translate-x-8 pointer-events-none' : 'opacity-0 -z-10 translate-x-8 pointer-events-none'}`}>
                  <div className="space-y-3" data-step="3">
                    <label htmlFor="context_info" className="text-[11px] uppercase tracking-widest text-muted font-mono block">
                      {formContent[intent].step3Label}
                    </label>
                    <input 
                      id="context_info"
                      type="text" 
                      name="context_info" 
                      value={formData.context_info}
                      onChange={handleInputChange}
                      placeholder={formContent[intent].step3Placeholder} 
                      className="w-full bg-surface border border-surface rounded-sm px-4 py-3.5 text-foreground text-sm outline-none transition-colors duration-300 ease-out placeholder:text-muted focus:border-[var(--accent)]" 
                    />
                  </div>
                  {step === 3 && (
                    <div className="mt-12 flex justify-between">
                      <button type="button" onClick={prevStep} className="px-4 min-h-[44px] text-[11px] text-muted font-mono uppercase tracking-widest hover:text-foreground transition-colors">← Previous</button>
                      <button type="button" onClick={nextStep} className="px-4 min-h-[44px] text-[11px] font-mono uppercase tracking-widest transition-colors text-[var(--accent)] hover:brightness-110">Continue →</button>
                    </div>
                  )}
                </div>

                {/* STEP 4: MESSAGE & SUBMIT */}
                <div className={`transition-all duration-500 ease-out absolute inset-0 flex flex-col justify-between ${step === 4 ? 'opacity-100 z-10 translate-x-0' : 'opacity-0 -z-10 translate-x-8 pointer-events-none'}`}>
                  <div className="space-y-3" data-step="4">
                    <label htmlFor="message" className="sr-only">Your Message</label>
                    <div className="relative border border-surface bg-surface p-1 transition-all duration-300 ease-out rounded-sm focus-within:border-[var(--accent)]/50">
                      <textarea 
                        id="message"
                        name="message" 
                        required 
                        rows={5} 
                        value={formData.message}
                        onChange={handlePayloadChange} 
                        placeholder={formContent[intent].placeholder} 
                        className="w-full bg-transparent text-foreground text-sm outline-none resize-none p-4 leading-relaxed placeholder:text-muted hover:bg-surface-strong/50 transition-colors duration-300 ease-out" 
                      />
                    </div>
                    {payloadSize > 1200 && (
                      <p className="text-[10px] text-[var(--warning)] mt-2">
                        Message is getting long. Try to keep it concise.
                      </p>
                    )}
                  </div>

                  <div className="mt-6">
                    {status === "success" ? (
                      <div className="flex flex-col items-center justify-center py-6 text-center animate-[fadeUp_0.5s_ease_forwards]">
                        <p className="text-[var(--success)] font-mono text-[13px] tracking-widest uppercase mb-2">Message sent successfully.</p>
                        <p className="text-muted text-[11px]">I'll get back to you soon. Thanks for reaching out — I appreciate it.</p>
                        <button 
                          type="button"
                          onClick={resetFlow}
                          className="text-[10px] text-muted mt-5 font-mono uppercase tracking-widest hover:text-foreground min-h-[44px] transition-colors"
                        >
                          Send another message
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-4">
                        <button type="button" onClick={prevStep} className="px-4 min-h-[44px] text-[11px] text-muted font-mono uppercase tracking-widest hover:text-foreground transition-colors">← Previous</button>
                        <button 
                          type="submit" 
                          disabled={status === "sending"} 
                          className={`flex-1 bg-surface border py-4 transition-all duration-300 ease-out flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] font-mono tracking-widest uppercase text-xs rounded-sm cursor-pointer min-h-[44px] ${
                            status === 'sending' ? 'text-[var(--warning)] border-[var(--warning)]/40' : 
                            status === 'error' ? 'text-[var(--danger)] border-[var(--danger)]/40' : 
                            'text-[var(--accent)] border-[var(--accent)]/40 hover:bg-[var(--accent-soft)]'
                          }`}
                        >
                          <span className="relative z-10 flex items-center gap-2">
                            {status === "idle" && "Send Message →"}
                            {status === "sending" && <><VscLoading size={14} className="animate-spin" /> Sending...</>}
                            {status === "error" && "Failed to send message"}
                          </span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

              </form>
            </div>

            <p className="text-[13px] text-muted text-center mt-12 leading-relaxed opacity-0 animate-[fadeUp_0.8s_ease_0.5s_forwards]">
              Sometimes, a simple message is enough to start something meaningful.
            </p>
            
            {/* EXIT CLARITY */}
            <p className="text-[11px] text-muted text-center mt-4">
              You can also reach me directly through the channels if you prefer.
            </p>

          </div>
        </div>
      </section>
    </>
  );
}