import { describe, expect, it, vi } from 'vitest'
import { loadConfig } from './config'

describe('loadConfig', () => {
  it('returns the content of config.json', async () => {
    const config = { sentryDsn: 'https://key@sentry.example/1', environment: 'staging' }
    vi.stubGlobal('fetch', async () => Response.json(config))

    expect(await loadConfig()).toEqual(config)
  })

  it('falls back to an empty config when config.json is missing, invalid or unreachable', async () => {
    vi.stubGlobal('fetch', async () => new Response('Not found', { status: 404 }))
    expect(await loadConfig()).toEqual({})

    vi.stubGlobal('fetch', async () => new Response('<!doctype html>'))
    expect(await loadConfig()).toEqual({})

    vi.stubGlobal('fetch', async () => {
      throw new TypeError('Failed to fetch')
    })
    expect(await loadConfig()).toEqual({})
  })
})
