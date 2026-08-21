'use client';

import { Save, Clock, Users, Database, Shield } from 'lucide-react';
import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { saveSettingsAction } from './actions';

export default function SettingsClient({ initialConfig }: { initialConfig: Record<string, string> }) {
  const [config, setConfig] = useState(initialConfig);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('sessions');

  const handleSave = async () => {
    setSaving(true);
    
    const updates = Object.entries(config).map(([key, value]) => ({
      key,
      value: typeof value === 'string' ? `"${value}"` : value,
      category: activeTab
    }));
    
    try {
      await saveSettingsAction(updates);
    } catch (e) {
      console.error(e);
      alert('Failed to save settings');
    }

    setTimeout(() => setSaving(false), 500);
  };

  const handleCleanup = async () => {
    if (!window.confirm('Are you sure you want to run manual log cleanup now?')) return;
    try {
      const res = await fetch('/api/ops/system/cleanup', { method: 'POST' });
      if (res.ok) alert('Cleanup successful');
    } catch (e) {
      alert('Cleanup failed');
    }
  };

  const handleChange = (key: string, value: string) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  const tabs = [
    { id: 'sessions', label: 'Sessions & Cookies', icon: Clock },
    { id: 'visitors', label: 'Visitor Management', icon: Users },
    { id: 'logs', label: 'Log Retention', icon: Database },
  ];

  return (
    <div className="space-y-8 pb-12 flex flex-col h-full">
      <header className="mb-6 border-b border-surface pb-6 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight uppercase text-foreground">
            System Settings
          </h1>
          <p className="text-muted text-sm font-mono mt-2 tracking-widest uppercase">
            Visitor & Session Controls
          </p>
        </div>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-emerald-500/10 text-emerald-500 border border-emerald-500/30 px-4 py-2 rounded-sm font-mono text-xs uppercase tracking-widest hover:bg-emerald-500/20 transition-colors disabled:opacity-50"
        >
          <Save size={14} /> {saving ? 'Saving...' : 'Save Config'}
        </button>
      </header>

      <div className="flex flex-col lg:flex-row gap-8 flex-1">
        
        <div className="w-full lg:w-64 shrink-0">
           <nav className="flex flex-col gap-1">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-sm font-mono text-[10px] uppercase tracking-widest transition-colors w-full text-left ${
                    activeTab === tab.id ? 'bg-surface/50 text-foreground border border-surface-strong' : 'text-muted hover:text-foreground hover:bg-surface/10 border border-transparent'
                  }`}
                >
                  <tab.icon size={14} className={activeTab === tab.id ? 'text-blue-500' : ''} />
                  {tab.label}
                </button>
              ))}
           </nav>
        </div>

        <div className="flex-1 bg-surface/5 border border-surface rounded-sm p-8 min-h-[500px]">
           
           {activeTab === 'sessions' && (
             <div className="space-y-8 max-w-2xl animate-in fade-in">
                <h2 className="text-sm font-mono tracking-[0.2em] uppercase text-foreground mb-6 border-b border-surface pb-2 flex items-center gap-2">
                  <Clock size={16} className="text-blue-500" /> Session Settings
                </h2>
                
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-surface/50 pb-4">
                    <div>
                      <p className="text-sm font-mono text-foreground uppercase tracking-widest">Session Timeout</p>
                      <p className="text-[10px] font-mono text-muted uppercase mt-1">Inactivity timeout before expiration</p>
                    </div>
                    <select value={config['session_timeout'] || '30'} onChange={(e) => handleChange('session_timeout', e.target.value)} className="bg-background border border-surface rounded-sm px-3 py-1 text-xs font-mono text-foreground focus:outline-none">
                      <option value="15">15 Minutes</option>
                      <option value="30">30 Minutes</option>
                      <option value="60">1 Hour</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between border-b border-surface/50 pb-4">
                    <div>
                      <p className="text-sm font-mono text-foreground uppercase tracking-widest">Auto Extend Sessions</p>
                      <p className="text-[10px] font-mono text-muted uppercase mt-1">Extend session timeout on activity</p>
                    </div>
                    <select value={config['auto_extend'] || 'true'} onChange={(e) => handleChange('auto_extend', e.target.value)} className="bg-background border border-surface rounded-sm px-3 py-1 text-xs font-mono text-foreground focus:outline-none">
                      <option value="true">On</option>
                      <option value="false">Off</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between border-b border-surface/50 pb-4">
                    <div>
                      <p className="text-sm font-mono text-foreground uppercase tracking-widest">Cookie Lifetime</p>
                      <p className="text-[10px] font-mono text-muted uppercase mt-1">How long the persistent cookie lives</p>
                    </div>
                    <select value={config['cookie_lifetime'] || '730'} onChange={(e) => handleChange('cookie_lifetime', e.target.value)} className="bg-background border border-surface rounded-sm px-3 py-1 text-xs font-mono text-foreground focus:outline-none">
                      <option value="1">1 Day</option>
                      <option value="30">30 Days</option>
                      <option value="365">1 Year</option>
                      <option value="730">2 Years</option>
                    </select>
                  </div>
                  
                  <div className="flex items-center justify-between border-b border-surface/50 pb-4">
                    <div>
                      <p className="text-sm font-mono text-foreground uppercase tracking-widest">Secure Cookies</p>
                    </div>
                    <select value={config['secure_cookies'] || 'true'} onChange={(e) => handleChange('secure_cookies', e.target.value)} className="bg-background border border-surface rounded-sm px-3 py-1 text-xs font-mono text-foreground focus:outline-none">
                      <option value="true">Enabled (HTTPS only)</option>
                      <option value="false">Disabled (HTTP allowed)</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between border-b border-surface/50 pb-4">
                    <div>
                      <p className="text-sm font-mono text-foreground uppercase tracking-widest">HttpOnly Cookies</p>
                    </div>
                    <select value={config['httponly_cookies'] || 'true'} onChange={(e) => handleChange('httponly_cookies', e.target.value)} className="bg-background border border-surface rounded-sm px-3 py-1 text-xs font-mono text-foreground focus:outline-none">
                      <option value="true">Enabled (No JS access)</option>
                      <option value="false">Disabled</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-mono text-foreground uppercase tracking-widest">SameSite Policy</p>
                    </div>
                    <select value={config['samesite_policy'] || 'lax'} onChange={(e) => handleChange('samesite_policy', e.target.value)} className="bg-background border border-surface rounded-sm px-3 py-1 text-xs font-mono text-foreground focus:outline-none">
                      <option value="lax">Lax</option>
                      <option value="strict">Strict</option>
                      <option value="none">None</option>
                    </select>
                  </div>
                </div>
             </div>
           )}

           {activeTab === 'visitors' && (
             <div className="space-y-8 max-w-2xl animate-in fade-in">
                <h2 className="text-sm font-mono tracking-[0.2em] uppercase text-foreground mb-6 border-b border-surface pb-2 flex items-center gap-2">
                  <Users size={16} className="text-[#E4002B]" /> Visitor Management
                </h2>
                
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-surface/50 pb-4">
                    <div>
                      <p className="text-sm font-mono text-foreground uppercase tracking-widest">Enable Visitor Blocking</p>
                      <p className="text-[10px] font-mono text-muted uppercase mt-1">Allow blocking malicious visitors</p>
                    </div>
                    <select value={config['visitor_blocking'] || 'true'} onChange={(e) => handleChange('visitor_blocking', e.target.value)} className="bg-background border border-surface rounded-sm px-3 py-1 text-xs font-mono text-foreground focus:outline-none">
                      <option value="true">Enabled</option>
                      <option value="false">Disabled</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between border-b border-surface/50 pb-4">
                    <div>
                      <p className="text-sm font-mono text-foreground uppercase tracking-widest">Enable Visitor Tracking</p>
                      <p className="text-[10px] font-mono text-muted uppercase mt-1">Collect analytics and behavior data</p>
                    </div>
                    <select value={config['visitor_tracking'] || 'true'} onChange={(e) => handleChange('visitor_tracking', e.target.value)} className="bg-background border border-surface rounded-sm px-3 py-1 text-xs font-mono text-foreground focus:outline-none">
                      <option value="true">Enabled</option>
                      <option value="false">Disabled</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-mono text-foreground uppercase tracking-widest">Device Fingerprinting</p>
                      <p className="text-[10px] font-mono text-muted uppercase mt-1">Use fingerprinting for identity</p>
                    </div>
                    <select value={config['device_fingerprinting'] || 'false'} onChange={(e) => handleChange('device_fingerprinting', e.target.value)} className="bg-background border border-surface rounded-sm px-3 py-1 text-xs font-mono text-foreground focus:outline-none">
                      <option value="true">Enabled</option>
                      <option value="false">Disabled</option>
                    </select>
                  </div>
                </div>
             </div>
           )}

           {activeTab === 'logs' && (
             <div className="space-y-8 max-w-2xl animate-in fade-in">
                <h2 className="text-sm font-mono tracking-[0.2em] uppercase text-foreground mb-6 border-b border-surface pb-2 flex items-center gap-2">
                  <Database size={16} className="text-emerald-500" /> Log Retention
                </h2>
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-surface/50 pb-4">
                    <div>
                      <p className="text-sm font-mono text-foreground uppercase tracking-widest">Auto Delete Expired Logs</p>
                      <p className="text-[10px] font-mono text-muted uppercase mt-1">Retention period for session logs</p>
                    </div>
                    <select value={config['log_retention'] || '30'} onChange={(e) => handleChange('log_retention', e.target.value)} className="bg-background border border-surface rounded-sm px-3 py-1 text-xs font-mono text-foreground focus:outline-none">
                      <option value="7">7 Days</option>
                      <option value="30">30 Days</option>
                      <option value="90">90 Days</option>
                      <option value="forever">Keep Forever</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-mono text-foreground uppercase tracking-widest">Manual Cleanup</p>
                      <p className="text-[10px] font-mono text-muted uppercase mt-1">Force delete expired session logs now</p>
                    </div>
                    <button onClick={handleCleanup} className="bg-red-500/10 text-red-500 border border-red-500/30 px-4 py-2 rounded-sm font-mono text-[10px] uppercase tracking-widest hover:bg-red-500/20 transition-colors">
                      Run Cleanup
                    </button>
                  </div>
                </div>
             </div>
           )}
        </div>
      </div>
    </div>
  );
}
