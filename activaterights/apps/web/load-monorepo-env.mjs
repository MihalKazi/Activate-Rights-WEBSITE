/**
 * Loads `.env` / `.env.local` from (in order, each overriding the previous):
 *   workspace root → `activaterights/` → `apps/web/`
 * so Next / Node scripts pick up vars whether they live in the repo root or this package.
 *
 * (Sanity CLI + `sanity/sanity.config.ts` use the same logic in `sanity/loadEnv.ts`.)
 */
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import dotenv from "dotenv";

/**
 * @param {string} appWebRoot Absolute path to `activaterights/apps/web`
 */
export function loadMonorepoEnv(appWebRoot) {
  const roots = [resolve(appWebRoot, "..", ".."), resolve(appWebRoot, ".."), appWebRoot];
  for (const r of roots) {
    for (const name of [".env", ".env.local"]) {
      const p = resolve(r, name);
      if (existsSync(p)) {
        dotenv.config({ path: p, override: true });
      }
    }
  }
}
