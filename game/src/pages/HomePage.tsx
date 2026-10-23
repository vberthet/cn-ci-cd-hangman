import { useMutation, useQuery } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { useState, type FormEvent } from 'react'
import { api } from '../api'
import { ErrorMessage } from '../components/ErrorMessage'
import { loadPlayerName, savePlayerName } from '../playerName'

export function HomePage() {
  const navigate = useNavigate()
  const [playerName, setPlayerName] = useState(loadPlayerName)
  const [category, setCategory] = useState('')
  const categories = useQuery({ queryKey: ['categories'], queryFn: api.categories })

  const newGame = useMutation({
    mutationFn: () => api.createGame(playerName.trim() || 'Anonymous', category || undefined),
    onSuccess: (game) => navigate({ to: '/games/$gameId', params: { gameId: game.id } }),
  })

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    savePlayerName(playerName.trim())
    newGame.mutate()
  }

  return (
    <section className="card home">
      <h1>Guess the word</h1>
      <p className="muted">Six wrong guesses and you are hanged.</p>

      <form onSubmit={handleSubmit} className="form">
        <label>
          Your name
          <input
            value={playerName}
            onChange={(event) => setPlayerName(event.target.value)}
            placeholder="Anonymous"
            maxLength={50}
          />
        </label>

        <label>
          Category
          <select value={category} onChange={(event) => setCategory(event.target.value)}>
            <option value="">Any category</option>
            {categories.data?.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </label>

        <button type="submit" className="primary" disabled={newGame.isPending}>
          {newGame.isPending ? 'Starting…' : 'Start a game'}
        </button>
      </form>

      {newGame.isError && <ErrorMessage error={newGame.error} />}
    </section>
  )
}
