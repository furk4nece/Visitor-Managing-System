import React from 'react'

export interface CardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  title?: React.ReactNode
  actions?: React.ReactNode
  padded?: boolean
}

export function Card({
  title,
  actions,
  padded = true,
  className = '',
  children,
  ...rest
}: CardProps) {
  return (
    <div
      className={[
        'rounded-lg border border-slate-200 bg-white shadow-sm',
        className,
      ].join(' ')}
      {...rest}
    >
      {(title || actions) && (
        <div className="relative flex items-center justify-center border-b border-slate-100 px-4 py-3">
          {title && (
            <h3 className="text-lg font-semibold text-slate-800">
              {title}
            </h3>
          )}

          {actions && (
            <div className="absolute right-4">
              {actions}
            </div>
          )}
        </div>
      )}

      <div className={padded ? 'p-4' : ''}>
        {children}
      </div>
    </div>
  )
}