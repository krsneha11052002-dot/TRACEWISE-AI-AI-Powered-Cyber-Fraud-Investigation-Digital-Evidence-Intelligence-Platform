import React, { useState } from 'react';
import StatCard from '../components/StatCard';
import Badge from '../components/Badge';
import {
  ShieldAlert,
  ShieldCheck,
  TrendingUp,
  AlertTriangle,
  FolderLock,
  Globe,
  FileKey2,
  Cpu,
  ArrowUpRight,
  ExternalLink,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Sparkles,
  Zap,
  Activity,
  Layers,
  ChevronRight
} from 'lucide-react';

export default function DashboardView({
  stats,
  cases = [],
  evidence = [],
  activityFeed = [],
  onSelectCase,
  onOpenNewCase,
  onOpenAddEvidence,
  onOpenDemoCases,
  onNavigate
}) {
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [tableSearch, setTableSearch] = useState('');

  const filteredCases = cases.filter((c) => {
    const matchesFilter =
      filterStatus === 'ALL' ||
      (filterStatus === 'CRITICAL' && c.priority === 'Critical') ||
      (filterStatus === 'ACTIVE' && c.status === 'Active') ||
      (filterStatus === 'SEIZED' && c.status === 'Seized');

    const matchesSearch =
      c.title.toLowerCase().includes(tableSearch.toLowerCase()) ||
      c.id.toLowerCase().includes(tableSearch.toLowerCase()) ||
      c.victim.toLowerCase().includes(tableSearch.toLowerCase()) ||
      c.fraudType.toLowerCase().includes(tableSearch.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Top Welcome Banner with Team MINDMESH Crest */}
      <div className="relative rounded-2xl p-6 bg-gradient-to-r from-[#0C1427] via-[#0E1B38] to-[#0A1122] border border-cyan-500/20 overflow-hidden shadow-[0_0_35px_-5px_rgba(6,182,212,0.15)]">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(circle_at_right,rgba(6,182,212,0.15),transparent_70%)] pointer-events-none" />
        <div className="scanline" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                HACKATHON CYBER WAR ROOM
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-blue-500/10 text-blue-300 border border-blue-500/30">
                TEAM MINDMESH
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              TRACEWISE AI <span className="text-cyan-400">Forensic Command</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              AI-Powered Cyber Fraud Investigation & Digital Evidence Intelligence Platform. Real-time
              mule node correlation, automated Section 91 CrPC freeze directives, and ISO 27037 court-sealed
              cryptographic chains.
            </p>
          </div>

          {/* Quick Action Hub */}
          <div className="flex flex-wrap items-center gap-2.5">
            {onOpenDemoCases && (
              <button
                onClick={onOpenDemoCases}
                className="px-4 py-2 rounded-xl bg-purple-600/30 hover:bg-purple-600/40 text-purple-200 border border-purple-500/40 text-xs sm:text-sm font-semibold shadow-[0_0_20px_-3px_rgba(168,85,247,0.4)] transition-all cursor-pointer flex items-center gap-2"
                title="Explore pre-correlated cyber fraud cases for judges"
              >
                <Sparkles className="w-4 h-4 text-purple-300" />
                <span>Load Demo Case</span>
              </button>
            )}
            <button
              onClick={onOpenNewCase}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs sm:text-sm font-semibold shadow-[0_0_20px_-3px_rgba(6,182,212,0.4)] transition-all cursor-pointer flex items-center gap-2"
            >
              <Zap className="w-4 h-4 text-cyan-200" />
              <span>+ Log Incident</span>
            </button>
            <button
              onClick={() => onNavigate('analyzer')}
              className="px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-200 text-xs sm:text-sm font-medium transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Globe className="w-4 h-4 text-cyan-400" />
              <span>Scan Phishing URL</span>
            </button>
            <button
              onClick={() => onNavigate('graph')}
              className="px-3.5 py-2 rounded-xl bg-purple-950/40 hover:bg-purple-900/40 border border-purple-500/30 text-purple-300 text-xs sm:text-sm font-medium transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Layers className="w-4 h-4" />
              <span>Explore Mule Graph</span>
            </button>
          </div>
        </div>
      </div>

      {/* Primary KPI Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Active Fraud Cases"
          value={stats.activeCases || cases.length}
          subtext="Under multi-agency triage"
          trend="+8 this week"
          trendPositive={false}
          icon={FolderLock}
          accent="cyan"
          onClick={() => onNavigate('cases')}
        />
        <StatCard
          title="Fraud Prevented / Seized"
          value={stats.fraudPrevented}
          subtext={`Avg recovery rate: ${stats.fundsFrozenRate}`}
          trend="+₹48L recovered"
          trendPositive={true}
          icon={TrendingUp}
          accent="emerald"
        />
        <StatCard
          title="Evidence Sealed (SHA-256)"
          value={`${stats.evidenceItems} Files`}
          subtext="100.0% Tamper Verification"
          trend="0 Bit Deviation"
          trendPositive={true}
          icon={FileKey2}
          accent="blue"
          onClick={() => onNavigate('evidence')}
        />
        <StatCard
          title="Rogue Phishing URLs"
          value={stats.highRiskUrlsFlagged}
          subtext="Auto takedowns requested"
          trend="+12 flagged today"
          trendPositive={false}
          icon={Globe}
          accent="rose"
          onClick={() => onNavigate('analyzer')}
        />
      </div>

      {/* Middle Row: Live Cyber Threat Matrix & Quick AI Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Threat Vector Distribution */}
        <div className="lg:col-span-2 rounded-2xl p-5 bg-[#0D1424]/90 border border-slate-800/80 backdrop-blur-md">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800/80">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                <Activity className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white tracking-wide">
                  Active Cyber Fraud Modus Breakdown
                </h3>
                <p className="text-[11px] text-slate-400">
                  Real-time clustering across 1930 Helpline tickets & banking feeds
                </p>
              </div>
            </div>
            <span className="text-[11px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              AI CONFIDENCE 99.4%
            </span>
          </div>

          <div className="mt-4 space-y-3.5">
            {[
              { label: 'Banking APK Malware & OTP Stealers (Fake SBI/HDFC)', pct: 38, count: '16 cases', color: 'from-cyan-500 to-blue-500', bg: 'bg-cyan-500' },
              { label: 'Telegram Part-Time / Prepaid Task Ponzi Schemes', pct: 26, count: '11 cases', color: 'from-blue-500 to-indigo-500', bg: 'bg-blue-500' },
              { label: 'Digital Arrest & Virtual Extortion (Fake CBI/Customs)', pct: 18, count: '8 cases', color: 'from-rose-500 to-red-600', bg: 'bg-rose-500' },
              { label: 'Predatory Instant Loan Apps with Contact Harassment', pct: 12, count: '5 cases', color: 'from-amber-500 to-orange-500', bg: 'bg-amber-500' },
              { label: 'Cross-Chain DEX / Crypto Tumbler Laundering', pct: 6, count: '2 cases', color: 'from-purple-500 to-pink-500', bg: 'bg-purple-500' }
            ].map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-medium">{item.label}</span>
                  <div className="flex items-center gap-2 font-mono">
                    <span className="text-slate-400">{item.count}</span>
                    <span className="font-bold text-white">{item.pct}%</span>
                  </div>
                </div>
                <div className="w-full bg-slate-800/80 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-2 rounded-full bg-gradient-to-r ${item.color} transition-all duration-700`}
                    style={{ width: `${item.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Quick Stat Pill Highlights */}
          <div className="mt-5 pt-4 border-t border-slate-800/80 grid grid-cols-3 gap-3 text-center">
            <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="text-[10px] text-slate-400 uppercase font-mono">Avg Triage Time</div>
              <div className="text-base font-bold text-cyan-400 font-mono mt-0.5">4.2 min</div>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="text-[10px] text-slate-400 uppercase font-mono">Mules Identified</div>
              <div className="text-base font-bold text-amber-400 font-mono mt-0.5">89 accounts</div>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="text-[10px] text-slate-400 uppercase font-mono">Court Admissible</div>
              <div className="text-base font-bold text-emerald-400 font-mono mt-0.5">100% Sec 65B</div>
            </div>
          </div>
        </div>

        {/* Live Forensic Activity Stream */}
        <div className="rounded-2xl p-5 bg-[#0D1424]/90 border border-slate-800/80 backdrop-blur-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
              <div className="flex items-center gap-2">
                <div className="relative w-2 h-2 rounded-full bg-cyan-400">
                  <span className="absolute inset-0 rounded-full bg-cyan-400 animate-ping" />
                </div>
                <h3 className="text-sm font-bold text-white">Live Forensic Log</h3>
              </div>
              <span className="text-[10px] font-mono text-cyan-400">AUTO-SYNC</span>
            </div>

            <div className="mt-3 space-y-3">
              {activityFeed.slice(0, 4).map((act) => (
                <div
                  key={act.id}
                  className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/30 transition-all text-xs"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-mono text-slate-400">{act.time}</span>
                    <Badge variant={act.badge === 'VERIFIED' ? 'success' : act.badge === 'CRITICAL' ? 'critical' : 'cyan'} size="xs">
                      {act.badge}
                    </Badge>
                  </div>
                  <h4 className="text-white font-semibold text-xs">{act.title}</h4>
                  <p className="text-slate-400 text-[11px] mt-0.5 line-clamp-2">{act.desc}</p>
                  <div className="mt-2 text-[10px] text-cyan-400/80 font-mono flex items-center justify-between">
                    <span>Officer: {act.officer}</span>
                    <span>✓ SHA-256 Logged</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => onNavigate('timeline')}
            className="w-full mt-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-cyan-300 text-xs font-semibold border border-slate-700 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>View Complete Audit Timeline</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Recent Investigations Table */}
      <div className="rounded-2xl bg-[#0D1424]/90 border border-slate-800/80 backdrop-blur-md overflow-hidden">
        {/* Table Header Controls */}
        <div className="p-5 border-b border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <FolderLock className="w-5 h-5 text-cyan-400" />
              Recent High-Priority Cyber Fraud Cases
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Multi-state coordinated investigations with active bank freeze directives
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Filter Tabs */}
            <div className="flex items-center p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs">
              {['ALL', 'CRITICAL', 'ACTIVE', 'SEIZED'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-3 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                    filterStatus === status
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>

            <button
              onClick={() => onNavigate('cases')}
              className="px-3 py-1.5 rounded-xl border border-slate-700 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span>View All ({cases.length})</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-[#090F1E] text-slate-400 uppercase text-[11px] font-mono border-b border-slate-800">
              <tr>
                <th className="px-5 py-3.5">Case ID & Operation</th>
                <th className="px-4 py-3.5">Victim & Loss</th>
                <th className="px-4 py-3.5">Fraud Modus</th>
                <th className="px-4 py-3.5">Recovery Status</th>
                <th className="px-4 py-3.5">Priority</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {filteredCases.slice(0, 5).map((c) => (
                <tr
                  key={c.id}
                  className="hover:bg-slate-800/40 transition-colors group cursor-pointer"
                  onClick={() => onSelectCase(c)}
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-cyan-400 font-bold text-xs">{c.id}</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                        {c.evidenceCount} Evidences
                      </span>
                    </div>
                    <div className="font-semibold text-white mt-1 group-hover:text-cyan-300 transition-colors line-clamp-1">
                      {c.title}
                    </div>
                  </td>

                  <td className="px-4 py-4">
                    <div className="text-slate-300 line-clamp-1">{c.victim}</div>
                    <div className="font-mono text-xs text-rose-400 font-semibold mt-0.5">
                      ₹{c.lossAmount.toLocaleString('en-IN')}
                    </div>
                  </td>

                  <td className="px-4 py-4">
                    <span className="text-slate-300 block">{c.fraudType}</span>
                    <span className="text-[11px] text-slate-500 font-mono">{c.assignedInvestigator}</span>
                  </td>

                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-slate-800 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-emerald-400 h-1.5 rounded-full"
                          style={{ width: c.recoveryRate }}
                        />
                      </div>
                      <span className="font-mono text-xs text-emerald-400 font-semibold">
                        {c.recoveryRate}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">
                      ₹{c.frozenAmount.toLocaleString('en-IN')} frozen
                    </span>
                  </td>

                  <td className="px-4 py-4">
                    <Badge variant={c.priority.toLowerCase()} size="sm">
                      {c.priority}
                    </Badge>
                  </td>

                  <td className="px-4 py-4 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectCase(c);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-medium transition-all inline-flex items-center gap-1"
                    >
                      <span>Investigate</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
