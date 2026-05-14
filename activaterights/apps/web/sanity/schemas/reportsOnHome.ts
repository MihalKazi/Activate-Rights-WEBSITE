import { defineArrayMember, defineField, defineType } from "sanity";

/** Stable id used by Studio structure + GROQ so only one instance exists. */
export const REPORTS_ON_HOME_DOCUMENT_ID = "reportsOnHome";

export const reportsOnHomeSchema = defineType({
  name: "reportsOnHome",
  title: "Reports & updates on Home",
  type: "document",
  fields: [
    defineField({
      name: "reports",
      title: "Reports (published reports band)",
      description:
        "Up to 3 references to Report documents. Drag to set order. Leave empty to show every report on the home page (newest first).",
      type: "array",
      of: [defineArrayMember({ type: "reference", to: [{ type: "report" }] })],
      validation: (rule) => rule.max(3)
    }),
    defineField({
      name: "articles",
      title: "Articles (“updates and blog” on home)",
      description:
        "Up to 3 references to Article documents. Drag to set order. Leave empty to show the 3 newest articles automatically.",
      type: "array",
      of: [defineArrayMember({ type: "reference", to: [{ type: "article" }] })],
      validation: (rule) => rule.max(3)
    })
  ],
  preview: {
    prepare() {
      return { title: "Reports & updates on Home" };
    }
  }
});
