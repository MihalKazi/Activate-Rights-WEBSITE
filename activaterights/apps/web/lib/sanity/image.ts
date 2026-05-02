import createImageUrlBuilder from "@sanity/image-url";
import type { Image } from "sanity";
import { sanityClient } from "./client";

const builder = createImageUrlBuilder(sanityClient);

export function urlFor(source: Image) {
  return builder.image(source);
}

/** Square crop URLs for About team cards; returns null if asset missing. */
export function cardImageUrl(
  source: { asset?: { _ref?: string } } | undefined,
  size = 816
): string | null {
  if (!source?.asset?._ref) return null;
  return urlFor(source as Image)
    .width(size)
    .height(size)
    .fit("crop")
    .auto("format")
    .quality(85)
    .url();
}
