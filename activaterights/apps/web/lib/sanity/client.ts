import { createClient } from "next-sanity";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const apiVersion = "2024-01-01";

/**
 * Non-public datasets need a token for server-side GROQ. Prefer a read-only Viewer token
 * in `SANITY_API_TOKEN`; `SANITY_API_WRITE_TOKEN` is only used as a fallback when unset.
 */
const serverReadToken =
  (process.env.SANITY_API_TOKEN ?? "").trim() || (process.env.SANITY_API_WRITE_TOKEN ?? "").trim() || undefined;

export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  /** API directly — avoids stale reads on the Edge CDN right after publishing/import. */
  useCdn: false,
  perspective: "published",
  ...(serverReadToken ? { token: serverReadToken } : {})
});

export const previewClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
  perspective: "previewDrafts"
});
