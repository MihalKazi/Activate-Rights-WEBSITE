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
  "home-article-card article-listing-card group block w-full overflow-hidden outline-none transition-[transform,box-shadow,border-color] duration-300 focus-visible:ring-2 focus-visible:ring-[#303ccf] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f3efe6]";

export type ArticleListingCardProps = {
  title: string;
  href: string;
  excerpt: string | null;
  coverSrc: string | null;
  publishedAt: string;
  metaCategory: string;
  author: string;
  accentTitle: boolean;
  indexLabel: string;
  readLabel: string;
  ariaLabel: string;
};

export function ArticleListingCard({
  title,
  href,
  excerpt,
  coverSrc,
  publishedAt,
  metaCategory,
  author,
  accentTitle,
  indexLabel,
  readLabel,
  ariaLabel
}: ArticleListingCardProps) {
  return (
    <article className="article-listing-card-wrap scroll-reveal-card min-w-0">
      <Link href={href} className={linkClass} aria-label={ariaLabel}>
        <div className="home-article-card__layout">
          <div className="home-article-card__media-col">
            <span className={cn("home-article-card__index", robotoMono.className)} aria-hidden>
              {indexLabel}
            </span>
            <div className="home-article-card__cover">
              {coverSrc ? (
                <Image
                  src={coverSrc}
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
            <span className={cn("home-article-card__kind", robotoMono.className)} aria-hidden>
              {metaCategory}
            </span>
          </div>

          <div className="home-article-card__content">
            <div className="home-article-card__body">
              <p className={cn("home-article-card__date", robotoMono.className)}>
                <span className="home-article-card__slash">//</span>
                {publishedAt}
              </p>
              <h2
                className={cn(
                  "home-headline-font home-article-card__title",
                  accentTitle && "home-article-card__title--featured"
                )}
              >
                {title}
              </h2>
              {excerpt ? <p className="home-article-card__excerpt">{excerpt}</p> : null}
            </div>

            <div className={cn("home-article-card__footer", robotoMono.className, "home-article-meta-font")}>
              <p className="home-article-card__meta min-w-0">
                <span>{metaCategory}</span>
                <span className="home-article-card__meta-sep" aria-hidden>
                  /
                </span>
                <span
                  className={accentTitle ? "home-article-card__meta-author--accent" : undefined}
                >
                  {author}
                </span>
              </p>
              <span className="home-article-card__cta shrink-0">
                {readLabel}
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
}
