"use client";

import React, { useState, useEffect, useRef } from "react";
import emailjs from "@emailjs/browser";
// --- STABLE REACT-ICONS IMPORTS ---
import { 
  SiGithub, 
  SiJavascript
} from "react-icons/si";
import { 
  FaUserSecret, 
  FaEnvelopeOpenText, 
  FaTerminal, 
  FaGlobeAsia, 
  FaLock, 
  FaExternalLinkAlt, 
  FaPhoneAlt,
  FaCheckCircle,
  FaExclamationTriangle,
  FaBolt,
  FaLinkedin // Using the highly stable Fa version
} from "react-icons/fa";
import { VscLoading } from "react-icons/vsc";
import { BiMessageSquareDetail } from "react-icons/bi";

export default function Contact() {
  const formRef = useRef<HTMLFormElement>(null);
  const [booting, setBooting] = useState(true);
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [payloadSize, setPayloadSize] = useState(0);
  const [systemLogs, setSystemLogs] = useState<string[]>(["initializing secure channel...", "awaiting input..."]);

  useEffect(() => {
    const timer = setTimeout(() => setBooting(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const addLog = (msg: string) => {
    setSystemLogs(prev => [...prev.slice(-3), msg]);
  };

  const handlePayloadChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const size = new Blob([e.target.value]).size;
    setPayloadSize(size);
    if (size > 0 && size < 10) addLog("payload injection detected...");
  };

  const sendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    addLog("encrypting payload (AES-256)...");

    const SERVICE_ID = "your_service_id"; 
    const TEMPLATE_ID = "your_template_id";
    const PUBLIC_KEY = "your_public_key";

    emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, formRef.current!, PUBLIC_KEY)
      .then(() => {
        setStatus("success");
        addLog("secure link established.");
        setTimeout(() => {
          formRef.current?.reset();
          setPayloadSize(0);
          setStatus("idle");
        }, 4000);
      }, () => {
        setStatus("error");
        addLog("handshake failed. retry.");
        setTimeout(() => setStatus("idle"), 4000);
      });
  };

  const getStatusColor = () => {
    if (status === "sending") return "text-orange-500 border-orange-500/40";
    if (status === "success") return "text-green-500 border-green-500/40";
    if (status === "error") return "text-red-500 border-red-500/40";
    if (payloadSize > 1400) return "text-red-500 border-red-500/40";
    return "text-cyan-500 border-cyan-500/40";
  };

  if (booting) {
    return (
      <div className="min-h-screen bg-[#010101] flex items-center justify-center font-mono text-cyan-500">
        <div className="flex flex-col items-center gap-4">
          <VscLoading className="animate-spin" size={32} />
          <span className="text-[10px] tracking-[0.5em] uppercase font-bold animate-pulse">Establishing_Uplink</span>
        </div>
      </div>
    );
  }

  return (
    <section id="contact" className="relative min-h-screen w-full bg-[#020202] text-white py-24 px-6 md:px-16 lg:px-32 overflow-hidden border-t border-white/[0.03]">
      <div className="absolute inset-0 z-0 opacity-[0.02] pointer-events-none bg-[radial-gradient(circle,#00ffff_1px,transparent_1px)] bg-[size:40px_40px]"></div>

      <div className="relative z-10 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        <div className="lg:col-span-5 space-y-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3 font-mono text-[10px] tracking-[0.4em] uppercase text-zinc-500">
              <FaTerminal size={14} className="text-cyan-500" />
              <span>// secure_comms_interface</span>
            </div>
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-none">
              Contact <span className="text-zinc-800 italic">Analyst.</span>
            </h2>
            <p className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest leading-relaxed">
              &quot;Prefer direct communication for faster response.&quot;
            </p>
            <div className="flex flex-wrap gap-4 font-mono text-[9px] text-zinc-500 uppercase tracking-widest pt-2">
              <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-ping"></div> SIGNAL: STRONG</span>
              <span className="flex items-center gap-1.5 text-cyan-500/60"><FaGlobeAsia size={10} /> LATENCY: 24ms</span>
            </div>
          </div>

          <div className="p-6 border border-white/[0.05] bg-zinc-900/10 backdrop-blur-sm rounded-sm space-y-6 group">
             <div className="flex justify-between items-center border-b border-zinc-900 pb-3">
               <span className="text-[10px] font-mono text-cyan-500 font-bold uppercase tracking-widest">Target_Dossier</span>
               <span className="text-[9px] font-mono text-green-500 bg-green-500/10 px-2 py-0.5 rounded-full font-black">● OPEN_TO_SECURITY_ROLES</span>
             </div>
             <div className="grid grid-cols-1 gap-y-2 font-mono text-[11px]">
               <div className="flex justify-between p-2 hover:bg-white/[0.03] transition-colors rounded group/item">
                 <span className="text-zinc-600 uppercase">Identity</span>
                 <span className="text-zinc-300">Jothish Gandham</span>
               </div>
               <a href="mailto:jothishgandham2@gmail.com" className="flex justify-between p-2 hover:bg-white/[0.03] transition-colors rounded group/item">
                 <span className="text-zinc-600 uppercase">Primary_Node</span>
                 <span className="text-cyan-500 truncate ml-4">jothishgandham2@gmail.com</span>
               </a>
               <a href="https://www.linkedin.com/in/jothish-gandham-5b90b334a" target="_blank" rel="noopener noreferrer" className="flex justify-between p-2 hover:bg-white/[0.03] transition-colors rounded group/item">
                 <span className="text-zinc-600 uppercase">LinkedIn_Node</span>
                 <span className="text-blue-400 group-hover/item:underline flex items-center gap-1">linkedin/jothish-gandham <FaExternalLinkAlt size={8}/></span>
               </a>
               <a href="tel:+918374754009" className="flex justify-between p-2 hover:bg-white/[0.03] transition-colors rounded group/item">
                 <span className="text-zinc-600 uppercase">Direct_Line</span>
                 <span className="text-green-400 font-bold">+91 83747 54009</span>
               </a>
               <div className="flex justify-between p-2 text-zinc-500 italic border-t border-zinc-900 mt-2 pt-2">
                 <span className="uppercase text-zinc-600">Response_Time</span>
                 <span className="text-green-500 font-bold">&lt; 24hrs</span>
               </div>
             </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <a href="https://github.com/jothish-blip" target="_blank" rel="noopener noreferrer" className="py-3 border border-zinc-800 text-[9px] font-mono text-center uppercase tracking-widest hover:bg-white hover:text-black transition-all flex items-center justify-center gap-2">
              <SiGithub size={12}/> Github
            </a>
            <a href="https://www.linkedin.com/in/jothish-gandham-5b90b334a" target="_blank" rel="noopener noreferrer" className="py-3 border border-zinc-800 text-[9px] font-mono text-center uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all flex items-center justify-center gap-2">
              <FaLinkedin size={12}/> LinkedIn
            </a>
            <button onClick={() => window.open('mailto:jothishgandham2@gmail.com')} className="py-3 border border-zinc-800 text-[9px] font-mono text-center uppercase tracking-widest hover:bg-cyan-500 hover:text-black transition-all flex items-center justify-center gap-2">
              <FaEnvelopeOpenText size={12}/> Email
            </button>
            <a href="tel:+918374754009" className="py-3 border border-zinc-800 text-[9px] font-mono text-center uppercase tracking-widest hover:bg-green-600 hover:text-white transition-all flex items-center justify-center gap-2">
              <FaPhoneAlt size={10}/> Call_Now
            </a>
          </div>
        </div>

        <div className="lg:col-span-7">
          <div className={`relative bg-black border transition-all duration-500 p-6 md:p-10 rounded-sm shadow-2xl ${getStatusColor()}`}>
            <form ref={formRef} onSubmit={sendEmail} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[9px] uppercase tracking-[0.2em] text-zinc-500 font-mono font-bold flex items-center gap-2">
                    <FaUserSecret size={12}/> &gt; enter_identity
                  </label>
                  <input type="text" name="user_name" required placeholder="Input Identity..." className="w-full bg-transparent border-b border-zinc-800 py-2 text-white font-mono text-sm outline-none focus:border-current transition-colors" />
                </div>
                <div className="space-y-3">
                  <label className="text-[9px] uppercase tracking-[0.2em] text-zinc-500 font-mono font-bold flex items-center gap-2">
                    <FaEnvelopeOpenText size={12}/> &gt; enter_return_node
                  </label>
                  <input type="email" name="user_email" required placeholder="Input Email..." className="w-full bg-transparent border-b border-zinc-800 py-2 text-white font-mono text-sm outline-none focus:border-current transition-colors" />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[9px] uppercase tracking-[0.2em] text-zinc-500 font-mono font-bold flex items-center gap-2">
                  <BiMessageSquareDetail size={14}/> &gt; inject_payload
                </label>
                <div className="relative border border-zinc-800 p-4 bg-zinc-900/20 focus-within:border-current transition-all">
                  <textarea name="message" required rows={5} onChange={handlePayloadChange} placeholder="Input packet data..." className="w-full bg-transparent text-white font-mono text-xs outline-none resize-none leading-relaxed" />
                  <div className="mt-3 flex justify-between font-mono text-[8px] text-zinc-600 uppercase border-t border-zinc-900/50 pt-3">
                    <div className="flex gap-4">
                      <span>MTU: 1500_B</span>
                      <span className={payloadSize > 1200 ? "text-orange-500" : ""}>Size: {payloadSize}_B</span>
                    </div>
                    <span className="animate-pulse flex items-center gap-1"><FaLock size={10}/> encrypted_v2</span>
                  </div>
                </div>
              </div>

              <div className="bg-black/40 border border-zinc-900 p-3 font-mono text-[9px] space-y-1">
                {systemLogs.map((log, i) => (
                  <div key={i} className="flex gap-2">
                    <span className="text-zinc-700">[{new Date().toLocaleTimeString([], {hour12:false})}]</span>
                    <span className="text-zinc-500 capitalize">{log}</span>
                  </div>
                ))}
              </div>

              <button type="submit" disabled={status === "sending"} className={`w-full bg-transparent border py-4 transition-all flex items-center justify-center gap-4 group/btn relative overflow-hidden active:scale-[0.98] font-mono font-bold ${getStatusColor()}`}>
                <div className="absolute inset-0 bg-current opacity-[0.05] translate-y-[100%] group-hover/btn:translate-y-0 transition-transform duration-500" />
                <span className="relative z-10 flex items-center gap-2 uppercase tracking-[0.3em] text-[11px]">
                  {status === "idle" && <><FaBolt size={12} /> Initiate_Transmission</>}
                  {status === "sending" && <><VscLoading size={14} className="animate-spin" /> Encrypting_Payload...</>}
                  {status === "success" && <><FaCheckCircle size={12} /> Secure_Link_Established</>}
                  {status === "error" && <><FaExclamationTriangle size={12} /> Handshake_Failed</>}
                </span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}