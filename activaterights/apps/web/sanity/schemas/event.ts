import { defineField, defineType } from "sanity";

export const eventSchema = defineType({
  name: "event",
  title: "Event",
  type: "document",
  fields: [
    defineField({ name: "title", type: "localizedString" }),
    defineField({
      name: "slug",
      type: "slug",
      options: { source: "title.en", maxLength: 96 },
      validation: (rule) => rule.required()
    }),
    defineField({ name: "description", type: "localizedText" }),
    defineField({ name: "date", type: "datetime" }),
    defineField({ name: "location", type: "localizedString" }),
    defineField({ name: "isOnline", type: "boolean", initialValue: false }),
    defineField({ name: "registrationUrl", type: "url" }),
    defineField({ name: "coverImage", type: "image", options: { hotspot: true } })
  ],
  preview: {
    select: {
      title: "title.en",
      subtitle: "date",
      media: "coverImage"
    }
  }
});
