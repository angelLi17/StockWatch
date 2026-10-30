// Shapes of the JSON returned by the Express API.

export interface Quote {
  price: number
  change: number
  percentChange: number
  high: number
  low: number
  open: number
  previousClose: number
}

export interface SearchResult {
  ticker: string
  description: string
  type: string
}

// One row of the Symbols table (GET /api/watchlist)
export interface SymbolRow {
  ticker: string
  name: string
  industry: string
  marketCap: number | null
  peRatio: number | null
  quote: Quote | null
}

export type Rating = 'buy' | 'hold' | 'sell'

// One card on the Watchlist page (GET /api/watchlist/analysis)
export interface Analysis {
  ticker: string
  name: string
  rating: Rating
  summary: string
}

export type AlertCondition = 'above' | 'below' | 'percentUp' | 'percentDown'

export interface PriceAlert {
  _id: string
  ticker: string
  name: string
  condition: AlertCondition
  value: number
  delivery: 'email' | 'app'
  status: 'active' | 'triggered'
  triggeredAt?: string
  triggeredPrice?: number
  createdAt: string
}
