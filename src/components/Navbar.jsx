import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Bell,
  Shield,
  PlusCircle,
  FilePlus,
  Globe,
  Radio,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  ChevronDown,
  Sparkles
} from 'lucide-react';

export default function Navbar({
  searchTerm,
  setSearchTerm,
  onOpenNewCase,
  onOpenAddEvidence,
  onQuickUrlScan,
  onOpenDemoCases,
  notifications = [],
  onClearNotifications
}) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const notifRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-20 bg-[#0A101F]/90 backdrop-blur-xl border-b border-slate-800/80 px-4 sm:px-6 py-3">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Global Cyber Search Bar */}
        <div className="flex-1 max-w-md relative">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search Case ID (TW-8941), SHA-256 Hash, Suspect, IP, or Mule Account..."
              className="w-full bg-[#0E172B] border border-slate-700/80 rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all font-mono"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Center: Live Threat Intelligence Ticker */}
        <div className="hidden xl:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/40 border border-cyan-500/20 text-xs text-cyan-300">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
          </span>
          <span className="font-semibold text-slate-400 font-mono text-[11px]">THREAT FEED:</span>
          <span className="text-slate-200 truncate max-w-xs font-mono text-[11px]">
            Active Trojan "SBI_Rewards_v4.apk" detected forwarding OTPs to Telegram C2
          </span>
        </div>

        {/* Right: Quick Action Buttons & Profile */}
        <div className="flex items-center gap-2.5">
          {/* Quick Action: Load Demo Case (Judge Quick Start) */}
          {onOpenDemoCases && (
            <button
              onClick={onOpenDemoCases}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/40 font-medium text-xs sm:text-sm shadow-[0_0_15px_-3px_rgba(168,85,247,0.3)] transition-all cursor-pointer"
              title="Judge Quick Start: Explore Realistic Fictional Demo Cases"
            >
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>Load Demo Case</span>
            </button>
          )}

          {/* Quick Action: New Case */}
          <button
            onClick={onOpenNewCase}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-medium text-xs sm:text-sm shadow-[0_0_15px_-3px_rgba(6,182,212,0.3)] transition-all cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span className="hidden sm:inline">New Case</span>
          </button>

          {/* Quick Action: Ingest Evidence */}
          <button
            onClick={onOpenAddEvidence}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-200 font-medium text-xs sm:text-sm transition-all cursor-pointer"
          >
            <FilePlus className="w-4 h-4 text-emerald-400" />
            <span>Ingest Evidence</span>
          </button>

          {/* Quick Action: URL Scan */}
          <button
            onClick={onQuickUrlScan}
            className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-200 font-medium text-xs sm:text-sm transition-all cursor-pointer"
          >
            <Globe className="w-4 h-4 text-cyan-400" />
            <span>Scan URL</span>
          </button>

          {/* Notifications Center */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-xl bg-slate-800/60 hover:bg-slate-750 border border-slate-700/60 text-slate-300 hover:text-white transition-colors"
              aria-label="View notifications"
            >
              <Bell className="w-4 h-4" />
              {notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-[10px] font-bold text-white flex items-center justify-center font-mono animate-pulse">
                  {notifications.length}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-[#0D1527] border border-cyan-500/30 shadow-[0_0_30px_-5px_rgba(6,182,212,0.25)] p-4 z-50 animate-in fade-in duration-200">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-cyan-400" />
                    <h4 className="text-sm font-bold text-white">Forensic Intel Alerts</h4>
                  </div>
                  {notifications.length > 0 && (
                    <button
                      onClick={onClearNotifications}
                      className="text-[11px] text-cyan-400 hover:underline"
                    >
                      Clear all
                    </button>
                  )}
                </div>

                <div className="mt-3 space-y-2.5 max-h-72 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <p className="text-xs text-slate-500 text-center py-4">No active critical alerts</p>
                  ) : (
                    notifications.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/30 transition-all text-xs"
                      >
                        <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-1">
                          <span className="text-cyan-400 font-semibold">{item.source || 'ALERT'}</span>
                          <span>{item.time || 'Just now'}</span>
                        </div>
                        <p className="text-slate-200 font-medium">{item.text}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Profile / MINDMESH badge */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2.5 pl-2 pr-1.5 py-1 rounded-xl bg-slate-800/40 hover:bg-slate-800 border border-slate-700/60 transition-all text-left"
            >
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center font-bold text-white text-xs shadow-inner">
                SK
              </div>
              <div className="hidden sm:block">
                <div className="text-xs font-semibold text-white leading-tight">Sneha KR</div>
                <div className="text-[10px] text-cyan-400 font-mono leading-none">MINDMESH LEAD</div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
            </button>

            {/* Profile Menu Dropdown */}
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-[#0D1527] border border-cyan-500/30 shadow-2xl p-4 z-50 animate-in fade-in duration-200">
                <div className="pb-3 border-b border-slate-800">
                  <div className="text-sm font-bold text-white">Sneha KR</div>
                  <div className="text-xs text-slate-400">Lead Forensics & AI Architect</div>
                  <div className="mt-1 inline-block px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                    Team MINDMESH Core
                  </div>
                </div>
                <div className="py-2 text-xs text-slate-300 space-y-1">
                  <div className="flex justify-between py-1">
                    <span className="text-slate-500">Security Clearance:</span>
                    <span className="font-mono text-emerald-400 font-bold">LEVEL-5 CLASSIFIED</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-500">PGP Key ID:</span>
                    <span className="font-mono text-slate-300">0x88FA192C</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-500">Audit Status:</span>
                    <span className="font-mono text-cyan-400">Compliant (ISO 27037)</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
