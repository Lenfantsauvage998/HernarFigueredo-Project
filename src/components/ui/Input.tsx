import React from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className = '', id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-white/80">
            {label}
          </label>
        )}
        <input
          id={inputId}
          ref={ref}
          className={`
            w-full px-4 py-2.5 rounded-xl border text-sm bg-[#1a1b1c] text-white
            outline-none transition-all duration-200
            placeholder:text-white/30
            ${error
              ? 'border-red-500 focus:border-red-400 focus:ring-2 focus:ring-red-500/20'
              : 'border-white/10 focus:border-[#f26822] focus:ring-2 focus:ring-[#f26822]/20'
            }
            disabled:opacity-50 disabled:cursor-not-allowed
            ${className}
          `}
          {...props}
        />
        {error && <p className="text-xs text-red-400">{error}</p>}
        {helperText && !error && <p className="text-xs text-white/40">{helperText}</p>}
      </div>
    )
  }
)

Input.displayName = 'Input'

export default Input

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className = '', id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')
    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-white/80">
            {label}
          </label>
        )}
        <textarea
          id={inputId}
          ref={ref}
          className={`
            w-full px-4 py-2.5 rounded-xl border text-sm bg-[#1a1b1c] text-white
            outline-none transition-all duration-200 resize-none
            placeholder:text-white/30
            ${error
              ? 'border-red-500 focus:border-red-400'
              : 'border-white/10 focus:border-[#f26822]'
            }
            ${className}
          `}
          {...props}
        />
        {error && <p className="text-xs text-red-400">{error}</p>}
      </div>
    )
  }
)
Textarea.displayName = 'Textarea'
