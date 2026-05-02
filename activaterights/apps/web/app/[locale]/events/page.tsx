import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { EventsSections } from "../../../components/sections/EventsSections";
import { locales, type Locale } from "../../../i18n/config";

type EventsPageProps = {
  params: {
    locale: string;
  };
};

export async function generateMetadata({ params }: EventsPageProps): Promise<Metadata> {
  const locale = params.locale as Locale;
  const t = await getTranslations({ locale, namespace: "events" });

  return {
    title: t("metaTitle"),
    description: t("metaDescription")
  };
}

export default async function EventsPage({ params }: EventsPageProps) {
  const locale = params.locale as Locale;

  if (!locales.includes(locale)) {
    notFound();
  }

  return <EventsSections locale={locale} />;
}
