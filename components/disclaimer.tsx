import { ShieldAlert } from 'lucide-react'

export function Disclaimer() {
  return (
    <div className="mt-8 flex items-start gap-2.5 rounded-lg border border-border bg-secondary/60 px-4 py-3 text-xs leading-relaxed text-muted-foreground">
      <ShieldAlert className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
      <p>
        CyberGuard uses client-side heuristics for demonstration purposes. For
        production security, use certified tools.
      </p>
    </div>
  )
}
