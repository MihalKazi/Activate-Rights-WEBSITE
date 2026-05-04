import { createClient } from "next-sanity";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const apiVersion = "2024-01-01";

/**
 * Server-side GROQ: use a **Viewer** (read-only) token in `SANITY_API_TOKEN`.
 * Do not fall back to `SANITY_API_WRITE_TOKEN` — editor tokens can be tied to a Sanity user;
 * if that user was removed from the project, API returns "project user not found" and pages 500.
 * Public datasets work with no token. Private datasets require `SANITY_API_TOKEN`.
 */
const serverReadToken = (process.env.SANITY_API_TOKEN ?? "").trim() || undefined;

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
