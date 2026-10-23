import { useQuery } from '@tanstack/react-query'
import { api } from '../api'
import { ErrorMessage } from '../components/ErrorMessage'
import { formatDateTime } from '../format'

const STATUS_LABELS = { IN_PROGRESS: 'In progress', WON: 'Won', LOST: 'Lost' } as const

export function GamesPage() {
  const { data: games, error, refetch } = useQuery({
    queryKey: ['games', 'recent'],
    queryFn: () => api.recentGames(20),
  })

  if (error) return <ErrorMessage error={error} onRetry={() => refetch()} />
  if (!games) return <p className="muted">Loading…</p>

  return (
    <>
      <h1>Recent games</h1>
      <section className="panel">
        {games.length === 0 ? (
          <p className="muted">No game played yet.</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Started</th>
                <th>Player</th>
                <th>Word</th>
                <th>Category</th>
                <th className="number">Wrong guesses</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {games.map((game) => (
                <tr key={game.id}>
                  <td>{formatDateTime(game.startedAt)}</td>
                  <td>{game.playerName}</td>
                  <td>{game.word ?? game.maskedWord}</td>
                  <td>{game.category ?? '—'}</td>
                  <td className="number">{game.maxAttempts - game.remainingAttempts}</td>
                  <td>
                    <span className={`badge badge-${game.status.toLowerCase()}`}>
                      {STATUS_LABELS[game.status]}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </>
  )
}
