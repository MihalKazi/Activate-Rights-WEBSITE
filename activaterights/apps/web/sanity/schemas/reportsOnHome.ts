import { defineArrayMember, defineField, defineType } from "sanity";

/** Stable id used by Studio structure + GROQ so only one instance exists. */
export const REPORTS_ON_HOME_DOCUMENT_ID = "reportsOnHome";

export const reportsOnHomeSchema = defineType({
  name: "reportsOnHome",
  title: "Initiatives, reports & updates on Home",
  type: "document",
  fields: [
    defineField({
      name: "initiatives",
      title: "Initiatives (“our initiatives” on home)",
      description:
        "Up to 2 references to Project documents (cover image, title, short description). Drag to set order. Leave empty to show the first 2 projects by order field.",
      type: "array",
      of: [defineArrayMember({ type: "reference", to: [{ type: "project" }] })],
      validation: (rule) => rule.max(2)
    }),
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
      return { title: "Initiatives, reports & updates on Home" };
    }
  }
});
