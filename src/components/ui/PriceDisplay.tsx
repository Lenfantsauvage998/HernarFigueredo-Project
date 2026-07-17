import React, { useState, useRef, useEffect } from 'react'
import { useCurrencyStore } from '../../store/currencyStore'
import { formatPrice, CURRENCIES } from '../../lib/currency'

interface PriceDisplayProps {
  amountCOP: number
  className?: string
}

// Clickable price — shows the other 2 currencies to switch to, whichever is active.
const PriceDisplay: React.FC<PriceDisplayProps> = ({ amountCOP, className }) => {
  const { currency, rates, setCurrency } = useCurrencyStore()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const otherCurrencies = CURRENCIES.filter((c) => c !== currency)

  return (
    <div className="relative inline-block" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={className}
        title="Ver en otra moneda"
      >
        {formatPrice(amountCOP, currency, rates)}
      </button>
      {open && (
        <div className="absolute left-0 top-full mt-1.5 bg-[#1f1d1d] border border-white/10 rounded-xl shadow-2xl z-50 py-1.5 min-w-[130px]">
          {otherCurrencies.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => { setCurrency(c); setOpen(false) }}
              className="w-full text-left px-3.5 py-2 text-xs text-white/70 hover:bg-white/10 hover:text-white transition-colors"
            >
              {formatPrice(amountCOP, c, rates)}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default PriceDisplay
