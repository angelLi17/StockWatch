import { Router } from "express";
import { getQuote, searchSymbols } from "../services/finnhub.js";
import { getSymbolInfo } from "../services/symbolInfo.js";

export const symbolsRouter = Router();

// GET /api/symbols/search?q=apple
symbolsRouter.get("/search", async (req, res) => {
  const query = String(req.query.q ?? "").trim();
  if (!query) {
    res.json([]);
    return;
  }
  res.json(await searchSymbols(query));
});

// GET /api/symbols/AAPL → { info, quote }
symbolsRouter.get("/:ticker", async (req, res) => {
  const ticker = req.params.ticker.toUpperCase();
  const [info, quote] = await Promise.all([getSymbolInfo(ticker), getQuote(ticker)]);

  if (!info || !quote) {
    res.status(404).json({ error: `No data found for ${ticker}` });
    return;
  }
  res.json({ ticker, info, quote });
});
