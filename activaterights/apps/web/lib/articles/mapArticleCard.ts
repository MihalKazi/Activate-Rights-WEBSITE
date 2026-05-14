import type { Image } from "sanity";
import type { Locale } from "../../i18n/config";
import { formatCalendarDayMonthYear, formatCalendarDdMmYyyyUtc } from "../datetime/formatCalendarDisplay";
import { articleCategoryToFilter, formatArticleCategory } from "./articleCategories";
import { urlFor } from "../sanity/image";
import type { ArticleListItem } from "../sanity/queries";
import type { ArticleListItem as ArticleCardRow } from "../../components/sections/ArticlesListClient";

function formatPublished(iso: string, locale: Locale): string {
  return locale === "bn" ? formatCalendarDayMonthYear(iso, "bn") : formatCalendarDdMmYyyyUtc(iso);
}

export function mapArticleToCardRow(row: ArticleListItem, locale: Locale): ArticleCardRow {
  const author =
    row.authorName?.trim() ||
    (locale === "bn" ? "অ্যাক্টিভেট রাইটস" : "Activate Rights");

  const metaCategory = formatArticleCategory(row.category, locale);

  const coverSrc = row.coverImage?.asset?._ref
    ? urlFor(row.coverImage as Image)
        .width(380)
        .height(228)
        .fit("crop")
        .auto("format")
        .url()
    : undefined;

  const slug =
    row.slug && typeof row.slug === "object" && "current" in row.slug && row.slug.current
      ? row.slug.current
      : "";

  return {
    slug,
    title: row.title?.trim() || (locale === "bn" ? "শিরোনামহীন" : "Untitled"),
    author,
    metaCategory,
    filter: articleCategoryToFilter(row.category),
    accentTitle: Boolean(row.featured),
    coverSrc,
    publishedAt: formatPublished(row.publishedAt, locale)
  };
}

/** Home “updates and blog” row — same CMS data as /articles, with excerpt + larger cover. */
export type HomeArticleCard = {
  slug: string;
  title: string;
  excerpt: string | null;
  coverSrc: string | null;
  metaCategory: string;
  author: string;
  accentTitle: boolean;
};

export function mapArticleToHomeRow(row: ArticleListItem, locale: Locale): HomeArticleCard {
  const card = mapArticleToCardRow(row, locale);
  const excerpt =
    row.excerpt && typeof row.excerpt === "string" && row.excerpt.trim().length > 0
      ? row.excerpt.trim()
      : null;
  const coverSrc = row.coverImage?.asset?._ref
    ? urlFor(row.coverImage as Image)
        .width(642)
        .height(390)
        .fit("crop")
        .auto("format")
        .url()
    : null;
  return {
    slug: card.slug,
    title: card.title,
    excerpt,
    coverSrc,
    metaCategory: card.metaCategory,
    author: card.author,
    accentTitle: card.accentTitle
  };
}
