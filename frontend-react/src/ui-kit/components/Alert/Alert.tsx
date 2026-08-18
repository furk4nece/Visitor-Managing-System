import React from 'react'

export type AlertTone = 'success' | 'warning' | 'danger' | 'info'

const toneClasses: Record<AlertTone, string> = {
  success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  warning: 'bg-amber-50 text-amber-700 border-amber-200',
  danger: 'bg-red-50 text-red-700 border-red-200',
  info: 'bg-blue-50 text-blue-700 border-blue-200',
}

export interface AlertProps {
  tone?: AlertTone
  title?: string
  children?: React.ReactNode
  onClose?: () => void
}

export function Alert({ tone = 'info', title, children, onClose }: AlertProps) {
  return (
    <div className={['flex items-start justify-between gap-3 rounded-md border px-4 py-3 text-sm', toneClasses[tone]].join(' ')}>
      <div>
        {title && <p className="font-medium">{title}</p>}
        {children && <p className="mt-0.5">{children}</p>}
      </div>
      {onClose && (
        <button onClick={onClose} className="text-current opacity-70 hover:opacity-100">
          ✕
        </button>
      )}
    </div>
  )
}
