import type { Locale } from "../../i18n/config";

/** Same output in Node SSR and the browser for a given ISO timestamp. */
export function formatCalendarDayMonthYear(iso: string, locale: Locale): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString(locale === "bn" ? "bn-BD" : "en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "UTC"
  });
}

/** `dd.mm.yyyy` using the UTC calendar day (stable across time zones). */
export function formatCalendarDdMmYyyyUtc(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  const dd = String(d.getUTCDate()).padStart(2, "0");
  const mm = String(d.getUTCMonth() + 1).padStart(2, "0");
  const yyyy = d.getUTCFullYear();
  return `${dd}.${mm}.${yyyy}`;
}
