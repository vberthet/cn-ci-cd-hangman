import type { Game } from '../api'
import { ALPHABET, letterState } from '../game'

interface Props {
  game: Game
  disabled: boolean
  onGuess: (letter: string) => void
}

export function Keyboard({ game, disabled, onGuess }: Props) {
  return (
    <div className="keyboard">
      {ALPHABET.map((letter) => {
        const state = letterState(game, letter)
        return (
          <button
            key={letter}
            type="button"
            className={`key key-${state}`}
            disabled={disabled || state !== 'unused'}
            onClick={() => onGuess(letter)}
          >
            {letter.toUpperCase()}
          </button>
        )
      })}
    </div>
  )
}
