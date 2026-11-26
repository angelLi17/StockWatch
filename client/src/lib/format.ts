import type { AlertCondition } from '../types'

const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })

// Finnhub occasionally omits a field, so formatters accept null and show a dash.
export function formatPrice(value: number | null | undefined): string {
  return value == null ? '—' : currency.format(value)
}

export function formatPercent(value: number | null | undefined): string {
  if (value == null) return '—'
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

// Sentiment scores run from -1 to +1 and are shown with a sign, e.g. +0.42.
export function formatScore(value: number | null | undefined): string {
  if (value == null) return '—'
  return `${value > 0 ? '+' : value < 0 ? '−' : ''}${Math.abs(value).toFixed(2)}`
}

export function scoreColor(value: number | null | undefined): string {
  if (value == null || value === 0) return 'text-muted'
  return value > 0 ? 'text-up' : 'text-danger'
}
