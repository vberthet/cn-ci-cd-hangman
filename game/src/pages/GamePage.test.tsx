import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import type { Game } from '../api'
import { mockApi, renderApp } from '../test/utils'

const game: Game = {
  id: 1,
  playerName: 'Alice',
  maskedWord: 'C_T',
  wordLength: 3,
  guessedLetters: ['c', 't'],
  wrongLetters: [],
  remainingAttempts: 6,
  maxAttempts: 6,
  status: 'IN_PROGRESS',
  word: null,
  category: 'animals',
  startedAt: '2026-10-22T10:00:00Z',
  finishedAt: null,
}

describe('GamePage', () => {
  it('shows the masked word and the deployed version', async () => {
    mockApi({
      'GET /api/games/1': () => ({ body: game }),
      'GET /api/info': () => ({ body: { version: '1.2.0', environment: 'staging' } }),
    })
    renderApp('/games/1')

    expect(await screen.findByLabelText('Word to guess')).toHaveTextContent('C T')
    expect(await screen.findByText('1.2.0 · staging')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'C' })).toBeDisabled()
  })

  it('sends a guess from the physical keyboard and shows the victory', async () => {
    const fetchMock = mockApi({
      'GET /api/games/1': () => ({ body: game }),
      'POST /api/games/1/guesses': () => ({
        body: { ...game, maskedWord: 'CAT', status: 'WON', word: 'cat', guessedLetters: ['c', 't', 'a'] },
      }),
    })
    renderApp('/games/1')
    await screen.findByLabelText('Word to guess')

    await userEvent.keyboard('a')

    expect(await screen.findByText(/You won!/)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'New game' })).toBeInTheDocument()
    expect(fetchMock).toHaveBeenCalledWith(
      '/api/games/1/guesses',
      expect.objectContaining({ body: '{"letter":"a"}' }),
    )
  })

  it('shows a friendly message when the API is down', async () => {
    vi.stubGlobal('fetch', async () => {
      throw new TypeError('Failed to fetch')
    })
    renderApp('/games/1')

    expect(await screen.findByRole('alert')).toHaveTextContent('unreachable')
  })
})
