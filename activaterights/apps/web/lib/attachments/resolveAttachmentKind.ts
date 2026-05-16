export type PublicationAttachmentKind = "pdf" | "image" | "video" | "audio" | "file";

export type PublicationAttachmentInput = {
  kind?: string | null;
  mimeType?: string | null;
  url?: string | null;
  filename?: string | null;
};

const VIDEO_EXT = /\.(mp4|webm|ogg|mov|m4v)(\?|#|$)/i;
const AUDIO_EXT = /\.(mp3|wav|ogg|m4a|aac|flac)(\?|#|$)/i;
const IMAGE_EXT = /\.(avif|bmp|gif|jpe?g|png|svg|webp)(\?|#|$)/i;
const PDF_EXT = /\.pdf(\?|#|$)/i;

export function resolveAttachmentKind(input: PublicationAttachmentInput): PublicationAttachmentKind {
  const explicit = (input.kind ?? "").trim().toLowerCase();
  if (
    explicit === "pdf" ||
    explicit === "image" ||
    explicit === "video" ||
    explicit === "audio" ||
    explicit === "file"
  ) {
    return explicit;
  }

  const mime = (input.mimeType ?? "").trim().toLowerCase();
  if (mime === "application/pdf") return "pdf";
  if (mime.startsWith("image/")) return "image";
  if (mime.startsWith("video/")) return "video";
  if (mime.startsWith("audio/")) return "audio";

  const name = `${input.url ?? ""} ${input.filename ?? ""}`.toLowerCase();
  if (PDF_EXT.test(name)) return "pdf";
  if (VIDEO_EXT.test(name)) return "video";
  if (AUDIO_EXT.test(name)) return "audio";
  if (IMAGE_EXT.test(name)) return "image";

  return "file";
}

export function attachmentDisplayName(
  input: PublicationAttachmentInput & { title?: string | null }
): string {
  const custom = input.title?.trim();
  if (custom) return custom;

  const filename = input.filename?.trim();
  if (filename) return filename;

  const url = input.url?.trim();
  if (!url) return "File";
  try {
    const path = new URL(url).pathname.split("/").filter(Boolean).pop();
    if (path) return decodeURIComponent(path.replace(/\+/g, " "));
  } catch {
    const clean = url.split("?")[0]?.split("/").pop();
    if (clean) return decodeURIComponent(clean);
  }
  return "File";
}
