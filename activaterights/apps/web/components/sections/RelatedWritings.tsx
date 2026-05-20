import Image from "next/image";
import Link from "next/link";
import { Roboto_Mono } from "next/font/google";
import type { Locale } from "../../i18n/config";
import { mapArticleToCardRow } from "../../lib/articles/mapArticleCard";
import type { ArticleListItem } from "../../lib/sanity/queries";
import { ARTICLE_ROW_RULE_CLASS } from "./ArticlesListClient";
import { cn } from "../../lib/utils";

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap"
});

type RelatedWritingsProps = {
  locale: Locale;
  /** Resolved article rows from Sanity (same shape as article list query) */
  items: ArticleListItem[];
  sectionTitle: string;
};

export function RelatedWritings({ locale, items, sectionTitle }: RelatedWritingsProps) {
  if (!items.length) return null;

  return (
    <section
      className="relative z-10 mx-auto mt-14 w-full max-w-[min(100%,720px)] lg:max-w-[785px] md:mt-16"
      aria-labelledby="related-writings-heading"
    >
      <div className={cn("mb-8 h-px w-full", ARTICLE_ROW_RULE_CLASS)} aria-hidden />

      <h2
        id="related-writings-heading"
        className={cn(
          robotoMono.className,
          "mb-8 text-[13px] font-normal uppercase tracking-[0.12em] text-[#303ccf] md:text-[14px]"
        )}
      >
        {sectionTitle}
      </h2>

      <ul className="flex flex-col gap-10 md:gap-12">
        {items.map((row) => {
          const card = mapArticleToCardRow(row, locale);
          return (
            <li key={row._id}>
              <Link
                href={`/${locale}/articles/${card.slug}`}
                className="group flex flex-col gap-5 outline-none transition-colors sm:flex-row sm:items-start sm:gap-8 md:gap-10 focus-visible:ring-2 focus-visible:ring-[#303ccf] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f5f4f2]"
              >
                <div className="relative aspect-[190/114] w-full max-w-[160px] shrink-0 overflow-hidden rounded-sm bg-neutral-300 sm:max-w-[176px]">
                  {card.coverSrc ? (
                    <Image
                      src={card.coverSrc}
                      alt=""
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                      sizes="176px"
                    />
                  ) : null}
                  <span
                    className="pointer-events-none absolute inset-0 bg-gradient-to-br from-amber-200/25 via-transparent to-pink-400/20 mix-blend-multiply"
                    aria-hidden
                  />
                </div>
                <div className="flex min-w-0 flex-1 flex-col gap-4">
                  <h3
                    className={cn(
                      "home-headline-font text-left text-[20px] font-normal leading-snug text-[#1c1c1c] transition-colors group-hover:text-[#303ccf] md:text-[22px]",
                      card.accentTitle && "text-[#303ccf] group-hover:text-[#2839b5]"
                    )}
                  >
                    {card.title}
                  </h3>
                  <div className="home-article-meta-font flex flex-wrap items-center gap-2 text-[12px] font-normal leading-normal text-[#212121] md:text-[13px]">
                    <span className="text-neutral-500">{card.publishedAt}</span>
                    <span aria-hidden className="text-neutral-300">
                      /
                    </span>
                    <span>{card.metaCategory}</span>
                    <span aria-hidden className="text-neutral-300">
                      /
                    </span>
                    <span className={card.accentTitle ? "text-[#1423cb]" : undefined}>{card.author}</span>
                  </div>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
