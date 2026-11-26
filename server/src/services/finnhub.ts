import axios from "axios";
import { config } from "../config.js";

// All Finnhub calls go through this server so the API key never reaches the browser.
const finnhub = axios.create({
  baseURL: "https://finnhub.io/api/v1",
  params: { token: config.finnhubApiKey },
  timeout: 10_000,
});

// The free plan allows 60 calls a minute. Loading a year of news takes a dozen calls per
// ticker, so queue requests to stay under the limit instead of failing with 429.
const CALLS_PER_MINUTE = 50;
const recentCalls: number[] = [];

async function waitForSlot(): Promise<void> {
  for (;;) {
    const now = Date.now();
    while (recentCalls.length > 0 && now - recentCalls[0]! >= 60_000) recentCalls.shift();
    if (recentCalls.length < CALLS_PER_MINUTE) {
      recentCalls.push(now);
      return;
    }
    await new Promise((resolve) => setTimeout(resolve, 60_000 - (now - recentCalls[0]!) + 50));
  }
}

finnhub.interceptors.request.use(async (request) => {
  await waitForSlot();
  return request;
});

export interface Quote {
  price: number;
  change: number;
  percentChange: number;
  high: number;
  low: number;
  open: number;
  previousClose: number;
}

export interface SearchResult {
  ticker: string;
  description: string;
  type: string;
}

export interface Profile {
  ticker: string;
  name: string;
  exchange: string;
  industry: string;
  logo: string;
  weburl: string;
  marketCap: number;
}

export interface Metrics {
  peRatio: number | null;
  week52High: number | null;
  week52Low: number | null;
}

// Analyst rating counts for the most recent month.
export interface Recommendation {
  strongBuy: number;
  buy: number;
  hold: number;
  sell: number;
  strongSell: number;
  period: string;
}

export async function searchSymbols(query: string): Promise<SearchResult[]> {
  const { data } = await finnhub.get("/search", { params: { q: query, exchange: "US" } });
  return (data.result ?? []).map((r: { symbol: string; description: string; type: string }) => ({
    ticker: r.symbol,
    description: r.description,
    type: r.type,
  }));
}

// Returns null when Finnhub doesn't know the ticker (it answers with all zeros).
export async function getQuote(ticker: string): Promise<Quote | null> {
  const { data } = await finnhub.get("/quote", { params: { symbol: ticker } });
  if (!data || (data.c === 0 && data.pc === 0)) return null;
  return {
    price: data.c,
    change: data.d,
    percentChange: data.dp,
    high: data.h,
    low: data.l,
    open: data.o,
    previousClose: data.pc,
  };
}

export async function getProfile(ticker: string): Promise<Profile | null> {
  const { data } = await finnhub.get("/stock/profile2", { params: { symbol: ticker } });
  if (!data?.ticker) return null;
  return {
    ticker: data.ticker,
    name: data.name,
    exchange: data.exchange,
    industry: data.finnhubIndustry,
    logo: data.logo,
    weburl: data.weburl,
    marketCap: data.marketCapitalization,
  };
}

export async function getMetrics(ticker: string): Promise<Metrics> {
  const { data } = await finnhub.get("/stock/metric", { params: { symbol: ticker, metric: "all" } });
  const m = data?.metric ?? {};
  return {
    peRatio: m.peTTM ?? m.peBasicExclExtraTTM ?? null,
    week52High: m["52WeekHigh"] ?? null,
    week52Low: m["52WeekLow"] ?? null,
  };
}

export async function getRecommendation(ticker: string): Promise<Recommendation | null> {
  const { data } = await finnhub.get("/stock/recommendation", { params: { symbol: ticker } });
  const latest = Array.isArray(data) ? data[0] : null; // newest month comes first
  if (!latest) return null;
  return {
    strongBuy: latest.strongBuy,
    buy: latest.buy,
    hold: latest.hold,
    sell: latest.sell,
    strongSell: latest.strongSell,
    period: latest.period,
  };
}

export interface NewsArticle {
  id: number;
  datetime: number; // unix seconds
  headline: string;
  source: string;
  url: string;
}

// Free endpoint: company news for North American companies, up to one year back.
// Dates are YYYY-MM-DD and inclusive.
export async function getCompanyNews(ticker: string, from: string, to: string): Promise<NewsArticle[]> {
  const { data } = await finnhub.get("/company-news", { params: { symbol: ticker, from, to } });
  if (!Array.isArray(data)) return [];
  return data
    .filter((a) => a && typeof a.headline === "string" && a.headline.trim() && typeof a.datetime === "number")
    .map((a) => ({
      id: Number(a.id),
      datetime: a.datetime,
      headline: a.headline.trim(),
      source: a.source ?? "",
      url: a.url ?? "",
    }));
}

export interface DailyBar {
  date: string; // YYYY-MM-DD
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

// Daily candles are a paid Finnhub feature; used only as a fallback when the free source fails.
export async function getDailyCandles(ticker: string, fromUnix: number, toUnix: number): Promise<DailyBar[]> {
  const { data } = await finnhub.get("/stock/candle", {
    params: { symbol: ticker, resolution: "D", from: fromUnix, to: toUnix },
  });
  if (data?.s !== "ok" || !Array.isArray(data.t)) return [];
  return data.t.map((t: number, i: number) => ({
    date: new Date(t * 1000).toISOString().slice(0, 10),
    open: data.o[i],
    high: data.h[i],
    low: data.l[i],
    close: data.c[i],
    volume: data.v[i],
  }));
}
