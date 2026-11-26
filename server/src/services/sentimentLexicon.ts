// A small finance-flavoured word list for scoring news headlines. Each word carries a weight
// (+2 strongly positive ... -2 strongly negative). This is deliberately simple: no machine
// learning, just counting signal words, flipping them after a negation, and squashing the
// total into -1..+1.

const POSITIVE: Record<string, number> = {
  // Results and guidance
  beat: 2, beats: 2, tops: 1.5, topped: 1.5, exceeds: 1.5, exceeded: 1.5, surpass: 1.5, surpasses: 1.5,
  record: 1, profit: 1, profits: 1, profitable: 1, growth: 1, grow: 1, grows: 1, growing: 1,
  strong: 1, stronger: 1, strongest: 1, robust: 1, solid: 0.5, raises: 1, raised: 1, boost: 1, boosts: 1,
  boosted: 1, expand: 0.5, expands: 0.5, expansion: 0.5, accelerate: 1, accelerates: 1, momentum: 1,
  // Price moves
  surge: 2, surges: 2, surged: 2, soar: 2, soars: 2, soared: 2, jump: 1.5, jumps: 1.5, jumped: 1.5,
  rally: 1.5, rallies: 1.5, rallied: 1.5, gain: 1, gains: 1, gained: 1, rise: 1, rises: 1, rose: 1,
  climb: 1, climbs: 1, climbed: 1, rebound: 1, rebounds: 1, rebounded: 1, recover: 1, recovers: 1,
  high: 0.5, highs: 1, skyrocket: 2, skyrockets: 2, outperform: 1.5, outperforms: 1.5, outperformed: 1.5,
  // Analysts and sentiment
  upgrade: 2, upgrades: 2, upgraded: 2, bullish: 2, buy: 0.5, overweight: 1, optimistic: 1.5, optimism: 1.5,
  confident: 1, confidence: 1, upbeat: 1.5, positive: 1, favorable: 1, attractive: 1, undervalued: 1,
  // Business events
  win: 1, wins: 1, won: 1, award: 1, awarded: 1, approval: 1.5, approved: 1.5, approves: 1.5,
  launch: 0.5, launches: 0.5, partnership: 1, partners: 0.5, deal: 0.5, breakthrough: 2, innovative: 1,
  innovation: 1, dividend: 0.5, buyback: 1, success: 1.5, successful: 1.5, best: 1, top: 0.5,
  milestone: 1, demand: 0.5, opportunity: 0.5, opportunities: 0.5,
};

const NEGATIVE: Record<string, number> = {
  // Results and guidance
  miss: -2, misses: -2, missed: -2, loss: -1.5, losses: -1.5, lose: -1, loses: -1, decline: -1,
  declines: -1, declined: -1, weak: -1, weaker: -1, weakness: -1, cut: -1, cuts: -1, slash: -1.5,
  slashes: -1.5, lowers: -1, lowered: -1, disappoint: -1.5, disappoints: -1.5, disappointing: -1.5,
  slowdown: -1, slows: -1, slowing: -1, shortfall: -1.5, warning: -1.5, warns: -1.5, warned: -1.5,
  // Price moves
  plunge: -2, plunges: -2, plunged: -2, tumble: -2, tumbles: -2, tumbled: -2, crash: -2, crashes: -2,
  sink: -1.5, sinks: -1.5, sank: -1.5, slump: -1.5, slumps: -1.5, drop: -1, drops: -1, dropped: -1,
  fall: -1, falls: -1, fell: -1, slide: -1, slides: -1, slid: -1, dip: -0.5, dips: -0.5, sell: -0.5,
  selloff: -1.5, low: -0.5, lows: -1, underperform: -1.5, underperforms: -1.5,
  // Analysts and sentiment
  downgrade: -2, downgrades: -2, downgraded: -2, bearish: -2, underweight: -1, pessimistic: -1.5,
  concern: -1, concerns: -1, worried: -1, worries: -1, worry: -1, fear: -1, fears: -1, risk: -0.5,
  risks: -0.5, risky: -1, overvalued: -1, negative: -1, uncertainty: -1, volatile: -0.5, bubble: -1,
  // Business events
  lawsuit: -1.5, lawsuits: -1.5, sue: -1.5, sues: -1.5, sued: -1.5, probe: -1.5, investigation: -1.5,
  fined: -1.5, penalty: -1.5, recall: -1.5, recalls: -1.5, layoff: -1.5, layoffs: -1.5,
  bankruptcy: -2, bankrupt: -2, default: -1.5, fraud: -2, scandal: -2, halt: -1, halts: -1,
  delay: -1, delays: -1, delayed: -1, ban: -1.5, bans: -1.5, banned: -1.5, tariff: -0.5, tariffs: -0.5,
  antitrust: -1, struggle: -1, struggles: -1, struggling: -1, crisis: -1.5, threat: -1, threatens: -1,
  fail: -1.5, fails: -1.5, failed: -1.5, failure: -1.5, worst: -1.5, resign: -1, resigns: -1, exits: -0.5,
  breach: -1.5, hack: -1.5, outage: -1, shortage: -1, downturn: -1.5, recession: -1.5,
};

// Multi-word phrases are matched first and their words are skipped afterwards.
const PHRASES: [string[], number][] = [
  [["price", "target", "raised"], 1.5],
  [["raises", "price", "target"], 1.5],
  [["price", "target", "cut"], -1.5],
  [["cuts", "price", "target"], -1.5],
  [["all", "time", "high"], 1.5],
  [["record", "high"], 1.5],
  [["52", "week", "high"], 1],
  [["52", "week", "low"], -1],
  [["beats", "estimates"], 2],
  [["misses", "estimates"], -2],
  [["raises", "guidance"], 2],
  [["cuts", "guidance"], -2],
  [["lowers", "guidance"], -2],
  [["better", "than", "expected"], 1.5],
  [["worse", "than", "expected"], -1.5],
  [["short", "seller"], -1],
  [["sell", "off"], -1.5],
  [["stock", "split"], 0.5],
];

const NEGATIONS = new Set(["not", "no", "never", "without", "isn't", "isnt", "doesn't", "doesnt", "didn't", "didnt", "won't", "wont", "can't", "cant", "fails", "lack", "lacks"]);

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[’']/g, "'")
    .split(/[^a-z0-9']+/) // hyphens split words, so "all-time high" matches the phrase below
    .map((t) => t.replace(/^'+|'+$/g, ""))
    .filter(Boolean);
}

function wordWeight(token: string): number {
  return POSITIVE[token] ?? NEGATIVE[token] ?? 0;
}

// Score one headline from -1 (very negative) to +1 (very positive). 0 means no signal words.
export function scoreHeadline(headline: string): number {
  const tokens = tokenize(headline);
  let raw = 0;

  for (let i = 0; i < tokens.length; i++) {
    let weight = 0;
    let length = 1;

    const phrase = PHRASES.find(([words]) => words.every((w, j) => tokens[i + j] === w));
    if (phrase) {
      weight = phrase[1];
      length = phrase[0].length;
    } else {
      weight = wordWeight(tokens[i]!);
    }

    if (weight !== 0) {
      // "not strong", "no growth": a negation within the previous 3 words flips the sign.
      const before = tokens.slice(Math.max(0, i - 3), i);
      if (before.some((t) => NEGATIONS.has(t))) weight = -weight;
      raw += weight;
    }
    i += length - 1;
  }

  // Squash the total into -1..+1 (same idea as VADER): one strong word ≈ ±0.7, several → close to ±1.
  return raw === 0 ? 0 : round2(raw / Math.sqrt(raw * raw + 4));
}

export function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
