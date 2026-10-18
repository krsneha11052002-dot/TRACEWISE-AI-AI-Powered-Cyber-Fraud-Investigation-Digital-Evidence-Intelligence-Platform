// TRACEWISE AI - Persistent Storage Utility
// Manages localStorage synchronization for Cases, Evidence, Audit Logs, and URL History

import { INITIAL_CASES, INITIAL_EVIDENCE, ACTIVITY_FEED } from '../data/mockData';
import { INITIAL_TIMELINE_EVENTS } from '../data/timelineEventsData';

const STORAGE_KEYS = {
  CASES: 'tracewise_cases_v1',
  EVIDENCE: 'tracewise_evidence_v1',
  ACTIVITY: 'tracewise_activity_v1',
  CASE_AUDIT_LOGS: 'tracewise_case_audit_logs_v1',
  URL_HISTORY: 'tracewise_url_history_v1',
  TIMELINE_EVENTS: 'tracewise_timeline_events_v1',
  EXTRACTED_ENTITIES: 'tracewise_extracted_entities_v1'
};

// Safe localStorage getter with fallback
export function getStoredCases() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CASES);
    if (!raw) {
      saveStoredCases(INITIAL_CASES);
      return INITIAL_CASES;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_CASES;
  } catch (err) {
    console.error('Failed to read cases from localStorage:', err);
    return INITIAL_CASES;
  }
}

export function saveStoredCases(cases) {
  try {
    localStorage.setItem(STORAGE_KEYS.CASES, JSON.stringify(cases));
  } catch (err) {
    console.error('Failed to save cases to localStorage:', err);
  }
}

export function getStoredEvidence() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.EVIDENCE);
    if (!raw) {
      saveStoredEvidence(INITIAL_EVIDENCE);
      return INITIAL_EVIDENCE;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_EVIDENCE;
  } catch (err) {
    console.error('Failed to read evidence from localStorage:', err);
    return INITIAL_EVIDENCE;
  }
}

export function saveStoredEvidence(evidence) {
  try {
    localStorage.setItem(STORAGE_KEYS.EVIDENCE, JSON.stringify(evidence));
  } catch (err) {
    console.error('Failed to save evidence to localStorage:', err);
  }
}

export function getStoredActivity() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ACTIVITY);
    if (!raw) {
      saveStoredActivity(ACTIVITY_FEED);
      return ACTIVITY_FEED;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : ACTIVITY_FEED;
  } catch (err) {
    console.error('Failed to read activity from localStorage:', err);
    return ACTIVITY_FEED;
  }
}

export function saveStoredActivity(activity) {
  try {
    localStorage.setItem(STORAGE_KEYS.ACTIVITY, JSON.stringify(activity));
  } catch (err) {
    console.error('Failed to save activity to localStorage:', err);
  }
}

// Case-specific audit trail
export function getCaseAuditLogs(caseId) {
  try {
    const raw = localStorage.getItem(`${STORAGE_KEYS.CASE_AUDIT_LOGS}_${caseId}`);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Failed to load case audit logs:', err);
  }

  // Default seed audit logs if none exist for this case (marked as SAMPLE_DEMO)
  return [
    {
      id: `LOG-DEMO-01`,
      timestamp: '2026-10-17 09:22:14 IST',
      action: 'Case Dossier Intake Registered',
      actionType: 'edit',
      description: 'Initial intake logged via National Cyber Crime Helpline (1930) API.',
      officer: 'Sneha KR (Team MINDMESH)',
      source: 'SAMPLE_DEMO',
      evidenceId: 'EVD-8941-01'
    },
    {
      id: `LOG-DEMO-02`,
      timestamp: '2026-10-17 10:14:02 IST',
      action: 'Evidence Upload & Dual SHA-256 Sealed',
      actionType: 'upload',
      description: 'Physical extraction of "SBI_Rewards_v4.apk" ingested and cryptographically sealed.',
      officer: 'Sneha KR (Team MINDMESH)',
      source: 'SAMPLE_DEMO',
      evidenceId: 'EVD-8941-01'
    },
    {
      id: `LOG-DEMO-03`,
      timestamp: '2026-10-17 11:30:19 IST',
      action: 'Dynamic Sandbox Telemetry Inspected',
      actionType: 'view',
      description: 'Binary mounted in sandbox bridge; extracted Telegram bot webhook #6819201944.',
      officer: 'Rohan Mehta (Network Forensics)',
      source: 'SAMPLE_DEMO',
      evidenceId: 'EVD-8941-02'
    },
    {
      id: `LOG-DEMO-04`,
      timestamp: '2026-10-17 14:10:00 IST',
      action: 'Heuristic URL Threat Triage Executed',
      actionType: 'analysis',
      description: 'Automated scan of secure-sbi-kyc-verify-portal.in.net flagged with Risk Score 98/100.',
      officer: 'AI Threat Scanner Core',
      source: 'SAMPLE_DEMO',
      evidenceId: 'EVD-8941-01'
    }
  ];
}

export function addCaseAuditLog(caseId, logEntry) {
  try {
    const existing = getCaseAuditLogs(caseId);
    const updated = [
      {
        id: `LOG-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' IST',
        source: logEntry.source || 'LIVE_RECORDED', // Explicitly label live recorded actions
        actionType: logEntry.actionType || (logEntry.type === 'evidence' ? 'upload' : 'edit'),
        ...logEntry
      },
      ...existing
    ];
    localStorage.setItem(`${STORAGE_KEYS.CASE_AUDIT_LOGS}_${caseId}`, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error('Failed to append case audit log:', err);
    return [];
  }
}

// URL Analyzer Persistent History
export function getStoredUrlHistory() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.URL_HISTORY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (err) {
    console.error('Failed to read URL history from localStorage:', err);
  }

  // Default seeded history for immediate demonstration
  return [
    {
      id: 'SCAN-HIST-01',
      url: 'https://secure-sbi-kyc-verify-portal.in.net/login.php',
      defangedUrl: 'hxxps://secure-sbi-kyc-verify-portal[.]in[.]net/login[.]php',
      riskLevel: 'High',
      heuristicScore: 85,
      dangerCount: 3,
      warningCount: 2,
      analyzedAt: '2026-10-17 11:20:00 IST',
      associatedCaseId: 'TW-2026-8941'
    },
    {
      id: 'SCAN-HIST-02',
      url: 'http://185.220.101.45/download/sbi_update.apk',
      defangedUrl: 'hxxp://185[.]220[.]101[.]45/download/sbi_update[.]apk',
      riskLevel: 'High',
      heuristicScore: 95,
      dangerCount: 3,
      warningCount: 0,
      analyzedAt: '2026-10-17 10:45:10 IST',
      associatedCaseId: 'TW-2026-8941'
    },
    {
      id: 'SCAN-HIST-03',
      url: 'https://bit.ly/quick-reward-claim-2026',
      defangedUrl: 'hxxps://bit[.]ly/quick-reward-claim-2026',
      riskLevel: 'Medium',
      heuristicScore: 40,
      dangerCount: 0,
      warningCount: 2,
      analyzedAt: '2026-10-16 16:30:22 IST',
      associatedCaseId: 'TW-2026-8938'
    },
    {
      id: 'SCAN-HIST-04',
      url: 'https://www.incometax.gov.in/iec/foportal/',
      defangedUrl: 'hxxps://www[.]incometax[.]gov[.]in/iec/foportal/',
      riskLevel: 'Low',
      heuristicScore: 0,
      dangerCount: 0,
      warningCount: 0,
      analyzedAt: '2026-10-15 14:10:00 IST',
      associatedCaseId: null
    }
  ];
}

export function saveStoredUrlHistory(history) {
  try {
    localStorage.setItem(STORAGE_KEYS.URL_HISTORY, JSON.stringify(history));
  } catch (err) {
    console.error('Failed to save URL history to localStorage:', err);
  }
}

// Timeline Events Persistent Storage
export function getStoredTimelineEvents() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TIMELINE_EVENTS);
    if (!raw) {
      saveStoredTimelineEvents(INITIAL_TIMELINE_EVENTS);
      return INITIAL_TIMELINE_EVENTS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_TIMELINE_EVENTS;
  } catch (err) {
    console.error('Failed to read timeline events from localStorage:', err);
    return INITIAL_TIMELINE_EVENTS;
  }
}

export function saveStoredTimelineEvents(events) {
  try {
    localStorage.setItem(STORAGE_KEYS.TIMELINE_EVENTS, JSON.stringify(events));
  } catch (err) {
    console.error('Failed to save timeline events to localStorage:', err);
  }
}

export function appendStoredTimelineEvent(event) {
  try {
    const existing = getStoredTimelineEvents();
    const updated = [event, ...existing];
    saveStoredTimelineEvents(updated);
    return updated;
  } catch (err) {
    console.error('Failed to append timeline event:', err);
    return [];
  }
}

// Extracted Entities Persistent Storage
export function getStoredExtractedEntities() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.EXTRACTED_ENTITIES);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
    return [];
  } catch (err) {
    console.error('Failed to read extracted entities from localStorage:', err);
    return [];
  }
}

export function saveStoredExtractedEntities(entities) {
  try {
    localStorage.setItem(STORAGE_KEYS.EXTRACTED_ENTITIES, JSON.stringify(entities));
  } catch (err) {
    console.error('Failed to save extracted entities to localStorage:', err);
  }
}

export function resetToDemoData() {
  try {
    localStorage.removeItem(STORAGE_KEYS.CASES);
    localStorage.removeItem(STORAGE_KEYS.EVIDENCE);
    localStorage.removeItem(STORAGE_KEYS.ACTIVITY);
    localStorage.removeItem(STORAGE_KEYS.URL_HISTORY);
    localStorage.removeItem(STORAGE_KEYS.TIMELINE_EVENTS);
    localStorage.removeItem(STORAGE_KEYS.EXTRACTED_ENTITIES);
    saveStoredCases(INITIAL_CASES);
    saveStoredEvidence(INITIAL_EVIDENCE);
    saveStoredActivity(ACTIVITY_FEED);
    saveStoredTimelineEvents(INITIAL_TIMELINE_EVENTS);
    return {
      cases: INITIAL_CASES,
      evidence: INITIAL_EVIDENCE,
      activity: ACTIVITY_FEED,
      timeline: INITIAL_TIMELINE_EVENTS
    };
  } catch (err) {
    console.error('Failed to reset demo data:', err);
    return null;
  }
}
