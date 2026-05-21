import Image from "next/image";
import Link from "next/link";
import { Roboto_Mono } from "next/font/google";
import { cn } from "../lib/utils";

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap"
});

const cardLinkClass =
  "home-project-card group flex h-full w-full flex-col overflow-hidden outline-none focus-visible:ring-2 focus-visible:ring-[#303ccf] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f5f4f2]";

export type ProjectPosterCardProps = {
  title: string;
  href: string;
  isExternal: boolean;
  imageUrl: string | null;
  dateLabel: string | null;
  indexLabel: string;
  projectLabel: string;
  ctaLabel: string;
  ctaAria: string;
  className?: string;
};

export function ProjectPosterCard({
  title,
  href,
  isExternal,
  imageUrl,
  dateLabel,
  indexLabel,
  projectLabel,
  ctaLabel,
  ctaAria,
  className
}: ProjectPosterCardProps) {
  const cardInner = (
    <>
      <div className="relative aspect-[5/4] w-full overflow-hidden bg-[#e8e8e8] sm:aspect-[598/468]">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt=""
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
            className="home-project-card__media object-cover"
          />
        ) : (
          <span
            className="absolute inset-0 bg-[linear-gradient(145deg,#303ccf_0%,#05b557_100%)] opacity-90"
            aria-hidden
          />
        )}
        <span
          className={cn(
            "absolute left-0 top-0 z-[1] bg-[#303ccf] px-2.5 py-1 text-[11px] uppercase leading-none tracking-wider text-white sm:text-[12px]",
            robotoMono.className
          )}
          aria-hidden
        >
          {indexLabel}
        </span>
        <div className="absolute inset-x-0 bottom-0 z-[1] bg-[#05b557] px-2.5 py-2 sm:px-3 sm:py-2.5">
          <h3 className="home-headline-font m-0 line-clamp-2 text-[clamp(14px,2vw,18px)] font-bold leading-[1.05] tracking-tight text-white">
            {title}
          </h3>
        </div>
      </div>
      <div
        className={cn(
          "home-project-card__footer flex flex-col gap-1.5 border-t-2 border-[#303ccf] bg-white px-2.5 py-2.5 sm:px-3 sm:py-3",
          robotoMono.className
        )}
      >
        {dateLabel ? (
          <span className="text-[11px] uppercase leading-snug tracking-wide text-[#212121]/55 sm:text-[12px]">
            {dateLabel}
          </span>
        ) : (
          <span className="text-[11px] uppercase leading-snug tracking-wide text-[#212121]/40 sm:text-[12px]">
            {projectLabel}
          </span>
        )}
        <span className="home-project-card__cta text-[12px] font-normal uppercase leading-snug tracking-wide text-[#303ccf] underline decoration-[#303ccf] sm:text-[13px]">
          {ctaLabel}
          {isExternal ? " ↗" : " →"}
        </span>
      </div>
    </>
  );

  const articleClass = cn("scroll-reveal-card flex min-w-0", className);

  if (isExternal) {
    return (
      <article className={articleClass}>
        <a
          href={href}
          className={cardLinkClass}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${ctaAria}: ${title}`}
        >
          {cardInner}
        </a>
      </article>
    );
  }

  return (
    <article className={articleClass}>
      <Link href={href} className={cardLinkClass} aria-label={`${ctaAria}: ${title}`}>
        {cardInner}
      </Link>
    </article>
  );
}
