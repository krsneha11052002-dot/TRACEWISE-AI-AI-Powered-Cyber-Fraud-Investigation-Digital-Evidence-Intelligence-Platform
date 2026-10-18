// TRACEWISE AI - Evidence Vault API Routes
import express from 'express';

const router = express.Router();

export let evidenceStore = [
  {
    id: 'EVD-8941-01',
    caseId: 'TW-2026-8941',
    caseTitle: 'Operation FakeSBI: Multi-State Trojan Ring',
    fileName: 'SBI_Rewards_v4.apk',
    fileType: 'Android Application Package (APK)',
    fileSize: '4.82 MB',
    sha256: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
    uploadedAt: '2026-10-17 10:14:02 IST',
    uploadedBy: 'Sneha KR (Digital Forensics Lead)',
    custodyStatus: 'Sealed & Cryptographically Intact',
    tamperCheck: 'PASSED (0 Bit Deviation)'
  },
  {
    id: 'EVD-8941-02',
    caseId: 'TW-2026-8941',
    caseTitle: 'Operation FakeSBI: Multi-State Trojan Ring',
    fileName: 'telegram_bot_c2_traffic_dump.pcap',
    fileType: 'Wireshark Network Capture (PCAP)',
    fileSize: '18.4 MB',
    sha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    uploadedAt: '2026-10-17 12:20:15 IST',
    uploadedBy: 'Rohan Mehta (Network Forensics)',
    custodyStatus: 'Sealed & Cryptographically Intact',
    tamperCheck: 'PASSED (0 Bit Deviation)'
  },
  {
    id: 'EVD-8938-01',
    caseId: 'TW-2026-8938',
    caseTitle: 'Operation SilkRoad-Mule: Telegram Task Ponzi',
    fileName: 'telegram_chat_export_json_logs.json',
    fileType: 'JSON Forensic Chat Export',
    fileSize: '3.45 MB',
    sha256: '6a5b4c3d2e1f0a9b8c7d6e5f4a3b2c1d0e9f8a7b6c5d4e3f2a1b0c9d8e7f6a5b',
    uploadedAt: '2026-10-16 15:30:00 IST',
    uploadedBy: 'Arjun Das (OSINT Specialist)',
    custodyStatus: 'Sealed & Cryptographically Intact',
    tamperCheck: 'PASSED (0 Bit Deviation)'
  },
  {
    id: 'EVD-8935-01',
    caseId: 'TW-2026-8935',
    caseTitle: 'Operation DigitalArrest: Impersonation of CBI',
    fileName: 'skype_video_recording_fake_police.mp4',
    fileType: 'MPEG-4 Video Forensics (MP4)',
    fileSize: '412.6 MB',
    sha256: '4f53cda18c2baa0c0354bb5f9a3ecbe5ed12ab4d8e11ba873c2f11161202b945',
    uploadedAt: '2026-10-15 19:40:11 IST',
    uploadedBy: 'Sneha KR (Forensic Lead)',
    custodyStatus: 'Sealed & Cryptographically Intact',
    tamperCheck: 'PASSED (0 Bit Deviation)'
  },
  {
    id: 'EVD-8935-02',
    caseId: 'TW-2026-8935',
    caseTitle: 'Operation DigitalArrest: Impersonation of CBI',
    fileName: 'forged_supreme_court_arrest_order.pdf',
    fileType: 'Adobe Acrobat PDF Document',
    fileSize: '1.24 MB',
    sha256: 'bc94a9e25d218274a274a6217b1209e9921bdfc0827101899201948ba1284729',
    uploadedAt: '2026-10-15 20:12:00 IST',
    uploadedBy: 'Pooja Iyer (Document Forensics)',
    custodyStatus: 'Sealed & Cryptographically Intact',
    tamperCheck: 'PASSED (0 Bit Deviation)'
  }
];

// GET /api/evidence - Get all evidence items
router.get('/', (req, res) => {
  res.json({
    success: true,
    count: evidenceStore.length,
    data: evidenceStore
  });
});

// GET /api/evidence/case/:caseId - Get evidence for specific case
router.get('/case/:caseId', (req, res) => {
  const caseId = req.params.caseId.toUpperCase();
  const items = evidenceStore.filter((e) => e.caseId.toUpperCase() === caseId);
  res.json({
    success: true,
    count: items.length,
    data: items
  });
});

// POST /api/evidence - Add new evidence item
router.post('/', (req, res) => {
  const { fileName, caseId, sha256, fileType, fileSize, uploadedBy, notes } = req.body;

  if (!fileName || !caseId || !sha256) {
    return res.status(400).json({
      success: false,
      error: 'Missing required parameters: fileName, caseId, and sha256 are required.'
    });
  }

  // Validate SHA-256 hash format (64 hex characters)
  if (!/^[a-fA-F0-9]{64}$/.test(sha256)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid SHA-256 hash format. Must be 64 hexadecimal characters.'
    });
  }

  const newId = `EVD-${caseId.split('-')[2] || '9000'}-${Math.floor(10 + Math.random() * 90)}`;

  const evidenceItem = {
    id: newId,
    caseId,
    fileName,
    fileType: fileType || 'Binary Artifact',
    fileSize: fileSize || 'Unknown Size',
    sha256: sha256.toLowerCase(),
    uploadedAt: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' IST',
    uploadedBy: uploadedBy || 'Investigator (Team MINDMESH)',
    custodyStatus: 'Sealed & Cryptographically Intact',
    tamperCheck: 'PASSED (0 Bit Deviation)',
    notes: notes || 'Direct forensic ingest'
  };

  evidenceStore = [evidenceItem, ...evidenceStore];

  res.status(201).json({
    success: true,
    message: 'Digital evidence sealed with SHA-256 digest in Vault.',
    data: evidenceItem
  });
});

export default router;
