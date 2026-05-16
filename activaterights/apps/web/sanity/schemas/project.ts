import { defineField, defineType } from "sanity";
import { publicationFileAttachmentMember } from "./publicationFileAttachment";

export const projectSchema = defineType({
  name: "project",
  title: "Project",
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
      type: "localizedPortableText",
      description: "Long-form project page content shown below the short description."
    }),
    defineField({
      name: "attachments",
      title: "Files & media",
      description: "PDFs, images, videos, audio, and other files on the project page.",
      type: "array",
      of: [publicationFileAttachmentMember]
    }),
    defineField({
      name: "status",
      type: "string",
      options: {
        list: [
          { title: "Active", value: "active" },
          { title: "Completed", value: "completed" },
          { title: "Ongoing", value: "ongoing" }
        ]
      }
    }),
    defineField({ name: "coverImage", type: "image", options: { hotspot: true } }),
    defineField({
      name: "launchDate",
      title: "Card date",
      type: "date",
      description: "Shown on home and listings (e.g. 19/02/2024). Optional."
    }),
    defineField({ name: "externalUrl", type: "url" }),
    defineField({ name: "order", type: "number", initialValue: 0 })
  ],
  preview: {
    select: {
      title: "title.en",
      subtitle: "status",
      media: "coverImage"
    }
  }
});
