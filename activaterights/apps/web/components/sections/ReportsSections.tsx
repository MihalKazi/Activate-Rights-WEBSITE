import Image from "next/image";
import Link from "next/link";
import { Roboto_Mono } from "next/font/google";
import { getTranslations } from "next-intl/server";
import { AboutPartnersClosing } from "../layout/AboutPartnersClosing";
import { Navbar } from "../layout/Navbar";
import type { Locale } from "../../i18n/config";
import { formatReportCardDate } from "../../lib/reports/formatReportDate";
import { mapReportRowsToListingCards } from "../../lib/reports/mapReportListingCards";
import { getAllReports } from "../../lib/sanity/queries";

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap"
});

type ReportsSectionsProps = {
  locale: Locale;
};

export async function ReportsSections({ locale }: ReportsSectionsProps) {
  const t = await getTranslations({ locale, namespace: "reports" });

  let items = mapReportRowsToListingCards([]);
  try {
    const rows = await getAllReports(locale);
    items = mapReportRowsToListingCards(rows);
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("[ReportsSections] Sanity fetch failed:", error);
    }
  }

  return (
    <main className="flex min-h-screen flex-col overflow-x-clip bg-[#fafcff] text-neutral-900">
      <header className="projects-grain-green relative text-white">
        <div className="relative z-10">
          <Navbar locale={locale} />
          <div className="mx-auto max-w-[1440px] px-6 pb-14 pt-2 md:px-10 md:pb-16 lg:px-[40px] lg:pb-20">
            <h1 className="projects-hero-title home-headline-font max-w-[min(100%,900px)] text-left text-[clamp(56px,10vw,109px)] leading-[0.92] tracking-tight md:leading-[100px]">
              <span className="block lowercase">{t("heroLine1")}</span>
              <span className="block lowercase">{t("heroLine2")}</span>
            </h1>
          </div>
        </div>
      </header>

      <section className="relative px-6 py-16 md:px-10 md:py-20 lg:px-[40px] lg:py-24">
        <div className="reports-body-grain pointer-events-none absolute inset-0 z-0" aria-hidden />
        <div className="relative z-10 mx-auto grid max-w-[1360px] grid-cols-1 gap-x-[72px] gap-y-14 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-[92px] lg:gap-y-16">
          {items.length === 0 ? (
            <p className={`col-span-full text-center text-[17px] text-[#212121]/80 ${robotoMono.className}`}>
              {t("empty")}
            </p>
          ) : null}
          {items.map((item) => (
            <article key={item.slug} className="min-w-0">
              <Link
                href={`/${locale}/reports/${item.slug}`}
                className="group block outline-none focus-visible:ring-2 focus-visible:ring-[#303ccf] focus-visible:ring-offset-2 focus-visible:ring-offset-[#fafcff]"
              >
                <div className="relative aspect-[313/424] w-full overflow-hidden bg-[#d9d9d9] transition-colors group-hover:bg-[#cfcfcf]">
                  {item.coverUrl ? (
                    <Image
                      src={item.coverUrl}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  ) : null}
                </div>
                <h2 className="home-headline-font mt-10 text-[28px] font-normal leading-none text-[#212121] md:text-[30px]">
                  {item.titleLeadingSlash ? (
                    <>
                      <span className="text-[#05b557]">/</span>
                      <span>{` ${item.title}`}</span>
                    </>
                  ) : (
                    item.title
                  )}
                </h2>
                {item.date ? (
                  <p
                    className={`${robotoMono.className} mt-4 text-[14px] font-normal leading-[26px] text-[#a6a6a6]`}
                  >
                    {formatReportCardDate(item.date, locale)}
                  </p>
                ) : null}
                {item.excerpt ? (
                  <p className="mt-4 text-[16px] leading-[1.45] text-[#212121]/85">{item.excerpt}</p>
                ) : null}
              </Link>
            </article>
          ))}
        </div>
      </section>

      <AboutPartnersClosing locale={locale} />
    </main>
  );
}
