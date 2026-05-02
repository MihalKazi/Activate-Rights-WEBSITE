"use client";

import Image from "next/image";
import Link from "next/link";
import { Roboto_Mono } from "next/font/google";
import { useMemo, useState } from "react";
import { cn } from "../../lib/utils";
import type { Locale } from "../../i18n/config";

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap"
});

export type ArticleListItem = {
  slug: string;
  title: string;
  author: string;
  metaCategory: string;
  filter: "opinion" | "updates" | "feature" | "blah";
  accentTitle: boolean;
  coverSrc?: string;
  /** Optional display date for article detail (e.g. dd.mm.yyyy) */
  publishedAt?: string;
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
  };
};

const FILTERS: FilterId[] = ["all", "opinion", "updates", "feature", "blah"];

/** Figma 34:849 — light rule under each row (MCP line asset reads as blue tint) */
export const ARTICLE_ROW_RULE_CLASS = "bg-[#b6c7fc]";

export function ArticlesListClient({ locale, items, labels }: ArticlesListClientProps) {
  const [active, setActive] = useState<FilterId>("all");

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

  const visible = useMemo(
    () => (active === "all" ? items : items.filter((i) => i.filter === active)),
    [active, items]
  );

  return (
    <div className="relative z-10 mx-auto w-full max-w-[1130px]">
      {/* Figma 34:962 — gap 4px, 14px mono, 18×10 padding; ALL = border #212121 + white */}
      <div className={cn("mb-10 flex flex-wrap gap-1 md:mb-12", robotoMono.className)}>
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
                  ? "border border-solid border-[#212121] bg-white text-[#212121]"
                  : "border-0 bg-[#212121] text-white hover:bg-neutral-900"
              )}
            >
              {filterLabel[id]}
            </button>
          );
        })}
      </div>

      {/* Figma 34:912–961 — 60px between row+rule blocks; rule from MCP line asset (blue tint) */}
      <ul className="flex flex-col gap-[60px]">
        {visible.map((item) => (
          <li key={item.slug} className="flex flex-col">
            <Link
              href={`/${locale}/articles/${item.slug}`}
              className="group flex flex-col gap-8 outline-none transition-colors lg:flex-row lg:items-center lg:gap-[119px] focus-visible:ring-2 focus-visible:ring-[#303ccf] focus-visible:ring-offset-2 focus-visible:ring-offset-[#fafcff]"
            >
              <div className="relative aspect-[190/114] w-full max-w-[190px] shrink-0 overflow-hidden bg-neutral-300">
                {item.coverSrc ? (
                  <Image src={item.coverSrc} alt="" fill className="object-cover" sizes="190px" />
                ) : null}
                <span
                  className="pointer-events-none absolute inset-0 bg-gradient-to-br from-amber-200/35 via-transparent to-pink-400/30 mix-blend-multiply"
                  aria-hidden
                />
              </div>
              <div className="flex min-w-0 max-w-[701px] flex-1 flex-col gap-11">
                <h2
                  className={cn(
                    "home-headline-font text-[26px] font-normal leading-normal md:text-[30px]",
                    item.accentTitle ? "text-[#303ccf]" : "text-[#1c1c1c]"
                  )}
                >
                  {item.title}
                </h2>
                <div
                  className={cn(
                    robotoMono.className,
                    "flex flex-wrap items-center gap-[18px] text-[14px] font-normal leading-[26px] text-[#212121]"
                  )}
                >
                  <span>{item.metaCategory}</span>
                  <span aria-hidden>/</span>
                  <span className={item.accentTitle ? "text-[#1423cb]" : "text-[#212121]"}>
                    {item.author}
                  </span>
                </div>
              </div>
            </Link>
            <div className={cn("h-px w-full shrink-0", ARTICLE_ROW_RULE_CLASS)} aria-hidden />
          </li>
        ))}
      </ul>

      {/* Figma 34:973 — 20px padding, 18px label */}
      <div className="mt-12 flex justify-center md:mt-16">
        <button
          type="button"
          className={cn(
            robotoMono.className,
            "border border-transparent bg-[#303ccf] p-5 text-[18px] font-normal uppercase leading-none tracking-wide text-white transition-colors hover:bg-[#2839b5]"
          )}
        >
          {labels.loadMore}
        </button>
      </div>
    </div>
  );
}
