import * as Sentry from '@sentry/react'
import type { AppConfig } from './config'

/** Enables Sentry only when a DSN is configured. Returns whether it is enabled. */
export function initSentry(config: AppConfig): boolean {
  if (!config.sentryDsn) return false

  Sentry.init({
    dsn: config.sentryDsn,
    environment: config.environment,
    release: config.version,
  })
  return true
}
