import { documentInternationalization } from "@sanity/document-internationalization";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./schemas";

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
            ...S.documentTypeListItems().filter((item) => item.getId() !== "event")
          ])
    }),
    visionTool(),
    documentInternationalization({
      supportedLanguages: [
        { id: "en", title: "English" },
        { id: "bn", title: "Bangla" }
      ],
      // Document-level translations: each type should include a hidden `language` string (see plugin README).
      // `event` uses field-level `localizedString` only — omit it so Studio lists events and API imports work.
      schemaTypes: ["article", "project", "campaign", "teamMember", "siteSettings"]
    })
  ],
  schema: {
    types: schemaTypes
  }
});
