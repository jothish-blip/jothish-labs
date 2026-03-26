"use client";

import { useState, useEffect, useRef } from "react";
import { handleCommand, state } from "@/lib/terminal/commandHandler";
import { 
  Terminal as TerminalIcon, 
  Mail, 
  Copy, 
  Power, 
  X, 
  Minus, 
  Maximize2 
} from "lucide-react";
import { SiGithub } from "react-icons/si";

export default function Terminal() {
  const [history, setHistory] = useState<{command: string, output: string, isRoot: boolean}[]>([]);
  const [input, setInput] = useState("");
  const [isRoot, setIsRoot] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isClosed, setIsClosed] = useState(true);
  const [copied, setCopied] = useState(false);
  
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isClosed && !isMinimized) {
      terminalRef.current?.scrollTo({ top: terminalRef.current.scrollHeight, behavior: "smooth" });
      inputRef.current?.focus();
    }
  }, [history, isClosed, isMinimized, isMaximized]);

  const initTerminal = () => {
    setIsClosed(false);
    if (history.length === 0) {
      const welcome = `[ SYSTEM INITIALIZED ]\nUSER: JOTHISH GANDHAM | ROLE: ANALYST\nType 'help' for protocols.`;
      setHistory([{ command: "system --init", output: welcome, isRoot: false }]);
    }
  };

  const handleSubmit = async () => {
    if (!input.trim()) return;
    const currentInput = input;
    const result = handleCommand(currentInput);
    setIsRoot(state.isRoot);
    setInput("");
    if (result === "__CLEAR__") { setHistory([]); return; }
    if (result === "__EXIT__") { setIsClosed(true); return; }

    if (typeof result === "string") {
      setHistory((prev) => [...prev, { command: currentInput, output: result, isRoot: state.isRoot }]);
    } else {
      setHistory((prev) => [...prev, { command: currentInput, output: "", isRoot: state.isRoot }]);
      let currentOutput = "";
      for (const line of result.lines) {
        await new Promise((res) => setTimeout(res, result.delay || 100));
        currentOutput += line + "\n";
        setHistory((prev) => {
          const updated = [...prev];
          updated[updated.length - 1].output = currentOutput;
          return updated;
        });
      }
    }
  };

  if (isClosed) {
    return (
      <div className="py-20 flex flex-col items-center justify-center bg-[#050505] w-full">
         <button onClick={initTerminal} className="group flex items-center gap-3 px-8 py-4 border border-red-500/30 bg-black text-red-500 font-mono text-sm tracking-[0.2em] uppercase hover:bg-red-500 hover:text-white transition-all duration-500">
          <Power size={16} className="group-hover:rotate-90 transition-transform duration-500" />
          Initialize_Workstation
        </button>
      </div>
    );
  }

  return (
    <section className="relative w-full bg-[#050505] flex flex-col items-center py-20 px-4 sm:px-10 z-30">
      
      {/* STABLE CONTAINER LOGIC:
          - We change width/height values instead of 'scale' to prevent text blurring/zooming.
          - Added slow-pulse red glow when maximized.
      */}
      <div 
        className={`transition-all duration-700 ease-in-out border border-white/10 flex flex-col relative overflow-hidden
        ${isMaximized 
          ? 'w-full max-w-6xl h-[700px] border-red-500/40 shadow-[0_0_40px_rgba(239,68,68,0.15)] animate-border-pulse' 
          : 'w-full max-w-4xl h-[500px] shadow-2xl'}
        ${isMinimized ? 'h-12 opacity-50' : ''}
        rounded-lg bg-black/60 backdrop-blur-lg`}
      >

        {/* HEADER - Reduced Icon Sizes like macOS */}
        <div className="relative flex items-center px-4 py-2.5 bg-zinc-900/90 border-b border-white/5 z-30">
          <div className="flex items-center gap-2 z-20">
            <button onClick={() => setIsClosed(true)} className="group w-3 h-3 rounded-full bg-[#ff5f56] flex items-center justify-center">
              <X size={7} className="text-black opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
            <button onClick={() => setIsMinimized(!isMinimized)} className="group w-3 h-3 rounded-full bg-[#ffbd2e] flex items-center justify-center">
              <Minus size={7} className="text-black opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
            <button onClick={() => setIsMaximized(!isMaximized)} className="group w-3 h-3 rounded-full bg-[#27c93f] flex items-center justify-center">
              <Maximize2 size={7} className="text-black opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          </div>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="text-[9px] font-mono text-zinc-500 tracking-[0.2em] uppercase font-bold">
              {isRoot ? 'ROOT_ACCESS' : 'USER_SESSION'} — KALI
            </span>
          </div>
        </div>

        {/* TERMINAL CONTENT - Size stays constant during zoom */}
        {!isMinimized && (
          <div ref={terminalRef} className="flex-1 overflow-y-auto p-8 font-mono text-[14px] custom-scrollbar z-20" onClick={() => inputRef.current?.focus()}>
            {history.map((item, i) => (
              <div key={i} className="mb-6">
                <div className="flex flex-col">
                  <div className="flex gap-1 items-center font-bold">
                    <span className="text-white/30 tracking-tighter">┌──(</span>
                    <span className={item.isRoot ? "text-[#32ff7e]" : "text-red-500"}>{item.isRoot ? "root" : "jothish"}㉿kali</span>
                    <span className="text-white/30 tracking-tighter">)-[~]</span>
                  </div>
                  <div className="flex gap-2 font-bold">
                    <span className="text-white/30 tracking-tighter">└─{item.isRoot ? "#" : "$"}</span>
                    <span className="text-white">{item.command}</span>
                  </div>
                </div>
                <pre className="mt-2 ml-6 text-zinc-300 font-medium whitespace-pre-wrap leading-relaxed">{item.output}</pre>
              </div>
            ))}

            <div className="flex flex-col">
              <div className="flex gap-1 items-center font-bold">
                <span className="text-white/30 tracking-tighter">┌──(</span>
                <span className={isRoot ? "text-[#32ff7e]" : "text-red-500"}>{isRoot ? "root" : "jothish"}㉿kali</span>
                <span className="text-white/30 tracking-tighter">)-[~]</span>
              </div>
              <div className="flex gap-2 font-bold">
                <span className="text-white/30 tracking-tighter">└─{isRoot ? "#" : "$"}</span>
                <input 
                  ref={inputRef} 
                  value={input} 
                  onChange={(e) => setInput(e.target.value)} 
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()} 
                  className="bg-transparent outline-none flex-1 text-white caret-red-500" 
                  autoComplete="off" 
                  spellCheck={false} 
                />
              </div>
            </div>
          </div>
        )}

        {/* FOOTER */}
        <div className="px-5 py-2 bg-zinc-900/50 border-t border-white/5 flex justify-between items-center z-30">
          <div className="flex gap-4 items-center">
            <button onClick={() => { navigator.clipboard.writeText("jothishgandham2@gmail.com"); setCopied(true); setTimeout(()=>setCopied(false),1000)}} className="text-[9px] text-zinc-500 hover:text-white transition-colors uppercase tracking-widest flex items-center gap-1">
              <Copy size={10} /> {copied ? "Copied" : "Copy Email"}
            </button>
            <a href="https://github.com/jothish-blip" target="_blank" className="text-[9px] text-zinc-500 hover:text-white transition-colors uppercase tracking-widest flex items-center gap-1">
              <SiGithub size={10} /> GitHub
            </a>
          </div>
          <span className="text-[9px] text-zinc-600 font-mono hidden sm:block italic">"The quieter you become, the more you are able to hear."</span>
        </div>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #3f3f46; border-radius: 10px; }

        @keyframes border-pulse {
          0% { border-color: rgba(239, 68, 68, 0.4); box-shadow: 0 0 20px rgba(239, 68, 68, 0.1); }
          50% { border-color: rgba(239, 68, 68, 0.7); box-shadow: 0 0 40px rgba(239, 68, 68, 0.25); }
          100% { border-color: rgba(239, 68, 68, 0.4); box-shadow: 0 0 20px rgba(239, 68, 68, 0.1); }
        }

        .animate-border-pulse {
          animation: border-pulse 4s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}