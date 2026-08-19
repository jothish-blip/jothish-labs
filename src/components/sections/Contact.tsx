"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import emailjs from "@emailjs/browser";
import { SiGithub } from "react-icons/si";
import { FaPhoneAlt, FaLinkedin, FaEnvelope, FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import { VscLoading } from "react-icons/vsc";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { trackEvent, TELEMETRY_EVENTS } from "@/lib/telemetry/events";

// Define Intent Types
type IntentType = "conversation" | "questions" | "work" | "internship";

const intents: { id: IntentType; label: string }[] = [
  { id: "conversation", label: "Conversation" },
  { id: "questions", label: "Questions" },
  { id: "work", label: "Work" },
  { id: "internship", label: "Internship" }
];

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

const stepsConfig = [
  { num: 1, label: "Intent" },
  { num: 2, label: "Identity" },
  { num: 3, label: "Context" },
  { num: 4, label: "Message" }
];

const customScrollbar = "[&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-sm [&::-webkit-scrollbar-thumb]:bg-surface-strong [&::-webkit-scrollbar-track]:bg-transparent hover:[&::-webkit-scrollbar-thumb]:bg-muted/50";

export default function Contact() {
  const formRef = useRef<HTMLFormElement>(null);
  const [step, setStep] = useState(1);
  const [intent, setIntent] = useState<IntentType>("conversation");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [payloadSize, setPayloadSize] = useState(0);
  const [formData, setFormData] = useState({ user_name: "", user_email: "", context_info: "", message: "" });
  const [, setSuccessTimer] = useState<NodeJS.Timeout | null>(null);

  // Focus and Keyboard UX
  useEffect(() => {
    if (step > 1 && step < 5) {
      setTimeout(() => {
        const activeInput = document.querySelector(`[data-step="${step}"] input, [data-step="${step}"] textarea`) as HTMLElement;
        if (activeInput) activeInput.focus();
      }, 300);
    }
  }, [step]);

  const resetFlow = useCallback(() => {
    setSuccessTimer(prev => { if (prev) clearTimeout(prev); return null; });
    formRef.current?.reset();
    setPayloadSize(0);
    setStep(1);
    setStatus("idle");
    setFormData({ user_name: "", user_email: "", context_info: "", message: "" });
  }, []);

  useEffect(() => {
    const handleGlobalKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") resetFlow();
    };
    window.addEventListener("keydown", handleGlobalKey);
    return () => window.removeEventListener("keydown", handleGlobalKey);
  }, [resetFlow]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePayloadChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    handleInputChange(e);
    setPayloadSize(new Blob([e.target.value]).size);
  };

  const nextStep = () => {
    if (step === 2 && (!formData.user_name.trim() || !formData.user_email.trim())) {
      trackEvent({ type: TELEMETRY_EVENTS.ERROR, metadata: { context: "contact_validation", fields: Object.keys(formData).filter(k => !(formData as Record<string, string>)[k].trim()) } });
      return;
    }
    if (step < 4) {
      if (step === 1) trackEvent({ type: TELEMETRY_EVENTS.CONTACT_SUBMIT, metadata: { action: "started", intent } });
      setStep((prev) => prev + 1);
    }
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

  const sendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");

    try {
      // 1. Send to Supabase DB (Isolated Portfolio Table)
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          intent
        })
      });

      if (!res.ok) {
        throw new Error('Failed to send message');
      }

      // 2. Fallback / Parallel EmailJS 
      const SERVICE_ID = "your_service_id"; 
      const TEMPLATE_ID = "your_template_id";
      const PUBLIC_KEY = "your_public_key";
      
      // We don't await this so it doesn't block success if EmailJS is unconfigured
      emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, formRef.current!, PUBLIC_KEY).catch(() => {});

      setStatus("success");
      
      trackEvent({
        type: TELEMETRY_EVENTS.CONTACT_SUBMIT,
        metadata: { action: "success", intent, message_length: payloadSize }
      });
      
      const timer = setTimeout(() => resetFlow(), 8000);
      setSuccessTimer(timer);

    } catch {
      setStatus('error');
      trackEvent({ type: TELEMETRY_EVENTS.ERROR, metadata: { context: "contact_submission_failed" } });
      setTimeout(() => setStatus("idle"), 5000);
    }
  };

  const channels = [
    { icon: FaEnvelope, label: "Email", value: "jothishgandham2@gmail.com", href: "mailto:jothishgandham2@gmail.com" },
    { icon: FaLinkedin, label: "LinkedIn", value: "in/jothish", href: "https://www.linkedin.com/in/jothish-gandham-5b90b334a" },
    { icon: SiGithub, label: "GitHub", value: "jothish-blip", href: "https://github.com/jothish-blip" },
    { icon: FaPhoneAlt, label: "Phone", value: "+91 8374754009", href: "tel:+918374754009" }
  ];

  return (
    <section id="contact" className="border-t border-surface pt-14 pb-24 max-w-6xl mx-auto flex flex-col gap-12 px-6 md:px-8 relative">
      
      {/* 
        LOCAL STYLES: Safely handles opacity/color-mix for the dynamically injected 
        --accent-contact CSS variable defined in Navbar.tsx.
      */}
      <style>{`
        .contact-input:focus {
          border-color: color-mix(in srgb, var(--accent-contact) 50%, transparent) !important;
          background-color: color-mix(in srgb, var(--accent-contact) 5%, transparent) !important;
          box-shadow: 0 0 0 1px color-mix(in srgb, var(--accent-contact) 50%, transparent) !important;
        }
        .contact-group:hover .contact-label-hover {
          color: var(--accent-contact) !important;
        }
      `}</style>

      {/* Header with Radiolucent / X-Ray Effect matching --accent-contact */}
      <header className="relative mx-auto w-full max-w-4xl text-center space-y-5 py-8 flex flex-col items-center">
        
        {/* Radiolucent Glow / X-Ray Effect Background */}
        <div className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center overflow-hidden">
          <div 
            className="w-[300px] h-[150px] md:w-[600px] md:h-[200px] blur-[80px] rounded-[100%] opacity-30 mix-blend-screen"
            style={{ backgroundColor: 'var(--accent-contact)' }}
          ></div>
          <div className="absolute inset-0 opacity-[0.02] bg-[radial-gradient(circle,currentColor_1px,transparent_1px)] bg-[size:12px_12px]"></div>
        </div>

        <div className="relative z-10 space-y-4 flex flex-col items-center">
          <p 
            className="font-mono text-[9px] tracking-[0.4em] uppercase"
            style={{ color: 'var(--accent-contact)' }}
          >
            {"// Contact & Connect"}
          </p>

          <h2 className="text-3xl md:text-5xl font-semibold tracking-tight leading-[1.1] text-foreground uppercase">
            Start a <span className="text-muted italic font-light">Conversation</span>
          </h2>

          <div className="flex items-center gap-3 pt-2">
            <p 
              className="text-[9px] font-mono font-medium px-3 py-1.5 rounded-sm inline-block uppercase tracking-[0.24em] backdrop-blur-md"
              style={{ 
                color: 'var(--accent-contact)',
                backgroundColor: 'color-mix(in srgb, var(--accent-contact) 10%, transparent)',
                border: '1px solid color-mix(in srgb, var(--accent-contact) 20%, transparent)'
              }}
            >
              Available for Opportunities
            </p>
          </div>

          <div 
            className="w-12 h-[1px] my-2 opacity-50" 
            style={{ backgroundColor: 'var(--accent-contact)' }}
          />

          <p className="mx-auto max-w-2xl text-[13px] md:text-[14px] leading-relaxed text-muted">
            Whether you have a question, an opportunity, or just want to connect, I&apos;m always open to discussing technology and security.
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative z-10">
        
        {/* LEFT COLUMN: IDENTITY PANEL */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="border border-surface bg-background rounded-md p-6">
            <div className="flex items-center gap-4 border-b border-surface pb-6">
              <div className="w-12 h-12 rounded-sm overflow-hidden border border-surface bg-surface shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/profile.jpeg" alt="Jothish Gandham" className="w-full h-full object-cover grayscale opacity-90 hover:grayscale-0 transition-all duration-500" />
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-foreground uppercase tracking-tight">Jothish Gandham</h3>
                <p className="font-mono text-[9px] text-muted uppercase tracking-[0.24em] mt-1">Security Learner</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-6 py-6 border-b border-surface">
              <div className="space-y-2">
                <span className="font-mono text-[9px] text-muted uppercase tracking-[0.24em] block">Status</span>
                <span className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-widest text-foreground">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span> Available
                </span>
              </div>
              <div className="space-y-2">
                <span className="font-mono text-[9px] text-muted uppercase tracking-[0.24em] block">Response Time</span>
                <span className="text-[11px] font-mono uppercase tracking-widest text-foreground">~ 24 Hours</span>
              </div>
              <div className="space-y-2 col-span-2">
                <span className="font-mono text-[9px] text-muted uppercase tracking-[0.24em] block">Current Focus</span>
                <span className="text-[11px] font-mono uppercase tracking-widest text-foreground">SOC Operations & Detection Eng</span>
              </div>
            </div>

            <div className="pt-6 flex flex-col gap-2">
              {channels.map((chan) => (
                <a 
                  key={chan.label} 
                  href={chan.href} 
                  target={chan.label !== "Email" && chan.label !== "Phone" ? "_blank" : undefined} 
                  rel="noreferrer" 
                  className="contact-group flex items-center justify-between p-3 border border-transparent hover:border-surface hover:bg-surface/40 rounded-sm transition-all duration-300"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-sm border border-surface bg-background flex items-center justify-center text-muted contact-label-hover transition-all duration-300">
                      <chan.icon size={12} />
                    </div>
                    <div>
                      <p className="font-mono text-[8px] uppercase tracking-[0.24em] text-muted contact-label-hover transition-colors">{chan.label}</p>
                      <p className="text-[11px] text-foreground mt-0.5 tracking-wide">{chan.value}</p>
                    </div>
                  </div>
                  <ArrowRight size={12} className="text-muted opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: DYNAMIC FORM */}
        <div className="lg:col-span-7">
          <div className="bg-background border border-surface rounded-md flex flex-col h-full min-h-[550px]">
            
            {/* Header Progress Bar */}
            <div className="bg-surface/10 border-b border-surface p-5 flex items-center justify-between overflow-x-auto custom-scrollbar">
              {stepsConfig.map((s) => (
                <div key={s.num} className="flex items-center">
                  <div 
                    className={`flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.24em] whitespace-nowrap transition-colors duration-300 ${step === s.num ? '' : step > s.num ? 'text-foreground' : 'text-muted'}`}
                    style={step === s.num ? { color: 'var(--accent-contact)' } : {}}
                  >
                    <span>0{s.num}</span>
                    <span className="hidden sm:inline">{s.label}</span>
                  </div>
                  {s.num < 4 && (
                    <div className="w-4 sm:w-6 h-px bg-surface mx-3 sm:mx-4"></div>
                  )}
                </div>
              ))}
            </div>

            {/* Form Body */}
            <div className="p-6 sm:p-8 flex-1 flex flex-col relative overflow-hidden">
              <form ref={formRef} onSubmit={sendEmail} onKeyDown={handleKeyDown} className="flex-1 flex flex-col">
                <AnimatePresence mode="wait">
                  
                  {/* STEP 1: INTENT */}
                  {step === 1 && (
                    <motion.div 
                      key="step1" data-step="1"
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}
                      className="flex-1 flex flex-col justify-center space-y-8"
                    >
                      <div className="space-y-2">
                        <h3 className="text-[17px] font-medium tracking-tight text-foreground">What would you like to discuss?</h3>
                        <p className="text-[13px] text-muted">Select a topic so I can better understand your request.</p>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {intents.map((item) => (
                          <button
                            key={item.id}
                            onClick={(e) => { 
                              e.preventDefault(); 
                              setIntent(item.id); 
                              setTimeout(() => setStep(2), 300); 
                            }}
                            className={`contact-group text-left p-5 border rounded-sm transition-all duration-300
                              ${intent === item.id 
                                ? "shadow-sm" 
                                : "border-surface bg-surface/10 hover:border-surface-strong hover:bg-surface/30"}
                            `}
                            style={intent === item.id ? {
                              borderColor: 'color-mix(in srgb, var(--accent-contact) 50%, transparent)',
                              backgroundColor: 'color-mix(in srgb, var(--accent-contact) 5%, transparent)',
                              boxShadow: '0 0 15px color-mix(in srgb, var(--accent-contact) 10%, transparent)'
                            } : {}}
                          >
                            <h4 
                              className="font-mono text-[9px] uppercase tracking-[0.24em] mb-2 transition-colors contact-label-hover"
                              style={intent === item.id ? { color: 'var(--accent-contact)' } : {}}
                            >
                              {item.label}
                            </h4>
                            <p className="text-[12px] text-muted leading-relaxed line-clamp-2">
                              {formContent[item.id].story}
                            </p>
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* STEP 2: IDENTITY */}
                  {step === 2 && (
                    <motion.div 
                      key="step2" data-step="2"
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}
                      className="flex-1 flex flex-col justify-center space-y-8"
                    >
                      <div className="space-y-2">
                        <h3 className="text-[17px] font-medium tracking-tight text-foreground">Who am I speaking with?</h3>
                        <p className="text-[13px] text-muted">Please provide your details so I can get back to you.</p>
                      </div>
                      <div className="space-y-5">
                        <div className="space-y-2 flex flex-col">
                          <label className="font-mono text-[9px] uppercase tracking-[0.24em] text-muted ml-0.5">Full Name</label>
                          <input 
                            type="text" name="user_name" 
                            value={formData.user_name} onChange={handleInputChange}
                            placeholder="e.g. Alex" 
                            className="contact-input w-full bg-surface/10 border border-surface rounded-sm px-4 py-3 text-[13px] text-foreground placeholder:text-muted/40 outline-none transition-all duration-300"
                          />
                        </div>
                        <div className="space-y-2 flex flex-col">
                          <label className="font-mono text-[9px] uppercase tracking-[0.24em] text-muted ml-0.5">Email Address</label>
                          <input 
                            type="email" name="user_email" 
                            pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"
                            value={formData.user_email} onChange={handleInputChange}
                            placeholder="email@example.com" 
                            className="contact-input w-full bg-surface/10 border border-surface rounded-sm px-4 py-3 text-[13px] text-foreground placeholder:text-muted/40 outline-none transition-all duration-300"
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* STEP 3: CONTEXT */}
                  {step === 3 && (
                    <motion.div 
                      key="step3" data-step="3"
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}
                      className="flex-1 flex flex-col justify-center space-y-8"
                    >
                      <div className="space-y-2">
                        <h3 className="text-[17px] font-medium tracking-tight text-foreground">{formContent[intent].title}</h3>
                        <p className="text-[13px] text-muted">A little context helps me prepare a better response.</p>
                      </div>
                      <div className="space-y-2 flex flex-col">
                        <label className="font-mono text-[9px] uppercase tracking-[0.24em] text-muted ml-0.5">{formContent[intent].step3Label}</label>
                        <input 
                          type="text" name="context_info" 
                          value={formData.context_info} onChange={handleInputChange}
                          placeholder={formContent[intent].step3Placeholder} 
                          className="contact-input w-full bg-surface/10 border border-surface rounded-sm px-4 py-3 text-[13px] text-foreground placeholder:text-muted/40 outline-none transition-all duration-300"
                        />
                      </div>
                    </motion.div>
                  )}

                  {/* STEP 4: MESSAGE */}
                  {step === 4 && status === "idle" && (
                    <motion.div 
                      key="step4" data-step="4"
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}
                      className="flex-1 flex flex-col space-y-6"
                    >
                      <div className="space-y-2">
                        <h3 className="text-[17px] font-medium tracking-tight text-foreground">Your Message</h3>
                      </div>
                      <div className="space-y-2 flex-1 flex flex-col">
                        <textarea 
                          name="message" required rows={6} 
                          value={formData.message} onChange={handlePayloadChange} 
                          placeholder={formContent[intent].placeholder} 
                          className={`contact-input flex-1 w-full bg-surface/10 border border-surface rounded-sm px-4 py-3 text-[13px] leading-relaxed text-foreground placeholder:text-muted/40 outline-none transition-all duration-300 resize-none ${customScrollbar}`}
                        />
                        <div className="flex justify-between items-center pt-1">
                          <span className={`font-mono text-[9px] uppercase tracking-[0.24em] ${payloadSize > 1500 ? 'text-red-500 font-bold' : 'text-muted'}`}>
                            {payloadSize} bytes
                          </span>
                          {payloadSize > 1500 && (
                            <span className="font-mono text-[9px] uppercase tracking-[0.24em] text-amber-500">Limit Approaching</span>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* STATUS STATES */}
                  {step === 4 && status !== "idle" && (
                    <motion.div 
                      key="status"
                      initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} transition={{ duration: 0.3 }}
                      className="flex-1 flex flex-col items-center justify-center text-center space-y-6 min-h-[300px]"
                    >
                      {status === "sending" && (
                        <>
                          <VscLoading className="text-2xl animate-spin" style={{ color: 'var(--accent-contact)' }} />
                          <h3 className="text-[15px] font-medium text-foreground">Transmitting...</h3>
                          <p className="text-[13px] text-muted">Please wait while your message is delivered.</p>
                        </>
                      )}
                      
                      {status === "success" && (
                        <>
                          <div className="w-12 h-12 rounded-sm bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                            <FaCheckCircle className="text-emerald-500 text-xl" />
                          </div>
                          <h3 className="text-[17px] font-medium text-foreground tracking-tight">Message Delivered</h3>
                          <p className="text-[13px] text-muted max-w-sm leading-relaxed">
                            Thank you for reaching out. I&apos;ve received your message and will get back to you within 24 hours.
                          </p>
                          <button type="button" onClick={resetFlow} className="mt-4 px-4 py-2 border border-surface bg-surface/20 rounded-sm font-mono text-[9px] uppercase tracking-[0.24em] text-muted hover:text-foreground hover:bg-surface hover:border-surface-strong transition-all">
                            Send Another Message [ESC]
                          </button>
                        </>
                      )}

                      {status === "error" && (
                        <>
                          <div className="w-12 h-12 rounded-sm bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                            <FaExclamationCircle className="text-red-500 text-xl" />
                          </div>
                          <h3 className="text-[17px] font-medium text-foreground tracking-tight">Transmission Failed</h3>
                          <p className="text-[13px] text-muted max-w-sm leading-relaxed">
                            There was an error delivering your message. Please try again or use direct email.
                          </p>
                          <button type="button" onClick={() => setStatus("idle")} className="mt-4 px-6 py-2 bg-red-500/10 text-red-500 border border-red-500/20 rounded-sm font-mono text-[9px] uppercase tracking-[0.24em] hover:bg-red-500 hover:text-white transition-all">
                            Retry
                          </button>
                        </>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* NAVIGATION FOOTER */}
                {step > 1 && status === "idle" && (
                  <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
                    className="mt-8 pt-5 border-t border-surface flex items-center justify-between"
                  >
                    <button type="button" onClick={prevStep} className="px-2 py-2 -ml-2 font-mono text-[9px] uppercase tracking-[0.24em] text-muted hover:text-foreground transition-colors flex items-center gap-1.5">
                      ← Back
                    </button>
                    
                    {step < 4 ? (
                      <button 
                        type="button" 
                        onClick={nextStep} 
                        disabled={step === 2 && (!formData.user_name.trim() || !formData.user_email.trim())}
                        className="px-5 py-2.5 bg-foreground text-background font-mono text-[9px] uppercase tracking-[0.24em] rounded-sm hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        Continue →
                      </button>
                    ) : (
                      <button 
                        type="submit" 
                        className="px-5 py-2.5 text-background font-mono text-[9px] uppercase tracking-[0.24em] rounded-sm hover:opacity-90 transition-all flex items-center gap-2"
                        style={{ 
                          backgroundColor: 'var(--accent-contact)',
                          boxShadow: '0 0 15px color-mix(in srgb, var(--accent-contact) 40%, transparent)'
                        }}
                      >
                        Execute Send →
                      </button>
                    )}
                  </motion.div>
                )}
              </form>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}