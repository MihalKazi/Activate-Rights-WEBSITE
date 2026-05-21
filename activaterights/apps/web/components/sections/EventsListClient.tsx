"use client";

import { Roboto_Mono } from "next/font/google";
import { useState } from "react";
import { ListingLoadMore } from "../ListingLoadMore";
import { EventListingCard } from "../EventListingCard";
import { cn } from "../../lib/utils";

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap"
});

export const EVENTS_LISTING_INITIAL_COUNT = 4;
export const EVENTS_LISTING_LOAD_STEP = 4;

export type EventListItem = {
  key: string;
  title: string;
  href: string;
  coverUrl: string | null;
  day: string;
  month: string;
  year: string;
  placeLabel: string;
  isOnline: boolean;
  excerpt: string | null;
  ctaLabel: string;
  ctaAria: string;
};

type EventsListClientProps = {
  items: EventListItem[];
  labels: {
    empty: string;
    loadMore: string;
    eventKind: string;
  };
};

export function EventsListClient({ items, labels }: EventsListClientProps) {
  const [visibleCount, setVisibleCount] = useState(EVENTS_LISTING_INITIAL_COUNT);
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
      <ul className="event-listing-grid" data-scroll-reveal-stagger="straight">
        {visible.map((item) => (
          <li key={item.key}>
            <EventListingCard
              title={item.title}
              href={item.href}
              imageUrl={item.coverUrl}
              day={item.day}
              month={item.month}
              year={item.year}
              placeLabel={item.placeLabel}
              isOnline={item.isOnline}
              excerpt={item.excerpt}
              kindLabel={labels.eventKind}
              ctaLabel={item.ctaLabel}
              ctaAria={item.ctaAria}
            />
          </li>
        ))}
      </ul>

      {hasMore ? (
        <ListingLoadMore
          onClick={() =>
            setVisibleCount((n) => Math.min(n + EVENTS_LISTING_LOAD_STEP, items.length))
          }
        >
          {labels.loadMore}
        </ListingLoadMore>
      ) : null}
    </>
  );
}
