'use client'

import { useEffect } from 'react'
import { X, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function AboutModal({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    if (open) {
      document.addEventListener('keydown', onKey)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="about-title"
    >
      <div
        className="absolute inset-0 bg-foreground/40 backdrop-blur-sm animate-fade-in-up"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative z-10 w-full max-w-lg rounded-xl border border-border bg-card p-6 shadow-xl animate-fade-in-up">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <ShieldCheck className="size-5" />
            </span>
            <div>
              <h2
                id="about-title"
                className="text-lg font-semibold text-foreground"
              >
                About CyberGuard
              </h2>
              <p className="text-sm text-muted-foreground">
                Your everyday security toolkit
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            aria-label="Close about dialog"
          >
            <X className="size-4" />
          </Button>
        </div>

        <div className="mt-5 space-y-4 text-sm leading-relaxed text-muted-foreground">
          <p>
            CyberGuard bundles three practical security utilities into one clean
            dashboard: a phishing link detector, a password strength checker,
            and a secure password generator.
          </p>
          <p>
            Every tool runs entirely in your browser using client-side
            heuristics. Nothing you type is ever uploaded, logged, or stored on
            a server.
          </p>
          <div className="rounded-lg border border-warning/30 bg-warning/10 p-3 text-warning">
            <p className="font-medium text-foreground">
              For educational purposes
            </p>
            <p className="mt-1 text-muted-foreground">
              CyberGuard demonstrates common security concepts. For
              mission-critical decisions, rely on certified, professionally
              audited security tools.
            </p>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <Button onClick={onClose}>Got it</Button>
        </div>
      </div>
    </div>
  )
}
