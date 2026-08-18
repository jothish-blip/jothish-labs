'use client';

import { ShieldAlert, ShieldCheck, AlertTriangle, Lock, Unlock, Database, Activity, MapPin, Globe, Monitor, Clock, ShieldBan, Crosshair } from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';
import { motion } from 'framer-motion';

type AuditLog = {
  id: string;
  action: string;
  actor: string;
  target?: string;
  ip_address?: string;
  created_at: string;
};

type SuspiciousActor = {
  visitorId: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  rulesBroken: string[];
  eventCount: number;
  lastSeen: string;
};

type FailedLoginChain = {
  ip: string;
  country: string;
  browser: string;
  device: string;
  attempts: number;
  lastAttempt: string;
};

type Props = {
  logs: AuditLog[];
  failedLogins: number;
  successfulLogins: number;
  blockedIPs: number;
  rlsEnabled: boolean;
  failedLoginChains: FailedLoginChain[];
  suspiciousActors: SuspiciousActor[];
};

export default function SecurityClient({ 
  logs, 
  failedLogins, 
  successfulLogins, 
  blockedIPs, 
  rlsEnabled,
  failedLoginChains,
  suspiciousActors
}: Props) {
  
  const threatLevel = failedLogins > 10 || suspiciousActors.some(a => a.severity === 'Critical') ? 'CRITICAL' 
                    : failedLogins > 0 || suspiciousActors.length > 0 ? 'ELEVATED' : 'NOMINAL';
                    
  const threatColor = threatLevel === 'CRITICAL' ? 'text-[#E4002B] bg-[#E4002B]/10 border-[#E4002B]/30' : 
                      threatLevel === 'ELEVATED' ? 'text-amber-500 bg-amber-500/10 border-amber-500/30' : 
                      'text-emerald-500 bg-emerald-500/10 border-emerald-500/30';

  const severityStyles = {
    'Critical': 'text-[#E4002B] bg-[#E4002B]/10 border-[#E4002B]/30',
    'High': 'text-orange-500 bg-orange-500/10 border-orange-500/30',
    'Medium': 'text-amber-500 bg-amber-500/10 border-amber-500/30',
    'Low': 'text-blue-500 bg-blue-500/10 border-blue-500/30'
  };

  // Build the Attack Chain (Threat Timeline)
  // We'll combine recent logs and format them into a narrative chain if they are close in time or just show them connected.
  const timelineEvents = logs.slice(0, 15);

  return (
    <div className="space-y-8">
      <header className="mb-10 border-b border-surface pb-6 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight uppercase text-foreground">
            Security Center
          </h1>
          <p className="text-muted text-sm font-mono mt-2 tracking-widest uppercase">
            Forensic Threat Analysis & Posture Monitoring
          </p>
        </div>
        <div className="text-right hidden sm:block">
          <p className="text-[10px] font-mono text-muted uppercase tracking-[0.2em] mb-2">Current Threat Level</p>
          <div className="flex items-center gap-2 justify-end">
             {threatLevel === 'CRITICAL' && <ShieldBan className="text-[#E4002B] animate-pulse" size={16} />}
             <span className={`px-3 py-1 font-mono text-xs uppercase tracking-widest border rounded-sm ${threatColor}`}>
               {threatLevel}
             </span>
          </div>
        </div>
      </header>

      {/* Security Posture Top Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-background border border-surface p-6 rounded-sm relative group overflow-hidden">
          <div className={`absolute top-0 left-0 w-1 h-full ${failedLogins > 0 ? 'bg-[#E4002B]' : 'bg-emerald-500'}`}></div>
          <div className="flex items-center gap-3 mb-4 text-foreground">
            <ShieldAlert size={14} className={failedLogins > 0 ? 'text-[#E4002B]' : 'text-emerald-500'} />
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted">Failed Logins</span>
          </div>
          <span className={`text-4xl font-mono ${failedLogins > 0 ? 'text-[#E4002B]' : 'text-foreground'}`}>
            {failedLogins}
          </span>
        </div>

        <div className="bg-background border border-surface p-6 rounded-sm relative group overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500"></div>
          <div className="flex items-center gap-3 mb-4 text-foreground">
            <ShieldCheck size={14} className="text-emerald-500" />
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted">Successful Logins</span>
          </div>
          <span className="text-4xl font-mono text-foreground">{successfulLogins}</span>
        </div>

        <div className="bg-background border border-surface p-6 rounded-sm relative group overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-amber-500"></div>
          <div className="flex items-center gap-3 mb-4 text-foreground">
            <AlertTriangle size={14} className="text-amber-500" />
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted">Blocked IPs</span>
          </div>
          <span className="text-4xl font-mono text-foreground">{blockedIPs}</span>
        </div>

        <div className="bg-background border border-surface p-6 rounded-sm relative group overflow-hidden">
          <div className={`absolute top-0 left-0 w-1 h-full ${rlsEnabled ? 'bg-emerald-500' : 'bg-[#E4002B]'}`}></div>
          <div className="flex items-center gap-3 mb-4 text-foreground">
            <Database size={14} className={rlsEnabled ? 'text-emerald-500' : 'text-[#E4002B]'} />
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted">Database RLS</span>
          </div>
          <span className="text-lg font-mono text-foreground uppercase tracking-widest flex items-center gap-2 mt-4">
            {rlsEnabled ? <><Lock size={14} className="text-emerald-500"/> Enabled</> : <><Unlock size={14} className="text-[#E4002B]"/> Disabled</>}
          </span>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Attack Chain Timeline */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-background border border-surface p-6 rounded-sm flex flex-col h-full min-h-[500px]">
             <h3 className="text-xs font-mono tracking-widest uppercase text-muted mb-8 flex items-center gap-2 border-b border-surface pb-4">
                <Activity size={14} className="text-amber-500" /> Threat Timeline (Attack Chain)
             </h3>
             <div className="relative flex-1">
                {timelineEvents.length > 0 ? (
                  <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-surface-strong before:to-transparent">
                    {timelineEvents.map((event, idx) => {
                      const isFail = event.action.includes('FAIL') || event.action.includes('BLOCK');
                      const isAuth = event.action.includes('LOGIN');
                      return (
                        <motion.div 
                          initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.1 }}
                          key={event.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active"
                        >
                          <div className={`flex items-center justify-center w-10 h-10 rounded-full border-4 border-background shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow shadow-background z-10 ${isFail ? 'bg-[#E4002B]/20 text-[#E4002B]' : 'bg-emerald-500/20 text-emerald-500'}`}>
                            {isFail ? <ShieldAlert size={14} /> : <ShieldCheck size={14} />}
                          </div>
                          <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-surface/10 border border-surface p-4 rounded-sm">
                            <div className="flex items-center justify-between space-x-2 mb-1">
                              <div className={`font-mono text-[10px] uppercase tracking-wider ${isFail ? 'text-[#E4002B]' : 'text-emerald-500'}`}>{event.action}</div>
                              <time className="font-mono text-[9px] text-muted">{format(new Date(event.created_at), 'HH:mm:ss')}</time>
                            </div>
                            <div className="text-foreground font-mono text-xs">{event.actor}</div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full opacity-50">
                    <ShieldCheck size={48} className="text-muted mb-4" />
                    <p className="text-[10px] font-mono text-muted uppercase tracking-widest text-center">No threats detected.<br/>Monitoring active.</p>
                  </div>
                )}
             </div>
          </div>
        </div>

        {/* Right Columns: Analysis Panels */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Failed Login Analysis */}
          <div className="bg-background border border-surface p-6 rounded-sm">
             <h3 className="text-xs font-mono tracking-widest uppercase text-muted mb-6 flex items-center gap-2 border-b border-surface pb-4">
               <Lock size={14} className="text-[#E4002B]" /> Failed Login Analysis
             </h3>
             <div className="overflow-x-auto">
               <table className="w-full text-left font-mono text-xs">
                 <thead className="bg-surface/30 text-[9px] uppercase tracking-[0.2em] text-muted border-b border-surface">
                   <tr>
                     <th className="px-4 py-3 font-normal">Source IP</th>
                     <th className="px-4 py-3 font-normal">Environment</th>
                     <th className="px-4 py-3 font-normal text-center">Attempts</th>
                     <th className="px-4 py-3 font-normal text-right">Last Attempt</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-surface text-foreground">
                   {failedLoginChains.length > 0 ? failedLoginChains.map((chain, i) => (
                     <tr key={i} className="hover:bg-surface/5 transition-colors">
                       <td className="px-4 py-3 flex items-center gap-2">
                         <MapPin size={10} className="text-muted" />
                         <span className="text-foreground">{chain.ip}</span>
                         <span className="text-muted text-[9px] border border-surface-strong px-1 rounded-sm">{chain.country}</span>
                       </td>
                       <td className="px-4 py-3">
                         <div className="flex flex-col">
                           <span className="truncate max-w-[150px]" title={chain.browser}>{chain.browser}</span>
                           <span className="text-[9px] text-muted">{chain.device}</span>
                         </div>
                       </td>
                       <td className="px-4 py-3 text-center">
                         <span className={`px-2 py-0.5 rounded-sm ${chain.attempts > 5 ? 'bg-[#E4002B]/20 text-[#E4002B]' : 'bg-surface text-muted'}`}>
                           {chain.attempts}
                         </span>
                       </td>
                       <td className="px-4 py-3 text-right text-muted flex items-center justify-end gap-2">
                         <Clock size={10} /> {formatDistanceToNow(new Date(chain.lastAttempt), { addSuffix: true })}
                       </td>
                     </tr>
                   )) : (
                     <tr>
                       <td colSpan={4} className="px-4 py-8 text-center text-[10px] uppercase tracking-widest text-muted">No failed login vectors established.</td>
                     </tr>
                   )}
                 </tbody>
               </table>
             </div>
          </div>

          {/* Suspicious Activity (Rule Evaluation) */}
          <div className="bg-background border border-surface p-6 rounded-sm">
             <h3 className="text-xs font-mono tracking-widest uppercase text-muted mb-6 flex items-center gap-2 border-b border-surface pb-4">
               <Crosshair size={14} className="text-amber-500" /> Suspicious Activity Identification
             </h3>
             <div className="space-y-4">
               {suspiciousActors.length > 0 ? suspiciousActors.map((actor) => (
                 <div key={actor.visitorId} className="bg-surface/5 border border-surface p-4 rounded-sm flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
                   <div className="flex flex-col gap-2">
                     <div className="flex items-center gap-3">
                       <span className="text-[10px] font-mono text-muted uppercase tracking-[0.2em]">Visitor Vector:</span>
                       <span className="text-foreground font-mono text-sm">{actor.visitorId}</span>
                     </div>
                     <div className="flex flex-wrap gap-2 mt-1">
                       {actor.rulesBroken.map((rule, idx) => (
                         <span key={idx} className="text-[9px] font-mono uppercase tracking-widest border border-surface-strong px-2 py-1 rounded-sm text-muted bg-surface/30">
                           {rule}
                         </span>
                       ))}
                     </div>
                   </div>
                   <div className="flex flex-col items-end gap-2">
                     <span className={`text-[10px] font-mono uppercase tracking-[0.2em] px-3 py-1 border rounded-sm ${severityStyles[actor.severity]}`}>
                       {actor.severity}
                     </span>
                     <span className="text-[9px] font-mono text-muted flex items-center gap-1">
                       <Monitor size={10} /> {actor.eventCount} Events
                     </span>
                   </div>
                 </div>
               )) : (
                 <div className="flex flex-col items-center justify-center py-8">
                   <ShieldCheck size={32} className="text-emerald-500/50 mb-3" />
                   <p className="text-[10px] font-mono text-muted uppercase tracking-widest">Behavioral engine nominal. No suspicious actors.</p>
                 </div>
               )}
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}
