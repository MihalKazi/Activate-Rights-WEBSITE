"use client";

import Link from "next/link";
import { Roboto_Mono } from "next/font/google";
import { useMemo } from "react";
import { cn } from "../../lib/utils";
import type { Locale } from "../../i18n/config";
import type { ArticleListItem } from "./ArticlesListClient";

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap"
});

const FILTERS = ["all", "opinion", "updates", "feature", "blah"] as const;

type FilterId = (typeof FILTERS)[number];

type ArticleDetailFilterStripProps = {
  locale: Locale;
  labels: {
    filterAll: string;
    filterOpinion: string;
    filterUpdates: string;
    filterFeature: string;
    filterBlah: string;
  };
  /** Highlights the pill that matches this article (same as listing active filter). */
  articleFilter: ArticleListItem["filter"];
};

export function ArticleDetailFilterStrip({ locale, labels, articleFilter }: ArticleDetailFilterStripProps) {
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

  const articlesHref = `/${locale}/articles`;

  return (
    <div className={cn("mb-10 flex flex-wrap gap-1 md:mb-12", robotoMono.className)}>
      {FILTERS.map((id) => {
        const isOn = id !== "all" && id === articleFilter;
        return (
          <Link
            key={id}
            href={articlesHref}
            className={cn(
              "px-[18px] py-[10px] text-[14px] font-normal uppercase leading-none tracking-normal transition-colors",
              isOn
                ? "border border-solid border-[#212121] bg-white text-[#212121]"
                : "border-0 bg-[#212121] text-white hover:bg-neutral-900"
            )}
          >
            {filterLabel[id]}
          </Link>
        );
      })}
    </div>
  );
}
