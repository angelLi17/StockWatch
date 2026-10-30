import cron from "node-cron";
import { Alert, describeCondition, type AlertCondition } from "../models/Alert.js";
import { getQuote, type Quote } from "../services/finnhub.js";
import { sendEmail } from "../services/mailer.js";

function isHit(condition: AlertCondition, value: number, quote: Quote): boolean {
  switch (condition) {
    case "above":
      return quote.price >= value;
    case "below":
      return quote.price <= value;
    case "percentUp":
      return quote.percentChange >= value;
    case "percentDown":
      return quote.percentChange <= -value;
  }
}

// Every minute: fetch one quote per ticker that has active alerts, then trigger any alert that was hit.
export async function checkAlerts() {
  const tickers: string[] = await Alert.distinct("ticker", { status: "active" });

  for (const ticker of tickers) {
    const quote = await getQuote(ticker).catch(() => null);
    if (!quote) continue;

    const alerts = await Alert.find({ ticker, status: "active" });
    for (const alert of alerts) {
      const condition = alert.condition as AlertCondition;
      if (!isHit(condition, alert.value, quote)) continue;

      alert.status = "triggered";
      alert.triggeredAt = new Date();
      alert.triggeredPrice = quote.price;
      await alert.save();

      const description = describeCondition(condition, alert.value);
      console.log(`[alerts] ${ticker} "${description}" triggered at $${quote.price}`);

      if (alert.delivery === "email" && alert.email) {
        await sendEmail(
          alert.email,
          `StockWatch alert: ${ticker} ${description}`,
          `Your alert "${ticker} ${description}" was triggered.\n\n` +
            `${ticker} is at $${quote.price.toFixed(2)} (${quote.percentChange.toFixed(2)}% today).`,
        ).catch((err) => console.error("[alerts] email failed:", err.message));
      }
    }
  }
}

export function startAlertChecker() {
  cron.schedule("* * * * *", () => {
    checkAlerts().catch((err) => console.error("[alerts] check failed:", err.message));
  });
  console.log("[alerts] checker scheduled every minute");
}
