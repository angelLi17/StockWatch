import { formatPercent, formatScore, scoreColor } from '../lib/format'
import { useState } from 'react'
import type { PastMove, ScoredHeadline, Sentiment, SentimentBand, SentimentSignal } from '../types'

// Building blocks for showing news sentiment on the Symbols and Watchlist pages.

const SIGNAL_STYLES: Record<SentimentSignal, string> = {
  buy: 'border-up/50 text-up',
  hold: 'border-line text-muted',
  sell: 'border-danger/50 text-danger',
}

export function SignalPill({ signal }: { signal: SentimentSignal | null }) {
  if (!signal) return null
  return (
    <span className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-medium tracking-wide uppercase ${SIGNAL_STYLES[signal]}`}>
      {signal}
    </span>
  )
}

// "+0.42  BUY" with "12 of 40 headlines" underneath.
export function SentimentScore({ sentiment }: { sentiment: Sentiment | undefined }) {
  if (!sentiment) return <span className="text-base font-normal text-dim">Loading…</span>
  if (sentiment.error) return <span className="text-base font-normal text-muted">{sentiment.error}</span>
  if (sentiment.score === null) {
    return (
      <span className="text-base font-normal text-muted">
        {sentiment.articleCount === 0 ? 'No recent news' : `No signal in ${sentiment.articleCount} headlines`}
      </span>
    )
  }
  return (
    <div>
      <div className="flex items-center gap-2.5">
        <span className={`tabular-nums ${scoreColor(sentiment.score)}`}>{formatScore(sentiment.score)}</span>
        <SignalPill signal={sentiment.signal} />
      </div>
      <div className="text-sm font-normal text-muted">
        {sentiment.scoredCount} of {sentiment.articleCount} headlines
      </div>
    </div>
  )
}

export function HeadlineList({ headlines }: { headlines: ScoredHeadline[] }) {
  if (headlines.length === 0) return <p className="text-sm text-muted">No headlines with sentiment words this week.</p>
  return (
    <ol className="space-y-2">
      {headlines.map((h) => (
        <li key={h.url || h.headline} className="flex items-baseline gap-3 text-base font-normal">
          <span className={`w-12 shrink-0 text-right tabular-nums ${scoreColor(h.score)}`}>{formatScore(h.score)}</span>
          <span className="min-w-0">
            {h.url ? (
              <a href={h.url} target="_blank" rel="noreferrer" className="hover:text-accent hover:underline">
                {h.headline}
              </a>
            ) : (
              h.headline
            )}
            <span className="ml-2 text-sm text-muted">
              {h.source} · {new Date(h.datetime * 1000).toLocaleDateString()}
            </span>
          </span>
        </li>
      ))}
    </ol>
  )
}

function describeMove(move: PastMove, days: string) {
  return (
    <>
      <span className={`font-medium ${move.avgPct >= 0 ? 'text-up' : 'text-danger'}`}>{formatPercent(move.avgPct)}</span> over the
      next {days} ({move.upCount} of {move.cases} up)
    </>
  )
}

// "When sentiment was between +0.30 and +0.50 before, the price moved +x% on average…"
export function PastCasesNote({ sentiment }: { sentiment: Sentiment }) {
  const history = sentiment.history
  if (!history || sentiment.score === null || history.status === 'unavailable') return null
  if (history.status === 'loading') {
    return <p className="text-sm text-muted">Collecting a year of news to compare with past days…</p>
  }

  const { band, oneDay, fiveDay } = history
  if (!oneDay || oneDay.cases < 3) {
    return (
      <p className="text-sm text-muted">
        Sentiment has rarely been between {formatScore(band[0])} and {formatScore(band[1])} in the past year (
        {oneDay?.cases ?? 0} days), too few to compare.
      </p>
    )
  }

  return (
    <div className="space-y-1">
      <p className="text-base leading-snug font-light">
        When sentiment was between {formatScore(band[0])} and {formatScore(band[1])} before, the price moved{' '}
        {describeMove(oneDay, '1 day')}
        {fiveDay && <> and {describeMove(fiveDay, '5 days')}</>} on average, based on {oneDay.cases} past trading days.
      </p>
      <p className="text-xs text-dim">
        Average of past moves since {new Date(`${history.from}T00:00:00`).toLocaleDateString()}, not a prediction. Nearby days share
        headlines, so cases overlap.
      </p>
    </div>
  )
}

const MIN_CASES = 3

function MoveCell({ move }: { move: PastMove | null }) {
  if (!move || move.cases < MIN_CASES) return <span className="text-dim">—</span>
  return <span className={`tabular-nums ${move.avgPct >= 0 ? 'text-up' : 'text-danger'}`}>{formatPercent(move.avgPct)}</span>
}

// Bar showing how much better or worse the 5-day move was than a typical day, centred on zero.
function VsTypicalBar({ value, scale }: { value: number | null; scale: number }) {
  if (value === null) return <div className="text-right text-dim">—</div>
  const width = Math.min(50, (Math.abs(value) / scale) * 50)
  return (
    <div className="flex items-center justify-end gap-1.5">
      <div className="relative hidden h-2 w-10 shrink-0 rounded-full bg-line/60 sm:block" aria-hidden>
        <div className="absolute top-0 left-1/2 h-2 w-px bg-muted" />
        <div
          className={`absolute top-0 h-2 ${value >= 0 ? 'left-1/2 rounded-r-full bg-up' : 'right-1/2 rounded-l-full bg-danger'}`}
          style={{ width: `${width}%` }}
        />
      </div>
      <span className={`tabular-nums ${value >= 0 ? 'text-up' : 'text-danger'}`}>
        {value >= 0 ? '+' : '−'}
        {Math.abs(value).toFixed(2)}
      </span>
    </div>
  )
}

// Band edges are all one decimal, so "+0.3 to +0.5" keeps the table narrow enough for phones.
function bandLabel([lo, hi]: [number, number]) {
  const short = (n: number) => `${n > 0 ? '+' : n < 0 ? '−' : ''}${Math.abs(n).toFixed(1)}`
  return `${short(lo)} to ${short(hi)}`
}

// Table of the average move after every sentiment level, so the current level can be compared
// with the others and with a typical day. Most positive level on top.
export function SentimentLevels({ sentiment }: { sentiment: Sentiment }) {
  const [open, setOpen] = useState(false)
  const history = sentiment.history
  if (!history || history.status !== 'ready' || !history.bands) return null

  const typical5 = history.baseline.fiveDay
  const rows = [...history.bands].reverse()
  const excess = (b: SentimentBand) =>
    b.fiveDay && b.fiveDay.cases >= MIN_CASES && typical5 ? b.fiveDay.avgPct - typical5.avgPct : null
  const scale = Math.max(0.5, ...rows.map((b) => Math.abs(excess(b) ?? 0)))
  const isCurrent = (b: SentimentBand) => b.band[0] === history.band[0]

  return (
    <div>
      <button onClick={() => setOpen(!open)} aria-expanded={open} className="text-sm text-accent hover:underline">
        {open ? 'Hide' : 'Compare'} all sentiment levels <span className={`inline-block transition-transform ${open ? 'rotate-180' : ''}`}>▾</span>
      </button>

      {open && (
        <div className="mt-3 space-y-2">
          <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-xs tracking-wide text-muted uppercase">
              <tr>
                <th className="py-1.5 pr-2 font-medium">Sentiment</th>
                <th className="py-1.5 pr-2 text-right font-medium">1 day</th>
                <th className="py-1.5 pr-2 text-right font-medium">5 days</th>
                <th className="py-1.5 pl-1 text-right font-medium">vs typical</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {rows.map((b) => (
                <tr key={b.band[0]} className={isCurrent(b) ? 'bg-navy font-medium' : ''}>
                  <td className="py-1.5 pr-2">
                    <span className="whitespace-nowrap">{bandLabel(b.band)}</span>
                    {isCurrent(b) && <span className="ml-1.5 text-xs text-accent">now</span>}
                    <div className="text-xs font-normal text-dim">{b.oneDay?.cases ?? 0} days</div>
                  </td>
                  <td className="py-1.5 pr-2 text-right">
                    <MoveCell move={b.oneDay} />
                  </td>
                  <td className="py-1.5 pr-2 text-right">
                    <MoveCell move={b.fiveDay} />
                  </td>
                  <td className="py-1.5 pl-1">
                    <VsTypicalBar value={excess(b)} scale={scale} />
                  </td>
                </tr>
              ))}
              <tr className="text-muted">
                <td className="py-1.5 pr-2">
                  Typical day
                  <div className="text-xs text-dim">{history.baseline.oneDay?.cases ?? 0} days, any sentiment</div>
                </td>
                <td className="py-1.5 pr-2 text-right">
                  <MoveCell move={history.baseline.oneDay} />
                </td>
                <td className="py-1.5 pr-2 text-right">
                  <MoveCell move={typical5} />
                </td>
                <td className="py-1.5 pl-1 text-right text-dim">baseline</td>
              </tr>
            </tbody>
          </table>
          </div>
          <p className="text-xs text-dim">
            Average move after past trading days at each 7-day sentiment level. "vs typical" is how many percentage points better
            or worse the 5-day move was than an average day. Levels with fewer than {MIN_CASES} days show —. Past averages, not a
            prediction.
          </p>
        </div>
      )}
    </div>
  )
}
