import React, { forwardRef } from 'react'

export interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

/**
 * Base text input (textbox). Covers text/password/email/number/date via the
 * native `type` prop so we don't need a separate component per input type.
 */
export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(function TextInput(
  { label, error, hint, leftIcon, rightIcon, className = '', id, ...rest },
  ref,
) {
  const inputId = id ?? rest.name
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-slate-700">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {leftIcon && <span className="absolute left-3 text-slate-400">{leftIcon}</span>}
        <input
          ref={ref}
          id={inputId}
          className={[
            'w-full rounded-md border bg-white px-3 py-2 text-sm text-slate-800 shadow-sm transition-colors',
            'placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
            'disabled:bg-slate-100 disabled:text-slate-400',
            error ? 'border-red-400 focus:ring-red-400 focus:border-red-400' : 'border-slate-300',
            leftIcon ? 'pl-9' : '',
            rightIcon ? 'pr-9' : '',
            className,
          ].join(' ')}
          {...rest}
        />
        {rightIcon && <span className="absolute right-3 text-slate-400">{rightIcon}</span>}
      </div>
      {error ? (
        <span className="text-xs text-red-500">{error}</span>
      ) : hint ? (
        <span className="text-xs text-slate-400">{hint}</span>
      ) : null}
    </div>
  )
})
