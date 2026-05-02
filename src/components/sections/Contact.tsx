"use client";

import React, { useState, useRef, useEffect } from "react";
import emailjs from "@emailjs/browser";
import { SiGithub } from "react-icons/si";
import { FaPhoneAlt, FaLinkedin, FaEnvelope, FaCheckCircle } from "react-icons/fa";
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
  1: "choose intent",
  2: "your details",
  3: "context",
  4: "message"
};

const formContent: Record<IntentType, { title: string; story: string; step3Label: string; step3Placeholder: string; placeholder: string }> = {
  conversation: {
    title: "Let's talk",
    story: "Sometimes a simple conversation leads to something meaningful.",
    step3Label: "topic (optional)",
    step3Placeholder: "What's the main theme?",
    placeholder: "What's on your mind?"
  },
  questions: {
    title: "Ask your question",
    story: "If you're stuck or curious, I'll try to share what I know.",
    step3Label: "subject",
    step3Placeholder: "e.g., Threat Detection, Career advice",
    placeholder: "What are you trying to understand?"
  },
  work: {
    title: "Let's work together",
    story: "If you're building something and think I can contribute, I'd like to hear about it.",
    step3Label: "company / organization",
    step3Placeholder: "Enter company name",
    placeholder: "Tell me about the work or opportunity..."
  },
  internship: {
    title: "Internship opportunity",
    story: "I'm open to learning opportunities that help me grow in real environments.",
    step3Label: "role / internship type",
    step3Placeholder: "Enter role details",
    placeholder: "Share details about the role..."
  }
};

export default function Contact() {
  const formRef = useRef<HTMLFormElement>(null);
  const [step, setStep] = useState(1);
  const [intent, setIntent] = useState<IntentType>("conversation");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [payloadSize, setPayloadSize] = useState(0);
  const [formData, setFormData] = useState({ user_name: "", user_email: "", context_info: "", message: "" });
  const [successTimer, setSuccessTimer] = useState<NodeJS.Timeout | null>(null);

  // Focus and Keyboard UX
  useEffect(() => {
    if (step > 1 && step < 5) {
      const activeInput = document.querySelector(`[data-step="${step}"] input, [data-step="${step}"] textarea`) as HTMLElement;
      if (activeInput) activeInput.focus();
    }
  }, [step]);

  useEffect(() => {
    const handleGlobalKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") resetFlow();
    };
    window.addEventListener("keydown", handleGlobalKey);
    return () => window.removeEventListener("keydown", handleGlobalKey);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePayloadChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    handleInputChange(e);
    setPayloadSize(new Blob([e.target.value]).size);
  };

  const nextStep = () => {
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

    // Integration values - Replace with your actual EmailJS credentials
    const SERVICE_ID = "your_service_id"; 
    const TEMPLATE_ID = "your_template_id";
    const PUBLIC_KEY = "your_public_key";

    emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, formRef.current!, PUBLIC_KEY)
      .then(() => {
        setStatus("success");
        const timer = setTimeout(() => resetFlow(), 8000);
        setSuccessTimer(timer);
      }, () => {
        setStatus("error");
        setTimeout(() => setStatus("idle"), 5000);
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

  const getStatusColor = () => {
    if (status === "sending") return "border-[var(--warning)]/40 bg-[var(--warning)]/5";
    if (status === "success") return "border-[var(--success)]/40 bg-[var(--success)]/5";
    if (status === "error") return "border-[var(--danger)]/40 bg-[var(--danger)]/5";
    return "border-surface bg-surface/50";
  };

  return (
    <section id="contact" className="relative min-h-screen w-full bg-background text-muted py-24 px-6 md:px-16 lg:px-32 overflow-hidden border-t border-surface flex flex-col justify-between">
      
      {/* Background Grid */}
      <div className="absolute inset-0 z-0 opacity-[0.03] dark:opacity-[0.02] pointer-events-none bg-[radial-gradient(circle,currentColor_1px,transparent_1px)] bg-[size:40px_40px]"></div>

      <div className="relative z-10 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start flex-grow w-full">
        
        {/* LEFT COLUMN: IDENTITY */}
        <div className="lg:col-span-5 space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
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
                I'm still learning, and I take my work seriously. Conversations are a big part of how I grow.
              </p>
            </div>

            <div className="pt-4 space-y-3">
              <p className="text-[11px] text-muted font-mono uppercase tracking-widest">
                Reachable if —
              </p>
              <ul className="text-[13px] text-muted space-y-3 leading-relaxed pl-2 border-l border-surface">
                <li className="group flex items-start gap-3 text-muted hover:text-foreground transition-colors duration-300 cursor-default">
                  <span className="w-1 h-1 mt-1.5 bg-muted group-hover:bg-[var(--accent)] transition-colors rounded-full flex-shrink-0"></span>
                  Project feedback or ideas
                </li>
                <li className="group flex items-start gap-3 text-muted hover:text-foreground transition-colors duration-300 cursor-default">
                  <span className="w-1 h-1 mt-1.5 bg-muted group-hover:bg-[var(--accent)] transition-colors rounded-full flex-shrink-0"></span>
                  Discussing learning paths
                </li>
                <li className="group flex items-start gap-3 text-muted hover:text-foreground transition-colors duration-300 cursor-default">
                  <span className="w-1 h-1 mt-1.5 bg-muted group-hover:bg-[var(--accent)] transition-colors rounded-full flex-shrink-0"></span>
                  Opportunities or collaborations
                </li>
              </ul>
            </div>
          </div>

          <div className="p-6 border border-surface bg-surface space-y-6 rounded-sm shadow-md">
            <p className="text-muted text-[13px] leading-relaxed border-b border-surface pb-5">
              Reach me directly through the channels below, or use the form for a structured message.
            </p>

            <div className="space-y-5 text-sm">
              <div>
                <p className="text-muted text-[11px] mb-1 uppercase tracking-widest font-mono">Full Name</p>
                <p className="text-foreground font-medium">Jothish Gandham</p>
              </div>

              <div className="pt-2">
                <p className="text-muted text-[11px] mb-3 uppercase tracking-widest font-mono">Direct Channels</p>
                <div className="flex gap-3 flex-wrap">
                  {[
                    { href: "mailto:jothishgandham2@gmail.com", icon: FaEnvelope, label: "Email" },
                    { href: "https://www.linkedin.com/in/jothish-gandham-5b90b334a", icon: FaLinkedin, label: "LinkedIn" },
                    { href: "tel:+918374754009", icon: FaPhoneAlt, label: "Call" },
                    { href: "https://github.com/jothish-blip", icon: SiGithub, label: "GitHub" }
                  ].map((chan, idx) => (
                    <a
                      key={idx}
                      href={chan.href}
                      target={chan.label !== "Call" && chan.label !== "Email" ? "_blank" : undefined}
                      className="flex items-center gap-2 px-4 py-2 min-h-[40px] border border-surface text-muted text-[10px] font-mono uppercase tracking-widest rounded-sm hover:bg-[var(--accent-soft)] hover:border-[var(--accent)]/40 hover:text-foreground hover:-translate-y-[1px] transition-all duration-300 active:translate-y-0 cursor-pointer"
                    >
                      <chan.icon size={12}/> {chan.label}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            <p className="text-[11px] text-muted pt-5 border-t border-surface font-mono">
              response_time: ~24h
            </p>
          </div>
        </div>

        {/* RIGHT COLUMN: DYNAMIC FORM */}
        <div className="lg:col-span-7 mt-8 lg:mt-0 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
          
          <div className="mb-6 space-y-3">
            <h3 className="text-[15px] font-bold text-foreground tracking-wide font-mono transition-colors duration-500">
              {formContent[intent].title}
            </h3>
            <p className="text-muted text-sm leading-relaxed max-w-lg transition-colors duration-500">
              {formContent[intent].story}
            </p>
          </div>

          <div className={`relative transition-all duration-500 p-6 md:p-10 rounded-sm shadow-lg border backdrop-blur-sm ${getStatusColor()}`}>
            
            {/* Progress Header */}
            <div className="flex items-center justify-between mb-8">
               <p className="text-[9px] font-mono text-muted uppercase tracking-widest">
                step {step} / 4
              </p>
              <div className="flex gap-2 w-32 md:w-48 h-[3px] bg-background rounded-full overflow-hidden">
                {[1, 2, 3, 4].map(s => (
                  <div 
                    key={s} 
                    className={`h-full flex-1 transition-all duration-700 ease-out ${step >= s ? "bg-[var(--accent)] shadow-[0_0_8px_var(--accent)]" : "bg-surface-strong"}`} 
                  />
                ))}
              </div>
            </div>

            <p className="text-[11px] font-mono uppercase tracking-widest text-muted mb-6 transition-all duration-500">
              {stepTitles[step as keyof typeof stepTitles]}
            </p>

            <form ref={formRef} onSubmit={sendEmail} onKeyDown={handleKeyDown} className="relative min-h-[240px]">
              
              {/* STEP 1: INTENT */}
              <div className={`transition-all duration-500 ease-out absolute inset-0 ${step === 1 ? 'opacity-100 z-10 scale-100' : 'opacity-0 -z-10 scale-[0.98] pointer-events-none'}`}>
                <div className="flex flex-wrap gap-3" data-step="1">
                  {intents.map((item) => (
                    <button
                      key={item.id}
                      onClick={(e) => { 
                        e.preventDefault(); 
                        setIntent(item.id); 
                        setTimeout(() => setStep(2), 200); 
                      }}
                      className={`px-5 py-3 min-h-[44px] text-[10px] font-mono uppercase tracking-widest border rounded-sm transition-all duration-300 cursor-pointer
                        ${intent === item.id 
                          ? "border-[var(--accent)] text-[var(--accent)] bg-[var(--accent-soft)] shadow-sm" 
                          : "border-surface text-muted hover:border-[var(--accent)]/40 hover:bg-[var(--accent-soft)]"}
                      `}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* STEP 2: DETAILS */}
              <div className={`transition-all duration-500 ease-out absolute inset-0 space-y-8 ${step === 2 ? 'opacity-100 z-10 scale-100' : 'opacity-0 -z-10 scale-[0.98] pointer-events-none'}`}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8" data-step="2">
                  <div className="space-y-3">
                    <label className="text-[11px] uppercase tracking-widest text-muted font-mono block">Your Name</label>
                    <input 
                      type="text" name="user_name" 
                      value={formData.user_name} onChange={handleInputChange}
                      placeholder="e.g. Alex" 
                      className="w-full bg-surface border border-surface rounded-sm px-4 py-3.5 text-foreground text-sm outline-none transition-all placeholder:text-muted focus:border-[var(--accent)] focus:bg-surface-strong" 
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[11px] uppercase tracking-widest text-muted font-mono block">Email Address</label>
                    <input 
                      type="email" name="user_email" 
                      pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"
                      value={formData.user_email} onChange={handleInputChange}
                      placeholder="email@example.com" 
                      className="w-full bg-surface border border-surface rounded-sm px-4 py-3.5 text-foreground text-sm outline-none transition-all placeholder:text-muted focus:border-[var(--accent)] focus:bg-surface-strong" 
                    />
                  </div>
                </div>
                {step === 2 && (
                  <div className="flex flex-col gap-6">
                    {(!formData.user_name || !formData.user_email) && (
                       <p className="text-[10px] text-[var(--danger)] font-mono uppercase tracking-widest animate-pulse">Name and email required</p>
                    )}
                    <div className="flex justify-between">
                      <button type="button" onClick={prevStep} className="text-[10px] text-muted font-mono uppercase tracking-widest hover:text-foreground transition-colors">← Back</button>
                      <button type="button" onClick={nextStep} className="text-[10px] font-mono uppercase tracking-widest transition-colors text-[var(--accent)] hover:brightness-110">Continue →</button>
                    </div>
                  </div>
                )}
              </div>

              {/* STEP 3: CONTEXT */}
              <div className={`transition-all duration-500 ease-out absolute inset-0 space-y-8 ${step === 3 ? 'opacity-100 z-10 scale-100' : 'opacity-0 -z-10 scale-[0.98] pointer-events-none'}`}>
                <div className="space-y-3" data-step="3">
                  <label className="text-[11px] uppercase tracking-widest text-muted font-mono block">{formContent[intent].step3Label}</label>
                  <input 
                    type="text" name="context_info" 
                    value={formData.context_info} onChange={handleInputChange}
                    placeholder={formContent[intent].step3Placeholder} 
                    className="w-full bg-surface border border-surface rounded-sm px-4 py-3.5 text-foreground text-sm outline-none transition-all focus:border-[var(--accent)]" 
                  />
                </div>
                {step === 3 && (
                  <div className="mt-12 flex justify-between">
                    <button type="button" onClick={prevStep} className="text-[10px] text-muted font-mono uppercase tracking-widest hover:text-foreground transition-colors">← Back</button>
                    <button type="button" onClick={nextStep} className="text-[10px] font-mono uppercase tracking-widest transition-colors text-[var(--accent)] hover:brightness-110">Continue →</button>
                  </div>
                )}
              </div>

              {/* STEP 4: MESSAGE */}
              <div className={`transition-all duration-500 ease-out absolute inset-0 flex flex-col justify-between ${step === 4 ? 'opacity-100 z-10 scale-100' : 'opacity-0 -z-10 scale-[0.98] pointer-events-none'}`}>
                <div className="space-y-3" data-step="4">
                  <div className="relative border border-surface bg-surface-strong focus-within:border-[var(--accent)] transition-all duration-300 rounded-sm shadow-inner overflow-hidden">
                    <textarea 
                      name="message" required rows={5} 
                      value={formData.message} onChange={handlePayloadChange} 
                      placeholder={formContent[intent].placeholder} 
                      className="w-full bg-transparent text-foreground text-sm outline-none resize-none p-4 leading-relaxed placeholder:text-muted" 
                    />
                  </div>
                  {payloadSize > 1000 && (
                    <p className={`text-[9px] font-mono uppercase tracking-widest mt-2 ${payloadSize > 1500 ? 'text-[var(--danger)]' : 'text-[var(--warning)]'}`}>
                      {payloadSize > 1500 ? "Character limit approaching. Keep it concise." : "Message getting long."}
                    </p>
                  )}
                </div>

                <div className="mt-6">
                  {status === "success" ? (
                    <div className="flex flex-col items-center justify-center py-6 text-center animate-in fade-in slide-in-from-bottom-4">
                      <FaCheckCircle className="text-[var(--success)] text-3xl mb-4" />
                      <p className="text-[var(--success)] font-mono text-[13px] tracking-widest uppercase mb-2">Sent Successfully</p>
                      <p className="text-muted text-[11px] max-w-xs leading-relaxed">I'll review your message and get back to you within 24 hours. Thanks for reaching out.</p>
                      <button type="button" onClick={resetFlow} className="text-[10px] text-muted mt-6 font-mono uppercase tracking-widest hover:text-[var(--accent)] transition-colors">
                        Send another? [Esc]
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-4">
                      <button type="button" onClick={prevStep} className="text-[10px] text-muted font-mono uppercase tracking-widest hover:text-foreground transition-colors">← Back</button>
                      <button 
                        type="submit" disabled={status === "sending"} 
                        className={`flex-1 bg-surface border py-4 transition-all duration-300 flex items-center justify-center gap-3 hover:-translate-y-[1px] active:translate-y-0 font-mono tracking-widest uppercase text-xs rounded-sm cursor-pointer min-h-[48px] ${
                          status === 'sending' ? 'text-[var(--warning)] border-[var(--warning)]/40' : 
                          status === 'error' ? 'text-[var(--danger)] border-[var(--danger)]/40' : 
                          'text-[var(--accent)] border-[var(--accent)]/40 hover:bg-[var(--accent-soft)]'
                        }`}
                      >
                        {status === "idle" && "Execute Send →"}
                        {status === "sending" && <><VscLoading size={14} className="animate-spin" /> Sending...</>}
                        {status === "error" && "Failed. Try direct contact."}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </form>
          </div>

          {/* Footer CTA */}
          <div className="space-y-4 mt-12 text-center">
             <p className="text-[13px] text-muted leading-relaxed italic opacity-80">
              "A simple message is enough to start something meaningful."
            </p>
            <p className="text-[9px] text-muted/50 font-mono uppercase tracking-[0.3em]">
              Security Analysis & Development • 2026
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}