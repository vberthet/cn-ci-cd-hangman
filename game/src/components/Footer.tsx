import { useQuery } from '@tanstack/react-query'
import { api } from '../api'

export function Footer() {
  const { data, isError } = useQuery({
    queryKey: ['info'],
    queryFn: api.info,
    staleTime: Infinity,
  })

  return (
    <footer className="footer">
      {data && `${data.version} · ${data.environment}`}
      {isError && 'API unavailable'}
    </footer>
  )
}
