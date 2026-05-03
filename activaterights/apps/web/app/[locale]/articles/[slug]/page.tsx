import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { ArticleDetailSections } from "../../../../components/sections/ArticleDetailSections";
import { locales, type Locale } from "../../../../i18n/config";
import { getAllArticleSlugs, getArticleBySlug } from "../../../../lib/sanity/queries";

export const dynamic = "force-dynamic";

type ArticleSlugPageProps = {
  params: {
    locale: string;
    slug: string;
  };
};

export async function generateStaticParams() {
  const slugs = await getAllArticleSlugs();
  return locales.flatMap((locale) => slugs.map((slug) => ({ locale, slug })));
}

export async function generateMetadata({ params }: ArticleSlugPageProps): Promise<Metadata> {
  const locale = params.locale as Locale;
  if (!locales.includes(locale)) {
    return { title: "Article" };
  }

  const t = await getTranslations({ locale, namespace: "articles" });
  const article = await getArticleBySlug(params.slug, locale);

  if (!article) {
    return { title: t("metaTitle"), description: t("metaDescription") };
  }

  const description =
    article.excerpt?.replace(/\s+/g, " ").trim().slice(0, 200) || t("metaDescription");

  return {
    title: `${article.title} — Activate Rights`,
    description
  };
}

export default async function ArticleSlugPage({ params }: ArticleSlugPageProps) {
  const locale = params.locale as Locale;

  if (!locales.includes(locale)) {
    notFound();
  }

  return <ArticleDetailSections locale={locale} slug={params.slug} />;
}
