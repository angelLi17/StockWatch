import { Router } from "express";
import { isValidObjectId } from "mongoose";
import { z } from "zod";
import { ALERT_CONDITIONS, Alert } from "../models/Alert.js";
import { emailEnabled } from "../services/mailer.js";
import { getSymbolInfo } from "../services/symbolInfo.js";

export const alertsRouter = Router();

const createSchema = z.object({
  ticker: z.string().trim().min(1).max(10).toUpperCase(),
  condition: z.enum(ALERT_CONDITIONS),
  value: z.number().positive(),
});

const updateSchema = createSchema.partial().extend({
  status: z.literal("active").optional(), // lets the user re-arm a triggered alert
});

// GET /api/alerts → the user's alerts, each with the company name
alertsRouter.get("/", async (req, res) => {
  const alerts = await Alert.find({ uid: req.uid }).sort({ createdAt: -1 }).lean();

  const tickers = [...new Set(alerts.map((a) => a.ticker))];
  const infos = await Promise.all(tickers.map((t) => getSymbolInfo(t).catch(() => null)));
  const names = new Map(tickers.map((t, i) => [t, infos[i]?.name ?? ""]));

  res.json(alerts.map((a) => ({ ...a, name: names.get(a.ticker) })));
});

// POST /api/alerts  { ticker, condition, value }
alertsRouter.post("/", async (req, res) => {
  const parsed = createSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Ticker, a condition, and a positive value are required" });
    return;
  }

  const info = await getSymbolInfo(parsed.data.ticker);
  if (!info) {
    res.status(404).json({ error: `Unknown symbol ${parsed.data.ticker}` });
    return;
  }

  const delivery = emailEnabled && req.email ? "email" : "app";
  const alert = await Alert.create({ uid: req.uid, email: req.email, delivery, ...parsed.data });
  res.status(201).json({ ...alert.toObject(), name: info.name });
});

// PATCH /api/alerts/:id  { condition?, value?, status: "active"? }
alertsRouter.patch("/:id", async (req, res) => {
  const parsed = updateSchema.safeParse(req.body);
  if (!isValidObjectId(req.params.id) || !parsed.success) {
    res.status(400).json({ error: "Invalid update" });
    return;
  }

  const unset = parsed.data.status === "active" ? { triggeredAt: 1, triggeredPrice: 1 } : {};

  // Filtering by uid as well as _id means users can only edit their own alerts.
  const alert = await Alert.findOneAndUpdate(
    { _id: req.params.id, uid: req.uid },
    { $set: parsed.data, $unset: unset },
    { new: true },
  ).lean();
  if (!alert) {
    res.status(404).json({ error: "Alert not found" });
    return;
  }
  const info = await getSymbolInfo(alert.ticker).catch(() => null);
  res.json({ ...alert, name: info?.name ?? "" });
});

// DELETE /api/alerts/:id
alertsRouter.delete("/:id", async (req, res) => {
  if (!isValidObjectId(req.params.id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  await Alert.deleteOne({ _id: req.params.id, uid: req.uid });
  res.status(204).end();
});
