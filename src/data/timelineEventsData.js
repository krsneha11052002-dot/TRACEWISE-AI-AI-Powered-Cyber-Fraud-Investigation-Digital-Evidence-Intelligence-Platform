// TRACEWISE AI - Incident Timeline Events Dataset
// Comprehensive chronologically sortable multi-event dataset
// Types: incident | evidence_upload | transaction | message | suspicious_url

export const INITIAL_TIMELINE_EVENTS = [
  // 1. Phishing Domain Registered (Suspicious URL)
  {
    id: 'EVT-01',
    rawDate: '2026-10-16T14:30:00.000Z',
    timestamp: '2026-10-16 20:00:00 IST',
    caseId: 'TW-2026-8941',
    caseTitle: 'Operation FakeSBI: Multi-State Trojan Ring',
    eventType: 'suspicious_url',
    title: 'Phishing Domain "secure-sbi-kyc-verify-portal.in.net" Registered',
    description: 'Threat actor registered rogue domain via NameCheap proxy with automated Let\'s Encrypt SSL certificate deployed on Bucharest VPS.',
    actor: 'Syndicate Infrastructure Operator (Bucharest 185.220.101.45)',
    evidenceId: 'EVD-8941-01',
    extractedEntities: [
      { type: 'url', value: 'secure-sbi-kyc-verify-portal.in.net' },
      { type: 'email_address', value: 'abuse-desk@namecheap-proxy.is' }
    ],
    telemetry: {
      registrar: 'NameCheap, Inc.',
      asn: 'AS44192 (HostSailor Cloud)',
      nameservers: ['dns1.registrar-servers.com', 'dns2.registrar-servers.com'],
      whoisCountry: 'IS (Iceland Proxy)'
    }
  },

  // 2. Smishing SMS Blast Dispatched (Message)
  {
    id: 'EVT-02',
    rawDate: '2026-10-17T03:42:05.000Z',
    timestamp: '2026-10-17 09:12:05 IST',
    caseId: 'TW-2026-8941',
    caseTitle: 'Operation FakeSBI: Multi-State Trojan Ring',
    eventType: 'message',
    title: 'Smishing SMS Blast Sent via SIP VoIP Trunk',
    description: 'Urgent smishing SMS transmitted to victim mobile: "Dear SBI Customer, your YONO NetBanking will be suspended today. Update KYC urgently at https://secure-sbi-kyc-verify-portal.in.net/login.php".',
    actor: 'VoIP Trunk (+91 98765 43210)',
    evidenceId: 'EVD-8941-01',
    extractedEntities: [
      { type: 'phone_number', value: '+91 98765 43210' },
      { type: 'url', value: 'secure-sbi-kyc-verify-portal.in.net' }
    ],
    telemetry: {
      senderHeader: 'VK-SBIINB',
      gatewayType: 'SIP Trunk via Cambodian Route',
      protocol: 'SMPP v3.4'
    }
  },

  // 3. Malware Installed & C2 Beacon Established (Incident)
  {
    id: 'EVT-03',
    rawDate: '2026-10-17T03:48:40.000Z',
    timestamp: '2026-10-17 09:18:40 IST',
    caseId: 'TW-2026-8941',
    caseTitle: 'Operation FakeSBI: Multi-State Trojan Ring',
    eventType: 'incident',
    title: 'Malicious Trojan APK "SBI_Rewards_v4.apk" Executed',
    description: 'Victim deceived into installing side-loaded APK. Package requested READ_SMS, RECEIVE_SMS, and Accessibility Service to intercept OTPs.',
    actor: 'Malware Agent on Samsung Galaxy M33',
    evidenceId: 'EVD-8941-01',
    extractedEntities: [
      { type: 'url', value: 'api.telegram.org/bot6819201944' }
    ],
    telemetry: {
      packageName: 'com.sbi.rewards.update.sys',
      sha256: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
      permissions: ['READ_SMS', 'RECEIVE_SMS', 'SYSTEM_ALERT_WINDOW']
    }
  },

  // 4. OTP Silently Intercepted (Message / Telemetry)
  {
    id: 'EVT-04',
    rawDate: '2026-10-17T03:51:18.000Z',
    timestamp: '2026-10-17 09:21:18 IST',
    caseId: 'TW-2026-8941',
    caseTitle: 'Operation FakeSBI: Multi-State Trojan Ring',
    eventType: 'message',
    title: 'NetBanking OTP Silently Intercepted & Forwarded',
    description: 'Background SMS receiver intercepted incoming OTP "491028" from SBI and forwarded payload via HTTPS POST to Telegram Bot webhook.',
    actor: 'Telegram Bot API Webhook (#6819201944)',
    evidenceId: 'EVD-8941-02',
    extractedEntities: [
      { type: 'url', value: 'api.telegram.org/bot6819201944' },
      { type: 'date_time', value: '2026-10-17 09:21:18 IST' }
    ],
    telemetry: {
      pcapFrame: 4812,
      protocol: 'TLS 1.3 / HTTP/2',
      destinationIp: '149.154.167.220:443 (Telegram Core LLC)'
    }
  },

  // 5. IMPS Layer 1 Siphoning Transactions (Transaction)
  {
    id: 'EVT-05',
    rawDate: '2026-10-17T03:52:45.000Z',
    timestamp: '2026-10-17 09:22:45 IST',
    caseId: 'TW-2026-8941',
    caseTitle: 'Operation FakeSBI: Multi-State Trojan Ring',
    eventType: 'transaction',
    title: '6 Rapid IMPS Debits Totaling ₹14,20,000 to Axis Mule Account',
    description: 'Funds drained from victim savings account to Axis Bank Mule A/c 921010048192041 within 87 seconds. Auth mobile +91 87654 32109 active in Mewat.',
    actor: 'Mule Broker Layer 1 (Nuh / Mewat Cluster)',
    evidenceId: 'EVD-8941-02',
    extractedEntities: [
      { type: 'currency_amount', value: '₹14,20,000' },
      { type: 'transaction_ref', value: 'AXIS9102847' },
      { type: 'transaction_ref', value: 'A/c 921010048192041' },
      { type: 'phone_number', value: '+91 87654 32109' }
    ],
    telemetry: {
      settlementChannel: 'NPCI IMPS Switch',
      utr: 'AXIS9102847',
      originatingIp: '103.212.43.12 (Airtel Broadband Nuh)'
    }
  },

  // 6. Layer 2 UPI Dispersion (Transaction)
  {
    id: 'EVT-06',
    rawDate: '2026-10-17T03:54:10.000Z',
    timestamp: '2026-10-17 09:24:10 IST',
    caseId: 'TW-2026-8941',
    caseTitle: 'Operation FakeSBI: Multi-State Trojan Ring',
    eventType: 'transaction',
    title: 'Layer-2 UPI Instant Transfer to VPA fastpay.mule91@yesbank',
    description: '₹3,50,000 instantly dispersed from Axis mule account to Yes Bank virtual payment address to evade threshold freeze alerts.',
    actor: 'Automated Mule Script',
    evidenceId: 'EVD-8941-02',
    extractedEntities: [
      { type: 'currency_amount', value: '₹3,50,000' },
      { type: 'transaction_ref', value: 'fastpay.mule91@yesbank' }
    ],
    telemetry: {
      upiRrn: '629104819204',
      bankVpa: 'fastpay.mule91@yesbank',
      beneficiaryBank: 'Yes Bank Ltd.'
    }
  },

  // 7. Physical Evidence Seizure Ingest (Evidence Upload)
  {
    id: 'EVT-07',
    rawDate: '2026-10-17T04:44:02.000Z',
    timestamp: '2026-10-17 10:14:02 IST',
    caseId: 'TW-2026-8941',
    caseTitle: 'Operation FakeSBI: Multi-State Trojan Ring',
    eventType: 'evidence_upload',
    title: 'Seized APK "SBI_Rewards_v4.apk" Cryptographically Ingested',
    description: 'Victim handset forensically imaged. Package extracted following ISO/IEC 27037 standards with verified dual SHA-256 genesis hash.',
    actor: 'Sneha KR (Digital Forensics Lead)',
    evidenceId: 'EVD-8941-01',
    extractedEntities: [
      { type: 'transaction_ref', value: 'SHA-256: 9f86d081884c...' }
    ],
    telemetry: {
      fileSize: '4.82 MB',
      sha256: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
      vaultCertificate: 'SEC-65B-CERT-2026-0041'
    }
  },

  // 8. Telegram Task Ponzi WhatsApp Contact (Message)
  {
    id: 'EVT-08',
    rawDate: '2026-10-16T06:44:00.000Z',
    timestamp: '2026-10-16 12:14:00 IST',
    caseId: 'TW-2026-8938',
    caseTitle: 'Operation SilkRoad-Mule: Telegram Task Ponzi',
    eventType: 'message',
    title: 'Recruitment WhatsApp Message from +91 91234 56789',
    description: 'Victim approached with fake job offer promising ₹5,000/day for writing Google reviews. Instructed to join Telegram group "VIP Hotel Rating Desk".',
    actor: 'Scam Coordinator Mobile (+91 91234 56789)',
    evidenceId: 'EVD-8938-01',
    extractedEntities: [
      { type: 'phone_number', value: '+91 91234 56789' },
      { type: 'currency_amount', value: '₹5,000' }
    ],
    telemetry: {
      appSource: 'WhatsApp Messenger Web Client',
      virtualCountryCode: '+91 (India, VoIP Virtual Sim)'
    }
  },

  // 9. Telegram Chat Log Seized in Vault (Evidence Upload)
  {
    id: 'EVT-09',
    rawDate: '2026-10-16T10:00:00.000Z',
    timestamp: '2026-10-16 15:30:00 IST',
    caseId: 'TW-2026-8938',
    caseTitle: 'Operation SilkRoad-Mule: Telegram Task Ponzi',
    eventType: 'evidence_upload',
    title: 'Telegram Forensic Chat Export Ingested (1,894 Messages)',
    description: 'Official Telegram desktop JSON export sealed into Vault. Extracted TRC20 wallet addresses and payout email contacts.',
    actor: 'Arjun Das (OSINT Specialist)',
    evidenceId: 'EVD-8938-01',
    extractedEntities: [
      { type: 'email_address', value: 'vip_payout_ops@proton.me' }
    ],
    telemetry: {
      fileSize: '3.45 MB',
      sha256: '6a5b4c3d2e1f0a9b8c7d6e5f4a3b2c1d0e9f8a7b6c5d4e3f2a1b0c9d8e7f6a5b',
      messageCount: 1894
    }
  },

  // 10. Crypto Laundering Transfer (Transaction)
  {
    id: 'EVT-10',
    rawDate: '2026-10-16T10:35:40.000Z',
    timestamp: '2026-10-16 16:05:40 IST',
    caseId: 'TW-2026-8938',
    caseTitle: 'Operation SilkRoad-Mule: Telegram Task Ponzi',
    eventType: 'transaction',
    title: '15,000 USDT Crypto Transfer to Tron Wallet TX77aQp...99zK',
    description: 'Victim deposited ₹12.5 Lakhs via Binance P2P escrow which was converted to 15,000 USDT and routed to threat actor TRC20 mixer address.',
    actor: 'Binance P2P Mule Desk / Threat Actor',
    evidenceId: 'EVD-8938-01',
    extractedEntities: [
      { type: 'currency_amount', value: '15,000 USDT' },
      { type: 'transaction_ref', value: 'TX77aQp8910283419082349102849199zK' }
    ],
    telemetry: {
      blockchain: 'Tron (TRC20)',
      txHash: '0x884910284bca1920848102941029481029481902840192840192840192840192',
      mixerDestination: 'Tornado.cash TRON Fork'
    }
  },

  // 11. Fake Customs Clearances Portal (Suspicious URL)
  {
    id: 'EVT-11',
    rawDate: '2026-10-15T12:00:00.000Z',
    timestamp: '2026-10-15 17:30:00 IST',
    caseId: 'TW-2026-8935',
    caseTitle: 'Operation DigitalArrest: Impersonation of CBI',
    eventType: 'suspicious_url',
    title: 'Fake FedEx Customs Tracking Portal Hosted in Moscow',
    description: 'Threat actors launched fake parcel detention site displaying forged MDMA contraband seizure notice against victim name.',
    actor: 'Cambodian Call Center Compound (IP: 194.26.29.112)',
    evidenceId: 'EVD-8935-01',
    extractedEntities: [
      { type: 'url', value: 'fedex-customs-parcel-clearance.live' }
    ],
    telemetry: {
      ipGeo: 'Moscow, Russia (AS48102)',
      sslIssuer: 'cPanel, Inc. Free SSL'
    }
  },

  // 12. Extortion Video Call Initiated (Incident)
  {
    id: 'EVT-12',
    rawDate: '2026-10-15T12:40:30.000Z',
    timestamp: '2026-10-15 18:10:30 IST',
    caseId: 'TW-2026-8935',
    caseTitle: 'Operation DigitalArrest: Impersonation of CBI',
    eventType: 'incident',
    title: '48-Minute Digital Arrest Video Call Initiated on Skype',
    description: 'Scammers in simulated Mumbai Police uniforms placed victim in continuous surveillance extortion lock, citing illegal parcel clearance.',
    actor: 'Fake Officer Inspector Vikram Rathore (+91 88776 55443)',
    evidenceId: 'EVD-8935-01',
    extractedEntities: [
      { type: 'phone_number', value: '+91 88776 55443' },
      { type: 'email_address', value: 'cbi.cybercell.escrow@gmail.com' }
    ],
    telemetry: {
      skypeAccountId: 'live:.cid.89410284cba1',
      deepfakeScore: '89.2% synthetic video artifacts detected'
    }
  },

  // 13. Extortion ₹48,00,000 Transfer to Escrow Mule (Transaction)
  {
    id: 'EVT-13',
    rawDate: '2026-10-15T13:45:00.000Z',
    timestamp: '2026-10-15 19:15:00 IST',
    caseId: 'TW-2026-8935',
    caseTitle: 'Operation DigitalArrest: Impersonation of CBI',
    eventType: 'transaction',
    title: 'RTGS Extortion Transfer of ₹48,00,000 to ICICI Escrow Mule',
    description: 'Terrified victim transferred life savings into ICICI Bank Mule A/c 2819010048192 falsely represented as "Supreme Court Bail Verification".',
    actor: 'Extortion Syndicate / Layer 1 Mule',
    evidenceId: 'EVD-8935-01',
    extractedEntities: [
      { type: 'currency_amount', value: '₹48,00,000' },
      { type: 'transaction_ref', value: 'ICIC9920148102' },
      { type: 'transaction_ref', value: 'A/c 2819010048192' }
    ],
    telemetry: {
      rtgsUtr: 'ICIC9920148102',
      accountStatus: 'Lien Marked & Frozen under Sec 91 CrPC'
    }
  }
];

export const EVENT_TYPE_CONFIG = {
  incident: {
    label: 'Incident Event',
    badgeVariant: 'critical',
    dotColor: 'bg-rose-500',
    borderColor: 'border-rose-500/30',
    bgColor: 'bg-rose-500/10',
    textColor: 'text-rose-400'
  },
  evidence_upload: {
    label: 'Evidence Upload',
    badgeVariant: 'success',
    dotColor: 'bg-emerald-500',
    borderColor: 'border-emerald-500/30',
    bgColor: 'bg-emerald-500/10',
    textColor: 'text-emerald-400'
  },
  transaction: {
    label: 'Financial Transaction',
    badgeVariant: 'cyan',
    dotColor: 'bg-cyan-500',
    borderColor: 'border-cyan-500/30',
    bgColor: 'bg-cyan-500/10',
    textColor: 'text-cyan-400'
  },
  message: {
    label: 'Message / Smishing',
    badgeVariant: 'medium',
    dotColor: 'bg-amber-500',
    borderColor: 'border-amber-500/30',
    bgColor: 'bg-amber-500/10',
    textColor: 'text-amber-400'
  },
  suspicious_url: {
    label: 'Suspicious URL',
    badgeVariant: 'purple',
    dotColor: 'bg-purple-500',
    borderColor: 'border-purple-500/30',
    bgColor: 'bg-purple-500/10',
    textColor: 'text-purple-400'
  }
};
