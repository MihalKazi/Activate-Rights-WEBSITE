/**
 * Imports WordPress posts from activaterights.org into Sanity `article` documents.
 *
 * Prerequisites:
 * - NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET in env (e.g. apps/web/.env.local)
 * - SANITY_API_WRITE_TOKEN with Editor permissions (create/update documents + upload assets)
 *
 * Usage (from repo root or apps/web):
 *   pnpm -C activaterights/apps/web import:wp-articles
 */

import { createClient } from "@sanity/client";
import { Schema } from "@sanity/schema";
import { htmlToBlocks } from "@sanity/block-tools";
import { JSDOM } from "jsdom";
import path from "path";
import { fileURLToPath } from "url";
import { loadMonorepoEnv } from "../load-monorepo-env.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
loadMonorepoEnv(path.join(__dirname, ".."));

const WP_BASE = "https://activaterights.org/wp-json/wp/v2";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const token = process.env.SANITY_API_WRITE_TOKEN ?? "";

const blogSchema = Schema.compile({
  name: "wpImport",
  types: [
    {
      type: "object",
      name: "blogPost",
      fields: [{ title: "Body", name: "body", type: "array", of: [{ type: "block" }] }]
    }
  ]
});

const blockContentType = blogSchema.get("blogPost").fields.find((f) => f.name === "body").type;

function preprocessWpHtml(html) {
  return html.replace(
    /<iframe[^>]+src=["']([^"']+)["'][^>]*>[\s\S]*?<\/iframe>/gi,
    (_, src) =>
      `<p><a href="${src}">View embedded document</a></p>`
  );
}

function stripHtml(html) {
  if (!html) return "";
  const doc = new JSDOM(html).window.document;
  return doc.body.textContent?.replace(/\s+/g, " ").trim() ?? "";
}

function decodeSlug(slug) {
  try {
    return decodeURIComponent(slug);
  } catch {
    return slug;
  }
}

function isMostlyBengali(text) {
  const bn = (text.match(/[\u0980-\u09FF]/g) || []).length;
  const latin = (text.match(/[A-Za-z]/g) || []).length;
  return bn >= latin;
}

function htmlToPortableBlocks(html) {
  const cleaned = preprocessWpHtml(html || "");
  const blocks = htmlToBlocks(cleaned, blockContentType, {
    parseHtml: (h) => new JSDOM(`<div class="wp">${h}</div>`).window.document
  });
  return Array.isArray(blocks) ? blocks : [];
}

async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${url} → ${res.status}`);
  return res.json();
}

async function fetchAllPosts() {
  let page = 1;
  const all = [];
  while (true) {
    const batch = await fetchJson(`${WP_BASE}/posts?per_page=100&page=${page}&_embed=1&status=publish`);
    if (!Array.isArray(batch) || batch.length === 0) break;
    all.push(...batch);
    if (batch.length < 100) break;
    page += 1;
  }
  return all;
}

async function fetchCategoriesMap() {
  const cats = await fetchJson(`${WP_BASE}/categories?per_page=100`);
  const map = new Map();
  for (const c of cats) {
    map.set(c.id, c.name);
  }
  return map;
}

async function fetchAuthorsMap(authorIds) {
  const map = new Map();
  const ids = [...new Set(authorIds)].filter(Boolean);
  for (const id of ids) {
    try {
      const u = await fetchJson(`${WP_BASE}/users/${id}`);
      map.set(id, u.name || u.slug || `Author ${id}`);
    } catch {
      map.set(id, `Author ${id}`);
    }
  }
  return map;
}

async function uploadCover(client, url) {
  if (!url) return undefined;
  const res = await fetch(url);
  if (!res.ok) return undefined;
  const buf = Buffer.from(await res.arrayBuffer());
  const ct = res.headers.get("content-type") || "image/jpeg";
  const ext =
    ct.includes("webp") ? "webp" : ct.includes("png") ? "png" : ct.includes("gif") ? "gif" : "jpg";
  const asset = await client.assets.upload("image", buf, {
    filename: `wp-cover.${ext}`,
    contentType: ct
  });
  return {
    _type: "image",
    asset: { _type: "reference", _ref: asset._id }
  };
}

function buildLocalizedDoc(post, categoryName, authorName, coverImage, blocks, excerptText) {
  const titlePlain = stripHtml(post.title?.rendered ?? "");
  const slugDec = decodeSlug(post.slug);
  const bn = isMostlyBengali(titlePlain + excerptText);

  const publishedAt = post.date?.includes("T") ? post.date : `${post.date}T00:00:00Z`;

  const emptyBlocks = [
    {
      _type: "block",
      _key: `fallback-${post.id}`,
      style: "normal",
      markDefs: [],
      children: [{ _type: "span", marks: [], text: excerptText || "(No body imported.)", _key: `sp-${post.id}` }]
    }
  ];

  const bodyBlocks = blocks.length ? blocks : emptyBlocks;

  const title = bn
    ? { en: titlePlain, bn: titlePlain }
    : { en: titlePlain, bn: "" };

  const excerpt = bn
    ? { en: "", bn: excerptText }
    : { en: excerptText, bn: "" };

  const body = bn ? { en: [], bn: bodyBlocks } : { en: bodyBlocks, bn: [] };

  return {
    _id: `wp-import-post-${post.id}`,
    _type: "article",
    title,
    slug: { _type: "slug", current: slugDec },
    excerpt,
    body,
    coverImage,
    guestAuthor: authorName,
    category: categoryName || "Article",
    publishedAt,
    featured: Boolean(post.sticky)
  };
}

async function main() {
  if (!projectId) {
    console.error("Missing NEXT_PUBLIC_SANITY_PROJECT_ID.");
    process.exit(1);
  }

  console.log(`Fetching WordPress posts from ${WP_BASE} …`);
  const [posts, catMap] = await Promise.all([fetchAllPosts(), fetchCategoriesMap()]);
  console.log(`Found ${posts.length} post(s).`);

  const authorIds = posts.map((p) => p.author);
  const authors = await fetchAuthorsMap(authorIds);

  const client = createClient({
    projectId,
    dataset,
    apiVersion: "2024-01-01",
    token: token || undefined,
    useCdn: false
  });

  if (!token) {
    console.warn("\n⚠ SANITY_API_WRITE_TOKEN is not set. Set it to upload to Sanity.\n");
    for (const post of posts) {
      const catId = post.categories?.[0];
      const catName = catId != null ? catMap.get(catId) : "";
      const blocks = htmlToPortableBlocks(post.content?.rendered ?? "");
      console.log(`— [dry-run] ${decodeSlug(post.slug)} | blocks: ${blocks.length} | category: ${catName}`);
    }
    process.exit(0);
  }

  for (const post of posts) {
    const slugDec = decodeSlug(post.slug);
    const catId = post.categories?.[0];
    const catName = catId != null ? catMap.get(catId) : "";
    const authorName = authors.get(post.author) ?? "Activate Rights";

    let featuredUrl =
      post._embedded?.["wp:featuredmedia"]?.[0]?.source_url ??
      post._embedded?.["wp:featuredmedia"]?.[0]?.media_details?.sizes?.large?.source_url;

    const blocks = htmlToPortableBlocks(post.content?.rendered ?? "");
    const excerptText = stripHtml(post.excerpt?.rendered ?? "");

    let coverImage;
    try {
      coverImage = featuredUrl ? await uploadCover(client, featuredUrl) : undefined;
    } catch (e) {
      console.warn(`Cover upload failed for ${slugDec}:`, e.message);
    }

    const doc = buildLocalizedDoc(post, catName, authorName, coverImage, blocks, excerptText);

    await client.createOrReplace(doc);
    console.log(`✓ ${slugDec}`);
  }

  console.log("\nDone. Open Sanity Studio → Articles to review and publish if using drafts workflow.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
