import { cn } from '@/lib/utils'
import type { StrengthResult } from '@/lib/password'

const SEGMENT_COLORS = [
  'bg-destructive',
  'bg-warning',
  'bg-amber-400',
  'bg-lime-500',
  'bg-success',
]

const LABEL_COLORS = [
  'text-destructive',
  'text-warning',
  'text-amber-500',
  'text-lime-600',
  'text-success',
]

export function StrengthMeter({
  result,
  empty,
}: {
  result: StrengthResult
  empty?: boolean
}) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Strength
        </span>
        <span
          className={cn(
            'text-sm font-semibold',
            empty ? 'text-muted-foreground' : LABEL_COLORS[result.score],
          )}
        >
          {empty ? '—' : result.label}
        </span>
      </div>
      <div className="mt-2 flex gap-1.5">
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={cn(
              'h-2 flex-1 rounded-full transition-colors duration-300',
              !empty && i <= result.score
                ? SEGMENT_COLORS[result.score]
                : 'bg-secondary',
            )}
          />
        ))}
      </div>
    </div>
  )
}
