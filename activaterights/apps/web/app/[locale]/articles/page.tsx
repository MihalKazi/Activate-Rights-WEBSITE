import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { ArticlesSections } from "../../../components/sections/ArticlesSections";
import { locales, type Locale } from "../../../i18n/config";

/** Always fetch fresh article list from Sanity (avoid stale static shell). */
export const dynamic = "force-dynamic";

type ArticlesPageProps = {
  params: {
    locale: string;
  };
};

export async function generateMetadata({ params }: ArticlesPageProps): Promise<Metadata> {
  const locale = params.locale as Locale;
  const t = await getTranslations({ locale, namespace: "articles" });

  return {
    title: t("metaTitle"),
    description: t("metaDescription")
  };
}

export default async function ArticlesPage({ params }: ArticlesPageProps) {
  const locale = params.locale as Locale;

  if (!locales.includes(locale)) {
    notFound();
  }

  return <ArticlesSections locale={locale} />;
}
