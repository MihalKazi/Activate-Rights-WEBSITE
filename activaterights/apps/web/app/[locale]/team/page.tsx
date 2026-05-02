import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { ContactSections } from "../../../components/sections/ContactSections";
import { locales, type Locale } from "../../../i18n/config";

type TeamPageProps = {
  params: {
    locale: string;
  };
};

export async function generateMetadata({ params }: TeamPageProps): Promise<Metadata> {
  const locale = params.locale as Locale;
  const t = await getTranslations({ locale, namespace: "contact" });

  return {
    title: t("metaTitle"),
    description: t("metaDescription")
  };
}

export default async function TeamPage({ params }: TeamPageProps) {
  const locale = params.locale as Locale;

  if (!locales.includes(locale)) {
    notFound();
  }

  return <ContactSections locale={locale} />;
}
