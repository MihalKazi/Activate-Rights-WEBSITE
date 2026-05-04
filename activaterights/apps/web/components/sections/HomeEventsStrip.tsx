import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { getListedEvents } from "../../lib/sanity/queries";
import type { Locale } from "../../i18n/config";

type HomeEventsStripProps = {
  locale: Locale;
};

export async function HomeEventsStrip({ locale }: HomeEventsStripProps) {
  const t = await getTranslations({ locale, namespace: "homePage" });
  let events: Awaited<ReturnType<typeof getListedEvents>> = [];
  try {
    events = (await getListedEvents(locale)).slice(0, 4);
  } catch {
    return null;
  }

  if (events.length === 0) {
    return null;
  }

  return (
    <section
      className="shrink-0 border-t border-white/25 bg-black/30 px-4 py-3 backdrop-blur-sm md:px-8"
      aria-label={t("recentEventsAria")}
    >
      <div className="mx-auto flex max-w-[1440px] flex-col gap-2 text-[13px] text-white/95 md:flex-row md:items-center md:justify-between md:gap-4 md:text-[14px]">
        <p className="shrink-0 font-medium uppercase tracking-wide text-white/85">{t("recentEvents")}</p>
        <ul className="flex min-w-0 flex-1 flex-wrap items-center gap-x-3 gap-y-1 md:justify-center">
          {events.map((e) => (
            <li key={e._id} className="min-w-0 max-w-[min(100%,220px)] truncate md:max-w-[280px]">
              {e.registrationUrl ? (
                <a
                  href={e.registrationUrl}
                  className="underline decoration-white/35 underline-offset-2 hover:decoration-white"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {e.title}
                </a>
              ) : (
                <span className="truncate opacity-95">{e.title}</span>
              )}
            </li>
          ))}
        </ul>
        <Link
          href={`/${locale}/events`}
          className="shrink-0 font-medium text-white underline decoration-white/40 underline-offset-2 hover:decoration-white"
        >
          {t("viewAllEvents")}
        </Link>
      </div>
    </section>
  );
}
