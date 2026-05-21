"use client";

import { Roboto_Mono } from "next/font/google";
import { useState } from "react";
import { ListingLoadMore } from "../ListingLoadMore";
import { PublicationListingCard } from "../PublicationListingCard";
import { cn } from "../../lib/utils";

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap"
});

export const PUBLICATION_LISTING_INITIAL_COUNT = 4;
export const PUBLICATION_LISTING_LOAD_STEP = 4;

export type PublicationListItem = {
  key: string;
  title: string;
  titleLeadingSlash?: boolean;
  indexLabel: string;
  href: string;
  isExternal?: boolean;
  coverUrl: string | null;
  dateLabel: string | null;
  excerpt: string | null;
  ctaLabel: string;
  ctaAria: string;
};

type PublicationListClientProps = {
  items: PublicationListItem[];
  labels: {
    empty: string;
    loadMore: string;
    kindLabel: string;
  };
};

export function PublicationListClient({ items, labels }: PublicationListClientProps) {
  const [visibleCount, setVisibleCount] = useState(PUBLICATION_LISTING_INITIAL_COUNT);
  const visible = items.slice(0, visibleCount);
  const hasMore = visibleCount < items.length;

  if (items.length === 0) {
    return (
      <p className={cn("text-center text-[17px] text-[#212121]/80", robotoMono.className)}>
        {labels.empty}
      </p>
    );
  }

  return (
    <>
      <ul className="publication-listing-grid" data-scroll-reveal-stagger="straight">
        {visible.map((item) => (
          <li key={item.key}>
            <PublicationListingCard
              title={item.title}
              titleLeadingSlash={item.titleLeadingSlash}
              indexLabel={item.indexLabel}
              href={item.href}
              isExternal={item.isExternal}
              imageUrl={item.coverUrl}
              dateLabel={item.dateLabel}
              excerpt={item.excerpt}
              kindLabel={labels.kindLabel}
              ctaLabel={item.ctaLabel}
              ctaAria={item.ctaAria}
            />
          </li>
        ))}
      </ul>

      {hasMore ? (
        <ListingLoadMore
          onClick={() =>
            setVisibleCount((n) => Math.min(n + PUBLICATION_LISTING_LOAD_STEP, items.length))
          }
        >
          {labels.loadMore}
        </ListingLoadMore>
      ) : null}
    </>
  );
}
