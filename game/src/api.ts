export type GameStatus = 'IN_PROGRESS' | 'WON' | 'LOST'

export interface Game {
  id: number
  playerName: string
  maskedWord: string
  wordLength: number
  guessedLetters: string[]
  wrongLetters: string[]
  remainingAttempts: number
  maxAttempts: number
  status: GameStatus
  word: string | null
  category: string | null
  startedAt: string
  finishedAt: string | null
}

export interface AppInfo {
  version: string
  environment: string
}

export class ApiError extends Error {
  readonly status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

/** Calls the API with a relative URL: the dev proxy / nginx forwards /api to the backend. */
export async function apiFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  let response: Response
  try {
    response = await fetch(`/api${path}`, {
      ...init,
      headers: { 'Content-Type': 'application/json', ...init.headers },
    })
  } catch {
    throw new ApiError(0, 'Cannot reach the API. Is the server running?')
  }

  if (!response.ok) {
    throw new ApiError(response.status, await errorMessage(response))
  }
  return (response.status === 204 ? undefined : await response.json()) as T
}

async function errorMessage(response: Response): Promise<string> {
  try {
    const body = await response.json()
    return body.message ?? body.detail ?? `HTTP ${response.status}`
  } catch {
    return `HTTP ${response.status}`
  }
}

export const api = {
  info: () => apiFetch<AppInfo>('/info'),
  categories: () => apiFetch<string[]>('/categories'),
  getGame: (id: number) => apiFetch<Game>(`/games/${id}`),
  createGame: (playerName: string, category?: string) =>
    apiFetch<Game>(`/games${category ? `?category=${encodeURIComponent(category)}` : ''}`, {
      method: 'POST',
      body: JSON.stringify({ playerName }),
    }),
  guess: (id: number, letter: string) =>
    apiFetch<Game>(`/games/${id}/guesses`, {
      method: 'POST',
      body: JSON.stringify({ letter }),
    }),
}
