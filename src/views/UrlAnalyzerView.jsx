import React, { useState, useEffect } from 'react';
import Badge from '../components/Badge';
import {
  Globe,
  Search,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Server,
  Lock,
  Unlock,
  Terminal,
  Copy,
  Layers,
  CheckCircle2,
  RefreshCw,
  Eye,
  Info,
  Clock,
  ExternalLink,
  ChevronRight,
  Bookmark,
  Share2,
  Trash2,
  History,
  FileText
} from 'lucide-react';
import {
  analyzeUrlHeuristics,
  defangUrl,
  validateUrlInput
} from '../utils/urlAnalyzer';
import {
  getStoredUrlHistory,
  saveStoredUrlHistory,
  addCaseAuditLog
} from '../utils/storage';

export default function UrlAnalyzerView({ cases = [], onTriggerToast }) {
  const [inputUrl, setInputUrl] = useState('https://secure-sbi-kyc-verify-portal.in.net/login.php');
  const [validationError, setValidationError] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [urlHistory, setUrlHistory] = useState(() => getStoredUrlHistory());
  const [copiedText, setCopiedText] = useState(null);
  const [selectedCaseForAssociation, setSelectedCaseForAssociation] = useState(cases[0]?.id || 'TW-2026-8941');

  // Sample pre-loaded test URLs representing different risk tiers
  const sampleUrls = [
    {
      label: 'Fake SBI Phishing (High Risk)',
      url: 'https://secure-sbi-kyc-verify-portal.in.net/login.php',
      desc: 'Impersonates SBI YONO with high-risk TLD & brand keyword'
    },
    {
      label: 'Direct IP Trojan APK (High Risk)',
      url: 'http://185.220.101.45/download/sbi_rewards_update.apk',
      desc: 'Direct IP host, insecure HTTP, and .apk dropper extension'
    },
    {
      label: 'Shortened Link (Medium Risk)',
      url: 'https://bit.ly/vip-telegram-daily-income',
      desc: 'URL shortener masking unknown destination endpoint'
    },
    {
      label: 'Income Tax Official (Low Risk)',
      url: 'https://www.incometax.gov.in/iec/foportal/',
      desc: 'Legitimate government portal with authentic domain & HTTPS'
    }
  ];

  // Auto-analyze initial URL on mount if none selected
  useEffect(() => {
    if (!analysisResult) {
      try {
        const initial = analyzeUrlHeuristics('https://secure-sbi-kyc-verify-portal.in.net/login.php');
        setAnalysisResult(initial);
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const handleAnalyze = (targetUrl) => {
    const urlToTest = targetUrl || inputUrl;
    setValidationError('');

    const validation = validateUrlInput(urlToTest);
    if (!validation.valid) {
      setValidationError(validation.error);
      return;
    }

    setIsAnalyzing(true);

    // Simulate realistic heuristic scanner execution (350ms)
    setTimeout(() => {
      try {
        const result = analyzeUrlHeuristics(urlToTest);
        setAnalysisResult(result);

        // Prepend to persistent history (avoid duplicate consecutive items)
        const updatedHistory = [
          result,
          ...urlHistory.filter((item) => item.url.toLowerCase() !== result.url.toLowerCase())
        ].slice(0, 20);

        setUrlHistory(updatedHistory);
        saveStoredUrlHistory(updatedHistory);

        if (onTriggerToast) {
          onTriggerToast({
            title: 'Heuristic Triage Complete',
            message: `URL assessed as ${result.riskLevel} Risk (${result.heuristicScore}/100).`,
            type: result.riskLevel === 'High' ? 'warning' : 'info'
          });
        }
      } catch (err) {
        setValidationError(err.message || 'Heuristic evaluation failed.');
      } finally {
        setIsAnalyzing(false);
      }
    }, 400);
  };

  const handleSelectSample = (sample) => {
    setInputUrl(sample.url);
    handleAnalyze(sample.url);
  };

  const handleSelectHistoryItem = (item) => {
    setInputUrl(item.url);
    try {
      const refreshed = analyzeUrlHeuristics(item.url);
      refreshed.associatedCaseId = item.associatedCaseId || null;
      setAnalysisResult(refreshed);
    } catch (e) {
      setAnalysisResult(item);
    }
  };

  const handleClearHistory = () => {
    setUrlHistory([]);
    saveStoredUrlHistory([]);
    if (onTriggerToast) {
      onTriggerToast({
        title: 'URL History Cleared',
        message: 'Previous analysis logs purged from local storage.',
        type: 'info'
      });
    }
  };

  const handleAssociateWithCase = () => {
    if (!analysisResult || !selectedCaseForAssociation) return;

    const updatedResult = {
      ...analysisResult,
      associatedCaseId: selectedCaseForAssociation
    };
    setAnalysisResult(updatedResult);

    // Update in history list
    const updatedHistory = urlHistory.map((h) =>
      h.url === analysisResult.url ? { ...h, associatedCaseId: selectedCaseForAssociation } : h
    );
    setUrlHistory(updatedHistory);
    saveStoredUrlHistory(updatedHistory);

    // Append case audit note
    addCaseAuditLog(selectedCaseForAssociation, {
      action: 'Suspicious URL Triage Linked',
      description: `Linked URL "${analysisResult.defangedUrl}" assessed as ${analysisResult.riskLevel} Risk (${analysisResult.heuristicScore}/100).`,
      officer: 'TRACEWISE AI Heuristic Engine',
      type: 'evidence'
    });

    if (onTriggerToast) {
      onTriggerToast({
        title: 'Associated with Case',
        message: `URL analysis linked to Case [${selectedCaseForAssociation}].`,
        type: 'success'
      });
    }
  };

  const handleCopy = (text, label) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    if (onTriggerToast) {
      onTriggerToast({
        title: 'Copied to Clipboard',
        message: `${label} copied safely.`,
        type: 'info'
      });
    }
    setTimeout(() => setCopiedText(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Globe className="w-6 h-6 text-cyan-400" />
            Suspicious URL Heuristic Analyzer
          </h1>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
            LOCAL HEURISTIC ENGINE
          </span>
        </div>
        <p className="text-xs sm:text-sm text-slate-400">
          Transparent, explainable lexical and structural triage of suspicious links, domain spoofing, and malware vectors
        </p>
      </div>

      {/* TRANSPARENT DEMO NOTICE BANNER (Strict Compliance) */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-[#0C1B2A] to-[#0A1224] border border-cyan-500/30 text-xs text-slate-300 space-y-1.5 leading-relaxed">
        <div className="flex items-center justify-between">
          <span className="font-bold font-mono text-cyan-300 flex items-center gap-2 text-[11px]">
            <Info className="w-4 h-4 text-cyan-400" />
            LOCAL HEURISTIC ASSESSMENT (DEMO MODE)
          </span>
          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-950 text-cyan-300 border border-cyan-500/30">
            NO EXTERNAL API REQUIRED
          </span>
        </div>
        <p>
          This analyzer executes <strong>purely local, explainable rule-based heuristics</strong> directly in your browser.
          No live third-party threat intelligence APIs (such as VirusTotal, Shodan, or Google Safe Browsing) are connected in this demo.
          The calculated risk level (Low, Medium, High) reflects structural anomalies, misleading brand keywords, direct IP hosts,
          and protocol flaws. <strong>Submitted URLs are never opened, navigated to, or fetched automatically.</strong>
        </p>
      </div>

      {/* URL Input Form & Deep Scan Button */}
      <div className="p-5 rounded-2xl bg-[#0D1424]/90 border border-slate-800 space-y-4 shadow-xl">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAnalyze();
          }}
          className="space-y-3"
        >
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider font-mono">
            Enter Target URL or Domain to Analyze:
          </label>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-400" />
              <input
                type="text"
                value={inputUrl}
                onChange={(e) => {
                  setInputUrl(e.target.value);
                  setValidationError('');
                }}
                placeholder="e.g. https://secure-sbi-kyc-verify-portal.in.net/login.php or bit.ly/claim-task"
                className={`w-full bg-[#080E1C] border ${
                  validationError ? 'border-rose-500' : 'border-slate-700'
                } rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 font-mono`}
              />
            </div>

            <button
              type="submit"
              disabled={isAnalyzing}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs sm:text-sm font-semibold shadow-[0_0_20px_-3px_rgba(6,182,212,0.4)] transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isAnalyzing ? 'animate-spin' : ''}`} />
              <span>{isAnalyzing ? 'Evaluating Heuristics...' : 'Analyze URL'}</span>
            </button>
          </div>

          {validationError && (
            <div className="p-2.5 rounded-lg bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0" />
              <span>{validationError}</span>
            </div>
          )}
        </form>

        {/* Quick Preloaded Scam Samples */}
        <div className="pt-3 border-t border-slate-800/80">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] text-slate-400 font-mono font-semibold">Pre-loaded Test Scenarios:</span>
            {sampleUrls.map((s, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectSample(s)}
                className="px-2.5 py-1 rounded-lg border text-[11px] font-mono transition-all cursor-pointer bg-slate-900/60 text-slate-300 border-slate-800 hover:text-white hover:border-cyan-500/40"
                title={s.desc}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ANALYSIS RESULTS PANEL */}
      {analysisResult && (
        <div className="space-y-6">
          {/* Top Risk Level & Assessment Banner */}
          <div
            className={`p-6 rounded-2xl border backdrop-blur-md transition-all shadow-xl ${
              analysisResult.riskLevel === 'High'
                ? 'bg-rose-950/20 border-rose-500/40 shadow-[0_0_35px_-5px_rgba(244,63,94,0.2)]'
                : analysisResult.riskLevel === 'Medium'
                ? 'bg-amber-950/20 border-amber-500/40 shadow-[0_0_35px_-5px_rgba(245,158,11,0.2)]'
                : 'bg-emerald-950/20 border-emerald-500/40 shadow-[0_0_35px_-5px_rgba(16,185,129,0.2)]'
            }`}
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-3 flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  {/* RISK LEVEL DISPLAY: LOW, MEDIUM, or HIGH ONLY */}
                  <span
                    className={`inline-flex items-center gap-2 font-mono font-bold text-xs px-3 py-1 rounded-full border ${
                      analysisResult.riskLevel === 'High'
                        ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                        : analysisResult.riskLevel === 'Medium'
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                        : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${
                        analysisResult.riskLevel === 'High'
                          ? 'bg-rose-400 animate-ping'
                          : analysisResult.riskLevel === 'Medium'
                          ? 'bg-amber-400'
                          : 'bg-emerald-400'
                      }`}
                    />
                    HEURISTIC RISK ASSESSMENT: {analysisResult.riskLevel.toUpperCase()}
                  </span>

                  <span className="text-xs font-mono text-slate-400">
                    Heuristic Anomaly Score: <strong className="text-white">{analysisResult.heuristicScore}/100</strong>
                  </span>
                </div>

                {/* Defanged Sanitized URL Display */}
                <div>
                  <span className="text-[10px] uppercase font-mono text-slate-400 block mb-1">
                    Defanged Target (Safe for Non-Clickable Inspection):
                  </span>
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#070B14] border border-slate-800">
                    <span className="font-mono text-cyan-200 text-xs sm:text-sm break-all select-all flex-1">
                      {analysisResult.defangedUrl}
                    </span>
                    <button
                      onClick={() => handleCopy(analysisResult.defangedUrl, 'Defanged URL')}
                      className="p-1 rounded text-slate-400 hover:text-cyan-300 flex-shrink-0"
                      title="Copy defanged string"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {analysisResult.associatedCaseId && (
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 font-mono text-xs">
                    <Bookmark className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Linked to Case Dossier: <strong>{analysisResult.associatedCaseId}</strong></span>
                  </div>
                )}
              </div>

              {/* Case Association Selector Tool */}
              <div className="p-4 rounded-xl bg-[#070B14] border border-slate-800 space-y-2.5 lg:w-72 flex-shrink-0">
                <span className="text-xs font-bold text-white font-mono flex items-center gap-1.5">
                  <Bookmark className="w-3.5 h-3.5 text-cyan-400" />
                  Associate Analysis with Case
                </span>
                <select
                  value={selectedCaseForAssociation}
                  onChange={(e) => setSelectedCaseForAssociation(e.target.value)}
                  className="w-full bg-[#0D1424] border border-slate-700 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                >
                  {cases.map((c) => (
                    <option key={c.id} value={c.id}>
                      [{c.id}] {c.title.substring(0, 24)}...
                    </option>
                  ))}
                </select>
                <button
                  onClick={handleAssociateWithCase}
                  className="w-full py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-1"
                >
                  <Bookmark className="w-3 h-3" />
                  <span>Attach to Selected Case</span>
                </button>
              </div>
            </div>
          </div>

          {/* EXPLAINABLE HEURISTIC INDICATORS THAT CAUSED THE ASSESSMENT */}
          <div className="p-5 rounded-2xl bg-[#0D1424]/90 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wider font-mono flex items-center gap-2">
                <ShieldAlert className="w-4 h-4" />
                Explainable Heuristic Indicators ({analysisResult.indicators.length} Evaluated)
              </h3>
              <div className="flex items-center gap-2 text-[10px] font-mono">
                <span className="text-rose-400 bg-rose-950/60 px-2 py-0.5 rounded border border-rose-500/30">
                  {analysisResult.dangerCount} Danger
                </span>
                <span className="text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/30">
                  {analysisResult.warningCount} Warning
                </span>
                <span className="text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                  {analysisResult.safeCount} Clean
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-300">
              The following explainable structural and lexical factors determined the{' '}
              <strong className="text-white">{analysisResult.riskLevel} Risk</strong> score:
            </p>

            <div className="space-y-2.5">
              {analysisResult.indicators.map((ind, idx) => {
                const isDanger = ind.status === 'danger';
                const isWarning = ind.status === 'warning';
                const isSafe = ind.status === 'safe';

                return (
                  <div
                    key={idx}
                    className={`p-3.5 rounded-xl border flex items-start gap-3 transition-all ${
                      isDanger
                        ? 'bg-rose-950/20 border-rose-500/30'
                        : isWarning
                        ? 'bg-amber-950/20 border-amber-500/30'
                        : 'bg-emerald-950/10 border-emerald-500/20'
                    }`}
                  >
                    <div className="mt-0.5 flex-shrink-0">
                      {isDanger ? (
                        <AlertTriangle className="w-4 h-4 text-rose-400" />
                      ) : isWarning ? (
                        <AlertTriangle className="w-4 h-4 text-amber-400" />
                      ) : (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      )}
                    </div>

                    <div className="flex-1 text-xs">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                        <div className="flex items-center gap-2">
                          <span
                            className={`font-semibold font-mono text-xs ${
                              isDanger
                                ? 'text-rose-300'
                                : isWarning
                                ? 'text-amber-300'
                                : 'text-emerald-300'
                            }`}
                          >
                            {ind.name}
                          </span>
                          <span className="text-[10px] font-mono text-slate-500 uppercase">
                            [{ind.category}]
                          </span>
                        </div>
                        {ind.weight > 0 && (
                          <span className="text-[10px] font-mono text-rose-400 font-bold">
                            +{ind.weight} Risk Pts
                          </span>
                        )}
                      </div>

                      <p className="text-slate-300 leading-relaxed text-[11px]">{ind.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Parsed Technical Parameters */}
          <div className="p-5 rounded-2xl bg-[#0D1424]/90 border border-slate-800 space-y-3">
            <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wider font-mono pb-2 border-b border-slate-800">
              Parsed URL Structural Breakdown
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
              <div className="p-3 rounded-xl bg-[#080E1C] border border-slate-800">
                <span className="text-slate-500 text-[10px] block uppercase">Protocol</span>
                <span
                  className={`font-bold mt-0.5 block ${
                    analysisResult.parsed.protocol === 'https' ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {analysisResult.parsed.protocol.toUpperCase()}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-[#080E1C] border border-slate-800">
                <span className="text-slate-500 text-[10px] block uppercase">Host Type</span>
                <span className="text-white font-bold mt-0.5 block truncate">
                  {analysisResult.parsed.isDirectIp ? 'Direct IP Address' : 'Domain Name'}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-[#080E1C] border border-slate-800">
                <span className="text-slate-500 text-[10px] block uppercase">Subdomain Depth</span>
                <span className="text-cyan-300 font-bold mt-0.5 block">
                  {analysisResult.parsed.subdomainCount} subdomains
                </span>
              </div>

              <div className="p-3 rounded-xl bg-[#080E1C] border border-slate-800">
                <span className="text-slate-500 text-[10px] block uppercase">Apex TLD</span>
                <span className="text-slate-200 font-bold mt-0.5 block">
                  .{analysisResult.parsed.tld || 'none'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* HISTORY LIST OF PREVIOUS ANALYSES */}
      <div className="p-5 rounded-2xl bg-[#0D1424]/90 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              URL Analysis History ({urlHistory.length} Recorded)
            </h3>
          </div>

          {urlHistory.length > 0 && (
            <button
              onClick={handleClearHistory}
              className="text-xs text-rose-400 hover:underline font-mono flex items-center gap-1"
            >
              <Trash2 className="w-3 h-3" />
              <span>Clear History</span>
            </button>
          )}
        </div>

        {urlHistory.length === 0 ? (
          <p className="text-xs text-slate-500 text-center py-6 font-mono">
            No URL triage history logged yet. Analyze any URL above to record findings.
          </p>
        ) : (
          <div className="space-y-2">
            {urlHistory.map((item, idx) => (
              <div
                key={item.id || idx}
                onClick={() => handleSelectHistoryItem(item)}
                className="p-3 rounded-xl bg-[#080E1C] border border-slate-800 hover:border-cyan-500/40 cursor-pointer transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs group"
              >
                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${
                        item.riskLevel === 'High'
                          ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                          : item.riskLevel === 'Medium'
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                          : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      }`}
                    >
                      {item.riskLevel.toUpperCase()} RISK
                    </span>

                    <span className="text-[10px] text-slate-500 font-mono">
                      Score: {item.heuristicScore}/100
                    </span>

                    {item.associatedCaseId && (
                      <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950 px-1.5 py-0.5 rounded border border-cyan-500/30">
                        Case: {item.associatedCaseId}
                      </span>
                    )}
                  </div>

                  <p className="font-mono text-white text-xs truncate group-hover:text-cyan-300 transition-colors">
                    {item.defangedUrl || defangUrl(item.url)}
                  </p>
                </div>

                <div className="flex items-center gap-3 text-[11px] font-mono text-slate-500 flex-shrink-0">
                  <span>{item.analyzedAt}</span>
                  <span className="text-cyan-400 flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                    Inspect <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
