'use client';

import { Server, Database, Shield, Cpu, Activity, Clock, Layers, Lock, HardDrive, Wifi } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

type Props = {
  dbStatus: string;
  dbLatency: number;
  apiStatus: string;
  authStatus: string;
  storageStatus: string;
  telemetryStatus: string;
  nodeEnv: string;
  nextVersion: string;
  reactVersion: string;
  initialMemoryUsage?: number;
  initialCpuUsage?: number;
};

export default function SystemClient({ 
  dbStatus, 
  dbLatency, 
  apiStatus, 
  authStatus,
  storageStatus,
  telemetryStatus,
  nodeEnv, 
  nextVersion, 
  reactVersion,
  initialMemoryUsage = 48,
  initialCpuUsage = 24
}: Props) {
  // Simulate active chart data fluttering around the real node values
  const [cpuUsage, setCpuUsage] = useState(initialCpuUsage);
  const [memoryUsage, setMemoryUsage] = useState(initialMemoryUsage);

  useEffect(() => {
    const interval = setInterval(() => {
      setCpuUsage(prev => Math.min(100, Math.max(0, initialCpuUsage + (Math.random() * 4 - 2))));
      setMemoryUsage(prev => Math.min(100, Math.max(0, initialMemoryUsage + (Math.random() * 2 - 1))));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => 
    status === 'Healthy' || status === 'Operational' ? 'border-green-500/30 text-green-500 bg-green-500/10' : 'border-[#E4002B]/30 text-[#E4002B] bg-[#E4002B]/10';

  const getStatusBarColor = (status: string) => 
    status === 'Healthy' || status === 'Operational' ? 'bg-green-500' : 'bg-[#E4002B]';

  return (
    <div className="space-y-8">
      <header className="mb-10 border-b border-surface pb-6 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight uppercase text-foreground">
            System Health
          </h1>
          <p className="text-muted text-sm font-mono mt-2 tracking-widest uppercase">
            Infrastructure Diagnostics
          </p>
        </div>
        <div className="text-right hidden sm:block">
           <p className="text-xs font-mono text-muted uppercase tracking-widest mb-2">Overall Status</p>
           <span className="text-green-500 font-mono text-xs uppercase tracking-widest px-3 py-1 border border-green-500/30 bg-green-500/10 rounded-sm">Operational</span>
        </div>
      </header>

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
         {/* Database */}
         <div className="bg-surface/5 border border-surface p-4 rounded-sm flex flex-col items-center justify-center text-center gap-3">
           <Database className={dbStatus === 'Healthy' ? 'text-green-500' : 'text-[#E4002B]'} size={24} />
           <p className="font-mono text-[9px] uppercase tracking-widest text-muted">Database</p>
           <span className={`font-mono text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-sm border ${getStatusColor(dbStatus)}`}>{dbStatus}</span>
         </div>
         {/* API */}
         <div className="bg-surface/5 border border-surface p-4 rounded-sm flex flex-col items-center justify-center text-center gap-3">
           <Server className={apiStatus === 'Healthy' ? 'text-green-500' : 'text-[#E4002B]'} size={24} />
           <p className="font-mono text-[9px] uppercase tracking-widest text-muted">API</p>
           <span className={`font-mono text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-sm border ${getStatusColor(apiStatus)}`}>{apiStatus}</span>
         </div>
         {/* Authentication */}
         <div className="bg-surface/5 border border-surface p-4 rounded-sm flex flex-col items-center justify-center text-center gap-3">
           <Lock className={authStatus === 'Healthy' ? 'text-green-500' : 'text-[#E4002B]'} size={24} />
           <p className="font-mono text-[9px] uppercase tracking-widest text-muted">Authentication</p>
           <span className={`font-mono text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-sm border ${getStatusColor(authStatus)}`}>{authStatus}</span>
         </div>
         {/* Telemetry */}
         <div className="bg-surface/5 border border-surface p-4 rounded-sm flex flex-col items-center justify-center text-center gap-3">
           <Activity className={telemetryStatus === 'Healthy' ? 'text-green-500' : 'text-[#E4002B]'} size={24} />
           <p className="font-mono text-[9px] uppercase tracking-widest text-muted">Telemetry</p>
           <span className={`font-mono text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-sm border ${getStatusColor(telemetryStatus)}`}>{telemetryStatus}</span>
         </div>
         {/* Storage */}
         <div className="bg-surface/5 border border-surface p-4 rounded-sm flex flex-col items-center justify-center text-center gap-3">
           <HardDrive className={storageStatus === 'Healthy' ? 'text-green-500' : 'text-[#E4002B]'} size={24} />
           <p className="font-mono text-[9px] uppercase tracking-widest text-muted">Storage</p>
           <span className={`font-mono text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-sm border ${getStatusColor(storageStatus)}`}>{storageStatus}</span>
         </div>
         {/* Latency */}
         <div className="bg-surface/5 border border-surface p-4 rounded-sm flex flex-col items-center justify-center text-center gap-3">
           <Wifi className={dbLatency < 100 ? 'text-green-500' : 'text-amber-500'} size={24} />
           <p className="font-mono text-[9px] uppercase tracking-widest text-muted">Latency</p>
           <span className={`font-mono text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-sm border ${dbLatency < 100 ? 'border-green-500/30 text-green-500 bg-green-500/10' : 'border-amber-500/30 text-amber-500 bg-amber-500/10'}`}>
             {dbLatency.toFixed(0)} ms
           </span>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        
        {/* Server Status Details */}
        <div className="bg-surface/10 border border-surface p-6 rounded-sm relative group overflow-hidden">
          <div className={`absolute top-0 left-0 w-1 h-full ${getStatusBarColor(apiStatus)}`}></div>
          <div className="flex justify-between items-start mb-6">
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted flex items-center gap-2">
              <Cpu size={14} /> Compute Resources
            </span>
          </div>
          <div className="space-y-2 font-mono text-xs text-muted">
            <div className="flex justify-between">
              <span>Environment:</span>
              <span className="text-foreground">{nodeEnv}</span>
            </div>
            <div className="flex justify-between">
              <span>Memory Usage:</span>
              <span className="text-foreground">{memoryUsage.toFixed(1)}%</span>
            </div>
            <div className="flex justify-between">
              <span>CPU Load:</span>
              <span className="text-foreground">{cpuUsage.toFixed(1)}%</span>
            </div>
          </div>
        </div>

        {/* Framework & Build Details */}
        <div className="bg-surface/10 border border-surface p-6 rounded-sm relative group overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
          <div className="flex justify-between items-start mb-6">
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted flex items-center gap-2">
              <Layers size={14} className="text-blue-500" /> Build Info
            </span>
          </div>
          <div className="space-y-2 font-mono text-xs text-muted">
            <div className="flex justify-between">
              <span>Next.js Version:</span>
              <span className="text-foreground">{nextVersion}</span>
            </div>
            <div className="flex justify-between">
              <span>React Version:</span>
              <span className="text-foreground">{reactVersion}</span>
            </div>
            <div className="flex justify-between">
              <span>Deployment Region:</span>
              <span className="text-foreground">Global Edge</span>
            </div>
          </div>
        </div>

      </div>

      <div className="mt-12 bg-surface/5 border border-surface p-6 rounded-sm">
        <h3 className="text-sm font-mono tracking-widest uppercase text-muted mb-6 flex items-center gap-2">
          <Activity size={14} /> Telemetry Flow Rate
        </h3>
        <div className="h-48 flex items-end gap-1 overflow-hidden">
           {/* Simulate a live histogram */}
           {[...Array(60)].map((_, i) => (
             <motion.div 
               key={i}
               initial={{ height: `${(i * 7) % 40 + 10}%` }}
               animate={{ height: `${(i * 11) % 60 + 20}%` }}
               transition={{ repeat: Infinity, duration: 2 + (i % 3), repeatType: "reverse" }}
               className="flex-1 bg-surface-strong hover:bg-muted transition-colors rounded-t-sm"
             />
           ))}
        </div>
        <div className="mt-4 flex justify-between text-[10px] font-mono text-muted uppercase tracking-widest border-t border-surface pt-4">
           <span>- 60 Min</span>
           <span>Live</span>
        </div>
      </div>
    </div>
  );
}
