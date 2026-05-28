'use client';

import React, { useState } from 'react';
import { useTheme, ThemeName } from '@/components/theme-provider';
import { Button } from '@/components/ui/button';
import { 
  Shield, 
  Users, 
  Terminal, 
  Activity, 
  Database, 
  Server, 
  RotateCcw, 
  CheckCircle2, 
  AlertCircle,
  Palette,
  Home
} from 'lucide-react';
import Link from 'next/link';

interface MockUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'client' | 'coach';
  theme: ThemeName;
  status: 'Active' | 'Offline';
  lastActive: string;
}

export default function AdminPortal() {
  const { setTheme } = useTheme();
  const [users, setUsers] = useState<MockUser[]>([
    {
      id: 'FWP-2026-M8915',
      name: 'Mirna Workout Plan User',
      email: 'mirna@freeworkoutplanner.com',
      role: 'client',
      theme: 'pink',
      status: 'Active',
      lastActive: 'Just Now',
    },
    {
      id: 'FWP-2026-T4821',
      name: 'Coach Satram',
      email: 'satram@freeworkoutplanner.com',
      role: 'coach',
      theme: 'emerald',
      status: 'Offline',
      lastActive: '2 Hours Ago',
    },
    {
      id: 'FWP-2026-A1002',
      name: 'System Admin',
      email: 'admin@freeworkoutplanner.com',
      role: 'admin',
      theme: 'coral',
      status: 'Active',
      lastActive: 'Just Now',
    },
  ]);

  const [logs, setLogs] = useState<string[]>([
    '[INFO] [2026-05-29 00:36] Server SSE transport connection established for client FWP-2026-M8915',
    '[TOOL] [2026-05-29 00:36] Tool log-workout executed successfully - overload recommendation saved',
    '[CACHE] [2026-05-29 00:35] Upstash Redis cache hit for exercise library metadata (rdl_hip_thrust)',
    '[DB] [2026-05-29 00:35] Supabase PostgreSQL database connections verified - status: 100% operational',
    '[INFO] [2026-05-29 00:34] Platform diagnostics verified - 0 warnings, 0 errors logged',
  ]);

  const overrideUserTheme = (userId: string, newTheme: ThemeName) => {
    // Update local table view
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, theme: newTheme } : u));
    
    // If we're overriding our own theme or the active user, apply it dynamically in the UI
    const target = users.find(u => u.id === userId);
    if (target && target.role === 'admin') {
      setTheme(newTheme);
    }

    setLogs(prev => [
      `[ADMIN] [${new Date().toLocaleTimeString()}] Overrode theme for user ${userId} to ${newTheme.toUpperCase()}`,
      ...prev
    ]);
  };

  const clearSystemLogs = () => {
    setLogs([`[INFO] [${new Date().toLocaleTimeString()}] System event log buffer cleared.`]);
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black text-white p-6 selection:bg-primary/30">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* HEADER BRANDING */}
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/5 pb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-950 border border-white/10 flex items-center justify-center shadow-lg shadow-black/80">
              <Shield className="w-6 h-6 text-[hsl(var(--primary))]" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight gradient-text">Control Center</h1>
              <p className="text-xs text-slate-400">Manage clients, configure system variables, and monitor performance.</p>
            </div>
          </div>

          <Link href="/">
            <Button variant="outline" className="rounded-xl border-white/5 bg-slate-900/30 hover:bg-slate-900/60 flex items-center gap-2 text-xs">
              <Home className="w-4 h-4 text-slate-400" />
              Client Dashboard
            </Button>
          </Link>
        </header>

        {/* METRIC STATS OVERVIEW CARD GRID */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="glass-panel p-4 rounded-2xl flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center border border-white/5 text-primary">
              <Users className="w-5 h-5 text-[hsl(var(--primary))]" />
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-500">Total Users</div>
              <div className="text-xl font-bold font-mono mt-0.5">124 Clients</div>
            </div>
          </div>

          <div className="glass-panel p-4 rounded-2xl flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center border border-white/5 text-secondary">
              <Activity className="w-5 h-5 text-[hsl(var(--secondary))]" />
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-500">SSE Tools Latency</div>
              <div className="text-xl font-bold font-mono mt-0.5">12 ms</div>
            </div>
          </div>

          <div className="glass-panel p-4 rounded-2xl flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center border border-white/5 text-emerald-450">
              <Database className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-500">DB Connections</div>
              <div className="text-xl font-bold font-mono mt-0.5">4 Active</div>
            </div>
          </div>

          <div className="glass-panel p-4 rounded-2xl flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center border border-white/5 text-amber-450">
              <Server className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-500">Cache Hit Rate</div>
              <div className="text-xl font-bold font-mono mt-0.5">98.2%</div>
            </div>
          </div>
        </div>

        {/* MAIN SPLIT PANELS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* USER DIRECTORY & THEME OVERRIDES (COL-SPAN-2) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="glass-panel p-6 rounded-3xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-lg text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-[hsl(var(--primary))]" />
                  User & Client Directory
                </h3>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-slate-900 border border-white/5 text-slate-400">
                  Realtime Sync Live
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/5 text-slate-500 text-xs uppercase tracking-wider font-bold">
                      <th className="py-3 px-2">Client Profile</th>
                      <th className="py-3 px-2">Role</th>
                      <th className="py-3 px-2">Active Color Accent</th>
                      <th className="py-3 px-2 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(u => (
                      <tr key={u.id} className="border-b border-white/5 text-sm hover:bg-slate-900/20 transition-all">
                        <td className="py-4 px-2">
                          <div className="font-bold text-white">{u.name}</div>
                          <div className="text-[10px] text-slate-500 font-mono mt-0.5">{u.id} • {u.email}</div>
                        </td>
                        <td className="py-4 px-2">
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                            u.role === 'admin' 
                              ? 'bg-red-950/30 border border-red-500/20 text-red-400' 
                              : u.role === 'coach'
                              ? 'bg-amber-950/30 border border-amber-500/20 text-amber-400'
                              : 'bg-emerald-950/30 border border-emerald-500/20 text-emerald-400'
                          }`}>
                            {u.role.toUpperCase()}
                          </span>
                        </td>
                        <td className="py-4 px-2 font-mono text-xs">
                          <div className="flex items-center gap-2">
                            <span className={`w-3 h-3 rounded-full ${
                              u.theme === 'coral' ? 'bg-coral-500' :
                              u.theme === 'pink' ? 'bg-pink-500' :
                              u.theme === 'emerald' ? 'bg-emerald-500' : 'bg-sky-500'
                            }`} />
                            <span className="capitalize">{u.theme}</span>
                          </div>
                        </td>
                        <td className="py-4 px-2 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <Button 
                              onClick={() => overrideUserTheme(u.id, 'pink')}
                              variant="ghost" 
                              size="sm" 
                              className={`h-7 px-2.5 rounded-lg border text-[10px] ${u.theme === 'pink' ? 'border-pink-500/40 bg-pink-500/10 text-pink-400' : 'border-white/5 hover:bg-white/5 text-slate-400'}`}
                            >
                              Pink
                            </Button>
                            <Button 
                              onClick={() => overrideUserTheme(u.id, 'emerald')}
                              variant="ghost" 
                              size="sm" 
                              className={`h-7 px-2.5 rounded-lg border text-[10px] ${u.theme === 'emerald' ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400' : 'border-white/5 hover:bg-white/5 text-slate-400'}`}
                            >
                              Emerald
                            </Button>
                            <Button 
                              onClick={() => overrideUserTheme(u.id, 'coral')}
                              variant="ghost" 
                              size="sm" 
                              className={`h-7 px-2.5 rounded-lg border text-[10px] ${u.theme === 'coral' ? 'border-primary/40 bg-primary/10 text-primary' : 'border-white/5 hover:bg-white/5 text-slate-400'}`}
                            >
                              Coral
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* DIAGNOSTICS & SYSTEM TERMINAL LOGS (COL-SPAN-1) */}
          <div className="space-y-4">
            <div className="glass-panel p-6 rounded-3xl space-y-4 h-full flex flex-col">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-lg text-white flex items-center gap-2">
                  <Terminal className="w-5 h-5 text-[hsl(var(--secondary))]" />
                  Diagnostics Server
                </h3>
                <Button 
                  onClick={clearSystemLogs}
                  variant="ghost" 
                  size="icon" 
                  className="w-8 h-8 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white"
                  title="Clear Console Logs"
                >
                  <RotateCcw className="w-4 h-4" />
                </Button>
              </div>

              {/* TERMINAL BOX */}
              <div className="flex-1 bg-black/60 border border-white/5 rounded-2xl p-4 font-mono text-[10px] text-slate-350 space-y-3.5 overflow-y-auto max-h-[300px] min-h-[220px]">
                {logs.map((log, i) => (
                  <div key={i} className="leading-relaxed border-l-2 border-slate-750 pl-2">
                    <span className="text-[hsl(var(--primary))] font-bold mr-1">&gt;</span>
                    {log}
                  </div>
                ))}
              </div>

              {/* SYSTEM HEALTH CARDS */}
              <div className="p-3 bg-slate-900/30 border border-white/5 rounded-2xl flex items-center justify-between text-xs">
                <span className="text-slate-400">Database Status:</span>
                <span className="flex items-center gap-1.5 text-emerald-450 font-bold text-emerald-400">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Operational
                </span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
