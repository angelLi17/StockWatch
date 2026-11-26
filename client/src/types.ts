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

// News sentiment from Finnhub company news headlines (GET /api/watchlist/sentiment)
export type SentimentSignal = 'buy' | 'hold' | 'sell'

export interface ScoredHeadline {
  headline: string
  source: string
  url: string
  datetime: number
  score: number
}

export interface PastMove {
  avgPct: number
  cases: number
  upCount: number
}

export interface SentimentBand {
  band: [number, number]
  oneDay: PastMove | null
  fiveDay: PastMove | null
}

export type SentimentHistory =
  | { status: 'loading' }
  | { status: 'unavailable' }
  | {
      status: 'ready'
      band: [number, number]
      oneDay: PastMove | null
      fiveDay: PastMove | null
      bands: SentimentBand[] // every sentiment level, most negative first
      baseline: { oneDay: PastMove | null; fiveDay: PastMove | null } // all days, any sentiment
      from: string
      to: string
    }

export interface Sentiment {
  ticker: string
  score: number | null
  signal: SentimentSignal | null
  articleCount: number
  scoredCount: number
  windowDays: number
  headlines: ScoredHeadline[]
  history?: SentimentHistory
  error?: string
}
