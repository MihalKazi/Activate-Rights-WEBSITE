import Image from "next/image";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { Roboto_Mono } from "next/font/google";
import type { Image as SanityImage } from "sanity";
import {
  hasPublicationAttachments,
  PublicationAttachmentsList
} from "../PublicationAttachmentsList";
import {
  ArticlePortableBody,
  articleWritingParagraphClassName,
  articleWritingWrapClassName
} from "../ArticlePortableBody";
import { AboutPartnersClosing } from "../layout/AboutPartnersClosing";
import { Navbar } from "../layout/Navbar";
import type { Locale } from "../../i18n/config";
import { formatReportCardDate } from "../../lib/reports/formatReportDate";
import { plainTextToParagraphs } from "../../lib/plainTextParagraphs";
import { getReportBySlug } from "../../lib/sanity/queries";
import { urlFor } from "../../lib/sanity/image";
import { ArticleShareButton } from "./ArticleShareButton";
import { cn } from "../../lib/utils";

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap"
});

type ReportDetailSectionsProps = {
  locale: Locale;
  slug: string;
};

export async function ReportDetailSections({ locale, slug }: ReportDetailSectionsProps) {
  const t = await getTranslations({ locale, namespace: "reports" });
  const tArticles = await getTranslations({ locale, namespace: "articles" });

  const report = await getReportBySlug(slug, locale);
  if (!report) {
    notFound();
  }

  const coverSrc = report.coverImage?.asset?._ref
    ? urlFor(report.coverImage as SanityImage).width(1920).height(1080).fit("crop").auto("format").url()
    : undefined;

  const dateDisplay = formatReportCardDate(report.publishedDate, locale);
  const hasBody = Array.isArray(report.body) && report.body.length > 0;
  const hasAttachments = hasPublicationAttachments(report.attachments);
  const showBodyFallback = !hasBody && !hasAttachments;
  const attachmentLabels = {
    pdfDocument: tArticles("pdfDocument"),
    imageDocument: t("attachmentImage"),
    videoDocument: t("attachmentVideo"),
    audioDocument: t("attachmentAudio"),
    fileDocument: t("attachmentFile"),
    open: tArticles("pdfOpen"),
    download: tArticles("pdfDownload")
  };
  const excerptText = report.excerpt?.trim();

  return (
    <main className="flex min-h-screen flex-col overflow-x-clip site-white-section text-[#212121]">
      <div className="relative w-full">
        <div className="relative h-[min(56vw,804px)] min-h-[220px] w-full overflow-hidden bg-neutral-300">
          {coverSrc ? (
            <Image
              src={coverSrc}
              alt={report.title}
              fill
              className="object-cover"
              sizes="100vw"
              priority
            />
          ) : (
            <div className="absolute inset-0 projects-grain-green" aria-hidden />
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

      <section className="site-white-section px-6 pb-12 pt-10 md:px-10 md:pb-16 md:pt-12 lg:px-[40px] lg:pb-20 lg:pt-14">
        <article className="mx-auto w-full max-w-[min(100%,720px)] lg:max-w-[785px]">
          <h1
            className={cn(
              "home-headline-font !font-semibold text-[clamp(28px,6vw,48px)] leading-[1.08] tracking-tight text-[#303ccf]"
            )}
          >
            {report.titleLeadingSlash ? (
              <>
                <span className="text-[#05b557]">/</span>
                <span>{` ${report.title}`}</span>
              </>
            ) : (
              report.title
            )}
          </h1>

          <div className="home-article-meta-font mt-7 flex flex-col gap-4 border-b border-[#303ccf]/10 pb-7 sm:flex-row sm:items-center sm:justify-between md:mt-9">
            <p className="text-[17px] font-normal leading-relaxed text-[#212121] md:text-[18px]">
              {t("reportKind")}
            </p>
            <div className="flex shrink-0 items-center gap-4 sm:justify-end">
              <time
                dateTime={report.publishedDate}
                className="text-[13px] font-normal uppercase tracking-wide text-[#9ca3af] md:text-[14px]"
              >
                {dateDisplay}
              </time>
              <ArticleShareButton ariaLabel={t("shareReportAria")} />
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

          <div
            className={cn(
              "mt-8 md:mt-11 [&_figure_a]:no-underline [&_figure_a:hover]:no-underline",
              excerptText ? "md:mt-12" : ""
            )}
          >
            {hasBody ? (
              <ArticlePortableBody
                value={report.body}
                pdfLabels={{
                  document: tArticles("pdfDocument"),
                  open: tArticles("pdfOpen"),
                  download: tArticles("pdfDownload")
                }}
              />
            ) : null}
            <PublicationAttachmentsList
              attachments={report.attachments}
              labels={attachmentLabels}
              spacedBelowBody={hasBody}
            />
            {showBodyFallback ? (
              <div className={articleWritingWrapClassName}>
                <p className={articleWritingParagraphClassName}>{t("fallbackBody")}</p>
              </div>
            ) : null}
          </div>
        </article>

        <div className="relative z-10 mx-auto mt-12 flex max-w-[min(100%,720px)] justify-center md:mt-16 lg:max-w-[785px]">
          <Link
            href={`/${locale}/reports`}
            className={cn(
              robotoMono.className,
              "border border-transparent bg-[#303ccf] px-8 py-5 text-[18px] font-normal uppercase leading-none tracking-wide text-white transition-colors hover:bg-[#2839b5]"
            )}
          >
            {t("backToReports")}
          </Link>
        </div>
      </section>

      <div className="relative z-10 mx-auto w-full max-w-[1354px] border-t border-dashed border-[#c1bebe]/80 px-6 md:px-10 lg:px-[40px]" />

      <AboutPartnersClosing locale={locale} />
    </main>
  );
}
