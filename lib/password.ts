export const COMMON_PASSWORDS = [
  '123456',
  'password',
  '123456789',
  '12345678',
  '12345',
  'qwerty',
  'abc123',
  'password1',
  '111111',
  '1234567',
  'iloveyou',
  'admin',
  'welcome',
  'monkey',
  'letmein',
  'dragon',
  'sunshine',
  'princess',
  'football',
  '000000',
]

export type Criterion = {
  id: string
  label: string
  met: boolean
}

export type StrengthResult = {
  score: number // 0-4
  label: string
  percent: number // 0-100
  criteria: Criterion[]
  crackTime: string
  isCommon: boolean
  entropyBits: number
}

const STRENGTH_LABELS = ['Weak', 'Fair', 'Good', 'Strong', 'Very Strong']

function charsetSize(pw: string): number {
  let size = 0
  if (/[a-z]/.test(pw)) size += 26
  if (/[A-Z]/.test(pw)) size += 26
  if (/[0-9]/.test(pw)) size += 10
  if (/[^A-Za-z0-9]/.test(pw)) size += 33
  return size
}

export function formatCrackTime(seconds: number): string {
  if (seconds < 1) return 'Instantly'
  const units: [string, number][] = [
    ['century', 60 * 60 * 24 * 365 * 100],
    ['year', 60 * 60 * 24 * 365],
    ['month', 60 * 60 * 24 * 30],
    ['day', 60 * 60 * 24],
    ['hour', 60 * 60],
    ['minute', 60],
    ['second', 1],
  ]
  for (const [name, secs] of units) {
    if (seconds >= secs) {
      const value = Math.floor(seconds / secs)
      if (name === 'century' && value > 1000) return 'Over 1,000 centuries'
      return `${value.toLocaleString()} ${name}${value !== 1 ? 's' : ''}`
    }
  }
  return 'Instantly'
}

export function analyzePassword(pw: string): StrengthResult {
  const lengthOk = pw.length >= 8
  const lengthGreat = pw.length >= 12
  const hasUpper = /[A-Z]/.test(pw)
  const hasLower = /[a-z]/.test(pw)
  const hasNumber = /[0-9]/.test(pw)
  const hasSymbol = /[^A-Za-z0-9]/.test(pw)
  const isCommon = COMMON_PASSWORDS.includes(pw.toLowerCase())

  const criteria: Criterion[] = [
    { id: 'length', label: 'At least 8 characters', met: lengthOk },
    { id: 'length12', label: '12+ characters (recommended)', met: lengthGreat },
    { id: 'upper', label: 'Uppercase letters (A-Z)', met: hasUpper },
    { id: 'lower', label: 'Lowercase letters (a-z)', met: hasLower },
    { id: 'number', label: 'Numbers (0-9)', met: hasNumber },
    { id: 'symbol', label: 'Special characters (!@#$%)', met: hasSymbol },
    { id: 'common', label: 'Not a common password', met: pw.length > 0 && !isCommon },
  ]

  // Entropy estimate
  const pool = charsetSize(pw) || 1
  const entropyBits = pw.length > 0 ? pw.length * Math.log2(pool) : 0

  // Crack time: assume 10 billion guesses/sec, half the keyspace on average
  const guessesPerSecond = 1e10
  const combinations = Math.pow(2, entropyBits)
  const seconds = combinations / 2 / guessesPerSecond
  const crackTime = pw.length === 0 ? 'No password' : formatCrackTime(seconds)

  // Scoring 0-4
  let score = 0
  if (pw.length === 0) {
    score = 0
  } else if (isCommon) {
    score = 0
  } else {
    if (entropyBits >= 28) score = 1
    if (entropyBits >= 45) score = 2
    if (entropyBits >= 65) score = 3
    if (entropyBits >= 90) score = 4
    // require character variety for top scores
    const variety = [hasUpper, hasLower, hasNumber, hasSymbol].filter(
      Boolean,
    ).length
    if (variety < 3 && score > 2) score = 2
    if (!lengthOk && score > 1) score = 1
  }

  return {
    score,
    label: STRENGTH_LABELS[score],
    percent: pw.length === 0 ? 0 : ((score + 1) / 5) * 100,
    criteria,
    crackTime,
    isCommon,
    entropyBits: Math.round(entropyBits),
  }
}

export type GeneratorOptions = {
  length: number
  uppercase: boolean
  lowercase: boolean
  numbers: boolean
  symbols: boolean
}

const SETS = {
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  numbers: '0123456789',
  symbols: '!@#$%^&*()-_=+[]{};:,.<>?',
}

function secureRandomInt(max: number): number {
  const array = new Uint32Array(1)
  const limit = Math.floor(0xffffffff / max) * max
  let value = 0
  do {
    crypto.getRandomValues(array)
    value = array[0]
  } while (value >= limit)
  return value % max
}

export function generatePassword(opts: GeneratorOptions): string {
  const pools: string[] = []
  if (opts.lowercase) pools.push(SETS.lowercase)
  if (opts.uppercase) pools.push(SETS.uppercase)
  if (opts.numbers) pools.push(SETS.numbers)
  if (opts.symbols) pools.push(SETS.symbols)

  if (pools.length === 0) pools.push(SETS.lowercase)

  const all = pools.join('')
  const chars: string[] = []

  // Guarantee at least one from each selected pool
  for (const pool of pools) {
    chars.push(pool[secureRandomInt(pool.length)])
  }
  while (chars.length < opts.length) {
    chars.push(all[secureRandomInt(all.length)])
  }

  // Fisher-Yates shuffle
  for (let i = chars.length - 1; i > 0; i--) {
    const j = secureRandomInt(i + 1)
    ;[chars[i], chars[j]] = [chars[j], chars[i]]
  }

  return chars.slice(0, opts.length).join('')
}
