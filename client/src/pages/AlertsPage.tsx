import { useEffect, useState } from 'react'
import AlertForm from '../components/AlertForm'
import SymbolSearch from '../components/SymbolSearch'
import { Card, DataTable, EmptyRow, ErrorMessage, RemoveButton, StockName } from '../components/ui'
import { api, getErrorMessage } from '../lib/api'
import { describeCondition, formatPrice } from '../lib/format'
import type { PriceAlert } from '../types'

const REFRESH_MS = 30_000

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<PriceAlert[]>([])
  const [myTickers, setMyTickers] = useState<string[]>([])
  const [selected, setSelected] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  async function loadAlerts() {
    try {
      const { data } = await api.get<PriceAlert[]>('/alerts')
      setAlerts(data)
      setError('')
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  // The server checks prices every minute; poll so newly triggered alerts show up.
  useEffect(() => {
    loadAlerts()
    const interval = setInterval(loadAlerts, REFRESH_MS)
    return () => clearInterval(interval)
  }, [])

  // Quick-pick chips: the tickers saved on the Symbols page.
  useEffect(() => {
    api
      .get<string[]>('/watchlist/tickers')
      .then(({ data }) => setMyTickers(data))
      .catch(() => {})
  }, [])

  async function handleDelete(id: string) {
    setAlerts((prev) => prev.filter((a) => a._id !== id))
    try {
      await api.delete(`/alerts/${id}`)
    } catch (err) {
      setError(getErrorMessage(err))
      loadAlerts()
    }
  }

  async function handleRearm(id: string) {
    try {
      const { data } = await api.patch<PriceAlert>(`/alerts/${id}`, { status: 'active' })
      setAlerts((prev) => prev.map((a) => (a._id === id ? data : a)))
    } catch (err) {
      setError(getErrorMessage(err))
    }
  }

  const triggeredCount = alerts.filter((a) => a.status === 'triggered').length

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end gap-x-10 gap-y-6">
        <Card className="w-full px-6 py-4 sm:w-80">
          <p className="text-xl font-medium">Triggered Alerts</p>
          <p className="mt-1 text-4xl font-bold">
            {triggeredCount}/{alerts.length}
          </p>
        </Card>

        <div className="flex flex-1 flex-wrap gap-x-7 gap-y-2 pb-2">
          {myTickers.map((ticker) => (
            <button
              key={ticker}
              onClick={() => setSelected(ticker)}
              className={`text-2xl font-medium transition-colors ${selected === ticker ? 'text-accent' : 'text-ink hover:text-accent'}`}
            >
              {ticker}
            </button>
          ))}
        </div>

        <div className="w-full sm:w-80">
          <h2 className="mb-3 text-xl font-medium">Add Alerts</h2>
          <SymbolSearch onSelect={(r) => setSelected(r.ticker)} />
        </div>
      </div>

      {selected && (
        <AlertForm
          key={selected}
          ticker={selected}
          onCreated={(alert) => {
            setAlerts((prev) => [alert, ...prev])
            setSelected(null)
          }}
          onCancel={() => setSelected(null)}
        />
      )}

      <ErrorMessage message={error} />

      <DataTable head={['Symbol', 'Alert Condition', 'Delivery', 'Status', '']}>
        {loading ? (
          <EmptyRow colSpan={5}>Loading…</EmptyRow>
        ) : alerts.length === 0 ? (
          <EmptyRow colSpan={5}>No alerts yet. Pick a symbol above to create one.</EmptyRow>
        ) : (
          alerts.map((a) => (
            <tr key={a._id}>
              <td>
                <StockName ticker={a.ticker} name={a.name} />
              </td>
              <td>{describeCondition(a.condition, a.value)}</td>
              <td>{a.delivery === 'email' ? 'Email' : 'In-app'}</td>
              <td>
                {a.status === 'triggered' ? (
                  <>
                    <div>Triggered</div>
                    {a.triggeredPrice != null && a.triggeredAt && (
                      <div className="text-sm font-normal text-muted">
                        at {formatPrice(a.triggeredPrice)}, {new Date(a.triggeredAt).toLocaleDateString()} ·{' '}
                        <button onClick={() => handleRearm(a._id)} className="text-accent hover:underline">
                          re-arm
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  'Not Triggered'
                )}
              </td>
              <td className="w-0 text-right">
                <RemoveButton onClick={() => handleDelete(a._id)} label={`Delete ${a.ticker} alert`} />
              </td>
            </tr>
          ))
        )}
      </DataTable>
    </div>
  )
}
