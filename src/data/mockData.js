// TRACEWISE AI - Mock Forensic & Cyber Investigation Data
// Built for Hackathon Team MINDMESH

export const INITIAL_STATS = {
  activeCases: 42,
  casesChange: '+8 this week',
  fraudPrevented: '₹5,84,20,000',
  fraudPreventedUSD: '$702,400',
  fundsFrozenRate: '78.4%',
  evidenceItems: 386,
  tamperFreeRate: '100.0%',
  highRiskUrlsFlagged: 154,
  muleAccountsDetected: 89,
  avgTriageTime: '4.2 min',
  aiClusteringAccuracy: '99.4%'
};

export const INITIAL_CASES = [
  {
    id: 'TW-2026-8941',
    title: 'Operation FakeSBI: Multi-State UPI APK Trojan & SMS Forwarder Ring',
    fraudType: 'Banking APK Malware & OTP Stealer',
    victim: 'Prof. Ramesh Chandra K (Retd. Central Govt Officer, New Delhi)',
    lossAmount: 3850000,
    frozenAmount: 3120000,
    recoveryRate: '81.0%',
    status: 'Escalated',
    priority: 'Critical',
    dateReported: '2026-10-17 09:22:14 IST',
    assignedInvestigator: 'Sneha KR (Team MINDMESH)',
    riskScore: 96,
    tags: ['Trojan APK', 'SMS Forwarder', 'Mule Network', 'Immediate 1930 Alert'],
    suspectNodes: 14,
    evidenceCount: 18,
    incidentSummary:
      'Victim received an SMS purporting to be from State Bank of India claiming "Dear Customer, your YONO account is locked. Update PAN via APK immediately". Victim downloaded "SBI_Rewards_v4.apk". The malware intercepted SMS permissions, forwarded OTPs to a Telegram Bot (ID: 6819201944), and initiated 6 rapid IMPS transactions across 4 different mule accounts in under 7 minutes.',
    aiRecommendations: [
      'Issue emergency Section 91 CrPC notice to Axis Bank and Canara Bank Nodal Officers for accounts AC-9912 and AC-4421.',
      'Blacklist C2 Telegram Webhook API token at gateway level.',
      'Extract C2 IP address 185.220.101.45 (Tor Exit node) and cross-reference with Jamtara-Mewat cluster in Evidence Graph.'
    ],
    ipTrail: ['185.220.101.45', '103.152.18.22', '45.145.66.19'],
    muleAccounts: ['HDFC Bank - 5010049210291', 'Axis Bank - 921010048192041', 'Canara Bank - 120029104812'],
    cryptocurrencyTraces: ['TRC20: TYq9...83Kx (Split into 3 sub-wallets)']
  },
  {
    id: 'TW-2026-8938',
    title: 'Operation SilkRoad-Mule: Telegram Part-Time Review & Crypto Laundering',
    fraudType: 'Telegram Task / Ponzi Fraud',
    victim: 'Ananya Deshmukh (Software Engineer, Bengaluru)',
    lossAmount: 1840000,
    frozenAmount: 1250000,
    recoveryRate: '67.9%',
    status: 'Active',
    priority: 'High',
    dateReported: '2026-10-16 14:45:00 IST',
    assignedInvestigator: 'Rohan Mehta (MINDMESH Threat Intel)',
    riskScore: 89,
    tags: ['Telegram Ponzi', 'Crypto Mixer', 'USDT Laundering', 'Mule Layering'],
    suspectNodes: 9,
    evidenceCount: 11,
    incidentSummary:
      'Victim was lured into a Telegram channel "Global Hotel Reviews VIP 9" promising ₹3,500 daily for booking ratings. After initial payout of ₹800, she was coerced into "Pre-Paid Merchant Task" tiers totaling ₹18.4 Lakhs. Funds were deposited into regional cooperative bank mule accounts and immediately routed into Binance P2P and Tron TRC20 mixer addresses.',
    aiRecommendations: [
      'Generate Binance Law Enforcement Request (LER) for USDT deposit address TX77a...99z.',
      'Correlate Telegram handles @hotel_admin_91 and @vip_finance_desk with active SIM IMSI records.',
      'Flag merchant QR codes linked to BharatPe VPA "fastpay.merch91@yesbank".'
    ],
    ipTrail: ['103.195.103.12', '14.139.12.88'],
    muleAccounts: ['Kotak Mahindra - 8819201948', 'Yes Bank - 001928374619'],
    cryptocurrencyTraces: ['TRC20: TX77aQp...99zK', 'Binance UID: 481920831']
  },
  {
    id: 'TW-2026-8935',
    title: 'Operation DigitalArrest: Impersonation of CBI / Mumbai Police Cyber Cell',
    fraudType: 'Digital Arrest & Virtual Extortion',
    victim: 'Dr. Mohan Lal Verma (Cardiologist, Lucknow)',
    lossAmount: 5200000,
    frozenAmount: 4800000,
    recoveryRate: '92.3%',
    status: 'Seized',
    priority: 'Critical',
    dateReported: '2026-10-15 18:10:30 IST',
    assignedInvestigator: 'Sneha KR (Team MINDMESH)',
    riskScore: 98,
    tags: ['Digital Arrest', 'Deepfake Audio', 'Skype Extortion', 'Account Seized'],
    suspectNodes: 19,
    evidenceCount: 24,
    incidentSummary:
      'Victim received an IVR call claiming a FedEx parcel containing contraband (MDMA & fake passports) in Taiwan was booked with his Aadhaar. Scam callers on Skype impersonated "DCP Cyber Crime Mumbai" in uniform with realistic background props and forged Supreme Court arrest warrants. Victim was kept on continuous video surveillance for 48 hours and forced to liquidate fixed deposits into "RBI Safe Verification Escrow Accounts".',
    aiRecommendations: [
      'Digital evidence package exported for Special Cell Court submission with SHA-256 certificate.',
      '₹48 Lakhs successfully frozen in ICICI & PNB before overseas Hawala remittance.',
      'Skype account ID "officer.mumbaipolice.gov" submitted to Microsoft CERT for IP log preservation.'
    ],
    ipTrail: ['194.26.29.112 (Cambodia Scam Park)', '185.190.140.21'],
    muleAccounts: ['ICICI Bank - 004801592819', 'Punjab National Bank - 192800019281'],
    cryptocurrencyTraces: []
  },
  {
    id: 'TW-2026-8929',
    title: 'Operation QR-Trap: OLX Marketplace Reverse-Payment Fraud',
    fraudType: 'UPI Reverse Charge / QR Phishing',
    victim: 'Kavita Sundaram (School Principal, Chennai)',
    lossAmount: 215000,
    frozenAmount: 185000,
    recoveryRate: '86.0%',
    status: 'Under Review',
    priority: 'Medium',
    dateReported: '2026-10-14 11:05:12 IST',
    assignedInvestigator: 'Arjun Das (MINDMESH Cyber Ops)',
    riskScore: 68,
    tags: ['UPI Phishing', 'OLX Scam', 'QR Manipulator', 'PhonePe VPA'],
    suspectNodes: 5,
    evidenceCount: 6,
    incidentSummary:
      'Victim listed home furniture for sale on OLX. Buyer claimed to be an Army Officer relocating to Chennai and sent a Google Pay / PhonePe QR code stating "Scan this to receive advance token money of ₹25,000". Scanning the QR prompted the UPI PIN screen, debiting the account repeatedly under manipulated intent URIs.',
    aiRecommendations: [
      'Send automated UPI VPA freeze mandate to NPCI for ID "defence.canteen.pay@paytm".',
      'Trace caller location via cellular tower triangulation in Bharatpur/Alwar cluster.'
    ],
    ipTrail: ['49.207.181.99'],
    muleAccounts: ['State Bank of India - 31092819482'],
    cryptocurrencyTraces: []
  },
  {
    id: 'TW-2026-8920',
    title: 'Operation PhantomLoan: Instant NBFC Loan App Extortion & Contact Harassment',
    fraudType: 'Predatory Spyware Loan App',
    victim: 'Deepak Rao (Delivery Partner, Pune)',
    lossAmount: 95000,
    frozenAmount: 60000,
    recoveryRate: '63.1%',
    status: 'Active',
    priority: 'High',
    dateReported: '2026-10-12 16:30:45 IST',
    assignedInvestigator: 'Pooja Iyer (MINDMESH Digital Forensics)',
    riskScore: 84,
    tags: ['Spyware APK', 'Contact Exfiltration', 'Defamation Extortion', 'Illegal NBFC'],
    suspectNodes: 12,
    evidenceCount: 14,
    incidentSummary:
      'Victim installed "FastCash Express Loan" from a third-party link. The app requested broad permissions (Contacts, Gallery, Call Logs, Camera). Only ₹3,800 was disbursed for a ₹10,000 loan, but 5 days later victim faced relentless extortion with morphed obscene photos sent to his entire contact list.',
    aiRecommendations: [
      'File Domain Takedown for download CDN hosted at "fastloan-s3-ap-southeast.xyz".',
      'Extracted C2 server payload shows telemetry endpoint exfiltrating 1,420 contact cards.'
    ],
    ipTrail: ['103.208.220.14', '118.107.180.5'],
    muleAccounts: ['Bandhan Bank - 201928471920', 'Equitas SFB - 1002918274'],
    cryptocurrencyTraces: []
  },
  {
    id: 'TW-2026-8914',
    title: 'Operation CryptoBridge: Cross-Chain DEX Mixer Heist',
    fraudType: 'Cryptocurrency Laundering',
    victim: 'Web3 Ventures India Pvt Ltd (Hyderabad)',
    lossAmount: 14200000,
    frozenAmount: 9800000,
    recoveryRate: '69.0%',
    status: 'Escalated',
    priority: 'Critical',
    dateReported: '2026-10-10 20:15:22 IST',
    assignedInvestigator: 'Sneha KR (Team MINDMESH)',
    riskScore: 97,
    tags: ['Smart Contract Exploit', 'Tornado Cash', 'Chain Hopping', 'Bridge Swap'],
    suspectNodes: 28,
    evidenceCount: 32,
    incidentSummary:
      'Private key compromise led to unauthorized transfer of 180,000 USDT from hot wallet. Attacker utilized ThorChain, Railgun, and bridging to Avalanche to obfuscate fund lineage across 16 intermediate hop addresses.',
    aiRecommendations: [
      'Automate real-time alerts on Chainalysis and MistTrack for cluster 0x89b...31e.',
      'Submit emergency freeze notice to Tether Treasury for 42,000 USDT stranded on Ethereum wallet.'
    ],
    ipTrail: ['198.54.130.12', '176.123.9.44'],
    muleAccounts: [],
    cryptocurrencyTraces: [
      'ETH: 0x89b142018291048bca192048912',
      'AVAX: 0x4819a...19d',
      'ThorChain Vault: 0x11829...ffa'
    ]
  }
];

export const INITIAL_EVIDENCE = [
  {
    id: 'EVD-8941-01',
    caseId: 'TW-2026-8941',
    caseTitle: 'Operation FakeSBI: Multi-State UPI APK Trojan',
    fileName: 'SBI_Rewards_v4.apk',
    fileType: 'Android Application Package (APK)',
    fileSize: '4.82 MB',
    sha256: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
    sha512: 'ee26b0dd4af7e749aa1a8ee3c10ae9923f618980772e470f8819a189b3a1691f68c7e0760f1aa4ff01006e4b29dbba58',
    uploadedAt: '2026-10-17 10:14:02 IST',
    uploadedBy: 'Sneha KR (Forensic Analyst)',
    custodyStatus: 'Sealed & Cryptographically Intact',
    tamperCheck: 'PASSED (0 Bit Deviation)',
    exifMetadata: {
      package: 'com.sbi.rewards.update.sys',
      minSdkVersion: '24 (Android 7.0)',
      targetSdkVersion: '34 (Android 14)',
      permissions: ['READ_SMS', 'RECEIVE_SMS', 'SEND_SMS', 'INTERNET', 'SYSTEM_ALERT_WINDOW'],
      c2Endpoint: 'hxxps://api.telegram.org/bot6819201944:AAH.../sendMessage',
      extractedSignature: 'CN=Android Debug, O=Android, C=US (Self-signed test cert)'
    },
    hexPreview: '50 4B 03 04 14 00 08 00 08 00 48 8F 9B 58 72 B4 99 18 32 A0 00 00 | PK........H..Xr...2..',
    custodyChain: [
      { timestamp: '2026-10-17 10:14:02 IST', officer: 'Sneha KR', action: 'Digital Evidence Ingested from Victim Device (Samsung Galaxy M33)' },
      { timestamp: '2026-10-17 10:15:30 IST', officer: 'TRACEWISE AI Core', action: 'Computed Dual Hashes (SHA-256 & SHA-512) and sealed in Vault' },
      { timestamp: '2026-10-17 11:30:19 IST', officer: 'Rohan Mehta', action: 'Mounted inside Sandboxed Dynamic Decompiler for behavioral extraction' },
      { timestamp: '2026-10-17 14:05:00 IST', officer: 'Sneha KR', action: 'Generated Court Section 65B Admissible Certificate' }
    ]
  },
  {
    id: 'EVD-8941-02',
    caseId: 'TW-2026-8941',
    caseTitle: 'Operation FakeSBI: Multi-State UPI APK Trojan',
    fileName: 'telegram_bot_c2_traffic_dump.pcap',
    fileType: 'Wireshark Network Capture (PCAP)',
    fileSize: '18.4 MB',
    sha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    sha512: 'cf83e1357eefb8bdf1542850d66d8007d620e4050b5715dc83f4a921d36ce9ce47d0d13c5d85f2b0ff8318d2877eec2f',
    uploadedAt: '2026-10-17 12:20:15 IST',
    uploadedBy: 'Rohan Mehta (Network Forensics)',
    custodyStatus: 'Sealed & Cryptographically Intact',
    tamperCheck: 'PASSED (0 Bit Deviation)',
    exifMetadata: {
      packetsCaptured: '41,890 packets',
      protocols: ['DNS', 'TLS 1.3', 'HTTP/2', 'TCP'],
      c2Destinations: ['185.220.101.45:443', '149.154.167.220:443 (Telegram API)'],
      exfiltratedStringsDetected: ['OTP: 491028', 'Beneficiary: AC-921010048192041', 'DeviceID: a8f9102c']
    },
    hexPreview: 'D4 C3 B2 A1 02 00 04 00 00 00 00 00 00 00 00 00 00 00 04 00 01 00 | ....................',
    custodyChain: [
      { timestamp: '2026-10-17 12:20:15 IST', officer: 'Rohan Mehta', action: 'PCAP extracted from network bridge monitor during live emulation' },
      { timestamp: '2026-10-17 12:22:00 IST', officer: 'TRACEWISE AI Core', action: 'Signature verified and locked with immutable timestamp' }
    ]
  },
  {
    id: 'EVD-8935-01',
    caseId: 'TW-2026-8935',
    caseTitle: 'Operation DigitalArrest: Impersonation of Mumbai Police',
    fileName: 'skype_video_recording_fake_police.mp4',
    fileType: 'MPEG-4 Video Forensics (MP4)',
    fileSize: '412.6 MB',
    sha256: '4f53cda18c2baa0c0354bb5f9a3ecbe5ed12ab4d8e11ba873c2f11161202b945',
    sha512: '7b919a28c46522c7a0d42ec2e0d7c04143a571f11c70e281577967b587a8f15893d58f334a11c855b7f14b66df870f44',
    uploadedAt: '2026-10-15 19:40:11 IST',
    uploadedBy: 'Sneha KR (Forensic Lead)',
    custodyStatus: 'Sealed & Cryptographically Intact',
    tamperCheck: 'PASSED (0 Bit Deviation)',
    exifMetadata: {
      duration: '48m 12s',
      resolution: '1920x1080 @ 30fps',
      audioCodec: 'AAC 128 kbps',
      deepfakeArtifactsScore: '89.2% probability of synthetic background insertion',
      scamStudioLightingAnomalies: 'Detected artificial green screen halo around collar lapel'
    },
    hexPreview: '00 00 00 20 66 74 79 70 69 73 6F 6D 00 00 02 00 69 73 6F 6D 69 73 | ... ftypisom....isomis',
    custodyChain: [
      { timestamp: '2026-10-15 19:40:11 IST', officer: 'Sneha KR', action: 'Extracted from victim laptop screen recording cache' },
      { timestamp: '2026-10-15 19:45:00 IST', officer: 'TRACEWISE AI Core', action: 'Facial Biometric & Audio Pitch Analysis pipeline completed' }
    ]
  },
  {
    id: 'EVD-8935-02',
    caseId: 'TW-2026-8935',
    caseTitle: 'Operation DigitalArrest: Impersonation of Mumbai Police',
    fileName: 'forged_supreme_court_arrest_order.pdf',
    fileType: 'Adobe Acrobat PDF Document',
    fileSize: '1.24 MB',
    sha256: 'bc94a9e25d218274a274a6217b1209e9921bdfc0827101899201948ba1284729',
    sha512: '12498fa10948bcae91209841892019284192081948912048190284091820948190284091820948190284091820948190',
    uploadedAt: '2026-10-15 20:12:00 IST',
    uploadedBy: 'Pooja Iyer (Document Forensics)',
    custodyStatus: 'Sealed & Cryptographically Intact',
    tamperCheck: 'PASSED (0 Bit Deviation)',
    exifMetadata: {
      author: 'Canva Web User (Non-Govt)',
      createdDate: '2026-10-15 03:14:00 UTC',
      producer: 'Skia/PDF m122',
      fontAnomalies: ['TimesNewRomanPSMT mismatched header', 'Distorted National Emblem watermark'],
      forgedSignatures: ['Forged Chief Justice of India seal', 'Fake RBI Central Escrow Stamp']
    },
    hexPreview: '25 50 44 46 2D 31 2E 37 0A 25 D3 EB E9 E1 0A 34 20 30 20 6F 62 6A | %PDF-1.7.%....4 0 obj',
    custodyChain: [
      { timestamp: '2026-10-15 20:12:00 IST', officer: 'Pooja Iyer', action: 'Extracted from WhatsApp chat export attachment' },
      { timestamp: '2026-10-15 20:15:20 IST', officer: 'TRACEWISE AI Core', action: 'Metadata forensic PDF stream decompiled and logged' }
    ]
  },
  {
    id: 'EVD-8938-01',
    caseId: 'TW-2026-8938',
    caseTitle: 'Operation SilkRoad-Mule: Telegram Part-Time Review',
    fileName: 'telegram_chat_export_json_logs.json',
    fileType: 'JSON Forensic Chat Export',
    fileSize: '3.45 MB',
    sha256: '6a5b4c3d2e1f0a9b8c7d6e5f4a3b2c1d0e9f8a7b6c5d4e3f2a1b0c9d8e7f6a5b',
    sha512: 'a1b2c3d4e5f60718293a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c',
    uploadedAt: '2026-10-16 15:30:00 IST',
    uploadedBy: 'Arjun Das (OSINT Specialist)',
    custodyStatus: 'Sealed & Cryptographically Intact',
    tamperCheck: 'PASSED (0 Bit Deviation)',
    exifMetadata: {
      totalMessages: '1,894 messages',
      participants: ['Victim', '@vip_task_coordinator_9', '@finance_payout_desk_bot'],
      identifiedBankVPAs: ['merchant8912@icici', 'vipfast.task@kotak', 'bharatpe.mule77@yesbank'],
      detectedCryptoAddresses: ['TX77aQp...99zK', 'Binance Deposit: 481920831']
    },
    hexPreview: '7B 22 6E 61 6D 65 22 3A 20 22 54 65 6C 65 67 72 61 6D 20 43 68 61 | {"name": "Telegram Cha',
    custodyChain: [
      { timestamp: '2026-10-16 15:30:00 IST', officer: 'Arjun Das', action: 'Official Telegram Desktop JSON export acquired and sealed' }
    ]
  }
];

export const SAMPLE_URLS = [
  {
    url: 'https://secure-sbi-kyc-verify-portal.in.net/login.php',
    displayUrl: 'hxxps://secure-sbi-kyc-verify-portal[.]in[.]net/login.php',
    targetBrand: 'State Bank of India (SBI)',
    category: 'Credential Harvester / Phishing',
    riskScore: 98,
    verdict: 'MALICIOUS_PHISHING',
    status: 'ACTIVE_ROGUE',
    whois: {
      domain: 'secure-sbi-kyc-verify-portal.in.net',
      registrar: 'NameCheap, Inc.',
      creationDate: '2026-10-16 (1 day ago)',
      expiryDate: '2027-10-16',
      registrantCountry: 'IS (Iceland - Privacy Protected via Withheld for Privacy ehf)',
      nameServers: ['dns1.registrar-servers.com', 'dns2.registrar-servers.com'],
      dnsStatus: 'clientTransferProhibited'
    },
    ssl: {
      valid: true,
      issuer: "Let's Encrypt Authority X3 (Free Automated Cert)",
      validFrom: '2026-10-16',
      validTo: '2027-01-14',
      mismatchWarning: 'SSL issued for third-party VPS; strictly lacks Organization Validation (OV/EV)'
    },
    ipGeo: {
      ip: '185.220.101.45',
      asn: 'AS44192 (HostSailor Cloud)',
      country: 'Romania 🇷🇴',
      city: 'Bucharest',
      threatReputation: 'High Abuse Score (98/100) - Known Tor Exit Node & Phishing Host'
    },
    sandbox: {
      detectedInputs: [
        'Username / CIF Number',
        'Profile Password',
        'Registered Mobile Number',
        'High Security One-Time Password (OTP)',
        'Card PIN & Expiry'
      ],
      redirectCount: 2,
      scriptsFound: 7,
      maliciousPayloadFound: 'Keystroke logger & Webhook dispatcher to Telegram Bot (ID: 6819201944)',
      screenshotUrl: 'sbi_fake_preview.png',
      domTitle: 'SBI - Internet Banking Secure Verification Portal'
    },
    countermeasures: {
      takedownTarget: 'abuse@namecheap.com, cert-in@cert-in.org.in, abuse@hostsailor.com',
      recommendation: 'Issue immediate Section 79(3)(b) IT Act emergency takedown notice to Namecheap & Cloudflare.'
    }
  },
  {
    url: 'http://fedex-customs-parcel-clearance.live/track?id=FDX-99812',
    displayUrl: 'hxxp://fedex-customs-parcel-clearance[.]live/track?id=FDX-99812',
    targetBrand: 'FedEx Express / India Customs',
    category: 'Digital Arrest / Malware Dropper',
    riskScore: 94,
    verdict: 'MALICIOUS_DROPPER',
    status: 'ACTIVE_ROGUE',
    whois: {
      domain: 'fedex-customs-parcel-clearance.live',
      registrar: 'Hostinger Operations, UAB',
      creationDate: '2026-10-14 (3 days ago)',
      expiryDate: '2027-10-14',
      registrantCountry: 'US (Proxy Protection)',
      nameServers: ['ns1.dns-parking.com', 'ns2.dns-parking.com'],
      dnsStatus: 'Active'
    },
    ssl: {
      valid: false,
      issuer: 'None (Plain Insecure HTTP connection)',
      validFrom: 'N/A',
      validTo: 'N/A',
      mismatchWarning: 'CRITICAL: No encryption. Credentials transmitted in cleartext'
    },
    ipGeo: {
      ip: '194.26.29.112',
      asn: 'AS200019 (Stark Industries Solutions)',
      country: 'Cambodia 🇰🇭',
      city: 'Sihanoukville',
      threatReputation: 'Linked to Sihanoukville Cyber Fraud Compound infrastructure'
    },
    sandbox: {
      detectedInputs: ['Aadhaar Number', 'Passport Copy Upload', 'Phone Number'],
      redirectCount: 1,
      scriptsFound: 4,
      maliciousPayloadFound: 'Automatic download trigger for "FedEx_Police_Inspection.apk"',
      screenshotUrl: 'fedex_fake_preview.png',
      domTitle: 'FedEx Parcel Detained - Narcotics Bureau Clearance'
    },
    countermeasures: {
      takedownTarget: 'abuse@hostinger.com, abuse@stark-industries.solutions',
      recommendation: 'Dispatch immediate block request to DoT (Department of Telecommunications) & CERT-In.'
    }
  },
  {
    url: 'https://telegram-vip-daily-task-earning.xyz/register',
    displayUrl: 'hxxps://telegram-vip-daily-task-earning[.]xyz/register',
    targetBrand: 'Generic Telegram Work-From-Home Scam',
    category: 'Ponzi Investment / Task Fraud',
    riskScore: 91,
    verdict: 'MALICIOUS_FRAUD',
    status: 'ACTIVE_ROGUE',
    whois: {
      domain: 'telegram-vip-daily-task-earning.xyz',
      registrar: 'Porkbun LLC',
      creationDate: '2026-10-11 (6 days ago)',
      expiryDate: '2027-10-11',
      registrantCountry: 'PA (Panama Privacy)',
      nameServers: ['curt.ns.cloudflare.com', 'elsa.ns.cloudflare.com'],
      dnsStatus: 'Active behind Cloudflare Reverse Proxy'
    },
    ssl: {
      valid: true,
      issuer: 'Cloudflare Inc ECC CA-3',
      validFrom: '2026-10-11',
      validTo: '2027-01-10',
      mismatchWarning: 'SNI Proxy shielding backend origin server'
    },
    ipGeo: {
      ip: '104.21.55.91',
      asn: 'AS13335 (Cloudflare, Inc.)',
      country: 'United States 🇺🇸',
      city: 'San Francisco',
      threatReputation: 'Origin IP uncovered via certificate transparency: 103.195.103.12 (Hong Kong)'
    },
    sandbox: {
      detectedInputs: ['Telegram Username', 'Referral Code', 'USDT TRC20 Wallet Address', 'Password'],
      redirectCount: 0,
      scriptsFound: 12,
      maliciousPayloadFound: 'Fake simulated profit ticker updating every 3 seconds to induce FOMO',
      screenshotUrl: 'task_scam_preview.png',
      domTitle: 'Global Task VIP Member Portal'
    },
    countermeasures: {
      takedownTarget: 'abuse@cloudflare.com, abuse@porkbun.com',
      recommendation: 'Request origin IP disclosure under Cloudflare Law Enforcement portal.'
    }
  },
  {
    url: 'https://www.incometax.gov.in/iec/foportal/',
    displayUrl: 'https://www.incometax.gov.in/iec/foportal/',
    targetBrand: 'Government of India - Income Tax Department',
    category: 'Official Government Portal',
    riskScore: 2,
    verdict: 'VERIFIED_SAFE',
    status: 'AUTHENTIC_BENIGN',
    whois: {
      domain: 'incometax.gov.in',
      registrar: 'National Informatics Centre (NIC India)',
      creationDate: '2005-02-14 (21 years ago)',
      expiryDate: 'Permanent Govt Charter',
      registrantCountry: 'IN (India - Govt of India)',
      nameServers: ['ns1.nic.in', 'ns2.nic.in'],
      dnsStatus: 'Restricted .gov.in ccTLD'
    },
    ssl: {
      valid: true,
      issuer: 'National Informatics Centre Sub-CA for Government Applications',
      validFrom: '2025-06-01',
      validTo: '2027-06-01',
      mismatchWarning: 'Fully verified Organization Validation (OV) Certificate'
    },
    ipGeo: {
      ip: '164.100.161.46',
      asn: 'AS7713 (National Informatics Centre)',
      country: 'India 🇮🇳',
      city: 'New Delhi',
      threatReputation: 'Clean Govt Infrastructure - Zero Malicious Flags'
    },
    sandbox: {
      detectedInputs: ['PAN Number / Aadhaar', 'e-Filing Password'],
      redirectCount: 0,
      scriptsFound: 24,
      maliciousPayloadFound: 'None. Enterprise security headers (CSP, HSTS, X-Frame-Options) properly enforced.',
      screenshotUrl: 'gov_preview.png',
      domTitle: 'e-Filing Home Page, Income Tax Department, Government of India'
    },
    countermeasures: {
      takedownTarget: 'N/A',
      recommendation: 'Domain is authentic. No intervention necessary.'
    }
  }
];

export const GRAPH_NODES = [
  // Kingpins & Suspects
  { id: 'SUS-01', label: 'Vikram "Ghost" Rawat', type: 'suspect', category: 'Syndicate Kingpin', risk: 'Critical', details: 'Known Jamtara/Deoghar ringleader operating 40+ virtual SIMs' },
  { id: 'SUS-02', label: 'Alok "Chotu" Sharma', type: 'suspect', category: 'Mule Account Broker', risk: 'High', details: 'Procures rural student bank accounts in Rajasthan & Haryana' },
  { id: 'SUS-03', label: 'David Chen (Virtual)', type: 'suspect', category: 'Overseas Money Launderer', risk: 'Critical', details: 'Oversees Cambodia/SE-Asia crypto conversion funnel' },
  
  // Mule Accounts
  { id: 'MULE-01', label: 'Axis Bank ****9204', type: 'mule_account', category: 'Layer 1 Mule', risk: 'High', details: 'Received ₹38.5 Lakhs from SBI Trojan victims. Balance: ₹14.2L frozen.' },
  { id: 'MULE-02', label: 'Canara Bank ****4812', type: 'mule_account', category: 'Layer 1 Mule', risk: 'High', details: 'Used for instant IMPS splits within 120 seconds of victim debit.' },
  { id: 'MULE-03', label: 'ICICI Bank ****2819', type: 'mule_account', category: 'Layer 2 Mule', risk: 'Critical', details: 'Primary holding account for Digital Arrest extortion proceeds. Frozen.' },
  { id: 'MULE-04', label: 'Kotak Bank ****1948', type: 'mule_account', category: 'Layer 2 Mule', risk: 'Medium', details: 'Telegram task deposit endpoint registered under dormant shell firm.' },

  // Crypto Wallets
  { id: 'CRYPTO-01', label: 'USDT TRC20: TYq9...83Kx', type: 'crypto_wallet', category: 'Laundering Hub', risk: 'Critical', details: 'Accumulated over $420,000 USDT in 30 days from 18 mule nodes.' },
  { id: 'CRYPTO-02', label: 'Binance UID: 481920831', type: 'crypto_wallet', category: 'P2P Off-Ramp', risk: 'High', details: 'Cashes out USDT into cash via peer-to-peer hawala network.' },
  { id: 'CRYPTO-03', label: 'Tornado Cash Bridge', type: 'crypto_wallet', category: 'Anonymization Mixer', risk: 'Critical', details: 'Cross-chain tumbler used to obscure asset lineage.' },

  // Rogue Domains & C2
  { id: 'DOM-01', label: 'secure-sbi-kyc-verify.in.net', type: 'domain', category: 'Phishing C2', risk: 'Critical', details: 'Hosts APK downloader and credential phishing interface.' },
  { id: 'DOM-02', label: 'fedex-customs-clearance.live', type: 'domain', category: 'Digital Arrest C2', risk: 'Critical', details: 'Fake customs tracking portal with spyware payload.' },

  // IP Addresses
  { id: 'IP-01', label: '185.220.101.45 (Tor Exit)', type: 'ip_address', category: 'C2 Relay IP', risk: 'High', details: 'Romania-based Tor exit relay handling APK telemetry.' },
  { id: 'IP-02', label: '194.26.29.112 (Cambodia)', type: 'ip_address', category: 'Call Center Compound', risk: 'Critical', details: 'Originating IP for Skype video extortion calls.' },

  // Phone / Virtual SIMs
  { id: 'PHONE-01', label: '+91 98765 43210 (VOIP)', type: 'phone', category: 'Caller ID Spoof', risk: 'High', details: 'Spoofed calling line ID configured via SIP trunk.' },
  { id: 'PHONE-02', label: '+91 87654 32109 (Mule SIM)', type: 'phone', category: 'OTP Receiver SIM', risk: 'High', details: 'Registered with fake Aadhaar at Nuh/Mewat point of sale.' }
];

export const GRAPH_LINKS = [
  { source: 'SUS-01', target: 'DOM-01', label: 'Registered Domain', type: 'operates' },
  { source: 'DOM-01', target: 'IP-01', label: 'Resolves To', type: 'infra' },
  { source: 'DOM-01', target: 'MULE-01', label: 'Directs Victim Funds', type: 'financial' },
  { source: 'SUS-01', target: 'PHONE-02', label: 'Controls SIM', type: 'comms' },
  { source: 'PHONE-02', target: 'MULE-01', label: 'Linked Auth Mobile', type: 'banking' },
  { source: 'SUS-02', target: 'MULE-01', label: 'Procured Account', type: 'mule' },
  { source: 'SUS-02', target: 'MULE-02', label: 'Procured Account', type: 'mule' },
  { source: 'MULE-01', target: 'MULE-02', label: 'IMPS ₹12.5L Split', type: 'financial' },
  { source: 'MULE-02', target: 'CRYPTO-01', label: 'P2P Crypto Buy ₹8.2L', type: 'crypto' },
  { source: 'CRYPTO-01', target: 'CRYPTO-02', label: 'Internal DEX Transfer', type: 'crypto' },
  { source: 'CRYPTO-01', target: 'CRYPTO-03', label: 'Privacy Tumbler', type: 'crypto' },
  { source: 'SUS-03', target: 'CRYPTO-02', label: 'Final Beneficiary Off-Ramp', type: 'control' },
  { source: 'SUS-03', target: 'IP-02', label: 'Active Session', type: 'infra' },
  { source: 'IP-02', target: 'DOM-02', label: 'Hosted Web Assets', type: 'infra' },
  { source: 'DOM-02', target: 'MULE-03', label: 'Extortion Remittance', type: 'financial' },
  { source: 'MULE-03', target: 'CRYPTO-01', label: 'Hawala Conversion ₹24L', type: 'crypto' },
  { source: 'PHONE-01', target: 'DOM-02', label: 'Dispatched via SMS', type: 'comms' }
];

export const FORENSIC_TIMELINE = [
  {
    id: 'TL-01',
    caseId: 'TW-2026-8941',
    timestamp: '2026-10-17 08:42:10 IST',
    stage: 'Reconnaissance & Weaponization',
    title: 'Rogue Phishing Domain Registered on NameCheap',
    description: 'Threat actor registered "secure-sbi-kyc-verify-portal.in.net" using privacy guard and deployed fake SBI YONO landing page.',
    actor: 'Syndicate Operator (IP: 185.220.101.45)',
    category: 'INFRASTRUCTURE',
    badgeColor: 'border-blue-500/30 text-blue-400 bg-blue-500/10'
  },
  {
    id: 'TL-02',
    caseId: 'TW-2026-8941',
    timestamp: '2026-10-17 09:12:05 IST',
    stage: 'Initial Contact & Social Engineering',
    title: 'Victim Receives Urgent SMS with APK Download Link',
    description: 'Automated SMS blast disguised as SBI official warning: "A/C blocked in 24 hrs. Click here to verify KYC immediately".',
    actor: 'Bulk SMS Gateway (Sender ID: VK-SBIINB)',
    category: 'VICTIM_CONTACT',
    badgeColor: 'border-amber-500/30 text-amber-400 bg-amber-500/10'
  },
  {
    id: 'TL-03',
    caseId: 'TW-2026-8941',
    timestamp: '2026-10-17 09:18:40 IST',
    stage: 'Exploitation & Privilege Escalation',
    title: 'Malicious APK "SBI_Rewards_v4.apk" Installed',
    description: 'Victim granted SMS Read/Receive and Accessibility permissions. Trojan established background C2 connection to Telegram Bot #6819201944.',
    actor: 'Malware Agent on Victim Device (Samsung M33)',
    category: 'MALWARE_EXEC',
    badgeColor: 'border-rose-500/30 text-rose-400 bg-rose-500/10'
  },
  {
    id: 'TL-04',
    caseId: 'TW-2026-8941',
    timestamp: '2026-10-17 09:21:18 IST',
    stage: 'Credential Theft & OTP Interception',
    title: 'Victim Submits NetBanking Credentials; OTP Silently Intercepted',
    description: 'Trojan suppressed incoming SMS notification from SBI and forward-piped authentication OTP directly to threat actor console.',
    actor: 'Telegram Bot API Webhook',
    category: 'DATA_EXFILTRATION',
    badgeColor: 'border-purple-500/30 text-purple-400 bg-purple-500/10'
  },
  {
    id: 'TL-05',
    caseId: 'TW-2026-8941',
    timestamp: '2026-10-17 09:22:45 IST',
    stage: 'Financial Fraud & Layer 1 Dispersion',
    title: '6 Rapid IMPS Transactions Initiated (₹38.5 Lakhs)',
    description: 'Funds divided across 3 primary mule accounts at Axis Bank and Canara Bank within 180 seconds.',
    actor: 'Automated Banking Script / Mule 1',
    category: 'FINANCIAL_FRAUD',
    badgeColor: 'border-rose-500/30 text-rose-400 bg-rose-500/10'
  },
  {
    id: 'TL-06',
    caseId: 'TW-2026-8941',
    timestamp: '2026-10-17 09:35:12 IST',
    stage: 'Incident Reporting & 1930 Helpline Triage',
    title: 'Victim Calls National Cyber Crime Helpline (1930)',
    description: 'Incident ticket routed to TRACEWISE AI engine. Automated bank nodal freeze orders generated instantaneously.',
    actor: 'Victim & TRACEWISE Automated Ingest',
    category: 'INVESTIGATION',
    badgeColor: 'border-cyan-500/30 text-cyan-400 bg-cyan-500/10'
  },
  {
    id: 'TL-07',
    caseId: 'TW-2026-8941',
    timestamp: '2026-10-17 09:48:30 IST',
    stage: 'Evidence Preservation & Asset Freezing',
    title: '₹31.2 Lakhs Successfully Frozen in Axis & Canara Mule Accounts',
    description: 'Bank Nodal Officers acknowledged Section 91 CrPC freeze directive. Remaining ₹7.3L traced to P2P crypto swap address.',
    actor: 'Sneha KR (Team MINDMESH) & Bank Nodal Team',
    category: 'ASSET_RECOVERY',
    badgeColor: 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10'
  }
];

export const ACTIVITY_FEED = [
  {
    id: 'ACT-01',
    time: '2 mins ago',
    type: 'evidence',
    title: 'Evidence Cryptographically Sealed',
    desc: 'SHA-256 hash verified for "SBI_Rewards_v4.apk". Zero byte tampering detected.',
    officer: 'Sneha KR',
    badge: 'VERIFIED'
  },
  {
    id: 'ACT-02',
    time: '8 mins ago',
    type: 'alert',
    title: 'New High-Risk Rogue URL Triaged',
    desc: 'hxxps://secure-sbi-kyc-verify-portal[.]in[.]net flagged with Risk Score 98/100.',
    officer: 'AI Threat Scanner',
    badge: 'CRITICAL'
  },
  {
    id: 'ACT-03',
    time: '24 mins ago',
    type: 'freeze',
    title: 'Bank Mule Account Frozen',
    desc: '₹14,20,000 frozen in Axis Bank A/c ****9204 linked to Jamtara Syndicate.',
    officer: 'Bank Nodal API',
    badge: 'ASSET SEIZED'
  },
  {
    id: 'ACT-04',
    time: '1 hour ago',
    type: 'fir',
    title: 'Court 65B Certificate Generated',
    desc: 'FIR annexure and digital evidence hash manifest produced for Case #TW-2026-8935.',
    officer: 'Legal Auditor',
    badge: 'EXPORTED'
  },
  {
    id: 'ACT-05',
    time: '3 hours ago',
    type: 'graph',
    title: 'Mule Ring Cluster Discovered',
    desc: 'Graph intelligence linked 4 dormant cooperative bank accounts to 1 Telegram C2 bot.',
    officer: 'MINDMESH AI Core',
    badge: 'CORRELATED'
  }
];

export const TEAM_MEMBERS = [
  {
    name: 'Sneha KR',
    role: 'Lead Digital Forensics Architect',
    team: 'Team MINDMESH',
    email: 'sneha.kr@mindmesh.ai',
    badge: 'LEAD INVESTIGATOR',
    access: 'Level 5 (Full Cryptographic Signing & FIR Dispatch)'
  },
  {
    name: 'Rohan Mehta',
    role: 'Cyber Threat Intelligence & Reverse Engineer',
    team: 'Team MINDMESH',
    email: 'rohan.m@mindmesh.ai',
    badge: 'THREAT INTEL',
    access: 'Level 4 (Malware Sandbox & C2 Takedowns)'
  },
  {
    name: 'Pooja Iyer',
    role: 'Evidence Custody & Legal Compliance Lead',
    team: 'Team MINDMESH',
    email: 'pooja.i@mindmesh.ai',
    badge: 'LEGAL AUDIT',
    access: 'Level 4 (Section 65B Certification & FIR Filing)'
  },
  {
    name: 'Arjun Das',
    role: 'OSINT & Financial Mule Graph Specialist',
    team: 'Team MINDMESH',
    email: 'arjun.d@mindmesh.ai',
    badge: 'FINANCIAL OSINT',
    access: 'Level 3 (Graph Tracing & Bank Nodal Liaison)'
  }
];
