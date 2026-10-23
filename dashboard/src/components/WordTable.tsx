import {
  createColumnHelper,
  createSortedRowModel,
  rowSortingFeature,
  sortFn_alphanumeric,
  tableFeatures,
  useTable,
} from '@tanstack/react-table'
import type { Word } from '../api'
import { formatPercent, winRate } from '../format'

// Features, helper and columns live at module scope so they stay stable between renders.
const features = tableFeatures({
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  sortFns: { alphanumeric: sortFn_alphanumeric },
})

const column = createColumnHelper<typeof features, Word>()

const columns = column.columns([
  column.accessor('value', { header: 'Word' }),
  column.accessor('category', { header: 'Category' }),
  column.accessor('timesPlayed', { header: 'Played' }),
  column.accessor('timesWon', { header: 'Won' }),
  column.accessor((word) => winRate(word.timesPlayed, word.timesWon) ?? -1, {
    id: 'winRate',
    header: 'Win rate',
    cell: (info) => (info.getValue() < 0 ? '—' : formatPercent(info.getValue())),
  }),
])

interface Props {
  words: Word[]
  onDelete: (word: Word) => void
  deleting: boolean
}

const SORT_ARROWS = { asc: ' ▲', desc: ' ▼' } as const

export function WordTable({ words, onDelete, deleting }: Props) {
  const table = useTable({ features, columns, data: words })

  return (
    <table className="table">
      <thead>
        {table.getHeaderGroups().map((group) => (
          <tr key={group.id}>
            {group.headers.map((header) => {
              const sorted = header.column.getIsSorted()
              return (
                <th key={header.id}>
                  <button
                    type="button"
                    className="sort-button"
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <table.FlexRender header={header} />
                    {sorted && SORT_ARROWS[sorted]}
                  </button>
                </th>
              )
            })}
            <th aria-label="Actions" />
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map((row) => (
          <tr key={row.id}>
            {row.getAllCells().map((cell) => (
              <td key={cell.id}>
                <table.FlexRender cell={cell} />
              </td>
            ))}
            <td className="number">
              <button
                type="button"
                className="danger"
                disabled={deleting}
                onClick={() => onDelete(row.original)}
                aria-label={`Delete ${row.original.value}`}
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
