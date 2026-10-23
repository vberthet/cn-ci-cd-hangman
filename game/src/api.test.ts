import { describe, expect, it, vi } from 'vitest'
import { api, ApiError } from './api'

describe('api client', () => {
  it('sends the category as a query parameter when creating a game', async () => {
    const fetchMock = vi.fn(async () => Response.json({ id: 3 }, { status: 201 }))
    vi.stubGlobal('fetch', fetchMock)

    await api.createGame('Alice', 'animals')

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/games?category=animals',
      expect.objectContaining({ method: 'POST', body: '{"playerName":"Alice"}' }),
    )
  })

  it('turns an error response into an ApiError with the server message', async () => {
    vi.stubGlobal('fetch', async () => Response.json({ message: 'Game is finished' }, { status: 409 }))

    await expect(api.guess(1, 'a')).rejects.toEqual(new ApiError(409, 'Game is finished'))
  })

  it('reports an unreachable API with status 0', async () => {
    vi.stubGlobal('fetch', async () => {
      throw new TypeError('Failed to fetch')
    })

    await expect(api.info()).rejects.toMatchObject({ status: 0 })
  })
})
