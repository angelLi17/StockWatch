import { isAxiosError } from "axios";
import cors from "cors";
import express, { type NextFunction, type Request, type Response } from "express";
import mongoose from "mongoose";
import { config } from "./config.js";
import { startAlertChecker } from "./jobs/alertChecker.js";
import { requireAuth } from "./middleware/requireAuth.js";
import { alertsRouter } from "./routes/alerts.js";
import { symbolsRouter } from "./routes/symbols.js";
import { watchlistRouter } from "./routes/watchlist.js";

const app = express();

app.use(cors({ origin: config.clientOrigin }));
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

// Public: anyone can browse symbols.
app.use("/api/symbols", symbolsRouter);

// Private: each user only sees their own data.
app.use("/api/watchlist", requireAuth, watchlistRouter);
app.use("/api/alerts", requireAuth, alertsRouter);

// Express 5 forwards errors thrown in async routes here.
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  if (isAxiosError(err) && err.response?.status === 429) {
    res.status(429).json({ error: "Stock data rate limit reached. Try again in a minute." });
    return;
  }
  console.error(err);
  res.status(500).json({ error: "Something went wrong" });
});

await mongoose.connect(config.mongoUri);
console.log("Connected to MongoDB");

startAlertChecker();

app.listen(config.port, () => {
  console.log(`API listening on http://localhost:${config.port}`);
});
