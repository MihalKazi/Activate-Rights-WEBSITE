/**
 * Node-only (Sanity CLI). Do not import this file from `sanity.config.ts` — that config is bundled for the browser.
 */
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { config as loadEnv } from "dotenv";

/** Load `.env` / `.env.local` from workspace root → `activaterights/` → `apps/web/` (later wins). */
export function loadMonorepoEnv(appWebRoot: string): void {
  const roots = [resolve(appWebRoot, "..", ".."), resolve(appWebRoot, ".."), appWebRoot];
  for (const r of roots) {
    for (const name of [".env", ".env.local"] as const) {
      const p = resolve(r, name);
      if (existsSync(p)) {
        loadEnv({ path: p, override: true });
      }
    }
  }
}
