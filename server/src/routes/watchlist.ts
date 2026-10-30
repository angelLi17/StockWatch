import { Router } from "express";
import { z } from "zod";
import { WatchlistItem } from "../models/WatchlistItem.js";
import { rate, summarize } from "../services/analysis.js";
import { getQuote } from "../services/finnhub.js";
import { getSymbolInfo } from "../services/symbolInfo.js";

// The user's tracked symbols. The Symbols page shows them as a price table,
// and the Watchlist page shows them grouped into Buy / Hold / Sell.
export const watchlistRouter = Router();

const addSchema = z.object({
  ticker: z.string().trim().min(1).max(10).toUpperCase(),
});

async function userTickers(uid: string | undefined): Promise<string[]> {
  const items = await WatchlistItem.find({ uid }).sort({ createdAt: 1 }).lean();
  return items.map((item) => item.ticker);
}

// GET /api/watchlist → tickers with live quotes and company stats
watchlistRouter.get("/", async (req, res) => {
  const tickers = await userTickers(req.uid);

  const rows = await Promise.all(
    tickers.map(async (ticker) => {
      const [quote, info] = await Promise.all([getQuote(ticker), getSymbolInfo(ticker)]);
      return {
        ticker,
        name: info?.name ?? "",
        industry: info?.industry ?? "",
        marketCap: info?.marketCap ?? null,
        peRatio: info?.peRatio ?? null,
        quote,
      };
    }),
  );

  res.json(rows);
});

// GET /api/watchlist/tickers → just the ticker strings (cheap, no API calls)
watchlistRouter.get("/tickers", async (req, res) => {
  res.json(await userTickers(req.uid));
});

// GET /api/watchlist/analysis → a Buy/Hold/Sell rating and summary for each ticker
watchlistRouter.get("/analysis", async (req, res) => {
  const tickers = await userTickers(req.uid);

  const results = await Promise.all(
    tickers.map(async (ticker) => {
      const [quote, info] = await Promise.all([getQuote(ticker), getSymbolInfo(ticker)]);
      if (!info) return null;
      return {
        ticker,
        name: info.name,
        rating: rate(info),
        summary: summarize(info, quote),
      };
    }),
  );

  res.json(results.filter((r) => r !== null));
});

// POST /api/watchlist  { ticker: "AAPL" }
watchlistRouter.post("/", async (req, res) => {
  const parsed = addSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "A ticker is required" });
    return;
  }

  const { ticker } = parsed.data;
  if (await WatchlistItem.exists({ uid: req.uid, ticker })) {
    res.status(409).json({ error: `${ticker} is already in your symbols` });
    return;
  }
  if (!(await getSymbolInfo(ticker))) {
    res.status(404).json({ error: `Unknown symbol ${ticker}` });
    return;
  }

  const item = await WatchlistItem.create({ uid: req.uid, ticker });
  res.status(201).json(item);
});

// DELETE /api/watchlist/AAPL
watchlistRouter.delete("/:ticker", async (req, res) => {
  await WatchlistItem.deleteOne({ uid: req.uid, ticker: req.params.ticker.toUpperCase() });
  res.status(204).end();
});
