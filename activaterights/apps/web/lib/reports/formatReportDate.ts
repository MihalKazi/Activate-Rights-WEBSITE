import type { Locale } from "../../i18n/config";
import { formatCalendarDayMonthYear } from "../datetime/formatCalendarDisplay";

/** `publishedDate` from Sanity is YYYY-MM-DD. */
export function formatReportCardDate(iso: string, locale: Locale): string {
  const trimmed = iso.trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return iso;
  return formatCalendarDayMonthYear(`${trimmed}T12:00:00Z`, locale);
}
