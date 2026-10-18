import React, { useState, useEffect } from 'react';
import Badge from '../components/Badge';
import {
  ArrowLeft,
  Edit3,
  Trash2,
  FilePlus,
  FileText,
  Layers,
  ShieldCheck,
  ShieldAlert,
  User,
  Calendar,
  Clock,
  Briefcase,
  Copy,
  CheckCircle2,
  AlertTriangle,
  FolderLock,
  PlusCircle,
  Hash,
  Download,
  Share2
} from 'lucide-react';
import { getCaseAuditLogs, addCaseAuditLog } from '../utils/storage';

export default function CaseDetailView({
  caseItem,
  onBack,
  onEditCase,
  onDeleteCase,
  onOpenAddEvidence,
  onNavigate,
  evidence = [],
  onTriggerToast
}) {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'summary' | 'evidence' | 'activity'
  const [auditLogs, setAuditLogs] = useState([]);
  const [newLogNote, setNewLogNote] = useState('');
  const [copiedLabel, setCopiedLabel] = useState(null);

  useEffect(() => {
    if (caseItem?.id) {
      setAuditLogs(getCaseAuditLogs(caseItem.id));
    }
  }, [caseItem?.id]);

  if (!caseItem) {
    return (
      <div className="p-8 text-center bg-[#0D1424] rounded-2xl border border-slate-800">
        <AlertTriangle className="w-8 h-8 text-amber-400 mx-auto mb-3" />
        <h3 className="text-base font-bold text-white">No Case Selected</h3>
        <p className="text-xs text-slate-400 mt-1">Please return to the cases directory to select a case.</p>
        <button
          onClick={onBack}
          className="mt-4 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold"
        >
          Return to Cases
        </button>
      </div>
    );
  }

  // Filter evidence items linked to this case
  const linkedEvidence = evidence.filter((e) => e.caseId === caseItem.id);

  const handleCopy = (text, label) => {
    navigator.clipboard.writeText(text);
    setCopiedLabel(label);
    if (onTriggerToast) {
      onTriggerToast({
        title: 'Copied to Clipboard',
        message: `${label} copied for forensic cross-reference.`,
        type: 'info'
      });
    }
    setTimeout(() => setCopiedLabel(null), 2000);
  };

  const handleAddAuditNote = (e) => {
    e.preventDefault();
    if (!newLogNote.trim()) return;

    const entry = {
      action: 'Investigator Forensic Note Appended',
      description: newLogNote.trim(),
      officer: caseItem.assignedInvestigator || 'Sneha KR (Team MINDMESH)',
      type: 'note'
    };

    const updated = addCaseAuditLog(caseItem.id, entry);
    setAuditLogs(updated);
    setNewLogNote('');

    if (onTriggerToast) {
      onTriggerToast({
        title: 'Audit Note Logged',
        message: 'Forensic note anchored into case activity history.',
        type: 'success'
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors flex items-center gap-1.5 text-xs font-medium cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Cases</span>
          </button>
          <div className="flex items-center gap-2">
            <span className="font-mono text-cyan-400 font-bold text-xs bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30">
              {caseItem.id}
            </span>
            <Badge variant={caseItem.priority.toLowerCase()} size="xs">
              {caseItem.priority}
            </Badge>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
              {caseItem.status}
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onEditCase(caseItem)}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Edit3 className="w-3.5 h-3.5 text-cyan-400" />
            <span>Edit Case</span>
          </button>

          <button
            onClick={() => onDeleteCase(caseItem)}
            className="px-3 py-1.5 rounded-xl bg-rose-950/40 hover:bg-rose-900/40 border border-rose-500/30 text-rose-300 text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5 text-rose-400" />
            <span>Delete</span>
          </button>

          <button
            onClick={() => onOpenAddEvidence(caseItem.id)}
            className="px-3 py-1.5 rounded-xl bg-emerald-950/40 hover:bg-emerald-900/40 border border-emerald-500/30 text-emerald-300 text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5"
          >
            <FilePlus className="w-3.5 h-3.5 text-emerald-400" />
            <span>Attach Evidence</span>
          </button>

          <button
            onClick={() => onNavigate('reports')}
            className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md transition-all cursor-pointer flex items-center gap-1.5"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Generate FIR</span>
          </button>
        </div>
      </div>

      {/* Case Header Banner */}
      <div className="relative rounded-2xl p-6 bg-gradient-to-r from-[#0C152A] via-[#0E1E3D] to-[#0A1224] border border-cyan-500/30 shadow-[0_0_35px_-5px_rgba(6,182,212,0.15)] overflow-hidden">
        <div className="scanline" />

        <div className="relative z-10 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-mono text-slate-400">
              Reported on: <strong className="text-white">{caseItem.dateReported || caseItem.incidentDate}</strong>
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-xs font-mono text-cyan-300">
              Lead: {caseItem.assignedInvestigator}
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            {caseItem.title}
          </h1>

          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-1 rounded-lg text-xs font-mono bg-[#070B14] text-cyan-300 border border-slate-800">
              Vector: {caseItem.fraudType}
            </span>
            <span className="px-2.5 py-1 rounded-lg text-xs font-mono bg-[#070B14] text-slate-300 border border-slate-800">
              Victim: {caseItem.victim}
            </span>
            {caseItem.tags &&
              caseItem.tags.map((t, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-slate-800/80 text-slate-400 border border-slate-700/80"
                >
                  #{t}
                </span>
              ))}
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-1 overflow-x-auto text-xs font-medium">
        {[
          { id: 'overview', label: 'Case Overview & Metrics' },
          { id: 'summary', label: 'Incident Summary & AI Directives' },
          { id: 'evidence', label: `Associated Evidence (${linkedEvidence.length})` },
          { id: 'activity', label: `Activity History (${auditLogs.length})` }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-t-xl transition-all cursor-pointer whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-cyan-500/15 text-cyan-300 border-b-2 border-cyan-400 font-bold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB CONTENT 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Key Metrics Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-[#0D1424]/90 border border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase font-mono block">Threat Risk Score</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-bold font-mono text-rose-400">{caseItem.riskScore}/100</span>
                <span className="text-[10px] text-rose-300 font-mono">CRITICAL</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#0D1424]/90 border border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase font-mono block">Defrauded Loss</span>
              <span className="text-2xl font-bold font-mono text-rose-400 block mt-1">
                ₹{caseItem.lossAmount?.toLocaleString('en-IN') || 0}
              </span>
            </div>

            <div className="p-4 rounded-xl bg-[#0D1424]/90 border border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase font-mono block">Secured & Frozen</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-bold font-mono text-emerald-400">
                  ₹{caseItem.frozenAmount?.toLocaleString('en-IN') || 0}
                </span>
                <span className="text-xs text-emerald-300 font-mono">({caseItem.recoveryRate})</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#0D1424]/90 border border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase font-mono block">Evidence Ingested</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-bold font-mono text-cyan-400">
                  {linkedEvidence.length}
                </span>
                <span className="text-[10px] text-emerald-400 font-mono">100% SHA-256</span>
              </div>
            </div>
          </div>

          {/* Quick Details & Suspect Mule Nodes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Case Details Spec Table */}
            <div className="p-5 rounded-2xl bg-[#0D1424]/90 border border-slate-800 space-y-3">
              <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wider font-mono pb-2 border-b border-slate-800">
                Case Classification & Technical Parameters
              </h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-800/40">
                  <span className="text-slate-500">Case Identifier:</span>
                  <span className="font-mono text-cyan-300 font-bold">{caseItem.id}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/40">
                  <span className="text-slate-500">Modus Operandi:</span>
                  <span className="text-white font-medium">{caseItem.fraudType}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/40">
                  <span className="text-slate-500">Complainant / Victim:</span>
                  <span className="text-slate-200">{caseItem.victim}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/40">
                  <span className="text-slate-500">Investigation Status:</span>
                  <span className="font-mono text-cyan-400 font-semibold">{caseItem.status}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Assigned Investigator:</span>
                  <span className="text-slate-200">{caseItem.assignedInvestigator}</span>
                </div>
              </div>
            </div>

            {/* Suspect Mule Accounts & IP Nodes */}
            <div className="p-5 rounded-2xl bg-[#0D1424]/90 border border-slate-800 space-y-3">
              <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wider font-mono pb-2 border-b border-slate-800">
                Target Mule Accounts & Network IP Trace
              </h3>

              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-[10px] uppercase font-mono text-slate-500 block mb-1">
                    Beneficiary Mule Bank Accounts / VPAs:
                  </span>
                  {caseItem.muleAccounts && caseItem.muleAccounts.length > 0 ? (
                    caseItem.muleAccounts.map((acc, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-2 rounded bg-[#070B14] border border-slate-800 font-mono text-xs mb-1"
                      >
                        <span className="text-slate-200 truncate">{acc}</span>
                        <button
                          onClick={() => handleCopy(acc, `Mule Account #${idx + 1}`)}
                          className="text-cyan-400 hover:text-cyan-300 p-1"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))
                  ) : (
                    <span className="text-slate-500 text-xs">No mule accounts indexed</span>
                  )}
                </div>

                <div>
                  <span className="text-[10px] uppercase font-mono text-slate-500 block mb-1">
                    C2 IP & Origin Trailing:
                  </span>
                  {caseItem.ipTrail && caseItem.ipTrail.length > 0 ? (
                    caseItem.ipTrail.map((ip, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-2 rounded bg-[#070B14] border border-slate-800 font-mono text-xs mb-1"
                      >
                        <span className="text-cyan-300">{ip}</span>
                        <button
                          onClick={() => handleCopy(ip, `IP Address`)}
                          className="text-cyan-400 hover:text-cyan-300 p-1"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))
                  ) : (
                    <span className="text-slate-500 text-xs">IP investigation in progress</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 2: INCIDENT SUMMARY & AI DIRECTIVES */}
      {activeTab === 'summary' && (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-[#0D1424]/90 border border-slate-800 space-y-4">
            <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wider font-mono flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Full Incident Description & Victim Statement
            </h3>
            <div className="p-4 rounded-xl bg-[#070B14] border border-slate-800 text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
              {caseItem.incidentSummary || caseItem.description}
            </div>
          </div>

          {/* AI Recommended Directives */}
          {caseItem.aiRecommendations && (
            <div className="p-5 rounded-2xl bg-cyan-950/30 border border-cyan-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wider font-mono flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  TRACEWISE AI Recommended Emergency Directives
                </h3>
                <span className="text-[10px] font-mono text-cyan-400 bg-cyan-900/60 px-2 py-0.5 rounded">
                  BNS / IT ACT 2000
                </span>
              </div>
              <ul className="space-y-2 text-xs text-slate-200">
                {caseItem.aiRecommendations.map((rec, idx) => (
                  <li
                    key={idx}
                    className="p-3 rounded-lg bg-[#070B14] border border-slate-800 flex items-start gap-2.5"
                  >
                    <span className="text-cyan-400 font-mono font-bold">[{idx + 1}]</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT 3: ASSOCIATED EVIDENCE */}
      {activeTab === 'evidence' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400">
              Evidence artifacts cryptographically linked to Case <strong>[{caseItem.id}]</strong>
            </span>
            <button
              onClick={() => onOpenAddEvidence(caseItem.id)}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-semibold shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <FilePlus className="w-3.5 h-3.5" />
              <span>Attach New Evidence</span>
            </button>
          </div>

          {linkedEvidence.length === 0 ? (
            <div className="p-8 text-center rounded-2xl bg-[#0D1424] border border-slate-800 space-y-3">
              <FolderLock className="w-8 h-8 text-slate-500 mx-auto" />
              <h4 className="text-sm font-bold text-white">No Evidence Linked to This Case Yet</h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Ingest digital forensic artifacts (APK files, PCAP dumps, audio/video recordings) with dual SHA-256 seals.
              </p>
              <button
                onClick={() => onOpenAddEvidence(caseItem.id)}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold"
              >
                Ingest First Evidence Artifact
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {linkedEvidence.map((ev) => (
                <div
                  key={ev.id}
                  className="p-4 rounded-xl bg-[#0D1424]/90 border border-slate-800 hover:border-cyan-500/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30">
                        {ev.id}
                      </span>
                      <Badge variant="success" size="xs">
                        {ev.custodyStatus}
                      </Badge>
                    </div>
                    <div className="font-bold text-white text-sm truncate flex items-center gap-2">
                      <span>{ev.fileName}</span>
                      <span className="text-xs text-slate-500 font-normal">({ev.fileSize})</span>
                    </div>
                    <div className="text-slate-400 text-xs font-mono">
                      SHA-256: <span className="text-cyan-300 break-all">{ev.sha256}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-[10px] font-mono text-emerald-400 px-2 py-1 rounded bg-emerald-950/40 border border-emerald-500/30">
                      {ev.tamperCheck}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT 4: ACTIVITY HISTORY / AUDIT TRAIL */}
      {activeTab === 'activity' && (
        <div className="space-y-6">
          {/* Quick Audit Note Form */}
          <form
            onSubmit={handleAddAuditNote}
            className="p-4 rounded-xl bg-[#0D1424]/90 border border-slate-800 flex flex-col sm:flex-row gap-3"
          >
            <input
              type="text"
              value={newLogNote}
              onChange={(e) => setNewLogNote(e.target.value)}
              placeholder="Append forensic observation, bank confirmation UTR, or legal dispatch note..."
              className="flex-1 bg-[#080E1C] border border-slate-700 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 font-mono"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Log Note</span>
            </button>
          </form>

          {/* Chronological Audit Log List */}
          <div className="space-y-3">
            {auditLogs.map((log) => (
              <div
                key={log.id}
                className="p-4 rounded-xl bg-[#0D1424]/90 border border-slate-800 flex items-start gap-3 text-xs"
              >
                <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 mt-0.5">
                  <Clock className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between text-slate-400 text-[11px] font-mono mb-1">
                    <span className="text-white font-semibold text-xs">{log.action}</span>
                    <span>{log.timestamp}</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed">{log.description}</p>
                  <div className="mt-2 text-[10px] text-cyan-400 font-mono">
                    Officer / Node: {log.officer}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
