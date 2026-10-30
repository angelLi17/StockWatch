import { Schema, model } from "mongoose";

// Company info, valuation metrics, and analyst ratings change slowly, so we cache
// them for a day to save Finnhub API calls. Shared by all users (no uid).
const symbolCacheSchema = new Schema(
  {
    ticker: { type: String, required: true, unique: true, uppercase: true },
    name: String,
    exchange: String,
    industry: String,
    logo: String,
    weburl: String,
    marketCap: Number,
    peRatio: Number,
    week52High: Number,
    week52Low: Number,
    recommendation: {
      strongBuy: Number,
      buy: Number,
      hold: Number,
      sell: Number,
      strongSell: Number,
      period: String,
    },
  },
  { timestamps: true },
);

export const SymbolCache = model("SymbolCache", symbolCacheSchema);
