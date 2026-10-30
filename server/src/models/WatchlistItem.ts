import { Schema, model } from "mongoose";

const watchlistItemSchema = new Schema(
  {
    uid: { type: String, required: true, index: true },
    ticker: { type: String, required: true, uppercase: true, trim: true },
  },
  { timestamps: true },
);

// A user can only add each ticker to their watchlist once.
watchlistItemSchema.index({ uid: 1, ticker: 1 }, { unique: true });

export const WatchlistItem = model("WatchlistItem", watchlistItemSchema);
