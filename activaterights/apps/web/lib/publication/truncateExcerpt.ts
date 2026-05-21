const EXCERPT_MAX = 140;

export function truncateExcerpt(text: string | null | undefined): string | null {
  if (!text || typeof text !== "string") return null;
  const trimmed = text.trim();
  if (!trimmed.length) return null;
  if (trimmed.length <= EXCERPT_MAX) return trimmed;
  return `${trimmed.slice(0, EXCERPT_MAX).trimEnd()}…`;
}
