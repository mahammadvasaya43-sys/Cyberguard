export type Check = {
  id: string
  label: string
  detail: string
  passed: boolean
}

export type Verdict = 'SAFE' | 'SUSPICIOUS' | 'DANGEROUS'

export type PhishingResult = {
  verdict: Verdict
  riskScore: number // 0-100
  checks: Check[]
  hostname: string
}

const URL_SHORTENERS = [
  'bit.ly',
  'tinyurl.com',
  'goo.gl',
  't.co',
  'ow.ly',
  'is.gd',
  'buff.ly',
  'adf.ly',
  'rebrand.ly',
  'cutt.ly',
  'shorturl.at',
]

const SUSPICIOUS_KEYWORDS = [
  'login',
  'verify',
  'account',
  'secure',
  'bank',
  'update',
  'confirm',
  'password',
  'signin',
  'webscr',
  'ebayisapi',
  'paypal',
  'wallet',
  'recover',
]

const TRUSTED_TLDS = ['.com', '.org', '.net', '.edu', '.gov', '.io', '.co']
const SUSPICIOUS_TLDS = [
  '.zip',
  '.xyz',
  '.top',
  '.tk',
  '.gq',
  '.ml',
  '.cf',
  '.ga',
  '.work',
  '.click',
  '.country',
  '.kim',
]

export function isValidUrl(value: string): boolean {
  try {
    const url = new URL(
      value.includes('://') ? value : `https://${value}`,
    )
    return Boolean(url.hostname) && url.hostname.includes('.')
  } catch {
    return false
  }
}

export function analyzeUrl(value: string): PhishingResult {
  const normalized = value.includes('://') ? value : `https://${value}`
  const url = new URL(normalized)
  const hostname = url.hostname.toLowerCase()
  const fullLower = normalized.toLowerCase()

  const checks: Check[] = []

  // 1. HTTPS / SSL
  const usesHttps = url.protocol === 'https:'
  checks.push({
    id: 'ssl',
    label: 'Secure connection (HTTPS)',
    detail: usesHttps
      ? 'The URL uses an encrypted HTTPS connection.'
      : 'The URL is not served over HTTPS, so traffic is not encrypted.',
    passed: usesHttps,
  })

  // 2. IP address as hostname
  const isIp = /^\d{1,3}(\.\d{1,3}){3}$/.test(hostname)
  checks.push({
    id: 'ip',
    label: 'Uses a domain name (not raw IP)',
    detail: isIp
      ? 'The host is a raw IP address — a common phishing tactic.'
      : 'The host uses a regular domain name.',
    passed: !isIp,
  })

  // 3. Excessive subdomains
  const labels = hostname.split('.')
  const subdomainCount = Math.max(0, labels.length - 2)
  const tooManySubdomains = subdomainCount > 2
  checks.push({
    id: 'subdomains',
    label: 'Reasonable subdomain depth',
    detail: tooManySubdomains
      ? `The host has ${subdomainCount} subdomains, which is often used to disguise the real domain.`
      : 'The subdomain structure looks normal.',
    passed: !tooManySubdomains,
  })

  // 4. URL shortener
  const isShortener = URL_SHORTENERS.includes(hostname)
  checks.push({
    id: 'shortener',
    label: 'Not a URL shortener',
    detail: isShortener
      ? 'This is a URL shortener that hides the true destination.'
      : 'The destination is not hidden behind a shortener.',
    passed: !isShortener,
  })

  // 5. Suspicious keywords
  const foundKeywords = SUSPICIOUS_KEYWORDS.filter((k) => fullLower.includes(k))
  const hasSuspiciousKeywords = foundKeywords.length >= 2
  checks.push({
    id: 'keywords',
    label: 'No deceptive keywords',
    detail: hasSuspiciousKeywords
      ? `Contains sensitive keywords (${foundKeywords.slice(0, 3).join(', ')}) frequently used in phishing.`
      : 'No suspicious cluster of sensitive keywords found.',
    passed: !hasSuspiciousKeywords,
  })

  // 6. Suspicious TLD / domain age heuristic
  const suspiciousTld = SUSPICIOUS_TLDS.some((tld) => hostname.endsWith(tld))
  const trustedTld = TRUSTED_TLDS.some((tld) => hostname.endsWith(tld))
  checks.push({
    id: 'tld',
    label: 'Reputable top-level domain',
    detail: suspiciousTld
      ? 'Uses a TLD frequently abused for short-lived phishing sites.'
      : trustedTld
        ? 'Uses a well-established top-level domain.'
        : 'Uses an uncommon top-level domain — verify the source.',
    passed: !suspiciousTld,
  })

  // 7. Look-alike / misspelling heuristics (special chars, hyphens, digits in brand-like host)
  const hasManyHyphens = (hostname.match(/-/g) || []).length >= 2
  const hasDigitsInDomain = /\d/.test(labels[labels.length - 2] || '')
  const hasAtSymbol = normalized.includes('@')
  const looksDeceptive = hasManyHyphens || hasAtSymbol
  checks.push({
    id: 'lookalike',
    label: 'No look-alike domain tricks',
    detail: hasAtSymbol
      ? 'Contains an "@" symbol in the URL, which can redirect to a hidden host.'
      : hasManyHyphens
        ? 'Multiple hyphens in the domain are often used to imitate real brands.'
        : 'No obvious domain spoofing patterns detected.',
    passed: !looksDeceptive,
  })

  // Risk scoring
  const weights: Record<string, number> = {
    ssl: 12,
    ip: 22,
    subdomains: 14,
    shortener: 16,
    keywords: 18,
    tld: 12,
    lookalike: 16,
  }
  let risk = 0
  for (const check of checks) {
    if (!check.passed) risk += weights[check.id] ?? 10
  }
  // mild extra penalties
  if (hasDigitsInDomain) risk += 4
  risk = Math.min(100, risk)

  let verdict: Verdict = 'SAFE'
  if (risk >= 60) verdict = 'DANGEROUS'
  else if (risk >= 25) verdict = 'SUSPICIOUS'

  return { verdict, riskScore: risk, checks, hostname }
}
