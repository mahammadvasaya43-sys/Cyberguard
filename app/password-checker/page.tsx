'use client'

import { useMemo, useState } from 'react'
import {
  ShieldCheck,
  Eye,
  EyeOff,
  Check,
  X,
  Clock,
  Sparkles,
  Copy,
  CheckCheck,
} from 'lucide-react'
import { PageHeader } from '@/components/page-header'
import { Disclaimer } from '@/components/disclaimer'
import { StrengthMeter } from '@/components/strength-meter'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { analyzePassword, generatePassword } from '@/lib/password'
import { cn } from '@/lib/utils'

export default function PasswordCheckerPage() {
  const [password, setPassword] = useState('')
  const [show, setShow] = useState(false)
  const [copied, setCopied] = useState(false)

  const result = useMemo(() => analyzePassword(password), [password])
  const empty = password.length === 0

  function handleGenerate() {
    const pw = generatePassword({
      length: 16,
      uppercase: true,
      lowercase: true,
      numbers: true,
      symbols: true,
    })
    setPassword(pw)
    setShow(true)
  }

  async function handleCopy() {
    if (!password) return
    await navigator.clipboard.writeText(password)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div>
      <PageHeader
        icon={ShieldCheck}
        title="Password Strength Checker"
        description="Type a password to see how strong it is in real time, with a detailed breakdown and an estimated time to crack."
      />

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3 space-y-6">
          <Card className="p-6">
            <label
              htmlFor="pw-input"
              className="block text-sm font-medium text-foreground"
            >
              Enter a password
            </label>
            <div className="relative mt-2">
              <input
                id="pw-input"
                type={show ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Type or generate a password"
                autoComplete="new-password"
                className="h-11 w-full rounded-lg border border-input bg-background px-3.5 pr-20 font-mono text-sm text-foreground outline-none transition-colors placeholder:font-sans placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/20"
              />
              <div className="absolute right-1.5 top-1/2 flex -translate-y-1/2 items-center gap-0.5">
                {password && (
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={handleCopy}
                    aria-label="Copy password"
                  >
                    {copied ? (
                      <CheckCheck className="size-4 text-success" />
                    ) : (
                      <Copy className="size-4" />
                    )}
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => setShow((s) => !s)}
                  aria-label={show ? 'Hide password' : 'Show password'}
                >
                  {show ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </Button>
              </div>
            </div>

            <div className="mt-5">
              <StrengthMeter result={result} empty={empty} />
            </div>

            <Button
              variant="outline"
              onClick={handleGenerate}
              className="mt-5 h-10"
            >
              <Sparkles className="size-4" />
              Generate Strong Password
            </Button>
          </Card>

          <Card className="p-6">
            <h2 className="text-sm font-semibold text-foreground">
              Requirements
            </h2>
            <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
              {result.criteria.map((c) => (
                <li key={c.id} className="flex items-center gap-2.5">
                  <span
                    className={cn(
                      'flex size-5 shrink-0 items-center justify-center rounded-full',
                      c.met
                        ? 'bg-success/15 text-success'
                        : 'bg-secondary text-muted-foreground',
                    )}
                  >
                    {c.met ? (
                      <Check className="size-3.5" />
                    ) : (
                      <X className="size-3.5" />
                    )}
                  </span>
                  <span
                    className={cn(
                      'text-sm',
                      c.met ? 'text-foreground' : 'text-muted-foreground',
                    )}
                  >
                    {c.label}
                  </span>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="size-4" />
              <span className="text-xs font-medium uppercase tracking-wider">
                Estimated time to crack
              </span>
            </div>
            <p className="mt-3 text-2xl font-semibold text-foreground text-balance">
              {result.crackTime}
            </p>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              Based on roughly {result.entropyBits} bits of entropy against an
              attacker guessing 10 billion times per second.
            </p>
          </Card>

          {result.isCommon && password.length > 0 && (
            <Card className="border-destructive/30 bg-destructive/5 p-6">
              <p className="text-sm font-semibold text-destructive">
                This is a commonly used password
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                It appears on public lists of the most breached passwords and
                can be cracked instantly. Choose something unique.
              </p>
            </Card>
          )}

          <Card className="bg-accent p-6">
            <p className="text-sm font-semibold text-accent-foreground">
              Pro Tip
            </p>
            <p className="mt-1 text-sm leading-relaxed text-foreground/80">
              Length beats complexity. A long passphrase of random words is both
              easier to remember and harder to crack than a short scramble.
            </p>
          </Card>
        </div>
      </div>

      <Disclaimer />
    </div>
  )
}
