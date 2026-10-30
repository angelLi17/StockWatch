import type { Quote, Recommendation } from "./finnhub.js";
import type { SymbolInfo } from "./symbolInfo.js";

export type Rating = "buy" | "hold" | "sell";

function analystTotal(r: Recommendation | null): number {
  return r ? r.strongBuy + r.buy + r.hold + r.sell + r.strongSell : 0;
}

// Turn Wall Street analyst counts into one rating. Score ranges from -2 (all strong sell)
// to +2 (all strong buy); most large companies land between 0 and 1.5.
function rateFromAnalysts(r: Recommendation): Rating {
  const score = (2 * r.strongBuy + r.buy - r.sell - 2 * r.strongSell) / analystTotal(r);
  if (score >= 1) return "buy";
  if (score <= 0.25) return "sell";
  return "hold";
}

// Analysts don't rate ETFs (or some small stocks), so those default to hold.
export function rate(info: SymbolInfo): Rating {
  const r = info.recommendation;
  return r && analystTotal(r) > 0 ? rateFromAnalysts(r) : "hold";
}

const usd = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

function signed(pct: number): string {
  return `${pct >= 0 ? "up" : "down"} ${Math.abs(pct).toFixed(1)}%`;
}

// A short plain-English summary built from analyst ratings, today's move, and valuation.
export function summarize(info: SymbolInfo, quote: Quote | null): string {
  const parts: string[] = [];
  const r = info.recommendation;
  const total = analystTotal(r);

  if (r && total > 0) {
    const month = new Date(r.period).toLocaleString("en-US", { month: "long", year: "numeric", timeZone: "UTC" });
    parts.push(
      `${r.strongBuy + r.buy} of ${total} analysts rate ${info.name} a buy, ${r.hold} a hold, and ${r.sell + r.strongSell} a sell (${month}).`,
    );
  } else {
    const who = info.isFund ? "Analysts don't rate funds" : `No analyst ratings are available for ${info.name}`;
    parts.push(`${who}, so it's listed under Hold.`);
  }

  if (quote) {
    parts.push(`Shares trade at ${usd.format(quote.price)}, ${signed(quote.percentChange ?? 0)} today.`);

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
