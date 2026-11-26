import { NewsCache } from "../models/NewsCache.js";
import { addDays, daysBetween, newsDay, today } from "./dates.js";
import { getCompanyNews, type NewsArticle } from "./finnhub.js";
import { round2, scoreHeadline } from "./sentimentLexicon.js";

export const CURRENT_WINDOW_DAYS = 7; // "current" sentiment = the last week of headlines
export const HISTORY_DAYS = 365; // Finnhub's free plan covers one year
const REFRESH_MS = 60 * 60 * 1000; // re-check for new articles at most once an hour
const CHUNK_DAYS = 30;

export interface ScoredArticle {
  id: number;
  t: number;
  s: number;
}

interface RecentArticle extends ScoredArticle {
  headline: string;
  source: string;
  url: string;
}

interface CacheDoc {
  ticker: string;
  coveredFrom?: string | null;
  coveredTo?: string | null;
  checkedAt?: Date | null;
  articles: ScoredArticle[];
  recent: RecentArticle[];
}

// ---- Fetching ---------------------------------------------------------------------------

// Finnhub may cap how many articles one call returns. If a busy window comes back without
// reaching its start date, split it in half and ask again.
async function fetchWindow(ticker: string, from: string, to: string, depth = 0): Promise<NewsArticle[]> {
  const articles = await getCompanyNews(ticker, from, to);
  const span = daysBetween(from, to);
  if (articles.length < 100 || depth >= 3 || span < 4) return articles;

  const earliest = Math.min(...articles.map((a) => a.datetime));
  const reachesStart = newsDay(earliest) <= addDays(from, 1);
  if (reachesStart) return articles;

  const mid = addDays(from, Math.floor(span / 2));
  const [older, newer] = [
    await fetchWindow(ticker, from, mid, depth + 1),
    await fetchWindow(ticker, addDays(mid, 1), to, depth + 1),
  ];
  return [...older, ...newer, ...articles];
}

async function fetchRange(ticker: string, from: string, to: string): Promise<NewsArticle[]> {
  const all: NewsArticle[] = [];
  for (let start = from; start <= to; start = addDays(start, CHUNK_DAYS)) {
    const end = addDays(start, CHUNK_DAYS - 1);
    all.push(...(await fetchWindow(ticker, start, end < to ? end : to)));
  }
  return all;
}

// ---- Merging into the cache ------------------------------------------------------------

// Writes for one ticker happen one at a time so two fetches can't overwrite each other.
const writeLocks = new Map<string, Promise<unknown>>();

function withLock<T>(ticker: string, fn: () => Promise<T>): Promise<T> {
  const previous = writeLocks.get(ticker) ?? Promise.resolve();
  const next = previous.catch(() => {}).then(fn);
  writeLocks.set(ticker, next);
  return next;
}

async function merge(ticker: string, from: string, to: string, fetched: NewsArticle[], markChecked: boolean) {
  return withLock(ticker, async () => {
    const doc = (await NewsCache.findOne({ ticker }).lean()) as CacheDoc | null;
    const oldest = Date.parse(`${addDays(today(), -HISTORY_DAYS - 30)}T00:00:00Z`) / 1000;
    const weekAgo = Date.now() / 1000 - (CURRENT_WINDOW_DAYS + 1) * 86400;

    const articles = new Map<number, ScoredArticle>();
    for (const a of doc?.articles ?? []) if (a.t >= oldest) articles.set(a.id, { id: a.id, t: a.t, s: a.s });

    const recent = new Map<number, RecentArticle>();
    for (const a of doc?.recent ?? []) if (a.t >= weekAgo) recent.set(a.id, a);

    for (const a of fetched) {
      const s = articles.get(a.id)?.s ?? scoreHeadline(a.headline);
      articles.set(a.id, { id: a.id, t: a.datetime, s });
      if (a.datetime >= weekAgo) {
        recent.set(a.id, { id: a.id, t: a.datetime, s, headline: a.headline, source: a.source, url: a.url });
      }
    }

    const update = {
      ticker,
      coveredFrom: doc?.coveredFrom && doc.coveredFrom < from ? doc.coveredFrom : from,
      coveredTo: doc?.coveredTo && doc.coveredTo > to ? doc.coveredTo : to,
      checkedAt: markChecked ? new Date() : (doc?.checkedAt ?? null),
      articles: [...articles.values()].sort((a, b) => a.t - b.t),
      recent: [...recent.values()].sort((a, b) => b.t - a.t).slice(0, 500),
    };
    await NewsCache.updateOne({ ticker }, { $set: update }, { upsert: true });
    return update as CacheDoc;
  });
}

// ---- Keeping the cache up to date ------------------------------------------------------

const inFlight = new Map<string, Promise<CacheDoc>>();

function once(key: string, fn: () => Promise<CacheDoc>): Promise<CacheDoc> {
  const running = inFlight.get(key);
  if (running) return running;
  const promise = fn().finally(() => inFlight.delete(key));
  inFlight.set(key, promise);
  return promise;
}

async function readCache(ticker: string): Promise<CacheDoc | null> {
  return (await NewsCache.findOne({ ticker }).lean()) as CacheDoc | null;
}

// The last week of news, refreshed at most once an hour. One Finnhub call in the usual case.
async function syncRecent(ticker: string): Promise<CacheDoc> {
  const doc = await readCache(ticker);
  if (doc?.checkedAt && Date.now() - new Date(doc.checkedAt).getTime() < REFRESH_MS) return doc;

  return once(`${ticker}:recent`, async () => {
    const to = today();
    const weekAgo = addDays(to, -CURRENT_WINDOW_DAYS);
    // If nobody has looked in a while, also fill the gap since the last fetch.
    const from = doc?.coveredTo && doc.coveredTo < weekAgo && doc.coveredFrom ? addDays(doc.coveredTo, -1) : weekAgo;
    const fetched = await fetchRange(ticker, from, to);
    return merge(ticker, from, to, fetched, true);
  });
}

function historyStart(): string {
  return addDays(today(), -HISTORY_DAYS);
}

export function hasFullHistory(doc: CacheDoc | null): boolean {
  return Boolean(doc?.coveredFrom && doc.coveredFrom <= addDays(historyStart(), 3));
}

// The full year of news. The first load for a ticker takes about a dozen Finnhub calls.
export async function syncHistory(ticker: string): Promise<CacheDoc> {
  const doc = await syncRecent(ticker);
  if (hasFullHistory(doc)) return doc;

  return once(`${ticker}:history`, async () => {
    const from = historyStart();
    const to = addDays(doc.coveredFrom ?? today(), -1);
    const fetched = to >= from ? await fetchRange(ticker, from, to) : [];
    return merge(ticker, from, to < from ? from : to, fetched, false);
  });
}

// Starts loading a ticker's year of news in the background (if needed) and says whether it's ready.
export async function historyReady(ticker: string): Promise<boolean> {
  if (hasFullHistory(await readCache(ticker))) return true;
  syncHistory(ticker).catch((err) => console.error(`[news] history for ${ticker} failed:`, err.message));
  return false;
}

// ---- Scores ------------------------------------------------------------------------------

export type SentimentSignal = "buy" | "hold" | "sell";

// Same thresholds as the backtester's default rule.
export const BUY_ABOVE = 0.3;
export const SELL_BELOW = -0.3;

export function signalFor(score: number | null): SentimentSignal | null {
  if (score === null) return null;
  if (score > BUY_ABOVE) return "buy";
  if (score < SELL_BELOW) return "sell";
  return "hold";
}

// Neutral headlines (no signal words, score 0) are counted but left out of the average,
// otherwise routine "XYZ to report earnings on Tuesday" stories would drown everything out.
export function averageScore(scores: number[]): number | null {
  const scored = scores.filter((s) => s !== 0);
  if (scored.length === 0) return null;
  return round2(scored.reduce((sum, s) => sum + s, 0) / scored.length);
}

export interface CurrentSentiment {
  ticker: string;
  score: number | null;
  signal: SentimentSignal | null;
  articleCount: number; // all headlines in the window
  scoredCount: number; // headlines that contained sentiment words
  windowDays: number;
  headlines: { headline: string; source: string; url: string; datetime: number; score: number }[];
}

export async function getCurrentSentiment(ticker: string): Promise<CurrentSentiment> {
  const doc = await syncRecent(ticker);
  const since = Date.now() / 1000 - CURRENT_WINDOW_DAYS * 86400;
  const recent = doc.recent.filter((a) => a.t >= since);
  const score = averageScore(recent.map((a) => a.s));

  // Top 3 = the headlines with the strongest opinion either way, newest first on ties.
  const headlines = recent
    .filter((a) => a.s !== 0)
    .sort((a, b) => Math.abs(b.s) - Math.abs(a.s) || b.t - a.t)
    .slice(0, 3)
    .map((a) => ({ headline: a.headline, source: a.source, url: a.url, datetime: a.t, score: a.s }));

  return {
    ticker,
    score,
    signal: signalFor(score),
    articleCount: recent.length,
    scoredCount: recent.filter((a) => a.s !== 0).length,
    windowDays: CURRENT_WINDOW_DAYS,
    headlines,
  };
}

// Sum and count of scored headlines per news day (see newsDay), for the past year.
export interface DailySentiment {
  sum: number;
  scored: number;
  total: number;
}

export async function getDailySentiment(ticker: string): Promise<Map<string, DailySentiment>> {
  const doc = await syncHistory(ticker);
  const days = new Map<string, DailySentiment>();
  for (const a of doc.articles) {
    const day = newsDay(a.t);
    const entry = days.get(day) ?? { sum: 0, scored: 0, total: 0 };
    entry.total += 1;
    if (a.s !== 0) {
      entry.sum += a.s;
      entry.scored += 1;
    }
    days.set(day, entry);
  }
  return days;
}

export async function newsCoverageStart(ticker: string): Promise<string | null> {
  return (await readCache(ticker))?.coveredFrom ?? null;
}
