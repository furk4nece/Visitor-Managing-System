import React from 'react'
import { Button } from '../Button'

export interface PaginationProps {
  page: number
  pageCount: number
  onPageChange: (page: number) => void
}

export function Pagination({ page, pageCount, onPageChange }: PaginationProps) {
  if (pageCount <= 1) return null
  return (
    <div className="flex items-center justify-between gap-2 pt-2">
      <span className="text-xs text-slate-500">
        Sayfa {page} / {pageCount}
      </span>
      <div className="flex gap-1">
        <Button size="sm" variant="outline" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
          Önceki
        </Button>
        <Button size="sm" variant="outline" disabled={page >= pageCount} onClick={() => onPageChange(page + 1)}>
          Sonraki
        </Button>
      </div>
    </div>
  )
}
