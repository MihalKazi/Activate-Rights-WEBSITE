import { defineArrayMember, defineField, defineType } from "sanity";

/** Stable id used by Studio structure + GROQ so only one instance exists. */
export const REPORTS_ON_HOME_DOCUMENT_ID = "reportsOnHome";

export const reportsOnHomeSchema = defineType({
  name: "reportsOnHome",
  title: "Home page: projects, initiatives & more",
  type: "document",
  fields: [
    defineField({
      name: "featuredProjects",
      title: "Projects (“our projects” on home)",
      description:
        "Pick exactly 3 projects for the home page grid. Drag to set order. Leave empty to use the first 3 projects by order field.",
      type: "array",
      of: [defineArrayMember({ type: "reference", to: [{ type: "project" }] })],
      validation: (rule) => rule.max(3).warning("Home shows at most 3 projects.")
    }),
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
        "Add up to 3 slots. Set Position (1 = left, 2 = middle, 3 = right) for each. Leave empty to use the 3 reports with the lowest Order on each Report document (then newest date).",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "homeReportSlot",
          title: "Home report slot",
          fields: [
            defineField({
              name: "position",
              title: "Position on home page",
              type: "number",
              options: {
                list: [
                  { title: "1 — Left", value: 1 },
                  { title: "2 — Middle", value: 2 },
                  { title: "3 — Right", value: 3 }
                ],
                layout: "radio"
              },
              validation: (rule) => rule.required().integer().min(1).max(3)
            }),
            defineField({
              name: "report",
              title: "Report",
              type: "reference",
              to: [{ type: "report" }],
              validation: (rule) => rule.required()
            })
          ],
          preview: {
            select: {
              position: "position",
              title: "report.title.en",
              media: "report.coverImage"
            },
            prepare({ position, title, media }) {
              return {
                title: `Position ${position ?? "?"}: ${title || "Choose report"}`,
                media
              };
            }
          }
        })
      ],
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
      return { title: "Home page: projects, initiatives & more" };
    }
  }
});
