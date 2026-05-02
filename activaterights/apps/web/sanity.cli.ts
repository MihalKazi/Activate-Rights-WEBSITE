import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { config as loadEnv } from "dotenv";
import { defineCliConfig } from "sanity/cli";

const root = process.cwd();
for (const name of [".env", ".env.local"]) {
  const path = resolve(root, name);
  if (existsSync(path)) {
    loadEnv({ path, override: name === ".env.local" });
  }
}

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";

export default defineCliConfig({
  api: { projectId, dataset }
});
