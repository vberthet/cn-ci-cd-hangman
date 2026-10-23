import * as Sentry from '@sentry/react'
import { describe, expect, it, vi } from 'vitest'
import { initSentry } from './sentry'

vi.mock('@sentry/react', () => ({ init: vi.fn() }))

describe('initSentry', () => {
  it('does nothing without a DSN', () => {
    expect(initSentry({ environment: 'staging' })).toBe(false)
    expect(Sentry.init).not.toHaveBeenCalled()
  })

  it('initializes Sentry with environment and release', () => {
    expect(initSentry({ sentryDsn: 'https://key@sentry.example/1', environment: 'prod', version: '1.2.0' })).toBe(true)
    expect(Sentry.init).toHaveBeenCalledWith({
      dsn: 'https://key@sentry.example/1',
      environment: 'prod',
      release: '1.2.0',
    })
  })
})
