// Date helpers for trip planning. All dates are plain "YYYY-MM-DD" strings in local (IST) terms.
const DAY = 86400000;

export function toUtc(d: string) {
  const [y, m, dd] = d.split("-").map(Number);
  return Date.UTC(y, m - 1, dd);
}
export function addDays(d: string, n: number) {
  return new Date(toUtc(d) + n * DAY).toISOString().slice(0, 10);
}
export function diffDays(a: string, b: string) {
  return Math.round((toUtc(b) - toUtc(a)) / DAY);
}
export function pretty(d: string, withYear = false) {
  return new Date(toUtc(d)).toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    ...(withYear ? { year: "numeric" } : {}),
    timeZone: "UTC",
  });
}
