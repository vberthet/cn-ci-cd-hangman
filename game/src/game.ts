import type { Game } from './api'

export const ALPHABET = 'abcdefghijklmnopqrstuvwxyz'.split('')

export type LetterState = 'unused' | 'hit' | 'miss'

/** Returns the lowercase letter a–z for a keyboard key, or null for any other key. */
export function toLetter(key: string): string | null {
  const letter = key.toLowerCase()
  return /^[a-z]$/.test(letter) ? letter : null
}

export function letterState(game: Game, letter: string): LetterState {
  if (game.wrongLetters.includes(letter)) return 'miss'
  if (game.guessedLetters.includes(letter)) return 'hit'
  return 'unused'
}

export function isFinished(game: Game): boolean {
  return game.status !== 'IN_PROGRESS'
}

export function wrongGuessCount(game: Game): number {
  return game.maxAttempts - game.remainingAttempts
}

/** Splits "H_N_M_N" into displayable slots, where null means "not found yet". */
export function maskedSlots(maskedWord: string): (string | null)[] {
  return maskedWord.split('').map((char) => (char === '_' ? null : char.toUpperCase()))
}
