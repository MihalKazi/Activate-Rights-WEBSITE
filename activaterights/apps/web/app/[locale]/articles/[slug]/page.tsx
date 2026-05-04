import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import type { Image as SanityImage } from "sanity";
import { ArticleDetailSections } from "../../../../components/sections/ArticleDetailSections";
import { locales, type Locale } from "../../../../i18n/config";
import { withLocaleSeo } from "../../../../lib/seo/buildPageMetadata";
import { urlFor } from "../../../../lib/sanity/image";
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
    return withLocaleSeo(locale, `/articles/${params.slug}`, {
      title: t("metaTitle"),
      description: t("metaDescription")
    });
  }

  const description =
    article.excerpt?.replace(/\s+/g, " ").trim().slice(0, 200) || t("metaDescription");

  const ogImage = article.coverImage?.asset?._ref
    ? urlFor(article.coverImage as SanityImage).width(1200).height(630).fit("crop").auto("format").url()
    : undefined;

  return withLocaleSeo(locale, `/articles/${params.slug}`, {
    title: `${article.title} — Activate Rights`,
    description,
    ogImage,
    openGraph: {
      type: "article",
      publishedTime: article.publishedAt,
      ...(article.category ? { section: article.category } : {})
    }
  });
}

export default async function ArticleSlugPage({ params }: ArticleSlugPageProps) {
  const locale = params.locale as Locale;

  if (!locales.includes(locale)) {
    notFound();
  }

  return <ArticleDetailSections locale={locale} slug={params.slug} />;
}
