import { useState, type FormEvent } from 'react'
import type { NewWord } from '../api'

interface Props {
  categories: string[]
  pending: boolean
  onAdd: (word: NewWord) => void
}

export function AddWordForm({ categories, pending, onAdd }: Props) {
  const [value, setValue] = useState('')
  const [category, setCategory] = useState('')

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    onAdd({ value: value.trim().toLowerCase(), category: category.trim().toLowerCase() })
    setValue('')
  }

  return (
    <form className="inline-form" onSubmit={handleSubmit}>
      <input
        aria-label="New word"
        placeholder="New word"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        pattern="[A-Za-z]{3,30}"
        title="Letters only, 3 to 30 characters"
        required
      />
      <input
        aria-label="Word category"
        placeholder="Category"
        list="category-options"
        value={category}
        onChange={(event) => setCategory(event.target.value)}
        required
      />
      <datalist id="category-options">
        {categories.map((name) => (
          <option key={name} value={name} />
        ))}
      </datalist>
      <button type="submit" className="primary" disabled={pending}>
        Add word
      </button>
    </form>
  )
}
