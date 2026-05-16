import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import type { Image as SanityImage } from "sanity";
import { ReportDetailSections } from "../../../../components/sections/ReportDetailSections";
import { locales, type Locale } from "../../../../i18n/config";
import { withLocaleSeo } from "../../../../lib/seo/buildPageMetadata";
import { urlFor } from "../../../../lib/sanity/image";
import { getAllReportSlugs, getReportBySlug } from "../../../../lib/sanity/queries";

export const revalidate = 120;

type Props = {
  params: { locale: string; slug: string };
};

export async function generateStaticParams() {
  const slugs = await getAllReportSlugs();
  return locales.flatMap((locale) => slugs.map((slug) => ({ locale, slug })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = params.locale as Locale;
  if (!locales.includes(locale)) {
    return { title: "Report" };
  }

  const t = await getTranslations({ locale, namespace: "reports" });
  const report = await getReportBySlug(params.slug, locale);

  if (!report) {
    return withLocaleSeo(locale, `/reports/${params.slug}`, {
      title: t("metaTitle"),
      description: t("metaDescription")
    });
  }

  const description =
    report.excerpt?.replace(/\s+/g, " ").trim().slice(0, 200) || t("metaDescription");

  const ogImage = report.coverImage?.asset?._ref
    ? urlFor(report.coverImage as SanityImage).width(1200).height(630).fit("crop").auto("format").url()
    : undefined;

  return withLocaleSeo(locale, `/reports/${params.slug}`, {
    title: `${report.title} — Activate Rights`,
    description,
    ogImage,
    openGraph: {
      type: "article",
      publishedTime: report.publishedDate
    }
  });
}

export default async function ReportSlugPage({ params }: Props) {
  const locale = params.locale as Locale;
  if (!locales.includes(locale)) {
    notFound();
  }

  return <ReportDetailSections locale={locale} slug={params.slug} />;
}
