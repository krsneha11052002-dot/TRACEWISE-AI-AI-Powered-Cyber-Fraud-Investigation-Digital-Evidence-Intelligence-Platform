import React, { useState } from 'react';
import Badge from '../components/Badge';
import { TEAM_MEMBERS } from '../data/mockData';
import {
  Settings,
  Cpu,
  Users,
  Key,
  Shield,
  Save,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Globe,
  Database,
  Moon,
  Volume2,
  VolumeX,
  Sparkles
} from 'lucide-react';

export default function SettingsView({ onTriggerToast }) {
  const [selectedModel, setSelectedModel] = useState('tracewise-4.2');
  const [enableSound, setEnableSound] = useState(true);
  const [autoLockMinutes, setAutoLockMinutes] = useState('15');
  const [enforceDualHash, setEnforceDualHash] = useState(true);
  const [threatFeeds, setThreatFeeds] = useState({
    certIn: true,
    virusTotal: true,
    shodan: true,
    helpline1930: true
  });

  const handleSaveSettings = () => {
    if (onTriggerToast) {
      onTriggerToast({
        title: 'Platform Preferences Saved',
        message: 'Security policies and AI model configs updated successfully.',
        type: 'success'
      });
    }
  };

  const toggleFeed = (key) => {
    setThreatFeeds((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <Settings className="w-6 h-6 text-cyan-400" />
              Platform Configuration & Team Control
            </h1>
            <span className="px-2 py-0.5 rounded-full text-xs font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              SYS-CONFIG
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400">
            Configure AI analysis engines, team permissions, threat intelligence feeds, and evidence policies
          </p>
        </div>

        <button
          onClick={handleSaveSettings}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs sm:text-sm font-semibold shadow-[0_0_20px_-3px_rgba(6,182,212,0.4)] transition-all cursor-pointer flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          <span>Save Changes</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* AI Threat Engine & Model Selection */}
        <div className="p-5 rounded-2xl bg-[#0D1424]/90 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wider font-mono flex items-center gap-2">
              <Cpu className="w-4 h-4" />
              AI Forensic Inference Engine
            </h3>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
              LOW-LATENCY
            </span>
          </div>

          <p className="text-xs text-slate-300">
            Select the LLM backbone responsible for automated modus clustering, legal charge sheet formatting, and
            mule link extraction:
          </p>

          <div className="space-y-2.5">
            {[
              {
                id: 'tracewise-4.2',
                name: 'TRACEWISE CyberLLM-v4.2 (Fine-Tuned Specialized)',
                desc: 'Specialized model trained on Indian cybercrime records, BNS/IT Act, and banking APK telemetry.',
                speed: '12ms Latency',
                badge: 'RECOMMENDED'
              },
              {
                id: 'claude-3-7',
                name: 'Anthropic Claude 3.7 Sonnet (Hybrid Forensic)',
                desc: 'High-reasoning legal analysis for Section 65B affidavits and complex hawala money trails.',
                speed: '45ms Latency',
                badge: 'LEGAL DRAFT'
              },
              {
                id: 'deepseek-r1',
                name: 'DeepSeek CyberR1 (APK Decompiler)',
                desc: 'Advanced reverse engineering of malicious Android Dalvik bytecode and C2 extraction.',
                speed: '28ms Latency',
                badge: 'REVERSE ENG'
              }
            ].map((m) => (
              <div
                key={m.id}
                onClick={() => setSelectedModel(m.id)}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                  selectedModel === m.id
                    ? 'bg-cyan-500/10 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.15)]'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-white text-xs">{m.name}</span>
                  <span className="text-[10px] font-mono font-bold text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-500/30">
                    {m.badge}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">{m.desc}</p>
                <div className="mt-2 text-[10px] font-mono text-slate-500 flex items-center justify-between">
                  <span>Speed: {m.speed}</span>
                  {selectedModel === m.id && <span className="text-cyan-400 font-bold">● Active Model</span>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Team MINDMESH Roster & Roles */}
        <div className="p-5 rounded-2xl bg-[#0D1424]/90 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wider font-mono flex items-center gap-2">
              <Users className="w-4 h-4" />
              Team MINDMESH Investigation Unit
            </h3>
            <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded">
              4 CORE MEMBERS
            </span>
          </div>

          <p className="text-xs text-slate-300">
            Assigned hackathon personnel and cryptographic clearance tiers:
          </p>

          <div className="space-y-2.5">
            {TEAM_MEMBERS.map((member, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-600 to-blue-600 text-white font-bold flex items-center justify-center text-xs">
                    {member.name.split(' ').map((n) => n[0]).join('')}
                  </div>
                  <div>
                    <h4 className="text-white font-semibold text-xs">{member.name}</h4>
                    <p className="text-[11px] text-slate-400">{member.role}</p>
                    <span className="text-[10px] text-slate-500 font-mono">{member.access}</span>
                  </div>
                </div>

                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-cyan-300 border border-slate-700">
                  {member.badge}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Threat Intelligence API Integrations */}
        <div className="p-5 rounded-2xl bg-[#0D1424]/90 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wider font-mono flex items-center gap-2">
              <Globe className="w-4 h-4" />
              Threat Intel & Nodal Bank Connectors
            </h3>
            <span className="text-[10px] font-mono text-emerald-400">4 CONNECTED</span>
          </div>

          <div className="space-y-2.5 text-xs">
            {[
              {
                id: 'certIn',
                name: 'CERT-In Incident Telemetry Feed',
                desc: 'Real-time synchronization of emerging phishing domains & Indian ransomware IOCs.'
              },
              {
                id: 'helpline1930',
                name: 'National Cyber Crime Helpline (1930) API',
                desc: 'Direct ingestion hook for automated victim complaint ticketing and FIR pre-fill.'
              },
              {
                id: 'virusTotal',
                name: 'VirusTotal Enterprise Scanner API',
                desc: 'Automated 70-engine multi-antivirus scanning for all ingested APK payloads.'
              },
              {
                id: 'shodan',
                name: 'Shodan BGP / ASN Port Scanner',
                desc: 'Deep infrastructure fingerprinting of bulletproof hosting providers and C2 bots.'
              }
            ].map((feed) => (
              <div
                key={feed.id}
                onClick={() => toggleFeed(feed.id)}
                className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/30 cursor-pointer transition-all flex items-center justify-between gap-3"
              >
                <div>
                  <h4 className="text-white font-semibold">{feed.name}</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">{feed.desc}</p>
                </div>
                <div
                  className={`w-9 h-5 rounded-full p-0.5 transition-colors ${
                    threatFeeds[feed.id] ? 'bg-cyan-500' : 'bg-slate-700'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transition-transform ${
                      threatFeeds[feed.id] ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Security & Cryptographic Compliance Policies */}
        <div className="p-5 rounded-2xl bg-[#0D1424]/90 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wider font-mono flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Cryptographic & Vault Audit Policies
            </h3>
            <span className="text-[10px] font-mono text-emerald-400">STRICT FIPS 180-4</span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <div>
                <span className="text-white font-semibold block">Mandate Dual SHA-256 / SHA-512 Ingest</span>
                <span className="text-[11px] text-slate-400">
                  Reject single-hash uploads to guarantee courtroom admissibility under Section 65B.
                </span>
              </div>
              <input
                type="checkbox"
                checked={enforceDualHash}
                onChange={() => setEnforceDualHash(!enforceDualHash)}
                className="rounded text-cyan-500 focus:ring-0 bg-slate-800 border-slate-700"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <div>
                <span className="text-white font-semibold block">Session Auto-Lock Inactivity Period</span>
                <span className="text-[11px] text-slate-400">
                  Automatically lock terminal session if investigator is away.
                </span>
              </div>
              <select
                value={autoLockMinutes}
                onChange={(e) => setAutoLockMinutes(e.target.value)}
                className="bg-[#080E1C] border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-white font-mono"
              >
                <option value="5">5 mins</option>
                <option value="15">15 mins</option>
                <option value="30">30 mins</option>
                <option value="60">60 mins</option>
              </select>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <div>
                <span className="text-white font-semibold block">Audible Cyber Alert Pings</span>
                <span className="text-[11px] text-slate-400">
                  Play subtle audio cue when high-risk phishing link or new mule account is flagged.
                </span>
              </div>
              <button
                onClick={() => setEnableSound(!enableSound)}
                className={`p-2 rounded-lg border transition-all ${
                  enableSound
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                    : 'bg-slate-800 text-slate-500 border-slate-700'
                }`}
              >
                {enableSound ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
