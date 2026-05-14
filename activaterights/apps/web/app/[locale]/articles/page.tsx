import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { ArticlesSections } from "../../../components/sections/ArticlesSections";
import { locales, type Locale } from "../../../i18n/config";
import { withLocaleSeo } from "../../../lib/seo/buildPageMetadata";

/** ISR: fast edge cache; revalidate pulls fresh list from Sanity periodically. */
export const revalidate = 120;

type ArticlesPageProps = {
  params: {
    locale: string;
  };
};

export async function generateMetadata({ params }: ArticlesPageProps): Promise<Metadata> {
  const locale = params.locale as Locale;
  const t = await getTranslations({ locale, namespace: "articles" });

  return withLocaleSeo(locale, "/articles", {
    title: t("metaTitle"),
    description: t("metaDescription")
  });
}

export default async function ArticlesPage({ params }: ArticlesPageProps) {
  const locale = params.locale as Locale;

  if (!locales.includes(locale)) {
    notFound();
  }

  return <ArticlesSections locale={locale} />;
}
