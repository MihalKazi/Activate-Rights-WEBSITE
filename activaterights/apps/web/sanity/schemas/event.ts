import { defineField, defineType } from "sanity";
import { publicationFileAttachmentMember } from "./publicationFileAttachment";

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
    defineField({
      name: "body",
      title: "Details",
      description: "Optional long-form content (same rich text as articles). Shown on the event page below the short description.",
      type: "localizedPortableText"
    }),
    defineField({
      name: "attachments",
      title: "Files & media",
      description:
        "PDFs, images, videos, audio, and other files on the event page (in addition to links inside the body).",
      type: "array",
      of: [publicationFileAttachmentMember]
    }),
    defineField({ name: "date", type: "datetime" }),
    defineField({ name: "location", type: "localizedString" }),
    defineField({ name: "isOnline", type: "boolean", initialValue: false }),
    defineField({
      name: "registrationUrl",
      title: "Registration / external link",
      type: "url",
      description:
        "Opens in a new tab from the event page. The public URL is always /events/[slug] — not a direct card link."
    }),
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
