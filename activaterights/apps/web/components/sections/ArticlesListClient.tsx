"use client";

import { Roboto_Mono } from "next/font/google";
import { useEffect, useMemo, useState } from "react";
import { ListingLoadMore } from "../ListingLoadMore";
import { ArticleListingCard } from "../ArticleListingCard";
import { cn } from "../../lib/utils";
import type { Locale } from "../../i18n/config";

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap"
});

export const ARTICLES_LISTING_INITIAL_COUNT = 4;
export const ARTICLES_LISTING_LOAD_STEP = 4;

export type ArticleListItem = {
  slug: string;
  title: string;
  author: string;
  metaCategory: string;
  filter: "opinion" | "updates" | "feature" | "blah";
  accentTitle: boolean;
  coverSrc?: string;
  excerpt: string | null;
  publishedAt: string;
};

type FilterId = "all" | "opinion" | "updates" | "feature" | "blah";

type ArticlesListClientProps = {
  locale: Locale;
  items: ArticleListItem[];
  labels: {
    filterAll: string;
    filterOpinion: string;
    filterUpdates: string;
    filterFeature: string;
    filterBlah: string;
    loadMore: string;
    readAction: string;
    empty: string;
  };
};

const FILTERS: FilterId[] = ["all", "opinion", "updates", "feature", "blah"];

/** Related writings divider — light blue rule */
export const ARTICLE_ROW_RULE_CLASS = "bg-[#b6c7fc]";

export function ArticlesListClient({ locale, items, labels }: ArticlesListClientProps) {
  const [active, setActive] = useState<FilterId>("all");
  const [visibleCount, setVisibleCount] = useState(ARTICLES_LISTING_INITIAL_COUNT);

  const filterLabel = useMemo(
    () =>
      ({
        all: labels.filterAll,
        opinion: labels.filterOpinion,
        updates: labels.filterUpdates,
        feature: labels.filterFeature,
        blah: labels.filterBlah
      }) satisfies Record<FilterId, string>,
    [labels]
  );

  const filtered = useMemo(
    () => (active === "all" ? items : items.filter((i) => i.filter === active)),
    [active, items]
  );

  useEffect(() => {
    setVisibleCount(ARTICLES_LISTING_INITIAL_COUNT);
  }, [active]);

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  return (
    <div className="relative z-10 mx-auto w-full max-w-[960px]">
      <div className={cn("mb-8 flex flex-wrap gap-1 md:mb-10", robotoMono.className)}>
        {FILTERS.map((id) => {
          const isOn = active === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => setActive(id)}
              className={cn(
                "px-[18px] py-[10px] text-[14px] font-normal uppercase leading-none tracking-normal transition-colors",
                isOn
                  ? "border border-solid border-[#303ccf] bg-white text-[#303ccf]"
                  : "border border-transparent bg-[#212121] text-white hover:bg-[#303ccf]"
              )}
            >
              {filterLabel[id]}
            </button>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <p className={cn("text-center text-[17px] text-[#212121]/80", robotoMono.className)}>
          {labels.empty}
        </p>
      ) : (
        <ul className="article-listing-list" data-scroll-reveal-stagger="straight">
          {visible.map((item, index) => {
            const indexLabel = String(index + 1).padStart(2, "0");
            return (
              <li key={item.slug}>
                <ArticleListingCard
                  title={item.title}
                  href={`/${locale}/articles/${item.slug}`}
                  excerpt={item.excerpt}
                  coverSrc={item.coverSrc ?? null}
                  publishedAt={item.publishedAt}
                  metaCategory={item.metaCategory}
                  author={item.author}
                  accentTitle={item.accentTitle}
                  indexLabel={indexLabel}
                  readLabel={labels.readAction}
                  ariaLabel={`${labels.readAction}: ${item.title}`}
                />
              </li>
            );
          })}
        </ul>
      )}

      {hasMore ? (
        <ListingLoadMore
          onClick={() =>
            setVisibleCount((n) => Math.min(n + ARTICLES_LISTING_LOAD_STEP, filtered.length))
          }
        >
          {labels.loadMore}
        </ListingLoadMore>
      ) : null}
    </div>
  );
}
