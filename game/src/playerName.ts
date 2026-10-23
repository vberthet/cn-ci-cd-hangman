const STORAGE_KEY = 'hangman.playerName'

export function loadPlayerName(): string {
  try {
    return localStorage.getItem(STORAGE_KEY) ?? ''
  } catch {
    return ''
  }
}

export function savePlayerName(name: string): void {
  try {
    localStorage.setItem(STORAGE_KEY, name)
  } catch {
    // Storage may be unavailable (private mode): remembering the name is optional.
  }
}
