import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import type { Word } from '../api'
import { mockApi, renderApp } from '../test/utils'

const words: Word[] = [
  { id: 1, value: 'zebra', category: 'animals', timesPlayed: 4, timesWon: 1 },
  { id: 2, value: 'apple', category: 'fruits', timesPlayed: 0, timesWon: 0 },
]

function wordColumn() {
  return screen.getAllByRole('row').slice(1).map((row) => within(row).getAllByRole('cell')[0].textContent)
}

describe('DictionaryPage', () => {
  it('lists words and sorts them when a header is clicked', async () => {
    mockApi({
      'GET /api/words': () => ({ body: words }),
      'GET /api/categories': () => ({ body: ['animals', 'fruits'] }),
    })
    renderApp('/dictionary')

    expect(await screen.findByText('zebra')).toBeInTheDocument()
    expect(screen.getByText('25%')).toBeInTheDocument()
    expect(wordColumn()).toEqual(['zebra', 'apple'])

    await userEvent.click(screen.getByRole('button', { name: 'Word' }))

    expect(wordColumn()).toEqual(['apple', 'zebra'])
  })

  it('asks for the admin token when a delete is rejected', async () => {
    mockApi({
      'GET /api/words': () => ({ body: words }),
      'DELETE /api/words/1': () => ({ status: 401 }),
    })
    renderApp('/dictionary')

    await userEvent.click(await screen.findByRole('button', { name: 'Delete zebra' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('admin token')
  })
})
