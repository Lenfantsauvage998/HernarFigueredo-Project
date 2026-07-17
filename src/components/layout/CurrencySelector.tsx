import React, { useState, useRef, useEffect } from 'react'
import { Globe, ChevronDown } from 'lucide-react'
import { useCurrencyStore } from '../../store/currencyStore'
import { CURRENCIES } from '../../lib/currency'

const CurrencySelector: React.FC = () => {
  const { currency, setCurrency } = useCurrencyStore()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 px-2.5 py-2 rounded-lg hover:bg-white/10 transition-colors text-white/80 hover:text-white text-sm font-medium"
        aria-label="Seleccionar moneda"
      >
        <Globe size={15} />
        {currency}
        <ChevronDown size={12} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-44 bg-[#1f1d1d] rounded-xl shadow-2xl border border-white/10 py-1.5 z-50">
          {CURRENCIES.map((c) => (
            <button
              key={c}
              onClick={() => { setCurrency(c); setOpen(false) }}
              className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                c === currency ? 'text-[#f26822] font-semibold' : 'text-white/70 hover:bg-white/10 hover:text-white'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default CurrencySelector
