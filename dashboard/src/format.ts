/** 0.636 → "64%" */
export function formatPercent(ratio: number): string {
  return `${Math.round(ratio * 100)}%`
}

/** 2.4567 → "2.5" */
export function formatDecimal(value: number): string {
  return value.toFixed(1)
}

/** "2026-10-20" → "Oct 20" (dates are calendar days, formatted in UTC to avoid shifts). */
export function formatDay(isoDate: string): string {
  return new Date(`${isoDate}T00:00:00Z`).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  })
}

/** "2026-10-20T14:03:00Z" → "Oct 20, 14:03" in the browser's time zone. */
export function formatDateTime(isoDateTime: string): string {
  return new Date(isoDateTime).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
}

/** Win rate of a word, or null when it was never played. */
export function winRate(played: number, won: number): number | null {
  return played === 0 ? null : won / played
}

/** Bar height in percent of the tallest bar (never divides by zero). */
export function barHeight(value: number, max: number): number {
  return max > 0 ? (value / max) * 100 : 0
}
