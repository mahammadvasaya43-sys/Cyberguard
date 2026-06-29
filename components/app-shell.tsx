'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Shield, Info, Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { navItems } from '@/lib/nav'
import { Button } from '@/components/ui/button'
import { AboutModal } from '@/components/about-modal'

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname()
  return (
    <nav className="flex flex-col gap-1">
      {navItems.map((item) => {
        const active = pathname === item.href
        const Icon = item.icon
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              'group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
              active
                ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                : 'text-muted-foreground hover:bg-secondary hover:text-foreground',
            )}
            aria-current={active ? 'page' : undefined}
          >
            <span
              className={cn(
                'absolute left-0 top-1/2 h-6 -translate-y-1/2 rounded-r-full bg-primary transition-all',
                active ? 'w-1' : 'w-0',
              )}
              aria-hidden="true"
            />
            <Icon className="size-4 shrink-0" />
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}

function Brand() {
  return (
    <Link href="/" className="flex items-center gap-2.5">
      <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
        <Shield className="size-5" />
      </span>
      <span className="text-lg font-semibold tracking-tight text-foreground">
        CyberGuard
      </span>
    </Link>
  )
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [aboutOpen, setAboutOpen] = useState(false)
  const pathname = usePathname()
  const current = navItems.find((i) => i.href === pathname)
  const crumb = current?.label ?? 'CyberGuard'

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen w-[260px] shrink-0 flex-col border-r border-sidebar-border bg-sidebar lg:flex animate-slide-in-left">
        <div className="flex h-16 items-center border-b border-sidebar-border px-5">
          <Brand />
        </div>
        <div className="flex-1 overflow-y-auto px-3 py-4">
          <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Tools
          </p>
          <NavLinks />
        </div>
        <div className="border-t border-sidebar-border px-5 py-4">
          <p className="text-xs text-muted-foreground">Powered by CyberGuard</p>
        </div>
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-foreground/40 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
          <aside className="absolute left-0 top-0 flex h-full w-[260px] flex-col border-r border-sidebar-border bg-sidebar animate-slide-in-left">
            <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-5">
              <Brand />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
              >
                <X className="size-4" />
              </Button>
            </div>
            <div className="flex-1 overflow-y-auto px-3 py-4">
              <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Tools
              </p>
              <NavLinks onNavigate={() => setMobileOpen(false)} />
            </div>
            <div className="border-t border-sidebar-border px-5 py-4">
              <p className="text-xs text-muted-foreground">
                Powered by CyberGuard
              </p>
            </div>
          </aside>
        </div>
      )}

      {/* Main column */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-border bg-background/80 px-4 backdrop-blur md:px-6">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="size-5" />
            </Button>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">CyberGuard</span>
              <span className="text-muted-foreground/50">/</span>
              <span className="font-medium text-foreground">{crumb}</span>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={() => setAboutOpen(true)}>
            <Info className="size-4" />
            About CyberGuard
          </Button>
        </header>

        <main className="flex-1 px-4 py-6 md:px-8 md:py-8">
          <div key={pathname} className="mx-auto max-w-5xl animate-fade-in-up">
            {children}
          </div>
        </main>
      </div>

      <AboutModal open={aboutOpen} onClose={() => setAboutOpen(false)} />
    </div>
  )
}
