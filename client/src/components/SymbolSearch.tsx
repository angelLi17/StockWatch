import { useEffect, useState } from 'react'
import { api, getErrorMessage } from '../lib/api'
import type { SearchResult } from '../types'

interface Props {
  onSelect: (result: SearchResult) => void
  className?: string
}

// Search box with a dropdown of matching symbols, used on the Symbols and Alerts pages.
export default function SymbolSearch({ onSelect, className = '' }: Props) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Search 400ms after the user stops typing, so we don't call the API on every keystroke.
  useEffect(() => {
    const q = query.trim()
    if (!q) return

    let cancelled = false
    const timer = setTimeout(async () => {
      setLoading(true)
      setError('')
      try {
        const { data } = await api.get<SearchResult[]>('/symbols/search', { params: { q } })
        if (!cancelled) setResults(data.slice(0, 8))
      } catch (err) {
        if (!cancelled) setError(getErrorMessage(err))
      } finally {
        if (!cancelled) setLoading(false)
      }
    }, 400)

    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [query])

  function choose(result: SearchResult) {
    onSelect(result)
    setQuery('')
    setResults([])
  }

  const open = query.trim().length > 0

  return (
    <div className={`relative ${className}`}>
      <svg viewBox="0 0 24 24" className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 fill-none stroke-ink stroke-[3]" aria-hidden>
        <circle cx="10.5" cy="10.5" r="6.5" />
        <path d="m15.5 15.5 5 5" strokeLinecap="round" />
      </svg>
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && results[0]) choose(results[0])
          if (e.key === 'Escape') setQuery('')
        }}
        placeholder="Symbol or company"
        aria-label="Search symbol or company"
        className="w-full rounded-lg border border-line bg-transparent py-2.5 pr-4 pl-13 text-lg text-ink placeholder:text-dim focus:border-accent focus:outline-none"
      />

      {open && (
        <ul className="absolute z-20 mt-2 max-h-80 w-full min-w-72 overflow-y-auto rounded-lg border border-line bg-page shadow-2xl">
          {loading && <li className="px-4 py-3 text-sm text-muted">Searching…</li>}
          {error && <li className="px-4 py-3 text-sm text-danger">{error}</li>}
          {!loading && !error && results.length === 0 && <li className="px-4 py-3 text-sm text-muted">No matches</li>}
          {!loading &&
            results.map((r) => (
              <li key={r.ticker}>
                <button onClick={() => choose(r)} className="flex w-full items-baseline gap-3 px-4 py-2.5 text-left hover:bg-navy">
                  <span className="w-16 shrink-0 font-bold">{r.ticker}</span>
                  <span className="truncate text-sm font-light text-soft">{r.description}</span>
                </button>
              </li>
            ))}
        </ul>
      )}
    </div>
  )
}
