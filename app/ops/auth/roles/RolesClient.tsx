'use client';

import { useState } from 'react';
import { ShieldCheck, Plus, Check, UserPlus, ShieldAlert, Key } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

type Role = {
  id: string;
  name: string;
  description: string;
  permissions: Record<string, boolean>;
};

type UserRole = {
  id: string;
  user_id: string;
  role_id: string;
};

const DEFAULT_PERMISSIONS = [
  'view:dashboard',
  'view:visitors',
  'view:security',
  'manage:users',
  'manage:roles',
  'manage:settings',
  'export:reports',
];

export default function RolesClient({ initialRoles, initialUserRoles }: { initialRoles: Role[], initialUserRoles: UserRole[] }) {
  const [roles, setRoles] = useState(initialRoles);
  const [activeTab, setActiveTab] = useState<'matrix' | 'assignment'>('matrix');

  return (
    <div className="p-6 h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-sm font-mono tracking-[0.2em] uppercase text-foreground flex items-center gap-2">
          <ShieldCheck size={16} className="text-emerald-500" />
          Role Based Access Control (RBAC)
        </h2>
        
        <div className="flex bg-surface/30 p-1 rounded-sm border border-surface">
          <button 
            onClick={() => setActiveTab('matrix')}
            className={`px-4 py-1.5 font-mono text-[10px] uppercase tracking-widest rounded-sm transition-colors ${activeTab === 'matrix' ? 'bg-background text-foreground shadow-sm' : 'text-muted hover:text-foreground'}`}
          >
            Permission Matrix
          </button>
          <button 
            onClick={() => setActiveTab('assignment')}
            className={`px-4 py-1.5 font-mono text-[10px] uppercase tracking-widest rounded-sm transition-colors ${activeTab === 'assignment' ? 'bg-background text-foreground shadow-sm' : 'text-muted hover:text-foreground'}`}
          >
            Role Assignment
          </button>
        </div>
      </div>

      {activeTab === 'matrix' && (
        <div className="overflow-x-auto flex-1">
          <div className="flex items-center gap-2 mb-4">
             <ShieldAlert size={14} className="text-amber-500" />
             <span className="text-[10px] font-mono text-muted uppercase tracking-widest">Superadmin roles cannot be modified.</span>
          </div>
          <table className="w-full text-left font-mono text-xs border-collapse">
            <thead>
              <tr>
                <th className="p-4 bg-surface/30 border border-surface font-normal text-[10px] uppercase tracking-widest text-muted w-1/4">Permission Key</th>
                {roles.map(role => (
                  <th key={role.id} className="p-4 bg-surface/30 border border-surface font-normal text-center w-48">
                    <div className="text-foreground font-semibold mb-1 uppercase tracking-widest">{role.name}</div>
                    <div className="text-[9px] text-muted font-mono">{role.description}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {DEFAULT_PERMISSIONS.map(perm => (
                <tr key={perm} className="hover:bg-surface/5 transition-colors">
                  <td className="p-4 border border-surface text-foreground font-semibold">{perm}</td>
                  {roles.map(role => {
                    const hasPerm = role.permissions && role.permissions[perm];
                    const isSuper = role.name.toLowerCase() === 'superadmin';
                    return (
                      <td key={`${role.id}-${perm}`} className="p-4 border border-surface text-center">
                        {isSuper || hasPerm ? (
                          <div className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-500">
                            <Check size={12} />
                          </div>
                        ) : (
                          <div className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-surface/50 text-muted">
                            <span className="block w-2 h-px bg-current"></span>
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-4 flex justify-end">
            <button className="flex items-center gap-2 px-4 py-2 bg-surface hover:bg-surface-strong text-foreground border border-surface rounded-sm text-[10px] font-mono tracking-widest uppercase transition-colors">
              <Plus size={12} /> Add Custom Role
            </button>
          </div>
        </div>
      )}

      {activeTab === 'assignment' && (
        <div className="flex-1">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
             <div className="lg:col-span-2 space-y-4">
                <h3 className="text-[10px] font-mono tracking-widest uppercase text-muted flex items-center gap-2 mb-4">
                  <Key size={12} /> Active Access Provisions
                </h3>
                {initialUserRoles.length > 0 ? initialUserRoles.map(ur => {
                  const roleName = roles.find(r => r.id === ur.role_id)?.name || 'Unknown';
                  return (
                    <div key={ur.id} className="flex items-center justify-between p-4 border border-surface bg-surface/5 rounded-sm">
                      <div className="flex flex-col">
                        <span className="font-mono text-xs text-foreground">{ur.user_id}</span>
                        <span className="font-mono text-[10px] text-muted">User UUID</span>
                      </div>
                      <span className={`px-3 py-1 font-mono text-[9px] uppercase tracking-widest rounded-sm border ${roleName === 'Superadmin' ? 'bg-[#E4002B]/10 border-[#E4002B]/30 text-[#E4002B]' : 'bg-surface border-surface-strong text-foreground'}`}>
                        {roleName}
                      </span>
                    </div>
                  );
                }) : (
                  <div className="p-8 text-center border border-dashed border-surface rounded-sm">
                     <span className="font-mono text-[10px] text-muted uppercase tracking-widest">No active assignments found. Check seed data.</span>
                  </div>
                )}
             </div>
             <div className="lg:col-span-1">
                <div className="bg-background border border-surface p-4 rounded-sm">
                  <h3 className="text-[10px] font-mono tracking-widest uppercase text-muted flex items-center gap-2 mb-4">
                    <UserPlus size={12} /> Provision Access
                  </h3>
                  <div className="space-y-4">
                     <div>
                       <label className="block font-mono text-[9px] uppercase tracking-widest text-muted mb-2">User UUID / Email</label>
                       <input type="text" placeholder="Enter user identifier..." className="w-full bg-surface/50 border border-surface rounded-sm px-3 py-2 text-xs font-mono text-foreground focus:outline-none focus:border-surface-strong" />
                     </div>
                     <div>
                       <label className="block font-mono text-[9px] uppercase tracking-widest text-muted mb-2">Assign Role</label>
                       <select className="w-full bg-surface/50 border border-surface rounded-sm px-3 py-2 text-xs font-mono text-foreground focus:outline-none focus:border-surface-strong appearance-none">
                         {roles.map(r => (
                           <option key={r.id} value={r.id}>{r.name}</option>
                         ))}
                       </select>
                     </div>
                     <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 border border-emerald-500/30 rounded-sm text-[10px] font-mono tracking-widest uppercase transition-colors">
                       <Check size={12} /> Grant Access
                     </button>
                  </div>
                </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}
