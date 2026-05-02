import { defineField, defineType } from "sanity";

export const campaignSchema = defineType({
  name: "campaign",
  title: "Campaign",
  type: "document",
  fields: [
    defineField({ name: "title", type: "localizedString" }),
    defineField({
      name: "slug",
      type: "slug",
      options: { source: "title.en", maxLength: 96 },
      validation: (rule) => rule.required()
    }),
    defineField({ name: "summary", type: "localizedText" }),
    defineField({ name: "body", type: "localizedPortableText" }),
    defineField({
      name: "status",
      type: "string",
      options: {
        list: [
          { title: "Active", value: "active" },
          { title: "Ended", value: "ended" }
        ]
      }
    }),
    defineField({ name: "coverImage", type: "image", options: { hotspot: true } }),
    defineField({ name: "startDate", type: "datetime" }),
    defineField({ name: "endDate", type: "datetime" })
  ],
  preview: {
    select: {
      title: "title.en",
      subtitle: "status",
      media: "coverImage"
    }
  }
});
