// Calendar helpers. All dates are YYYY-MM-DD strings in UTC, which sort and compare as text.

const DAY_MS = 24 * 60 * 60 * 1000;

export function toDateString(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export function today(): string {
  return toDateString(new Date());
}

export function addDays(date: string, days: number): string {
  return toDateString(new Date(Date.parse(`${date}T00:00:00Z`) + days * DAY_MS));
}

export function daysBetween(from: string, to: string): number {
  return Math.round((Date.parse(`${to}T00:00:00Z`) - Date.parse(`${from}T00:00:00Z`)) / DAY_MS);
}

// The US market closes at 4pm New York time (20:00 or 21:00 UTC). News published after
// 20:00 UTC is counted toward the next day, so a day's sentiment only uses news that was
// out before that day's close. (In winter this also moves the last hour of trading news
// to the next day, which errs on the safe side: no peeking at news after the close.)
export function newsDay(unixSeconds: number): string {
  return toDateString(new Date((unixSeconds + 4 * 3600) * 1000));
}
