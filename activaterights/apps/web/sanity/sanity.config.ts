import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./schemas";
import { REPORTS_ON_HOME_DOCUMENT_ID } from "./schemas/reportsOnHome";

/** Injected by Next (`next.config.mjs` loads monorepo `.env` before bundling). Do not import Node `fs` here — Studio is browser-bundled. */
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";

export default defineConfig({
  name: "default",
  title: "Activate Rights Studio",
  projectId,
  dataset,
  basePath: "/studio",
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Content")
          .items([
            S.listItem()
              .title("Events")
              .id("events-root")
              .child(S.documentTypeList("event").title("Events").defaultOrdering([{ field: "date", direction: "desc" }])),
            S.divider(),
            S.listItem()
              .title("Initiatives, reports & updates on Home")
              .id("singleton-reports-on-home")
              .child(
                S.document()
                  .schemaType("reportsOnHome")
                  .documentId(REPORTS_ON_HOME_DOCUMENT_ID)
                  .title("Initiatives, reports & updates on Home")
              ),
            S.divider(),
            ...S.documentTypeListItems().filter(
              (item) => item.getId() !== "event" && item.getId() !== "reportsOnHome"
            )
          ])
    }),
    visionTool()
  ],
  schema: {
    types: schemaTypes
  }
});
