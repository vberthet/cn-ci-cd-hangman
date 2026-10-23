/**
 * Runtime configuration, fetched from /config.json at startup.
 *
 * The same build is deployed to every environment: only config.json changes
 * (nginx generates it from environment variables in production).
 */
export interface AppConfig {
  sentryDsn?: string
  environment?: string
  version?: string
}

export async function loadConfig(url = '/config.json'): Promise<AppConfig> {
  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(3000) })
    if (!response.ok) return {}
    const data: unknown = await response.json()
    return isObject(data) ? (data as AppConfig) : {}
  } catch {
    // Missing, invalid or slow config must never prevent the app from starting.
    return {}
  }
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}
