"use client";

import { Space_Mono } from "next/font/google";
import { useTranslations } from "next-intl";
import { cn } from "../../lib/utils";

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap"
});

type WhatWeDoItem = {
  title: string;
  body: string;
};

type WhatWeDoGridProps = {
  className?: string;
  /** Stagger children only from lg breakpoint (small screens use single panel reveal) */
  staggerFromLg?: boolean;
};

/** Figma-style rows: // title (left) + mono body (right), compact on home. */
export function WhatWeDoGrid({ className, staggerFromLg = false }: WhatWeDoGridProps) {
  const t = useTranslations("about");
  const raw = t.raw("whatWeDoItems");
  const items: WhatWeDoItem[] = Array.isArray(raw)
    ? (raw as WhatWeDoItem[]).filter((item) => item?.title && item?.body)
    : [];

  return (
    <div
      className={cn(
        "home-what-we-do-grid",
        staggerFromLg && "home-what-we-do-grid--stagger-lg",
        className
      )}
      {...(staggerFromLg ? { "data-scroll-reveal-stagger": "straight" } : {})}
    >
      {items.map((item) => (
        <article key={item.title} className="home-what-we-do-row min-w-0">
          <h3 className="home-what-we-do-row__title home-mission-label-font m-0 font-semibold uppercase leading-[1.05] tracking-[0.02em] text-[#303ccf]">
            <span className="home-what-we-do-row__slash text-[#05b557]">//</span>
            <span className="home-what-we-do-row__title-text whitespace-pre-line">
              {item.title}
            </span>
          </h3>
          <p
            className={cn(
              "home-what-we-do-row__body m-0 text-[clamp(12px,1.25vw,15px)] font-normal leading-[1.45] text-[#303ccf]/90 md:text-[15px]",
              spaceMono.className
            )}
          >
            {item.body}
          </p>
        </article>
      ))}
    </div>
  );
}
