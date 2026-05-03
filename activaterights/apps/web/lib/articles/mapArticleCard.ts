import type { Image } from "sanity";
import type { Locale } from "../../i18n/config";
import { articleCategoryToFilter, formatArticleCategory } from "./articleCategories";
import { urlFor } from "../sanity/image";
import type { ArticleListItem } from "../sanity/queries";
import type { ArticleListItem as ArticleCardRow } from "../../components/sections/ArticlesListClient";

function formatPublished(iso: string, locale: Locale): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  if (locale === "bn") {
    return d.toLocaleDateString("bn-BD", { day: "2-digit", month: "2-digit", year: "numeric" });
  }
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}.${mm}.${yyyy}`;
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
