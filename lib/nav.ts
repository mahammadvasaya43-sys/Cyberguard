import { LayoutDashboard, Link2, KeyRound, ShieldCheck } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export type NavItem = {
  label: string
  href: string
  icon: LucideIcon
  description: string
}

export const navItems: NavItem[] = [
  {
    label: 'Dashboard',
    href: '/',
    icon: LayoutDashboard,
    description: 'Overview of every CyberGuard security tool.',
  },
  {
    label: 'Phishing Detector',
    href: '/phishing-detector',
    icon: Link2,
    description: 'Analyze any URL for phishing indicators and risk signals.',
  },
  {
    label: 'Password Checker',
    href: '/password-checker',
    icon: ShieldCheck,
    description: 'Measure password strength with real-time feedback.',
  },
  {
    label: 'Password Generator',
    href: '/password-generator',
    icon: KeyRound,
    description: 'Create strong, random passwords with custom rules.',
  },
]
