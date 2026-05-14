import Image from "next/image";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { Roboto_Mono } from "next/font/google";
import type { Image as SanityImage } from "sanity";
import { ArticlePdfEmbed } from "../ArticlePdfEmbed";
import {
  ArticlePortableBody,
  articleWritingParagraphClassName,
  articleWritingWrapClassName
} from "../ArticlePortableBody";
import { AboutFooter } from "../layout/AboutFooter";
import { Navbar } from "../layout/Navbar";
import type { Locale } from "../../i18n/config";
import { plainTextToParagraphs } from "../../lib/plainTextParagraphs";
import { formatCalendarDayMonthYear, formatCalendarDdMmYyyyUtc } from "../../lib/datetime/formatCalendarDisplay";
import { getEventBySlug } from "../../lib/sanity/queries";
import { urlFor } from "../../lib/sanity/image";
import { ArticleShareButton } from "./ArticleShareButton";
import { cn } from "../../lib/utils";

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap"
});

type EventDetailSectionsProps = {
  locale: Locale;
  slug: string;
};

function formatEventDate(iso: string, locale: Locale): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return locale === "bn" ? formatCalendarDayMonthYear(iso, "bn") : formatCalendarDdMmYyyyUtc(iso);
}

function locationDisplayText(
  event: { isOnline: boolean; location?: string },
  tbd: string,
  online: string
): string {
  const loc = (event.location ?? "").trim();
  if (event.isOnline && loc) return `${online} · ${loc}`;
  if (event.isOnline) return online;
  if (loc) return loc;
  return tbd;
}

export async function EventDetailSections({ locale, slug }: EventDetailSectionsProps) {
  const t = await getTranslations({ locale, namespace: "events" });
  const tArticles = await getTranslations({ locale, namespace: "articles" });
  const tAbout = await getTranslations({ locale, namespace: "about" });

  const event = await getEventBySlug(slug, locale);
  if (!event) {
    notFound();
  }

  const coverSrc = event.coverImage?.asset?._ref
    ? urlFor(event.coverImage as SanityImage).width(1920).height(1080).fit("crop").auto("format").url()
    : undefined;

  const dateDisplay = formatEventDate(event.date, locale);
  const primaryMeta = locationDisplayText(event, t("locationTbd"), t("online"));
  const hasBody = Array.isArray(event.body) && event.body.length > 0;
  const excerptText = (event.description ?? "").trim();
  const regUrl = event.registrationUrl?.trim();
  const pdfFromStudio = (event.pdfAttachments ?? []).filter(
    (p): p is { title?: string | null; url: string } =>
      Boolean(p?.url && typeof p.url === "string")
  );
  const hasPdfAttachments = pdfFromStudio.length > 0;
  const showBodyFallback = !hasBody && !hasPdfAttachments && !excerptText;

  return (
    <main className="flex min-h-screen flex-col overflow-x-clip bg-[#fafcff] text-[#212121]">
      <div className="relative w-full">
        <div className="relative h-[min(56vw,804px)] min-h-[220px] w-full overflow-hidden bg-neutral-300">
          {coverSrc ? (
            <Image
              src={coverSrc}
              alt={event.title}
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
        <div className="absolute left-0 right-0 top-0 z-50 text-white">
          <Navbar locale={locale} variant="heroOverlay" />
        </div>
      </div>

      <section className="relative bg-[#fafcff] px-6 pb-12 pt-10 md:px-10 md:pb-16 md:pt-12 lg:px-[40px] lg:pb-20 lg:pt-14">
        <div className="articles-listing-grain pointer-events-none absolute inset-0 z-0" aria-hidden />

        <article className="relative z-10 mx-auto w-full max-w-[min(100%,720px)] lg:max-w-[785px]">
          <h1
            className={cn(
              "home-headline-font !font-semibold text-[clamp(28px,6vw,48px)] leading-[1.08] tracking-tight text-[#303ccf]"
            )}
          >
            {event.title}
          </h1>

          <div
            className={cn(
              robotoMono.className,
              "mt-7 flex flex-col gap-4 border-b border-[#303ccf]/10 pb-7 sm:flex-row sm:items-center sm:justify-between md:mt-9"
            )}
          >
            <p className="text-[17px] font-normal leading-relaxed text-[#212121] md:text-[18px]">
              <span>{primaryMeta}</span>
              <span className="text-neutral-400"> {" · "} </span>
              <span className="text-neutral-700">{t("eventKind")}</span>
            </p>
            <div className="flex shrink-0 items-center gap-4 sm:justify-end">
              <time dateTime={event.date} className="text-[13px] font-normal uppercase tracking-wide text-[#9ca3af] md:text-[14px]">
                {dateDisplay}
              </time>
              <ArticleShareButton ariaLabel={t("shareEventAria")} />
            </div>
          </div>

          {(excerptText || hasBody || hasPdfAttachments || showBodyFallback) && (
            <div
              className={cn(
                "mt-8 space-y-10 md:mt-11 md:space-y-12 [&_figure_a]:no-underline [&_figure_a:hover]:no-underline",
                excerptText ? "md:mt-12" : ""
              )}
            >
              {excerptText ? (
                <div className={articleWritingWrapClassName}>
                  {plainTextToParagraphs(excerptText).map((para, i) => (
                    <p key={i} className={articleWritingParagraphClassName}>
                      {para}
                    </p>
                  ))}
                </div>
              ) : null}
              {hasBody ? (
                <ArticlePortableBody
                  value={event.body}
                  pdfLabels={{
                    document: tArticles("pdfDocument"),
                    open: tArticles("pdfOpen"),
                    download: tArticles("pdfDownload")
                  }}
                />
              ) : null}
              {hasPdfAttachments ? (
                <div className={cn(hasBody ? "mt-10 space-y-10 md:mt-12 md:space-y-12" : "")}>
                  {pdfFromStudio.map((pdf, i) => (
                    <ArticlePdfEmbed
                      key={`${pdf.url}-${i}`}
                      url={pdf.url}
                      headingTitle={pdf.title?.trim() || undefined}
                      documentLabel={tArticles("pdfDocument")}
                      openLabel={tArticles("pdfOpen")}
                      downloadLabel={tArticles("pdfDownload")}
                    />
                  ))}
                </div>
              ) : null}
              {showBodyFallback ? (
                <div className={articleWritingWrapClassName}>
                  <p className={articleWritingParagraphClassName}>{t("fallbackBody")}</p>
                </div>
              ) : null}
            </div>
          )}

          {regUrl ? (
            <div className="mt-10 md:mt-12">
              <a
                href={regUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  robotoMono.className,
                  "inline-flex w-full items-center justify-center border border-transparent bg-[#06b85c] px-8 py-5 text-[18px] font-normal uppercase leading-none tracking-wide text-white transition-colors hover:bg-[#059c50]"
                )}
                aria-label={t("registerExternalAria")}
              >
                {t("registerExternal")}
              </a>
            </div>
          ) : null}
        </article>

        <div className="relative z-10 mx-auto mt-12 flex max-w-[min(100%,720px)] justify-center lg:max-w-[785px] md:mt-16">
          <Link
            href={`/${locale}/events`}
            className={cn(
              robotoMono.className,
              "border border-transparent bg-[#303ccf] px-8 py-5 text-[18px] font-normal uppercase leading-none tracking-wide text-white transition-colors hover:bg-[#2839b5]"
            )}
          >
            {t("backToEvents")}
          </Link>
        </div>
      </section>

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
