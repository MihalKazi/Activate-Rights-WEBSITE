import type { Locale } from "../../i18n/config";
import type { ArticleListItem as ArticleCardRow } from "../../components/sections/ArticlesListClient";

/** Stored in Sanity `article.category` (dropdown value). */
export const ARTICLE_CATEGORY_KEYS = [
  "report",
  "update",
  "opinion",
  "intervention",
  "resource",
  "translation",
  "interview"
] as const;

export type ArticleCategoryKey = (typeof ARTICLE_CATEGORY_KEYS)[number];

export const ARTICLE_CATEGORY_LABELS: Record<
  ArticleCategoryKey,
  { en: string; bn: string }
> = {
  report: { en: "Report", bn: "প্রতিবেদন" },
  update: { en: "Update", bn: "আপডেট" },
  opinion: { en: "Opinion", bn: "মতামত" },
  intervention: { en: "Intervention", bn: "হস্তক্ষেপ" },
  resource: { en: "Resource", bn: "রিসোর্স" },
  translation: { en: "Translation", bn: "অনুবাদ" },
  interview: { en: "Interview", bn: "সাক্ষাৎকার" }
};

/** Maps stored or legacy WordPress labels to a canonical key. */
export function canonicalArticleCategory(raw: string | null | undefined): ArticleCategoryKey | null {
  if (!raw?.trim()) return null;
  const s = raw.trim();
  const lower = s.toLowerCase();
  if ((ARTICLE_CATEGORY_KEYS as readonly string[]).includes(lower)) {
    return lower as ArticleCategoryKey;
  }
  if (/report/i.test(s)) return "report";
  if (/update/i.test(s)) return "update";
  if (/opinion/i.test(s)) return "opinion";
  if (/intervention/i.test(s)) return "intervention";
  if (/resource/i.test(s) || s.includes("রিসোর্স")) return "resource";
  if (/translation/i.test(s) || s.includes("অনুবাদ")) return "translation";
  if (/interview/i.test(s) || s.includes("সাক্ষাৎকার")) return "interview";
  return null;
}

export function formatArticleCategory(raw: string | null | undefined, locale: Locale): string {
  const key = canonicalArticleCategory(raw);
  if (key) {
    return locale === "bn" ? ARTICLE_CATEGORY_LABELS[key].bn : ARTICLE_CATEGORY_LABELS[key].en;
  }
  const trimmed = raw?.trim();
  if (trimmed) return trimmed;
  return locale === "bn" ? "আর্টিকেল" : "Article";
}

export function articleCategoryToFilter(raw: string | null | undefined): ArticleCardRow["filter"] {
  const key = canonicalArticleCategory(raw);
  if (key === "opinion") return "opinion";
  if (key === "update") return "updates";
  if (key === "report") return "feature";
  const c = (raw || "").toLowerCase();
  if (c.includes("opinion")) return "opinion";
  if (c.includes("update")) return "updates";
  if (c.includes("report")) return "feature";
  return "blah";
}
