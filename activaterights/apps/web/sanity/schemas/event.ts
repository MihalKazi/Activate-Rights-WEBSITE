import { defineArrayMember, defineField, defineType } from "sanity";

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
      name: "pdfAttachments",
      title: "PDF attachments",
      description:
        "Upload PDFs to show embedded viewers below the details (same as articles; in addition to any PDF links inside the body).",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "eventPdf",
          title: "PDF",
          fields: [
            defineField({
              name: "title",
              title: "Display title",
              type: "string",
              description: "Optional; defaults to the file name."
            }),
            defineField({
              name: "file",
              title: "PDF file",
              type: "file",
              options: { accept: "application/pdf" },
              validation: (rule) => rule.required()
            })
          ],
          preview: {
            select: { title: "title", filename: "file.asset.originalFilename" },
            prepare({ title, filename }) {
              return { title: title || filename || "PDF", subtitle: "PDF attachment" };
            }
          }
        })
      ]
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
