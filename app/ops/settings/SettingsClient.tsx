'use client';

import { Shield, Activity, Lock, Save, Bell, Globe } from 'lucide-react';
import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { saveSettingsAction } from './actions';

export default function SettingsClient({ initialConfig }: { initialConfig: Record<string, string> }) {
  const [config, setConfig] = useState(initialConfig);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const supabase = createClient();

  const handleSave = async () => {
    setSaving(true);
    
    const updates = Object.entries(config).map(([key, value]) => ({
      key,
      value: typeof value === 'string' ? `"${value}"` : value, // Wrap in quotes if it's a raw string to be valid JSON
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

  const handleChange = (key: string, value: string) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  const tabs = [
    { id: 'general', label: 'General', icon: Globe },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'telemetry', label: 'Telemetry', icon: Activity },
    { id: 'notifications', label: 'Alerts', icon: Bell },

  ];

  return (
    <div className="space-y-8 pb-12 flex flex-col h-full">
      <header className="mb-6 border-b border-surface pb-6 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight uppercase text-foreground">
            SOC Configuration
          </h1>
          <p className="text-muted text-sm font-mono mt-2 tracking-widest uppercase">
            System Preferences & Security Policies
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
        
        {/* Settings Navigation Sidebar */}
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

        {/* Settings Content Area */}
        <div className="flex-1 bg-surface/5 border border-surface rounded-sm p-8 min-h-[500px]">
           
           {activeTab === 'general' && (
             <div className="space-y-8 max-w-2xl animate-in fade-in">
                <h2 className="text-sm font-mono tracking-[0.2em] uppercase text-foreground mb-6 border-b border-surface pb-2 flex items-center gap-2">
                  <Globe size={16} className="text-blue-500" /> General Configuration
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-mono text-muted uppercase tracking-widest mb-2">Site Name</label>
                    <input type="text" value={config['site_name'] || 'Jothish Portfolio'} onChange={(e) => handleChange('site_name', e.target.value)} className="w-full bg-background border border-surface rounded-sm px-4 py-2 text-xs font-mono text-foreground focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-muted uppercase tracking-widest mb-2">Maintenance Mode</label>
                    <select value={config['maintenance_mode'] || 'false'} onChange={(e) => handleChange('maintenance_mode', e.target.value)} className="w-full bg-background border border-surface rounded-sm px-4 py-2 text-xs font-mono text-foreground focus:outline-none">
                      <option value="false">Disabled (Live)</option>
                      <option value="true">Enabled (Offline)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-muted uppercase tracking-widest mb-2">Support Email</label>
                    <input type="email" value={config['support_email'] || 'admin@portfolio.local'} onChange={(e) => handleChange('support_email', e.target.value)} className="w-full bg-background border border-surface rounded-sm px-4 py-2 text-xs font-mono text-foreground focus:outline-none" />
                  </div>
                </div>
             </div>
           )}

           {activeTab === 'security' && (
             <div className="space-y-8 max-w-2xl animate-in fade-in">
                <h2 className="text-sm font-mono tracking-[0.2em] uppercase text-foreground mb-6 border-b border-surface pb-2 flex items-center gap-2">
                  <Lock size={16} className="text-[#E4002B]" /> Security Policies
                </h2>
                
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-surface/50 pb-4">
                    <div>
                      <p className="text-sm font-mono text-foreground uppercase tracking-widest">Enforce AAL2 (MFA)</p>
                      <p className="text-[10px] font-mono text-muted uppercase mt-1">Require multi-factor authentication for /ops</p>
                    </div>
                    <select value={config['enforce_mfa'] || 'strict'} onChange={(e) => handleChange('enforce_mfa', e.target.value)} className="bg-background border border-surface rounded-sm px-3 py-1 text-xs font-mono text-foreground focus:outline-none">
                      <option value="strict">Strict Mode (Required)</option>
                      <option value="optional">Optional</option>
                      <option value="disabled">Disabled</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between border-b border-surface/50 pb-4">
                    <div>
                      <p className="text-sm font-mono text-foreground uppercase tracking-widest">Brute Force Protection</p>
                      <p className="text-[10px] font-mono text-muted uppercase mt-1">Lock account after failed attempts</p>
                    </div>
                    <select value={config['brute_force_limit'] || '5'} onChange={(e) => handleChange('brute_force_limit', e.target.value)} className="bg-background border border-surface rounded-sm px-3 py-1 text-xs font-mono text-foreground focus:outline-none">
                      <option value="3">3 Attempts</option>
                      <option value="5">5 Attempts</option>
                      <option value="10">10 Attempts</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between border-b border-surface/50 pb-4">
                    <div>
                      <p className="text-sm font-mono text-foreground uppercase tracking-widest">Session Timeout</p>
                      <p className="text-[10px] font-mono text-muted uppercase mt-1">Auto-logout after inactivity</p>
                    </div>
                    <select value={config['session_timeout'] || '30'} onChange={(e) => handleChange('session_timeout', e.target.value)} className="bg-background border border-surface rounded-sm px-3 py-1 text-xs font-mono text-foreground focus:outline-none">
                      <option value="15">15 Minutes</option>
                      <option value="30">30 Minutes</option>
                      <option value="60">1 Hour</option>
                      <option value="never">Never</option>
                    </select>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-mono text-foreground uppercase tracking-widest">Audit Logging</p>
                      <p className="text-[10px] font-mono text-muted uppercase mt-1">Record all mutations to portfolio_audit_logs</p>
                    </div>
                    <select value={config['audit_logging'] || 'true'} onChange={(e) => handleChange('audit_logging', e.target.value)} className="bg-background border border-surface rounded-sm px-3 py-1 text-xs font-mono text-foreground focus:outline-none">
                      <option value="true">Enabled (Strict)</option>
                      <option value="false">Disabled</option>
                    </select>
                  </div>
                </div>
             </div>
           )}

           {activeTab === 'telemetry' && (
             <div className="space-y-8 max-w-2xl animate-in fade-in">
                <h2 className="text-sm font-mono tracking-[0.2em] uppercase text-foreground mb-6 border-b border-surface pb-2 flex items-center gap-2">
                  <Activity size={16} className="text-emerald-500" /> Telemetry & Tracking
                </h2>
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-surface/50 pb-4">
                    <div>
                      <p className="text-sm font-mono text-foreground uppercase tracking-widest">Global Telemetry</p>
                      <p className="text-[10px] font-mono text-muted uppercase mt-1">Collect anonymous visitor data</p>
                    </div>
                    <select value={config['telemetry_enabled'] || 'true'} onChange={(e) => handleChange('telemetry_enabled', e.target.value)} className="bg-background border border-surface rounded-sm px-3 py-1 text-xs font-mono text-foreground focus:outline-none">
                      <option value="true">Enabled</option>
                      <option value="false">Disabled</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between border-b border-surface/50 pb-4">
                    <div>
                      <p className="text-sm font-mono text-foreground uppercase tracking-widest">Session Tracking</p>
                      <p className="text-[10px] font-mono text-muted uppercase mt-1">Track journey paths across portfolio</p>
                    </div>
                    <select value={config['session_tracking'] || 'true'} onChange={(e) => handleChange('session_tracking', e.target.value)} className="bg-background border border-surface rounded-sm px-3 py-1 text-xs font-mono text-foreground focus:outline-none">
                      <option value="true">Enabled</option>
                      <option value="false">Disabled</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-mono text-foreground uppercase tracking-widest">Data Retention</p>
                      <p className="text-[10px] font-mono text-muted uppercase mt-1">How long to store telemetry data</p>
                    </div>
                    <select value={config['data_retention'] || '30'} onChange={(e) => handleChange('data_retention', e.target.value)} className="bg-background border border-surface rounded-sm px-3 py-1 text-xs font-mono text-foreground focus:outline-none">
                      <option value="30">30 Days</option>
                      <option value="90">90 Days</option>
                      <option value="365">1 Year</option>
                      <option value="forever">Forever</option>
                    </select>
                  </div>
                </div>
             </div>
           )}

           {activeTab === 'notifications' && (
             <div className="space-y-8 max-w-2xl animate-in fade-in">
                <h2 className="text-sm font-mono tracking-[0.2em] uppercase text-foreground mb-6 border-b border-surface pb-2 flex items-center gap-2">
                  <Bell size={16} className="text-amber-500" /> Notifications & Alerts
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <input type="checkbox" checked={config['alert_failed_logins'] !== 'false'} onChange={(e) => handleChange('alert_failed_logins', e.target.checked.toString())} className="accent-foreground" />
                    <span className="text-xs font-mono text-foreground uppercase tracking-widest">Alert on failed logins</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <input type="checkbox" checked={config['alert_contact'] !== 'false'} onChange={(e) => handleChange('alert_contact', e.target.checked.toString())} className="accent-foreground" />
                    <span className="text-xs font-mono text-foreground uppercase tracking-widest">Alert on new contact messages</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <input type="checkbox" checked={config['alert_digest'] === 'true'} onChange={(e) => handleChange('alert_digest', e.target.checked.toString())} className="accent-foreground" />
                    <span className="text-xs font-mono text-foreground uppercase tracking-widest">Receive Daily Digest Email</span>
                  </div>
                </div>
             </div>
           )}



        </div>
      </div>
    </div>
  );
}
