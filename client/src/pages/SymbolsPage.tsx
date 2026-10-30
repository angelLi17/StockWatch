import { useEffect, useState } from 'react'
import SymbolSearch from '../components/SymbolSearch'
import { DataTable, EmptyRow, ErrorMessage, RemoveButton, StockName } from '../components/ui'
import { api, getErrorMessage } from '../lib/api'
import { formatMarketCap, formatPercent, formatPrice } from '../lib/format'
import type { SearchResult, SymbolRow } from '../types'

const REFRESH_MS = 60_000

export default function SymbolsPage() {
  const [rows, setRows] = useState<SymbolRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

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

  async function handleAdd(result: SearchResult) {
    try {
      await api.post('/watchlist', { ticker: result.ticker })
      await loadSymbols()
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

      <DataTable head={['Symbol', 'Price', 'Change', 'Market Cap', 'P/E', 'Sector', '']}>
        {loading ? (
          <EmptyRow colSpan={7}>Loading…</EmptyRow>
        ) : rows.length === 0 ? (
          <EmptyRow colSpan={7}>No symbols yet. Search above to add one.</EmptyRow>
        ) : (
          rows.map((row) => (
            <tr key={row.ticker}>
              <td>
                <StockName ticker={row.ticker} name={row.name} />
              </td>
              <td>{row.quote ? formatPrice(row.quote.price) : '—'}</td>
              <td>{row.quote ? formatPercent(row.quote.percentChange) : '—'}</td>
              <td>{formatMarketCap(row.marketCap)}</td>
              <td>{row.peRatio ? row.peRatio.toFixed(2) : '—'}</td>
              <td>{row.industry || '—'}</td>
              <td className="w-0 text-right">
                <RemoveButton onClick={() => handleRemove(row.ticker)} label={`Remove ${row.ticker}`} />
              </td>
            </tr>
          ))
        )}
      </DataTable>
    </div>
  )
}
