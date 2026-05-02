import { getTranslations } from "next-intl/server";
import { AboutFooter } from "../layout/AboutFooter";
import { Navbar } from "../layout/Navbar";
import type { Locale } from "../../i18n/config";
import { ArticlesListClient, type ArticleListItem } from "./ArticlesListClient";

type ArticlesSectionsProps = {
  locale: Locale;
};

export async function ArticlesSections({ locale }: ArticlesSectionsProps) {
  const t = await getTranslations({ locale, namespace: "articles" });
  const tAbout = await getTranslations({ locale, namespace: "about" });

  const rawItems = t.raw("items");
  const items: ArticleListItem[] = Array.isArray(rawItems)
    ? (rawItems as ArticleListItem[]).filter(
        (item) =>
          item &&
          typeof item.slug === "string" &&
          typeof item.title === "string" &&
          typeof item.author === "string" &&
          typeof item.metaCategory === "string" &&
          typeof item.filter === "string" &&
          typeof item.accentTitle === "boolean"
      )
    : [];

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

      <section className="relative px-6 py-12 md:px-10 md:py-16 lg:px-[40px] lg:py-20">
        <div className="articles-listing-grain pointer-events-none absolute inset-0 z-0" aria-hidden />
        <ArticlesListClient
          locale={locale}
          items={items}
          labels={{
            filterAll: t("filterAll"),
            filterOpinion: t("filterOpinion"),
            filterUpdates: t("filterUpdates"),
            filterFeature: t("filterFeature"),
            filterBlah: t("filterBlah"),
            loadMore: t("loadMore")
          }}
        />
      </section>

      <AboutFooter
        locale={locale}
        emailLabel={tAbout("footerEmail")}
        facebookLabel={tAbout("footerFacebook")}
        twitterLabel={tAbout("footerTwitter")}
        instagramLabel={tAbout("footerInstagram")}
        className="bg-[#fafcff]"
        brandClassName="text-[#06b85c]"
      />
    </main>
  );
}
