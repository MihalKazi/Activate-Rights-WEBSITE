import { defineArrayMember, defineField, defineType } from "sanity";

export const siteSettingsSchema = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  fields: [
    defineField({ name: "siteName", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "siteDescription", type: "localizedText" }),
    defineField({
      name: "navLinks",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "label", type: "localizedString" }),
            defineField({ name: "href", type: "string" })
          ]
        })
      ]
    }),
    defineField({
      name: "homeFeaturedProjects",
      title: "Projects on home page (legacy)",
      description:
        "Deprecated — use “Initiatives, reports & updates on Home” → Projects instead. Kept for old data fallback only.",
      type: "array",
      of: [defineArrayMember({ type: "reference", to: [{ type: "project" }] })],
      validation: (rule) => rule.max(3),
      hidden: true
    }),
    defineField({ name: "footerText", type: "localizedText" }),
    defineField({
      name: "socialLinks",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "platform", type: "string" }),
            defineField({ name: "url", type: "url" })
          ]
        })
      ]
    }),
    defineField({
      name: "seoDefaults",
      type: "object",
      fields: [
        defineField({ name: "metaTitle", type: "localizedString" }),
        defineField({ name: "metaDescription", type: "localizedText" }),
        defineField({ name: "ogImage", type: "image", options: { hotspot: true } })
      ]
    })
  ],
  preview: {
    prepare() {
      return { title: "Site Settings" };
    }
  }
});
