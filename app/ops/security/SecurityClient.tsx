'use client';

import { useState, useMemo } from 'react';
import { 
  ShieldAlert, ShieldCheck, AlertTriangle, Lock, Unlock, Database, Activity, 
  MapPin, Globe, Monitor, Clock, ShieldBan, Crosshair, Server, Users, RefreshCcw, 
  Trash2, Plus, Ban, CheckCircle, FileSpreadsheet, Printer, ArrowRight, Check, Key
} from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';
import { motion } from 'framer-motion';
import { 
  handleBlockIp, 
  handleWhitelistIp, 
  handleRemoveIpRule, 
  handleRevokeSession, 
  handleRevokeAllSessions, 
  handleManageDevice, 
  handleManageAdminLock, 
  handleForcePasswordReset, 
  handleResolveAlert 
} from './actions';

type AuditLog = {
  id: string;
  admin_id?: string | null;
  action: string;
  actor: string;
  resource_type: string;
  resource_id?: string;
  ip_address?: string;
  location?: string;
  browser?: string;
  os?: string;
  created_at: string;
  details?: any;
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
  systemDetails?: {
    server: string;
    os: string;
    node: string;
    runtime: string;
    environment: string;
    cpu: string;
    memory: string;
    uptime: string;
    build: string;
  };
  activeSessions: any[];
  devices: any[];
  alerts: any[];
  ipRules: any[];
  admins: any[];
};

export default function SecurityClient({ 
  logs, 
  failedLogins, 
  successfulLogins, 
  blockedIPs, 
  rlsEnabled,
  failedLoginChains,
  suspiciousActors,
  systemDetails,
  activeSessions,
  devices,
  alerts,
  ipRules,
  admins
}: Props) {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'sessions' | 'history' | 'alerts' | 'network' | 'devices' | 'admins' | 'audit'>('dashboard');

  // Input states for IP Management
  const [ipAddress, setIpAddress] = useState('');
  const [ipReason, setIpReason] = useState('');
  const [ipAction, setIpAction] = useState<'BLOCK' | 'WHITELIST'>('BLOCK');

  // Filter/Search/Pagination states
  const [auditSearch, setAuditSearch] = useState('');
  const [auditFilter, setAuditFilter] = useState('');
  const [auditPage, setAuditPage] = useState(1);
  const itemsPerPage = 20;

  const [historySearch, setHistorySearch] = useState('');
  const [historyFilter, setHistoryFilter] = useState<'ALL' | 'SUCCESS' | 'FAILED'>('ALL');
  const [historyPage, setHistoryPage] = useState(1);

  // Filter/Search audit logs
  const filteredAuditLogs = useMemo(() => {
    return logs.filter(log => {
      const actorSafe = log.actor || 'System';
      const actionSafe = log.action || 'Unknown';
      const resourceSafe = log.resource_type || '';
      const ipSafe = log.ip_address || '';
      
      const matchesSearch = actorSafe.toLowerCase().includes(auditSearch.toLowerCase()) || 
                            actionSafe.toLowerCase().includes(auditSearch.toLowerCase()) ||
                            resourceSafe.toLowerCase().includes(auditSearch.toLowerCase()) ||
                            ipSafe.includes(auditSearch);
                            
      const matchesFilter = auditFilter === '' || log.resource_type === auditFilter;
      
      return matchesSearch && matchesFilter;
    });
  }, [logs, auditSearch, auditFilter]);

  // Paginated Audit Logs
  const paginatedAuditLogs = useMemo(() => {
    const startIndex = (auditPage - 1) * itemsPerPage;
    return filteredAuditLogs.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAuditLogs, auditPage]);

  const auditTotalPages = Math.ceil(filteredAuditLogs.length / itemsPerPage);

  // Filter Successful/Failed Logins
  const allLogins = useMemo(() => {
    // Combine logs that are FAILED_LOGIN or SUCCESSFUL_LOGIN
    return logs.filter(log => log.action === 'FAILED_LOGIN' || log.action === 'SUCCESSFUL_LOGIN')
      .map(log => ({
        id: log.id,
        admin_id: log.admin_id || null,
        username: log.actor || 'Unknown',
        status: (log.action === 'SUCCESSFUL_LOGIN' ? 'SUCCESS' : 'FAILED') as 'SUCCESS' | 'FAILED',
        failure_reason: log.details?.error || log.details?.reason || null,
        ip_address: log.ip_address || 'Unknown',
        country: log.location || 'Unknown',
        browser: log.browser || 'Unknown',
        device: log.details?.device || 'Unknown',
        os: log.os || 'Unknown',
        created_at: log.created_at
      }));
  }, [logs]);

  const filteredLogins = useMemo(() => {
    return allLogins.filter(login => {
      const matchesSearch = login.username.toLowerCase().includes(historySearch.toLowerCase()) ||
                            login.ip_address.includes(historySearch) ||
                            login.country.toLowerCase().includes(historySearch.toLowerCase());
      const matchesFilter = historyFilter === 'ALL' || login.status === historyFilter;
      return matchesSearch && matchesFilter;
    });
  }, [allLogins, historySearch, historyFilter]);

  const paginatedLogins = useMemo(() => {
    const startIndex = (historyPage - 1) * itemsPerPage;
    return filteredLogins.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredLogins, historyPage]);

  const historyTotalPages = Math.ceil(filteredLogins.length / itemsPerPage);

  // CSV Exporter helper
  const exportToCSV = (data: any[], filename: string) => {
    if (data.length === 0) return;
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(row => 
      Object.values(row).map(val => 
        typeof val === 'object' && val !== null 
          ? `"${JSON.stringify(val).replace(/"/g, '""')}"` 
          : `"${String(val ?? '').replace(/"/g, '""')}"`
      ).join(',')
    );
    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const threatLevel = failedLogins > 10 || suspiciousActors.some(a => a.severity === 'Critical') || alerts.filter(a => !a.is_resolved).length > 0 ? 'CRITICAL' 
                    : failedLogins > 0 || suspiciousActors.length > 0 ? 'ELEVATED' : 'NOMINAL';
                    
  const threatColor = threatLevel === 'CRITICAL' ? 'text-[#E4002B] bg-[#E4002B]/10 border-[#E4002B]/30' : 
                      threatLevel === 'ELEVATED' ? 'text-amber-500 bg-amber-500/10 border-amber-500/30' : 
                      'text-emerald-500 bg-emerald-500/10 border-emerald-500/30';

  const severityStyles: Record<string, string> = {
    'CRITICAL': 'text-[#E4002B] bg-[#E4002B]/10 border-[#E4002B]/30',
    'Critical': 'text-[#E4002B] bg-[#E4002B]/10 border-[#E4002B]/30',
    'HIGH': 'text-orange-500 bg-orange-500/10 border-orange-500/30',
    'High': 'text-orange-500 bg-orange-500/10 border-orange-500/30',
    'MEDIUM': 'text-amber-500 bg-amber-500/10 border-amber-500/30',
    'Medium': 'text-amber-500 bg-amber-500/10 border-amber-500/30',
    'LOW': 'text-blue-500 bg-blue-500/10 border-blue-500/30',
    'Low': 'text-blue-500 bg-blue-500/10 border-blue-500/30'
  };

  return (
    <div className="space-y-8 print:bg-white print:text-black">
      <header className="mb-10 border-b border-surface pb-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 print:hidden">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight uppercase text-foreground">
            SOC Console (Security Center)
          </h1>
          <p className="text-muted text-sm font-mono mt-2 tracking-widest uppercase">
            Forensic Threat Analysis, Session Revocation & Access Controls
          </p>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-mono text-muted uppercase tracking-[0.2em] mb-2">Current Threat Level</p>
          <div className="flex items-center gap-2 justify-end">
             {threatLevel === 'CRITICAL' && <ShieldBan className="text-[#E4002B] animate-pulse" size={16} />}
             <span className={`px-3 py-1 font-mono text-xs uppercase tracking-widest border rounded-sm ${threatColor}`}>
               {threatLevel}
             </span>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-surface pb-1 shrink-0 print:hidden overflow-x-auto">
        {[
          { id: 'dashboard', label: 'Dashboard', icon: Server },
          { id: 'sessions', label: 'Active Sessions', icon: Activity },
          { id: 'history', label: 'Login History', icon: Clock },
          { id: 'alerts', label: `Alerts (${alerts.filter(a => !a.is_resolved).length})`, icon: ShieldAlert },
          { id: 'network', label: 'IP Rules', icon: ShieldBan },
          { id: 'devices', label: 'Device Registry', icon: Monitor },
          { id: 'admins', label: 'Admin Accounts', icon: Users },
          { id: 'audit', label: 'Audit Logs', icon: Database },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2 font-mono text-xs uppercase tracking-widest transition-colors border-b-2 whitespace-nowrap ${
              activeTab === tab.id 
                ? 'border-[#E4002B] text-foreground font-semibold' 
                : 'border-transparent text-muted hover:text-foreground'
            }`}
          >
            <tab.icon size={14} className={activeTab === tab.id ? 'text-[#E4002B]' : ''} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Panels */}
      <div className="space-y-6">
        
        {/* PANEL 1: DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8 animate-fadeIn">
            {/* Top Row Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-background border border-surface p-6 rounded-sm relative group overflow-hidden">
                <div className={`absolute top-0 left-0 w-1 h-full ${failedLogins > 0 ? 'bg-[#E4002B]' : 'bg-emerald-500'}`}></div>
                <div className="flex items-center gap-3 mb-4 text-foreground">
                  <ShieldAlert size={14} className={failedLogins > 0 ? 'text-[#E4002B]' : 'text-emerald-500'} />
                  <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted">Failed Logins (24h)</span>
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
                  <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted">Active IP Rules</span>
                </div>
                <span className="text-4xl font-mono text-foreground">{ipRules.length}</span>
              </div>

              <div className="bg-background border border-surface p-6 rounded-sm relative group overflow-hidden">
                <div className={`absolute top-0 left-0 w-1 h-full ${rlsEnabled ? 'bg-emerald-500' : 'bg-[#E4002B]'}`}></div>
                <div className="flex items-center gap-3 mb-4 text-foreground">
                  <Database size={14} className={rlsEnabled ? 'text-emerald-500' : 'text-[#E4002B]'} />
                  <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted">Active Sessions</span>
                </div>
                <span className="text-4xl font-mono text-foreground">{activeSessions.length}</span>
              </div>
            </div>

            {/* Architecture Card */}
            {systemDetails && (
              <div className="bg-background border border-surface p-6 rounded-sm">
                <h3 className="text-xs font-mono tracking-widest uppercase text-muted mb-6 flex items-center gap-2 border-b border-surface pb-4">
                  <Server size={14} className="text-blue-500" /> Host Machine Details
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div className="p-3 bg-surface/5 border border-surface rounded-sm">
                    <span className="block text-[9px] font-mono uppercase tracking-widest text-muted mb-1">Host Server</span>
                    <span className="block text-xs font-mono text-foreground truncate">{systemDetails.server}</span>
                  </div>
                  <div className="p-3 bg-surface/5 border border-surface rounded-sm">
                    <span className="block text-[9px] font-mono uppercase tracking-widest text-muted mb-1">Operating System</span>
                    <span className="block text-xs font-mono text-foreground truncate">{systemDetails.os}</span>
                  </div>
                  <div className="p-3 bg-surface/5 border border-surface rounded-sm">
                    <span className="block text-[9px] font-mono uppercase tracking-widest text-muted mb-1">Runtime</span>
                    <span className="block text-xs font-mono text-foreground truncate">{systemDetails.node}</span>
                  </div>
                  <div className="p-3 bg-surface/5 border border-surface rounded-sm">
                    <span className="block text-[9px] font-mono uppercase tracking-widest text-muted mb-1">Memory Allocation</span>
                    <span className="block text-xs font-mono text-foreground truncate">{systemDetails.memory}</span>
                  </div>
                  <div className="p-3 bg-surface/5 border border-surface rounded-sm">
                    <span className="block text-[9px] font-mono uppercase tracking-widest text-muted mb-1">Uptime</span>
                    <span className="block text-xs font-mono text-foreground truncate">{systemDetails.uptime}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Timelines and Tables */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Side: Threat Timeline */}
              <div className="lg:col-span-1 space-y-6">
                <div className="bg-background border border-surface p-6 rounded-sm min-h-[400px] flex flex-col">
                  <h3 className="text-xs font-mono tracking-widest uppercase text-muted mb-6 flex items-center gap-2 border-b border-surface pb-4">
                    <Activity size={14} className="text-amber-500" /> Recent Actions
                  </h3>
                  <div className="space-y-4 flex-1">
                    {logs.slice(0, 10).map((log, idx) => {
                      const isFail = log.action.includes('FAIL') || log.action.includes('BLOCK') || log.action.includes('REVOKE');
                      return (
                        <div key={log.id} className="flex gap-3 text-xs font-mono border-l-2 border-surface pl-3 relative before:absolute before:-left-1.5 before:top-1 before:w-2.5 before:h-2.5 before:rounded-full before:bg-surface-strong">
                          <div className="flex-1">
                            <div className="flex justify-between text-[10px] text-muted">
                              <span className={isFail ? 'text-[#E4002B]' : 'text-emerald-500'}>{log.action}</span>
                              <span>{formatDistanceToNow(new Date(log.created_at))} ago</span>
                            </div>
                            <p className="text-foreground truncate max-w-[200px]" title={log.actor}>{log.actor}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Right Side: Failed Login chains & Suspicious Actors */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-background border border-surface p-6 rounded-sm">
                  <h3 className="text-xs font-mono tracking-widest uppercase text-muted mb-6 flex items-center gap-2 border-b border-surface pb-4">
                    <Lock size={14} className="text-[#E4002B]" /> Failed Login Chains (IP Analysis)
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left font-mono text-xs">
                      <thead className="bg-surface/30 text-[9px] uppercase tracking-[0.2em] text-muted border-b border-surface">
                        <tr>
                          <th className="px-4 py-3 font-normal">Source IP</th>
                          <th className="px-4 py-3 font-normal">Browser</th>
                          <th className="px-4 py-3 font-normal text-center">Attempts</th>
                          <th className="px-4 py-3 font-normal text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-surface text-foreground">
                        {failedLoginChains.slice(0, 5).map((chain, i) => (
                          <tr key={i} className="hover:bg-surface/5">
                            <td className="px-4 py-3">
                              <span className="font-semibold block">{chain.ip}</span>
                              <span className="text-[9px] text-muted">{chain.country}</span>
                            </td>
                            <td className="px-4 py-3">
                              <span className="block truncate max-w-[120px]">{chain.browser}</span>
                              <span className="text-[9px] text-muted">{chain.device}</span>
                            </td>
                            <td className="px-4 py-3 text-center">
                              <span className={`px-2 py-0.5 rounded-sm ${chain.attempts > 5 ? 'bg-[#E4002B]/20 text-[#E4002B]' : 'bg-surface text-muted'}`}>
                                {chain.attempts}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-right">
                              <button 
                                onClick={async () => {
                                  if (confirm(`Block IP address ${chain.ip}?`)) {
                                    await handleBlockIp(chain.ip, `Failed login limit reached (${chain.attempts} attempts)`);
                                    alert('IP blocked successfully.');
                                  }
                                }}
                                className="px-2 py-1 text-[9px] bg-[#E4002B]/10 hover:bg-[#E4002B]/20 border border-[#E4002B]/30 text-[#E4002B] rounded-sm uppercase tracking-widest"
                              >
                                Block IP
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PANEL 2: ACTIVE SESSIONS */}
        {activeTab === 'sessions' && (
          <div className="bg-background border border-surface p-6 rounded-sm animate-fadeIn">
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-surface">
              <h3 className="text-xs font-mono tracking-widest uppercase text-muted flex items-center gap-2">
                <Activity size={14} className="text-[#E4002B]" /> Active Administrative Sessions
              </h3>
              <span className="text-[10px] font-mono uppercase bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 px-2 py-1 rounded-sm">
                {activeSessions.length} Active
              </span>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs border-collapse">
                <thead className="bg-surface/30 text-[9px] uppercase tracking-widest text-muted border-b border-surface">
                  <tr>
                    <th className="p-4 font-normal">Browser / OS</th>
                    <th className="p-4 font-normal">IP & Location</th>
                    <th className="p-4 font-normal">Device ID / Fingerprint</th>
                    <th className="p-4 font-normal">Started At</th>
                    <th className="p-4 font-normal">Last Active</th>
                    <th className="p-4 font-normal text-right">Revocation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface text-foreground">
                  {activeSessions.length > 0 ? activeSessions.map((session) => (
                    <tr key={session.id} className="hover:bg-surface/5">
                      <td className="p-4">
                        <span className="font-semibold block">{session.browser || 'Unknown'}</span>
                        <span className="text-[9px] text-muted">{session.os || 'Unknown'} ({session.device || 'Desktop'})</span>
                      </td>
                      <td className="p-4">
                        <span className="block">{session.ip_address}</span>
                        <span className="text-[9px] text-muted">{session.city ? `${session.city}, ` : ''}{session.country}</span>
                      </td>
                      <td className="p-4 text-[10px] text-muted truncate max-w-[120px]" title={session.device_id}>
                        {session.device_id || 'Legacy / Fingerprint missing'}
                      </td>
                      <td className="p-4 text-muted">{format(new Date(session.started_at), 'yyyy-MM-dd HH:mm')}</td>
                      <td className="p-4 text-muted">{formatDistanceToNow(new Date(session.last_activity_at))} ago</td>
                      <td className="p-4 text-right flex justify-end gap-2">
                        <button
                          onClick={async () => {
                            if (confirm('Revoke this session token? Target browser will be logged out.')) {
                              await handleRevokeSession(session.session_token, session.admin_id);
                              alert('Session revoked.');
                            }
                          }}
                          className="p-2 bg-[#E4002B]/10 hover:bg-[#E4002B]/20 text-[#E4002B] rounded-sm transition-colors border border-[#E4002B]/30"
                          title="Revoke Session"
                        >
                          <Ban size={12} />
                        </button>
                        <button
                          onClick={async () => {
                            if (confirm('Revoke ALL sessions for this admin? Force log out of all devices.')) {
                              await handleRevokeAllSessions(session.admin_id);
                              alert('All sessions revoked for this admin account.');
                            }
                          }}
                          className="px-2 py-1 text-[9px] bg-[#E4002B]/10 hover:bg-[#E4002B]/20 border border-[#E4002B]/30 text-[#E4002B] rounded-sm uppercase tracking-widest"
                          title="Force Logout All"
                        >
                          Revoke All
                        </button>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-muted uppercase tracking-widest text-[10px]">No active admin sessions detected.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* PANEL 3: LOGIN HISTORY */}
        {activeTab === 'history' && (
          <div className="bg-background border border-surface p-6 rounded-sm animate-fadeIn">
            {/* Search/Export Bar */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 pb-4 border-b border-surface">
              <div className="flex items-center gap-3">
                <h3 className="text-xs font-mono tracking-widest uppercase text-muted">Authentication Log History</h3>
                <div className="flex gap-1 border border-surface rounded-sm p-0.5">
                  {(['ALL', 'SUCCESS', 'FAILED'] as const).map((filter) => (
                    <button
                      key={filter}
                      onClick={() => { setHistoryFilter(filter); setHistoryPage(1); }}
                      className={`px-2 py-1 font-mono text-[9px] uppercase tracking-widest rounded-sm ${historyFilter === filter ? 'bg-surface text-foreground font-semibold' : 'text-muted hover:text-foreground'}`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2 w-full md:w-auto">
                <input
                  type="text"
                  placeholder="Search user, IP, or location..."
                  className="bg-background border border-surface rounded-sm px-3 py-1.5 text-xs font-mono focus:outline-none focus:border-surface-strong text-foreground w-full md:w-64"
                  value={historySearch}
                  onChange={e => { setHistorySearch(e.target.value); setHistoryPage(1); }}
                />
                <button
                  onClick={() => exportToCSV(filteredLogins, 'admin_login_history.csv')}
                  className="flex items-center gap-1.5 px-3 py-1.5 border border-surface-strong hover:bg-surface text-muted hover:text-foreground text-xs font-mono uppercase tracking-widest rounded-sm whitespace-nowrap"
                >
                  <FileSpreadsheet size={14} /> Export CSV
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs border-collapse">
                <thead className="bg-surface/30 text-[9px] uppercase tracking-widest text-muted border-b border-surface">
                  <tr>
                    <th className="p-4 font-normal">Status</th>
                    <th className="p-4 font-normal">Admin Operator</th>
                    <th className="p-4 font-normal">Timestamp</th>
                    <th className="p-4 font-normal">Network Details</th>
                    <th className="p-4 font-normal">Environment Snapshot</th>
                    <th className="p-4 font-normal">Failure Context</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface text-foreground">
                  {paginatedLogins.length > 0 ? paginatedLogins.map((login) => (
                    <tr key={login.id} className="hover:bg-surface/5">
                      <td className="p-4">
                        {login.status === 'SUCCESS' ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[9px] uppercase tracking-widest rounded-sm">
                            <ShieldCheck size={10} /> Success
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#E4002B]/10 border border-[#E4002B]/20 text-[#E4002B] text-[9px] uppercase tracking-widest rounded-sm">
                            <ShieldAlert size={10} /> Failed
                          </span>
                        )}
                      </td>
                      <td className="p-4 font-semibold truncate max-w-[150px]" title={login.username}>{login.username}</td>
                      <td className="p-4 text-muted">{format(new Date(login.created_at), 'yyyy-MM-dd HH:mm:ss')}</td>
                      <td className="p-4">
                        <span className="block">{login.ip_address}</span>
                        <span className="text-[9px] text-muted">{login.country}</span>
                      </td>
                      <td className="p-4">
                        <span className="block">{login.browser} on {login.os}</span>
                        <span className="text-[9px] text-muted">{login.device}</span>
                      </td>
                      <td className={`p-4 text-[10px] ${login.status === 'FAILED' ? 'text-[#E4002B]' : 'text-muted'}`}>
                        {login.failure_reason || '-'}
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-muted uppercase tracking-widest text-[10px]">No authentication attempts match filters.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {historyTotalPages > 1 && (
              <div className="flex justify-between items-center mt-6 pt-4 border-t border-surface">
                <span className="text-[10px] font-mono text-muted uppercase tracking-widest">Page {historyPage} of {historyTotalPages}</span>
                <div className="flex gap-2">
                  <button
                    disabled={historyPage === 1}
                    onClick={() => setHistoryPage(p => p - 1)}
                    className="px-3 py-1 bg-surface border border-surface-strong rounded-sm text-xs font-mono uppercase tracking-widest disabled:opacity-50 text-foreground"
                  >
                    Previous
                  </button>
                  <button
                    disabled={historyPage === historyTotalPages}
                    onClick={() => setHistoryPage(p => p + 1)}
                    className="px-3 py-1 bg-surface border border-surface-strong rounded-sm text-xs font-mono uppercase tracking-widest disabled:opacity-50 text-foreground"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* PANEL 4: SECURITY ALERTS */}
        {activeTab === 'alerts' && (
          <div className="bg-background border border-surface p-6 rounded-sm animate-fadeIn">
            <h3 className="text-xs font-mono tracking-widest uppercase text-muted mb-6 pb-4 border-b border-surface">
              Triggered Intrusion & Behavioral Alerts
            </h3>
            <div className="space-y-4">
              {alerts.length > 0 ? alerts.map((alert) => (
                <div key={alert.id} className={`border p-4 rounded-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4 ${alert.is_resolved ? 'bg-surface/5 border-surface opacity-70' : 'bg-[#E4002B]/5 border-[#E4002B]/20'}`}>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-3">
                      <span className={`text-[9px] font-mono uppercase tracking-widest border px-2 py-0.5 rounded-sm ${severityStyles[alert.severity]}`}>
                        {alert.severity}
                      </span>
                      <span className="font-mono font-semibold text-foreground text-sm">{alert.type.replace(/_/g, ' ')}</span>
                      <span className="text-[10px] font-mono text-muted">{formatDistanceToNow(new Date(alert.created_at))} ago</span>
                    </div>
                    <p className="font-mono text-xs text-foreground mt-1">{alert.message}</p>
                    {alert.details && Object.keys(alert.details).length > 0 && (
                      <pre className="text-[9px] bg-surface/10 p-2 rounded-sm font-mono text-muted overflow-x-auto max-w-full">
                        {JSON.stringify(alert.details, null, 2)}
                      </pre>
                    )}
                  </div>
                  <div className="flex items-center shrink-0">
                    {alert.is_resolved ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 border border-emerald-500/20 bg-emerald-500/10 text-emerald-500 text-[10px] font-mono uppercase tracking-widest rounded-sm">
                        <CheckCircle size={12} /> Resolved
                      </span>
                    ) : (
                      <button
                        onClick={async () => {
                          await handleResolveAlert(alert.id);
                          alert('Alert resolved and marked clean.');
                        }}
                        className="px-3 py-1 bg-surface border border-surface-strong hover:border-[#E4002B]/30 hover:bg-[#E4002B]/10 hover:text-[#E4002B] text-foreground text-[10px] font-mono uppercase tracking-widest rounded-sm transition-colors"
                      >
                        Resolve Alert
                      </button>
                    )}
                  </div>
                </div>
              )) : (
                <div className="text-center py-12 border border-dashed border-surface text-muted">
                  <ShieldCheck size={36} className="mx-auto text-emerald-500 mb-3 opacity-60" />
                  <p className="text-[10px] font-mono uppercase tracking-widest">All security controls clean. Zero alerts active.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* PANEL 5: NETWORK (IP RULES) */}
        {activeTab === 'network' && (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 animate-fadeIn">
            {/* Left side: Add IP Rule */}
            <div className="xl:col-span-1 bg-background border border-surface p-6 rounded-sm self-start">
              <h3 className="text-xs font-mono tracking-widest uppercase text-muted mb-6 pb-4 border-b border-surface">
                Provision IP Access Rule
              </h3>
              <form onSubmit={async (e) => {
                e.preventDefault();
                if (!ipAddress) return;
                if (ipAction === 'BLOCK') {
                  await handleBlockIp(ipAddress, ipReason || 'Manual administrative block');
                  alert(`IP address ${ipAddress} blocked.`);
                } else {
                  await handleWhitelistIp(ipAddress, ipReason || 'Manual administrative whitelist');
                  alert(`IP address ${ipAddress} whitelisted.`);
                }
                setIpAddress('');
                setIpReason('');
              }} className="space-y-4 font-mono text-xs">
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase text-muted tracking-widest">Rule Action</label>
                  <select
                    className="w-full bg-background border border-surface rounded-sm px-3 py-2 text-foreground focus:outline-none focus:border-surface-strong"
                    value={ipAction}
                    onChange={e => setIpAction(e.target.value as any)}
                  >
                    <option value="BLOCK">BLOCK IP</option>
                    <option value="WHITELIST">WHITELIST IP</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase text-muted tracking-widest">IP Address</label>
                  <input
                    type="text"
                    required
                    placeholder="192.168.1.100"
                    className="w-full bg-background border border-surface rounded-sm px-3 py-2 text-foreground focus:outline-none focus:border-surface-strong"
                    value={ipAddress}
                    onChange={e => setIpAddress(e.target.value)}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase text-muted tracking-widest">Reason / Description</label>
                  <textarea
                    placeholder="e.g. Authorized developer static IP / Suspicious port scanner"
                    className="w-full bg-background border border-surface rounded-sm px-3 py-2 text-foreground focus:outline-none focus:border-surface-strong h-20"
                    value={ipReason}
                    onChange={e => setIpReason(e.target.value)}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-foreground text-background font-mono text-[10px] uppercase tracking-widest font-semibold hover:bg-muted transition-colors rounded-sm"
                >
                  Apply Network Rule
                </button>
              </form>
            </div>

            {/* Right side: IP Rules Table */}
            <div className="xl:col-span-2 bg-background border border-surface p-6 rounded-sm">
              <h3 className="text-xs font-mono tracking-widest uppercase text-muted mb-6 pb-4 border-b border-surface">
                Active Network IP Restrictions & Exceptions
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left font-mono text-xs">
                  <thead className="bg-surface/30 text-[9px] uppercase tracking-widest text-muted border-b border-surface">
                    <tr>
                      <th className="p-4 font-normal">IP Address</th>
                      <th className="p-4 font-normal">Status / Constraint</th>
                      <th className="p-4 font-normal">Description / Context</th>
                      <th className="p-4 font-normal text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface text-foreground">
                    {ipRules.length > 0 ? ipRules.map((rule) => (
                      <tr key={rule.ip_address} className="hover:bg-surface/5">
                        <td className="p-4 font-semibold">{rule.ip_address}</td>
                        <td className="p-4">
                          {rule.is_whitelisted ? (
                            <span className="px-2 py-0.5 border border-emerald-500/20 bg-emerald-500/10 text-emerald-500 text-[9px] uppercase tracking-widest rounded-sm">
                              Whitelisted
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 border border-[#E4002B]/20 bg-[#E4002B]/10 text-[#E4002B] text-[9px] uppercase tracking-widest rounded-sm">
                              Blocked
                            </span>
                          )}
                        </td>
                        <td className="p-4 text-muted max-w-[200px] truncate" title={rule.reason || ''}>{rule.reason || '-'}</td>
                        <td className="p-4 text-right">
                          <button
                            onClick={async () => {
                              if (confirm(`Remove network rule for ${rule.ip_address}?`)) {
                                await handleRemoveIpRule(rule.ip_address);
                                alert('Network rule removed.');
                              }
                            }}
                            className="p-1.5 text-muted hover:text-[#E4002B] hover:bg-[#E4002B]/10 rounded-sm border border-transparent hover:border-[#E4002B]/20 transition-all"
                            title="Remove Rule"
                          >
                            <Trash2 size={12} />
                          </button>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan={4} className="p-8 text-center text-muted uppercase tracking-widest text-[10px]">No manual IP blocks or whitelists active.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* PANEL 6: DEVICE REGISTRY */}
        {activeTab === 'devices' && (
          <div className="bg-background border border-surface p-6 rounded-sm animate-fadeIn">
            <h3 className="text-xs font-mono tracking-widest uppercase text-muted mb-6 pb-4 border-b border-surface">
              Authorized Device Registry (Fingerprint Analysis)
            </h3>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs border-collapse">
                <thead className="bg-surface/30 text-[9px] uppercase tracking-widest text-muted border-b border-surface">
                  <tr>
                    <th className="p-4 font-normal">Browser / OS</th>
                    <th className="p-4 font-normal">Admin Owner ID</th>
                    <th className="p-4 font-normal">Device ID Fingerprint</th>
                    <th className="p-4 font-normal">Status</th>
                    <th className="p-4 font-normal">Last Login</th>
                    <th className="p-4 font-normal text-right">Controls</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface text-foreground">
                  {devices.length > 0 ? devices.map((dev) => (
                    <tr key={dev.id} className={`hover:bg-surface/5 ${dev.is_blocked ? 'bg-[#E4002B]/5' : ''}`}>
                      <td className="p-4">
                        <span className="font-semibold block">{dev.browser || 'Unknown'}</span>
                        <span className="text-[9px] text-muted">{dev.os || 'Unknown'} ({dev.device_type || 'Desktop'})</span>
                      </td>
                      <td className="p-4 truncate max-w-[120px] text-muted" title={dev.admin_id}>{dev.admin_id}</td>
                      <td className="p-4 font-mono text-[10px] text-muted" title={dev.device_id}>
                        {dev.device_id}
                      </td>
                      <td className="p-4">
                        <div className="flex flex-col gap-1">
                          {dev.is_blocked ? (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-[#E4002B]/10 border border-[#E4002B]/20 text-[#E4002B] text-[8px] uppercase tracking-widest rounded-sm self-start">
                              Blocked
                            </span>
                          ) : dev.is_trusted ? (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[8px] uppercase tracking-widest rounded-sm self-start">
                              Trusted
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-surface-strong text-muted text-[8px] uppercase tracking-widest rounded-sm self-start border border-surface-strong">
                              Untrusted
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-4 text-muted">{formatDistanceToNow(new Date(dev.last_login_at))} ago</td>
                      <td className="p-4 text-right flex justify-end gap-2">
                        {dev.is_trusted ? (
                          <button
                            onClick={async () => {
                              await handleManageDevice(dev.admin_id, dev.device_id, 'UNTRUST');
                              alert('Device untrusted.');
                            }}
                            className="px-2 py-1 border border-surface-strong hover:bg-surface text-muted text-[9px] uppercase tracking-widest rounded-sm"
                          >
                            Untrust
                          </button>
                        ) : (
                          <button
                            onClick={async () => {
                              await handleManageDevice(dev.admin_id, dev.device_id, 'TRUST');
                              alert('Device marked as trusted.');
                            }}
                            className="px-2 py-1 border border-emerald-500/20 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 text-[9px] uppercase tracking-widest rounded-sm"
                          >
                            Trust
                          </button>
                        )}

                        {dev.is_blocked ? (
                          <button
                            onClick={async () => {
                              await handleManageDevice(dev.admin_id, dev.device_id, 'UNBLOCK');
                              alert('Device unblocked.');
                            }}
                            className="px-2 py-1 border border-[#E4002B]/20 bg-[#E4002B]/10 hover:bg-[#E4002B]/20 text-[#E4002B] text-[9px] uppercase tracking-widest rounded-sm"
                          >
                            Unblock
                          </button>
                        ) : (
                          <button
                            onClick={async () => {
                              if (confirm(`Block device ID ${dev.device_id}? Owner admin will not be able to log in from this browser.`)) {
                                await handleManageDevice(dev.admin_id, dev.device_id, 'BLOCK');
                                alert('Device blocked.');
                              }
                            }}
                            className="px-2 py-1 bg-[#E4002B]/15 border border-[#E4002B]/30 hover:bg-[#E4002B]/25 text-[#E4002B] text-[9px] uppercase tracking-widest rounded-sm"
                          >
                            Block
                          </button>
                        )}
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-muted uppercase tracking-widest text-[10px]">No devices registered yet. Devices register on first successful login.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* PANEL 7: ADMIN ACCOUNTS */}
        {activeTab === 'admins' && (
          <div className="bg-background border border-surface p-6 rounded-sm animate-fadeIn">
            <h3 className="text-xs font-mono tracking-widest uppercase text-muted mb-6 pb-4 border-b border-surface">
              Administrator Access Controls (Locks & Credentials)
            </h3>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs border-collapse">
                <thead className="bg-surface/30 text-[9px] uppercase tracking-widest text-muted border-b border-surface">
                  <tr>
                    <th className="p-4 font-normal">Administrator Email</th>
                    <th className="p-4 font-normal">Admin UUID</th>
                    <th className="p-4 font-normal">System Role</th>
                    <th className="p-4 font-normal">Account Posture</th>
                    <th className="p-4 font-normal text-right">Lock Controls</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface text-foreground">
                  {admins.length > 0 ? admins.map((admin) => (
                    <tr key={admin.id} className={`hover:bg-surface/5 ${admin.is_locked ? 'bg-[#E4002B]/5' : ''}`}>
                      <td className="p-4 font-semibold">{admin.email}</td>
                      <td className="p-4 text-muted font-mono text-[10px]">{admin.id}</td>
                      <td className="p-4 uppercase tracking-widest text-[9px] font-semibold text-blue-500">{admin.role}</td>
                      <td className="p-4">
                        <div className="flex flex-col gap-1">
                          {admin.is_locked ? (
                            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-[#E4002B]/10 border border-[#E4002B]/20 text-[#E4002B] text-[9px] uppercase tracking-widest rounded-sm self-start">
                              <Lock size={10} /> Locked
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[9px] uppercase tracking-widest rounded-sm self-start">
                              <Unlock size={10} /> Active
                            </span>
                          )}
                          {admin.force_password_reset && (
                            <span className="text-[8px] font-mono text-amber-500 uppercase tracking-widest mt-1">Force Password Reset Active</span>
                          )}
                        </div>
                      </td>
                      <td className="p-4 text-right flex justify-end gap-2">
                        {admin.is_locked ? (
                          <button
                            onClick={async () => {
                              await handleManageAdminLock(admin.id, 'UNLOCK');
                              alert('Account unlocked.');
                            }}
                            className="flex items-center gap-1 px-2.5 py-1 border border-emerald-500/20 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 text-[9px] uppercase tracking-widest rounded-sm transition-colors"
                          >
                            <Unlock size={10} /> Unlock
                          </button>
                        ) : (
                          <button
                            onClick={async () => {
                              const reason = prompt('Enter reason for locking this admin account:');
                              if (reason !== null) {
                                await handleManageAdminLock(admin.id, 'LOCK', reason || 'Locked by security console');
                                alert('Account locked. Active sessions cleared.');
                              }
                            }}
                            className="flex items-center gap-1 px-2.5 py-1 bg-[#E4002B]/15 border border-[#E4002B]/30 hover:bg-[#E4002B]/25 text-[#E4002B] text-[9px] uppercase tracking-widest rounded-sm transition-colors"
                          >
                            <Lock size={10} /> Lock
                          </button>
                        )}

                        {admin.force_password_reset ? (
                          <button
                            onClick={async () => {
                              await handleForcePasswordReset(admin.id, 'CLEAR');
                              alert('Force password reset flag cleared.');
                            }}
                            className="px-2.5 py-1 border border-surface-strong hover:bg-surface text-muted text-[9px] uppercase tracking-widest rounded-sm transition-colors"
                          >
                            Clear Reset Flag
                          </button>
                        ) : (
                          <button
                            onClick={async () => {
                              if (confirm(`Force admin ${admin.email} to reset their passphrase on next login?`)) {
                                await handleForcePasswordReset(admin.id, 'FORCE');
                                alert('Force password reset flag activated.');
                              }
                            }}
                            className="flex items-center gap-1 px-2.5 py-1 border border-surface-strong hover:bg-surface text-foreground text-[9px] uppercase tracking-widest rounded-sm transition-colors"
                          >
                            <Key size={10} /> Force Reset
                          </button>
                        )}
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-muted uppercase tracking-widest text-[10px]">No admin accounts indexed.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* PANEL 8: AUDIT LOGS */}
        {activeTab === 'audit' && (
          <div className="bg-background border border-surface p-6 rounded-sm animate-fadeIn">
            {/* Search/Filter Bar */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 pb-4 border-b border-surface">
              <div className="flex items-center gap-3">
                <h3 className="text-xs font-mono tracking-widest uppercase text-muted">Administrative Audit Center</h3>
              </div>
              <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                <input
                  type="text"
                  placeholder="Search actions or resources..."
                  className="bg-background border border-surface rounded-sm px-3 py-1.5 text-xs font-mono focus:outline-none focus:border-surface-strong text-foreground w-full md:w-64"
                  value={auditSearch}
                  onChange={e => { setAuditSearch(e.target.value); setAuditPage(1); }}
                />
                
                <select
                  className="bg-background border border-surface rounded-sm px-3 py-1.5 text-xs font-mono focus:outline-none focus:border-surface-strong text-foreground"
                  value={auditFilter}
                  onChange={e => { setAuditFilter(e.target.value); setAuditPage(1); }}
                >
                  <option value="">All Resource Types</option>
                  <option value="auth">auth</option>
                  <option value="network">network</option>
                  <option value="session">session</option>
                  <option value="device">device</option>
                  <option value="user">user</option>
                  <option value="alert">alert</option>
                  <option value="contact">contact</option>
                  <option value="settings">settings</option>
                </select>

                <button
                  onClick={() => exportToCSV(filteredAuditLogs, 'admin_audit_logs.csv')}
                  className="flex items-center gap-1.5 px-3 py-1.5 border border-surface-strong hover:bg-surface text-muted hover:text-foreground text-xs font-mono uppercase tracking-widest rounded-sm whitespace-nowrap"
                >
                  <FileSpreadsheet size={14} /> Export CSV
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs border-collapse">
                <thead className="bg-surface/30 text-[9px] uppercase tracking-widest text-muted border-b border-surface">
                  <tr>
                    <th className="p-4 font-normal">Timestamp</th>
                    <th className="p-4 font-normal">Administrator</th>
                    <th className="p-4 font-normal">Action Logged</th>
                    <th className="p-4 font-normal">Resource Type</th>
                    <th className="p-4 font-normal">Network IP</th>
                    <th className="p-4 font-normal">Audit Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface text-foreground">
                  {paginatedAuditLogs.length > 0 ? paginatedAuditLogs.map((log) => {
                    const isFail = log.action.includes('FAIL') || log.action.includes('BLOCK') || log.action.includes('REVOKE') || log.action.includes('DELETE') || log.action.includes('LOCK');
                    return (
                      <tr key={log.id} className="hover:bg-surface/5">
                        <td className="p-4 text-muted whitespace-nowrap">{format(new Date(log.created_at), 'yyyy-MM-dd HH:mm:ss')}</td>
                        <td className="p-4 truncate max-w-[150px]" title={log.actor}>{log.actor}</td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded-sm border ${isFail ? 'bg-[#E4002B]/10 border-[#E4002B]/20 text-[#E4002B]' : 'bg-surface border-surface-strong text-foreground'}`}>
                            {log.action}
                          </span>
                        </td>
                        <td className="p-4 text-muted">{log.resource_type} {log.resource_id ? `(${log.resource_id.split('-')[0]})` : ''}</td>
                        <td className="p-4">
                          <span className="block">{log.ip_address || 'Unknown'}</span>
                          <span className="text-[9px] text-muted">{log.location}</span>
                        </td>
                        <td className="p-4 text-muted text-[10px] max-w-[200px] truncate" title={JSON.stringify(log.details || {})}>
                          {log.details ? JSON.stringify(log.details) : '-'}
                        </td>
                      </tr>
                    );
                  }) : (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-muted uppercase tracking-widest text-[10px]">No audit logs match criteria.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {auditTotalPages > 1 && (
              <div className="flex justify-between items-center mt-6 pt-4 border-t border-surface">
                <span className="text-[10px] font-mono text-muted uppercase tracking-widest">Page {auditPage} of {auditTotalPages}</span>
                <div className="flex gap-2">
                  <button
                    disabled={auditPage === 1}
                    onClick={() => setAuditPage(p => p - 1)}
                    className="px-3 py-1 bg-surface border border-surface-strong rounded-sm text-xs font-mono uppercase tracking-widest disabled:opacity-50 text-foreground"
                  >
                    Previous
                  </button>
                  <button
                    disabled={auditPage === auditTotalPages}
                    onClick={() => setAuditPage(p => p + 1)}
                    className="px-3 py-1 bg-surface border border-surface-strong rounded-sm text-xs font-mono uppercase tracking-widest disabled:opacity-50 text-foreground"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
