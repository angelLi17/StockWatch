import { Schema, model } from "mongoose";

// Daily price history per ticker (split/dividend adjusted), shared by all users.
// Refreshed a few times a day; used by the sentiment stats and the backtester.
const priceCacheSchema = new Schema(
  {
    ticker: { type: String, required: true, unique: true, uppercase: true },
    bars: [{ _id: false, date: String, open: Number, high: Number, low: Number, close: Number, volume: Number }],
  },
  { timestamps: true },
);

export const PriceCache = model("PriceCache", priceCacheSchema);
