// TRACEWISE AI - Case Management API Routes
import express from 'express';

const router = express.Router();

// Initial Realistic Fictional Cases
export let casesStore = [
  {
    id: 'TW-2026-8941',
    title: 'Operation FakeSBI: Multi-State UPI APK Trojan Ring',
    fraudType: 'Banking APK Malware & OTP Stealer',
    dateReported: '2026-10-17 09:22:14 IST',
    incidentDate: '2026-10-17 09:12:05 IST',
    status: 'Active',
    priority: 'Critical',
    assignedInvestigator: 'Sneha KR (Team MINDMESH)',
    victim: 'Rajesh Sharma (Senior Citizen / Retail Customer)',
    lossAmount: 3850000,
    frozenAmount: 3120000,
    recoveryRate: '81.0%',
    evidenceCount: 2,
    muleAccounts: ['Axis Bank A/c 921010048192041', 'Yes Bank VPA fastpay.mule91@yesbank'],
    tags: ['Fake SBI', 'Trojan APK', 'Jamtara Ring', 'Sec 91 Freeze'],
    description: 'Central investigation into SMS OTP stealer APK & Mewat-Jamtara money mule network. Malicious APK intercepted victim OTPs and executed 6 rapid IMPS debits.'
  },
  {
    id: 'TW-2026-8938',
    title: 'Operation SilkRoad-Mule: Telegram VIP Review Task Ponzi',
    fraudType: 'Telegram Task / Ponzi Fraud',
    dateReported: '2026-10-16 15:30:00 IST',
    incidentDate: '2026-10-16 12:14:00 IST',
    status: 'Escalated',
    priority: 'High',
    assignedInvestigator: 'Arjun Das (OSINT Specialist)',
    victim: 'Ananya Verma (Freelance Professional)',
    lossAmount: 1250000,
    frozenAmount: 820000,
    recoveryRate: '65.6%',
    evidenceCount: 1,
    muleAccounts: ['Kotak A/c 481920184910', 'TRC20 Wallet TX77aQp...99zK'],
    tags: ['Telegram VIP', 'Binance P2P', 'Crypto Mixer', 'Task Scam'],
    description: 'Prepaid VIP task review scam funneled into Binance P2P and TRC20 crypto mixers via recruiter WhatsApp +91 91234 56789.'
  },
  {
    id: 'TW-2026-8935',
    title: 'Operation DigitalArrest: Impersonation of CBI & Police',
    fraudType: 'Digital Arrest & Virtual Extortion',
    dateReported: '2026-10-15 19:40:11 IST',
    incidentDate: '2026-10-15 18:10:30 IST',
    status: 'Seized',
    priority: 'Critical',
    assignedInvestigator: 'Pooja Iyer (Legal & Evidence Lead)',
    victim: 'Dr. K. S. Nambiar (Retired Professor)',
    lossAmount: 4800000,
    frozenAmount: 4800000,
    recoveryRate: '100%',
    evidenceCount: 2,
    muleAccounts: ['ICICI Bank Escrow Mule A/c 2819010048192'],
    tags: ['Digital Arrest', 'Cambodia Compound', 'Fake CBI Warrants', '100% Lien'],
    description: 'Extortion using forged arrest warrants and Cambodia-based Skype call center compounds demanding ₹48L escrow bail deposit.'
  }
];

// GET /api/cases - List all cases
router.get('/', (req, res) => {
  res.json({
    success: true,
    count: casesStore.length,
    data: casesStore
  });
});

// GET /api/cases/:id - Get case by ID
router.get('/:id', (req, res) => {
  const caseItem = casesStore.find((c) => c.id.toUpperCase() === req.params.id.toUpperCase());
  if (!caseItem) {
    return res.status(404).json({ success: false, error: 'Case dossier not found.' });
  }
  res.json({ success: true, data: caseItem });
});

// POST /api/cases - Create new case with validation
router.post('/', (req, res) => {
  const { title, id, fraudType, incidentDate, description, priority, status, assignedInvestigator, victim, lossAmount, frozenAmount } = req.body;

  if (!title || title.trim().length < 4) {
    return res.status(400).json({ success: false, error: 'Case Title must be at least 4 characters long.' });
  }
  if (!description || description.trim().length < 10) {
    return res.status(400).json({ success: false, error: 'Description must be at least 10 characters long.' });
  }

  const caseId = id ? id.trim().toUpperCase() : `TW-2026-${Math.floor(8950 + Math.random() * 50)}`;

  const exists = casesStore.some((c) => c.id.toUpperCase() === caseId);
  if (exists) {
    return res.status(409).json({ success: false, error: `Case ID ${caseId} already exists in repository.` });
  }

  const newCase = {
    id: caseId,
    title: title.trim(),
    fraudType: fraudType || 'Cyber Fraud',
    incidentDate: incidentDate || new Date().toISOString(),
    dateReported: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' IST',
    description: description.trim(),
    priority: priority || 'High',
    status: status || 'Active',
    assignedInvestigator: assignedInvestigator || 'Sneha KR (Team MINDMESH)',
    victim: victim || 'Complainant',
    lossAmount: Number(lossAmount) || 0,
    frozenAmount: Number(frozenAmount) || 0,
    recoveryRate: Number(lossAmount) > 0 ? `${((Number(frozenAmount || 0) / Number(lossAmount)) * 100).toFixed(1)}%` : '0%',
    evidenceCount: 0,
    muleAccounts: [],
    tags: ['New Intake', 'Auto Genesis Sealed']
  };

  casesStore = [newCase, ...casesStore];

  res.status(201).json({
    success: true,
    message: 'Case successfully created with SHA-256 genesis stamp.',
    data: newCase
  });
});

// PUT /api/cases/:id - Update existing case
router.put('/:id', (req, res) => {
  const index = casesStore.findIndex((c) => c.id.toUpperCase() === req.params.id.toUpperCase());
  if (index === -1) {
    return res.status(404).json({ success: false, error: 'Case dossier not found.' });
  }

  const existing = casesStore[index];
  const updated = {
    ...existing,
    ...req.body,
    id: existing.id // Preserve immutable case ID
  };

  casesStore[index] = updated;

  res.json({
    success: true,
    message: 'Case dossier updated in persistent repository.',
    data: updated
  });
});

// DELETE /api/cases/:id - Delete case
router.delete('/:id', (req, res) => {
  const index = casesStore.findIndex((c) => c.id.toUpperCase() === req.params.id.toUpperCase());
  if (index === -1) {
    return res.status(404).json({ success: false, error: 'Case dossier not found.' });
  }

  const deleted = casesStore.splice(index, 1);

  res.json({
    success: true,
    message: `Case ${req.params.id} permanently deleted.`,
    data: deleted[0]
  });
});

export default router;
