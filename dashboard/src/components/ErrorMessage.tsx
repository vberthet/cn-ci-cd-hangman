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
      <p>{describeError(error)}</p>
      {onRetry && (
        <button type="button" onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  )
}

export function describeError(error: unknown): string {
  if (!(error instanceof ApiError)) return 'Something went wrong.'
  switch (error.status) {
    case 0:
      return 'The API is unreachable. Please try again in a moment.'
    case 401:
    case 403:
      return 'Missing or invalid admin token. Set it in the "Admin token" field.'
    default:
      return error.message
  }
}
