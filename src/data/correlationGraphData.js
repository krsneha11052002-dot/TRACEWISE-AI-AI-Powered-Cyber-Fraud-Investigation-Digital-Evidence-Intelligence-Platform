// TRACEWISE AI - Evidence Correlation Graph Dataset
// Fictional realistic cyber fraud investigation entity relationships
// Complies with rule: Never invent links without displaying their supporting evidence.

export const CORRELATION_NODES = [
  // 1. Cases
  {
    id: 'CASE-8941',
    label: 'Operation FakeSBI: Multi-State Trojan Ring',
    type: 'case',
    caseId: 'TW-2026-8941',
    description: 'Central investigation into SMS OTP stealer APK & Mewat-Jamtara money mule network.',
    risk: 'Critical',
    category: 'Cyber Fraud Dossier'
  },
  {
    id: 'CASE-8938',
    label: 'Operation SilkRoad-Mule: Telegram Task Ponzi',
    type: 'case',
    caseId: 'TW-2026-8938',
    description: 'Prepaid VIP task review scam funneled into Binance P2P and TRC20 crypto mixers.',
    risk: 'High',
    category: 'Cyber Fraud Dossier'
  },
  {
    id: 'CASE-8935',
    label: 'Operation DigitalArrest: Impersonation of CBI',
    type: 'case',
    caseId: 'TW-2026-8935',
    description: 'Extortion using forged arrest warrants and Cambodia-based Skype call center compounds.',
    risk: 'Critical',
    category: 'Cyber Fraud Dossier'
  },

  // 2. Evidence Files
  {
    id: 'EVD-8941-01',
    label: 'SBI_Rewards_v4.apk',
    type: 'evidence_file',
    caseId: 'TW-2026-8941',
    description: 'Malicious Android APK package seized from victim Samsung M33 device.',
    sha256: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
    category: 'Seized APK Binary'
  },
  {
    id: 'EVD-8941-02',
    label: 'c2_traffic_dump.pcap',
    type: 'evidence_file',
    caseId: 'TW-2026-8941',
    description: 'Wireshark network capture of live telemetry during sandbox execution.',
    sha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    category: 'Network Capture (PCAP)'
  },
  {
    id: 'EVD-8938-01',
    label: 'telegram_chat_export.json',
    type: 'evidence_file',
    caseId: 'TW-2026-8938',
    description: 'Forensic JSON dump of Telegram channel "Global Hotel Reviews VIP 9".',
    sha256: '6a5b4c3d2e1f0a9b8c7d6e5f4a3b2c1d0e9f8a7b6c5d4e3f2a1b0c9d8e7f6a5b',
    category: 'Forensic Chat Log'
  },
  {
    id: 'EVD-8935-01',
    label: 'skype_video_fake_police.mp4',
    type: 'evidence_file',
    caseId: 'TW-2026-8935',
    description: '48-minute recorded video extortion session by fake police officers in uniform.',
    sha256: '4f53cda18c2baa0c0354bb5f9a3ecbe5ed12ab4d8e11ba873c2f11161202b945',
    category: 'Forensic Video Recording'
  },

  // 3. Phone Numbers
  {
    id: 'PHONE-01',
    label: '+91 98765 43210 (VoIP SIP)',
    type: 'phone_number',
    caseId: 'TW-2026-8941',
    description: 'Virtual SIP VoIP trunk number used to send automated fake SBI alert SMS.',
    category: 'Caller ID / SMS Sender'
  },
  {
    id: 'PHONE-02',
    label: '+91 87654 32109 (Mewat SIM)',
    type: 'phone_number',
    caseId: 'TW-2026-8941',
    description: 'Aadhaar-forged physical SIM card recovered from mule broker cluster in Nuh/Mewat.',
    category: 'Mule Auth Mobile'
  },
  {
    id: 'PHONE-03',
    label: '+91 91234 56789 (WhatsApp Desk)',
    type: 'phone_number',
    caseId: 'TW-2026-8938',
    description: 'Initial recruiter number for Telegram part-time VIP rating task scam.',
    category: 'Scam Coordinator Mobile'
  },

  // 4. Email Addresses
  {
    id: 'EMAIL-01',
    label: 'abuse-desk@namecheap-proxy.is',
    type: 'email_address',
    caseId: 'TW-2026-8941',
    description: 'Privacy protection contact for rogue domain secure-sbi-kyc-verify-portal.in.net.',
    category: 'Registrar WHOIS Email'
  },
  {
    id: 'EMAIL-02',
    label: 'vip_payout_ops@proton.me',
    type: 'email_address',
    caseId: 'TW-2026-8938',
    description: 'End-to-end encrypted email discovered in Telegram admin channel bot webhook config.',
    category: 'Threat Actor Email'
  },
  {
    id: 'EMAIL-03',
    label: 'cbi.cybercell.escrow@gmail.com',
    type: 'email_address',
    caseId: 'TW-2026-8935',
    description: 'Fraudulent Gmail address used to transmit Canva-generated fake arrest warrants.',
    category: 'Impersonation Email'
  },

  // 5. URLs / Domains
  {
    id: 'URL-01',
    label: 'secure-sbi-kyc-verify-portal.in.net',
    type: 'url',
    caseId: 'TW-2026-8941',
    description: 'Credential harvester & Trojan APK download portal registered 1 day prior to scam.',
    category: 'Phishing C2 Host'
  },
  {
    id: 'URL-02',
    label: 'api.telegram.org/bot6819201944',
    type: 'url',
    caseId: 'TW-2026-8941',
    description: 'Telegram Bot API webhook endpoint receiving exfiltrated victim SMS and OTPs.',
    category: 'C2 Telegram Webhook'
  },
  {
    id: 'URL-03',
    label: 'fedex-customs-parcel-clearance.live',
    type: 'url',
    caseId: 'TW-2026-8935',
    description: 'Fake parcel tracking portal detaining fake contraband parcel.',
    category: 'Digital Arrest C2'
  },

  // 6. Transaction References / Accounts
  {
    id: 'TX-01',
    label: 'Axis A/c ****9204 (₹14,20,000)',
    type: 'transaction_ref',
    caseId: 'TW-2026-8941',
    description: 'Primary Layer 1 mule bank account receiving rapid IMPS debits. Frozen via Sec 91 CrPC.',
    category: 'Mule Bank Account'
  },
  {
    id: 'TX-02',
    label: 'VPA: fastpay.mule91@yesbank',
    type: 'transaction_ref',
    caseId: 'TW-2026-8941',
    description: 'Virtual Payment Address collecting UPI intent transfers from SMS stealer victims.',
    category: 'UPI Beneficiary VPA'
  },
  {
    id: 'TX-03',
    label: 'TRC20: TX77aQp...99zK (USDT)',
    type: 'transaction_ref',
    caseId: 'TW-2026-8938',
    description: 'Tron blockchain wallet receiving laundered deposits converted via Binance P2P.',
    category: 'Crypto Mixer Wallet'
  },
  {
    id: 'TX-04',
    label: 'ICICI A/c ****2819 (₹48,00,000)',
    type: 'transaction_ref',
    caseId: 'TW-2026-8935',
    description: 'Purported "RBI Safe Escrow Verification" account. Frozen before overseas remittance.',
    category: 'Extortion Escrow Mule'
  },

  // 7. Timestamps / Event Anchors
  {
    id: 'TIME-01',
    label: '2026-10-17 09:21:18 IST',
    type: 'timestamp',
    caseId: 'TW-2026-8941',
    description: 'Exact second victim OTP was intercepted and forwarded by APK Trojan background service.',
    category: 'Forensic Event Anchor'
  },
  {
    id: 'TIME-02',
    label: '2026-10-17 09:22:45 IST',
    type: 'timestamp',
    caseId: 'TW-2026-8941',
    description: '6 rapid IMPS transactions executed across Layer 1 mules within 87 seconds.',
    category: 'Forensic Event Anchor'
  },
  {
    id: 'TIME-03',
    label: '2026-10-15 18:10:30 IST',
    type: 'timestamp',
    caseId: 'TW-2026-8935',
    description: 'Initial Skype extortion call initiated from Cambodian IP 194.26.29.112.',
    category: 'Forensic Event Anchor'
  }
];

export const CORRELATION_EDGES = [
  // CASE TO EVIDENCE (Confirmed)
  {
    id: 'EDGE-01',
    source: 'CASE-8941',
    target: 'EVD-8941-01',
    label: 'Seized APK Binary',
    matchType: 'CONFIRMED',
    confidence: '100%',
    supportingEvidenceId: 'EVD-8941-01',
    caseId: 'TW-2026-8941',
    reasoning: 'Acquired directly from victim Samsung Galaxy M33 device following ISO/IEC 27037 standards with verified SHA-256 genesis seal.'
  },
  {
    id: 'EDGE-02',
    source: 'CASE-8941',
    target: 'EVD-8941-02',
    label: 'Sandboxed PCAP Dump',
    matchType: 'CONFIRMED',
    confidence: '100%',
    supportingEvidenceId: 'EVD-8941-02',
    caseId: 'TW-2026-8941',
    reasoning: 'Extracted during live emulation inside TRACEWISE dynamic malware sandbox bridge.'
  },
  {
    id: 'EDGE-03',
    source: 'CASE-8938',
    target: 'EVD-8938-01',
    label: 'Chat Log Ingest',
    matchType: 'CONFIRMED',
    confidence: '100%',
    supportingEvidenceId: 'EVD-8938-01',
    caseId: 'TW-2026-8938',
    reasoning: 'Official Telegram desktop JSON export archived and cryptographically sealed.'
  },
  {
    id: 'EDGE-04',
    source: 'CASE-8935',
    target: 'EVD-8935-01',
    label: 'Video Session Ingest',
    matchType: 'CONFIRMED',
    confidence: '100%',
    supportingEvidenceId: 'EVD-8935-01',
    caseId: 'TW-2026-8935',
    reasoning: 'Extracted from victim laptop screen recording cache with facial biometric deepfake score 89.2%.'
  },

  // EVIDENCE TO IDENTIFIERS (Confirmed Data Matches)
  {
    id: 'EDGE-05',
    source: 'EVD-8941-01',
    target: 'URL-02',
    label: 'Extracted C2 Webhook',
    matchType: 'CONFIRMED',
    confidence: '100%',
    supportingEvidenceId: 'EVD-8941-01',
    caseId: 'TW-2026-8941',
    reasoning: 'Decompiled AndroidManifest.xml and smali bytecode contain hardcoded string "api.telegram.org/bot6819201944" in SMSReceiver.class.'
  },
  {
    id: 'EDGE-06',
    source: 'EVD-8941-01',
    target: 'URL-01',
    label: 'Hardcoded Payload Host',
    matchType: 'CONFIRMED',
    confidence: '100%',
    supportingEvidenceId: 'EVD-8941-01',
    caseId: 'TW-2026-8941',
    reasoning: 'Decompiled strings.xml contains initial update endpoint matching "secure-sbi-kyc-verify-portal.in.net".'
  },
  {
    id: 'EDGE-07',
    source: 'EVD-8941-02',
    target: 'TIME-01',
    label: 'Captured OTP Packet',
    matchType: 'CONFIRMED',
    confidence: '100%',
    supportingEvidenceId: 'EVD-8941-02',
    caseId: 'TW-2026-8941',
    reasoning: 'PCAP frame #4,812 timestamps POST request containing exfiltrated OTP token at exactly 09:21:18.428 IST.'
  },
  {
    id: 'EDGE-08',
    source: 'EVD-8938-01',
    target: 'PHONE-03',
    label: 'Exported Recruiter Mobile',
    matchType: 'CONFIRMED',
    confidence: '100%',
    supportingEvidenceId: 'EVD-8938-01',
    caseId: 'TW-2026-8938',
    reasoning: 'Victim chat history log explicitly contains Telegram vCard contact shared with phone number +91 91234 56789.'
  },
  {
    id: 'EDGE-09',
    source: 'EVD-8938-01',
    target: 'TX-03',
    label: 'Extracted USDT Address',
    matchType: 'CONFIRMED',
    confidence: '100%',
    supportingEvidenceId: 'EVD-8938-01',
    caseId: 'TW-2026-8938',
    reasoning: 'Admin bot message in chat log instructs victim to deposit USDT to Tron wallet address TX77aQp...99zK.'
  },
  {
    id: 'EDGE-10',
    source: 'EVD-8935-01',
    target: 'EMAIL-03',
    label: 'Shared Impersonation Email',
    matchType: 'CONFIRMED',
    confidence: '100%',
    supportingEvidenceId: 'EVD-8935-01',
    caseId: 'TW-2026-8935',
    reasoning: 'Recorded Skype chat stream displays scam caller sending PDF warrants from cbi.cybercell.escrow@gmail.com.'
  },
  {
    id: 'EDGE-11',
    source: 'EVD-8935-01',
    target: 'TX-04',
    label: 'Demanded Escrow Account',
    matchType: 'CONFIRMED',
    confidence: '100%',
    supportingEvidenceId: 'EVD-8935-01',
    caseId: 'TW-2026-8935',
    reasoning: 'Audio transcript records caller dictating ICICI A/c ****2819 as the "Supreme Court Escrow Verification Deposit".'
  },

  // FINANCIAL & TRANSACTION HOP CONNECTIONS (Confirmed)
  {
    id: 'EDGE-12',
    source: 'URL-01',
    target: 'TX-01',
    label: 'Phishing Form Directs To',
    matchType: 'CONFIRMED',
    confidence: '100%',
    supportingEvidenceId: 'EVD-8941-01',
    caseId: 'TW-2026-8941',
    reasoning: 'Form action backend script instructs victim netbanking session to add beneficiary Axis A/c ****9204.'
  },
  {
    id: 'EDGE-13',
    source: 'TX-01',
    target: 'TIME-02',
    label: 'IMPS Settlement Timestamp',
    matchType: 'CONFIRMED',
    confidence: '100%',
    supportingEvidenceId: 'EVD-8941-02',
    caseId: 'TW-2026-8941',
    reasoning: 'Bank Nodal statement UTR AXIS9102847 confirms ₹14.2L credit settled at 09:22:45 IST.'
  },
  {
    id: 'EDGE-14',
    source: 'URL-01',
    target: 'EMAIL-01',
    label: 'WHOIS Registrant Proxy',
    matchType: 'CONFIRMED',
    confidence: '100%',
    supportingEvidenceId: 'EVD-8941-01',
    caseId: 'TW-2026-8941',
    reasoning: 'RDAP WHOIS query for domain reveals technical contact abuse-desk@namecheap-proxy.is.'
  },

  // AI-SUGGESTED CORRELATIONS (Explainable Heuristics with Confidence)
  {
    id: 'EDGE-15',
    source: 'PHONE-01',
    target: 'URL-01',
    label: 'AI-Suggested: SMS Link Carrier',
    matchType: 'AI_SUGGESTED',
    confidence: '92%',
    supportingEvidenceId: 'EVD-8941-01',
    caseId: 'TW-2026-8941',
    reasoning: 'TRACEWISE AI Heuristic: SMS header CDR triangulation links VoIP SIP trunk +91 98765 43210 as the dispatch vehicle distributing URL-01 to victim handsets.'
  },
  {
    id: 'EDGE-16',
    source: 'PHONE-02',
    target: 'TX-01',
    label: 'AI-Suggested: Linked Auth Mobile',
    matchType: 'AI_SUGGESTED',
    confidence: '88%',
    supportingEvidenceId: 'EVD-8941-01',
    caseId: 'TW-2026-8941',
    reasoning: 'TRACEWISE AI Heuristic: Banking KYC audit logs list Mewat SIM +91 87654 32109 as the 2FA authentication mobile registered on Axis Mule A/c ****9204.'
  },
  {
    id: 'EDGE-17',
    source: 'TX-01',
    target: 'TX-02',
    label: 'AI-Suggested: Layer-2 UPI Dispersion',
    matchType: 'AI_SUGGESTED',
    confidence: '84%',
    supportingEvidenceId: 'EVD-8941-02',
    caseId: 'TW-2026-8941',
    reasoning: 'TRACEWISE AI Heuristic: Outgoing IMPS transaction timestamp and amount delta correlates Axis Bank mule cashout with Yes Bank VPA fastpay.mule91 within 120 seconds.'
  },
  {
    id: 'EDGE-18',
    source: 'TX-02',
    target: 'TX-03',
    label: 'AI-Suggested: Cross-Platform P2P Off-Ramp',
    matchType: 'AI_SUGGESTED',
    confidence: '79%',
    supportingEvidenceId: 'EVD-8938-01',
    caseId: 'TW-2026-8938',
    reasoning: 'TRACEWISE AI Heuristic: Correlates UPI merchant deposits into Yes Bank VPA with matching rupee-to-USDT conversion batches deposited to Tron Wallet TX77aQp...99zK on Binance P2P desk.'
  },
  {
    id: 'EDGE-19',
    source: 'EMAIL-02',
    target: 'URL-02',
    label: 'AI-Suggested: Shared Operator Infrastructure',
    matchType: 'AI_SUGGESTED',
    confidence: '86%',
    supportingEvidenceId: 'EVD-8938-01',
    caseId: 'TW-2026-8938',
    reasoning: 'TRACEWISE AI Heuristic: ProtonMail recovery metadata and Telegram Bot creator fingerprint match identical browser User-Agent and Romania Tor exit node IP.'
  },
  {
    id: 'EDGE-20',
    source: 'URL-03',
    target: 'TIME-03',
    label: 'AI-Suggested: Call Center Activation',
    matchType: 'AI_SUGGESTED',
    confidence: '91%',
    supportingEvidenceId: 'EVD-8935-01',
    caseId: 'TW-2026-8935',
    reasoning: 'TRACEWISE AI Heuristic: Web server access log for fake FedEx tracking portal shows IP 194.26.29.112 access 4 minutes prior to victim video call initiation.'
  }
];

export const NODE_TYPE_CONFIG = {
  case: {
    label: 'Case Dossier',
    shape: 'round-rectangle',
    bgColor: '#0284c7',
    borderColor: '#38bdf8',
    textColor: '#ffffff',
    iconName: 'Briefcase'
  },
  evidence_file: {
    label: 'Evidence File',
    shape: 'ellipse',
    bgColor: '#059669',
    borderColor: '#34d399',
    textColor: '#ffffff',
    iconName: 'FileKey2'
  },
  phone_number: {
    label: 'Phone Number',
    shape: 'diamond',
    bgColor: '#d97706',
    borderColor: '#fbbf24',
    textColor: '#ffffff',
    iconName: 'Phone'
  },
  email_address: {
    label: 'Email Address',
    shape: 'hexagon',
    bgColor: '#7c3aed',
    borderColor: '#a78bfa',
    textColor: '#ffffff',
    iconName: 'Mail'
  },
  url: {
    label: 'URL / C2 Domain',
    shape: 'round-hexagon',
    bgColor: '#e11d48',
    borderColor: '#fb7185',
    textColor: '#ffffff',
    iconName: 'Globe'
  },
  transaction_ref: {
    label: 'Transaction / Mule Ref',
    shape: 'rectangle',
    bgColor: '#0891b2',
    borderColor: '#22d3ee',
    textColor: '#ffffff',
    iconName: 'CreditCard'
  },
  timestamp: {
    label: 'Timestamp / Event Anchor',
    shape: 'octagon',
    bgColor: '#475569',
    borderColor: '#94a3b8',
    textColor: '#ffffff',
    iconName: 'Clock'
  }
};
