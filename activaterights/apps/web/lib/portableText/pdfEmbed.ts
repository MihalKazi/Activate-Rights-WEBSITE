/** Portable Text block when importing from HTML / Sanity block editor */
type PtSpan = {
  _type?: string;
  text?: string;
  marks?: string[];
};

type PtMarkDef = {
  _key?: string;
  _type?: string;
  href?: string;
  url?: string;
};

type PtBlock = {
  _type?: string;
  style?: string;
  children?: PtSpan[];
  markDefs?: PtMarkDef[];
};

export function isPdfUrl(href: string | undefined | null): boolean {
  if (!href || typeof href !== "string") return false;
  const u = href.trim().toLowerCase();
  return u.endsWith(".pdf") || u.includes(".pdf?") || u.includes(".pdf#");
}

export function pdfFileLabel(href: string): string {
  try {
    const path = new URL(href).pathname.split("/").filter(Boolean).pop();
    if (!path) return "Document.pdf";
    return decodeURIComponent(path.replace(/\+/g, " "));
  } catch {
    const clean = href.split("?")[0]?.split("/").pop();
    return clean ? decodeURIComponent(clean) : "Document.pdf";
  }
}

/**
 * When a paragraph is only a single link to a PDF (common for WP-import embeds),
 * return that URL so we can render a full viewer instead of a bare link.
 */
export function extractPdfOnlyParagraphUrl(block: unknown): string | null {
  if (!block || typeof block !== "object") return null;
  const b = block as PtBlock;
  if (b._type !== "block") return null;
  if (b.style && b.style !== "normal") return null;
  const children = b.children;
  if (!Array.isArray(children) || children.length !== 1) return null;
  const span = children[0];
  if (!span || span._type !== "span") return null;
  const marks = span.marks;
  if (!Array.isArray(marks) || marks.length !== 1) return null;
  const key = marks[0];
  const defs = b.markDefs;
  if (!Array.isArray(defs)) return null;
  const def = defs.find(
    (m) => m._key === key && (m._type === "link" || m._type === undefined)
  );
  const href = def?.href ?? def?.url;
  if (!href || !isPdfUrl(href)) return null;
  return href;
}
