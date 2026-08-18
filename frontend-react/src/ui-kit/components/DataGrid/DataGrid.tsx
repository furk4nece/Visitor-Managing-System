import React from 'react'
import { Spinner } from '../Spinner'

export interface DataGridColumn<T> {
  key: string
  header: React.ReactNode
  /** Custom cell renderer. Falls back to `row[key]` if omitted. */
  render?: (row: T) => React.ReactNode
  width?: string
  align?: 'left' | 'center' | 'right'
}

export interface DataGridProps<T> {
  columns: DataGridColumn<T>[]
  rows: T[]
  rowKey: (row: T) => string | number
  loading?: boolean
  emptyMessage?: string
  onRowClick?: (row: T) => void
}

const alignClass = { left: 'text-left', center: 'text-center', right: 'text-right' }

/**
 * Base data grid — the React replacement for the repeated Svelte
 * `{#each}` tables (visitor list, personnel list, user list, ...).
 * Pass columns + rows and it handles header, loading and empty states.
 */
export function DataGrid<T extends Record<string, any>>({
  columns,
  rows,
  rowKey,
  loading = false,
  emptyMessage = 'Kayıt bulunamadı',
  onRowClick,
}: DataGridProps<T>) {
  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200">
      <table className="min-w-full divide-y divide-slate-200 text-sm">
        <thead className="bg-slate-50">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                style={{ width: col.width }}
                className={['px-4 py-2.5 font-semibold text-slate-600', alignClass[col.align ?? 'left']].join(' ')}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white">
          {loading ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-8 text-center">
                <Spinner label="Yükleniyor..." className="mx-auto" />
              </td>
            </tr>
          ) : rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-8 text-center text-slate-400">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr
                key={rowKey(row)}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                className={onRowClick ? 'cursor-pointer hover:bg-slate-50' : ''}
              >
                {columns.map((col) => (
                  <td key={col.key} className={['px-4 py-2.5 text-slate-700', alignClass[col.align ?? 'left']].join(' ')}>
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
