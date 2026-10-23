import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { mockApi, renderApp } from '../test/utils'

describe('HomePage', () => {
  it('starts a game in the chosen category and remembers the player name', async () => {
    let createdWith: unknown
    mockApi({
      'GET /api/categories': () => ({ body: ['animals', 'fruits'] }),
      'POST /api/games?category=fruits': (body) => {
        createdWith = body
        return { status: 201, body: { id: 42 } }
      },
    })
    const router = renderApp('/')

    await userEvent.type(await screen.findByLabelText('Your name'), 'Alice')
    await userEvent.selectOptions(await screen.findByLabelText('Category'), await screen.findByRole('option', { name: 'fruits' }))
    await userEvent.click(screen.getByRole('button', { name: 'Start a game' }))

    await waitFor(() => expect(router.state.location.pathname).toBe('/games/42'))
    expect(createdWith).toEqual({ playerName: 'Alice' })
    expect(localStorage.getItem('hangman.playerName')).toBe('Alice')
  })
})
