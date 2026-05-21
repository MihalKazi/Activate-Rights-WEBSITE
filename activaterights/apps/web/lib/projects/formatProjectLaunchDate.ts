import type { Locale } from "../../i18n/config";
import { formatCalendarDayMonthYear } from "../datetime/formatCalendarDisplay";

export function formatProjectLaunchDate(
  iso: string | null | undefined,
  locale: Locale
): string | null {
  if (!iso || typeof iso !== "string") return null;
  const trimmed = iso.trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return null;
  const label = formatCalendarDayMonthYear(`${trimmed}T12:00:00Z`, locale);
  return label === "—" ? null : label;
}
