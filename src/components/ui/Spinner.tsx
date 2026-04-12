import React from 'react'

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  color?: 'accent' | 'white' | 'gray'
}

const sizes = {
  sm: 'w-4 h-4 border-2',
  md: 'w-8 h-8 border-3',
  lg: 'w-12 h-12 border-4',
}

const colors = {
  accent: 'border-[#f26822] border-t-transparent',
  white: 'border-white border-t-transparent',
  gray: 'border-white/40 border-t-transparent',
}

const Spinner: React.FC<SpinnerProps> = ({ size = 'md', color = 'accent' }) => {
  return (
    <div
      className={`rounded-full animate-spin ${sizes[size]} ${colors[color]}`}
      style={{ borderStyle: 'solid' }}
      aria-label="Cargando"
    />
  )
}

export default Spinner
