import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link, useParams } from '@tanstack/react-router'
import { useEffect } from 'react'
import { api } from '../api'
import { ErrorMessage } from '../components/ErrorMessage'
import { Gallows } from '../components/Gallows'
import { Keyboard } from '../components/Keyboard'
import { isFinished, letterState, maskedSlots, toLetter, wrongGuessCount } from '../game'

export function GamePage() {
  const { gameId } = useParams({ from: '/games/$gameId' })
  const queryClient = useQueryClient()
  const { data: game, error, refetch } = useQuery({
    queryKey: ['game', gameId],
    queryFn: () => api.getGame(gameId),
  })

  const guess = useMutation({
    mutationFn: (letter: string) => api.guess(gameId, letter),
    onSuccess: (updated) => queryClient.setQueryData(['game', gameId], updated),
  })

  const canPlay = game !== undefined && !isFinished(game) && !guess.isPending
  const play = (letter: string) => {
    if (canPlay && letterState(game, letter) === 'unused') guess.mutate(letter)
  }

  // Physical keyboard support.
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.ctrlKey || event.metaKey || event.altKey) return
      const letter = toLetter(event.key)
      if (letter) play(letter)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  })

  if (error) return <ErrorMessage error={error} onRetry={() => refetch()} />
  if (!game) return <p className="muted">Loading…</p>

  return (
    <section className="card game">
      <p className="muted">
        {game.playerName}
        {game.category && ` · ${game.category}`}
      </p>

      <Gallows wrongGuesses={wrongGuessCount(game)} />

      <p className="word" aria-label="Word to guess">
        {maskedSlots(game.maskedWord).map((char, index) => (
          <span key={index} className="slot">
            {char ?? ' '}
          </span>
        ))}
      </p>

      <p className="attempts">
        Remaining attempts: <strong>{game.remainingAttempts}</strong> / {game.maxAttempts}
        {game.wrongLetters.length > 0 && (
          <span className="wrong-letters">
            {' '}
            · Wrong letters: {game.wrongLetters.join(' ').toUpperCase()}
          </span>
        )}
      </p>

      {isFinished(game) ? (
        <div className={`result result-${game.status.toLowerCase()}`} role="status">
          <p>
            {game.status === 'WON' ? 'You won!' : 'You lost!'} The word was{' '}
            <strong>{game.word?.toUpperCase()}</strong>.
          </p>
          <Link to="/" className="button primary">
            New game
          </Link>
        </div>
      ) : (
        <Keyboard game={game} disabled={!canPlay} onGuess={play} />
      )}

      {guess.isError && <ErrorMessage error={guess.error} />}
    </section>
  )
}
