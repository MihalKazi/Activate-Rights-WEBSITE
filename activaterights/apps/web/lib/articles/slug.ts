/**
 * Next.js may pass `[slug]` still percent-encoded for non-ASCII segments.
 * Sanity stores `slug.current` as decoded Unicode — normalize before GROQ lookup.
 */
export function normalizeArticleSlugParam(slug: string): string {
  if (!slug) return slug;
  try {
    return decodeURIComponent(slug.replace(/\+/g, " "));
  } catch {
    return slug;
  }
}
