"use client";

import { useEffect, useRef, useState } from "react";
import { handleCommand, state, availableCommands, analytics } from "@/lib/terminal/commandHandler";
import { Copy, X, Minus, Maximize2 } from "lucide-react";
import { SiGithub } from "react-icons/si";
import { useRouter } from "next/navigation";
import { trackEvent, TELEMETRY_EVENTS } from "@/lib/telemetry/events";

type HistoryItem = { command: string; output: string; isRoot: boolean };
type TabData = { id: number; history: HistoryItem[]; isRoot: boolean };

const customScrollbar = "[&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-sm [&::-webkit-scrollbar-thumb]:bg-surface-strong [&::-webkit-scrollbar-track]:bg-transparent hover:[&::-webkit-scrollbar-thumb]:bg-muted/50";

export default function Terminal() {
  const [tabs, setTabs] = useState<TabData[]>([{ id: 1, history: [], isRoot: false }]);
  const [activeTab, setActiveTab] = useState(0);
  const router = useRouter();
  
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
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio("/typing.mp3");
    if (audioRef.current) audioRef.current.volume = 0.15;
    
    const timeouts = timeoutsRef.current;
    return () => {
      // Cleanup timeouts on unmount
      timeouts.forEach(clearTimeout);
    };
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
    const bootTimeout = setTimeout(() => {
      const bootLines = [
        "Booting Jothish Terminal...",
        "[ OK ] Starting Network Interface",
        "[ OK ] Loading Security Modules",
        "[ OK ] Initializing Portfolio System",
        "Welcome to Jothish Terminal",
      ];

      let output = "";
      bootLines.forEach((line, i) => {
        const lineTimeout = setTimeout(() => {
          output += line + "\n";
          setHistory([{ command: "", output, isRoot: false }]);

          if (i === bootLines.length - 1) {
            const finalTimeout = setTimeout(() => {
              setHistory([{ command: "banner", output: "JOTHISH TERMINAL\nCybersecurity Portfolio Interface\nVersion 1.0.0\nStatus: Active\n\nType \"help\" to begin.", isRoot: false }]);
              setIsBooting(false);
            }, 600);
            timeoutsRef.current.push(finalTimeout);
          }
        }, i * 400);
        timeoutsRef.current.push(lineTimeout);
      });
    }, 300);
    timeoutsRef.current.push(bootTimeout);
  };

  useEffect(() => {
    const checkHash = () => {
      if (window.location.hash === "#terminal") {
        initTerminal();
        // Delay focus slightly to allow UI transition
        setTimeout(() => inputRef.current?.focus(), 50);
      }
    };
    
    checkHash();
    window.addEventListener("hashchange", checkHash);
    return () => window.removeEventListener("hashchange", checkHash);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabs]);

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
    
    const startTime = Date.now();
    const result = handleCommand(currentInput);
    const duration = Date.now() - startTime;
    
    // Determine success/failure based on result
    let success = true;
    let outputPreview = "";
    if (result === "__CLEAR__") outputPreview = "clear";
    else if (result === "__EXIT__") outputPreview = "exit";
    else if (typeof result === "string") {
      outputPreview = result.substring(0, 50);
      if (result.includes("Unknown command") || result.includes("usage:") || result.includes("Permission denied")) {
        success = false;
      }
    } else {
      outputPreview = "multiline output";
    }

    trackEvent({
      type: TELEMETRY_EVENTS.TERMINAL_COMMAND,
      metadata: { 
        command: currentInput.split(' ')[0], 
        raw: currentInput,
        success: success,
        duration_ms: duration,
        result: outputPreview
      }
    });
    
    setIsRoot(state.isRoot);

    if (result === "__CLEAR__") { setHistory([]); return; }
    if (result === "__EXIT__") { setIsClosed(true); return; }
    
    if (result === "__OPEN_PROJECTS__") {
      setHistory(prev => {
        const newArr = [...prev];
        newArr[newArr.length - 1].output = "Opening projects directory...";
        return newArr;
      });
      window.location.href = "#projects";
      return;
    }

    if (result === "__OPEN_RESUME__") {
      setHistory(prev => {
        const newArr = [...prev];
        newArr[newArr.length - 1].output = "Opening Resume...";
        return newArr;
      });
      router.push("/Resume?from=terminal");
      return;
    }

    if (result === "__OPEN_OPS__") {
      setHistory(prev => {
        const newArr = [...prev];
        newArr[newArr.length - 1].output = "Initializing Secure Connection...";
        return newArr;
      });
      router.push("/ops");
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
    <section id="terminal" className="border-t border-surface pt-14 pb-24 max-w-6xl mx-auto flex flex-col gap-12 px-6 md:px-8 relative min-h-[80vh]">
      
      {/* 
        LOCAL STYLES: 
        Maps the dynamic Navbar variable (--accent-terminal) into clean classes 
        without polluting the global scope.
      */}
      <style>{`
        .term-accent-text { color: var(--accent-terminal); }
        .term-accent-bg { background-color: var(--accent-terminal); }
        .term-accent-border { border-color: var(--accent-terminal); }
        .term-glow { box-shadow: 0 0 15px color-mix(in srgb, var(--accent-terminal) 30%, transparent); }
        
        input, textarea {
          outline: none !important;
          box-shadow: none !important;
          border: none !important;
        }
      `}</style>

      {/* Header with Radiolucent / X-Ray Effect matching --accent-terminal */}
      <header className="relative mx-auto w-full max-w-4xl text-center space-y-5 py-8 flex flex-col items-center">
        
        {/* Radiolucent Glow / X-Ray Effect Background */}
        <div className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center overflow-hidden">
          <div 
            className="w-[300px] h-[150px] md:w-[600px] md:h-[200px] blur-[80px] rounded-[100%] opacity-30 mix-blend-screen"
            style={{ backgroundColor: 'var(--accent-terminal)' }}
          ></div>
          <div className="absolute inset-0 opacity-[0.02] bg-[radial-gradient(circle,currentColor_1px,transparent_1px)] bg-[size:12px_12px]"></div>
        </div>

        <div className="relative z-10 space-y-4 flex flex-col items-center">
          <p 
            className="font-mono text-[9px] tracking-[0.4em] uppercase"
            style={{ color: 'var(--accent-terminal)' }}
          >
            {"// Workstation"}
          </p>

          <h2 className="text-3xl md:text-5xl font-semibold tracking-tight leading-[1.1] text-foreground uppercase">
            Command Line <span className="text-muted italic font-light">Interface</span>
          </h2>

          <div className="flex items-center gap-3 pt-2">
            <p 
              className="text-[9px] font-mono font-medium px-3 py-1.5 rounded-sm inline-block uppercase tracking-[0.24em] backdrop-blur-md"
              style={{ 
                color: 'var(--accent-terminal)',
                backgroundColor: 'color-mix(in srgb, var(--accent-terminal) 10%, transparent)',
                border: '1px solid color-mix(in srgb, var(--accent-terminal) 20%, transparent)'
              }}
            >
              Interactive Portfolio Mode
            </p>
          </div>

          <div 
            className="w-12 h-[1px] my-2 opacity-50" 
            style={{ backgroundColor: 'var(--accent-terminal)' }}
          />

          <p className="mx-auto max-w-2xl text-[13px] md:text-[14px] leading-relaxed text-muted">
            For those who prefer the keyboard. Access projects, contact information, and hidden tools directly through the built-in terminal emulator.
          </p>
        </div>
      </header>

      {/* TERMINAL UI */}
      <div className="relative z-10 w-full flex flex-col items-center">
        {isClosed ? (
          <div className="py-16">
            <button 
              onClick={initTerminal} 
              className="group flex items-center gap-3 px-6 py-3.5 border text-foreground font-mono text-[9px] tracking-[0.24em] uppercase bg-surface/20 hover:bg-surface active:scale-[0.98] transition-all duration-300 rounded-sm term-accent-border hover:term-glow"
            >
              <span className="font-bold term-accent-text">{`>_`}</span>
              Initialize Terminal
            </button>
          </div>
        ) : (
          <div 
            ref={wrapperRef}
            onClick={() => { if (!isBooting) inputRef.current?.focus() }}
            className={`border border-surface flex flex-col relative overflow-x-hidden bg-background/95 backdrop-blur-md shadow-2xl rounded-md transition-all duration-300
            ${isMaximized 
              ? 'fixed inset-0 z-[200] w-full h-[100dvh] rounded-none border-none' 
              : 'w-full max-w-4xl h-[calc(100dvh-120px)] sm:h-[550px]'}
            ${isMinimized ? 'h-12 opacity-80 overflow-hidden hover:opacity-100 cursor-pointer' : ''}`}
          >
            {/* TERMINAL WINDOW HEADER */}
            <div className="relative flex flex-col bg-surface/30 border-b border-surface z-30 shrink-0">
              <div className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-2 z-20">
                  <button onClick={(e) => { e.stopPropagation(); setIsClosed(true); }} className="w-3 h-3 rounded-full bg-red-500/80 flex items-center justify-center hover:bg-red-500 transition-colors">
                    <X size={8} className="text-white opacity-0 hover:opacity-100 transition-opacity" />
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); setIsMinimized(!isMinimized); }} className="w-3 h-3 rounded-full bg-amber-500/80 flex items-center justify-center hover:bg-amber-500 transition-colors">
                    <Minus size={8} className="text-white opacity-0 hover:opacity-100 transition-opacity" />
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); toggleFullscreen(); }} className="w-3 h-3 rounded-full bg-emerald-500/80 flex items-center justify-center hover:bg-emerald-500 transition-colors">
                    <Maximize2 size={8} className="text-white opacity-0 hover:opacity-100 transition-opacity" />
                  </button>
                </div>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <span className="text-[10px] font-mono text-muted uppercase tracking-[0.24em]">
                    Terminal — bash
                  </span>
                </div>
              </div>

              {/* TABS */}
              <div className={`flex gap-1 px-2 pt-1 bg-background/50 border-t border-surface overflow-x-auto ${customScrollbar}`}>
                {tabs.map((t, i) => (
                  <button
                    key={t.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveTab(i);
                      setHistoryIndex(-1);
                      setInput("");
                    }}
                    className={`px-4 py-1.5 text-[9px] font-mono uppercase tracking-widest whitespace-nowrap transition-colors rounded-t-sm border border-transparent ${
                      activeTab === i
                        ? "bg-surface/50 border-surface border-b-transparent text-foreground"
                        : "text-muted hover:bg-surface/30 hover:text-foreground"
                    }`}
                  >
                    Tab {t.id}
                  </button>
                ))}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setTabs([...tabs, { id: tabs.length + 1, history: [], isRoot: false }]);
                  }}
                  className="text-muted hover:text-foreground px-3 py-1.5 font-mono text-[12px] transition-colors"
                  aria-label="New Tab"
                >
                  +
                </button>
              </div>
            </div>

            {/* INTELLIGENCE PANEL (Desktop only) */}
            {!isMinimized && !isBooting && (
              <div className="absolute top-24 right-6 text-[9px] font-mono text-muted/50 uppercase tracking-[0.2em] space-y-1 z-30 text-right pointer-events-none hidden sm:block">
                <div>cmds_run: {analytics.totalCommands}</div>
                <div>last_cmd: {analytics.lastCommand || "none"}</div>
              </div>
            )}

            {/* TERMINAL BODY */}
            {!isMinimized && (
              <div ref={terminalRef} className={`flex-1 overflow-y-auto p-5 sm:p-6 font-mono text-[13px] sm:text-[14px] z-20 bg-background/40 ${customScrollbar}`}>
                
                {activeHistory.map((item, i) => {
                  const isError = item.output.includes("Unknown command") || item.output.includes("usage:");
                  
                  const outputColor = item.output === "processing..." 
                    ? "text-muted animate-pulse" 
                    : isError 
                      ? "text-red-500" 
                      : "text-foreground/80";
                  
                  return (
                    <div key={i} className="mb-6">
                      {item.command && (
                        <div className="text-[13px] font-mono leading-tight mb-2">
                          <div className="flex gap-2">
                            <span className={item.isRoot ? "bg-red-500/20 text-red-500 font-bold px-1 rounded-sm" : "term-accent-text font-bold"}>
                              {item.isRoot ? "root@jothish" : "guest@jothish"}
                            </span>
                            <span className="text-muted">~{item.isRoot ? "#" : "$"}</span>
                            <span className="text-foreground ml-1">{item.command}</span>
                          </div>
                        </div>
                      )}

                      <pre className={`mt-1 font-mono whitespace-pre-wrap leading-relaxed ${outputColor}`}>
                        {item.output}
                      </pre>
                    </div>
                  );
                })}

                {/* STICKY INPUT LINE */}
                {!isBooting && (
                  <div className="sticky bottom-0 bg-background/90 backdrop-blur-md pt-2 pb-4 flex flex-col z-30">
                    <div className="text-[13px] font-mono leading-tight">
                      <div className="flex gap-2 items-center relative">
                        <span className={isRoot ? "bg-red-500/20 text-red-500 font-bold px-1 rounded-sm" : "term-accent-text font-bold"}>
                          {isRoot ? "root@jothish" : "guest@jothish"}
                        </span>
                        <span className="text-muted">~{isRoot ? "#" : "$"}</span>
                        
                        <div className="flex items-center flex-1 bg-transparent relative ml-1">
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
                            className="bg-transparent flex-1 text-foreground font-mono text-[13px] sm:text-[14px] py-1 px-1 border-none outline-none focus:outline-none focus:ring-0 focus:border-none appearance-none z-10" 
                            style={{ caretColor: 'transparent' }}
                            autoComplete="off" 
                            spellCheck={false} 
                          />
                          
                          {/* Blinking Cursor */}
                          <span 
                            className="absolute inline-block w-[8px] h-[15px] term-accent-bg animate-pulse z-0 pointer-events-none"
                            style={{ left: `calc(${input.length}ch + 4px)` }}
                          ></span>
                        </div>
                      </div>
                    </div>
                    
                    {/* LIVE COMMAND SUGGESTIONS */}
                    {suggestions.length > 0 && (
                      <div className="mt-3 ml-4 space-y-1">
                        {suggestions.map((s, i) => (
                          <div key={i} className="text-[10px] font-mono text-muted tracking-[0.24em] uppercase">
                            → <span className="term-accent-text opacity-80">{s}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* TERMINAL FOOTER */}
            <div className="px-5 py-3 bg-surface/30 border-t border-surface flex justify-between items-center z-30 shrink-0">
              <div className="flex gap-5 items-center">
                <button 
                  onClick={(e) => { e.stopPropagation(); navigator.clipboard.writeText("jothishgandham2@gmail.com"); setCopied(true); setTimeout(()=>setCopied(false),1500)}} 
                  className="text-[9px] font-mono text-muted hover:text-foreground transition-colors uppercase tracking-[0.24em] flex items-center gap-1.5 cursor-pointer"
                >
                  <Copy size={10} /> {copied ? "Copied" : "Copy Email"}
                </button>
                <a 
                  href="https://github.com/jothish-blip" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="text-[9px] font-mono text-muted hover:text-foreground transition-colors uppercase tracking-[0.24em] flex items-center gap-1.5 cursor-pointer"
                >
                  <SiGithub size={10} /> GitHub
                </a>
              </div>
              <span className="text-[9px] text-muted/50 font-mono tracking-[0.24em] uppercase hidden sm:block">
                Type &apos;help&apos; to start
              </span>
            </div>
            
          </div>
        )}
      </div>
    </section>
  );
}