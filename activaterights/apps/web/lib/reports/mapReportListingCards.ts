import type { Image as SanityImage } from "sanity";
import { urlFor } from "../sanity/image";
import type { ReportItem } from "../sanity/queries";

export type ReportListingCard = {
  slug: string;
  title: string;
  titleLeadingSlash: boolean;
  /** YYYY-MM-DD when set in Sanity */
  date: string;
  coverUrl: string | null;
  excerpt: string | null;
};

function reportCoverUrl(coverImage: ReportItem["coverImage"]): string | null {
  if (coverImage?.asset?._ref == null) return null;
  try {
    return urlFor(coverImage as SanityImage)
      .width(626)
      .height(848)
      .fit("crop")
      .auto("format")
      .quality(85)
      .url();
  } catch {
    return null;
  }
}

/** Listing + home cards — only requires a slug; skips broken image URLs instead of failing the whole page. */
export function mapReportRowsToListingCards(rows: ReportItem[]): ReportListingCard[] {
  return rows
    .filter((r) => typeof r?.slug?.current === "string" && r.slug.current.trim().length > 0)
    .map((r) => {
      const slug = r.slug.current.trim();
      const title =
        typeof r.title === "string" && r.title.trim().length > 0 ? r.title.trim() : "Report";
      const date =
        typeof r.publishedDate === "string" && r.publishedDate.trim().length > 0
          ? r.publishedDate.trim()
          : "";
      const excerpt =
        typeof r.excerpt === "string" && r.excerpt.trim().length > 0 ? r.excerpt.trim() : null;
      return {
        slug,
        title,
        titleLeadingSlash: Boolean(r.titleLeadingSlash),
        date,
        coverUrl: reportCoverUrl(r.coverImage),
        excerpt
      };
    });
}
