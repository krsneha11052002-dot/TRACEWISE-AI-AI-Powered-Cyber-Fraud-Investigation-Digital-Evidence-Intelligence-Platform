// TRACEWISE AI - Suspicious URL Heuristic Analyzer
// Pure deterministic local heuristic engine for cybersecurity triage

// High-risk or frequently abused TLDs in phishing campaigns
const SUSPICIOUS_TLDS = [
  'xyz', 'top', 'live', 'cc', 'work', 'click', 'in.net', 'rest',
  'tk', 'ml', 'ga', 'cf', 'gq', 'buzz', 'monster', 'link', 'icu',
  'cam', 'fit', 'club', 'space', 'site', 'website', 'stream', 'bid'
];

// Well-known URL shortening domains
const KNOWN_SHORTENERS = [
  'bit.ly', 'tinyurl.com', 't.co', 'goo.gl', 'is.gd', 'cutt.ly',
  'rb.gy', 'shorturl.at', 'ow.ly', 'tiny.cc', 'shorte.st', 'bc.vc'
];

// Target brand keywords frequently abused in phishing targeting Indian and global institutions
const BRAND_TARGETS = [
  { keyword: 'sbi', brand: 'State Bank of India (SBI)', legitDomains: ['sbi.co.in', 'onlinesbi.sbi', 'sbi.bank'] },
  { keyword: 'yono', brand: 'SBI YONO Banking', legitDomains: ['sbi.co.in', 'onlinesbi.sbi'] },
  { keyword: 'hdfc', brand: 'HDFC Bank', legitDomains: ['hdfcbank.com', 'hdfc.com'] },
  { keyword: 'icici', brand: 'ICICI Bank', legitDomains: ['icicibank.com'] },
  { keyword: 'axis', brand: 'Axis Bank', legitDomains: ['axisbank.com'] },
  { keyword: 'pnb', brand: 'Punjab National Bank', legitDomains: ['pnbindia.in'] },
  { keyword: 'paytm', brand: 'Paytm Payments Bank', legitDomains: ['paytm.com'] },
  { keyword: 'phonepe', brand: 'PhonePe', legitDomains: ['phonepe.com'] },
  { keyword: 'gpay', brand: 'Google Pay', legitDomains: ['pay.google.com', 'google.com'] },
  { keyword: 'kyc', brand: 'Bank KYC Verification Portal', legitDomains: [] },
  { keyword: 'aadhaar', brand: 'UIDAI Aadhaar Verification', legitDomains: ['uidai.gov.in'] },
  { keyword: 'incometax', brand: 'Income Tax Department', legitDomains: ['incometax.gov.in'] },
  { keyword: 'fedex', brand: 'FedEx Express Courier', legitDomains: ['fedex.com'] },
  { keyword: 'customs', brand: 'India Customs Directorate', legitDomains: ['cbic.gov.in'] },
  { keyword: 'binance', brand: 'Binance Cryptocurrency Exchange', legitDomains: ['binance.com'] },
  { keyword: 'telegram', brand: 'Telegram Messenger / VIP Tasks', legitDomains: ['t.me', 'telegram.org'] }
];

// Suspicious file download extensions
const SUSPICIOUS_EXTENSIONS = ['.apk', '.exe', '.scr', '.bat', '.vbs', '.msi', '.cmd', '.zip', '.jar', '.dmg'];

/**
 * Defangs a URL for safe non-clickable cybersecurity presentation
 * @param {string} url
 * @returns {string} e.g. "hxxps://evil[.]com/login"
 */
export function defangUrl(url) {
  if (!url) return '';
  return url
    .replace(/^http:\/\//i, 'hxxp://')
    .replace(/^https:\/\//i, 'hxxps://')
    .replace(/\./g, '[.]');
}

/**
 * Validates whether the string is a parseable URL
 */
export function validateUrlInput(input) {
  if (!input || !input.trim()) {
    return { valid: false, error: 'Please enter a URL to analyze.' };
  }

  const trimmed = input.trim();
  // Ensure protocol exists for URL constructor
  const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;

  try {
    const parsed = new URL(withProtocol);
    if (!parsed.hostname || !parsed.hostname.includes('.')) {
      // Allow direct IP address hosts (which may have no dot if invalid or single dot)
      const isIp = /^(\d{1,3}\.){3}\d{1,3}$/.test(parsed.hostname);
      if (!isIp) {
        return { valid: false, error: 'Invalid domain syntax. Please enter a valid URL or host (e.g. secure-login.xyz).' };
      }
    }
    return { valid: true, parsedUrl: parsed, normalizedUrl: withProtocol };
  } catch (err) {
    return { valid: false, error: 'Malformed URL structure. Please enter a valid URL format.' };
  }
}

/**
 * Performs transparent, explainable heuristic cyber fraud analysis
 * Evaluates 6 core indicators:
 * 1. HTTPS Usage
 * 2. IP-address Hosts
 * 3. Excessive Subdomains
 * 4. Misleading Domain Strings & Brand Impersonation
 * 5. Suspicious URL Shorteners
 * 6. Suspicious File Extensions / Download Triggers
 *
 * Returns Risk Level: 'Low', 'Medium', or 'High' ONLY
 */
export function analyzeUrlHeuristics(rawUrl) {
  const validation = validateUrlInput(rawUrl);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  const parsed = validation.parsedUrl;
  const originalUrl = validation.normalizedUrl;
  const hostname = parsed.hostname.toLowerCase();
  const pathname = parsed.pathname.toLowerCase();
  const fullHref = parsed.href.toLowerCase();

  const indicators = [];
  let score = 0;

  // 1. Check HTTPS Usage
  const isHttps = parsed.protocol === 'https:';
  if (!isHttps) {
    score += 25;
    indicators.push({
      category: 'Protocol Security',
      name: 'Insecure Transport Protocol (HTTP)',
      status: 'danger',
      description: 'The URL uses unencrypted HTTP. Data, login credentials, or OTP tokens are transmitted in cleartext and vulnerable to interception.',
      weight: 25
    });
  } else {
    indicators.push({
      category: 'Protocol Security',
      name: 'HTTPS Transport Active',
      status: 'safe',
      description: 'The connection uses TLS/SSL transport encryption. Note that modern phishing portals also obtain automated free certificates.',
      weight: 0
    });
  }

  // 2. Check IP-address Hosts
  const isIpv4 = /^(\d{1,3}\.){3}\d{1,3}$/.test(hostname);
  const isIpv6 = hostname.includes(':') || hostname.startsWith('[');
  const isDirectIp = isIpv4 || isIpv6;

  if (isDirectIp) {
    score += 35;
    indicators.push({
      category: 'Host Infrastructure',
      name: `Direct IP Address Host (${hostname})`,
      status: 'danger',
      description: 'The host is an IP address rather than a registered domain name. Threat actors frequently use direct IP hosting to bypass domain reputation checks and domain takedowns.',
      weight: 35
    });
  } else {
    indicators.push({
      category: 'Host Infrastructure',
      name: 'Standard Domain Name Host',
      status: 'safe',
      description: `Target resolves via standard Domain Name System (DNS) host: ${hostname}.`,
      weight: 0
    });
  }

  // 3. Check Excessive Subdomains
  const hostParts = hostname.split('.');
  const subdomainCount = isDirectIp ? 0 : Math.max(0, hostParts.length - 2);

  if (subdomainCount >= 3) {
    score += 20;
    indicators.push({
      category: 'Domain Structure',
      name: `Excessive Subdomains (${subdomainCount + 2} Levels Detected)`,
      status: 'danger',
      description: `Excessive domain depth (${hostname}). Cyber fraud campaigns commonly stack subdomains (e.g., "login.secure.sbi.portal.evil.com") to mislead victims on mobile screens where the apex domain is clipped.`,
      weight: 20
    });
  } else if (subdomainCount === 2) {
    score += 10;
    indicators.push({
      category: 'Domain Structure',
      name: 'Multi-Level Subdomain Structure (3 Levels)',
      status: 'warning',
      description: 'Domain contains two subdomain levels. Common in corporate architectures but also observed in targeted credential harvesters.',
      weight: 10
    });
  } else {
    indicators.push({
      category: 'Domain Structure',
      name: 'Normal Subdomain Depth',
      status: 'safe',
      description: 'Host hierarchy conforms to standard single-tier or apex domain conventions.',
      weight: 0
    });
  }

  // 4. Check Misleading Domain Strings & Brand Impersonation
  let brandSpoofed = null;
  for (const b of BRAND_TARGETS) {
    const hasKeyword = hostname.includes(b.keyword) || pathname.includes(b.keyword);
    if (hasKeyword) {
      // Check if it's actually the legitimate official domain
      const isOfficial = b.legitDomains.some(
        (legit) => hostname === legit || hostname.endsWith(`.${legit}`)
      );
      if (!isOfficial) {
        brandSpoofed = b;
        break;
      }
    }
  }

  if (brandSpoofed) {
    score += 35;
    indicators.push({
      category: 'Brand Impersonation',
      name: `Misleading Financial / Govt Keyword: "${brandSpoofed.keyword.toUpperCase()}"`,
      status: 'danger',
      description: `Detected keywords impersonating ${brandSpoofed.brand} on an unauthorized third-party host (${hostname}). Highly correlated with fake netbanking portals and KYC credential harvesters.`,
      weight: 35
    });
  } else {
    indicators.push({
      category: 'Brand Impersonation',
      name: 'No Known Financial Brand Spoofing Detected',
      status: 'safe',
      description: 'Lexical analysis found no high-risk Indian banking or government institution brand impersonation keywords.',
      weight: 0
    });
  }

  // Check for excessive hyphens in domain (e.g., "secure-sbi-login-verify")
  const hyphenCount = (hostname.match(/-/g) || []).length;
  if (hyphenCount >= 2) {
    score += 15;
    indicators.push({
      category: 'Domain Obfuscation',
      name: `Excessive Hyphens (${hyphenCount} hyphens in domain)`,
      status: 'warning',
      description: `Domain contains ${hyphenCount} hyphenated words ("${hostname}"). Often engineered to construct synthetic typosquatted compound phrases.`,
      weight: 15
    });
  }

  // 5. Check Suspicious URL Shorteners
  const isShortener = KNOWN_SHORTENERS.some(
    (s) => hostname === s || hostname.endsWith(`.${s}`)
  );

  if (isShortener) {
    score += 25;
    indicators.push({
      category: 'URL Obfuscation',
      name: `Known URL Shortener Detected (${hostname})`,
      status: 'warning',
      description: 'URL shortening services mask the final destination endpoint. Phishing campaigns frequently circulate short links in SMS and WhatsApp to evade automated gateway filters.',
      weight: 25
    });
  }

  // 6. Check High-Risk Disposable TLDs
  const tld = hostParts.length >= 2 ? hostParts.slice(-1)[0] : '';
  const secondLevelTld = hostParts.length >= 3 ? hostParts.slice(-2).join('.') : '';
  const isSuspiciousTld =
    SUSPICIOUS_TLDS.includes(tld) || SUSPICIOUS_TLDS.includes(secondLevelTld);

  if (isSuspiciousTld && !isDirectIp) {
    score += 20;
    indicators.push({
      category: 'Top-Level Domain (TLD)',
      name: `High-Risk Phishing TLD (.${secondLevelTld || tld})`,
      status: 'warning',
      description: `The top-level domain .${secondLevelTld || tld} is statistically overrepresented in automated bulk phishing campaigns and spam operations.`,
      weight: 20
    });
  }

  // 7. Check Malicious Executable / APK Download Triggers
  const hasExecutableExt = SUSPICIOUS_EXTENSIONS.some((ext) => pathname.endsWith(ext));
  if (hasExecutableExt) {
    const matchedExt = SUSPICIOUS_EXTENSIONS.find((ext) => pathname.endsWith(ext));
    score += 35;
    indicators.push({
      category: 'Payload Delivery',
      name: `Direct Executable / Malware Extension Detected (${matchedExt})`,
      status: 'danger',
      description: `URL points directly to an executable binary or Android application package (${matchedExt}). Strongly indicative of banking Trojan APK droppers or malware deployment vectors.`,
      weight: 35
    });
  }

  // 8. Check for Basic Auth / '@' symbol trick
  if (fullHref.includes('@')) {
    score += 25;
    indicators.push({
      category: 'URL Obfuscation',
      name: 'Credential "@" Symbol Obfuscation Syntax',
      status: 'danger',
      description: 'URL contains the "@" character before the host. Browsers interpret text before "@" as basic authentication credentials, effectively concealing the true destination host.',
      weight: 25
    });
  }

  // Strict Risk Level: Low, Medium, or High ONLY
  let riskLevel = 'Low';
  if (score >= 55) {
    riskLevel = 'High';
  } else if (score >= 20) {
    riskLevel = 'Medium';
  } else {
    riskLevel = 'Low';
  }

  // Normalize score to 0-100
  const normalizedScore = Math.min(100, Math.max(0, score));

  return {
    id: `SCAN-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
    url: rawUrl.trim(),
    defangedUrl: defangUrl(rawUrl.trim()),
    riskLevel, // 'Low' | 'Medium' | 'High' only
    heuristicScore: normalizedScore,
    indicators,
    dangerCount: indicators.filter((i) => i.status === 'danger').length,
    warningCount: indicators.filter((i) => i.status === 'warning').length,
    safeCount: indicators.filter((i) => i.status === 'safe').length,
    parsed: {
      protocol: parsed.protocol.replace(':', ''),
      hostname,
      pathname: parsed.pathname,
      search: parsed.search,
      tld: secondLevelTld || tld,
      isDirectIp,
      subdomainCount,
      brandSpoofed: brandSpoofed?.brand || null
    },
    analyzedAt: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' IST',
    associatedCaseId: null
  };
}
