import React, { forwardRef } from 'react'

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { label, className = '', id, ...rest },
  ref,
) {
  const checkboxId = id ?? rest.name
  return (
    <label htmlFor={checkboxId} className="inline-flex items-center gap-2 text-sm text-slate-700 select-none">
      <input
        ref={ref}
        id={checkboxId}
        type="checkbox"
        className={[
          'h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500',
          className,
        ].join(' ')}
        {...rest}
      />
      {label}
    </label>
  )
})
