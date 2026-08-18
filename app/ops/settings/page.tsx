'use client';

import { Shield, Activity, Users, Globe, Lock, Save, Bell, Database } from 'lucide-react';
import { useState } from 'react';

export default function OpsSettings() {
  const [saving, setSaving] = useState(false);

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => setSaving(false), 1000); // Mock save
  };

  return (
    <div className="space-y-8 pb-12">
      <header className="mb-10 border-b border-surface pb-6 flex justify-between items-end">
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
          className="flex items-center gap-2 bg-foreground text-background px-4 py-2 rounded-sm font-mono text-xs uppercase tracking-widest hover:bg-muted transition-colors disabled:opacity-50"
        >
          <Save size={14} /> {saving ? 'Saving...' : 'Save Configuration'}
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          
          {/* Telemetry */}
          <div className="bg-surface/10 border border-surface rounded-sm p-8">
            <h2 className="text-sm font-mono tracking-[0.2em] uppercase text-foreground mb-6 border-b border-surface pb-2 flex items-center gap-2">
              <Activity size={16} className="text-blue-500" /> Telemetry Configuration
            </h2>
            <div className="space-y-6 max-w-2xl">
              <div className="flex items-center justify-between border-b border-surface/50 pb-4">
                <div>
                  <p className="text-sm font-mono text-foreground uppercase tracking-widest">Global Telemetry</p>
                  <p className="text-[10px] font-mono text-muted uppercase mt-1">Collect anonymous visitor data</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-surface peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                </label>
              </div>

              <div className="flex items-center justify-between border-b border-surface/50 pb-4">
                <div>
                  <p className="text-sm font-mono text-foreground uppercase tracking-widest">Session Tracking</p>
                  <p className="text-[10px] font-mono text-muted uppercase mt-1">Track journey paths across portfolio</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-surface peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-mono text-foreground uppercase tracking-widest flex items-center gap-2">
                    <Database size={12} className="text-muted" /> Data Retention
                  </p>
                  <p className="text-[10px] font-mono text-muted uppercase mt-1">How long to store telemetry data</p>
                </div>
                <select className="bg-background border border-surface rounded-sm px-3 py-2 text-xs font-mono focus:outline-none focus:border-surface-strong text-foreground">
                  <option value="30">30 Days</option>
                  <option value="90">90 Days</option>
                  <option value="365">1 Year</option>
                  <option value="forever">Forever</option>
                </select>
              </div>
            </div>
          </div>

          {/* Security */}
          <div className="bg-surface/10 border border-surface rounded-sm p-8">
            <h2 className="text-sm font-mono tracking-[0.2em] uppercase text-foreground mb-6 border-b border-surface pb-2 flex items-center gap-2">
              <Lock size={16} className="text-[#E4002B]" /> Security Configuration
            </h2>
            <div className="space-y-6 max-w-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-mono text-foreground uppercase tracking-widest">Enforce AAL2 (MFA)</p>
                  <p className="text-[10px] font-mono text-muted uppercase mt-1">Require multi-factor authentication for /ops</p>
                </div>
                <div className="bg-[#E4002B]/20 text-[#E4002B] border border-[#E4002B]/30 px-3 py-1 rounded-sm text-[10px] font-mono uppercase tracking-widest">
                  Strict Mode Active
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-surface/50 pt-4">
                <div>
                  <p className="text-sm font-mono text-foreground uppercase tracking-widest">Brute Force Protection</p>
                  <p className="text-[10px] font-mono text-muted uppercase mt-1">Lock account after 5 failed attempts</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-surface peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                </label>
              </div>

              <div className="flex items-center justify-between border-t border-surface/50 pt-4">
                <div>
                  <p className="text-sm font-mono text-foreground uppercase tracking-widest">Session Timeout</p>
                  <p className="text-[10px] font-mono text-muted uppercase mt-1">Auto-logout after inactivity</p>
                </div>
                <select className="bg-background border border-surface rounded-sm px-3 py-2 text-xs font-mono focus:outline-none focus:border-surface-strong text-foreground">
                  <option value="15">15 Minutes</option>
                  <option value="30">30 Minutes</option>
                  <option value="60">1 Hour</option>
                  <option value="never">Never</option>
                </select>
              </div>

              <div className="flex items-center justify-between border-t border-surface/50 pt-4">
                <div>
                  <p className="text-sm font-mono text-foreground uppercase tracking-widest">Audit Logging</p>
                  <p className="text-[10px] font-mono text-muted uppercase mt-1">Record all mutations to portfolio_audit_logs</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked disabled />
                  <div className="w-11 h-6 bg-surface peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500 opacity-50 cursor-not-allowed"></div>
                </label>
              </div>
            </div>
          </div>

        </div>

        <div className="space-y-8">
          <div className="bg-surface/5 border border-surface p-6 rounded-sm">
            <h3 className="text-sm font-mono tracking-widest uppercase text-muted mb-6 flex items-center gap-2">
              <Users size={14} /> Admin Profile
            </h3>
            <div className="space-y-4">
              <div className="bg-surface/10 border border-surface rounded-sm p-4 mb-4">
                <p className="text-[9px] font-mono uppercase tracking-widest text-muted mb-1">Authenticated As</p>
                <p className="text-sm font-mono text-foreground truncate">admin@portfolio.local</p>
                <div className="mt-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500"></span>
                  <span className="text-[9px] font-mono uppercase tracking-widest text-green-500">Active Session</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-surface/5 border border-surface p-6 rounded-sm">
             <h3 className="text-sm font-mono tracking-widest uppercase text-muted mb-6 flex items-center gap-2">
              <Bell size={14} /> Notifications
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <input type="checkbox" defaultChecked className="accent-foreground" />
                <span className="text-xs font-mono text-foreground uppercase">Alert on failed logins</span>
              </div>
              <div className="flex items-center gap-3">
                <input type="checkbox" defaultChecked className="accent-foreground" />
                <span className="text-xs font-mono text-foreground uppercase">Alert on new contact messages</span>
              </div>
              <div className="flex items-center gap-3">
                <input type="checkbox" className="accent-foreground" />
                <span className="text-xs font-mono text-foreground uppercase">Daily digest email</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
