// TRACEWISE AI - URL Heuristic Analysis API Routes
// Performs local explainable heuristic analysis without claiming external threat feeds
import express from 'express';

const router = express.Router();

function defangUrl(url) {
  if (!url) return '';
  return url
    .replace(/^http:\/\//i, 'hxxp://')
    .replace(/^https:\/\//i, 'hxxps://')
    .replace(/\./g, '[.]');
}

function analyzeUrlHeuristics(url) {
  let parsedUrl;
  try {
    parsedUrl = new URL(url.startsWith('http') ? url : `http://${url}`);
  } catch (err) {
    throw new Error('Malformed URL structure.');
  }

  const hostname = parsedUrl.hostname.toLowerCase();
  const protocol = parsedUrl.protocol.toLowerCase();
  const pathname = parsedUrl.pathname.toLowerCase();

  const indicators = [];
  let score = 0;

  // 1. Insecure Protocol
  if (protocol === 'http:') {
    score += 25;
    indicators.push({
      type: 'WARNING',
      title: 'Insecure HTTP Protocol',
      description: 'Lacks TLS/SSL encryption. Data transmitted in cleartext.'
    });
  }

  // 2. IP Host
  const isIpv4 = /^(\d{1,3}\.){3}\d{1,3}$/.test(hostname);
  if (isIpv4) {
    score += 45;
    indicators.push({
      type: 'DANGER',
      title: 'IP Address Hostname Detected',
      description: `URL points directly to raw IP address ${hostname} bypassing DNS governance.`
    });
  }

  // 3. Subdomain Depth
  const parts = hostname.split('.');
  if (parts.length > 4) {
    score += 20;
    indicators.push({
      type: 'WARNING',
      title: 'Excessive Subdomain Depth',
      description: `Hostname contains ${parts.length} domain parts, often used to obscure true destination.`
    });
  }

  // 4. Brand Keyword Spoofing
  const brandKeywords = ['sbi', 'hdfc', 'icici', 'axis', 'paytm', 'yono', 'kyc', 'support', 'customs', 'police', 'cbi'];
  const matchedBrands = brandKeywords.filter((b) => hostname.includes(b) || pathname.includes(b));
  if (matchedBrands.length > 0 && !hostname.endsWith('.gov.in') && !hostname.endsWith('sbi.co.in') && !hostname.endsWith('hdfcbank.com') && !hostname.endsWith('icicibank.com')) {
    score += 35;
    indicators.push({
      type: 'DANGER',
      title: 'Brand / Authority Impersonation String Detected',
      description: `Target contains brand keyword(s) [${matchedBrands.join(', ')}] on non-official domain.`
    });
  }

  // 5. Shorteners
  const shorteners = ['bit.ly', 'tinyurl.com', 't.co', 'cutt.ly', 'is.gd', 'rb.gy'];
  if (shorteners.includes(hostname)) {
    score += 25;
    indicators.push({
      type: 'WARNING',
      title: 'URL Shortener Gateway',
      description: 'Shortened redirector masks actual destination server.'
    });
  }

  // 6. Dropper Extensions
  if (pathname.endsWith('.apk') || pathname.endsWith('.exe') || pathname.endsWith('.vbs')) {
    score += 45;
    indicators.push({
      type: 'DANGER',
      title: 'Executable Dropper Payload Extension',
      description: `Path targets direct download of executable binary (${pathname.split('.').pop()}).`
    });
  }

  // Risk Classification
  let riskLevel = 'Low';
  if (score >= 60) riskLevel = 'High';
  else if (score >= 25) riskLevel = 'Medium';

  return {
    originalUrl: url,
    defangedUrl: defangUrl(url),
    hostname,
    protocol,
    riskLevel, // 'Low' | 'Medium' | 'High' only
    score: Math.min(score, 100),
    indicators,
    heuristicOnly: true,
    methodology: 'Transparent Local Heuristic Rule-Based Engine (Demo Mode)',
    analyzedAt: new Date().toISOString()
  };
}

// POST /api/url-analyzer - Analyze URL heuristics
router.post('/', (req, res) => {
  const { url } = req.body;
  if (!url || typeof url !== 'string' || url.trim().length < 3) {
    return res.status(400).json({ success: false, error: 'A valid URL string is required for heuristic analysis.' });
  }

  try {
    const analysis = analyzeUrlHeuristics(url.trim());
    res.json({
      success: true,
      data: analysis
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

export default router;
