import axios from "axios";
import { config } from "../config.js";

// All Finnhub calls go through this server so the API key never reaches the browser.
const finnhub = axios.create({
  baseURL: "https://finnhub.io/api/v1",
  params: { token: config.finnhubApiKey },
  timeout: 10_000,
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
