import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { ReportsSections } from "../../../components/sections/ReportsSections";
import { locales, type Locale } from "../../../i18n/config";

type ReportsPageProps = {
  params: {
    locale: string;
  };
};

export async function generateMetadata({ params }: ReportsPageProps): Promise<Metadata> {
  const locale = params.locale as Locale;
  const t = await getTranslations({ locale, namespace: "reports" });

  return {
    title: t("metaTitle"),
    description: t("metaDescription")
  };
}

export default async function ReportsPage({ params }: ReportsPageProps) {
  const locale = params.locale as Locale;

  if (!locales.includes(locale)) {
    notFound();
  }

  return <ReportsSections locale={locale} />;
}
