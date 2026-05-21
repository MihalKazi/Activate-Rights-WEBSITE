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
  "event-listing-card group block h-full outline-none focus-visible:ring-2 focus-visible:ring-[#303ccf] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f3efe6]";

export type EventListingCardProps = {
  title: string;
  href: string;
  imageUrl: string | null;
  day: string;
  month: string;
  year: string;
  placeLabel: string;
  isOnline: boolean;
  excerpt: string | null;
  kindLabel: string;
  ctaLabel: string;
  ctaAria: string;
};

export function EventListingCard({
  title,
  href,
  imageUrl,
  day,
  month,
  year,
  placeLabel,
  isOnline,
  excerpt,
  kindLabel,
  ctaLabel,
  ctaAria
}: EventListingCardProps) {
  return (
    <article className="min-w-0">
      <Link href={href} className={linkClass} aria-label={ctaAria}>
        <div className="event-listing-card__shell">
          <div className="event-listing-card__date-col" aria-hidden>
            <span className={cn("event-listing-card__day", robotoMono.className)}>{day}</span>
            {month ? (
              <span className={cn("event-listing-card__month", robotoMono.className)}>{month}</span>
            ) : null}
            {year ? (
              <span className={cn("event-listing-card__year", robotoMono.className)}>{year}</span>
            ) : null}
          </div>

          <div className="event-listing-card__main">
            <div className="event-listing-card__media-wrap">
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt=""
                  fill
                  className="event-listing-card__media object-cover"
                  sizes="(max-width: 640px) 90vw, 45vw"
                />
              ) : (
                <span
                  className="absolute inset-0 bg-[linear-gradient(160deg,#212121_0%,#303ccf_45%,#05b557_100%)]"
                  aria-hidden
                />
              )}
              <span className={cn("event-listing-card__stamp", robotoMono.className)}>{kindLabel}</span>
            </div>

            <div
              className={cn(
                "event-listing-card__schedule",
                robotoMono.className,
                isOnline && "event-listing-card__schedule--online"
              )}
            >
              {isOnline ? <span className="event-listing-card__live" aria-hidden /> : null}
              <span>{placeLabel}</span>
            </div>

            <div className="event-listing-card__body">
              <h2 className="home-headline-font event-listing-card__title">{title}</h2>
              {excerpt ? <p className="event-listing-card__excerpt">{excerpt}</p> : null}
              <span className={cn("event-listing-card__cta", robotoMono.className)}>
                {ctaLabel}
                <span aria-hidden>→</span>
              </span>
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}
