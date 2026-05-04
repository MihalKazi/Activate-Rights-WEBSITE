import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { defineCliConfig } from "sanity/cli";
import { loadMonorepoEnv } from "./sanity/loadEnv";

const appWebRoot = dirname(fileURLToPath(import.meta.url));
loadMonorepoEnv(appWebRoot);

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";

export default defineCliConfig({
  api: { projectId, dataset }
});
