import { SymbolCache } from "../models/SymbolCache.js";
import {
  getMetrics,
  getProfile,
  getRecommendation,
  type Metrics,
  type Profile,
  type Recommendation,
} from "./finnhub.js";

const ONE_DAY_MS = 24 * 60 * 60 * 1000;

export interface SymbolInfo extends Profile, Metrics {
  recommendation: Recommendation | null;
}

// Read a symbol's info from MongoDB, refreshing it from Finnhub if it's missing or older than a day.
// Returns null for tickers Finnhub doesn't recognize.
export async function getSymbolInfo(ticker: string): Promise<SymbolInfo | null> {
  const cached = await SymbolCache.findOne({ ticker }).lean();
  if (cached && Date.now() - cached.updatedAt.getTime() < ONE_DAY_MS) {
    const rec = cached.recommendation;
    return {
      ticker: cached.ticker,
      name: cached.name ?? "",
      exchange: cached.exchange ?? "",
      industry: cached.industry ?? "",
      logo: cached.logo ?? "",
      weburl: cached.weburl ?? "",
      marketCap: cached.marketCap ?? 0,
      peRatio: cached.peRatio ?? null,
      week52High: cached.week52High ?? null,
      week52Low: cached.week52Low ?? null,
      recommendation: rec?.period ? (rec as Recommendation) : null,
    };
  }

  const profile = await getProfile(ticker);
  if (!profile) return null;

  const [metrics, recommendation] = await Promise.all([getMetrics(ticker), getRecommendation(ticker)]);
  const info: SymbolInfo = { ...profile, ...metrics, recommendation };
  await SymbolCache.findOneAndUpdate({ ticker }, info, { upsert: true });
  return info;
}
