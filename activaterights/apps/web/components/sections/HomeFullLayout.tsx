"use client";

/**
 * Home page — Figma source of truth (node 42:2):
 * https://www.figma.com/design/WnwaAYCQsnoBFqS1MN8ELn/ar-websiteeee?node-id=42-2&m=dev
 */
import type { CSSProperties } from "react";
import Link from "next/link";
import Image from "next/image";
import { Roboto_Mono, Space_Mono } from "next/font/google";
import { useTranslations } from "next-intl";
import type { HomeArticleCard } from "../../lib/articles/mapArticleCard";
import { PartnersMarquee } from "../marquee/PartnersMarquee";
import { cn } from "../../lib/utils";
import { BrandLogoLink } from "../brand/BrandLogo";
import { HomeHeroNav } from "./HomeHeroNav";

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

type HomeFullLayoutProps = {
  locale: "en" | "bn";
  featuredProjects: HomeFeaturedProjectCard[];
  /** Same list + fields as `/reports` (all published report documents). */
  reports: HomeFeaturedReportCard[];
  /** Latest articles for “updates and blog” — same CMS as `/articles`. */
  articles: HomeArticleCard[];
};

const missionRows = [
  {
    line1AfterSlashes: "CENSORSHIP",
    line2: "MONITORING"
  },
  {
    line1AfterSlashes: "ARCHIVE",
    line2: "VIOLENCE"
  },
  {
    line1AfterSlashes: "EMPOWER",
    line2: "COMMUNITY"
  }
] as const;

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
      className="home-rights-marquee__icon-frame relative flex h-[clamp(40px,9vw,56px)] w-[clamp(40px,9vw,56px)] shrink-0 overflow-hidden rounded-full"
      aria-hidden
    >
      {src ? (
        <Image src={src} alt="" fill sizes="56px" className="object-cover" />
      ) : (
        <span className="m-auto block h-[52%] w-[52%] rounded-sm bg-white/15" />
      )}
    </span>
  );
}

function RightsMarqueeSequence() {
  const [iconGreen, iconYellow, iconBlue, iconRed] = RIGHTS_MARQUEE_ICONS;
  return (
    <div className="home-rights-marquee__sequence">
      <RightsMarqueeIcon src={iconGreen.src} />
      <span className="home-headline-font whitespace-nowrap text-[clamp(26px,4.2vw,56px)] font-black uppercase leading-none tracking-tight text-white">
        DIGITAL
      </span>
      <RightsMarqueeIcon src={iconYellow.src} />
      <span className="home-headline-font whitespace-nowrap text-[clamp(26px,4.2vw,56px)] font-black uppercase leading-none tracking-tight text-white">
        RIGHTS
      </span>
      <RightsMarqueeIcon src={iconBlue.src} />
      <span className="home-headline-font whitespace-nowrap text-[clamp(26px,4.2vw,56px)] font-black uppercase leading-none tracking-tight text-white">
        ARE HUMAN
      </span>
      <RightsMarqueeIcon src={iconRed.src} />
      <span className="home-headline-font whitespace-nowrap text-[clamp(26px,4.2vw,56px)] font-black uppercase leading-none tracking-tight text-white">
        RIGHTS
      </span>
    </div>
  );
}

export function HomeFullLayout({ locale, featuredProjects, reports, articles }: HomeFullLayoutProps) {
  const tArticles = useTranslations("articles");
  const cardLinkClass =
    "group block outline-none focus-visible:ring-2 focus-visible:ring-[#303ccf] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f5f4f2]";
  return (
    <main data-home className="bg-[#248f6b] text-white">
      <section className="home-mobile-first-fold-hero relative overflow-hidden bg-[url('/images/home-background.png')] bg-cover bg-center">
        <div
          className="home-hero-ascii-art pointer-events-none absolute left-1/2 z-[1] h-[min(44svh,440px)] w-[min(90vw,400px)] -translate-x-1/2 mix-blend-soft-light md:top-[176px] md:h-[846px] md:w-[616px]"
          aria-hidden
        >
          <Image
            src="/images/home/ascii-protest.png"
            alt=""
            width={616}
            height={846}
            className="pointer-events-none h-full w-full object-contain object-center md:object-cover"
            sizes="(max-width: 767px) 90vw, 616px"
            priority
          />
        </div>
        <div className="home-hero-nav-wrap w-full mx-auto max-w-[1440px] px-4 pt-6 sm:px-6 sm:pt-7 md:px-10 md:pt-10">
          <HomeHeroNav locale={locale} />
        </div>

        <div className="home-mobile-hero-art">
          <div className="home-hero-freedom-wrap">
          {Array.from({ length: 5 }).map((_, index) => (
            <span
              key={index}
              className={`home-hero-freedom-line ${
                index === 4 ? "home-hero-freedom-line--mobile-only" : ""
              }`}
            >
              <span className="home-hero-freedom-line__part">internet demands</span>
              <span className="home-hero-freedom-line__part"> freedom</span>
            </span>
          ))}
          </div>

          <div className="home-hero-stripes-wrap mx-auto max-w-[1440px] px-4 sm:px-6 md:px-10">
            <div className="home-hero-stripes mt-4 pb-0 sm:mt-10 md:mt-[52px]">
              <div className="home-hero-stripe-thick h-4 bg-white" />
              <div className="home-hero-stripe-thin mt-3 h-[113px] bg-[repeating-linear-gradient(to_bottom,#fff_0,#fff_7px,transparent_7px,transparent_19px)]" />
            </div>
          </div>
        </div>
        <div
          className="home-hero-bottom-green-bar pointer-events-none h-[clamp(8px,1.25vw,14px)] w-full bg-[#248f6b]"
          aria-hidden
        />
      </section>

      <div
        className="home-rights-marquee py-5 md:py-6"
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

      <section className="home-paper-marketing-section py-10 text-black md:py-16 xl:py-24">
        <div className={`mx-auto max-w-[1440px] ${HOME_PAD_155}`}>
          <h2 className="home-headline-font max-w-[min(100%,520px)] text-[clamp(56px,7.55vw,109px)] font-semibold lowercase leading-[0.92] text-[#05b557]">
            <span className="block">what do</span>
            <span className="block">we do</span>
          </h2>

          <div className="mt-10 max-w-[980px] space-y-8 md:mt-14 md:space-y-10 lg:max-w-[900px] xl:ml-[326px]">
            {missionRows.map((row) => (
              <div
                key={row.line1AfterSlashes}
                className="grid grid-cols-1 gap-5 sm:grid-cols-[minmax(0,320px)_1fr] sm:gap-x-8 md:grid-cols-[minmax(0,360px)_1fr] md:gap-x-10"
              >
                <p className="home-mission-label-font m-0 text-[clamp(22px,2.8vw,30px)] font-semibold uppercase leading-[1.1] tracking-[0.02em] text-[#303ccf]">
                  <span className="text-[#05b557]">{"// "}</span>
                  {`${row.line1AfterSlashes} ${row.line2}`}
                </p>
                <p
                  className={`m-0 max-w-[495px] text-[17px] font-normal leading-[1.4] text-[#303ccf] sm:text-[19px] md:text-[22px] md:leading-[1.45] lg:text-[24px] lg:leading-[26px] ${spaceMono.className}`}
                >
                  We measure and monitor internet shutdowns in Bangladesh to fight for uninterrupted
                  access and hold authorities accountable.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="home-collective-section home-collective-zine overflow-hidden px-4 py-12 text-white sm:px-6 sm:py-14 md:px-10 md:py-20 lg:px-16 lg:py-24 xl:px-[155px] xl:py-28">
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
          <div className="home-headline-font home-collective-zine__type text-[clamp(40px,5.4vw,77px)] font-bold lowercase tracking-[-0.02em] text-white">
            <p className="home-collective-zine__line">// we are a collective</p>
            <p className="home-collective-zine__line home-collective-zine__line--fighting mt-[0.08em]">
              fighting for{" "}
              <span className="home-collective-zine__picsPair" aria-hidden>
                <span className="home-collective-zine__picWrap">
                  <Image
                    src="/images/home-collective-zine-ear.png"
                    alt=""
                    fill
                    sizes="2em"
                    className="object-contain object-center"
                  />
                </span>
                <span className="home-collective-zine__picWrap">
                  <Image
                    src="/images/home-collective-zine-mouth.png"
                    alt=""
                    fill
                    sizes="2em"
                    className="object-contain object-center"
                  />
                </span>
              </span>
            </p>
            <p className="home-collective-zine__line mt-[0.06em]">free speech, human rights,</p>
            <p className="home-collective-zine__line home-collective-zine__line--open mt-[0.06em]">
              and{" "}
              <span className="home-collective-zine__picWrap home-collective-zine__picWrap--narrow" aria-hidden>
                <Image
                  src="/images/home-collective-zine-eye.png"
                  alt=""
                  fill
                  sizes="2em"
                  className="object-contain object-center"
                />
              </span>{" "}
              an open internet
            </p>
          </div>
        </div>
      </section>

      <section className="home-paper-marketing-section pt-12 pb-10 text-black sm:pt-16 md:pb-12 md:pt-24 xl:pt-[200px]">
        <div className={`mx-auto max-w-[1440px] ${HOME_PAD_155}`}>
          <div className="grid grid-cols-1 items-start gap-8 xl:grid-cols-[1fr_372px] xl:gap-8">
            <h2 className="home-headline-font text-[clamp(40px,9vw,109px)] lowercase leading-[0.92] xl:text-[109px]">
              <span className="block text-[#05b557]">our</span>
              <span className="block text-[#05b557]">projects</span>
            </h2>
            <div className="xl:pt-[0.42em]">
              <p className="text-[18px] leading-[1.4] sm:text-[20px] md:text-[22px] md:leading-[1.35]">
                We measure and monitor internet shutdowns in Bangladesh to fight for uninterrupted
                access and hold authorities accountable.
              </p>
              <Link
                href={withLocale(locale, "/projects")}
                className={`mt-8 inline-block bg-[#303ccf] px-5 py-4 text-[14px] uppercase tracking-wide text-white ${robotoMono.className}`}
              >
                View all projects
              </Link>
            </div>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-10 sm:mt-16 sm:grid-cols-2 sm:gap-8 lg:mt-20 xl:grid-cols-3 xl:gap-[30px]">
            {featuredProjects.map((p) => {
              const figure = (
                <>
                  <div className="relative aspect-[598/468] w-full overflow-hidden bg-[#d9d9d9] transition-colors group-hover:bg-[#cfcfcf]">
                    {p.imageUrl ? (
                      <Image
                        src={p.imageUrl}
                        alt={p.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                        className="object-cover"
                      />
                    ) : null}
                  </div>
                  <h3 className="home-headline-font mt-6 text-[clamp(24px,4vw,36px)] font-bold leading-none tracking-tight text-[#212121] sm:mt-8 xl:text-[36px]">
                    {p.title}
                  </h3>
                  {p.dateLabel ? (
                    <p
                      className={`mt-2 text-[14px] leading-none text-[#212121]/50 sm:mt-3 sm:text-[15px] ${robotoMono.className}`}
                    >
                      {p.dateLabel}
                    </p>
                  ) : null}
                </> 
              );

              return (
                <article key={`${p.title}-${p.href}`} className="min-w-0">
                  {p.isExternal ? (
                    <a
                      href={p.href}
                      className={cardLinkClass}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {figure}
                    </a>
                  ) : (
                    <Link href={p.href} className={cardLinkClass}>
                      {figure}
                    </Link>
                  )}
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="home-initiatives-section pb-6 pt-0 text-white md:pb-8 lg:pb-10">
        <Image
          src="/images/home-initiatives-pixel-accent.png"
          alt=""
          width={315}
          height={135}
          className="pointer-events-none absolute right-0 top-0 z-20 h-[clamp(40px,11vw,80px)] w-auto max-w-[min(315px,85vw)] object-contain object-right select-none sm:h-[min(80px,10vh)]"
          aria-hidden
        />
        <div className="relative z-10 mx-auto max-w-[1440px] pt-8 sm:pt-9 md:pt-12 lg:pt-14 xl:pt-16">
          <h2
            className={cn(
              "home-headline-font text-[clamp(64px,8vw,109px)] lowercase leading-[0.92]",
              HOME_PAD_155
            )}
          >
            our initiatives
          </h2>

          <div className="mt-4 space-y-6 px-4 sm:mt-5 sm:space-y-8 sm:px-6 md:mt-6 md:space-y-10 md:px-10 lg:mt-8 lg:space-y-12 xl:px-10">
            <article>
              <div className="w-full max-w-[1130px]">
                <div
                  className="h-[min(380px,62vw)] w-full bg-[#d9d9d9] md:h-[626px]"
                  aria-hidden
                />
                <div className="mt-3 flex flex-col gap-4 md:mt-5 md:flex-row md:items-start md:justify-between md:gap-6">
                  <h3 className="shrink-0 text-[clamp(26px,2.8vw,30px)] font-semibold leading-[1.15] tracking-tight text-white">
                    Bangladesh Protest Archive
                  </h3>
                  <p
                    className={`max-w-[555px] text-[20px] leading-[1.45] text-white md:text-right md:text-[20px] md:leading-[1.4] ${spaceMono.className}`}
                  >
                    We measure and monitor internet shutdowns in Bangladesh to fight for uninterrupted
                    access and hold authorities accountable. We measure and monitor internet shutdowns
                    in Bangladesh to fight for uninterrupted access and hold authorities accountable.
                  </p>
                </div>
              </div>
            </article>

            <article>
              <div className="w-full max-w-[1130px] xl:ml-[230px]">
                <div
                  className="h-[min(380px,62vw)] w-full bg-[#d9d9d9] md:h-[626px]"
                  aria-hidden
                />
                <div className="mt-3 flex flex-col gap-4 md:mt-5 md:flex-row md:items-start md:justify-between md:gap-6">
                  <h3 className="shrink-0 text-[clamp(26px,2.8vw,30px)] font-semibold leading-[1.15] tracking-tight text-white">
                    Archive &amp; Resist Archive
                  </h3>
                  <p
                    className={`max-w-[555px] text-[20px] leading-[1.45] text-white md:text-right md:text-[20px] md:leading-[1.4] ${spaceMono.className}`}
                  >
                    We measure and monitor internet shutdowns in Bangladesh to fight for uninterrupted
                    access and hold authorities accountable. We measure and monitor internet shutdowns
                    in Bangladesh to fight for uninterrupted access and hold authorities accountable.
                  </p>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="home-paper-section py-16 text-black md:py-24 xl:py-[170px]">
        <div className="mx-auto max-w-[1440px]">
          {/* Figma: title + blurb row @ 155px inset; body 16px; CTA 18px */}
          <div className={HOME_PAD_155}>
            <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[1fr_372px]">
              <h2 className="home-headline-font text-[clamp(40px,9vw,109px)] lowercase leading-[0.92] text-[#05b557] xl:text-[109px]">
                published reports
              </h2>
              <div>
                <p className="text-[16px] leading-[1.45] text-black md:leading-[1.35]">
                  We measure and monitor internet shutdowns in Bangladesh to fight for uninterrupted
                  access and hold authorities accountable.
                </p>
                <Link
                  href={withLocale(locale, "/reports")}
                  className={`mt-8 inline-flex min-h-[53px] w-full items-center justify-center bg-[#303ccf] px-5 py-4 text-[18px] uppercase text-white sm:w-auto sm:min-w-[224px] ${robotoMono.className}`}
                >
                  View All Reports
                </Link>
              </div>
            </div>
          </div>

          {/* Figma: report tiles @ 112px inset; ~130px below header; ~99px column gap; titles 30px */}
          <div className={`${HOME_PAD_112} mt-20 xl:mt-[130px]`}>
            <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 md:gap-8 xl:grid-cols-3 xl:gap-x-[99px] xl:gap-y-12">
              {reports.map((report) => (
                <article key={report.slug}>
                  <Link
                    href={withLocale(locale, `/reports/${report.slug}`)}
                    className={cardLinkClass}
                  >
                    <div className="relative aspect-[313/424] w-full max-w-[313px] overflow-hidden bg-[#d9d9d9] sm:max-w-none">
                      {report.imageUrl ? (
                        <Image
                          src={report.imageUrl}
                          alt=""
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      ) : null}
                    </div>
                    <h3 className="mt-6 text-[clamp(22px,3.5vw,30px)] font-normal leading-tight tracking-tight xl:mt-10 xl:text-[30px]">
                      {report.titleLeadingSlash ? (
                        <>
                          <span className="text-[#05b557]">/</span>
                          <span>{` ${report.title}`}</span>
                        </>
                      ) : (
                        report.title
                      )}
                    </h3>
                    <p className={`mt-2 text-[14px] uppercase tracking-[0.08em] text-black/70 ${robotoMono.className}`}>
                      {report.dateLabel}
                    </p>
                    {report.excerpt ? (
                      <p
                        className={`mt-4 line-clamp-5 text-[16px] leading-[1.35] text-black/80 ${spaceMono.className}`}
                      >
                        {report.excerpt}
                      </p>
                    ) : null}
                  </Link>
                </article>
              ))}
            </div>

            <div className="mt-16 h-px w-full max-w-[1216px] bg-black/20 xl:mt-20" />
          </div>
        </div>
      </section>

      <section className="home-paper-section pb-16 text-black md:pb-32 xl:pb-[220px]">
        <div className={`mx-auto max-w-[1440px] ${HOME_PAD_155}`}>
          {/* Figma: “updates and blog” 109px, centered; list block 1130px wide @ 155 inset */}
          <h2 className="home-headline-font text-center text-[clamp(36px,10vw,109px)] lowercase leading-[0.92] xl:text-[109px]">
            <span className="block">updates</span>
            <span className="block">and blog</span>
          </h2>

          <div className="mx-auto mt-10 w-full max-w-[1130px] sm:mt-16 md:mt-24 xl:mt-[140px]">
            {articles.length === 0 ? (
              <p className={`text-center text-[17px] text-black/75 ${robotoMono.className}`}>
                {tArticles("emptyHomeUpdates")}
              </p>
            ) : null}
            {articles.map((item) => (
              <article
                key={item.slug}
                className="border-b border-black/20 py-8 last:border-b-0 md:py-0 md:pt-[30px] md:first:pt-0"
              >
                <Link
                  href={withLocale(locale, `/articles/${item.slug}`)}
                  className={`${cardLinkClass} block`}
                >
                  <div className="grid grid-cols-1 gap-4 sm:gap-8 lg:grid-cols-[minmax(0,321px)_minmax(0,720px)] lg:gap-10">
                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#ffd034] sm:aspect-[321/195] sm:max-w-[321px] lg:max-w-none">
                      {item.coverSrc ? (
                        <Image
                          src={item.coverSrc}
                          alt=""
                          fill
                          className="object-cover"
                          sizes="(max-width: 1024px) 100vw, 321px"
                        />
                      ) : (
                        <span
                          className="absolute inset-0 bg-[url('/images/home-background.png')] bg-cover bg-center opacity-90"
                          aria-hidden
                        />
                      )}
                    </div>
                    <div className="min-w-0 lg:max-w-[720px]">
                      <h3
                        className={cn(
                          "home-headline-font break-words text-[clamp(22px,5.5vw,30px)] leading-[1.15] xl:text-[30px]",
                          item.accentTitle ? "text-[#303ccf]" : "text-black"
                        )}
                      >
                        {item.title}
                      </h3>
                      {item.excerpt ? (
                        <p className="mt-3 line-clamp-4 font-sans text-[15px] leading-[1.4] text-black/80 sm:mt-5 sm:line-clamp-none sm:text-[16px] md:mt-6">
                          {item.excerpt}
                        </p>
                      ) : null}
                      <div className="home-article-meta-font mt-4 flex flex-col gap-2 text-[13px] font-normal uppercase sm:mt-6 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:text-[14px] md:mt-8">
                        <p className="min-w-0 break-words text-black/90">
                          <span>{item.metaCategory}</span>
                          <span className="mx-2 text-black/50" aria-hidden>
                            /
                          </span>
                          <span className={item.accentTitle ? "text-[#1423cb]" : "text-black/90"}>
                            {item.author}
                          </span>
                        </p>
                        <span className="shrink-0 text-black/80">{tArticles("readAction")}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>

          <div className="mt-8 text-center md:mt-12">
            <Link
              href={withLocale(locale, "/articles")}
              className={`inline-flex min-h-[53px] w-full items-center justify-center bg-[#303ccf] px-5 py-4 text-[18px] uppercase text-white sm:w-auto sm:min-w-[127px] ${robotoMono.className}`}
            >
              View All
            </Link>
          </div>
        </div>
      </section>

      <section className="home-paper-marketing-section py-14 text-black md:py-20 xl:py-24">
        <div className={`mx-auto max-w-[1440px] ${HOME_PAD_155}`}>
          <h2 className="home-headline-font home-partners-heading max-w-[min(100%,720px)] text-left text-[clamp(40px,6vw,109px)] lowercase text-[#2d74fd] xl:text-[109px]">
            <span className="block">we have</span>
            <span className="block">worked with</span>
          </h2>
          <PartnersMarquee
            className={`${HOME_NEG_155} mt-16 xl:mt-[100px]`}
            ariaLabel="Organizations we have worked with"
          />
        </div>
      </section>

      <footer className="home-footer pb-16 pt-12 text-white md:pb-20 md:pt-16">
        <div className="relative z-10 mx-auto max-w-[1440px] px-6 md:px-10">
          <div className="grid grid-cols-1 gap-14 min-[900px]:grid-cols-2 min-[900px]:items-start min-[900px]:gap-x-16 lg:gap-x-24">
            {/* Left — ASCII at design size (670×176), then brand + copyright */}
            <div className="flex min-w-0 flex-col gap-10">
              <Image
                src="/images/home-footer-ascii-overlay.png"
                alt=""
                width={670}
                height={176}
                className="home-footer-ascii-banner h-auto w-[670px] max-w-full shrink-0 object-contain object-left"
                sizes="670px"
              />
              <div className="mt-auto flex flex-col gap-6 pt-2">
                <BrandLogoLink
                  href={withLocale(locale, "/")}
                  size="homeFooter"
                  linkClassName="home-headline-font leading-none hover:opacity-90 focus-visible:ring-offset-[#248f6b]"
                />
                <p className={`text-[13px] lowercase text-white/70 ${robotoMono.className}`}>
                  © Activate Rights. All rights reserved.
                </p>
              </div>
            </div>

            {/* Right — CTA then link columns */}
            <div className="flex min-w-0 flex-col gap-12">
              <div>
                <p className="home-headline-font text-[clamp(32px,4.2vw,52px)] lowercase leading-[1.05] text-white">
                  want to work with us on our fight for digital freedom?
                </p>
                <Link
                  href={withLocale(locale, "/team")}
                  className={`mt-8 inline-block w-fit bg-white px-8 py-4 text-[14px] font-normal uppercase tracking-wide text-black transition hover:bg-white/90 ${robotoMono.className}`}
                >
                  Let&apos;s Collab!
                </Link>
              </div>

              <div className="grid grid-cols-1 gap-10 border-t border-white/20 pt-10 sm:grid-cols-3 sm:gap-8 sm:border-t-0 sm:pt-0">
                <div>
                  <p className={`mb-4 text-[12px] uppercase tracking-[0.2em] text-white/75 ${robotoMono.className}`}>
                    About
                  </p>
                  <ul className={`space-y-3 text-[16px] lowercase leading-snug ${robotoMono.className}`}>
                    <li>
                      <Link href={withLocale(locale, "/about")} className="hover:underline">
                        About Us
                      </Link>
                    </li>
                    <li>
                      <Link href={withLocale(locale, "/projects")} className="hover:underline">
                        Our Projects
                      </Link>
                    </li>
                    <li>
                      <Link href={withLocale(locale, "/reports")} className="hover:underline">
                        Our Publications
                      </Link>
                    </li>
                    <li>
                      <Link href={withLocale(locale, "/articles")} className="hover:underline">
                        Updates
                      </Link>
                    </li>
                  </ul>
                </div>
                <div>
                  <p className={`mb-4 text-[12px] uppercase tracking-[0.2em] text-white/75 ${robotoMono.className}`}>
                    Connect
                  </p>
                  <ul className={`space-y-3 text-[16px] lowercase ${robotoMono.className}`}>
                    <li>
                      <a href="https://www.facebook.com" className="hover:underline" target="_blank" rel="noopener noreferrer">
                        Facebook
                      </a>
                    </li>
                    <li>
                      <a href="https://twitter.com" className="hover:underline" target="_blank" rel="noopener noreferrer">
                        X / Twitter
                      </a>
                    </li>
                    <li>
                      <a href="https://www.instagram.com" className="hover:underline" target="_blank" rel="noopener noreferrer">
                        Instagram
                      </a>
                    </li>
                  </ul>
                </div>
                <div>
                  <p className={`mb-4 text-[12px] uppercase tracking-[0.2em] text-white/75 ${robotoMono.className}`}>
                    Get in touch
                  </p>
                  <a
                    href="mailto:omuktomuk@website.com"
                    className={`block text-[16px] lowercase underline-offset-2 hover:underline ${robotoMono.className}`}
                  >
                    omuktomuk@website.com
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
