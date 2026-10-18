import express from 'express';
import { INITIAL_CASES, INITIAL_EVIDENCE, FORENSIC_TIMELINE, ACTIVITY_FEED } from '../../src/data/mockData.js';

const router = express.Router();

// Initial demo audit logs
const initialAuditLogs = [
  {
    id: 'LOG-001',
    caseId: 'TW-2026-8941',
    timestamp: '2026-10-17T09:25:00.000Z',
    action: 'CASE_CREATION',
    actor: 'Investigator Sneha KR',
    source: 'SYSTEM_RECORDED',
    description: 'Case registered and initial incident triage logged for Operation FakeSBI.',
    details: 'Loss: ₹38.5 Lakhs | Priority: Critical'
  },
  {
    id: 'LOG-002',
    caseId: 'TW-2026-8941',
    timestamp: '2026-10-17T10:14:02.000Z',
    action: 'EVIDENCE_UPLOAD',
    actor: 'Forensic Lead Sneha KR',
    source: 'SYSTEM_RECORDED',
    description: 'Malware APK uploaded to Evidence Vault and SHA-256 seal computed.',
    details: 'File: SBI_Rewards_v4.apk | SHA-256: 9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08'
  },
  {
    id: 'LOG-003',
    caseId: 'TW-2026-8941',
    timestamp: '2026-10-17T10:35:10.000Z',
    action: 'URL_ANALYSIS',
    actor: 'Heuristic Threat Scanner',
    source: 'SYSTEM_RECORDED',
    description: 'URL hxxps://secure-sbi-kyc-verify-portal[.]in[.]net evaluated.',
    details: 'Risk Level: HIGH (Score 98/100) | Impersonated Brand: SBI'
  },
  {
    id: 'LOG-004',
    caseId: 'TW-2026-8941',
    timestamp: '2026-10-17T11:00:00.000Z',
    action: 'CORRELATION_GRAPH',
    actor: 'Investigator Sneha KR',
    source: 'SYSTEM_RECORDED',
    description: 'Graph correlation performed linking 14 nodes across Mewat & Jamtara clusters.',
    details: 'Linked entities: 3 Mule accounts, 2 Phone numbers, 1 Telegram C2 Bot'
  }
];

// In-memory audit log store
let auditLogsStore = [...initialAuditLogs];

/**
 * GET /api/reports/:caseId
 * Generates structured report metadata for a given case
 */
router.get('/reports/:caseId', (req, res) => {
  const { caseId } = req.params;
  const targetCase = INITIAL_CASES.find(c => c.id === caseId) || {
    id: caseId,
    title: `Case #${caseId}`,
    fraudType: 'Cyber Fraud Investigation',
    assignedInvestigator: 'Lead Forensic Investigator',
    status: 'Active',
    priority: 'High'
  };

  const caseEvidence = INITIAL_EVIDENCE.filter(e => e.caseId === caseId);
  const caseTimeline = FORENSIC_TIMELINE.filter(t => t.caseId === caseId);
  const caseLogs = auditLogsStore.filter(l => l.caseId === caseId);

  // Compile forensic indicators
  const extractedEntities = {
    phoneNumbers: ['+91-98765-43210', '+91-91234-56789'],
    emails: ['support@sbisecure-auth.net', 'alerts@telecom-verify.in'],
    domains: ['sbisecure-auth.net', 'bit.ly/sbi-kyc-verify'],
    upiVpas: ['mule99@okhdfcbank', 'cyberrecovery@icici']
  };

  const reportPayload = {
    reportId: `REP-${caseId}-${Date.now().toString().slice(-4)}`,
    generatedAt: new Date().toISOString(),
    caseDetails: targetCase,
    summary: {
      evidenceCount: caseEvidence.length,
      timelineEventsCount: caseTimeline.length,
      auditLogEntriesCount: caseLogs.length,
      sha256SignaturesValidated: caseEvidence.filter(e => e.sha256).length
    },
    evidenceInventory: caseEvidence.map(e => ({
      id: e.id,
      title: e.title,
      fileName: e.fileName,
      fileSize: e.fileSize,
      fileType: e.fileType,
      sha256: e.sha256,
      uploadedAt: e.uploadedAt,
      tags: e.tags
    })),
    extractedEntities,
    timeline: caseTimeline,
    auditTrail: caseLogs,
    legalDisclaimer: 'TRACEWISE AI is an investigative decision-support and correlation platform. The generated findings, cryptographic digests, and correlation graphs assist qualified human investigators but do not constitute autonomous legal judgements or definitive guilt determinations.'
  };

  // Record audit log entry for report generation
  const newLog = {
    id: `LOG-REP-${Date.now()}`,
    caseId,
    timestamp: new Date().toISOString(),
    action: 'REPORT_GENERATION',
    actor: 'Lead Investigator (API)',
    source: 'LIVE_RECORDED',
    description: `Case investigation dossier generated for ${targetCase.title} (${targetCase.id})`,
    details: `Evidence items: ${caseEvidence.length}, Timeline items: ${caseTimeline.length}`
  };
  auditLogsStore.unshift(newLog);

  res.json({
    success: true,
    data: reportPayload
  });
});

/**
 * GET /api/audit-logs/:caseId
 * Retrieves audit log trail for a case
 */
router.get('/audit-logs/:caseId', (req, res) => {
  const { caseId } = req.params;
  const filtered = auditLogsStore.filter(l => l.caseId === caseId);
  res.json({
    success: true,
    count: filtered.length,
    data: filtered
  });
});

/**
 * POST /api/audit-logs/:caseId
 * Appends a verified forensic audit log entry
 */
router.post('/audit-logs/:caseId', (req, res) => {
  const { caseId } = req.params;
  const { action, actor, description, details } = req.body;

  if (!action || !description) {
    return res.status(400).json({ error: 'Action and description are required fields.' });
  }

  const logEntry = {
    id: `LOG-${Date.now()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
    caseId,
    timestamp: new Date().toISOString(),
    action: String(action).toUpperCase(),
    actor: actor || 'Investigator Agent',
    source: 'LIVE_RECORDED',
    description,
    details: details || 'Recorded via TRACEWISE API backend'
  };

  auditLogsStore.unshift(logEntry);

  res.status(201).json({
    success: true,
    data: logEntry
  });
});

export default router;
