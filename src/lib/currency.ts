export type Currency = 'COP' | 'USD' | 'EUR'

export interface Rates {
  USD: number // 1 COP in USD
  EUR: number // 1 COP in EUR
}

export const CURRENCIES: Currency[] = ['COP', 'USD', 'EUR']

export const CURRENCY_LABELS: Record<Currency, string> = {
  COP: 'COP — Peso colombiano',
  USD: 'USD — Dólar',
  EUR: 'EUR — Euro',
}

// Formats a COP amount for display in the given currency.
// The underlying charge always happens in COP — this is presentation only.
export function formatPrice(copAmount: number, currency: Currency, rates: Rates | null): string {
  if (currency === 'COP' || !rates) {
    return `$${Math.round(copAmount).toLocaleString('es-CO')} COP`
  }
  if (currency === 'USD') {
    const value = copAmount * rates.USD
    return `US$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }
  const value = copAmount * rates.EUR
  return `€${value.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

export const EU_COUNTRY_CODES = new Set([
  'AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR',
  'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL', 'PL', 'PT', 'RO', 'SK',
  'SI', 'ES', 'SE',
])
