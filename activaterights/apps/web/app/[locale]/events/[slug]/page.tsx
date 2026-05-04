import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import type { Image as SanityImage } from "sanity";
import { EventDetailSections } from "../../../../components/sections/EventDetailSections";
import { locales, type Locale } from "../../../../i18n/config";
import { withLocaleSeo } from "../../../../lib/seo/buildPageMetadata";
import { urlFor } from "../../../../lib/sanity/image";
import { getAllEventSlugs, getEventBySlug } from "../../../../lib/sanity/queries";

export const dynamic = "force-dynamic";

type EventSlugPageProps = {
  params: {
    locale: string;
    slug: string;
  };
};

export async function generateStaticParams() {
  const slugs = await getAllEventSlugs();
  return locales.flatMap((locale) => slugs.map((slug) => ({ locale, slug })));
}

export async function generateMetadata({ params }: EventSlugPageProps): Promise<Metadata> {
  const locale = params.locale as Locale;
  if (!locales.includes(locale)) {
    return { title: "Event" };
  }

  const t = await getTranslations({ locale, namespace: "events" });
  const event = await getEventBySlug(params.slug, locale);

  if (!event) {
    return withLocaleSeo(locale, `/events/${params.slug}`, {
      title: t("metaTitle"),
      description: t("metaDescription")
    });
  }

  const description =
    (event.description ?? "").replace(/\s+/g, " ").trim().slice(0, 200) || t("metaDescription");

  const ogImage = event.coverImage?.asset?._ref
    ? urlFor(event.coverImage as SanityImage).width(1200).height(630).fit("crop").auto("format").url()
    : undefined;

  return withLocaleSeo(locale, `/events/${params.slug}`, {
    title: `${event.title} — Activate Rights`,
    description,
    ogImage,
    openGraph: {
      type: "website"
    }
  });
}

export default async function EventSlugPage({ params }: EventSlugPageProps) {
  const locale = params.locale as Locale;

  if (!locales.includes(locale)) {
    notFound();
  }

  return <EventDetailSections locale={locale} slug={params.slug} />;
}
