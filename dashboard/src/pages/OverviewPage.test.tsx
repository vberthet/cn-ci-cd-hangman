import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import type { Stats } from '../api'
import { mockApi, renderApp } from '../test/utils'

const stats: Stats = {
  totalGames: 120,
  won: 70,
  lost: 40,
  inProgress: 10,
  winRate: 0.636,
  averageWrongGuesses: 2.44,
  gamesPerDay: [{ date: '2026-10-20', games: 12, won: 7 }],
  hardestWords: [{ word: 'rhythm', played: 9, winRate: 0.11 }],
  topPlayers: [{ playerName: 'Alice', won: 12 }],
}

describe('OverviewPage', () => {
  it('shows KPIs, hardest words, top players and the deployed version', async () => {
    mockApi({
      'GET /api/stats': () => ({ body: stats }),
      'GET /api/info': () => ({ body: { version: '1.2.0', environment: 'staging' } }),
    })
    renderApp('/')

    expect(await screen.findByText('64%')).toBeInTheDocument()
    expect(screen.getByText('2.4')).toBeInTheDocument()
    expect(screen.getByText('rhythm')).toBeInTheDocument()
    expect(screen.getByText('Alice')).toBeInTheDocument()
    expect(await screen.findByText('1.2.0 · staging')).toBeInTheDocument()
  })

  it('shows empty states before any game is finished', async () => {
    mockApi({
      'GET /api/stats': () => ({ body: { ...stats, hardestWords: [], topPlayers: [] } }),
    })
    renderApp('/')

    expect(await screen.findByText('No finished game yet.')).toBeInTheDocument()
    expect(screen.getByText('No winner yet.')).toBeInTheDocument()
  })

  it('shows a friendly message when the API is down', async () => {
    mockApi({ 'GET /api/stats': () => ({ status: 503 }) })
    renderApp('/')

    expect(await screen.findByRole('alert')).toHaveTextContent('HTTP 503')
  })
})
