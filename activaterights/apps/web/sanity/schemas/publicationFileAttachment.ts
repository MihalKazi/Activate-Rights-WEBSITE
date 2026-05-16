import { defineArrayMember, defineField } from "sanity";

/** Shared Studio object for PDF, image, video, and other uploads on publications. */
export const publicationFileAttachmentMember = defineArrayMember({
  type: "object",
  name: "publicationFileAttachment",
  title: "File",
  fields: [
    defineField({
      name: "title",
      title: "Display title",
      type: "string",
      description: "Optional; defaults to the file name."
    }),
    defineField({
      name: "kind",
      title: "Display as",
      type: "string",
      description: "Leave on Auto-detect unless the preview looks wrong.",
      options: {
        list: [
          { title: "Auto-detect", value: "auto" },
          { title: "PDF", value: "pdf" },
          { title: "Image", value: "image" },
          { title: "Video", value: "video" },
          { title: "Audio", value: "audio" },
          { title: "Other file", value: "file" }
        ],
        layout: "radio"
      },
      initialValue: "auto"
    }),
    defineField({
      name: "file",
      title: "File",
      type: "file",
      description:
        "PDF, images (JPG, PNG, WebP, GIF, SVG), video (MP4, WebM), audio (MP3, WAV), Office documents, ZIP, and more.",
      validation: (rule) => rule.required()
    })
  ],
  preview: {
    select: {
      title: "title",
      kind: "kind",
      filename: "file.asset.originalFilename",
      mimeType: "file.asset.mimeType"
    },
    prepare({ title, kind, filename, mimeType }) {
      const name = title || filename || "File";
      const kindLabel =
        kind && kind !== "auto"
          ? String(kind).toUpperCase()
          : mimeType
            ? String(mimeType)
            : "File";
      return {
        title: name,
        subtitle: kindLabel
      };
    }
  }
});
