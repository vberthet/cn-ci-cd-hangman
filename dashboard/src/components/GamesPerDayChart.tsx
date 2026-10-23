import type { Stats } from '../api'
import { barHeight, formatDay } from '../format'

type Day = Stats['gamesPerDay'][number]

/** Vertical bars: total games per day, with the won part highlighted. */
export function GamesPerDayChart({ days }: { days: Day[] }) {
  const max = Math.max(0, ...days.map((day) => day.games))

  return (
    <figure className="chart">
      <div className="chart-bars">
        {days.map((day) => (
          <div key={day.date} className="chart-column" title={`${day.won} won / ${day.games} games`}>
            <span className="chart-value">{day.games}</span>
            <div className="chart-track">
              <div className="chart-bar" style={{ height: `${barHeight(day.games, max)}%` }}>
                <div
                  className="chart-bar-won"
                  style={{ height: `${barHeight(day.won, day.games)}%` }}
                />
              </div>
            </div>
            <span className="chart-label">{formatDay(day.date)}</span>
          </div>
        ))}
      </div>
      <figcaption className="legend">
        <span className="legend-total">Games</span>
        <span className="legend-won">Won</span>
      </figcaption>
    </figure>
  )
}
