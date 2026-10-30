import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ErrorMessage, StockName } from '../components/ui'
import { api, getErrorMessage } from '../lib/api'
import type { Analysis, Rating } from '../types'

const COLUMNS: { rating: Rating; title: string }[] = [
  { rating: 'buy', title: 'Buy' },
  { rating: 'hold', title: 'Hold' },
  { rating: 'sell', title: 'Sell' },
]

export default function WatchlistPage() {
  const [analyses, setAnalyses] = useState<Analysis[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    api
      .get<Analysis[]>('/watchlist/analysis')
      .then(({ data }) => setAnalyses(data))
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <p className="text-muted">Loading…</p>

  return (
    <div className="space-y-6">
      <ErrorMessage message={error} />

      {analyses.length === 0 && !error ? (
        <p className="text-muted">
          Your watchlist is empty.{' '}
          <Link to="/symbols" className="text-accent hover:underline">
            Add symbols
          </Link>{' '}
          to see Buy, Hold, and Sell ratings.
        </p>
      ) : (
        <div className="grid gap-8 md:grid-cols-3">
          {COLUMNS.map(({ rating, title }) => {
            const items = analyses.filter((a) => a.rating === rating)
            return (
              <section key={rating} className="space-y-4">
                <h2 className="text-2xl font-medium">{title}</h2>
                {items.length === 0 && <p className="text-sm text-dim">None</p>}
                {items.map((a) => (
                  <article key={a.ticker} className="overflow-hidden rounded-xl border border-line">
                    <div className="bg-navy px-7 py-5">
                      <StockName ticker={a.ticker} name={a.name} />
                    </div>
                    <div className="px-7 pt-4 pb-8">
                      <h3 className="mb-2 text-2xl font-light">Analysis</h3>
                      <p className="text-lg leading-snug font-light">{a.summary}</p>
                    </div>
                  </article>
                ))}
              </section>
            )
          })}
        </div>
      )}

      <p className="text-xs text-dim">Ratings are based on Wall Street analyst consensus from Finnhub. ETFs and unrated stocks are listed under Hold. Not investment advice.</p>
    </div>
  )
}
