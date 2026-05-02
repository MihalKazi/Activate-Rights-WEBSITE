import { defineField, defineType } from "sanity";
import { articleSchema } from "./article";
import { campaignSchema } from "./campaign";
import { eventSchema } from "./event";
import { projectSchema } from "./project";
import { siteSettingsSchema } from "./siteSettings";
import { teamMemberSchema } from "./teamMember";

const localizedString = defineType({
  name: "localizedString",
  title: "Localized String",
  type: "object",
  fields: [
    defineField({ name: "en", title: "English", type: "string" }),
    defineField({ name: "bn", title: "Bangla", type: "string" })
  ]
});

const localizedText = defineType({
  name: "localizedText",
  title: "Localized Text",
  type: "object",
  fields: [
    defineField({ name: "en", title: "English", type: "text", rows: 4 }),
    defineField({ name: "bn", title: "Bangla", type: "text", rows: 4 })
  ]
});

const localizedPortableText = defineType({
  name: "localizedPortableText",
  title: "Localized Portable Text",
  type: "object",
  fields: [
    defineField({
      name: "en",
      title: "English",
      type: "array",
      of: [{ type: "block" }]
    }),
    defineField({
      name: "bn",
      title: "Bangla",
      type: "array",
      of: [{ type: "block" }]
    })
  ]
});

export const schemaTypes = [
  localizedString,
  localizedText,
  localizedPortableText,
  articleSchema,
  projectSchema,
  eventSchema,
  campaignSchema,
  teamMemberSchema,
  siteSettingsSchema
];
