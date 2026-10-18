import React, { useState, useMemo, useEffect } from 'react';
import Badge from '../components/Badge';
import {
  FileText,
  Printer,
  Download,
  ShieldCheck,
  CheckCircle2,
  Copy,
  Scale,
  Award,
  Calendar,
  AlertCircle,
  FileCheck,
  Lock,
  PlusCircle,
  Check,
  ShieldAlert,
  Sparkles,
  Clock,
  CreditCard,
  Network,
  Globe,
  Phone,
  Mail,
  User,
  Zap,
  Info,
  Layers,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { getCaseAuditLogs, addCaseAuditLog, getStoredTimelineEvents } from '../utils/storage';
import { CORRELATION_EDGES } from '../data/correlationGraphData';
import { generateCasePdfReport } from '../utils/pdfReportGenerator';

export default function ReportsView({
  cases = [],
  evidence = [],
  onTriggerToast
}) {
  const [selectedCaseId, setSelectedCaseId] = useState(cases[0]?.id || 'TW-2026-8941');
  const [reportTemplate, setReportTemplate] = useState('FULL_DOSSIER'); // 'FULL_DOSSIER' | 'SEC65B' | 'BANK_FREEZE' | 'CISO'
  const [investigatorNotes, setInvestigatorNotes] = useState(
    '1. Section 91 CrPC freeze directive issued to Nodal Officers of Axis Bank and Yes Bank for immediate debit freeze on beneficiary accounts.\n2. Subpoena filed for CDR / IPDR logs corresponding to VoIP SIP trunk +91 98765 43210.\n3. Request lodged with CERT-In and Department of Telecommunications for immediate DNS-level blocking of secure-sbi-kyc-verify-portal.in.net.\n4. Dual SHA-256 genesis hash verified with 0 bit deviation. Certificate under Section 65B Indian Evidence Act / Section 63 Bharatiya Sakshya Adhiniyam issued.'
  );

  // Audit Logs state for selected case
  const [auditLogs, setAuditLogs] = useState(() => getCaseAuditLogs(selectedCaseId));
  const [newAuditAction, setNewAuditAction] = useState({
    actionType: 'analysis',
    action: '',
    description: '',
    officer: 'Sneha KR (Team MINDMESH)'
  });
  const [isAddAuditOpen, setIsAddAuditOpen] = useState(false);
  const [copiedText, setCopiedText] = useState(null);

  // Sync audit logs when case selection changes
  useEffect(() => {
    setAuditLogs(getCaseAuditLogs(selectedCaseId));
  }, [selectedCaseId]);

  const selectedCase = cases.find((c) => c.id === selectedCaseId) || cases[0] || {
    id: 'TW-2026-8941',
    title: 'Operation FakeSBI: Multi-State Trojan Ring',
    fraudType: 'Banking Trojan & Phishing',
    dateReported: '2026-10-17',
    lossAmount: 3850000,
    frozenAmount: 3120000,
    recoveryRate: '81.0%',
    status: 'In Progress',
    priority: 'Critical',
    assignedInvestigator: 'Sneha KR (Team MINDMESH)',
    victim: 'Rajesh Sharma (Senior Citizen / Retail Customer)',
    description: 'Central investigation into SMS OTP stealer APK & Mewat-Jamtara money mule network.'
  };

  // Associated digital evidence for this case
  const caseEvidence = useMemo(() => {
    return evidence.filter((e) => e.caseId === selectedCaseId);
  }, [evidence, selectedCaseId]);

  // Associated timeline events for this case
  const caseTimeline = useMemo(() => {
    const allEvents = getStoredTimelineEvents();
    return allEvents.filter((ev) => ev.caseId === selectedCaseId);
  }, [selectedCaseId]);

  // Associated graph edges for this case
  const caseGraphEdges = useMemo(() => {
    return CORRELATION_EDGES.filter((e) => e.caseId === selectedCaseId);
  }, [selectedCaseId]);

  // URL findings associated with this case
  const caseUrlFindings = useMemo(() => {
    if (selectedCaseId === 'TW-2026-8941') {
      return [
        {
          url: 'hxxps://secure-sbi-kyc-verify-portal[.]in[.]net/login.php',
          riskLevel: 'High',
          score: 85,
          indicators: 'Newly registered domain (1 day ago); Lack of Organization Validated SSL; Brand keyword "sbi" in subdomain; Hosted on HostSailor Cloud (Tor exit IP 185.220.101.45)',
          evidenceId: 'EVD-8941-01'
        },
        {
          url: 'hxxp://185[.]220[.]101[.]45/download/sbi_update.apk',
          riskLevel: 'High',
          score: 95,
          indicators: 'IP-address host without DNS name; Insecure HTTP transport; Direct Trojan APK download payload',
          evidenceId: 'EVD-8941-01'
        }
      ];
    } else if (selectedCaseId === 'TW-2026-8938') {
      return [
        {
          url: 'hxxps://telegram-vip-daily-task-earning[.]xyz/register',
          riskLevel: 'High',
          score: 91,
          indicators: 'Registered 6 days ago via Porkbun LLC; Cloudflare reverse proxy shield; Simulates fake profit ticker to induce FOMO',
          evidenceId: 'EVD-8938-01'
        }
      ];
    } else {
      return [
        {
          url: 'hxxps://fedex-customs-parcel-clearance[.]live',
          riskLevel: 'High',
          score: 88,
          indicators: 'Free cPanel SSL; Moscow IP hosting fake narcotics detention portal; Canva-generated arrest warrant download trigger',
          evidenceId: 'EVD-8935-01'
        }
      ];
    }
  }, [selectedCaseId]);

  // Extracted indicators for this case
  const caseIndicators = useMemo(() => {
    if (selectedCaseId === 'TW-2026-8941') {
      return [
        { type: 'Phone Number (VoIP Trunk)', value: '+91 98765 43210', method: 'Rule-Based Regex', evidenceId: 'EVD-8941-01' },
        { type: 'Phone Number (Mule Auth SIM)', value: '+91 87654 32109', method: 'Rule-Based Regex', evidenceId: 'EVD-8941-01' },
        { type: 'Registrar WHOIS Email', value: 'abuse-desk@namecheap-proxy.is', method: 'Rule-Based Regex', evidenceId: 'EVD-8941-01' },
        { type: 'Phishing C2 Host', value: 'secure-sbi-kyc-verify-portal.in.net', method: 'Rule-Based Regex', evidenceId: 'EVD-8941-01' },
        { type: 'Telegram C2 Webhook', value: 'api.telegram.org/bot6819201944', method: 'AI-Assisted Heuristic', evidenceId: 'EVD-8941-01' },
        { type: 'Primary Mule Account', value: 'Axis Bank A/c 921010048192041', method: 'AI-Assisted Heuristic', evidenceId: 'EVD-8941-02' },
        { type: 'NPCI IMPS UTR', value: 'AXIS9102847', method: 'AI-Assisted Heuristic', evidenceId: 'EVD-8941-02' },
        { type: 'Layer-2 UPI Mule VPA', value: 'fastpay.mule91@yesbank', method: 'AI-Assisted Heuristic', evidenceId: 'EVD-8941-02' },
        { type: 'Interception Timestamp', value: '2026-10-17 09:21:18 IST', method: 'Rule-Based Regex', evidenceId: 'EVD-8941-02' },
        { type: 'Defrauded Amount', value: '₹14,20,000 (INR)', method: 'Rule-Based Regex', evidenceId: 'EVD-8941-02' }
      ];
    } else if (selectedCaseId === 'TW-2026-8938') {
      return [
        { type: 'Phone Number (WhatsApp Coordinator)', value: '+91 91234 56789', method: 'Rule-Based Regex', evidenceId: 'EVD-8938-01' },
        { type: 'Operator Email', value: 'vip_payout_ops@proton.me', method: 'Rule-Based Regex', evidenceId: 'EVD-8938-01' },
        { type: 'Tron Crypto Wallet', value: 'TX77aQp8910283419082349102849199zK', method: 'Rule-Based Regex', evidenceId: 'EVD-8938-01' },
        { type: 'Laundered Sum', value: '15,000 USDT', method: 'Rule-Based Regex', evidenceId: 'EVD-8938-01' }
      ];
    } else {
      return [
        { type: 'Impersonation Email', value: 'cbi.cybercell.escrow@gmail.com', method: 'Rule-Based Regex', evidenceId: 'EVD-8935-01' },
        { type: 'Escrow Mule Account', value: 'ICICI Bank A/c 2819010048192', method: 'AI-Assisted Heuristic', evidenceId: 'EVD-8935-01' },
        { type: 'RTGS UTR Reference', value: 'ICIC9920148102', method: 'AI-Assisted Heuristic', evidenceId: 'EVD-8935-01' },
        { type: 'Extortion Sum', value: '₹48,00,000 (INR)', method: 'Rule-Based Regex', evidenceId: 'EVD-8935-01' }
      ];
    }
  }, [selectedCaseId]);

  // Copy helper
  const handleCopy = (text, label) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(null), 2000);
    if (onTriggerToast) {
      onTriggerToast({
        title: 'Copied to Clipboard',
        message: `${label || 'Text'}: ${text}`,
        type: 'info'
      });
    }
  };

  // Generate & Download PDF
  const handleDownloadPDF = () => {
    try {
      // 1. Record evidence-handling audit log for report generation
      const reportLogEntry = {
        action: 'Case Report Compiled & Exported to PDF',
        actionType: 'report_generation',
        description: `Exported complete forensic dossier containing ${caseEvidence.length} evidence items and ${caseIndicators.length} indicators.`,
        officer: selectedCase.assignedInvestigator || 'Investigator Sneha KR',
        source: 'LIVE_RECORDED', // Explicitly marked as actual recorded live event
        evidenceId: caseEvidence[0]?.id || 'EVD-GENERAL'
      };

      const updatedLogs = addCaseAuditLog(selectedCase.id, reportLogEntry);
      setAuditLogs(updatedLogs);

      // 2. Generate PDF using jsPDF
      const result = generateCasePdfReport({
        caseData: selectedCase,
        evidenceList: caseEvidence,
        timelineEvents: caseTimeline,
        graphEdges: caseGraphEdges,
        urlFindings: caseUrlFindings,
        auditLogs: updatedLogs,
        investigatorNotes: investigatorNotes,
        officerName: selectedCase.assignedInvestigator || 'Investigator Sneha KR',
        officerRole: 'Senior Cyber Crime Analyst, Team MINDMESH'
      });

      if (onTriggerToast) {
        onTriggerToast({
          title: 'PDF Report Generated & Downloaded',
          message: `${result.filename} (${result.totalPages} pages) saved with immutable audit log.`,
          type: 'success'
        });
      }
    } catch (err) {
      console.error('PDF Generation Error:', err);
      if (onTriggerToast) {
        onTriggerToast({
          title: 'PDF Generation Failed',
          message: err.message,
          type: 'critical'
        });
      }
    }
  };

  // Browser print / Save as PDF
  const handlePrint = () => {
    window.print();
  };

  // Export JSON Dossier
  const handleDownloadJSON = () => {
    const reportData = {
      platform: 'TRACEWISE AI - Cyber Fraud Intelligence Platform',
      team: 'Team MINDMESH',
      generatedAt: new Date().toISOString(),
      caseDetails: selectedCase,
      evidenceAnnexure: caseEvidence,
      extractedIndicators: caseIndicators,
      urlAnalysisFindings: caseUrlFindings,
      chronologicalTimeline: caseTimeline,
      graphRelationships: caseGraphEdges,
      evidenceHandlingAuditLogs: auditLogs,
      investigatorNotes: investigatorNotes,
      statutoryDisclaimer:
        'TRACEWISE AI is an algorithmic decision-support and digital evidence intelligence platform designed to assist authorized law enforcement investigators. It does not independently establish guilt or liability. All findings must be verified under statutory rules of evidence.'
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `TRACEWISE_Dossier_${selectedCase.id}.json`;
    a.click();
    URL.revokeObjectURL(url);

    if (onTriggerToast) {
      onTriggerToast({
        title: 'JSON Dossier Downloaded',
        message: `Case ${selectedCase.id} full forensic JSON export downloaded.`,
        type: 'success'
      });
    }
  };

  // Log custom evidence-handling audit action
  const handleAddAuditEntry = (e) => {
    e.preventDefault();
    if (!newAuditAction.action.trim()) return;

    const entry = {
      action: newAuditAction.action,
      actionType: newAuditAction.actionType,
      description: newAuditAction.description || 'Manual evidence inspection logged by investigator.',
      officer: newAuditAction.officer,
      source: 'LIVE_RECORDED', // Explicit live recorded action
      evidenceId: caseEvidence[0]?.id || 'EVD-8941-01'
    };

    const updated = addCaseAuditLog(selectedCase.id, entry);
    setAuditLogs(updated);
    setIsAddAuditOpen(false);
    setNewAuditAction({
      actionType: 'analysis',
      action: '',
      description: '',
      officer: 'Sneha KR (Team MINDMESH)'
    });

    if (onTriggerToast) {
      onTriggerToast({
        title: 'Audit Action Recorded',
        message: `Live action "${entry.action}" appended to immutable chain of custody.`,
        type: 'success'
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header with Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <FileText className="w-6 h-6 text-cyan-400" />
              Court-Admissible Case Report & Legal Dossier
            </h1>
            <span className="px-2 py-0.5 rounded-full text-xs font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              PDF GENERATOR
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400">
            Automated cyber fraud case dossiers with verified evidence inventories, SHA-256 hashes, extracted indicators, and audit trails.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleDownloadJSON}
            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs sm:text-sm font-medium transition-all cursor-pointer flex items-center gap-1.5"
            title="Download JSON Export"
          >
            <Download className="w-4 h-4 text-slate-400" />
            <span>JSON</span>
          </button>
          <button
            onClick={handlePrint}
            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs sm:text-sm font-medium transition-all cursor-pointer flex items-center gap-1.5"
            title="Print or Save via Browser"
          >
            <Printer className="w-4 h-4 text-purple-400" />
            <span>Print</span>
          </button>
          <button
            onClick={handleDownloadPDF}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs sm:text-sm font-bold shadow-[0_0_20px_-3px_rgba(6,182,212,0.4)] transition-all cursor-pointer flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>Download PDF Case Report</span>
          </button>
        </div>
      </div>

      {/* 2. Control Bar: Case Selector & View Mode */}
      <div className="p-4 rounded-xl bg-[#0D1424]/90 border border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 font-mono">
            Selected Investigation Case:
          </label>
          <select
            value={selectedCaseId}
            onChange={(e) => setSelectedCaseId(e.target.value)}
            className="w-full bg-[#080E1C] border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono cursor-pointer"
          >
            {cases.map((c) => (
              <option key={c.id} value={c.id} className="bg-slate-900 text-white">
                [{c.id}] {c.title.substring(0, 48)}...
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 font-mono">
            Report View Template:
          </label>
          <div className="grid grid-cols-2 gap-1.5">
            {[
              { id: 'FULL_DOSSIER', label: 'Full Case Dossier' },
              { id: 'SEC65B', label: 'Sec 65B Cert' }
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setReportTemplate(t.id)}
                className={`px-2 py-2 rounded-xl text-xs font-medium border text-center transition-all cursor-pointer ${
                  reportTemplate === t.id
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400 font-bold'
                    : 'bg-slate-900/60 text-slate-400 hover:text-white border-slate-800'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col justify-end">
          <button
            onClick={() => setIsAddAuditOpen(true)}
            className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-mono font-medium transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5 text-cyan-400" />
            <span>Record Evidence-Handling Audit Action</span>
          </button>
        </div>
      </div>

      {/* 3. Main Report Preview Document */}
      <div className="rounded-2xl p-6 sm:p-10 bg-[#090F1E] border border-slate-700/80 shadow-2xl relative overflow-hidden font-sans text-slate-200 space-y-8">
        {/* Printable watermark */}
        <div className="absolute top-6 right-6 opacity-15 pointer-events-none select-none text-right">
          <div className="text-3xl font-extrabold tracking-widest uppercase font-mono text-cyan-400">TRACEWISE AI</div>
          <div className="text-xs font-mono text-slate-400">TEAM MINDMESH FORENSICS</div>
        </div>

        {/* Document Header */}
        <div className="border-b-2 border-slate-700 pb-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 text-xs font-mono font-bold mb-3">
            <Scale className="w-3.5 h-3.5" />
            GOVERNMENT OF INDIA & LAW ENFORCEMENT COMPLIANT
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-wide uppercase font-mono">
            DIGITAL EVIDENCE FORENSIC INTELLIGENCE DOSSIER
          </h2>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            Report Reference: TW-FORENSIC-{selectedCase.id}-2026 | Document Root: Team MINDMESH Cyber Crime Unit
          </p>
        </div>

        {/* Section 1: Case Details Key-Value Grid */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wider font-mono flex items-center gap-2 border-b border-slate-800 pb-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            1. Case Dossier Overview & Key Parameters
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-xs font-mono">
            <div>
              <span className="text-slate-500 text-[10px] uppercase block">Case Identifier</span>
              <span className="text-cyan-400 font-bold">{selectedCase.id}</span>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] uppercase block">Incident Modus</span>
              <span className="text-slate-200">{selectedCase.fraudType || 'Cyber Fraud'}</span>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] uppercase block">Operational Status</span>
              <span className="text-emerald-400 font-bold uppercase">{selectedCase.status || 'Active'}</span>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] uppercase block">Assigned Officer</span>
              <span className="text-slate-200">{selectedCase.assignedInvestigator}</span>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] uppercase block">Complainant / Victim</span>
              <span className="text-slate-200">{selectedCase.victim || 'Confidential Victim'}</span>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] uppercase block">Date Reported</span>
              <span className="text-slate-200">{selectedCase.dateReported}</span>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] uppercase block">Defrauded Loss</span>
              <span className="text-rose-400 font-bold">₹{selectedCase.lossAmount?.toLocaleString('en-IN') || '0'}</span>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] uppercase block">Frozen / Recovered</span>
              <span className="text-emerald-400 font-bold">₹{selectedCase.frozenAmount?.toLocaleString('en-IN') || '0'} ({selectedCase.recoveryRate || '0%'})</span>
            </div>
          </div>
        </div>

        {/* Section 2: Incident Summary */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wider font-mono flex items-center gap-2 border-b border-slate-800 pb-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            2. Incident Summary & Kill Chain Narrative
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-[#070B14] p-4 rounded-xl border border-slate-800/80">
            {selectedCase.description || selectedCase.incidentSummary}
          </p>
        </div>

        {/* Section 3: Evidence Inventory & Hashes */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wider font-mono flex items-center gap-2 border-b border-slate-800 pb-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            3. Digital Evidence Inventory & Cryptographic Seals ({caseEvidence.length})
          </h3>

          <div className="space-y-2">
            {caseEvidence.length > 0 ? (
              caseEvidence.map((ev) => (
                <div key={ev.id} className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2 text-xs">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-cyan-400 font-bold">[{ev.id}]</span>
                      <span className="font-bold text-white">{ev.fileName}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                        {ev.fileType}
                      </span>
                    </div>
                    <Badge variant="success" size="xs">
                      {ev.custodyStatus || 'Sealed & Verified'}
                    </Badge>
                  </div>

                  <div className="p-2 rounded-lg bg-[#070B14] border border-slate-800/60 font-mono text-[11px] flex items-center justify-between">
                    <span className="text-slate-400 truncate">
                      SHA-256: <code className="text-emerald-400">{ev.sha256}</code>
                    </span>
                    <button
                      onClick={() => handleCopy(ev.sha256, 'SHA-256 Hash')}
                      className="text-cyan-400 hover:text-cyan-300 ml-2 cursor-pointer"
                      title="Copy Hash"
                    >
                      {copiedText === ev.sha256 ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500 italic p-4 bg-slate-900/40 rounded-xl">No evidence items registered under this case.</p>
            )}
          </div>

          {/* STRICT REQUIREMENT: Hash Integrity Explanation Callout */}
          <div className="p-3.5 rounded-xl bg-sky-950/20 border border-sky-500/40 text-xs space-y-1">
            <div className="flex items-center gap-2 text-sky-300 font-bold font-mono">
              <Info className="w-4 h-4 text-sky-400" />
              <span>FORENSIC HASH INTEGRITY DISCLOSURE (ISO/IEC 27037:2012):</span>
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              A cryptographic hash (such as SHA-256) is a one-way mathematical digest of a bitstream. Computing a hash does NOT prove the inherent truth, authenticity, or legal origin of a file's contents; rather, it provides an immutable mathematical baseline that enables investigators and courts to detect whether file contents have been altered, corrupted, or tampered with when compared against a previously recorded genesis hash.
            </p>
          </div>
        </div>

        {/* Section 4: Extracted Forensic Indicators */}
        <div className="space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
            <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wider font-mono flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              4. Extracted Forensic Indicators (With Evidence References)
            </h3>
            <span className="text-[10px] font-mono text-slate-500">Every finding linked to Evidence ID</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {caseIndicators.map((ind, i) => (
              <div key={i} className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 space-y-1">
                <div className="flex items-center justify-between text-[10px] font-mono">
                  <span className="text-slate-400 uppercase">{ind.type}</span>
                  <span className="px-1.5 py-0.5 rounded bg-slate-800 text-emerald-400 border border-emerald-500/30">
                    Evidence: [{ind.evidenceId}]
                  </span>
                </div>
                <div className="font-mono font-bold text-cyan-300 text-xs select-all">
                  {ind.value}
                </div>
                <div className="text-[10px] font-mono text-slate-500">
                  Method: {ind.method}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 5: URL Analysis Findings */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wider font-mono flex items-center gap-2 border-b border-slate-800 pb-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            5. Suspicious URL & C2 Infrastructure Analysis Findings
          </h3>

          <div className="space-y-2.5">
            {caseUrlFindings.map((u, i) => (
              <div key={i} className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-rose-400 select-all">{u.url}</span>
                  <div className="flex items-center gap-2">
                    <Badge variant={u.riskLevel === 'High' ? 'critical' : 'medium'} size="xs">
                      {u.riskLevel} Risk (Heuristic)
                    </Badge>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-emerald-400 border border-emerald-500/30">
                      Evidence: [{u.evidenceId}]
                    </span>
                  </div>
                </div>
                <p className="text-slate-300 text-[11px] font-sans leading-relaxed">
                  <strong className="text-slate-400 font-mono">Indicators:</strong> {u.indicators}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Section 6: Incident Chronological Timeline */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wider font-mono flex items-center gap-2 border-b border-slate-800 pb-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            6. Incident Chronological Timeline (With Evidence References)
          </h3>

          <div className="space-y-2">
            {caseTimeline.slice(0, 5).map((tl) => (
              <div key={tl.id} className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-cyan-400 font-mono font-bold">{tl.timestamp}</span>
                    <span className="font-bold text-white">{tl.title}</span>
                  </div>
                  <p className="text-slate-400 text-[11px]">{tl.description}</p>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-emerald-400 border border-emerald-500/30 shrink-0">
                  Evidence: [{tl.evidenceId || 'EVD-8941-01'}]
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Section 7: Evidence Graph Relationships */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wider font-mono flex items-center gap-2 border-b border-slate-800 pb-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            7. Evidence Correlation Graph Relationships
          </h3>

          <div className="space-y-1.5 text-xs font-mono">
            {caseGraphEdges.slice(0, 6).map((edge) => (
              <div key={edge.id} className="p-2.5 rounded-lg bg-[#070B14] border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-slate-400">{edge.source}</span>
                  <span className="text-cyan-400 mx-1.5">&rarr;</span>
                  <span className="text-slate-400">{edge.target}</span>
                  <span className="text-slate-300 ml-2">({edge.label})</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-bold ${edge.matchType === 'CONFIRMED' ? 'text-cyan-400' : 'text-amber-400'}`}>
                    {edge.matchType} ({edge.confidence})
                  </span>
                  <span className="text-[10px] text-emerald-400">
                    [{edge.supportingEvidenceId}]
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 8: Evidence-Handling Audit Log */}
        <div className="space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
            <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wider font-mono flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              8. Evidence-Handling Audit Log ({auditLogs.length} Actions)
            </h3>
            <span className="text-[10px] font-mono text-slate-500">
              Clear distinction between Live Recorded and Sample Demo events
            </span>
          </div>

          <div className="space-y-2 max-h-56 overflow-y-auto pr-1 scrollbar-thin">
            {auditLogs.map((log) => {
              const isLive = log.source === 'LIVE_RECORDED';
              return (
                <div key={log.id} className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-500 font-mono text-[10px]">{log.timestamp}</span>
                      <strong className="text-white text-xs">{log.action}</strong>
                    </div>
                    <p className="text-slate-400 text-[11px]">{log.description}</p>
                    <span className="text-[10px] font-mono text-slate-500">Officer: {log.officer}</span>
                  </div>

                  {/* STRICT REQUIREMENT: Distinct badge for Live vs Demo */}
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold shrink-0 border ${
                      isLive
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-[0_0_10px_rgba(16,185,129,0.2)]'
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}
                  >
                    {isLive ? 'LIVE USER ACTION' : 'SEEDED DEMO LOG'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 9: Investigator Notes */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wider font-mono flex items-center gap-2 border-b border-slate-800 pb-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            9. Investigator Observations & Statutory Legal Directives
          </h3>
          <textarea
            rows={4}
            value={investigatorNotes}
            onChange={(e) => setInvestigatorNotes(e.target.value)}
            className="w-full bg-[#070B14] border border-slate-700 rounded-xl p-3 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-400 leading-relaxed resize-none"
            placeholder="Enter investigator notes, CrPC Section 91 notices, court requests, and observations..."
          />
        </div>

        {/* Section 10: Statutory Disclaimer */}
        <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-500/40 text-xs space-y-1">
          <div className="flex items-center gap-2 text-rose-400 font-bold font-mono">
            <ShieldAlert className="w-4 h-4" />
            <span>STATUTORY INVESTIGATIVE ASSISTANCE DISCLAIMER & LIMITATIONS:</span>
          </div>
          <p className="text-slate-300 text-[11px] leading-relaxed">
            TRACEWISE AI is an algorithmic decision-support and digital evidence intelligence platform designed to assist authorized law enforcement investigators and cyber forensic examiners. It automates evidence correlation, heuristic risk triage, and kill chain reconstruction. TRACEWISE AI does NOT independently establish criminal guilt, liability, or final judicial proof. All findings, AI-suggested linkages, and extracted entities must be independently verified by sworn investigating officers and submitted in compliance with statutory rules of evidence and judicial process.
          </p>
        </div>

        {/* Digital Signature Footer */}
        <div className="pt-6 border-t-2 border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono text-xs">
          <div>
            <div className="text-slate-400">Certified & Signed by:</div>
            <div className="font-bold text-white text-sm mt-0.5">{selectedCase.assignedInvestigator}</div>
            <div className="text-[11px] text-cyan-400">Team MINDMESH Digital Evidence Division</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-900 border border-cyan-500/30 text-center sm:text-right">
            <div className="text-emerald-400 font-bold flex items-center justify-center sm:justify-end gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              <span>CRYPTOGRAPHICALLY SEALED</span>
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              Case Root: #TW-2026-ROOT-{selectedCase.id}
            </div>
          </div>
        </div>
      </div>

      {/* Modal: Record Evidence-Handling Audit Action */}
      {isAddAuditOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-[#0D1424] border border-slate-700 rounded-2xl p-6 shadow-2xl space-y-4 text-xs font-sans">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-cyan-400" />
                Record Evidence-Handling Audit Action
              </h3>
              <button
                onClick={() => setIsAddAuditOpen(false)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddAuditEntry} className="space-y-4">
              <div>
                <label className="block text-slate-300 font-semibold mb-1 uppercase font-mono text-[10px]">
                  Action Name *
                </label>
                <input
                  type="text"
                  required
                  value={newAuditAction.action}
                  onChange={(e) => setNewAuditAction({ ...newAuditAction, action: e.target.value })}
                  placeholder="e.g. Evidence Inspected in Dynamic Sandbox"
                  className="w-full bg-[#080E1C] border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-400 font-mono text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1 uppercase font-mono text-[10px]">
                    Action Category
                  </label>
                  <select
                    value={newAuditAction.actionType}
                    onChange={(e) => setNewAuditAction({ ...newAuditAction, actionType: e.target.value })}
                    className="w-full bg-[#080E1C] border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-400 text-xs font-mono"
                  >
                    <option value="upload">Upload</option>
                    <option value="view">View / Inspection</option>
                    <option value="analysis">Analysis</option>
                    <option value="edit">Edit / Modification</option>
                    <option value="report_generation">Report Generation</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1 uppercase font-mono text-[10px]">
                    Investigator / Identity
                  </label>
                  <input
                    type="text"
                    value={newAuditAction.officer}
                    onChange={(e) => setNewAuditAction({ ...newAuditAction, officer: e.target.value })}
                    className="w-full bg-[#080E1C] border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-400 font-mono text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1 uppercase font-mono text-[10px]">
                  Description / Forensic Context
                </label>
                <textarea
                  rows={3}
                  value={newAuditAction.description}
                  onChange={(e) => setNewAuditAction({ ...newAuditAction, description: e.target.value })}
                  placeholder="Specify findings, tools utilized, or Section 91 CrPC compliance details..."
                  className="w-full bg-[#080E1C] border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-cyan-400 text-xs font-mono resize-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddAuditOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-semibold text-xs shadow-md cursor-pointer"
                >
                  Append to Audit Trail
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
