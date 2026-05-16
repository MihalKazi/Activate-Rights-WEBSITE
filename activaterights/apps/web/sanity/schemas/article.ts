import { defineArrayMember, defineField, defineType } from "sanity";
import {
  ARTICLE_CATEGORY_KEYS,
  ARTICLE_CATEGORY_LABELS
} from "../../lib/articles/articleCategories";
import { publicationFileAttachmentMember } from "./publicationFileAttachment";

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
      name: "attachments",
      title: "Files & media",
      description:
        "PDFs, images, videos, audio, and other files below the article (in addition to links inside the body).",
      type: "array",
      of: [publicationFileAttachmentMember]
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
