import { Space_Mono } from "next/font/google";
import type { Image as SanityImage } from "sanity";
import { getTranslations } from "next-intl/server";
import { AboutPartnersClosing } from "../layout/AboutPartnersClosing";
import { Navbar } from "../layout/Navbar";
import type { Locale } from "../../i18n/config";
import {
  formatEventDateParts,
  formatEventListingPlace
} from "../../lib/events/formatEventListing";
import { truncateExcerpt } from "../../lib/publication/truncateExcerpt";
import { urlFor } from "../../lib/sanity/image";
import { getListedEvents } from "../../lib/sanity/queries";
import { cn } from "../../lib/utils";
import { EventsListClient, type EventListItem } from "./EventsListClient";

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap"
});

type EventsSectionsProps = {
  locale: Locale;
};

export async function EventsSections({ locale }: EventsSectionsProps) {
  const t = await getTranslations({ locale, namespace: "events" });

  const rows = await getListedEvents(locale);
  const placeLabels = { online: t("online"), locationTbd: t("locationTbd") };

  const items: EventListItem[] = rows
    .filter((e) => e?.slug?.current && typeof e.title === "string")
    .map((e) => {
      const slug = e.slug.current.trim();
      const title = e.title.trim() || "Event";
      const { day, month, year } = formatEventDateParts(e.date, locale);
      const coverUrl =
        e.coverImage?.asset?._ref != null
          ? urlFor(e.coverImage as SanityImage)
              .width(1200)
              .height(720)
              .fit("crop")
              .auto("format")
              .quality(85)
              .url()
          : null;

      return {
        key: e._id,
        title,
        href: `/${locale}/events/${slug}`,
        coverUrl,
        day,
        month,
        year,
        placeLabel: formatEventListingPlace(e, placeLabels),
        isOnline: e.isOnline,
        excerpt: truncateExcerpt(e.description),
        ctaLabel: t("viewEvent"),
        ctaAria: `${t("viewEventAria")}: ${title}`
      };
    });

  return (
    <main className="flex min-h-screen flex-col overflow-x-clip site-white-section text-neutral-900">
      <header className="projects-grain-green relative text-white">
        <div className="relative z-10">
          <Navbar locale={locale} />
          <div className="mx-auto max-w-[1440px] px-6 pb-14 pt-2 md:px-10 md:pb-16 lg:px-[40px] lg:pb-20">
            <h1 className="projects-hero-title home-headline-font max-w-[min(100%,900px)] text-left text-[clamp(56px,10vw,109px)] lowercase leading-[0.92] tracking-tight text-white md:leading-[100px]">
              {t("heroTitle")}
            </h1>
            <p
              className={cn(
                "mt-6 max-w-[min(100%,560px)] text-[clamp(14px,1.6vw,18px)] font-normal leading-[1.55] text-white/85 md:mt-8",
                spaceMono.className
              )}
            >
              {t("listingIntro")}
            </p>
          </div>
        </div>
      </header>

      <section className="site-white-section px-6 py-12 md:px-10 md:py-16 lg:px-[40px] lg:py-20">
        <div className="mx-auto w-full max-w-[1200px]">
          <EventsListClient
            items={items}
            labels={{
              empty: t("empty"),
              loadMore: t("loadMore"),
              eventKind: t("eventKind")
            }}
          />
        </div>
      </section>

      <AboutPartnersClosing locale={locale} />
    </main>
  );
}
