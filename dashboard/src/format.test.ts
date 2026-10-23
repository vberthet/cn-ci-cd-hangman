import { describe, expect, it } from 'vitest'
import { barHeight, formatDay, formatPercent, winRate } from './format'

describe('format helpers', () => {
  it('formats ratios as rounded percentages', () => {
    expect(formatPercent(0.636)).toBe('64%')
    expect(formatPercent(0)).toBe('0%')
    expect(formatPercent(1)).toBe('100%')
  })

  it('formats calendar days without time zone shifts', () => {
    expect(formatDay('2026-10-01')).toBe('Oct 1')
  })

  it('computes the win rate, or null for never played words', () => {
    expect(winRate(4, 1)).toBe(0.25)
    expect(winRate(0, 0)).toBeNull()
  })

  it('scales bars to the tallest one without dividing by zero', () => {
    expect(barHeight(5, 10)).toBe(50)
    expect(barHeight(0, 0)).toBe(0)
  })
})
