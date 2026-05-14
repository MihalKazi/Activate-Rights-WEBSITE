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
import { AboutPartnersClosing } from "../layout/AboutPartnersClosing";
import { Navbar } from "../layout/Navbar";
import type { Locale } from "../../i18n/config";
import { mapArticleToCardRow } from "../../lib/articles/mapArticleCard";
import { plainTextToParagraphs } from "../../lib/plainTextParagraphs";
import { getArticleBySlug } from "../../lib/sanity/queries";
import { urlFor } from "../../lib/sanity/image";
import { ArticleShareButton } from "./ArticleShareButton";
import { RelatedWritings } from "./RelatedWritings";
import { cn } from "../../lib/utils";

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap"
});

type ArticleDetailSectionsProps = {
  locale: Locale;
  slug: string;
};

export async function ArticleDetailSections({ locale, slug }: ArticleDetailSectionsProps) {
  const t = await getTranslations({ locale, namespace: "articles" });

  const article = await getArticleBySlug(slug, locale);
  if (!article) {
    notFound();
  }

  const row = mapArticleToCardRow(article, locale);
  const coverSrc = article.coverImage?.asset?._ref
    ? urlFor(article.coverImage as SanityImage).width(1920).height(1080).fit("crop").auto("format").url()
    : undefined;

  const publishedDisplay = row.publishedAt ?? t("defaultPublished");
  const hasBody = Array.isArray(article.body) && article.body.length > 0;
  const pdfFromStudio = (article.pdfAttachments ?? []).filter(
    (p): p is { title?: string | null; url: string } =>
      Boolean(p?.url && typeof p.url === "string")
  );
  const hasPdfAttachments = pdfFromStudio.length > 0;
  const showBodyFallback = !hasBody && !hasPdfAttachments;
  const excerptText = article.excerpt?.trim();

  const relatedWritings = (article.relatedArticles ?? []).filter(
    (r) =>
      r &&
      r._id !== article._id &&
      r.slug?.current &&
      String(r.slug.current).length > 0
  );

  return (
    <main className="flex min-h-screen flex-col overflow-x-clip bg-[#fafcff] text-[#212121]">
      {/* Hero from y=0; nav overlays image (Figma-style stacked header) */}
      <div className="relative w-full">
        <div className="relative h-[min(56vw,804px)] min-h-[220px] w-full overflow-hidden bg-neutral-300">
          {coverSrc ? (
            <Image
              src={coverSrc}
              alt={article.title}
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

        <article className="relative z-10 mx-auto w-full max-w-[min(100%,720px)] lg:max-w-[785px]">
          {/* Title — Figma 34:1059: Stack Sans SemiBold 48px #303ccf */}
          <h1
            className={cn(
              "home-headline-font !font-semibold text-[clamp(28px,6vw,48px)] leading-[1.08] tracking-tight text-[#303ccf]"
            )}
          >
            {article.title}
          </h1>

          {/* Meta — author / category left; date + share right (Figma 34:1060–1062) */}
          <div
            className={cn(
              robotoMono.className,
              "mt-7 flex flex-col gap-4 border-b border-[#303ccf]/10 pb-7 sm:flex-row sm:items-center sm:justify-between md:mt-9"
            )}
          >
            <p className="text-[17px] font-normal leading-relaxed text-[#212121] md:text-[18px]">
              <span className={row.accentTitle ? "font-medium text-[#1423cb]" : undefined}>{row.author}</span>
              <span className="text-neutral-400"> {" · "} </span>
              <span className="text-neutral-700">{row.metaCategory}</span>
            </p>
            <div className="flex shrink-0 items-center gap-4 sm:justify-end">
              <time
                dateTime={article.publishedAt}
                className="text-[13px] font-normal uppercase tracking-wide text-[#9ca3af] md:text-[14px]"
              >
                {publishedDisplay}
              </time>
              <ArticleShareButton ariaLabel={t("shareArticleAria")} />
            </div>
          </div>

          {excerptText ? (
            <div className={cn(articleWritingWrapClassName, "mt-8 md:mt-10")}>
              {plainTextToParagraphs(excerptText).map((para, i) => (
                <p key={i} className={articleWritingParagraphClassName}>
                  {para}
                </p>
              ))}
            </div>
          ) : null}

          {/* Body — long-form readable column */}
          <div
            className={cn(
              "mt-8 md:mt-11 [&_figure_a]:no-underline [&_figure_a:hover]:no-underline",
              excerptText ? "md:mt-12" : ""
            )}
          >
            {hasBody ? (
              <ArticlePortableBody
                value={article.body}
                pdfLabels={{
                  document: t("pdfDocument"),
                  open: t("pdfOpen"),
                  download: t("pdfDownload")
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
                    documentLabel={t("pdfDocument")}
                    openLabel={t("pdfOpen")}
                    downloadLabel={t("pdfDownload")}
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
        </article>

        <RelatedWritings
          locale={locale}
          items={relatedWritings}
          sectionTitle={t("relatedWritingsHeading")}
        />

        <div className="relative z-10 mx-auto mt-12 flex max-w-[min(100%,720px)] justify-center lg:max-w-[785px] md:mt-16">
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

      <AboutPartnersClosing locale={locale} />
    </main>
  );
}
