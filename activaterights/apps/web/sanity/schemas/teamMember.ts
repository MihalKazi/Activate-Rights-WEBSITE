import { defineArrayMember, defineField, defineType } from "sanity";

export const teamMemberSchema = defineType({
  name: "teamMember",
  title: "Team Member",
  type: "document",
  fields: [
    defineField({ name: "name", type: "localizedString" }),
    defineField({ name: "role", type: "localizedString" }),
    defineField({ name: "bio", type: "localizedText" }),
    defineField({
      name: "asciiPhoto",
      title: "ASCII / stylized image",
      description: "Shown by default on the About page; hover reveals the photo below.",
      type: "image",
      options: { hotspot: true }
    }),
    defineField({
      name: "photo",
      title: "Photo (real)",
      description: "Shown when hovering or focusing the card on About.",
      type: "image",
      options: { hotspot: true }
    }),
    defineField({
      name: "socialLinks",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "platform", type: "string" }),
            defineField({ name: "url", type: "url" })
          ]
        })
      ]
    })
  ],
  preview: {
    select: {
      title: "name.en",
      subtitle: "role.en",
      media: "asciiPhoto"
    }
  }
});
