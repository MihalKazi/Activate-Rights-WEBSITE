import { defineField, defineType } from "sanity";
import { publicationFileAttachmentMember } from "./publicationFileAttachment";

export const reportSchema = defineType({
  name: "report",
  title: "Report",
  type: "document",
  fields: [
    defineField({ name: "title", type: "localizedString", validation: (rule) => rule.required() }),
    defineField({
      name: "slug",
      type: "slug",
      options: { source: "title.en", maxLength: 96 },
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "order",
      title: "Order",
      type: "number",
      description:
        "Lower numbers appear first on /reports and on the home page when home report slots are empty. For exact left/middle/right on home, set Position in “Home page: projects, initiatives & more” → Reports.",
      initialValue: 0,
      validation: (rule) => rule.integer().min(0)
    }),
    defineField({
      name: "publishedDate",
      title: "Published date",
      type: "date",
      validation: (rule) => rule.required()
    }),
    defineField({ name: "coverImage", type: "image", options: { hotspot: true } }),
    defineField({
      name: "titleLeadingSlash",
      title: 'Show green "/" before title on cards',
      type: "boolean",
      initialValue: false
    }),
    defineField({
      name: "excerpt",
      title: "Summary",
      type: "localizedText",
      description: "Optional. Shown on the reports listing and on the home page cards."
    }),
    defineField({ name: "body", type: "localizedPortableText" }),
    defineField({
      name: "attachments",
      title: "Files & media",
      description:
        "PDFs, images, videos, audio, and other files shown on the report page (in addition to links inside the body).",
      type: "array",
      of: [publicationFileAttachmentMember]
    })
  ],
  preview: {
    select: {
      title: "title.en",
      publishedDate: "publishedDate",
      order: "order",
      media: "coverImage"
    },
    prepare({ title, publishedDate, order, media }) {
      const orderLabel = typeof order === "number" ? `Order ${order}` : undefined;
      const dateLabel = publishedDate ? String(publishedDate) : undefined;
      const subtitle = [orderLabel, dateLabel].filter(Boolean).join(" · ");
      return {
        title: title || "Report",
        subtitle: subtitle || undefined,
        media
      };
    }
  }
});
