import type { Quote, Recommendation } from "./finnhub.js";
import type { SymbolInfo } from "./symbolInfo.js";

export type Rating = "buy" | "hold" | "sell";

// Turn Wall Street analyst counts into one rating. Score ranges from -2 (all strong sell)
// to +2 (all strong buy); most large companies land between 0 and 1.5.
export function rateFromAnalysts(r: Recommendation | null): Rating {
  if (!r) return "hold";
  const total = r.strongBuy + r.buy + r.hold + r.sell + r.strongSell;
  if (total === 0) return "hold";

  const score = (2 * r.strongBuy + r.buy - r.sell - 2 * r.strongSell) / total;
  if (score >= 1) return "buy";
  if (score <= 0.25) return "sell";
  return "hold";
}

const usd = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

// A short plain-English summary built from analyst ratings, today's move, and valuation.
export function summarize(info: SymbolInfo, quote: Quote | null): string {
  const parts: string[] = [];
  const r = info.recommendation;
  const total = r ? r.strongBuy + r.buy + r.hold + r.sell + r.strongSell : 0;

  if (r && total > 0) {
    const month = new Date(r.period).toLocaleString("en-US", { month: "long", year: "numeric", timeZone: "UTC" });
    parts.push(
      `${r.strongBuy + r.buy} of ${total} analysts rate ${info.name} a buy, ${r.hold} a hold, and ${r.sell + r.strongSell} a sell (${month}).`,
    );
  } else {
    parts.push(`No analyst ratings are available for ${info.name}.`);
  }

  if (quote) {
    const direction = quote.percentChange >= 0 ? "up" : "down";
    parts.push(`Shares trade at ${usd.format(quote.price)}, ${direction} ${Math.abs(quote.percentChange).toFixed(2)}% today.`);

    if (info.week52High) {
      const belowHigh = (1 - quote.price / info.week52High) * 100;
      parts.push(
        belowHigh < 1
          ? `That's right at its 52-week high of ${usd.format(info.week52High)}.`
          : `That's ${belowHigh.toFixed(0)}% below its 52-week high of ${usd.format(info.week52High)}.`,
      );
    }
  }

  if (info.peRatio) {
    parts.push(`It trades at ${info.peRatio.toFixed(1)}x trailing earnings.`);
  }

  return parts.join(" ");
}
