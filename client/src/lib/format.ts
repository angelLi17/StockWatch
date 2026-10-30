import type { AlertCondition } from '../types'

const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })

export function formatPrice(value: number): string {
  return currency.format(value)
}

export function formatPercent(value: number): string {
  return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`
}

// Finnhub reports market cap in millions of USD.
export function formatMarketCap(millions: number | null): string {
  if (!millions) return '—'
  if (millions >= 1_000_000) return `$${(millions / 1_000_000).toFixed(1)}T`
  if (millions >= 1_000) return `$${(millions / 1_000).toFixed(1)}B`
  return `$${millions.toFixed(0)}M`
}

export function describeCondition(condition: AlertCondition, value: number): string {
  switch (condition) {
    case 'above':
      return `Price above ${formatPrice(value)}`
    case 'below':
      return `Price below ${formatPrice(value)}`
    case 'percentUp':
      return `Price +${value}%`
    case 'percentDown':
      return `Price -${value}%`
  }
}
