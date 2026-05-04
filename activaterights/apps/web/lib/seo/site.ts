/** Production site (matches `.env.local.example`). */
const DEFAULT_SITE_URL = "https://activaterights.org";

/**
 * Canonical origin for metadata, sitemap, and JSON-LD. No trailing slash.
 * Set `NEXT_PUBLIC_BASE_URL` in each environment (e.g. http://localhost:3000 for dev).
 */
export function getSiteUrl(): string {
  const raw = (process.env.NEXT_PUBLIC_BASE_URL ?? DEFAULT_SITE_URL).trim();
  return raw.replace(/\/+$/, "");
}
