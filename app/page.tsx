import Link from 'next/link'
import { ArrowRight, Link2, ShieldCheck, KeyRound, Lock } from 'lucide-react'
import { Card } from '@/components/ui/card'

const tools = [
  {
    href: '/phishing-detector',
    icon: Link2,
    title: 'Phishing Link Detector',
    description:
      'Paste any URL and instantly scan it for phishing indicators, risk signals, and deceptive patterns.',
  },
  {
    href: '/password-checker',
    icon: ShieldCheck,
    title: 'Password Strength Checker',
    description:
      'Measure how strong your password really is with real-time scoring and an estimated time to crack.',
  },
  {
    href: '/password-generator',
    icon: KeyRound,
    title: 'Secure Password Generator',
    description:
      'Generate strong, random passwords with full control over length, symbols, numbers, and casing.',
  },
]

export default function HomePage() {
  return (
    <div>
      <section className="mb-10">
        <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
          <Lock className="size-3.5 text-primary" />
          Runs 100% in your browser
        </span>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground text-balance md:text-4xl">
          Your everyday cybersecurity toolkit
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted-foreground text-pretty">
          CyberGuard brings together three essential security tools in one clean
          dashboard. Detect phishing links, audit password strength, and
          generate secure credentials — all privately, with nothing sent to a
          server.
        </p>
      </section>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool) => {
          const Icon = tool.icon
          return (
            <Card
              key={tool.href}
              className="flex flex-col p-6 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
            >
              <span className="flex size-11 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                <Icon className="size-5" />
              </span>
              <h2 className="mt-4 text-lg font-semibold text-foreground">
                {tool.title}
              </h2>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                {tool.description}
              </p>
              <Link
                href={tool.href}
                className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-colors hover:text-accent-foreground"
              >
                Get Started
                <ArrowRight className="size-4" />
              </Link>
            </Card>
          )
        })}
      </div>

      <Card className="mt-8 flex flex-col items-start justify-between gap-4 bg-primary p-6 text-primary-foreground sm:flex-row sm:items-center">
        <div>
          <h3 className="text-lg font-semibold">Stay one step ahead</h3>
          <p className="mt-1 text-sm text-primary-foreground/80">
            Security is a habit. Run a quick check before you click, type, or
            sign up.
          </p>
        </div>
        <Link
          href="/phishing-detector"
          className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-primary-foreground px-4 py-2 text-sm font-medium text-primary transition-opacity hover:opacity-90"
        >
          Scan a link
          <ArrowRight className="size-4" />
        </Link>
      </Card>
    </div>
  )
}
