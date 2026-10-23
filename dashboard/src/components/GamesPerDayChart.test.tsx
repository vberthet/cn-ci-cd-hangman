import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { GamesPerDayChart } from './GamesPerDayChart'

describe('GamesPerDayChart', () => {
  it('draws bars proportional to the busiest day, with the won share inside', () => {
    render(
      <GamesPerDayChart
        days={[
          { date: '2026-10-20', games: 10, won: 5 },
          { date: '2026-10-21', games: 4, won: 1 },
        ]}
      />,
    )

    const column = screen.getByTitle('1 won / 4 games')
    const bar = column.querySelector<HTMLElement>('.chart-bar')!
    expect(bar.style.height).toBe('40%')
    expect(bar.querySelector<HTMLElement>('.chart-bar-won')!.style.height).toBe('25%')
    expect(screen.getByText('Oct 20')).toBeInTheDocument()
  })
})
