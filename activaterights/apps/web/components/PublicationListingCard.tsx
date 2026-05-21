import Image from "next/image";
import Link from "next/link";
import { Roboto_Mono } from "next/font/google";
import { cn } from "../lib/utils";

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap"
});

const linkClass =
  "home-report-card group flex h-full w-full flex-col overflow-hidden outline-none transition-[transform,box-shadow,border-color] duration-300 focus-visible:ring-2 focus-visible:ring-[#303ccf] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f3efe6]";

export type PublicationListingCardProps = {
  title: string;
  titleLeadingSlash?: boolean;
  href: string;
  isExternal?: boolean;
  imageUrl: string | null;
  dateLabel: string | null;
  excerpt: string | null;
  indexLabel: string;
  kindLabel: string;
  ctaLabel: string;
  ctaAria: string;
};

function CardContent({
  title,
  titleLeadingSlash,
  imageUrl,
  dateLabel,
  excerpt,
  indexLabel,
  kindLabel,
  ctaLabel,
  isExternal
}: Omit<PublicationListingCardProps, "href" | "ctaAria"> & { isExternal: boolean }) {
  return (
    <>
      <div className="home-report-card__top">
        <span className={cn("home-report-card__index", robotoMono.className)} aria-hidden>
          {indexLabel}
        </span>
        <div className="home-report-card__cover publication-listing-card__cover">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt=""
              fill
              className="home-report-card__media object-cover"
              sizes="(max-width: 640px) 90vw, 50vw"
            />
          ) : (
            <span
              className="absolute inset-0 bg-[linear-gradient(145deg,#303ccf_0%,#05b557_100%)]"
              aria-hidden
            />
          )}
        </div>
        <span className={cn("home-report-card__kind", robotoMono.className)} aria-hidden>
          {kindLabel}
        </span>
      </div>

      <div className="home-report-card__body">
        {dateLabel ? (
          <p className={cn("home-report-card__date", robotoMono.className)}>
            <span className="home-report-card__slash">//</span>
            {dateLabel}
          </p>
        ) : null}
        <h2 className="home-headline-font home-report-card__title">
          {titleLeadingSlash ? (
            <span className="home-report-card__title-inner">
              <span className="home-report-card__title-slash" aria-hidden>
                /
              </span>
              <span className="home-report-card__title-text">{title}</span>
            </span>
          ) : (
            title
          )}
        </h2>
        {excerpt ? <p className="home-report-card__excerpt">{excerpt}</p> : null}
      </div>

      <div className={cn("home-report-card__footer", robotoMono.className)}>
        <span className="home-report-card__cta">{ctaLabel}</span>
        <span className="home-report-card__arrow" aria-hidden>
          {isExternal ? "↗" : "→"}
        </span>
      </div>
    </>
  );
}

export function PublicationListingCard({
  title,
  titleLeadingSlash,
  href,
  isExternal = false,
  imageUrl,
  dateLabel,
  excerpt,
  indexLabel,
  kindLabel,
  ctaLabel,
  ctaAria
}: PublicationListingCardProps) {
  const content = (
    <CardContent
      title={title}
      titleLeadingSlash={titleLeadingSlash}
      imageUrl={imageUrl}
      dateLabel={dateLabel}
      excerpt={excerpt}
      indexLabel={indexLabel}
      kindLabel={kindLabel}
      ctaLabel={ctaLabel}
      isExternal={isExternal}
    />
  );

  if (isExternal) {
    return (
      <article className="min-w-0">
        <a
          href={href}
          className={linkClass}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={ctaAria}
        >
          {content}
        </a>
      </article>
    );
  }

  return (
    <article className="min-w-0">
      <Link href={href} className={linkClass} aria-label={ctaAria}>
        {content}
      </Link>
    </article>
  );
}
