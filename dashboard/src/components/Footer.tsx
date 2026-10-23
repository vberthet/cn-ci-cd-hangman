import { useQuery } from '@tanstack/react-query'
import { api } from '../api'

function triggerTestError(): never {
  // Uncaught on purpose: Sentry's global handler reports it (Sentry exercise).
  throw new Error('Test error triggered from the dashboard')
}

export function Footer() {
  const { data, isError } = useQuery({
    queryKey: ['info'],
    queryFn: api.info,
    staleTime: Infinity,
  })

  return (
    <footer className="footer">
      <span>
        {data && `${data.version} · ${data.environment}`}
        {isError && 'API unavailable'}
      </span>
      <button type="button" className="link-button" onClick={triggerTestError}>
        Trigger test error
      </button>
    </footer>
  )
}
