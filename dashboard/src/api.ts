import { loadAdminToken } from './adminToken'

export interface Word {
  id: number
  value: string
  category: string
  timesPlayed: number
  timesWon: number
}

export interface NewWord {
  value: string
  category: string
}

export interface Stats {
  totalGames: number
  won: number
  lost: number
  inProgress: number
  winRate: number
  averageWrongGuesses: number
  gamesPerDay: { date: string; games: number; won: number }[]
  hardestWords: { word: string; played: number; winRate: number }[]
  topPlayers: { playerName: string; won: number }[]
}

export interface Game {
  id: number
  playerName: string
  maskedWord: string
  wrongLetters: string[]
  remainingAttempts: number
  maxAttempts: number
  status: 'IN_PROGRESS' | 'WON' | 'LOST'
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

/** Dictionary writes may require an admin token (when ADMIN_TOKEN is set on the API). */
function adminHeaders(): HeadersInit {
  const token = loadAdminToken()
  return token ? { 'X-Admin-Token': token } : {}
}

export function wordsPath(search: string, category: string): string {
  const params = new URLSearchParams()
  if (search) params.set('search', search)
  if (category) params.set('category', category)
  const query = params.toString()
  return query ? `/words?${query}` : '/words'
}

export const api = {
  info: () => apiFetch<AppInfo>('/info'),
  stats: () => apiFetch<Stats>('/stats'),
  recentGames: (limit = 20) => apiFetch<Game[]>(`/games?limit=${limit}`),
  categories: () => apiFetch<string[]>('/categories'),
  words: (search = '', category = '') => apiFetch<Word[]>(wordsPath(search, category)),
  addWord: (word: NewWord) =>
    apiFetch<Word>('/words', { method: 'POST', body: JSON.stringify(word), headers: adminHeaders() }),
  deleteWord: (id: number) =>
    apiFetch<void>(`/words/${id}`, { method: 'DELETE', headers: adminHeaders() }),
}
