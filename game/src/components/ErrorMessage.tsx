import * as Sentry from '@sentry/react'
import { useEffect } from 'react'
import { ApiError } from '../api'

interface Props {
  error: unknown
  onRetry?: () => void
}

export function ErrorMessage({ error, onRetry }: Props) {
  useEffect(() => {
    // Only unexpected errors are worth reporting (no-op when Sentry is disabled).
    if (!(error instanceof ApiError)) Sentry.captureException(error)
  }, [error])

  return (
    <div className="notice notice-error" role="alert">
      <p>{describe(error)}</p>
      {onRetry && (
        <button type="button" onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  )
}

function describe(error: unknown): string {
  if (error instanceof ApiError) {
    if (error.status === 0) return 'The game server is unreachable. Please try again in a moment.'
    if (error.status === 404) return 'Not found.'
    return error.message
  }
  return 'Something went wrong.'
}
