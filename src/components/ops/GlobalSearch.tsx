'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, X, Users, MessageSquare, Activity, ShieldAlert, FileText, Loader2, Command } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

type SearchResult = {
  id: string;
  type: 'contact' | 'visitor' | 'event' | 'audit';
  title: string;
  subtitle: string;
  metadata: string;
  href: string;
  timestamp: string;
};

export default function GlobalSearch({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    const fetchResults = async () => {
      if (query.length < 2) {
        setResults([]);
        return;
      }
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        if (res.ok) {
          const data = await res.json();
          setResults(data.results || []);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchResults, 300);
    return () => clearTimeout(timer);
  }, [query]);

  const getIcon = (type: string) => {
    switch (type) {
      case 'contact': return <MessageSquare size={14} className="text-amber-500" />;
      case 'visitor': return <Users size={14} className="text-emerald-500" />;
      case 'event': return <Activity size={14} className="text-blue-500" />;
      case 'audit': return <ShieldAlert size={14} className="text-[#E4002B]" />;
      default: return <FileText size={14} className="text-muted" />;
    }
  };

  const handleSelect = (href: string) => {
    router.push(href);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.15 }}
            className="fixed top-[15%] left-1/2 -translate-x-1/2 w-full max-w-2xl bg-surface/50 backdrop-blur-md border border-surface-strong shadow-2xl rounded-sm z-50 overflow-hidden flex flex-col max-h-[70vh]"
          >
            <div className="flex items-center px-4 py-4 border-b border-surface-strong bg-background/50">
              <Search size={18} className="text-muted mr-3" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search visitors, sessions, events, contacts..."
                className="flex-1 bg-transparent border-none outline-none text-foreground font-mono text-sm placeholder:text-muted/50"
              />
              {loading && <Loader2 size={16} className="text-muted animate-spin mr-3" />}
              <button onClick={onClose} className="p-1 hover:bg-surface rounded-sm text-muted hover:text-foreground transition-colors">
                <X size={16} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-2 bg-background/30">
              {query.length < 2 ? (
                <div className="py-12 text-center flex flex-col items-center justify-center text-muted">
                   <Command size={32} className="opacity-20 mb-4" />
                   <p className="font-mono text-[10px] uppercase tracking-[0.2em]">Global SOC Search</p>
                   <p className="font-mono text-[9px] mt-2 opacity-50">Type at least 2 characters to search across all databases</p>
                </div>
              ) : results.length === 0 && !loading ? (
                <div className="py-12 text-center flex flex-col items-center justify-center text-muted">
                   <Search size={32} className="opacity-20 mb-4" />
                   <p className="font-mono text-[10px] uppercase tracking-[0.2em]">No results found</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {results.map((result) => (
                    <button
                      key={`${result.type}-${result.id}`}
                      onClick={() => handleSelect(result.href)}
                      className="w-full flex items-start gap-4 p-3 hover:bg-surface/50 rounded-sm transition-colors text-left group"
                    >
                      <div className="mt-1 p-2 bg-background border border-surface rounded-sm group-hover:border-surface-strong transition-colors">
                        {getIcon(result.type)}
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <div className="flex justify-between items-center mb-1">
                          <p className="text-sm font-semibold text-foreground truncate">{result.title}</p>
                          <span className="text-[9px] font-mono text-muted uppercase tracking-widest">{result.type}</span>
                        </div>
                        <p className="text-xs text-muted font-mono truncate">{result.subtitle}</p>
                        <p className="text-[10px] text-muted/70 mt-1 truncate">{result.metadata}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            <div className="bg-background/80 border-t border-surface-strong px-4 py-2 flex justify-between items-center text-[9px] font-mono text-muted uppercase tracking-widest">
               <div className="flex items-center gap-4">
                 <span><kbd className="border border-surface px-1.5 py-0.5 rounded-sm bg-surface/50 text-foreground mr-1">↑↓</kbd> Navigate</span>
                 <span><kbd className="border border-surface px-1.5 py-0.5 rounded-sm bg-surface/50 text-foreground mr-1">↵</kbd> Select</span>
                 <span><kbd className="border border-surface px-1.5 py-0.5 rounded-sm bg-surface/50 text-foreground mr-1">ESC</kbd> Close</span>
               </div>
               <span>{results.length} Results</span>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
