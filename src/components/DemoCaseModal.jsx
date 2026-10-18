import React from 'react';
import Modal from './Modal';
import Badge from './Badge';
import {
  Sparkles,
  Briefcase,
  Layers,
  Clock,
  FileText,
  RotateCcw,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  CreditCard,
  Phone,
  Globe
} from 'lucide-react';

export default function DemoCaseModal({
  isOpen,
  onClose,
  cases = [],
  onSelectCase,
  onNavigate,
  onResetDemoData,
  onTriggerToast
}) {
  const featuredDemos = [
    {
      id: 'TW-2026-8941',
      title: 'Operation FakeSBI: Multi-State UPI APK Trojan Ring',
      tag: 'FEATURED DEMO #1',
      tagColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
      category: 'Banking Trojan & Jamtara Mule Ring',
      loss: '₹38.5 Lakhs',
      frozen: '₹31.2 Lakhs (81.0%)',
      priority: 'Critical',
      evidenceItems: ['SBI_Rewards_v4.apk (Seized Binary)', 'c2_traffic_dump.pcap (Network Stream)'],
      highlights: [
        'Malicious SMS stealer APK intercepting victim OTPs',
        'Telegram Bot C2 endpoint receiving exfiltrated credentials',
        '6 rapid IMPS transfers into Axis Bank and Yes Bank mule accounts',
        'Correlated VoIP trunk +91 98765 43210 & Mewat mule SIM'
      ]
    },
    {
      id: 'TW-2026-8938',
      title: 'Operation SilkRoad-Mule: Telegram VIP Review Task Ponzi',
      tag: 'FEATURED DEMO #2',
      tagColor: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
      category: 'Task Fraud & Crypto Mixer Off-Ramp',
      loss: '₹12.5 Lakhs',
      frozen: '₹8.2 Lakhs (65.6%)',
      priority: 'High',
      evidenceItems: ['telegram_chat_export_json_logs.json (1,894 Messages)'],
      highlights: [
        'Prepaid VIP rating task scam via WhatsApp recruiter (+91 91234 56789)',
        'Rupee deposits converted to 15,000 USDT via Binance P2P desk',
        'Laundered into Tron blockchain wallet TX77aQp...99zK',
        'Threat actor communications linked to ProtonMail C2 operator'
      ]
    },
    {
      id: 'TW-2026-8935',
      title: 'Operation DigitalArrest: Impersonation of CBI & Police',
      tag: 'FEATURED DEMO #3',
      tagColor: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
      category: 'Digital Arrest & Video Extortion',
      loss: '₹48.0 Lakhs',
      frozen: '₹48.0 Lakhs (100% Full Lien)',
      priority: 'Critical',
      evidenceItems: [
        'skype_video_recording_fake_police.mp4 (48m Video)',
        'forged_supreme_court_arrest_order.pdf (Canva PDF)'
      ],
      highlights: [
        'Cambodian call center compound running 48-min Skype extortion sessions',
        'Canva-generated arrest warrants with forged Supreme Court / CJI seal',
        'Victim coerced to deposit ₹48L into ICICI Escrow Mule Account',
        'Immediate Section 91 CrPC freeze directive issued to bank nodal desk'
      ]
    }
  ];

  const handleOpenCase = (demoCase) => {
    const fullCase = cases.find((c) => c.id === demoCase.id) || {
      id: demoCase.id,
      title: demoCase.title,
      fraudType: demoCase.category,
      priority: demoCase.priority,
      status: 'Active',
      lossAmount: 3850000,
      frozenAmount: 3120000,
      recoveryRate: '81.0%',
      assignedInvestigator: 'Sneha KR (Team MINDMESH)',
      victim: 'Rajesh Sharma',
      description: demoCase.highlights.join(' ')
    };

    onSelectCase(fullCase);
    onClose();

    if (onTriggerToast) {
      onTriggerToast({
        title: 'Demo Case Loaded',
        message: `Loaded ${demoCase.id} (${demoCase.title.substring(0, 30)}...) for evaluation.`,
        type: 'success'
      });
    }
  };

  const handleOpenInGraph = (caseId) => {
    onClose();
    if (onNavigate) onNavigate('graph');
    if (onTriggerToast) {
      onTriggerToast({
        title: 'Evidence Graph Opened',
        message: `Displaying multi-hop entity correlations for Case ${caseId}.`,
        type: 'info'
      });
    }
  };

  const handleOpenInTimeline = (caseId) => {
    onClose();
    if (onNavigate) onNavigate('timeline');
    if (onTriggerToast) {
      onTriggerToast({
        title: 'Incident Timeline Opened',
        message: `Displaying chronological kill chain events for Case ${caseId}.`,
        type: 'info'
      });
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Judge & Evaluator Quick Start: Load Demo Cases"
      subtitle="Instant One-Click Cyber Fraud Case Dossiers with Pre-Correlated Evidence"
      icon={Sparkles}
      maxWidth="max-w-4xl"
    >
      <div className="space-y-5 text-xs">
        <div className="p-3.5 rounded-xl bg-purple-950/30 border border-purple-500/30 text-purple-200 leading-relaxed">
          <strong className="text-white block font-mono mb-0.5">
            WELCOME HACKATHON EVALUATORS & JUDGES
          </strong>
          Select any of the 3 realistic fictional cyber fraud investigations below to explore case dossiers,
          verified SHA-256 evidence vaults, Cytoscape correlation graphs, chronological timelines, and court-admissible PDF reports.
        </div>

        {/* Demo Cases List */}
        <div className="space-y-4">
          {featuredDemos.map((demo) => (
            <div
              key={demo.id}
              className="p-4 rounded-2xl bg-[#080E1C] border border-slate-800 hover:border-cyan-500/50 transition-all space-y-3"
            >
              {/* Top Row: Case ID, Title, Tag */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-cyan-400 font-bold text-xs bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30">
                    {demo.id}
                  </span>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded border font-bold ${demo.tagColor}`}>
                    {demo.tag}
                  </span>
                  <Badge variant={demo.priority.toLowerCase()} size="xs">
                    {demo.priority}
                  </Badge>
                </div>

                <div className="flex items-center gap-2 font-mono text-[11px]">
                  <span className="text-rose-400 font-semibold">Loss: {demo.loss}</span>
                  <span className="text-slate-600">|</span>
                  <span className="text-emerald-400 font-semibold">Frozen: {demo.frozen}</span>
                </div>
              </div>

              {/* Title & Category */}
              <div>
                <h4 className="text-sm font-bold text-white">{demo.title}</h4>
                <span className="text-[11px] text-cyan-300 font-mono mt-0.5 block">{demo.category}</span>
              </div>

              {/* Key Modus Highlights */}
              <div className="p-3 rounded-xl bg-[#050914] border border-slate-800/80 space-y-1">
                <span className="text-[10px] uppercase font-mono text-slate-500 block font-bold">
                  Modus Operandi & Forensic Footprint:
                </span>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px] text-slate-300">
                  {demo.highlights.map((h, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-cyan-400 mt-0.5">•</span>
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Buttons for this Demo */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/60">
                <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-mono">
                  <span>Evidences:</span>
                  <span className="text-slate-300 truncate max-w-xs">{demo.evidenceItems.join(', ')}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenInTimeline(demo.id)}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 hover:border-cyan-500/50 text-slate-300 hover:text-white text-xs font-mono flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <Clock className="w-3 h-3 text-cyan-400" />
                    <span>Timeline</span>
                  </button>
                  <button
                    onClick={() => handleOpenInGraph(demo.id)}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 hover:border-purple-500/50 text-slate-300 hover:text-white text-xs font-mono flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <Layers className="w-3 h-3 text-purple-400" />
                    <span>Graph</span>
                  </button>
                  <button
                    onClick={() => handleOpenCase(demo)}
                    className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold text-xs flex items-center gap-1.5 cursor-pointer shadow-md transition-all"
                  >
                    <Briefcase className="w-3.5 h-3.5" />
                    <span>Load Case Dossier</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal Footer */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
          {onResetDemoData && (
            <button
              onClick={() => {
                onResetDemoData();
                onClose();
              }}
              className="px-3 py-1.5 rounded-lg border border-slate-700 text-slate-400 hover:text-white text-xs font-mono flex items-center gap-1.5 cursor-pointer hover:bg-slate-800"
            >
              <RotateCcw className="w-3 h-3 text-cyan-400" />
              <span>Restore Default Demo Dataset</span>
            </button>
          )}

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white text-xs font-medium cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
}
