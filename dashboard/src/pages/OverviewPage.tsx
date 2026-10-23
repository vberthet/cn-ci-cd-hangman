import { useQuery } from '@tanstack/react-query'
import { api } from '../api'
import { ErrorMessage } from '../components/ErrorMessage'
import { GamesPerDayChart } from '../components/GamesPerDayChart'
import { KpiTile } from '../components/KpiTile'
import { formatDecimal, formatPercent } from '../format'

export function OverviewPage() {
  const { data: stats, error, refetch } = useQuery({ queryKey: ['stats'], queryFn: api.stats })

  if (error) return <ErrorMessage error={error} onRetry={() => refetch()} />
  if (!stats) return <p className="muted">Loading…</p>

  return (
    <>
      <h1>Overview</h1>
      <section className="kpis">
        <KpiTile label="Games played" value={stats.totalGames} />
        <KpiTile label="Win rate" value={formatPercent(stats.winRate)} />
        <KpiTile label="Avg. wrong guesses" value={formatDecimal(stats.averageWrongGuesses)} />
        <KpiTile label="In progress" value={stats.inProgress} />
      </section>

      <section className="panel">
        <h2>Games per day</h2>
        <GamesPerDayChart days={stats.gamesPerDay} />
      </section>

      <div className="columns">
        <section className="panel">
          <h2>Hardest words</h2>
          {stats.hardestWords.length === 0 && <p className="muted">No finished game yet.</p>}
          <table className="table" hidden={stats.hardestWords.length === 0}>
            <thead>
              <tr>
                <th>Word</th>
                <th className="number">Played</th>
                <th className="number">Win rate</th>
              </tr>
            </thead>
            <tbody>
              {stats.hardestWords.map((word) => (
                <tr key={word.word}>
                  <td>{word.word}</td>
                  <td className="number">{word.played}</td>
                  <td className="number">{formatPercent(word.winRate)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="panel">
          <h2>Top players</h2>
          {stats.topPlayers.length === 0 && <p className="muted">No winner yet.</p>}
          <ol className="ranking">
            {stats.topPlayers.map((player) => (
              <li key={player.playerName}>
                <span>{player.playerName}</span>
                <strong>{player.won} won</strong>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </>
  )
}
