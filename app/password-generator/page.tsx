'use client'

import { useEffect, useMemo, useState, useCallback } from 'react'
import {
  KeyRound,
  Copy,
  CheckCheck,
  RefreshCw,
  Loader2,
  Lightbulb,
} from 'lucide-react'
import { PageHeader } from '@/components/page-header'
import { Disclaimer } from '@/components/disclaimer'
import { StrengthMeter } from '@/components/strength-meter'
import { ToggleRow } from '@/components/toggle-row'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  analyzePassword,
  generatePassword,
  type GeneratorOptions,
} from '@/lib/password'

export default function PasswordGeneratorPage() {
  const [options, setOptions] = useState<GeneratorOptions>({
    length: 16,
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
  })
  const [password, setPassword] = useState('')
  const [copied, setCopied] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [toast, setToast] = useState(false)

  const regenerate = useCallback(() => {
    setGenerating(true)
    setTimeout(() => {
      setPassword(generatePassword(options))
      setGenerating(false)
    }, 350)
  }, [options])

  // generate once on mount
  useEffect(() => {
    setPassword(generatePassword(options))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const result = useMemo(() => analyzePassword(password), [password])

  function update<K extends keyof GeneratorOptions>(
    key: K,
    value: GeneratorOptions[K],
  ) {
    setOptions((prev) => {
      const next = { ...prev, [key]: value }
      if (
        !next.uppercase &&
        !next.lowercase &&
        !next.numbers &&
        !next.symbols
      ) {
        return prev
      }
      return next
    })
  }

  async function handleCopy() {
    if (!password) return
    await navigator.clipboard.writeText(password)
    setCopied(true)
    setToast(true)
    setTimeout(() => setCopied(false), 2000)
    setTimeout(() => setToast(false), 2200)
  }

  return (
    <div>
      <PageHeader
        icon={KeyRound}
        title="Secure Password Generator"
        description="Create strong, random passwords using your browser's cryptographically secure random generator."
      />

      <Card className="p-6">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Generated password
        </p>
        <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex h-14 flex-1 items-center overflow-x-auto rounded-lg border border-border bg-secondary/50 px-4">
            {generating ? (
              <span className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="size-4 animate-spin" />
                Generating…
              </span>
            ) : (
              <span className="font-mono text-lg tracking-wide text-foreground break-all">
                {password}
              </span>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              onClick={handleCopy}
              disabled={generating}
              className="h-11 flex-1 px-4 sm:flex-none"
            >
              {copied ? (
                <CheckCheck className="size-4" />
              ) : (
                <Copy className="size-4" />
              )}
              {copied ? 'Copied!' : 'Copy'}
            </Button>
            <Button
              variant="outline"
              onClick={regenerate}
              disabled={generating}
              className="h-11 flex-1 px-4 sm:flex-none"
            >
              <RefreshCw className="size-4" />
              Regenerate
            </Button>
          </div>
        </div>

        <div className="mt-5">
          <StrengthMeter result={result} empty={!password} />
        </div>
      </Card>

      <Card className="mt-6 p-6">
        <h2 className="text-sm font-semibold text-foreground">Options</h2>

        <div className="mt-4">
          <div className="flex items-center justify-between">
            <label
              htmlFor="length"
              className="text-sm font-medium text-foreground"
            >
              Password length
            </label>
            <span className="font-mono text-sm font-semibold text-primary">
              {options.length}
            </span>
          </div>
          <input
            id="length"
            type="range"
            min={8}
            max={64}
            value={options.length}
            onChange={(e) => update('length', Number(e.target.value))}
            className="mt-3 w-full cursor-pointer accent-primary"
          />
          <div className="mt-1 flex justify-between text-xs text-muted-foreground">
            <span>8</span>
            <span>64</span>
          </div>
        </div>

        <div className="mt-5 grid gap-1 border-t border-border pt-4 sm:grid-cols-2 sm:gap-x-8">
          <ToggleRow
            label="Include uppercase (A-Z)"
            checked={options.uppercase}
            onChange={(v) => update('uppercase', v)}
          />
          <ToggleRow
            label="Include lowercase (a-z)"
            checked={options.lowercase}
            onChange={(v) => update('lowercase', v)}
          />
          <ToggleRow
            label="Include numbers (0-9)"
            checked={options.numbers}
            onChange={(v) => update('numbers', v)}
          />
          <ToggleRow
            label="Include symbols (!@#$%)"
            checked={options.symbols}
            onChange={(v) => update('symbols', v)}
          />
        </div>

        <Button onClick={regenerate} disabled={generating} className="mt-6 h-11">
          {generating ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <KeyRound className="size-4" />
          )}
          {generating ? 'Generating…' : 'Generate Password'}
        </Button>
      </Card>

      <Card className="mt-6 flex items-start gap-3 bg-accent p-5">
        <Lightbulb className="mt-0.5 size-5 shrink-0 text-accent-foreground" />
        <p className="text-sm leading-relaxed text-foreground/80">
          <span className="font-semibold text-accent-foreground">Pro Tip:</span>{' '}
          Use a password manager to store generated passwords securely so you
          never have to memorize or reuse them.
        </p>
      </Card>

      <Disclaimer />

      {toast && (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 animate-fade-in-up">
          <div className="flex items-center gap-2 rounded-lg bg-foreground px-4 py-2.5 text-sm font-medium text-background shadow-lg">
            <CheckCheck className="size-4 text-success" />
            Copied to clipboard
          </div>
        </div>
      )}
    </div>
  )
}
