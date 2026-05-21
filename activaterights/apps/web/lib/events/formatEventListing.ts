import type { Locale } from "../../i18n/config";
import {
  formatCalendarDayMonthYear,
  formatCalendarDdMmYyyyUtc
} from "../datetime/formatCalendarDisplay";

export function formatEventListingDate(iso: string, locale: Locale): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return locale === "bn" ? formatCalendarDayMonthYear(iso, "bn") : formatCalendarDdMmYyyyUtc(iso);
}

export function formatEventListingPlace(
  event: { isOnline: boolean; location?: string },
  labels: { online: string; locationTbd: string }
): string {
  const loc = (event.location ?? "").trim();
  if (event.isOnline && loc) return `${labels.online} · ${loc}`;
  if (event.isOnline) return labels.online;
  if (loc) return loc;
  return labels.locationTbd;
}

/** Big day + month + year for ticket-style listing cards. */
export function formatEventDateParts(
  iso: string,
  locale: Locale
): { day: string; month: string; year: string } {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) {
    return { day: "—", month: "", year: "" };
  }
  const day = String(d.getUTCDate()).padStart(2, "0");
  const month = d
    .toLocaleDateString(locale === "bn" ? "bn-BD" : "en-GB", {
      month: "short",
      timeZone: "UTC"
    })
    .replace(/\./g, "")
    .toUpperCase();
  const year = String(d.getUTCFullYear());
  return { day, month, year };
}

export function formatEventListingMeta(
  event: { date: string; isOnline: boolean; location?: string },
  locale: Locale,
  labels: { online: string; locationTbd: string }
): string {
  const datePart = formatEventListingDate(event.date, locale);
  const place = formatEventListingPlace(event, labels);
  return `${datePart} · ${place}`;
}
