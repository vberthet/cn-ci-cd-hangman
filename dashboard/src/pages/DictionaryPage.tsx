import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { api } from '../api'
import { loadAdminToken, saveAdminToken } from '../adminToken'
import { AddWordForm } from '../components/AddWordForm'
import { ErrorMessage } from '../components/ErrorMessage'
import { WordTable } from '../components/WordTable'

export function DictionaryPage() {
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [adminToken, setAdminToken] = useState(loadAdminToken)

  const categories = useQuery({ queryKey: ['categories'], queryFn: api.categories })
  const words = useQuery({
    queryKey: ['words', search, category],
    queryFn: () => api.words(search, category),
    placeholderData: keepPreviousData,
  })

  const refreshDictionary = () => {
    queryClient.invalidateQueries({ queryKey: ['words'] })
    queryClient.invalidateQueries({ queryKey: ['categories'] })
  }
  const addWord = useMutation({ mutationFn: api.addWord, onSuccess: refreshDictionary })
  const deleteWord = useMutation({
    mutationFn: (id: number) => api.deleteWord(id),
    onSuccess: refreshDictionary,
  })
  const writeError = addWord.error ?? deleteWord.error

  function changeAdminToken(token: string) {
    setAdminToken(token)
    saveAdminToken(token)
  }

  return (
    <>
      <h1>Dictionary</h1>

      <section className="panel">
        <h2>Add a word</h2>
        <AddWordForm
          categories={categories.data ?? []}
          pending={addWord.isPending}
          onAdd={(word) => addWord.mutate(word)}
        />
        <label className="admin-token">
          Admin token
          <input
            type="password"
            value={adminToken}
            onChange={(event) => changeAdminToken(event.target.value)}
            placeholder="Only needed if the API requires one"
          />
        </label>
        {writeError && <ErrorMessage error={writeError} />}
      </section>

      <section className="panel">
        <div className="filters">
          <input
            type="search"
            aria-label="Search words"
            placeholder="Search…"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <select
            aria-label="Filter by category"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
          >
            <option value="">All categories</option>
            {categories.data?.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
          {words.data && <span className="muted">{words.data.length} words</span>}
        </div>

        {words.error && <ErrorMessage error={words.error} onRetry={() => words.refetch()} />}
        {words.data && (
          <WordTable
            words={words.data}
            deleting={deleteWord.isPending}
            onDelete={(word) => deleteWord.mutate(word.id)}
          />
        )}
      </section>
    </>
  )
}
