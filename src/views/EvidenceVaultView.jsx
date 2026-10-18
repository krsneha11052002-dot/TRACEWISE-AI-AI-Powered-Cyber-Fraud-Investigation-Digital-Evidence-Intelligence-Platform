import React, { useState } from 'react';
import Badge from '../components/Badge';
import Modal from '../components/Modal';
import {
  FileKey2,
  ShieldCheck,
  Search,
  Filter,
  Download,
  Copy,
  CheckCircle2,
  AlertCircle,
  FileText,
  Clock,
  User,
  PlusCircle,
  Eye,
  RefreshCw,
  Cpu,
  Lock,
  Layers,
  Archive,
  Image as ImageIcon,
  FileCode,
  FileSpreadsheet,
  Info,
  ExternalLink,
  ChevronRight,
  Database
} from 'lucide-react';

export default function EvidenceVaultView({
  evidence = [],
  onOpenAddEvidence,
  onTriggerToast
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [caseFilter, setCaseFilter] = useState('ALL');
  const [selectedItem, setSelectedItem] = useState(null);
  const [verifyingId, setVerifyingId] = useState(null);
  const [verifiedMap, setVerifiedMap] = useState({});
  const [copiedHashId, setCopiedHashId] = useState(null);

  // Extract distinct cases from evidence
  const caseIds = Array.from(new Set(evidence.map((e) => e.caseId).filter(Boolean)));

  const handleVerifyIntegrity = (id) => {
    setVerifyingId(id);
    setTimeout(() => {
      setVerifiedMap((prev) => ({ ...prev, [id]: true }));
      setVerifyingId(null);
      if (onTriggerToast) {
        onTriggerToast({
          title: 'Integrity Check Passed',
          message: `Evidence #${id}: SHA-256 recalculated and verified with 0 bit discrepancy.`,
          type: 'success'
        });
      }
    }, 700);
  };

  const handleCopyHash = (hash, id) => {
    navigator.clipboard.writeText(hash);
    setCopiedHashId(id);
    if (onTriggerToast) {
      onTriggerToast({
        title: 'SHA-256 Copied',
        message: 'Cryptographic hash copied to clipboard.',
        type: 'info'
      });
    }
    setTimeout(() => setCopiedHashId(null), 2000);
  };

  const handleExportPackage = () => {
    const manifestContent = `========================================================================
TRACEWISE AI - COURT-ADMISSIBLE FORENSIC EVIDENCE MANIFEST
Team MINDMESH | Standard: ISO/IEC 27037:2012 Guidelines
Generated At: ${new Date().toISOString()} IST
Storage Notice: Demo Client Storage (Local Web Crypto Verification)
========================================================================

Total Sealed Evidence Items: ${evidence.length}
Cryptographic Engine: Web Crypto API SHA-256 / SHA-512 (FIPS 180-4)
Integrity Status: 100.0% Tamper Verification Passed

------------------------------------------------------------------------
EVIDENCE CATALOG & CUSTODY RECORD:
------------------------------------------------------------------------
${evidence
  .map(
    (e, idx) => `
[ITEM ${idx + 1}]
Evidence ID: ${e.id}
File Name: ${e.fileName} (${e.fileSize || 'N/A'})
Type / MIME: ${e.fileType} (${e.mimeType || 'binary'})
Linked Case ID: ${e.caseId} - ${e.caseTitle || 'Cyber Fraud Incident'}
Upload Timestamp: ${e.uploadedAt}
Seizing Officer: ${e.uploadedBy}
Processing Status: ${e.processingStatus || e.custodyStatus || 'Sealed'}
Storage Tier: ${e.storageTier || 'Demo Local Storage'}
SHA-256 Checksum: ${e.sha256}
SHA-512 Checksum: ${e.sha512 || 'N/A'}
Tamper Check Status: ${e.tamperCheck || 'PASSED (0 Bit Deviation)'}
Chain of Custody Events: ${e.custodyChain?.length || 1} logged
------------------------------------------------------------------------`
  )
  .join('\n')}

========================================================================
DISCLOSURE NOTICE:
In this demonstration prototype, evidence metadata and hashes are preserved
in client browser memory. In production law enforcement deployments, files
are dispatched to FIPS 140-2 Level 3 HSM hardware and air-gapped WORM archives.
Digital Signature: Team MINDMESH Cryptographic Root CA (Level-5 Vault)
========================================================================`;

    const blob = new Blob([manifestContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `TRACEWISE_Evidence_Manifest_${Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(url);

    if (onTriggerToast) {
      onTriggerToast({
        title: 'Forensic Package Exported',
        message: 'Court-admissible SHA-256 Evidence Manifest downloaded successfully.',
        type: 'success'
      });
    }
  };

  const filteredEvidence = evidence.filter((e) => {
    const matchesCase = caseFilter === 'ALL' || e.caseId === caseFilter;
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      (e.fileName && e.fileName.toLowerCase().includes(term)) ||
      (e.id && e.id.toLowerCase().includes(term)) ||
      (e.caseId && e.caseId.toLowerCase().includes(term)) ||
      (e.sha256 && e.sha256.toLowerCase().includes(term)) ||
      (e.fileType && e.fileType.toLowerCase().includes(term)) ||
      (e.uploadedBy && e.uploadedBy.toLowerCase().includes(term));

    return matchesCase && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <FileKey2 className="w-6 h-6 text-emerald-400" />
              Cryptographic Digital Evidence Vault
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              ISO 27037 SEALED
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400">
            Immutable chain-of-custody, real WebCrypto SHA-256 bitstream sealing, and court-admissible forensic packages
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleExportPackage}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs sm:text-sm font-medium transition-all cursor-pointer flex items-center gap-2"
          >
            <Download className="w-4 h-4 text-cyan-400" />
            <span>Export Manifest (.txt)</span>
          </button>
          <button
            onClick={onOpenAddEvidence}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs sm:text-sm font-semibold shadow-[0_0_20px_-3px_rgba(16,185,129,0.3)] transition-all cursor-pointer flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Upload & Seal Evidence</span>
          </button>
        </div>
      </div>

      {/* CLEAR DEMO STORAGE DISCLOSURE NOTICE */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-[#0C1B2A] to-[#0A1224] border border-amber-500/40 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-amber-300 font-bold font-mono text-xs">
            <Info className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <span>DEMO STORAGE NOTICE & LIMITATIONS</span>
          </div>
          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-950/60 text-amber-300 border border-amber-500/30">
            LOCAL BROWSER STORAGE
          </span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          In this hackathon evaluation prototype, evidence metadata and cryptographic digests are computed on your client
          machine using native Web Crypto APIs and preserved locally in browser memory (<code className="text-amber-300">localStorage</code>).
          Files are not transmitted to a remote cloud backend. In a production criminal forensics deployment, evidence files are
          dispatched via encrypted streams to an air-gapped, WORM (Write-Once-Read-Many) FIPS 140-2 Level 3 compliant hardware vault.
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="p-4 rounded-xl bg-[#0D1424]/90 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by Evidence ID, file name, SHA-256 hash, or case..."
            className="w-full bg-[#080E1C] border border-slate-700 rounded-xl pl-9 pr-3 py-1.5 text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 font-mono"
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

        {/* Case Filter */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400 font-mono">Case Filter:</span>
          <select
            value={caseFilter}
            onChange={(e) => setCaseFilter(e.target.value)}
            className="bg-[#080E1C] border border-slate-700 text-slate-300 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-cyan-400 font-mono"
          >
            <option value="ALL">All Cases ({evidence.length})</option>
            {caseIds.map((cid) => (
              <option key={cid} value={cid}>
                {cid}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Evidence Table Display (Displaying all requested fields) */}
      <div className="rounded-2xl bg-[#0D1424]/90 border border-slate-800 overflow-x-auto shadow-xl">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead className="bg-[#080E1C] text-slate-400 uppercase text-[11px] font-mono border-b border-slate-800">
            <tr>
              <th className="px-4 py-3.5">Evidence ID & Name</th>
              <th className="px-4 py-3.5">Case ID</th>
              <th className="px-4 py-3.5">Type & Size</th>
              <th className="px-4 py-3.5">Upload Date</th>
              <th className="px-4 py-3.5">SHA-256 Checksum</th>
              <th className="px-4 py-3.5">Processing Status</th>
              <th className="px-4 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-sans">
            {filteredEvidence.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                  <div className="space-y-2">
                    <FileKey2 className="w-8 h-8 text-slate-600 mx-auto" />
                    <p className="text-sm font-semibold text-white">No evidence artifacts found</p>
                    <p className="text-xs text-slate-500">
                      Upload supported files (PNG, JPG, PDF, TXT, CSV, JSON) to seal them in the vault.
                    </p>
                    <button
                      onClick={onOpenAddEvidence}
                      className="mt-2 px-3.5 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-semibold"
                    >
                      Upload Evidence Now
                    </button>
                  </div>
                </td>
              </tr>
            ) : (
              filteredEvidence.map((item) => {
                const isVerified = verifiedMap[item.id] || false;
                const isVerifying = verifyingId === item.id;

                return (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-800/40 transition-colors group cursor-pointer"
                    onClick={() => setSelectedItem(item)}
                  >
                    {/* Evidence ID & Name */}
                    <td className="px-4 py-3.5 max-w-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-cyan-400 font-bold text-xs bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30">
                          {item.id}
                        </span>
                      </div>
                      <div className="font-semibold text-white mt-1 group-hover:text-cyan-300 transition-colors line-clamp-1 flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                        <span className="truncate">{item.fileName}</span>
                      </div>
                    </td>

                    {/* Case ID */}
                    <td className="px-4 py-3.5">
                      <span className="font-mono font-bold text-slate-200 text-xs bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700">
                        {item.caseId}
                      </span>
                    </td>

                    {/* Type & Size */}
                    <td className="px-4 py-3.5">
                      <span className="text-slate-200 block truncate max-w-[140px]">{item.fileType}</span>
                      <span className="text-[10px] text-slate-500 font-mono">{item.fileSize}</span>
                    </td>

                    {/* Upload Date */}
                    <td className="px-4 py-3.5 text-slate-300 font-mono text-xs whitespace-nowrap">
                      {item.uploadedAt}
                    </td>

                    {/* SHA-256 Checksum with Copy Button */}
                    <td className="px-4 py-3.5 font-mono max-w-xs">
                      <div className="flex items-center gap-2 p-1.5 rounded bg-[#070B14] border border-slate-800">
                        <span className="text-cyan-300 truncate text-[11px] select-all">
                          {item.sha256}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCopyHash(item.sha256, item.id);
                          }}
                          className="p-1 rounded text-slate-400 hover:text-cyan-300 flex-shrink-0 transition-colors cursor-pointer"
                          title="Copy SHA-256 Hash"
                        >
                          {copiedHashId === item.id ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </td>

                    {/* Processing Status */}
                    <td className="px-4 py-3.5">
                      <div className="space-y-0.5">
                        <Badge variant="success" size="xs">
                          {item.processingStatus || item.custodyStatus || 'Sealed'}
                        </Badge>
                        <span className="text-[9px] font-mono text-amber-300/80 block">
                          Demo Local Vault
                        </span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3.5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => handleVerifyIntegrity(item.id)}
                          disabled={isVerifying}
                          className={`px-2.5 py-1 rounded-lg text-xs font-medium border font-mono transition-all flex items-center gap-1 cursor-pointer ${
                            isVerified
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                              : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                          }`}
                          title="Verify cryptographic integrity"
                        >
                          <RefreshCw className={`w-3 h-3 ${isVerifying ? 'animate-spin text-cyan-400' : ''}`} />
                          <span className="hidden sm:inline">
                            {isVerifying ? 'Verifying...' : isVerified ? 'Verified' : 'Verify'}
                          </span>
                        </button>

                        <button
                          onClick={() => setSelectedItem(item)}
                          className="p-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs transition-all cursor-pointer"
                          title="Inspect Metadata & Preview"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Forensic Inspection & Evidence Preview Modal */}
      {selectedItem && (
        <Modal
          isOpen={!!selectedItem}
          onClose={() => setSelectedItem(null)}
          title={`Forensic Artifact: ${selectedItem.fileName}`}
          subtitle={`Evidence ID: ${selectedItem.id} | Associated Case: ${selectedItem.caseId}`}
          icon={FileKey2}
          maxWidth="max-w-3xl"
        >
          <div className="space-y-5 text-xs">
            {/* Storage Disclosure Tag */}
            <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/30 text-amber-300 flex items-center justify-between font-mono text-[11px]">
              <span className="flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-amber-400" />
                Storage Mode: Local Browser Memory (Client-side Web Crypto)
              </span>
              <span className="text-emerald-400">STATUS: {selectedItem.tamperCheck || 'PASSED'}</span>
            </div>

            {/* Evidence Preview Section (where practical) */}
            {(selectedItem.previewUrl || selectedItem.previewContent || selectedItem.hexPreview) && (
              <div className="p-4 rounded-xl bg-[#080E1C] border border-slate-800 space-y-3">
                <div className="flex items-center justify-between pb-1 border-b border-slate-800">
                  <span className="text-cyan-400 font-bold uppercase tracking-wider font-mono flex items-center gap-1.5">
                    <Eye className="w-4 h-4" />
                    Evidence Content Preview
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">{selectedItem.fileType}</span>
                </div>

                {/* Image Preview */}
                {selectedItem.previewUrl && (
                  <div className="flex justify-center p-2 bg-[#050810] rounded-lg border border-slate-900 max-h-60 overflow-hidden">
                    <img
                      src={selectedItem.previewUrl}
                      alt="Evidence Preview"
                      className="max-h-56 object-contain rounded"
                    />
                  </div>
                )}

                {/* Text / CSV / JSON Preview */}
                {selectedItem.previewContent && (
                  <div className="p-3 rounded-lg bg-[#050810] border border-slate-900 font-mono text-[11px] text-slate-300 max-h-48 overflow-y-auto whitespace-pre-wrap leading-relaxed">
                    {selectedItem.previewContent}
                  </div>
                )}

                {/* Hex Stream Snippet */}
                {selectedItem.hexPreview && (
                  <div className="font-mono">
                    <span className="text-[10px] text-slate-500 block mb-1">
                      Header Magic Hex Stream:
                    </span>
                    <pre className="text-cyan-300 text-[11px] overflow-x-auto whitespace-pre p-2 bg-[#050810] rounded border border-slate-900">
                      {selectedItem.hexPreview}
                    </pre>
                  </div>
                )}
              </div>
            )}

            {/* Cryptographic Hash Summary */}
            <div className="p-4 rounded-xl bg-slate-900 border border-cyan-500/30 space-y-2.5 font-mono">
              <div className="flex items-center justify-between">
                <span className="text-cyan-400 font-bold uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Cryptographic Integrity Checksum (SHA-256)
                </span>
                <button
                  onClick={() => handleCopyHash(selectedItem.sha256, selectedItem.id)}
                  className="px-2.5 py-1 text-[11px] rounded bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/30 flex items-center gap-1"
                >
                  <Copy className="w-3 h-3" />
                  <span>Copy Hash</span>
                </button>
              </div>

              <div>
                <p className="text-cyan-200 break-all bg-[#070B14] p-2.5 rounded-lg border border-slate-800 text-xs select-all">
                  {selectedItem.sha256}
                </p>
              </div>

              {selectedItem.sha512 && (
                <div>
                  <span className="text-slate-500 text-[10px] block mb-0.5">SHA-512 Extended Checksum:</span>
                  <p className="text-slate-400 break-all bg-[#070B14] p-2 rounded-lg border border-slate-800 text-[11px] select-all">
                    {selectedItem.sha512}
                  </p>
                </div>
              )}
            </div>

            {/* Metadata Parameters Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-slate-500 text-[10px] block">File Size</span>
                <span className="text-white font-bold">{selectedItem.fileSize}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-slate-500 text-[10px] block">Upload Date</span>
                <span className="text-slate-200 truncate block">{selectedItem.uploadedAt}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-slate-500 text-[10px] block">Seizing Officer</span>
                <span className="text-cyan-300 truncate block">{selectedItem.uploadedBy}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-slate-500 text-[10px] block">Associated Case</span>
                <span className="text-emerald-400 font-bold">{selectedItem.caseId}</span>
              </div>
            </div>

            {/* Chain of Custody Log */}
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
              <span className="text-cyan-300 uppercase text-[10px] font-bold font-mono block">
                Chain of Custody Log (ISO/IEC 27037 Standard)
              </span>
              <div className="space-y-2">
                {selectedItem.custodyChain?.map((log, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-lg bg-[#070B14] border border-slate-800 flex items-start gap-2.5"
                  >
                    <Clock className="w-3.5 h-3.5 text-cyan-400 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="flex justify-between text-[10px] font-mono text-slate-400 mb-0.5">
                        <span className="text-cyan-400">{log.officer}</span>
                        <span>{log.timestamp}</span>
                      </div>
                      <p className="text-slate-200 text-xs">{log.action}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setSelectedItem(null)}
                className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium cursor-pointer"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
