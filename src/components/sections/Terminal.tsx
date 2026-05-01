"use client";

import { useState, useEffect, useRef } from "react";
import { handleCommand, state, availableCommands, analytics } from "@/lib/terminal/commandHandler";
import { 
  Terminal as TerminalIcon, 
  Copy, 
  X, 
  Minus, 
  Maximize2 
} from "lucide-react";
import { SiGithub } from "react-icons/si";

type HistoryItem = { command: string; output: string; isRoot: boolean };
type TabData = { id: number; history: HistoryItem[]; isRoot: boolean };

export default function Terminal() {
  const [tabs, setTabs] = useState<TabData[]>([{ id: 1, history: [], isRoot: false }]);
  const [activeTab, setActiveTab] = useState(0);
  
  const [input, setInput] = useState("");
  const [isMaximized, setIsMaximized] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isClosed, setIsClosed] = useState(true);
  const [copied, setCopied] = useState(false);
  const [historyIndex, setHistoryIndex] = useState(-1);
  
  const [isBooting, setIsBooting] = useState(false);

  const terminalRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio("/typing.mp3");
    if (audioRef.current) audioRef.current.volume = 0.15;
  }, []);

  const setHistory = (updater: HistoryItem[] | ((prev: HistoryItem[]) => HistoryItem[])) => {
    setTabs(prev => prev.map((t, i) => {
      if (i === activeTab) {
        return { ...t, history: typeof updater === 'function' ? updater(t.history) : updater };
      }
      return t;
    }));
  };

  const setIsRoot = (isRoot: boolean) => {
    setTabs(prev => prev.map((t, i) => i === activeTab ? { ...t, isRoot } : t));
  };

  const activeHistory = tabs[activeTab].history;
  const isRoot = tabs[activeTab].isRoot;

  useEffect(() => {
    if (!isClosed && !isMinimized && !isBooting) {
      terminalRef.current?.scrollTo({ top: terminalRef.current.scrollHeight, behavior: "auto" });
      inputRef.current?.focus();
    }
  }, [activeHistory, isClosed, isMinimized, isMaximized, input, isBooting, activeTab]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      const isFull = !!document.fullscreenElement;
      setIsMaximized(isFull);
      if (isFull) {
        document.documentElement.style.overflow = "hidden";
      } else {
        document.documentElement.style.overflow = "";
      }
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.documentElement.style.overflow = ""; 
    };
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      wrapperRef.current?.requestFullscreen().catch(err => console.error(err));
    } else {
      document.exitFullscreen();
    }
  };

  const initTerminal = () => {
    setIsClosed(false);
    
    if (tabs[0].history.length > 0) return;
    
    setIsBooting(true);
    setTimeout(() => {
      const bootLines = [
        "Booting Kali Linux...",
        "[ OK ] Starting Network Manager",
        "[ OK ] Loading Kernel Modules",
        "[ OK ] Initializing System",
        "Welcome to Kali Linux",
      ];

      let output = "";
      bootLines.forEach((line, i) => {
        setTimeout(() => {
          output += line + "\n";
          setHistory([{ command: "", output, isRoot: false }]);

          if (i === bootLines.length - 1) {
            setTimeout(() => {
              setHistory([{ command: "system --init", output: "Welcome, Jothish Gandham.\nType \"help\" to see available commands.", isRoot: false }]);
              setIsBooting(false);
            }, 600);
          }
        }, i * 400);
      });
    }, 300);
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
    
    setHistory((prev) => [...prev, { command: currentInput, output: "processing...", isRoot }]);
    
    const result = handleCommand(currentInput);
    setIsRoot(state.isRoot);

    if (result === "__CLEAR__") { setHistory([]); return; }
    if (result === "__EXIT__") { setIsClosed(true); return; }
    
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

  const suggestions = input 
    ? availableCommands.filter(c => c.startsWith(input.toLowerCase()) && c !== input.toLowerCase()).slice(0, 3) 
    : [];

  return (
    <>
      {/* 🔴 FIXED: Moved styles OUT of the conditional render so variables are always loaded */}
      <style jsx global>{`
        :root {
          /* Light Mode Defaults */
          --bg-terminal: #ffffff;
          --text-primary: #111111;
          --text-dim: #6b7280;
          
          --red-main: #dc2626;
          --red-hover: #b91c1c;
          --red-soft: rgba(220, 38, 38, 0.08);
          
          --green-root: #059669;
          --warning: #d97706;
          --border-terminal: #e5e7eb;
        }
        
        html.dark {
          /* Dark Mode Defaults */
          --bg-terminal: #0a0a0a;
          --text-primary: #e5e5e5;
          --text-dim: #6b7280;
          
          --red-main: #ff4d4d;
          --red-hover: #ff1f1f;
          --red-soft: rgba(255, 77, 77, 0.08);
          
          --green-root: #00ff9c;
          --warning: #f59e0b;
          --border-terminal: #1f1f1f;
        }
        
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: var(--border-terminal); }
        
        input, textarea {
          outline: none !important;
          box-shadow: none !important;
          border: none !important;
        }
      `}</style>

      {isClosed ? (
        <section className="relative w-full bg-background border-t border-surface flex flex-col items-center justify-center py-32 z-30">
          <button 
            onClick={initTerminal} 
            className="group flex items-center gap-4 px-8 py-4 border border-[var(--red-main)] text-[var(--red-main)] font-mono text-sm tracking-[0.2em] uppercase bg-transparent hover:bg-[var(--red-soft)] hover:border-[var(--red-hover)] hover:shadow-[0_0_15px_var(--red-soft)] active:scale-[0.97] transition-all duration-300 rounded-sm"
          >
            <span className="font-black text-lg leading-none">{`>_`}</span>
            Initialize Terminal
          </button>
        </section>
      ) : (
        <section className="relative w-full bg-background border-t border-surface flex flex-col items-center py-20 px-3 sm:px-6 z-30">
          <div 
            ref={wrapperRef}
            onClick={() => { if (!isBooting) inputRef.current?.focus() }}
            className={`border border-[var(--border-terminal)] flex flex-col relative overflow-x-hidden bg-[var(--bg-terminal)] shadow-xl rounded-sm
            ${isMaximized 
              ? 'w-full h-[100dvh] rounded-none border-none' 
              : 'w-full max-w-4xl h-[calc(100dvh-80px)] sm:h-[500px]'}
            ${isMinimized ? 'h-12 opacity-50 overflow-hidden' : ''}`}
          >

            {/* HEADER */}
            <div className="relative flex flex-col bg-[var(--bg-terminal)] border-b border-[var(--border-terminal)] z-30">
              <div className="flex items-center px-4 py-2.5">
                <div className="flex items-center gap-2 z-20">
                  <button onClick={() => setIsClosed(true)} className="w-3 h-3 rounded-full bg-[var(--red-main)] flex items-center justify-center opacity-80 hover:opacity-100">
                    <X size={8} className="text-white opacity-0 hover:opacity-100 transition-opacity" />
                  </button>
                  <button onClick={() => setIsMinimized(!isMinimized)} className="w-3 h-3 rounded-full bg-[var(--warning)] flex items-center justify-center opacity-80 hover:opacity-100">
                    <Minus size={8} className="text-white opacity-0 hover:opacity-100 transition-opacity" />
                  </button>
                  <button onClick={toggleFullscreen} className="w-3 h-3 rounded-full bg-[var(--green-root)] flex items-center justify-center opacity-80 hover:opacity-100">
                    <Maximize2 size={8} className="text-white opacity-0 hover:opacity-100 transition-opacity" />
                  </button>
                </div>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <span className="text-[10px] font-mono text-[var(--text-dim)] tracking-wider">
                    kali@terminal
                  </span>
                </div>
              </div>

              <div className="flex gap-2 px-3 py-1 bg-[var(--bg-terminal)] border-t border-[var(--border-terminal)] overflow-x-auto custom-scrollbar">
                {tabs.map((t, i) => (
                  <button
                    key={t.id}
                    onClick={() => {
                      setActiveTab(i);
                      setHistoryIndex(-1);
                      setInput("");
                    }}
                    className={`px-3 py-1 text-[10px] font-mono whitespace-nowrap transition-colors ${
                      activeTab === i
                        ? "text-[var(--red-main)] border-b border-[var(--red-main)]"
                        : "text-[var(--text-dim)] hover:text-[var(--text-primary)]"
                    }`}
                  >
                    tab {t.id}
                  </button>
                ))}
                <button
                  onClick={() => setTabs([...tabs, { id: tabs.length + 1, history: [], isRoot: false }])}
                  className="text-[var(--text-dim)] hover:text-[var(--text-primary)] px-2 font-mono"
                >
                  +
                </button>
              </div>
            </div>

            {/* INTELLIGENCE PANEL */}
            {!isMinimized && !isBooting && (
              <div className="absolute top-20 right-4 text-[10px] font-mono text-[var(--text-dim)] space-y-1 z-30 text-right pointer-events-none hidden sm:block">
                <div>cmds: {analytics.totalCommands}</div>
                <div>last: {analytics.lastCommand || "none"}</div>
              </div>
            )}

            {/* TERMINAL CONTENT */}
            {!isMinimized && (
              <div ref={terminalRef} className="flex-1 overflow-y-auto p-4 sm:p-6 font-mono text-[13px] sm:text-[14px] custom-scrollbar z-20">
                
                {activeHistory.map((item, i) => {
                  const isError = item.output.includes("Unknown command") || item.output.includes("usage:");
                  
                  const outputColor = item.output === "processing..." 
                    ? "text-[var(--text-dim)] animate-pulse" 
                    : isError 
                      ? "text-[var(--red-main)]" 
                      : "text-[var(--text-primary)]";
                  
                  return (
                    <div key={i} className="mb-6">
                      {item.command && (
                        <div className="text-[13px] font-mono leading-tight mb-1">
                          <div className="flex gap-1">
                            <span className="text-[var(--text-dim)]">┌──(</span>
                            <span className={item.isRoot ? "text-[var(--green-root)]" : "text-[var(--red-main)]"}>
                              {item.isRoot ? "root" : "jothish"}
                            </span>
                            <span className="text-[var(--text-dim)]">㉿kali)-[~]</span>
                          </div>
                          <div className="flex gap-2">
                            <span className="text-[var(--text-dim)]">└─{item.isRoot ? "#" : "$"}</span>
                            <span className="text-[var(--text-primary)]">{item.command}</span>
                          </div>
                        </div>
                      )}

                      <pre className={`mt-1 ml-4 font-medium whitespace-pre-wrap leading-relaxed ${outputColor}`}>
                        {item.output}
                      </pre>
                    </div>
                  );
                })}

                {/* STICKY INPUT WRAPPER */}
                {!isBooting && (
                  <div className="sticky bottom-0 bg-[var(--bg-terminal)] pt-2 pb-4 flex flex-col z-30">
                    <div className="text-[13px] font-mono leading-tight">
                      <div className="flex gap-1">
                        <span className="text-[var(--text-dim)]">┌──(</span>
                        <span className={isRoot ? "text-[var(--green-root)]" : "text-[var(--red-main)]"}>
                          {isRoot ? "root" : "jothish"}
                        </span>
                        <span className="text-[var(--text-dim)]">㉿kali)-[~]</span>
                      </div>
                      
                      <div className="flex gap-2 items-center relative">
                        <span className="text-[var(--text-dim)]">└─{isRoot ? "#" : "$"}</span>
                        
                        <div className="flex items-center flex-1 bg-transparent relative">
                          <input 
                            ref={inputRef} 
                            value={input} 
                            onChange={(e) => {
                              setInput(e.target.value);
                              if (audioRef.current) {
                                audioRef.current.currentTime = 0;
                                audioRef.current.play().catch(() => {});
                              }
                            }} 
                            onKeyDown={handleKeyDown} 
                            onBlur={(e) => {
                              const target = e.target;
                              setTimeout(() => target.focus(), 10);
                            }}
                            autoFocus
                            className="bg-transparent flex-1 text-[var(--text-primary)] text-[13px] sm:text-[14px] py-1 px-1 border-none outline-none focus:outline-none focus:ring-0 focus:border-none appearance-none z-10" 
                            style={{ caretColor: 'transparent' }}
                            autoComplete="off" 
                            spellCheck={false} 
                          />
                          
                          <span 
                            className="absolute inline-block w-[8px] h-[16px] bg-[var(--red-main)] animate-pulse z-0 pointer-events-none"
                            style={{ left: `calc(${input.length}ch + 4px)` }}
                          ></span>
                        </div>
                      </div>
                    </div>
                    
                    {/* LIVE COMMAND SUGGESTION */}
                    {suggestions.length > 0 && (
                      <div className="mt-2 ml-4 space-y-1">
                        {suggestions.map((s, i) => (
                          <div key={i} className="text-[10px] text-[var(--text-dim)] tracking-widest uppercase">
                            → <span className="text-[var(--red-main)] opacity-70">{s}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
                
              </div>
            )}

            {/* FOOTER */}
            <div className="px-5 py-2 bg-[var(--bg-terminal)] border-t border-[var(--border-terminal)] flex justify-between items-center z-30">
              <div className="flex gap-4 items-center">
                <button onClick={() => { navigator.clipboard.writeText("jothishgandham2@gmail.com"); setCopied(true); setTimeout(()=>setCopied(false),1000)}} className="text-[9px] text-[var(--text-dim)] hover:text-[var(--text-primary)] transition-colors uppercase tracking-widest flex items-center gap-1 cursor-pointer">
                  <Copy size={10} /> {copied ? "Copied" : "Copy Email"}
                </button>
                <a href="https://github.com/jothish-blip" target="_blank" rel="noreferrer" className="text-[9px] text-[var(--text-dim)] hover:text-[var(--text-primary)] transition-colors uppercase tracking-widest flex items-center gap-1 cursor-pointer">
                  <SiGithub size={10} /> GitHub
                </a>
              </div>
              <span className="text-[9px] text-[var(--text-dim)] font-mono hidden sm:block italic">Understanding systems to build them better.</span>
            </div>
          </div>
        </section>
      )}
    </>
  );
}