/** Plain multiline CMS text: blank lines → paragraphs; single newlines kept (caller uses whitespace-pre-line). */
export function plainTextToParagraphs(raw: string): string[] {
  const normalized = raw.replace(/\r\n/g, "\n").trim();
  if (!normalized) return [];
  return normalized
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);
}
