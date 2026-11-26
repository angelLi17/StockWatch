import axios from "axios";
import { PriceCache } from "../models/PriceCache.js";
import { getDailyCandles, type DailyBar } from "./finnhub.js";

export type { DailyBar };

const REFRESH_MS = 6 * 60 * 60 * 1000;
const YEARS = 5;

// Finnhub's daily candles need a paid plan, so price history comes from Yahoo Finance's
// public chart endpoint (no API key). Prices are adjusted for splits and dividends so
// returns across a split are correct.
async function fetchFromYahoo(ticker: string): Promise<DailyBar[]> {
  const { data } = await axios.get(`https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(ticker)}`, {
    params: { range: `${YEARS}y`, interval: "1d", includeAdjustedClose: true },
    headers: { "User-Agent": "Mozilla/5.0 (StockWatch class project)" },
    timeout: 15_000,
  });

  const result = data?.chart?.result?.[0];
  const times: number[] = result?.timestamp ?? [];
  const q = result?.indicators?.quote?.[0] ?? {};
  const adj: (number | null)[] = result?.indicators?.adjclose?.[0]?.adjclose ?? [];
  const offset: number = result?.meta?.gmtoffset ?? 0;

  const bars: DailyBar[] = [];
  times.forEach((t, i) => {
    const [open, high, low, close, volume] = [q.open?.[i], q.high?.[i], q.low?.[i], q.close?.[i], q.volume?.[i]];
    if (open == null || high == null || low == null || close == null || !close) return;
    const factor = adj[i] != null ? adj[i]! / close : 1;
    bars.push({
      date: new Date((t + offset) * 1000).toISOString().slice(0, 10),
      open: open * factor,
      high: high * factor,
      low: low * factor,
      close: close * factor,
      volume: volume ?? 0,
    });
  });
  return bars;
}

async function fetchBars(ticker: string): Promise<DailyBar[]> {
  try {
    const bars = await fetchFromYahoo(ticker);
    if (bars.length > 0) return bars;
  } catch (err) {
    console.warn(`[prices] Yahoo history for ${ticker} failed, trying Finnhub:`, (err as Error).message);
  }
  const now = Math.floor(Date.now() / 1000);
  return getDailyCandles(ticker, now - YEARS * 365 * 86400, now).catch(() => []);
}

const inFlight = new Map<string, Promise<DailyBar[]>>();

// Oldest first. Empty if no history is available for the ticker.
export async function getDailyBars(ticker: string): Promise<DailyBar[]> {
  const cached = await PriceCache.findOne({ ticker }).lean();
  if (cached && Date.now() - cached.updatedAt.getTime() < REFRESH_MS && cached.bars.length > 0) {
    return cached.bars as DailyBar[];
  }

  const running = inFlight.get(ticker);
  if (running) return running;

  const promise = (async () => {
    const bars = await fetchBars(ticker);
    // Keep serving the old copy if the refresh failed.
    if (bars.length === 0) return (cached?.bars as DailyBar[] | undefined) ?? [];
    // Collapse any duplicate dates (e.g. a live bar for today) to the last one.
    const byDate = new Map(bars.map((b) => [b.date, b]));
    const clean = [...byDate.values()].sort((a, b) => (a.date < b.date ? -1 : 1));
    await PriceCache.updateOne({ ticker }, { $set: { ticker, bars: clean } }, { upsert: true });
    return clean;
  })().finally(() => inFlight.delete(ticker));

  inFlight.set(ticker, promise);
  return promise;
}
