import Image from "next/image";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { Roboto_Mono } from "next/font/google";
import { AboutFooter } from "../layout/AboutFooter";
import { Navbar } from "../layout/Navbar";
import type { Locale } from "../../i18n/config";
import { ARTICLE_ROW_RULE_CLASS, type ArticleListItem } from "./ArticlesListClient";
import { ArticleShareButton } from "./ArticleShareButton";
import { cn } from "../../lib/utils";

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap"
});

/** Listing row + optional body copy for detail view */
export type ArticleDetailItem = ArticleListItem & {
  bodyLines?: string[];
};

type ArticleDetailSectionsProps = {
  locale: Locale;
  slug: string;
};

function parseArticleItems(raw: unknown): ArticleDetailItem[] {
  if (!Array.isArray(raw)) return [];
  return raw.filter((item): item is ArticleDetailItem => {
    if (!item || typeof item !== "object") return false;
    const r = item as Record<string, unknown>;
    return (
      typeof r.slug === "string" &&
      typeof r.title === "string" &&
      typeof r.author === "string" &&
      typeof r.metaCategory === "string" &&
      typeof r.filter === "string" &&
      typeof r.accentTitle === "boolean"
    );
  });
}

/** Figma 34:1065 — Stack Sans Regular 22px / 26px (not mono) */
const articleBodyClass =
  'max-w-[784px] space-y-6 font-[\'Stack Sans Notch\',sans-serif] text-[22px] font-normal leading-[26px] text-black [&_a]:underline [&_a]:underline-offset-2';

export async function ArticleDetailSections({ locale, slug }: ArticleDetailSectionsProps) {
  const t = await getTranslations({ locale, namespace: "articles" });
  const tAbout = await getTranslations({ locale, namespace: "about" });

  const items = parseArticleItems(t.raw("items"));
  const article = items.find((i) => i.slug === slug);
  if (!article) {
    notFound();
  }

  const bodyLines =
    article.bodyLines?.length ? article.bodyLines : [t("fallbackBody")];

  const publishedDisplay = article.publishedAt ?? t("defaultPublished");

  return (
    <main className="flex min-h-screen flex-col overflow-x-clip bg-[#fafcff] text-[#212121]">
      {/* Hero from y=0; nav overlays image (Figma-style stacked header) */}
      <div className="relative w-full">
        <div className="relative h-[min(56vw,804px)] min-h-[220px] w-full overflow-hidden bg-neutral-300">
          {article.coverSrc ? (
            <Image
              src={article.coverSrc}
              alt=""
              fill
              className="object-cover"
              sizes="100vw"
              priority
            />
          ) : (
            <div className="absolute inset-0 projects-grain-blue" aria-hidden />
          )}
          <span
            className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/[0.08]"
            aria-hidden
          />
        </div>
        {/* Do not use projects-grain-green here — its `position: relative` overrides `absolute` and pushes nav below the hero */}
        <div className="absolute left-0 right-0 top-0 z-50 text-white">
          <Navbar locale={locale} variant="heroOverlay" />
        </div>
      </div>

      <section className="relative bg-[#fafcff] px-6 pb-12 pt-10 md:px-10 md:pb-16 md:pt-12 lg:px-[40px] lg:pb-20 lg:pt-14">
        <div className="articles-listing-grain pointer-events-none absolute inset-0 z-0" aria-hidden />

        <article className="relative z-10 mx-auto w-full max-w-[785px]">
          {/* Title — Figma 34:1059: Stack Sans SemiBold 48px #303ccf */}
          <h1
            className={cn(
              "home-headline-font !font-semibold text-[clamp(28px,6vw,48px)] leading-[1.1] text-[#303ccf]"
            )}
          >
            {article.title}
          </h1>

          {/* Meta — author / category left; date + share right (Figma 34:1060–1062) */}
          <div
            className={cn(
              robotoMono.className,
              "mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between md:mt-10"
            )}
          >
            <p className="text-[18px] font-normal leading-[26px] text-[#212121] md:text-[20px]">
              <span className={article.accentTitle ? "text-[#1423cb]" : undefined}>
                {article.author}
              </span>
              <span className="text-[#212121]"> {" / "} </span>
              <span>{article.metaCategory}</span>
            </p>
            <div className="flex shrink-0 items-center gap-3 sm:justify-end">
              <span className="text-[14px] font-normal leading-[26px] text-[#c1bebe]">
                {publishedDisplay}
              </span>
              <ArticleShareButton ariaLabel={t("shareArticleAria")} />
            </div>
          </div>

          <div className={cn("mt-6 h-px w-full max-w-[785px]", ARTICLE_ROW_RULE_CLASS)} aria-hidden />

          {/* Body — long-form Stack Sans (not mono), Figma 34:1065 */}
          <div className={cn(articleBodyClass, "mt-8 md:mt-10")}>
            {bodyLines.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
        </article>

        <div className="relative z-10 mx-auto mt-12 flex max-w-[785px] justify-center md:mt-16">
          <Link
            href={`/${locale}/articles`}
            className={cn(
              robotoMono.className,
              "border border-transparent bg-[#303ccf] px-8 py-5 text-[18px] font-normal uppercase leading-none tracking-wide text-white transition-colors hover:bg-[#2839b5]"
            )}
          >
            {t("backToArticles")}
          </Link>
        </div>
      </section>

      {/* Figma — dotted rule above footer band */}
      <div className="relative z-10 mx-auto w-full max-w-[1354px] border-t border-dashed border-[#c1bebe]/80 px-6 md:px-10 lg:px-[40px]" />

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
