import { Schema, model } from "mongoose";

// Scored company news per ticker, shared by all users. Finnhub's free plan gives one year of
// news, which takes a dozen API calls per ticker to load, so we keep it here and only fetch
// what's new on later visits.
const newsCacheSchema = new Schema(
  {
    ticker: { type: String, required: true, unique: true, uppercase: true },
    coveredFrom: String, // YYYY-MM-DD: earliest day of news we've fetched
    coveredTo: String, // YYYY-MM-DD: latest day of news we've fetched
    checkedAt: Date, // last time we asked Finnhub for the latest news
    // Every article from the past year, slimmed down to what the math needs.
    articles: [{ _id: false, id: Number, t: Number, s: Number }], // t = unix seconds, s = headline score
    // Full details for the last week, shown as "top headlines".
    recent: [{ _id: false, id: Number, t: Number, s: Number, headline: String, source: String, url: String }],
  },
  { timestamps: true },
);

export const NewsCache = model("NewsCache", newsCacheSchema);
