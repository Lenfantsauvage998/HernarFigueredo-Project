import React, { useState, useRef, useEffect } from 'react'
import { useCurrencyStore } from '../../store/currencyStore'
import { formatPrice, CURRENCIES } from '../../lib/currency'

interface PriceDisplayProps {
  amountCOP: number
  className?: string // size/weight only — color is decided internally by currency
}

const DARK_YELLOW = '#b8952f'

// Clickable price — shows the other 2 currencies to switch to, whichever is active.
// USD/EUR render in dark yellow to signal "converted" pricing; COP keeps the caller's color.
const PriceDisplay: React.FC<PriceDisplayProps> = ({ amountCOP, className = '' }) => {
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
        className={`${className} transition-colors`}
        style={{ color: currency === 'COP' ? undefined : DARK_YELLOW }}
        title="Ver en otra moneda"
      >
        {formatPrice(amountCOP, currency, rates)}
      </button>
      {open && (
        <div className="absolute left-0 top-full mt-2 bg-[#1f1d1d] border border-white/10 rounded-xl shadow-2xl z-50 py-1 min-w-[140px] divide-y divide-white/[0.06] overflow-hidden">
          {otherCurrencies.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => { setCurrency(c); setOpen(false) }}
              className="w-full text-left px-4 py-2.5 text-xs font-medium hover:bg-white/[0.06] transition-colors"
              style={{ color: c === 'COP' ? 'rgba(255,255,255,0.7)' : DARK_YELLOW }}
            >
              <span
                style={{
                  display: 'inline-block',
                  transform: c === 'COP' ? 'scale(0.85)' : undefined,
                  transformOrigin: 'left center',
                }}
              >
                {formatPrice(amountCOP, c, rates)}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default PriceDisplay
