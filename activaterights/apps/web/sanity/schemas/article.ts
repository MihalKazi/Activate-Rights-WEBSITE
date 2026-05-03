import { defineArrayMember, defineField, defineType } from "sanity";
import {
  ARTICLE_CATEGORY_KEYS,
  ARTICLE_CATEGORY_LABELS
} from "../../lib/articles/articleCategories";

const articleCategoryOptions = ARTICLE_CATEGORY_KEYS.map((key) => ({
  title: ARTICLE_CATEGORY_LABELS[key].en,
  value: key
}));

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
    defineField({
      name: "pdfAttachments",
      title: "PDF attachments",
      description:
        "Upload PDF files here to show embedded viewers below the article text (in addition to any PDF links inside the body).",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "articlePdf",
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
              options: {
                accept: "application/pdf"
              },
              validation: (rule) => rule.required()
            })
          ],
          preview: {
            select: {
              title: "title",
              filename: "file.asset.originalFilename"
            },
            prepare({ title, filename }) {
              return {
                title: title || filename || "PDF",
                subtitle: "PDF attachment"
              };
            }
          }
        })
      ]
    }),
    defineField({ name: "coverImage", type: "image", options: { hotspot: true } }),
    defineField({
      name: "author",
      type: "reference",
      to: [{ type: "teamMember" }]
    }),
    defineField({
      name: "guestAuthor",
      title: "Guest author",
      description: "Plain-text author name when not linked to a team member (e.g. imported from WordPress).",
      type: "string"
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: articleCategoryOptions,
        layout: "dropdown"
      }
    }),
    defineField({ name: "publishedAt", type: "datetime" }),
    defineField({ name: "featured", type: "boolean", initialValue: false }),
    defineField({
      name: "relatedArticles",
      title: "Related writings",
      description:
        "Optional articles to show at the bottom of this page under “Relevant writings”. Leave empty to hide the section.",
      type: "array",
      of: [
        defineArrayMember({
          type: "reference",
          to: [{ type: "article" }]
        })
      ],
      validation: (rule) => rule.unique().max(6)
    })
  ],
  preview: {
    select: {
      title: "title.en",
      media: "coverImage",
      subtitle: "publishedAt"
    }
  }
});
