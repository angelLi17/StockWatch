import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { PastCasesNote, SentimentLevels, SignalPill } from '../components/Sentiment'
import { ErrorMessage, StockName } from '../components/ui'
import { api, getErrorMessage } from '../lib/api'
import { formatScore, scoreColor } from '../lib/format'
import type { Analysis, Rating, Sentiment } from '../types'

const HISTORY_POLL_MS = 20_000

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

  // Sentiment loads separately because the first visit has to fetch a year of news per symbol.
  // While any symbol is still loading its history, ask again every 20 seconds.
  const [sentiment, setSentiment] = useState<Record<string, Sentiment>>({})
  const stillLoading = Object.values(sentiment).some((s) => s.history?.status === 'loading')

  useEffect(() => {
    let cancelled = false
    const load = () =>
      api
        .get<Sentiment[]>('/watchlist/sentiment', { params: { history: 1 } })
        .then(({ data }) => {
          if (!cancelled) setSentiment(Object.fromEntries(data.map((s) => [s.ticker, s])))
        })
        .catch(() => {})
    load()
    const interval = stillLoading ? setInterval(load, HISTORY_POLL_MS) : undefined
    return () => {
      cancelled = true
      clearInterval(interval)
    }
  }, [stillLoading])

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
              <section key={rating} className="min-w-0 space-y-4">
                <h2 className="text-2xl font-medium">{title}</h2>
                {items.length === 0 && <p className="text-sm text-dim">None</p>}
                {items.map((a) => {
                  const s = sentiment[a.ticker]
                  return (
                    <article key={a.ticker} className="overflow-hidden rounded-xl border border-line">
                      <div className="flex items-start justify-between gap-4 bg-navy px-5 py-5 sm:px-7">
                        <StockName ticker={a.ticker} name={a.name} />
                        <SentimentBadge sentiment={s} />
                      </div>
                      <div className="space-y-5 px-5 pt-4 pb-8 sm:px-7">
                        <div>
                          <h3 className="mb-2 text-2xl font-light">Analysis</h3>
                          <p className="text-lg leading-snug font-light">{a.summary}</p>
                        </div>
                        {s && s.score !== null && !s.error && (
                          <div className="border-t border-line pt-4">
                            <h3 className="mb-2 text-2xl font-light">News Sentiment</h3>
                            <p className="mb-2 text-sm text-muted">
                              {formatScore(s.score)} from {s.scoredCount} of {s.articleCount} headlines in the last {s.windowDays}{' '}
                              days.
                            </p>
                            <PastCasesNote sentiment={s} />
                            <div className="mt-3">
                              <SentimentLevels sentiment={s} />
                            </div>
                          </div>
                        )}
                      </div>
                    </article>
                  )
                })}
              </section>
            )
          })}
        </div>
      )}

      <p className="text-xs text-dim">
        Buy / Hold / Sell columns are based on Wall Street analyst consensus from Finnhub. ETFs and unrated stocks are listed under
        Hold. The sentiment badge is separate: it scores the last week of news headlines from −1 to +1. Not investment advice.
      </p>
    </div>
  )
}

// Small "News +0.42 BUY" badge in the corner of each card.
function SentimentBadge({ sentiment }: { sentiment: Sentiment | undefined }) {
  if (!sentiment || sentiment.error) return null
  return (
    <div className="shrink-0 text-right">
      <div className="text-xs font-medium tracking-wide text-muted uppercase">News</div>
      {sentiment.score === null ? (
        <div className="text-sm text-muted">No signal</div>
      ) : (
        <div className="flex items-center gap-2">
          <span className={`text-lg font-bold tabular-nums ${scoreColor(sentiment.score)}`}>{formatScore(sentiment.score)}</span>
          <SignalPill signal={sentiment.signal} />
        </div>
      )}
    </div>
  )
}
