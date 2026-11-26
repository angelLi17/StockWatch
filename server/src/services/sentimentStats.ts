import { addDays } from "./dates.js";
import { CURRENT_WINDOW_DAYS, type DailySentiment } from "./news.js";
import type { DailyBar } from "./prices.js";
import { round2 } from "./sentimentLexicon.js";

// Sentiment bands used to find "similar" days in the past.
const BAND_EDGES = [-1, -0.5, -0.3, -0.1, 0.1, 0.3, 0.5, 1];
const MIN_HEADLINES = 3; // a day needs at least this many scored headlines in its window to count

export function bandFor(score: number): [number, number] {
  for (let i = 0; i < BAND_EDGES.length - 1; i++) {
    if (score < BAND_EDGES[i + 1]! || i === BAND_EDGES.length - 2) return [BAND_EDGES[i]!, BAND_EDGES[i + 1]!];
  }
  return [-1, 1];
}

// The same 7-day average the Symbols page shows, as it would have looked on `date`.
export function rollingSentiment(days: Map<string, DailySentiment>, date: string): { score: number; scored: number } | null {
  let sum = 0;
  let scored = 0;
  for (let i = 0; i < CURRENT_WINDOW_DAYS; i++) {
    const d = days.get(addDays(date, -i));
    if (d) {
      sum += d.sum;
      scored += d.scored;
    }
  }
  return scored >= MIN_HEADLINES ? { score: sum / scored, scored } : null;
}

export interface MoveStats {
  avgPct: number;
  cases: number;
  upCount: number;
}

export interface BandStats {
  band: [number, number];
  // Average % move from that day's close to the close 1 and 5 trading days later.
  oneDay: MoveStats | null;
  fiveDay: MoveStats | null;
}

export interface PastCases extends BandStats {
  bands: BandStats[]; // every sentiment level, most negative first
  baseline: Omit<BandStats, "band">; // every trading day, whatever the sentiment ("a typical day")
  from: string; // first day considered
  to: string; // last day considered
}

function summarize(returns: number[]): MoveStats | null {
  if (returns.length === 0) return null;
  const avg = returns.reduce((s, r) => s + r, 0) / returns.length;
  return { avgPct: round2(avg * 100), cases: returns.length, upCount: returns.filter((r) => r > 0).length };
}

function inBand(score: number, band: [number, number]): boolean {
  return score >= band[0] && (score < band[1] || band[1] === 1);
}

// "When sentiment was between X and Y before, price moved +Z% on average over the next 1 / 5 days."
// Each trading day in the past year whose 7-day sentiment fell in a band is one case for that band.
// Neighbouring days overlap (they share most headlines), so cases aren't independent.
export function pastCases(days: Map<string, DailySentiment>, bars: DailyBar[], score: number, since: string): PastCases {
  const bands = BAND_EDGES.slice(0, -1).map((lo, i) => ({ band: [lo, BAND_EDGES[i + 1]!] as [number, number], one: [] as number[], five: [] as number[] }));
  const allOne: number[] = [];
  const allFive: number[] = [];
  let first = "";
  let last = "";

  bars.forEach((bar, i) => {
    if (bar.date < since) return;
    const one = bars[i + 1] ? bars[i + 1]!.close / bar.close - 1 : null;
    const five = bars[i + 5] ? bars[i + 5]!.close / bar.close - 1 : null;
    if (one !== null) allOne.push(one);
    if (five !== null) allFive.push(five);

    const s = rollingSentiment(days, bar.date);
    if (!s) return;
    if (!first) first = bar.date;
    last = bar.date;
    const bucket = bands.find((b) => inBand(s.score, b.band))!;
    if (one !== null) bucket.one.push(one);
    if (five !== null) bucket.five.push(five);
  });

  const stats = bands.map((b) => ({ band: b.band, oneDay: summarize(b.one), fiveDay: summarize(b.five) }));
  const current = stats.find((b) => inBand(score, b.band))!;
  return {
    ...current,
    bands: stats,
    baseline: { oneDay: summarize(allOne), fiveDay: summarize(allFive) },
    from: first,
    to: last,
  };
}
