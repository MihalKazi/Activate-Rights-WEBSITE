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
import { getProjectBySlug } from "../../lib/sanity/queries";
import { urlFor } from "../../lib/sanity/image";
import { ArticleShareButton } from "./ArticleShareButton";
import { cn } from "../../lib/utils";

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap"
});

type ProjectDetailSectionsProps = {
  locale: Locale;
  slug: string;
};

function statusLabel(status: string, t: (key: string) => string): string {
  if (status === "active") return t("statusActive");
  if (status === "completed") return t("statusCompleted");
  if (status === "ongoing") return t("statusOngoing");
  return status;
}

export async function ProjectDetailSections({ locale, slug }: ProjectDetailSectionsProps) {
  const t = await getTranslations({ locale, namespace: "projects" });
  const tArticles = await getTranslations({ locale, namespace: "articles" });

  const project = await getProjectBySlug(slug, locale);
  if (!project) {
    notFound();
  }

  const coverSrc = project.coverImage?.asset?._ref
    ? urlFor(project.coverImage as SanityImage).width(1920).height(1080).fit("crop").auto("format").url()
    : undefined;

  const dateDisplay =
    project.launchDate && /^\d{4}-\d{2}-\d{2}$/.test(project.launchDate.trim())
      ? formatReportCardDate(project.launchDate, locale)
      : null;
  const hasBody = Array.isArray(project.body) && project.body.length > 0;
  const hasAttachments = hasPublicationAttachments(project.attachments);
  const descriptionText = project.description?.trim();
  const showBodyFallback = !hasBody && !hasAttachments && !descriptionText;
  const externalUrl = project.externalUrl?.trim();
  const attachmentLabels = {
    pdfDocument: tArticles("pdfDocument"),
    imageDocument: t("attachmentImage"),
    videoDocument: t("attachmentVideo"),
    audioDocument: t("attachmentAudio"),
    fileDocument: t("attachmentFile"),
    open: tArticles("pdfOpen"),
    download: tArticles("pdfDownload")
  };

  return (
    <main className="flex min-h-screen flex-col overflow-x-clip site-white-section text-[#212121]">
      <div className="relative w-full">
        <div className="relative h-[min(56vw,804px)] min-h-[220px] w-full overflow-hidden bg-neutral-300">
          {coverSrc ? (
            <Image
              src={coverSrc}
              alt={project.title}
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

      <section className="relative site-white-section px-6 pb-12 pt-10 md:px-10 md:pb-16 md:pt-12 lg:px-[40px] lg:pb-20 lg:pt-14">
        <div className="reports-body-grain pointer-events-none absolute inset-0 z-0" aria-hidden />

        <article className="relative z-10 mx-auto w-full max-w-[min(100%,720px)] lg:max-w-[785px]">
          <h1
            className={cn(
              "home-headline-font !font-semibold text-[clamp(28px,6vw,48px)] leading-[1.08] tracking-tight text-[#303ccf]"
            )}
          >
            {project.title}
          </h1>

          <div className="home-article-meta-font mt-7 flex flex-col gap-4 border-b border-[#303ccf]/10 pb-7 sm:flex-row sm:items-center sm:justify-between md:mt-9">
            <p className="text-[17px] font-normal leading-relaxed text-[#212121] md:text-[18px]">
              {statusLabel(project.status, t)}
            </p>
            <div className="flex shrink-0 items-center gap-4 sm:justify-end">
              {dateDisplay ? (
                <time
                  dateTime={project.launchDate ?? undefined}
                  className="text-[13px] font-normal uppercase tracking-wide text-[#9ca3af] md:text-[14px]"
                >
                  {dateDisplay}
                </time>
              ) : null}
              <ArticleShareButton ariaLabel={t("shareProjectAria")} />
            </div>
          </div>

          {descriptionText ? (
            <div className={cn(articleWritingWrapClassName, "mt-8 md:mt-10")}>
              {plainTextToParagraphs(descriptionText).map((para, i) => (
                <p key={i} className={articleWritingParagraphClassName}>
                  {para}
                </p>
              ))}
            </div>
          ) : null}

          <div
            className={cn(
              "mt-8 md:mt-11 [&_figure_a]:no-underline [&_figure_a:hover]:no-underline",
              descriptionText ? "md:mt-12" : ""
            )}
          >
            {hasBody ? (
              <ArticlePortableBody
                value={project.body}
                pdfLabels={{
                  document: tArticles("pdfDocument"),
                  open: tArticles("pdfOpen"),
                  download: tArticles("pdfDownload")
                }}
              />
            ) : null}
            <PublicationAttachmentsList
              attachments={project.attachments}
              labels={attachmentLabels}
              spacedBelowBody={hasBody}
            />
            {showBodyFallback ? (
              <div className={articleWritingWrapClassName}>
                <p className={articleWritingParagraphClassName}>{t("fallbackBody")}</p>
              </div>
            ) : null}
          </div>

          {externalUrl ? (
            <div className="mt-10 md:mt-12">
              <a
                href={externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  robotoMono.className,
                  "inline-flex w-full items-center justify-center border border-transparent bg-[#06b85c] px-8 py-5 text-[18px] font-normal uppercase leading-none tracking-wide text-white transition-colors hover:bg-[#059c50] sm:w-auto"
                )}
                aria-label={t("externalLinkAria")}
              >
                {t("externalLink")}
              </a>
            </div>
          ) : null}
        </article>

        <div className="relative z-10 mx-auto mt-12 flex max-w-[min(100%,720px)] justify-center md:mt-16 lg:max-w-[785px]">
          <Link
            href={`/${locale}/projects`}
            className={cn(
              robotoMono.className,
              "border border-transparent bg-[#303ccf] px-8 py-5 text-[18px] font-normal uppercase leading-none tracking-wide text-white transition-colors hover:bg-[#2839b5]"
            )}
          >
            {t("backToProjects")}
          </Link>
        </div>
      </section>

      <div className="relative z-10 mx-auto w-full max-w-[1354px] border-t border-dashed border-[#c1bebe]/80 px-6 md:px-10 lg:px-[40px]" />

      <AboutPartnersClosing locale={locale} />
    </main>
  );
}

