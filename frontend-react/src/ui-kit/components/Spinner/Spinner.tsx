import React from 'react'

export interface SpinnerProps {
  size?: number
  className?: string
  label?: string
}

export function Spinner({ size = 20, className = '', label }: SpinnerProps) {
  return (
    <span className="inline-flex items-center gap-2 text-slate-500">
      <span
        className={['animate-spin rounded-full border-2 border-slate-300 border-t-primary-600', className].join(' ')}
        style={{ width: size, height: size }}
      />
      {label && <span className="text-sm">{label}</span>}
    </span>
  )
}
