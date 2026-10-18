// TRACEWISE AI - Timeline API Routes
import express from 'express';

const router = express.Router();

let timelineStore = [
  {
    id: 'EVT-01',
    rawDate: '2026-10-16T14:30:00.000Z',
    timestamp: '2026-10-16 20:00:00 IST',
    caseId: 'TW-2026-8941',
    eventType: 'suspicious_url',
    title: 'Phishing Domain "secure-sbi-kyc-verify-portal.in.net" Registered',
    description: 'Threat actor registered rogue domain via NameCheap proxy with automated Let\'s Encrypt SSL certificate deployed on Bucharest VPS.',
    actor: 'Syndicate Infrastructure Operator',
    evidenceId: 'EVD-8941-01'
  },
  {
    id: 'EVT-02',
    rawDate: '2026-10-17T03:42:05.000Z',
    timestamp: '2026-10-17 09:12:05 IST',
    caseId: 'TW-2026-8941',
    eventType: 'message',
    title: 'Smishing SMS Blast Sent via SIP VoIP Trunk',
    description: 'Urgent smishing SMS transmitted to victim mobile via VoIP trunk +91 98765 43210.',
    actor: 'VoIP Trunk (+91 98765 43210)',
    evidenceId: 'EVD-8941-01'
  },
  {
    id: 'EVT-03',
    rawDate: '2026-10-17T03:48:40.000Z',
    timestamp: '2026-10-17 09:18:40 IST',
    caseId: 'TW-2026-8941',
    eventType: 'incident',
    title: 'Malicious Trojan APK "SBI_Rewards_v4.apk" Executed',
    description: 'Victim deceived into installing side-loaded APK. Package requested READ_SMS and Accessibility permissions.',
    actor: 'Samsung Galaxy M33',
    evidenceId: 'EVD-8941-01'
  },
  {
    id: 'EVT-04',
    rawDate: '2026-10-17T03:51:18.000Z',
    timestamp: '2026-10-17 09:21:18 IST',
    caseId: 'TW-2026-8941',
    eventType: 'message',
    title: 'NetBanking OTP Silently Intercepted & Forwarded',
    description: 'Background SMS receiver intercepted incoming OTP "491028" from SBI and forwarded payload via HTTPS POST to Telegram Bot webhook.',
    actor: 'Telegram Bot API Webhook (#6819201944)',
    evidenceId: 'EVD-8941-02'
  },
  {
    id: 'EVT-05',
    rawDate: '2026-10-17T03:52:45.000Z',
    timestamp: '2026-10-17 09:22:45 IST',
    caseId: 'TW-2026-8941',
    eventType: 'transaction',
    title: '6 Rapid IMPS Debits Totaling ₹14,20,000 to Axis Mule Account',
    description: 'Funds drained from victim savings account to Axis Bank Mule A/c 921010048192041 within 87 seconds.',
    actor: 'Mule Broker Layer 1 (Nuh / Mewat Cluster)',
    evidenceId: 'EVD-8941-02'
  }
];

// GET /api/timeline - List all timeline events
router.get('/', (req, res) => {
  const caseId = req.query.caseId;
  const filtered = caseId ? timelineStore.filter((t) => t.caseId.toUpperCase() === caseId.toUpperCase()) : timelineStore;
  res.json({
    success: true,
    count: filtered.length,
    data: filtered
  });
});

// POST /api/timeline - Log new timeline event
router.post('/', (req, res) => {
  const { title, caseId, eventType, description, actor, evidenceId, timestamp } = req.body;

  if (!title || !caseId) {
    return res.status(400).json({ success: false, error: 'Title and Case ID are required.' });
  }

  const newEvent = {
    id: `EVT-${Date.now().toString().slice(-4)}`,
    rawDate: new Date().toISOString(),
    timestamp: timestamp || new Date().toISOString().replace('T', ' ').substring(0, 19) + ' IST',
    caseId,
    eventType: eventType || 'incident',
    title,
    description: description || '',
    actor: actor || 'Investigator',
    evidenceId: evidenceId || 'EVD-MANUAL'
  };

  timelineStore = [newEvent, ...timelineStore];

  res.status(201).json({
    success: true,
    message: 'Event appended to chronological kill chain timeline.',
    data: newEvent
  });
});

export default router;
