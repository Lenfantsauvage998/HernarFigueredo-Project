import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Currency, Rates } from '../lib/currency'
import { EU_COUNTRY_CODES } from '../lib/currency'

const RATES_TTL = 1000 * 60 * 60 * 24 // 24h

interface CurrencyState {
  currency: Currency
  userSet: boolean
  rates: Rates | null
  ratesUpdatedAt: number | null
  setCurrency: (c: Currency) => void
  ensureRates: () => Promise<void>
  autoDetect: () => Promise<void>
}

export const useCurrencyStore = create<CurrencyState>()(
  persist(
    (set, get) => ({
      currency: 'COP',
      userSet: false,
      rates: null,
      ratesUpdatedAt: null,

      setCurrency: (c) => set({ currency: c, userSet: true }),

      ensureRates: async () => {
        const { ratesUpdatedAt } = get()
        if (ratesUpdatedAt && Date.now() - ratesUpdatedAt < RATES_TTL) return
        try {
          const res = await fetch('https://open.er-api.com/v6/latest/COP')
          const json = await res.json()
          if (json?.rates?.USD && json?.rates?.EUR) {
            set({ rates: { USD: json.rates.USD, EUR: json.rates.EUR }, ratesUpdatedAt: Date.now() })
          }
        } catch {
          // Keep whatever rates we already have (or null → COP-only display)
        }
      },

      autoDetect: async () => {
        if (get().userSet) return
        try {
          const res = await fetch('https://ipapi.co/json/')
          const json = await res.json()
          const country = json?.country_code as string | undefined
          if (!country) return
          if (country === 'CO') set({ currency: 'COP' })
          else if (EU_COUNTRY_CODES.has(country)) set({ currency: 'EUR' })
          else set({ currency: 'USD' })
        } catch {
          // Keep default COP
        }
      },
    }),
    {
      name: 'hernan-currency-storage',
      partialize: (state) => ({ currency: state.currency, userSet: state.userSet, rates: state.rates, ratesUpdatedAt: state.ratesUpdatedAt }),
    }
  )
)
