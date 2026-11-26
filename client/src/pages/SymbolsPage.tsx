import { Fragment, useEffect, useState } from 'react'
import { HeadlineList, SentimentScore } from '../components/Sentiment'
import SymbolSearch from '../components/SymbolSearch'
import { DataTable, EmptyRow, ErrorMessage, RemoveButton, StockName } from '../components/ui'
import { api, getErrorMessage } from '../lib/api'
import { formatMarketCap, formatPercent, formatPrice } from '../lib/format'
import type { SearchResult, Sentiment, SymbolRow } from '../types'

const REFRESH_MS = 60_000
const SENTIMENT_REFRESH_MS = 10 * 60_000 // news changes slowly; the server caches it for an hour
const COLUMNS = ['Symbol', 'Price', 'Change', 'News Sentiment', 'Market Cap', 'P/E', 'Sector', '']

export default function SymbolsPage() {
  const [rows, setRows] = useState<SymbolRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [sentiment, setSentiment] = useState<Record<string, Sentiment>>({})
  const [expanded, setExpanded] = useState<string | null>(null)

  async function loadSentiment() {
    try {
      const { data } = await api.get<Sentiment[]>('/watchlist/sentiment')
      setSentiment(Object.fromEntries(data.map((s) => [s.ticker, s])))
    } catch {
      // Sentiment is extra information; the price table still works without it.
    }
  }

  async function loadSymbols() {
    try {
      const { data } = await api.get<SymbolRow[]>('/watchlist')
      setRows(data)
      setError('')
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  // Load once, then refresh prices every minute while the page is open.
  useEffect(() => {
    loadSymbols()
    const interval = setInterval(loadSymbols, REFRESH_MS)
    return () => clearInterval(interval)
  }, [])

  // Headlines load separately so prices show up right away.
  useEffect(() => {
    loadSentiment()
    const interval = setInterval(loadSentiment, SENTIMENT_REFRESH_MS)
    return () => clearInterval(interval)
  }, [])

  async function handleAdd(result: SearchResult) {
    try {
      await api.post('/watchlist', { ticker: result.ticker })
      await loadSymbols()
      loadSentiment()
    } catch (err) {
      setError(getErrorMessage(err))
    }
  }

  async function handleRemove(ticker: string) {
    setRows((prev) => prev.filter((row) => row.ticker !== ticker))
    try {
      await api.delete(`/watchlist/${ticker}`)
    } catch (err) {
      setError(getErrorMessage(err))
      loadSymbols()
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="mb-3 text-2xl font-medium">Add Symbols</h1>
        <SymbolSearch onSelect={handleAdd} className="max-w-sm" />
      </div>

      <ErrorMessage message={error} />

      <DataTable head={COLUMNS}>
        {loading ? (
          <EmptyRow colSpan={COLUMNS.length}>Loading…</EmptyRow>
        ) : rows.length === 0 ? (
          <EmptyRow colSpan={COLUMNS.length}>No symbols yet. Search above to add one.</EmptyRow>
        ) : (
          rows.map((row) => {
            const s = sentiment[row.ticker]
            const isOpen = expanded === row.ticker
            const canExpand = Boolean(s && !s.error && s.headlines.length > 0)
            return (
              <Fragment key={row.ticker}>
                <tr>
                  <td>
                    <StockName ticker={row.ticker} name={row.name} />
                  </td>
                  <td>{row.quote ? formatPrice(row.quote.price) : '—'}</td>
                  <td>{row.quote ? formatPercent(row.quote.percentChange) : '—'}</td>
                  <td>
                    <div className="flex items-center gap-3">
                      <SentimentScore sentiment={s} />
                      {canExpand && (
                        <button
                          onClick={() => setExpanded(isOpen ? null : row.ticker)}
                          aria-expanded={isOpen}
                          aria-label={`${isOpen ? 'Hide' : 'Show'} top headlines for ${row.ticker}`}
                          title="Top headlines"
                          className="rounded px-1.5 text-base text-muted hover:text-accent"
                        >
                          <span className={`inline-block transition-transform ${isOpen ? 'rotate-180' : ''}`}>▾</span>
                        </button>
                      )}
                    </div>
                  </td>
                  <td>{formatMarketCap(row.marketCap)}</td>
                  <td>{row.peRatio ? row.peRatio.toFixed(2) : '—'}</td>
                  <td>{row.industry || '—'}</td>
                  <td className="w-0 text-right">
                    <RemoveButton onClick={() => handleRemove(row.ticker)} label={`Remove ${row.ticker}`} />
                  </td>
                </tr>
                {isOpen && s && (
                  <tr className="bg-navy/40">
                    <td colSpan={COLUMNS.length}>
                      <p className="mb-2 text-sm font-medium tracking-wide text-muted uppercase">
                        Top headlines · last {s.windowDays} days
                      </p>
                      <HeadlineList headlines={s.headlines} />
                    </td>
                  </tr>
                )}
              </Fragment>
            )
          })
        )}
      </DataTable>

      <p className="text-xs text-dim">
        News sentiment scores Finnhub company headlines from the last 7 days on a −1 to +1 scale using a simple word list. Headlines
        with no sentiment words are counted but not averaged. Above +0.30 is Buy, below −0.30 is Sell, otherwise Hold. North American
        companies only; ETFs usually have no news. Not investment advice.
      </p>
    </div>
  )
}
