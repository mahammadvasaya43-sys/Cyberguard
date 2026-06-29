'use client'

import { useState } from 'react'
import {
  Link2,
  Search,
  Loader2,
  Check,
  X,
  ShieldCheck,
  ShieldAlert,
  ShieldX,
  AlertCircle,
} from 'lucide-react'
import { PageHeader } from '@/components/page-header'
import { Disclaimer } from '@/components/disclaimer'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  analyzeUrl,
  isValidUrl,
  type PhishingResult,
  type Verdict,
} from '@/lib/phishing'
import { cn } from '@/lib/utils'

const verdictConfig: Record<
  Verdict,
  { label: string; icon: typeof ShieldCheck; classes: string; bar: string }
> = {
  SAFE: {
    label: 'Safe',
    icon: ShieldCheck,
    classes: 'border-success/30 bg-success/10 text-success',
    bar: 'bg-success',
  },
  SUSPICIOUS: {
    label: 'Suspicious',
    icon: ShieldAlert,
    classes: 'border-warning/30 bg-warning/10 text-warning',
    bar: 'bg-warning',
  },
  DANGEROUS: {
    label: 'Dangerous',
    icon: ShieldX,
    classes: 'border-destructive/30 bg-destructive/10 text-destructive',
    bar: 'bg-destructive',
  },
}

export default function PhishingDetectorPage() {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState<PhishingResult | null>(null)

  function handleAnalyze() {
    setError('')
    const trimmed = url.trim()
    if (!trimmed) {
      setError('Please enter a URL to analyze.')
      setResult(null)
      return
    }
    if (!isValidUrl(trimmed)) {
      setError('That does not look like a valid URL. Try "https://example.com".')
      setResult(null)
      return
    }
    setLoading(true)
    setResult(null)
    setTimeout(() => {
      setResult(analyzeUrl(trimmed))
      setLoading(false)
    }, 1500)
  }

  const verdict = result ? verdictConfig[result.verdict] : null

  return (
    <div>
      <PageHeader
        icon={Link2}
        title="Phishing Link Detector"
        description="Paste any URL and CyberGuard will analyze it for phishing indicators using a series of client-side heuristics."
      />

      <Card className="p-6">
        <label
          htmlFor="url-input"
          className="block text-sm font-medium text-foreground"
        >
          Enter URL to analyze
        </label>
        <div className="mt-2 flex flex-col gap-3 sm:flex-row">
          <input
            id="url-input"
            type="text"
            inputMode="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleAnalyze()
            }}
            placeholder="https://example.com"
            className="h-11 flex-1 rounded-lg border border-input bg-background px-3.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/20"
            aria-invalid={Boolean(error)}
          />
          <Button
            onClick={handleAnalyze}
            disabled={loading}
            className="h-11 px-5"
          >
            {loading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Search className="size-4" />
            )}
            {loading ? 'Analyzing…' : 'Analyze Link'}
          </Button>
        </div>
        {error && (
          <p className="mt-2 flex items-center gap-1.5 text-sm text-destructive">
            <AlertCircle className="size-4" />
            {error}
          </p>
        )}
      </Card>

      {loading && (
        <Card className="mt-6 flex items-center justify-center gap-3 p-10 text-muted-foreground">
          <Loader2 className="size-5 animate-spin text-primary" />
          <span className="text-sm">Running security checks…</span>
        </Card>
      )}

      {result && verdict && (
        <div className="mt-6 space-y-6 animate-fade-in-up">
          <Card className="p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Verdict for {result.hostname}
                </p>
                <span
                  className={cn(
                    'mt-2 inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm font-semibold',
                    verdict.classes,
                  )}
                >
                  <verdict.icon className="size-4" />
                  {verdict.label}
                </span>
              </div>
              <div className="text-right">
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Risk Score
                </p>
                <p className="text-3xl font-semibold text-foreground">
                  {result.riskScore}
                  <span className="text-base text-muted-foreground">/100</span>
                </p>
              </div>
            </div>

            <div className="mt-4 h-2.5 w-full overflow-hidden rounded-full bg-secondary">
              <div
                className={cn(
                  'h-full rounded-full transition-all duration-700',
                  verdict.bar,
                )}
                style={{ width: `${result.riskScore}%` }}
              />
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-sm font-semibold text-foreground">
              Analysis breakdown
            </h2>
            <ul className="mt-4 divide-y divide-border">
              {result.checks.map((check) => (
                <li
                  key={check.id}
                  className="flex items-start gap-3 py-3 first:pt-0 last:pb-0"
                >
                  <span
                    className={cn(
                      'mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full',
                      check.passed
                        ? 'bg-success/15 text-success'
                        : 'bg-destructive/15 text-destructive',
                    )}
                  >
                    {check.passed ? (
                      <Check className="size-3.5" />
                    ) : (
                      <X className="size-3.5" />
                    )}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {check.label}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {check.detail}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      )}

      <Disclaimer />
    </div>
  )
}
