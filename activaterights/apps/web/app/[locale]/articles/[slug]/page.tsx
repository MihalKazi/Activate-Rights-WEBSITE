import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { ArticleDetailSections } from "../../../../components/sections/ArticleDetailSections";
import { locales, type Locale } from "../../../../i18n/config";

type ArticleSlugPageProps = {
  params: {
    locale: string;
    slug: string;
  };
};

function parseSlugs(raw: unknown): { slug: string; title: string }[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((item): item is Record<string, unknown> => item !== null && typeof item === "object")
    .filter((item) => typeof item.slug === "string" && typeof item.title === "string")
    .map((item) => ({ slug: item.slug as string, title: item.title as string }));
}

export async function generateMetadata({ params }: ArticleSlugPageProps): Promise<Metadata> {
  const locale = params.locale as Locale;
  if (!locales.includes(locale)) {
    return { title: "Article" };
  }

  const t = await getTranslations({ locale, namespace: "articles" });
  const items = parseSlugs(t.raw("items"));
  const hit = items.find((i) => i.slug === params.slug);

  if (!hit) {
    return { title: t("metaTitle") };
  }

  return {
    title: `${hit.title} — Activate Rights`,
    description: t("metaDescription")
  };
}

export default async function ArticleSlugPage({ params }: ArticleSlugPageProps) {
  const locale = params.locale as Locale;

  if (!locales.includes(locale)) {
    notFound();
  }

  return <ArticleDetailSections locale={locale} slug={params.slug} />;
}
