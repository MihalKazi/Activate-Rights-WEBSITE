import { defineField, defineType } from "sanity";

export const articleSchema = defineType({
  name: "article",
  title: "Article",
  type: "document",
  fields: [
    defineField({ name: "title", type: "localizedString" }),
    defineField({
      name: "slug",
      type: "slug",
      options: { source: "title.en", maxLength: 96 },
      validation: (rule) => rule.required()
    }),
    defineField({ name: "excerpt", type: "localizedText" }),
    defineField({ name: "body", type: "localizedPortableText" }),
    defineField({ name: "coverImage", type: "image", options: { hotspot: true } }),
    defineField({
      name: "author",
      type: "reference",
      to: [{ type: "teamMember" }]
    }),
    defineField({ name: "category", type: "string" }),
    defineField({ name: "publishedAt", type: "datetime" }),
    defineField({ name: "featured", type: "boolean", initialValue: false })
  ],
  preview: {
    select: {
      title: "title.en",
      media: "coverImage",
      subtitle: "publishedAt"
    }
  }
});
