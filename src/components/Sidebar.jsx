import React from 'react';
import {
  ShieldAlert,
  LayoutDashboard,
  Briefcase,
  FileKey2,
  Globe,
  Network,
  Clock,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Cpu,
  Users
} from 'lucide-react';

export default function Sidebar({
  activePage,
  setActivePage,
  isCollapsed,
  setIsCollapsed,
  caseCount = 42,
  evidenceCount = 386,
  urlCount = 154
}) {
  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null,
      desc: 'Command Center & KPI telemetry'
    },
    {
      id: 'cases',
      label: 'Cases',
      icon: Briefcase,
      badge: `${caseCount}`,
      badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
      desc: 'Active cyber fraud dossiers'
    },
    {
      id: 'evidence',
      label: 'Evidence Vault',
      icon: FileKey2,
      badge: `${evidenceCount}`,
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      desc: 'SHA-256 cryptographically sealed chain'
    },
    {
      id: 'analyzer',
      label: 'URL Analyzer',
      icon: Globe,
      badge: `${urlCount}`,
      badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
      desc: 'Phishing sandbox & DOM analysis'
    },
    {
      id: 'graph',
      label: 'Evidence Graph',
      icon: Network,
      badge: 'LIVE',
      badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      desc: 'Entity clustering & mule link tracing'
    },
    {
      id: 'timeline',
      label: 'Timeline',
      icon: Clock,
      badge: 'OCR',
      badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      desc: 'Kill chain & evidence entity OCR'
    },
    {
      id: 'reports',
      label: 'Reports & FIR',
      icon: FileText,
      badge: 'BNS/IT',
      badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      desc: 'Automated charge sheets & Sec 65B'
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      badge: null,
      desc: 'Platform, models & team config'
    }
  ];

  return (
    <aside
      className={`relative flex flex-col bg-[#070D1A] border-r border-slate-800/80 transition-all duration-300 z-30 select-none ${
        isCollapsed ? 'w-20' : 'w-72'
      }`}
    >
      {/* Top Branding Section */}
      <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
        {!isCollapsed ? (
          <div className="flex items-center gap-3">
            <div className="relative p-2.5 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 shadow-[0_0_15px_-3px_rgba(6,182,212,0.3)]">
              <ShieldAlert className="w-6 h-6 text-cyan-400" />
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-white tracking-wider text-base">TRACEWISE</span>
                <span className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                  AI
                </span>
              </div>
              <p className="text-[10px] uppercase tracking-wider text-slate-400 flex items-center gap-1 font-mono">
                <span className="text-cyan-400">TEAM</span> MINDMESH
              </p>
            </div>
          </div>
        ) : (
          <div className="mx-auto p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <ShieldAlert className="w-6 h-6" />
          </div>
        )}

        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors ${
            isCollapsed ? 'hidden' : 'block'
          }`}
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>

      {/* Collapse Toggle for Mini Mode */}
      {isCollapsed && (
        <div className="p-2 flex justify-center border-b border-slate-800/60">
          <button
            onClick={() => setIsCollapsed(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
            title="Expand sidebar"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Team MINDMESH Badge Banner (Expanded only) */}
      {!isCollapsed && (
        <div className="mx-3 mt-3 px-3 py-2 rounded-lg bg-gradient-to-r from-blue-950/40 to-cyan-950/40 border border-cyan-500/20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-xs font-semibold text-slate-200">Hackathon Unit</span>
          </div>
          <span className="text-[10px] font-mono text-cyan-300 font-bold px-1.5 py-0.5 rounded bg-cyan-900/60">
            MINDMESH
          </span>
        </div>
      )}

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              className={`w-full flex items-center rounded-xl transition-all duration-200 group text-left ${
                isCollapsed ? 'justify-center p-3' : 'px-3.5 py-2.5 justify-between'
              } ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-500/15 via-blue-500/10 to-transparent text-white border-l-4 border-cyan-400 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/40'
              }`}
              title={isCollapsed ? item.label : undefined}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-5 h-5 transition-colors ${
                    isActive ? 'text-cyan-400' : 'text-slate-400 group-hover:text-cyan-300'
                  }`}
                />
                {!isCollapsed && (
                  <div>
                    <span className="text-sm font-medium tracking-wide block">{item.label}</span>
                    <span className="text-[10px] text-slate-500 block truncate max-w-[130px]">
                      {item.desc}
                    </span>
                  </div>
                )}
              </div>

              {!isCollapsed && item.badge && (
                <span
                  className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded-full border ${
                    item.badgeColor || 'bg-slate-800 text-slate-300 border-slate-700'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom Core System Telemetry */}
      <div className="p-3 border-t border-slate-800/80 bg-[#060A14]">
        {!isCollapsed ? (
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-slate-400 flex items-center gap-1.5 font-mono text-[11px]">
                <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                AI ENGINE
              </span>
              <span className="text-emerald-400 font-mono text-[10px] font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                ONLINE
              </span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-1 overflow-hidden">
              <div className="bg-gradient-to-r from-cyan-400 to-blue-500 h-1 w-[94%]" />
            </div>
            <div className="flex justify-between items-center mt-1.5 text-[10px] text-slate-500 font-mono">
              <span>SHA-256 Validated</span>
              <span>Latency 12ms</span>
            </div>
          </div>
        ) : (
          <div className="flex justify-center" title="AI Core Online (12ms)">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          </div>
        )}
      </div>
    </aside>
  );
}
