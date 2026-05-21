"use client";

/**
 * Home page — Figma source of truth (node 42:2):
 * https://www.figma.com/design/WnwaAYCQsnoBFqS1MN8ELn/ar-websiteeee?node-id=42-2&m=dev
 */
import type { CSSProperties, ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { Roboto_Mono, Space_Mono } from "next/font/google";
import { useTranslations } from "next-intl";
import type { HomeArticleCard } from "../../lib/articles/mapArticleCard";
import { HomePartnersSection } from "../layout/HomePartnersSection";
import { cn } from "../../lib/utils";
import { HomeSiteFooter } from "../layout/HomeSiteFooter";
import { ProjectPosterCard } from "../ProjectPosterCard";
import { HomeHeroNav } from "./HomeHeroNav";
import { CollectiveZineHeadline } from "./CollectiveZineHeadline";
import { WhatWeDoSection } from "./WhatWeDoSection";

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap"
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap"
});

export type HomeFeaturedProjectCard = {
  title: string;
  href: string;
  isExternal: boolean;
  imageUrl: string | null;
  dateLabel: string | null;
};

export type HomeFeaturedReportCard = {
  slug: string;
  title: string;
  titleLeadingSlash: boolean;
  dateLabel: string;
  imageUrl: string | null;
  excerpt: string | null;
};

export type HomeInitiativeCard = {
  title: string;
  description: string | null;
  href: string;
  isExternal: boolean;
  imageUrl: string | null;
};

type HomeFullLayoutProps = {
  locale: "en" | "bn";
  featuredProjects: HomeFeaturedProjectCard[];
  /** “Our initiatives” rows — cover image, title (left), description (right). */
  initiatives: HomeInitiativeCard[];
  /** Same list + fields as `/reports` (all published report documents). */
  reports: HomeFeaturedReportCard[];
  /** Latest articles for “updates and blog” — same CMS as `/articles`. */
  articles: HomeArticleCard[];
};

/** xl+ = Figma 155px inset; tighter on tablet / small laptop so content stays usable. */
const HOME_PAD_155 = "px-4 sm:px-6 md:px-10 lg:px-16 xl:px-[155px]";
const HOME_NEG_155 = "-mx-4 sm:-mx-6 md:-mx-10 lg:-mx-16 xl:-mx-[155px]";
/** Published reports band uses a slightly narrower desktop inset in the design. */
const HOME_PAD_112 = "px-4 sm:px-6 md:px-10 lg:px-14 xl:px-[112px]";

function withLocale(locale: "en" | "bn", href: string): string {
  return `/${locale}${href}`;
}

/** How many identical strips in a row — keeps wide viewports full; loop moves by 1 strip width. */
const RIGHTS_MARQUEE_LOOP_COUNT = 8;

/** Pixel icons (square PNGs w/ black padding). Order: before DIGITAL, then between word groups. */
const RIGHTS_MARQUEE_ICONS = [
  { src: "/images/home/marquee/marquee-icon-green.png" },
  { src: "/images/home/marquee/marquee-icon-yellow.png" },
  { src: "/images/home/marquee/marquee-icon-blue.png" },
  { src: "/images/home/marquee/marquee-icon-red.png" }
] as const;

function RightsMarqueeIcon({ src }: { src: string | null }) {
  return (
    <span
      className="home-rights-marquee__icon relative flex h-[clamp(40px,9vw,56px)] w-[clamp(40px,9vw,56px)] shrink-0 overflow-hidden rounded-full"
      aria-hidden
    >
      {src ? (
        <Image src={src} alt="" fill sizes="56px" className="object-cover" />
      ) : (
        <span className="m-auto block h-[52%] w-[52%] rounded-sm bg-[#212121]/10" />
      )}
    </span>
  );
}

const HERO_FREEDOM_LINE_COUNT = 5;

function HeroFreedomLine({ index }: { index: number }) {
  return (
    <span
      className="home-hero-freedom-line-wrap"
      style={{ "--freedom-line-index": index } as CSSProperties}
      aria-hidden
    >
      <span className="home-hero-freedom-line">internet demands freedom</span>
    </span>
  );
}

function RightsMarqueeGroup({
  iconSrc,
  children
}: {
  iconSrc: string | null;
  children: ReactNode;
}) {
  return (
    <span className="home-rights-marquee__group">
      <RightsMarqueeIcon src={iconSrc} />
      {children}
    </span>
  );
}

function RightsMarqueeSequence() {
  const [iconGreen, iconYellow, iconBlue, iconRed] = RIGHTS_MARQUEE_ICONS;
  return (
    <div className="home-rights-marquee__sequence">
      <RightsMarqueeGroup iconSrc={iconGreen.src}>
        <span className="home-rights-marquee__word home-headline-font home-rights-marquee__word--green">
          DIGITAL
        </span>
      </RightsMarqueeGroup>
      <span className="home-rights-marquee__sep" aria-hidden />
      <RightsMarqueeGroup iconSrc={iconYellow.src}>
        <span className="home-rights-marquee__word home-headline-font home-rights-marquee__word--blue">
          RIGHTS
        </span>
      </RightsMarqueeGroup>
      <span className="home-rights-marquee__sep" aria-hidden />
      <RightsMarqueeGroup iconSrc={iconBlue.src}>
        <span className="home-rights-marquee__word home-headline-font home-rights-marquee__word--ink">
          ARE HUMAN
        </span>
      </RightsMarqueeGroup>
      <span className="home-rights-marquee__sep" aria-hidden />
      <RightsMarqueeGroup iconSrc={iconRed.src}>
        <span className="home-rights-marquee__word home-headline-font home-rights-marquee__word--green">
          RIGHTS
        </span>
      </RightsMarqueeGroup>
    </div>
  );
}

export function HomeFullLayout({
  locale,
  featuredProjects,
  initiatives,
  reports,
  articles
}: HomeFullLayoutProps) {
  const tArticles = useTranslations("articles");
  const tProjects = useTranslations("projects");
  const tReports = useTranslations("reports");
  const initiativeCardLinkClass =
    "home-initiative-card group block w-full p-3 outline-none focus-visible:ring-2 focus-visible:ring-[#05b557] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1a1a1a] sm:p-3.5 md:p-4";
  const reportCardLinkClass =
    "home-report-card group flex h-full w-full flex-col overflow-hidden outline-none transition-[transform,box-shadow,border-color] duration-300 focus-visible:ring-2 focus-visible:ring-[#303ccf] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f3efe6]";
  const articleCardLinkClass =
    "home-article-card group block w-full overflow-hidden outline-none transition-[transform,box-shadow,border-color] duration-300 focus-visible:ring-2 focus-visible:ring-[#303ccf] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f3efe6]";
  return (
    <main data-home className="min-h-screen">
      <section className="home-mobile-first-fold-hero relative overflow-hidden bg-[#248f6b] bg-[url('/images/home-background.png')] bg-cover bg-center text-white">
        <div className="home-hero-ascii-art" aria-hidden>
          <Image
            src="/images/home/ascii-protest.png"
            alt=""
            width={616}
            height={846}
            className="pointer-events-none h-full w-full object-contain object-center"
            sizes="(max-width: 1440px) 43vw, 616px"
            priority
          />
        </div>
        <div className="home-hero-nav-wrap w-full">
          <HomeHeroNav locale={locale} />
        </div>

        <div className="home-mobile-hero-art">
          <div
            className="home-hero-freedom-wrap"
            aria-label="internet demands freedom"
          >
            {Array.from({ length: HERO_FREEDOM_LINE_COUNT }).map((_, index) => (
              <HeroFreedomLine key={index} index={index} />
            ))}
          </div>

          <div className="home-hero-stripes-wrap" aria-hidden>
            <div className="home-hero-stripes">
              <div className="home-hero-stripe-thick bg-white" />
              <div className="home-hero-stripe-thin" />
            </div>
          </div>
        </div>
        <div
          className="home-hero-bottom-green-bar pointer-events-none h-[clamp(8px,1.25vw,14px)] w-full bg-[#248f6b]"
          aria-hidden
        />
      </section>

      <div
        className="home-rights-marquee home-paper-marketing-section"
        role="region"
        aria-label="Digital rights are human rights"
        style={
          { "--rights-marquee-loops": String(RIGHTS_MARQUEE_LOOP_COUNT) } as CSSProperties
        }
      >
        <div className="home-rights-marquee__track">
          {Array.from({ length: RIGHTS_MARQUEE_LOOP_COUNT }, (_, i) => (
            <RightsMarqueeSequence key={`rights-marquee-${i}`} />
          ))}
        </div>
      </div>

      <section className="home-paper-marketing-section py-6 text-black md:py-8 xl:py-11">
        <div className={`mx-auto max-w-[1440px] ${HOME_PAD_155}`}>
          <WhatWeDoSection />
        </div>
      </section>

      <section
        className="home-collective-section home-collective-zine overflow-hidden px-4 py-12 text-white sm:px-6 sm:py-14 md:px-10 md:py-20 lg:px-16 lg:py-24 xl:px-[155px] xl:py-28"
        data-scroll-reveal="fade-up-left"
      >
        <div className="home-collective-art-layer" aria-hidden>
          <Image
            src="/images/home-collective-blue-birds.png"
            alt=""
            fill
            sizes="100vw"
            className="home-collective-art-img"
          />
        </div>
        <div className="home-collective-zine__stack max-w-[min(100%,1180px)]">
          <CollectiveZineHeadline
            lines={{
              line1: "we are a collective",
              line2: "fighting for",
              line3: "free speech, human rights,",
              line4Start: "and",
              line4End: "an open internet"
            }}
          />
        </div>
      </section>

      <section className="home-paper-marketing-section pt-6 pb-14 text-black sm:pt-8 sm:pb-16 md:pb-20 md:pt-10 xl:pt-12 xl:pb-24">
        <div className={`mx-auto max-w-[1440px] ${HOME_PAD_155}`}>
          <div className="grid grid-cols-1 items-start gap-5 sm:gap-6 xl:grid-cols-[1fr_372px] xl:gap-6">
            <h2
              className="home-headline-font text-[clamp(28px,5vw,52px)] lowercase leading-[0.92]"
              data-scroll-reveal="fade-left"
            >
              <span className="block text-[#05b557]">our</span>
              <span className="block text-[#05b557]">projects</span>
            </h2>
            <div
              className="xl:pt-[0.15em]"
              data-scroll-reveal="fade-right"
              style={{ "--scroll-reveal-delay": "100ms" } as CSSProperties}
            >
              <p
                className={cn(
                  "max-w-[520px] text-[clamp(13px,1.3vw,16px)] font-normal leading-[1.5] text-[#212121] md:text-[16px]",
                  spaceMono.className
                )}
              >
                {tProjects("listingIntro")}
              </p>
            </div>
          </div>

          <div
            className="home-featured-projects-grid mt-6 grid grid-cols-1 sm:mt-8 md:mt-10"
            data-scroll-reveal-stagger="straight"
          >
            {featuredProjects.map((p, index) => {
              const ctaLabel = p.isExternal
                ? tProjects("externalLink")
                : tProjects("viewProject");
              const ctaAria = p.isExternal
                ? tProjects("externalLinkAria")
                : tProjects("viewProjectAria");
              const indexLabel = String(index + 1).padStart(2, "0");

              return (
                <ProjectPosterCard
                  key={`${p.title}-${p.href}`}
                  title={p.title}
                  href={p.href}
                  isExternal={p.isExternal}
                  imageUrl={p.imageUrl}
                  dateLabel={p.dateLabel}
                  indexLabel={indexLabel}
                  projectLabel={tProjects("projectLabel")}
                  ctaLabel={ctaLabel}
                  ctaAria={ctaAria}
                />
              );
            })}
          </div>

          <div className="listing-load-more">
            <Link
              href={withLocale(locale, "/projects")}
              className={cn(robotoMono.className, "listing-load-more__btn")}
            >
              View all projects
            </Link>
          </div>
        </div>
      </section>

      <section className="home-initiatives-section pb-3 pt-10 text-white sm:pt-12 md:pb-4 md:pt-14 lg:pb-5 lg:pt-16">
        <Image
          src="/images/home-initiatives-pixel-accent.png"
          alt=""
          width={315}
          height={135}
          className="pointer-events-none absolute right-0 top-0 z-20 h-[clamp(28px,8vw,56px)] w-auto max-w-[min(220px,70vw)] object-contain object-right select-none sm:h-[min(56px,8vh)]"
          aria-hidden
        />
        <div className="relative z-10 mx-auto max-w-[1440px] pt-4 sm:pt-5 md:pt-5 lg:pt-6">
          <h2
            className={cn(
              "home-headline-font text-[clamp(28px,4vw,48px)] lowercase leading-[0.9]",
              HOME_PAD_155
            )}
            data-scroll-reveal="fade-right"
          >
            our initiatives
          </h2>

          <div
            className={cn(
              "mt-1.5 space-y-2.5 sm:mt-2 sm:space-y-3 md:mt-2.5 md:space-y-3.5",
              HOME_PAD_155
            )}
            data-scroll-reveal-stagger="straight"
          >
            {initiatives.map((item) => {
              const ctaLabel = item.isExternal
                ? tProjects("externalLink")
                : tProjects("viewProject");
              const ctaAria = item.isExternal
                ? tProjects("externalLinkAria")
                : tProjects("viewProjectAria");

              const cardInner = (
                <div className="grid grid-cols-1 gap-3 sm:gap-3.5 md:grid-cols-[minmax(0,200px)_minmax(0,1fr)] md:gap-4 lg:grid-cols-[minmax(0,220px)_minmax(0,1fr)]">
                  <div className="relative h-[min(108px,30vw)] w-full overflow-hidden bg-[#2a2a2a] sm:h-[min(120px,24vw)] md:h-full md:min-h-[140px] lg:min-h-[160px]">
                    {item.imageUrl ? (
                      <Image
                        src={item.imageUrl}
                        alt={item.title}
                        fill
                        className="home-initiative-card__media object-cover"
                        sizes="(max-width: 768px) 100vw, 220px"
                      />
                    ) : (
                      <span
                        className="absolute inset-0 bg-[linear-gradient(135deg,#303ccf_0%,#05b557_100%)] opacity-80"
                        aria-hidden
                      />
                    )}
                  </div>
                  <div className="flex min-w-0 flex-col gap-2 sm:gap-2.5">
                    <p
                      className={`m-0 text-[10px] font-normal uppercase tracking-[0.12em] text-[#05b557] sm:text-[11px] ${robotoMono.className}`}
                    >
                      {tProjects("projectLabel")}
                    </p>
                    <h3 className="home-headline-font m-0 text-[clamp(18px,2.4vw,26px)] font-semibold leading-[1.05] tracking-tight text-white transition-colors group-hover:text-[#05b557]">
                      {item.title}
                    </h3>
                    {item.description ? (
                      <p
                        className={`m-0 max-w-[640px] text-[13px] leading-[1.4] text-white/85 sm:text-[14px] ${spaceMono.className}`}
                      >
                        {item.description}
                      </p>
                    ) : null}
                    <span
                      className={`mt-0.5 inline-flex w-fit max-w-full items-center gap-1.5 border border-white/45 bg-[#303ccf] px-3 py-2 text-[12px] uppercase leading-none tracking-wide text-white transition-colors group-hover:border-[#05b557] group-hover:bg-[#05b557] sm:text-[13px] ${robotoMono.className}`}
                    >
                      {ctaLabel}
                      {item.isExternal ? (
                        <span aria-hidden className="text-[15px] leading-none">
                          ↗
                        </span>
                      ) : (
                        <span aria-hidden className="text-[15px] leading-none">
                          →
                        </span>
                      )}
                    </span>
                  </div>
                </div>
              );

              return (
                <article key={`${item.title}-${item.href}`} className="w-full">
                  {item.isExternal ? (
                    <a
                      href={item.href}
                      className={initiativeCardLinkClass}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${ctaAria}: ${item.title}`}
                    >
                      {cardInner}
                    </a>
                  ) : (
                    <Link
                      href={item.href}
                      className={initiativeCardLinkClass}
                      aria-label={`${ctaAria}: ${item.title}`}
                    >
                      {cardInner}
                    </Link>
                  )}
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="home-published-reports-section home-paper-section py-10 text-black md:py-14 xl:py-16">
        <div className="mx-auto max-w-[1440px]">
          <div className={HOME_PAD_155}>
            <div className="grid grid-cols-1 items-start gap-5 sm:gap-6 lg:grid-cols-[1fr_372px]">
              <h2
                className="home-headline-font text-[clamp(28px,5vw,52px)] lowercase leading-[0.92] text-[#05b557]"
                data-scroll-reveal="fade-left"
              >
                <span className="block">published</span>
                <span className="block">reports</span>
              </h2>
              <div
                data-scroll-reveal="fade-right"
                style={{ "--scroll-reveal-delay": "120ms" } as CSSProperties}
              >
                <p
                  className={cn(
                    "max-w-[520px] text-[clamp(13px,1.3vw,16px)] leading-[1.5] text-[#212121] md:text-[16px]",
                    spaceMono.className
                  )}
                >
                  We measure and monitor internet shutdowns in Bangladesh to fight for uninterrupted
                  access and hold authorities accountable.
                </p>
              </div>
            </div>
          </div>

          <div className={`${HOME_PAD_112} mt-8 md:mt-10 lg:mt-12`}>
            <div
              className="home-reports-grid grid grid-cols-1 gap-5 sm:grid-cols-3 sm:gap-4 lg:gap-5"
              data-scroll-reveal-stagger="straight"
            >
              {reports.map((report, index) => {
                const indexLabel = String(index + 1).padStart(2, "0");
                return (
                  <article key={report.slug} className="home-report-reveal-card scroll-reveal-card flex min-w-0">
                    <Link
                      href={withLocale(locale, `/reports/${report.slug}`)}
                      className={reportCardLinkClass}
                      aria-label={`${tReports("readReport")}: ${report.title}`}
                    >
                      <div className="home-report-card__top">
                        <span
                          className={`home-report-card__index ${robotoMono.className}`}
                          aria-hidden
                        >
                          {indexLabel}
                        </span>
                        <div className="home-report-card__cover">
                          {report.imageUrl ? (
                            <Image
                              src={report.imageUrl}
                              alt=""
                              fill
                              className="home-report-card__media object-cover"
                              sizes="(max-width: 640px) 90vw, 280px"
                            />
                          ) : (
                            <span
                              className="absolute inset-0 bg-[linear-gradient(145deg,#303ccf_0%,#05b557_100%)]"
                              aria-hidden
                            />
                          )}
                        </div>
                        <span
                          className={`home-report-card__kind ${robotoMono.className}`}
                          aria-hidden
                        >
                          {tReports("reportKind")}
                        </span>
                      </div>

                      <div className="home-report-card__body">
                        <p
                          className={`home-report-card__date ${robotoMono.className}`}
                        >
                          <span className="home-report-card__slash">//</span>
                          {report.dateLabel}
                        </p>
                        <h3 className="home-headline-font home-report-card__title">
                          {report.titleLeadingSlash ? (
                            <span className="home-report-card__title-inner">
                              <span className="home-report-card__title-slash" aria-hidden>
                                /
                              </span>
                              <span className="home-report-card__title-text">{report.title}</span>
                            </span>
                          ) : (
                            report.title
                          )}
                        </h3>
                        {report.excerpt ? (
                          <p className="home-report-card__excerpt">{report.excerpt}</p>
                        ) : null}
                      </div>

                      <div className={`home-report-card__footer ${robotoMono.className}`}>
                        <span className="home-report-card__cta">{tReports("readReport")}</span>
                        <span className="home-report-card__arrow" aria-hidden>
                          →
                        </span>
                      </div>
                    </Link>
                  </article>
                );
              })}
            </div>

            <div className="listing-load-more">
              <Link
                href={withLocale(locale, "/reports")}
                className={cn(robotoMono.className, "listing-load-more__btn")}
              >
                View All Reports
              </Link>
            </div>

            <div className="mt-10 h-px w-full bg-black/15 md:mt-12" />
          </div>
        </div>
      </section>

      <section className="home-updates-section home-paper-section pb-12 text-black md:pb-20 xl:pb-28">
        <div className={`mx-auto max-w-[1440px] ${HOME_PAD_155}`}>
          <h2
            className="home-headline-font text-center text-[clamp(28px,5.5vw,56px)] lowercase leading-[0.92]"
            data-scroll-reveal="fade-down"
          >
            <span className="block text-[#05b557]">updates</span>
            <span className="block text-[#303ccf]">and blog</span>
          </h2>

          <div
            className="home-updates-list mx-auto mt-6 w-full max-w-[960px] sm:mt-8 md:mt-10"
            data-scroll-reveal-stagger="straight"
          >
            {articles.length === 0 ? (
              <p className={`text-center text-[17px] text-black/75 ${robotoMono.className}`}>
                {tArticles("emptyHomeUpdates")}
              </p>
            ) : null}
            {articles.map((item, index) => {
              const indexLabel = String(index + 1).padStart(2, "0");
              return (
                <article key={item.slug} className="home-article-reveal-card scroll-reveal-card min-w-0">
                  <Link
                    href={withLocale(locale, `/articles/${item.slug}`)}
                    className={articleCardLinkClass}
                    aria-label={`${tArticles("readAction")}: ${item.title}`}
                  >
                    <div className="home-article-card__layout">
                      <div className="home-article-card__media-col">
                        <span
                          className={`home-article-card__index ${robotoMono.className}`}
                          aria-hidden
                        >
                          {indexLabel}
                        </span>
                        <div className="home-article-card__cover">
                          {item.coverSrc ? (
                            <Image
                              src={item.coverSrc}
                              alt=""
                              fill
                              className="home-article-card__media object-cover"
                              sizes="(max-width: 1024px) 100vw, 220px"
                            />
                          ) : (
                            <span
                              className="absolute inset-0 bg-[linear-gradient(145deg,#303ccf_0%,#05b557_55%,#ffd034_100%)]"
                              aria-hidden
                            />
                          )}
                        </div>
                        <span
                          className={`home-article-card__kind ${robotoMono.className}`}
                          aria-hidden
                        >
                          {item.metaCategory}
                        </span>
                      </div>

                      <div className="home-article-card__content">
                        <div className="home-article-card__body">
                          <p className={`home-article-card__date ${robotoMono.className}`}>
                            <span className="home-article-card__slash">//</span>
                            {item.publishedAt}
                          </p>
                          <h3
                            className={cn(
                              "home-headline-font home-article-card__title",
                              item.accentTitle && "home-article-card__title--featured"
                            )}
                          >
                            {item.title}
                          </h3>
                          {item.excerpt ? (
                            <p className="home-article-card__excerpt">{item.excerpt}</p>
                          ) : null}
                        </div>

                        <div
                          className={`home-article-card__footer ${robotoMono.className} home-article-meta-font`}
                        >
                          <p className="home-article-card__meta min-w-0">
                            <span>{item.metaCategory}</span>
                            <span className="home-article-card__meta-sep" aria-hidden>
                              /
                            </span>
                            <span
                              className={
                                item.accentTitle
                                  ? "home-article-card__meta-author--accent"
                                  : undefined
                              }
                            >
                              {item.author}
                            </span>
                          </p>
                          <span className="home-article-card__cta shrink-0">
                            {tArticles("readAction")}
                            <span className="home-article-card__arrow" aria-hidden>
                              {" "}
                              →
                            </span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </article>
              );
            })}
          </div>

          <div className="listing-load-more">
            <Link
              href={withLocale(locale, "/articles")}
              className={cn(robotoMono.className, "listing-load-more__btn")}
            >
              View All
            </Link>
          </div>
        </div>
      </section>

      <HomePartnersSection />

      <HomeSiteFooter locale={locale} showContact />
    </main>
  );
}
