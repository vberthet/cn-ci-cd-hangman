import { describe, expect, it, vi } from 'vitest'
import { api, ApiError, wordsPath } from './api'
import { saveAdminToken } from './adminToken'
import { describeError } from './components/ErrorMessage'

describe('api client', () => {
  it('only puts non-empty filters in the words query string', () => {
    expect(wordsPath('', '')).toBe('/words')
    expect(wordsPath('gir', '')).toBe('/words?search=gir')
    expect(wordsPath('a b', 'animals')).toBe('/words?search=a+b&category=animals')
  })

  it('sends the admin token on dictionary writes when one is set', async () => {
    const fetchMock = vi.fn(async () => new Response(null, { status: 204 }))
    vi.stubGlobal('fetch', fetchMock)

    await api.deleteWord(1)
    saveAdminToken('s3cret')
    await api.deleteWord(2)

    expect(fetchMock.mock.calls[0]).toEqual([
      '/api/words/1',
      expect.objectContaining({ headers: { 'Content-Type': 'application/json' } }),
    ])
    expect(fetchMock.mock.calls[1]).toEqual([
      '/api/words/2',
      expect.objectContaining({
        headers: { 'Content-Type': 'application/json', 'X-Admin-Token': 's3cret' },
      }),
    ])
  })

  it('explains authentication errors in plain words', async () => {
    vi.stubGlobal('fetch', async () => new Response(null, { status: 401 }))

    const error = await api.addWord({ value: 'giraffe', category: 'animals' }).catch((e) => e)

    expect(error).toEqual(new ApiError(401, 'HTTP 401'))
    expect(describeError(error)).toMatch(/admin token/)
  })
})
