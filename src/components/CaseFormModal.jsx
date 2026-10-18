import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import {
  ShieldAlert,
  Save,
  PlusCircle,
  AlertTriangle,
  RefreshCw,
  Sparkles,
  Calendar,
  User,
  Briefcase,
  Layers,
  Hash,
  Clock
} from 'lucide-react';
import { TEAM_MEMBERS } from '../data/mockData';

export default function CaseFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialCase = null,
  existingCases = []
}) {
  const isEditMode = Boolean(initialCase);

  const incidentTypes = [
    'Banking APK Malware & OTP Stealer',
    'Telegram Task / Ponzi Fraud',
    'Digital Arrest & Virtual Extortion',
    'UPI Reverse Charge / QR Phishing',
    'Predatory Spyware Loan App',
    'Cryptocurrency Laundering',
    'KYC Spoofing & SIM Swap',
    'Investment Advisory WhatsApp Scam',
    'Ransomware & Corporate Extortion'
  ];

  const priorityOptions = ['Critical', 'High', 'Medium', 'Low'];
  const statusOptions = ['Active', 'Escalated', 'Seized', 'Under Review', 'Closed'];

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    id: '',
    fraudType: incidentTypes[0],
    incidentDate: '',
    description: '',
    priority: 'High',
    status: 'Active',
    assignedInvestigator: TEAM_MEMBERS[0]?.name + ' (Team MINDMESH)' || 'Sneha KR (Team MINDMESH)',
    victim: '',
    lossAmount: '',
    frozenAmount: '',
    suspectIdentifiers: '',
    tags: 'UPI Phishing, Immediate 1930 Alert'
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auto-generate realistic Case ID helper
  const generateNewCaseId = () => {
    const year = new Date().getFullYear();
    const rand = Math.floor(8950 + Math.random() * 50);
    return `TW-${year}-${rand}`;
  };

  // Populate form on open or change
  useEffect(() => {
    if (initialCase) {
      setFormData({
        title: initialCase.title || '',
        id: initialCase.id || '',
        fraudType: initialCase.fraudType || incidentTypes[0],
        incidentDate:
          initialCase.incidentDate ||
          initialCase.dateReported?.substring(0, 16).replace(' ', 'T') ||
          new Date().toISOString().substring(0, 16),
        description: initialCase.description || initialCase.incidentSummary || '',
        priority: initialCase.priority || 'High',
        status: initialCase.status || 'Active',
        assignedInvestigator: initialCase.assignedInvestigator || 'Sneha KR (Team MINDMESH)',
        victim: initialCase.victim || '',
        lossAmount: initialCase.lossAmount !== undefined ? String(initialCase.lossAmount) : '250000',
        frozenAmount: initialCase.frozenAmount !== undefined ? String(initialCase.frozenAmount) : '0',
        suspectIdentifiers: initialCase.muleAccounts ? initialCase.muleAccounts.join(', ') : '',
        tags: initialCase.tags ? initialCase.tags.join(', ') : 'UPI Phishing, 1930 Alert'
      });
    } else {
      setFormData({
        title: '',
        id: generateNewCaseId(),
        fraudType: incidentTypes[0],
        incidentDate: new Date().toISOString().substring(0, 16),
        description: '',
        priority: 'Critical',
        status: 'Active',
        assignedInvestigator: 'Sneha KR (Team MINDMESH)',
        victim: '',
        lossAmount: '350000',
        frozenAmount: '120000',
        suspectIdentifiers: '',
        tags: 'UPI Phishing, Immediate 1930 Alert'
      });
    }
    setErrors({});
  }, [initialCase, isOpen]);

  // Validation function
  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Case Title is required.';
    } else if (formData.title.trim().length < 4) {
      newErrors.title = 'Case Title must be at least 4 characters.';
    }

    if (!formData.id.trim()) {
      newErrors.id = 'Case ID is required.';
    } else if (!/^TW-\d{4}-\d{3,5}$/i.test(formData.id.trim())) {
      newErrors.id = 'Case ID should follow format TW-YYYY-XXXX (e.g. TW-2026-8945).';
    } else {
      // Check for uniqueness
      const duplicate = existingCases.find(
        (c) =>
          c.id.toUpperCase() === formData.id.trim().toUpperCase() &&
          (!isEditMode || c.id !== initialCase?.id)
      );
      if (duplicate) {
        newErrors.id = `Case ID ${formData.id} already exists in the system.`;
      }
    }

    if (!formData.incidentDate) {
      newErrors.incidentDate = 'Incident Date & Time is required.';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Incident Description / Summary is required.';
    } else if (formData.description.trim().length < 10) {
      newErrors.description = 'Description should provide at least 10 characters of context.';
    }

    if (!formData.assignedInvestigator.trim()) {
      newErrors.assignedInvestigator = 'Investigator Name is required.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    const parsedLoss = parseInt(formData.lossAmount) || 0;
    const parsedFrozen = parseInt(formData.frozenAmount) || 0;
    const recoveryPct =
      parsedLoss > 0
        ? `${Math.min(100, Math.round((parsedFrozen / parsedLoss) * 100)).toFixed(1)}%`
        : '0.0%';

    const formattedDate = formData.incidentDate.includes('T')
      ? formData.incidentDate.replace('T', ' ') + ':00 IST'
      : formData.incidentDate;

    const casePayload = {
      ...(initialCase || {}),
      id: formData.id.trim().toUpperCase(),
      title: formData.title.trim(),
      fraudType: formData.fraudType,
      incidentDate: formData.incidentDate,
      dateReported: formattedDate,
      description: formData.description.trim(),
      incidentSummary: formData.description.trim(),
      priority: formData.priority,
      status: formData.status,
      assignedInvestigator: formData.assignedInvestigator,
      victim: formData.victim.trim() || 'Complainant (Confidential)',
      lossAmount: parsedLoss,
      frozenAmount: parsedFrozen,
      recoveryRate: recoveryPct,
      riskScore:
        formData.priority === 'Critical'
          ? 96
          : formData.priority === 'High'
          ? 86
          : formData.priority === 'Medium'
          ? 68
          : 42,
      tags: formData.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      muleAccounts: formData.suspectIdentifiers
        ? formData.suspectIdentifiers.split(',').map((s) => s.trim()).filter(Boolean)
        : initialCase?.muleAccounts || ['Mule Account Under Triage'],
      aiRecommendations: initialCase?.aiRecommendations || [
        'Dispatch Section 91 CrPC notice to beneficiary bank nodal officer.',
        'Extract suspect mobile IMEI and submit to CEIR portal.',
        'Cross-reference suspect VPA in TRACEWISE Mule Cluster Graph.'
      ],
      ipTrail: initialCase?.ipTrail || ['103.152.18.22'],
      evidenceCount: initialCase?.evidenceCount || 0,
      suspectNodes: initialCase?.suspectNodes || 4
    };

    // Simulate cryptographic commit delay
    setTimeout(() => {
      setIsSubmitting(false);
      onSubmit(casePayload);
      onClose();
    }, 400);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditMode ? `Edit Case Dossier: [${initialCase?.id}]` : 'Initiate Cyber Fraud Investigation Dossier'}
      subtitle="TRACEWISE AI Forensic Intake — Team MINDMESH"
      icon={ShieldAlert}
      maxWidth="max-w-3xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Top Cyber Advisory Banner */}
        <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/20 text-xs text-cyan-300 flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
          <p>
            {isEditMode
              ? 'Edits will be audited with an immutable timestamp entry in the Case History Log.'
              : 'New cases are automatically registered with a cryptographic genesis block under IT Act 2000 & BNS.'}
          </p>
        </div>

        {/* Case ID and Case Title Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Case ID *
              </label>
              {!isEditMode && (
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, id: generateNewCaseId() })}
                  className="text-[10px] text-cyan-400 hover:underline font-mono flex items-center gap-0.5"
                  title="Generate new ID"
                >
                  <RefreshCw className="w-2.5 h-2.5" />
                  Auto
                </button>
              )}
            </div>
            <input
              type="text"
              required
              value={formData.id}
              onChange={(e) => setFormData({ ...formData, id: e.target.value })}
              placeholder="e.g. TW-2026-8945"
              className={`w-full bg-[#080E1C] border ${
                errors.id ? 'border-rose-500 focus:ring-rose-500' : 'border-slate-700 focus:border-cyan-400'
              } rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none font-mono uppercase`}
            />
            {errors.id && <p className="text-[11px] text-rose-400 mt-1">{errors.id}</p>}
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Case Operation Title *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Operation FakeSBI: Multi-State UPI APK Trojan & SMS Stealer"
              className={`w-full bg-[#080E1C] border ${
                errors.title ? 'border-rose-500 focus:ring-rose-500' : 'border-slate-700 focus:border-cyan-400'
              } rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none font-sans`}
            />
            {errors.title && <p className="text-[11px] text-rose-400 mt-1">{errors.title}</p>}
          </div>
        </div>

        {/* Incident Type & Incident Date */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Incident Type / Modus Operandi *
            </label>
            <select
              value={formData.fraudType}
              onChange={(e) => setFormData({ ...formData, fraudType: e.target.value })}
              className="w-full bg-[#080E1C] border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-cyan-400"
            >
              {incidentTypes.map((type) => (
                <option key={type} value={type} className="bg-slate-900 text-white">
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Incident Date & Time *
            </label>
            <input
              type="datetime-local"
              required
              value={formData.incidentDate}
              onChange={(e) => setFormData({ ...formData, incidentDate: e.target.value })}
              className={`w-full bg-[#080E1C] border ${
                errors.incidentDate ? 'border-rose-500' : 'border-slate-700'
              } rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-cyan-400 font-mono`}
            />
            {errors.incidentDate && <p className="text-[11px] text-rose-400 mt-1">{errors.incidentDate}</p>}
          </div>
        </div>

        {/* Priority, Status & Assigned Investigator */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Severity Priority *
            </label>
            <select
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              className="w-full bg-[#080E1C] border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-400"
            >
              {priorityOptions.map((p) => (
                <option key={p} value={p} className="bg-slate-900 text-white">
                  {p}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Investigation Status *
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full bg-[#080E1C] border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-400"
            >
              {statusOptions.map((s) => (
                <option key={s} value={s} className="bg-slate-900 text-white">
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Investigator Lead *
            </label>
            <select
              value={formData.assignedInvestigator}
              onChange={(e) => setFormData({ ...formData, assignedInvestigator: e.target.value })}
              className="w-full bg-[#080E1C] border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-400"
            >
              <option value="Sneha KR (Team MINDMESH)">Sneha KR (Team MINDMESH)</option>
              <option value="Rohan Mehta (MINDMESH Threat Intel)">Rohan Mehta (MINDMESH Threat Intel)</option>
              <option value="Pooja Iyer (MINDMESH Digital Forensics)">Pooja Iyer (MINDMESH Digital Forensics)</option>
              <option value="Arjun Das (MINDMESH Cyber Ops)">Arjun Das (MINDMESH Cyber Ops)</option>
            </select>
            {errors.assignedInvestigator && (
              <p className="text-[11px] text-rose-400 mt-1">{errors.assignedInvestigator}</p>
            )}
          </div>
        </div>

        {/* Description / Incident Summary */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
            Incident Description & Modus Narrative *
          </label>
          <textarea
            rows={3}
            required
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Detailed description of the phishing attack vector, malicious APK, OTP interception, victim communication, or mule account routing..."
            className={`w-full bg-[#080E1C] border ${
              errors.description ? 'border-rose-500' : 'border-slate-700'
            } rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-400 leading-relaxed`}
          />
          {errors.description && <p className="text-[11px] text-rose-400 mt-1">{errors.description}</p>}
        </div>

        {/* Victim Profile and Financials */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Victim Complainant
            </label>
            <input
              type="text"
              value={formData.victim}
              onChange={(e) => setFormData({ ...formData, victim: e.target.value })}
              placeholder="e.g. Ramesh Chandra (New Delhi)"
              className="w-full bg-[#080E1C] border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Defrauded Amount (INR ₹)
            </label>
            <input
              type="number"
              value={formData.lossAmount}
              onChange={(e) => setFormData({ ...formData, lossAmount: e.target.value })}
              placeholder="e.g. 850000"
              className="w-full bg-[#080E1C] border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-cyan-400 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Secured / Frozen (INR ₹)
            </label>
            <input
              type="number"
              value={formData.frozenAmount}
              onChange={(e) => setFormData({ ...formData, frozenAmount: e.target.value })}
              placeholder="e.g. 350000"
              className="w-full bg-[#080E1C] border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-cyan-400 font-mono"
            />
          </div>
        </div>

        {/* Suspect Identifiers & Tags */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Suspect Mule Accounts / VPAs (comma-separated)
            </label>
            <input
              type="text"
              value={formData.suspectIdentifiers}
              onChange={(e) => setFormData({ ...formData, suspectIdentifiers: e.target.value })}
              placeholder="e.g. Axis A/c 92101004819, fastpay.mule@yesbank"
              className="w-full bg-[#080E1C] border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-cyan-400 font-mono text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Forensic Tags (comma-separated)
            </label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              placeholder="e.g. Trojan APK, SMS Forwarder, Mule Ring"
              className="w-full bg-[#080E1C] border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-cyan-400 font-mono text-xs"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 text-xs sm:text-sm font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs sm:text-sm font-semibold shadow-[0_0_20px_-3px_rgba(6,182,212,0.4)] transition-all cursor-pointer disabled:opacity-60"
          >
            {isSubmitting ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-cyan-200" />
                <span>Sealing Cryptographic Record...</span>
              </>
            ) : isEditMode ? (
              <>
                <Save className="w-4 h-4" />
                <span>Save Case Updates</span>
              </>
            ) : (
              <>
                <PlusCircle className="w-4 h-4" />
                <span>Create Case Dossier</span>
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}
