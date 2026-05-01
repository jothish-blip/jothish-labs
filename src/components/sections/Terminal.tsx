"use client";

import { useState, useEffect, useRef } from "react";
import { handleCommand, state, availableCommands, analytics } from "@/lib/terminal/commandHandler";
import { 
  Terminal as TerminalIcon, 
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
  
  const [historyIndex, setHistoryIndex] = useState(-1);

  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isClosed && !isMinimized) {
      terminalRef.current?.scrollTo({ top: terminalRef.current.scrollHeight, behavior: "smooth" });
      inputRef.current?.focus();
    }
  }, [history, isClosed, isMinimized, isMaximized, input]);

  const initTerminal = () => {
    setIsClosed(false);
    if (history.length === 0) {
      const welcome = `[ SYSTEM INITIALIZED ]\nUSER: JOTHISH GANDHAM | ROLE: ANALYST\nType 'help' for protocols.`;
      setHistory([{ command: "system --init", output: welcome, isRoot: false }]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSubmit();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (historyIndex < state.cmdHistory.length - 1) {
        const nextIdx = historyIndex + 1;
        setHistoryIndex(nextIdx);
        setInput(state.cmdHistory[state.cmdHistory.length - 1 - nextIdx]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex > 0) {
        const nextIdx = historyIndex - 1;
        setHistoryIndex(nextIdx);
        setInput(state.cmdHistory[state.cmdHistory.length - 1 - nextIdx]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInput("");
      }
    } else if (e.key === "Tab") {
      e.preventDefault();
      const match = availableCommands.find(c => c.startsWith(input.toLowerCase()));
      if (match) setInput(match);
    }
  };

  const handleSubmit = async () => {
    if (!input.trim()) return;
    const currentInput = input.trim();
    
    setHistoryIndex(-1);
    setInput("");
    
    // Set immediate "processing..." feedback
    setHistory((prev) => [...prev, { command: currentInput, output: "processing...", isRoot: state.isRoot }]);
    
    const result = handleCommand(currentInput);
    setIsRoot(state.isRoot);

    if (result === "__CLEAR__") { setHistory([]); return; }
    if (result === "__EXIT__") { setIsClosed(true); return; }
    
    // UI Interaction Control
    if (result === "__OPEN_PROJECTS__") {
      setHistory(prev => {
        const updated = [...prev];
        updated[updated.length - 1].output = "Navigating to projects...";
        return updated;
      });
      setTimeout(() => {
        window.location.href = "#projects";
      }, 500);
      return;
    }

    if (typeof result === "string") {
      setTimeout(() => {
        setHistory((prev) => {
          const updated = [...prev];
          updated[updated.length - 1].output = result;
          return updated;
        });
      }, 100);
    } else {
      let currentOutput = "";
      const delay = result.delay || 50;
      
      for (let i = 0; i < result.lines.length; i++) {
        // Batch visual rendering to prevent lagging
        if (i % 3 === 0) await new Promise((res) => setTimeout(res, delay));
        currentOutput += result.lines[i] + "\n";
        setHistory((prev) => {
          const updated = [...prev];
          updated[updated.length - 1].output = currentOutput;
          return updated;
        });
      }
    }
  };

  const currentSuggestion = input ? availableCommands.find(c => c.startsWith(input.toLowerCase()) && c !== input.toLowerCase()) : null;

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
      
      <div 
        className={`transition-all duration-700 ease-in-out border border-white/10 flex flex-col relative overflow-x-hidden focus-within:border-cyan-500/30 focus-within:shadow-[0_0_30px_rgba(34,211,238,0.05)] bg-black/60 backdrop-blur-lg
        ${isMaximized 
          ? 'fixed inset-0 w-full h-full z-[9999] rounded-none border-none shadow-none bg-[#050505]' 
          : 'w-full max-w-4xl h-[500px] shadow-2xl rounded-lg'}
        ${isMinimized ? 'h-12 opacity-50 overflow-hidden' : ''}`}
      >

        {/* HEADER */}
        <div className="relative flex items-center px-4 py-2.5 bg-zinc-900/90 border-b border-white/5 z-30">
          <div className="flex items-center gap-2 z-20">
            <button onClick={() => setIsClosed(true)} className="w-3 h-3 rounded-full bg-[#ff5f56] flex items-center justify-center">
              <X size={8} className="text-black/50" />
            </button>
            <button onClick={() => setIsMinimized(!isMinimized)} className="w-3 h-3 rounded-full bg-[#ffbd2e] flex items-center justify-center">
              <Minus size={8} className="text-black/50" />
            </button>
            <button onClick={() => setIsMaximized(!isMaximized)} className="w-3 h-3 rounded-full bg-[#27c93f] flex items-center justify-center">
              <Maximize2 size={8} className="text-black/50" />
            </button>
          </div>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="text-[9px] font-mono text-zinc-500 tracking-[0.2em] uppercase font-bold">
              {isRoot ? 'ROOT_ACCESS' : 'USER_SESSION'} — KALI
            </span>
          </div>
        </div>

        {/* INTELLIGENCE PANEL (Live Data) */}
        {!isMinimized && (
          <div className="absolute top-12 right-4 text-[10px] font-mono text-zinc-500 space-y-1 z-30 text-right pointer-events-none hidden sm:block">
            <div>cmds: {analytics.totalCommands}</div>
            <div>last: {analytics.lastCommand || "none"}</div>
          </div>
        )}

        {/* TERMINAL CONTENT */}
        {!isMinimized && (
          <div ref={terminalRef} className="flex-1 overflow-y-auto p-4 sm:p-8 font-mono text-[13px] sm:text-[14px] custom-scrollbar z-20" onClick={() => inputRef.current?.focus()}>
            
            {history.map((item, i) => {
              // Dynamic visual feedback based on output content
              const isError = item.output.includes("Unknown command") || item.output.includes("usage:");
              const outputColor = item.output === "processing..." ? "text-zinc-500 animate-pulse" : isError ? "text-red-400" : "text-cyan-400";
              
              return (
                <div key={i} className="mb-6">
                  <div className="flex flex-col">
                    <div className="flex gap-1 items-center font-bold">
                      <span className="text-white/30 tracking-tighter">┌──(</span>
                      <span className={item.isRoot ? "text-[#32ff7e]" : "text-red-500"}>{item.isRoot ? "root" : "jothish"}㉿kali</span>
                      <span className="text-white/30 tracking-tighter">)-[~]</span>
                    </div>
                    <div className="flex gap-2 font-bold">
                      <span className="text-white/30 tracking-tighter">└─{item.isRoot ? "#" : "$"}</span>
                      <span className="text-white break-all">{item.command}</span>
                    </div>
                  </div>
                  <pre className={`mt-2 ml-6 font-medium whitespace-pre-wrap leading-relaxed ${outputColor}`}>
                    {item.output}
                  </pre>
                </div>
              );
            })}

            {/* STICKY INPUT WRAPPER (MOBILE UX FIX) */}
            <div className="sticky bottom-0 bg-[#050505] pt-2 pb-4 flex flex-col z-30">
              <div className="flex gap-1 items-center font-bold">
                <span className="text-white/30 tracking-tighter">┌──(</span>
                <span className={isRoot ? "text-[#32ff7e]" : "text-red-500"}>{isRoot ? "root" : "jothish"}㉿kali</span>
                <span className="text-white/30 tracking-tighter">)-[~]</span>
              </div>
              <div className="flex gap-2 items-center font-bold relative group">
                <span className="text-white/30 tracking-tighter">└─{isRoot ? "#" : "$"}</span>
                <div className="flex items-center flex-1 bg-transparent transition-colors">
                  <input 
                    ref={inputRef} 
                    value={input} 
                    onChange={(e) => setInput(e.target.value)} 
                    onKeyDown={handleKeyDown} 
                    className="bg-transparent outline-none flex-1 text-white caret-red-500 text-[16px] sm:text-[14px] py-3 px-2" 
                    autoComplete="off" 
                    spellCheck={false} 
                  />
                  {/* Subtle Typing Cursor */}
                  <span className="text-cyan-500 animate-pulse font-light absolute left-0 pointer-events-none" style={{ transform: `translateX(${input.length * 8.5 + 32}px)` }}>
                    |
                  </span>
                </div>
              </div>
              
              {/* LIVE COMMAND SUGGESTION */}
              {currentSuggestion && (
                <div className="text-[10px] text-zinc-500 ml-6 tracking-widest uppercase">
                  suggestion: <span className="text-cyan-500/50">{currentSuggestion}</span> (tab to complete)
                </div>
              )}
            </div>
            
          </div>
        )}

        {/* FOOTER */}
        <div className="px-5 py-2 bg-zinc-900/50 border-t border-white/5 flex justify-between items-center z-30">
          <div className="flex gap-4 items-center">
            <button onClick={() => { navigator.clipboard.writeText("jothishgandham2@gmail.com"); setCopied(true); setTimeout(()=>setCopied(false),1000)}} className="text-[9px] text-zinc-500 hover:text-white transition-colors uppercase tracking-widest flex items-center gap-1 cursor-pointer">
              <Copy size={10} /> {copied ? "Copied" : "Copy Email"}
            </button>
            <a href="https://github.com/jothish-blip" target="_blank" rel="noreferrer" className="text-[9px] text-zinc-500 hover:text-white transition-colors uppercase tracking-widest flex items-center gap-1 cursor-pointer">
              <SiGithub size={10} /> GitHub
            </a>
          </div>
          <span className="text-[9px] text-zinc-600 font-mono hidden sm:block italic">"Understanding how they break to build them better."</span>
        </div>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #3f3f46; border-radius: 10px; }
      `}</style>
    </section>
  );
}