"use client";

import React, { useState, useEffect, useRef } from "react";
import emailjs from "@emailjs/browser";
import { 
  ShieldCheck, 
  Cpu, 
  Wifi, 
  Lock, 
  User, 
  Mail, 
  MessageSquare, 
  Loader2, 
  CheckCircle2, 
  AlertCircle,
  Zap,
  Terminal as TerminalIcon,
  Globe
} from "lucide-react";

export default function Contact() {
  const formRef = useRef<HTMLFormElement>(null);
  const [booting, setBooting] = useState(true);
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [payloadSize, setPayloadSize] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setBooting(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handlePayloadChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    // Standard UTF-8 characters = 1 byte each for basic Latin
    setPayloadSize(new Blob([e.target.value]).size);
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
        setTimeout(() => {
          formRef.current?.reset();
          setPayloadSize(0);
          setStatus("idle");
        }, 3000);
      }, () => {
        setStatus("error");
        setTimeout(() => setStatus("idle"), 3000);
      });
  };

  if (booting) {
    return (
      <div className="min-h-screen bg-[#010101] flex items-center justify-center font-mono">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="text-cyan-500 animate-spin" size={24} />
          <span className="text-cyan-500 text-[9px] tracking-[0.4em] uppercase font-bold">SECURE_LINK_INIT</span>
        </div>
      </div>
    );
  }

  return (
    <section id="contact" className="relative min-h-screen w-full bg-[#020202] text-white py-24 px-6 md:px-16 lg:px-32 overflow-hidden border-t border-white/[0.03]">
      
      {/* HUD GRID BACKGROUND */}
      <div className="absolute inset-0 z-0 opacity-[0.02] pointer-events-none bg-[radial-gradient(circle,rgba(6,182,212,0.1)_1px,transparent_1px)] bg-[size:30px_30px]"></div>

      <div className="relative z-10 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* LEFT: ANALYST INFO */}
        <div className="lg:col-span-5 space-y-10">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-cyan-400 font-mono text-[9px] tracking-[0.4em] uppercase">
              <TerminalIcon size={12} />
              <span>// COMS_UPLINK</span>
            </div>
            
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase leading-[0.85]">
              Contact <span className="text-zinc-800 italic">Analyst.</span>
            </h2>

            <div className="flex flex-wrap gap-4 font-mono text-[8px] text-zinc-600 uppercase tracking-widest pt-2">
              <span className="flex items-center gap-1.5"><Wifi size={10} className="text-cyan-500" /> ONLINE</span>
              <span className="flex items-center gap-1.5"><Lock size={10} className="text-zinc-700" /> AES_256</span>
              <span className="flex items-center gap-1.5"><Globe size={10} className="text-zinc-700" /> ASIA_NODES</span>
            </div>
          </div>

          {/* DOSSIER PANEL - COMPACT */}
          <div className="p-6 border border-white/[0.03] bg-[#050505] rounded-sm relative group overflow-hidden">
             <div className="relative z-10 space-y-4">
               <div className="flex justify-between items-center border-b border-zinc-900 pb-3">
                 <span className="text-[9px] font-mono text-cyan-900 font-bold uppercase tracking-widest">ASSET_DATA</span>
                 <span className="text-[9px] font-mono text-zinc-800">JG_009</span>
               </div>
               
               <div className="grid grid-cols-1 gap-y-2.5 font-mono text-[10px]">
                 <div className="flex justify-between text-zinc-500 hover:text-zinc-300 transition-colors">
                   <span>IDENTITY:</span>
                   <span>Jothish Gandham</span>
                 </div>
                 <div className="flex justify-between text-zinc-500 hover:text-cyan-400 transition-colors">
                   <span>PRIMARY_COMS:</span>
                   <span>jothishgandham2@gmail.com</span>
                 </div>
                 <div className="flex justify-between text-zinc-500">
                   <span>GITHUB:</span>
                   <span className="text-zinc-400">github.com/jothish-blip</span>
                 </div>
                 <p className="text-[9px] text-zinc-700 italic border-t border-zinc-900 pt-3 leading-relaxed">
                   "The quieter you become, the more you are able to hear."
                 </p>
               </div>
             </div>
          </div>
        </div>

        {/* RIGHT: TRANSMISSION CONSOLE */}
        <div className="lg:col-span-7 relative">
          <div className="relative bg-[#080808] border border-white/[0.05] p-6 md:p-10 rounded-sm">
            <form ref={formRef} onSubmit={sendEmail} className="space-y-8">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[9px] uppercase tracking-[0.2em] text-zinc-600 font-mono font-bold">01_Identity</label>
                  <div className="relative border-b border-zinc-800 focus-within:border-cyan-500 transition-colors">
                    <User className="absolute left-0 top-1 text-zinc-800" size={14} />
                    <input 
                      type="text" name="user_name" required 
                      placeholder="Input Identity..."
                      className="w-full bg-transparent py-1.5 pl-6 pr-4 text-white font-mono text-xs placeholder:text-zinc-900 outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[9px] uppercase tracking-[0.2em] text-zinc-600 font-mono font-bold">02_Return_Link</label>
                  <div className="relative border-b border-zinc-800 focus-within:border-cyan-500 transition-colors">
                    <Mail className="absolute left-0 top-1 text-zinc-800" size={14} />
                    <input 
                      type="email" name="user_email" required 
                      placeholder="Node@Protocol..."
                      className="w-full bg-transparent py-1.5 pl-6 pr-4 text-white font-mono text-xs placeholder:text-zinc-900 outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[9px] uppercase tracking-[0.2em] text-zinc-600 font-mono font-bold">03_Payload_Content</label>
                <div className="relative border border-zinc-900 p-4 bg-black/20 focus-within:border-cyan-900/50 transition-colors">
                  <MessageSquare className="absolute right-4 bottom-4 text-zinc-900 pointer-events-none" size={14} />
                  <textarea 
                    name="message" required rows={5} 
                    onChange={handlePayloadChange}
                    placeholder="Input data packet content here..."
                    className="w-full bg-transparent text-white font-mono text-xs placeholder:text-zinc-900 outline-none resize-none leading-relaxed"
                  />
                  
                  {/* LIVE BYTE COUNTER */}
                  <div className="mt-3 flex justify-between font-mono text-[8px] text-zinc-700 uppercase tracking-widest border-t border-zinc-900 pt-3">
                    <div className="flex gap-4">
                      <span>MTU: 1500_B</span>
                      <span className={payloadSize > 1200 ? "text-orange-900" : ""}>Payload: {payloadSize}_Bytes</span>
                    </div>
                    <span>ENC: UTF-8</span>
                  </div>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={status === "sending"}
                className="w-full bg-transparent border border-cyan-500/40 text-cyan-500 font-mono font-bold py-4 transition-all flex items-center justify-center gap-4 group/btn relative overflow-hidden active:scale-[0.98]"
              >
                <div className="absolute inset-0 bg-cyan-500 translate-y-[100%] group-hover/btn:translate-y-0 transition-transform duration-500" />
                
                <span className="relative z-10 flex items-center gap-2 group-hover/btn:text-black transition-colors uppercase tracking-[0.3em] text-[10px]">
                  {status === "idle" && <><Zap size={14} /> Transmit_Packet</>}
                  {status === "sending" && <><Loader2 size={14} className="animate-spin" /> Encrypting...</>}
                  {status === "success" && <><CheckCircle2 size={14} /> Transmission_Done</>}
                  {status === "error" && <><AlertCircle size={14} /> Link_Failed</>}
                </span>
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="mt-20 max-w-6xl mx-auto flex justify-between items-center border-t border-zinc-900 pt-6 font-mono text-[8px] text-zinc-800 uppercase tracking-[0.4em]">
         <div className="flex items-center gap-3">
           <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-pulse"></span>
           SESSION_ID: 8374754009
         </div>
         <p>© 2026 // J_G_ANALYST</p>
      </div>
    </section>
  );
}