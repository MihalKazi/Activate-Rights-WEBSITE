import { Space_Mono } from "next/font/google";
import { getTranslations } from "next-intl/server";
import { AboutPartnersClosing } from "../layout/AboutPartnersClosing";
import { Navbar } from "../layout/Navbar";
import type { Locale } from "../../i18n/config";
import { mapArticleToCardRow } from "../../lib/articles/mapArticleCard";
import { getAllArticles } from "../../lib/sanity/queries";
import { cn } from "../../lib/utils";
import { ArticlesListClient } from "./ArticlesListClient";

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap"
});

type ArticlesSectionsProps = {
  locale: Locale;
};

export async function ArticlesSections({ locale }: ArticlesSectionsProps) {
  const t = await getTranslations({ locale, namespace: "articles" });

  const rows = await getAllArticles(locale);
  const items = rows
    .filter((row) => row.slug?.current && String(row.slug.current).length > 0)
    .map((row) => mapArticleToCardRow(row, locale));

  return (
    <main className="flex min-h-screen flex-col overflow-x-clip site-white-section text-neutral-900">
      <header className="projects-grain-green relative text-white">
        <div className="relative z-10">
          <Navbar locale={locale} />
          <div className="mx-auto max-w-[1440px] px-6 pb-14 pt-2 md:px-10 md:pb-16 lg:px-[40px] lg:pb-20">
            <h1 className="projects-hero-title home-headline-font max-w-[min(100%,900px)] text-left text-[clamp(56px,10vw,109px)] leading-[0.92] tracking-tight md:leading-[100px]">
              <span className="block lowercase">{t("heroLine1")}</span>
              <span className="block lowercase">{t("heroLine2")}</span>
            </h1>
            <p
              className={cn(
                "mt-6 max-w-[min(100%,560px)] text-[clamp(14px,1.6vw,18px)] font-normal leading-[1.55] text-white/88 md:mt-8",
                spaceMono.className
              )}
            >
              {t("listingIntro")}
            </p>
          </div>
        </div>
      </header>

      <section className="site-white-section px-6 py-12 md:px-10 md:py-16 lg:px-[40px] lg:py-20">
        <ArticlesListClient
          locale={locale}
          items={items}
          labels={{
            filterAll: t("filterAll"),
            filterOpinion: t("filterOpinion"),
            filterUpdates: t("filterUpdates"),
            filterFeature: t("filterFeature"),
            filterBlah: t("filterBlah"),
            loadMore: t("loadMore"),
            readAction: t("readAction"),
            empty: t("emptyListing")
          }}
        />
      </section>

      <AboutPartnersClosing locale={locale} />
    </main>
  );
}
