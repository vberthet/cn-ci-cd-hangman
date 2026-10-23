import { describe, expect, it } from 'vitest'
import type { Game } from './api'
import { letterState, maskedSlots, toLetter, wrongGuessCount } from './game'

const game: Game = {
  id: 1,
  playerName: 'Alice',
  maskedWord: 'H_N_M_N',
  wordLength: 7,
  guessedLetters: ['h', 'n', 'm', 'e'],
  wrongLetters: ['e'],
  remainingAttempts: 5,
  maxAttempts: 6,
  status: 'IN_PROGRESS',
  word: null,
  category: 'animals',
  startedAt: '2026-10-22T10:00:00Z',
  finishedAt: null,
}

describe('game helpers', () => {
  it('converts keyboard keys to lowercase letters', () => {
    expect(toLetter('a')).toBe('a')
    expect(toLetter('Q')).toBe('q')
    expect(toLetter('Enter')).toBeNull()
    expect(toLetter('1')).toBeNull()
    expect(toLetter('é')).toBeNull()
  })

  it('tells whether a letter was a hit, a miss or not played yet', () => {
    expect(letterState(game, 'h')).toBe('hit')
    expect(letterState(game, 'e')).toBe('miss')
    expect(letterState(game, 'z')).toBe('unused')
  })

  it('splits the masked word into slots', () => {
    expect(maskedSlots('H_n')).toEqual(['H', null, 'N'])
  })

  it('counts wrong guesses from remaining attempts', () => {
    expect(wrongGuessCount(game)).toBe(1)
  })
})
