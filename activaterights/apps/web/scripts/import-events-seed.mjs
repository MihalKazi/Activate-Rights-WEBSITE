/**
 * Imports `event` documents from `data/events-seed.json` (sourced from the team’s
 * Event summary Google Doc). Cover images are omitted — add them in Sanity Studio later.
 *
 * Source: https://docs.google.com/document/d/1f0AJtu2sZ-EqBG6Bm0UQDhHsFrqrpXu-akRw_YepXoQ/edit
 *
 * Prerequisites:
 * - NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET (any of: repo root, activaterights/, or apps/web/.env.local)
 * - SANITY_API_WRITE_TOKEN (Editor: create/update documents)
 *
 * Usage (from apps/web):
 *   npm run seed:events
 *
 * By default removes every existing `event` document in the dataset, then imports from
 * `data/events-seed.json`. Use `--no-wipe` to keep other events and only upsert seed ids.
 */

import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@sanity/client";
import { loadMonorepoEnv } from "../load-monorepo-env.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
loadMonorepoEnv(path.join(__dirname, ".."));

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const token = process.env.SANITY_API_WRITE_TOKEN ?? "";

const dryRun = process.argv.includes("--dry-run");
const noWipe = process.argv.includes("--no-wipe");

if (!dryRun && (!projectId || !token)) {
  console.error("Missing NEXT_PUBLIC_SANITY_PROJECT_ID or SANITY_API_WRITE_TOKEN.");
  console.error("Pass --dry-run to only print what would be imported.");
  process.exit(1);
}

const jsonPath = path.join(__dirname, "../data/events-seed.json");
const items = JSON.parse(readFileSync(jsonPath, "utf8"));

if (!Array.isArray(items) || items.length === 0) {
  console.error("events-seed.json must be a non-empty array.");
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: "2024-01-01",
  useCdn: false
});

/** Remove all `event` docs so the dataset matches the seed file only. */
async function deleteAllEvents() {
  const ids = await client.fetch(`array::unique(*[_type == "event"]._id)`);
  if (!Array.isArray(ids) || ids.length === 0) {
    console.log("No existing event documents to remove.");
    return;
  }
  console.log(`Removing ${ids.length} existing event document(s)...`);
  const chunkSize = 100;
  for (let i = 0; i < ids.length; i += chunkSize) {
    const slice = ids.slice(i, i + chunkSize);
    const trx = client.transaction();
    for (const id of slice) {
      trx.delete(id);
    }
    await trx.commit();
  }
}

function toDoc(row) {
  const title = String(row.title).trim();
  const slug = String(row.slug).trim();
  return {
    _type: "event",
    _id: `eventSeed.${slug}`,
    title: { en: title, bn: title },
    slug: { current: slug },
    date: row.date,
    registrationUrl: String(row.url).trim(),
    isOnline: false
  };
}

async function main() {
  console.log(`Sanity project: ${projectId || "(missing)"}`);
  console.log(`Dataset: ${dataset} (must match NEXT_PUBLIC_SANITY_DATASET in .env)`);
  console.log(`Seeding ${items.length} event row(s), dry-run: ${dryRun}, wipe-first: ${!noWipe && !dryRun}`);

  if (!dryRun && !noWipe) {
    await deleteAllEvents();
  }

  for (const row of items) {
    const doc = toDoc(row);
    if (dryRun) {
      console.log("[dry-run]", doc._id, doc.slug.current);
      continue;
    }
    await client.createOrReplace(doc);
    console.log("imported", doc._id);
  }

  if (!dryRun) {
    const n = await client.fetch('count(*[_type == "event"])');
    console.log(`Done. Event documents in this dataset now: ${n}.`);
    console.log("Studio: Content → Events (top). Vision query: *[_type == \"event\"]");
    console.log("Add cover images and Bangla copy in Studio as needed.");
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
