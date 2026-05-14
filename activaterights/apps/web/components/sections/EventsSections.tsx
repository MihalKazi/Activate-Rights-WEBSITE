import { getTranslations } from "next-intl/server";
import { AboutPartnersClosing } from "../layout/AboutPartnersClosing";
import { Navbar } from "../layout/Navbar";
import type { Locale } from "../../i18n/config";
import { getListedEvents } from "../../lib/sanity/queries";
import { EventList } from "./EventList";

type EventsSectionsProps = {
  locale: Locale;
};

export async function EventsSections({ locale }: EventsSectionsProps) {
  const t = await getTranslations({ locale, namespace: "events" });
  const events = await getListedEvents(locale);

  return (
    <main className="flex min-h-screen flex-col overflow-x-clip bg-[#fafcff] text-neutral-900">
      <header className="events-hero-dark relative min-h-[min(444px,52vh)] text-white">
        <div className="relative z-10">
          <Navbar locale={locale} />
          <div className="mx-auto max-w-[1440px] px-6 pb-14 pt-2 md:px-10 md:pb-16 lg:px-[40px] lg:pb-20">
            <h1 className="projects-hero-title home-headline-font max-w-[min(100%,900px)] text-left text-[clamp(56px,10vw,109px)] leading-[0.92] tracking-tight md:leading-[100px]">
              <span className="block lowercase">{t("heroTitle")}</span>
            </h1>
          </div>
        </div>
      </header>

      {events.length === 0 ? (
        <section className="bg-[#fafcff] py-16 text-neutral-900">
          <div className="container-shell">
            <p className="text-text-secondary max-w-2xl">{t("empty")}</p>
          </div>
        </section>
      ) : (
        <EventList locale={locale} events={events} />
      )}

      <AboutPartnersClosing locale={locale} />
    </main>
  );
}
