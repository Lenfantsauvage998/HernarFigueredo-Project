import React from 'react'
import Spinner from './Spinner'

type Variant = 'primary' | 'outline' | 'ghost' | 'danger'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  loading?: boolean
  children: React.ReactNode
}

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-[#c4501a] hover:bg-[#d45c1a] text-white font-semibold shadow-sm',
  outline:
    'border border-white/20 text-white hover:border-[#c4501a] hover:text-[#c4501a] font-medium',
  ghost:
    'text-white/80 hover:bg-white/10 hover:text-white font-medium',
  danger:
    'bg-red-600 hover:bg-red-700 text-white font-semibold shadow-sm',
}

const sizeClasses: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-sm rounded-lg',
  md: 'px-5 py-2.5 text-sm rounded-xl',
  lg: 'px-8 py-3.5 text-base rounded-xl',
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  children,
  className = '',
  ...props
}) => {
  return (
    <button
      disabled={disabled || loading}
      className={`
        inline-flex items-center justify-center gap-2
        transition-all duration-200 cursor-pointer
        disabled:opacity-60 disabled:cursor-not-allowed
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${className}
      `}
      {...props}
    >
      {loading && <Spinner size="sm" color="white" />}
      {children}
    </button>
  )
}

export default Button
