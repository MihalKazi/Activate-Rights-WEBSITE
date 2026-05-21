"use client";

import { useTranslations } from "next-intl";
import { cn } from "../../lib/utils";
import { WhatWeDoGrid } from "./WhatWeDoGrid";

type WhatWeDoSectionProps = {
  className?: string;
  titleClassName?: string;
};

/** Heading + mission rows (// title left, mono body right). */
export function WhatWeDoSection({ className, titleClassName }: WhatWeDoSectionProps) {
  const t = useTranslations("about");

  return (
    <div className={cn("home-what-we-do-panel", className)} data-scroll-reveal="fade-right">
      <h2
        className={cn(
          "home-headline-font max-w-[min(100%,400px)] text-[clamp(32px,4vw,64px)] font-semibold lowercase leading-[0.9] text-[#05b557]",
          titleClassName
        )}
      >
        <span className="block whitespace-pre-wrap">{t("whatWeDoTitle1")}</span>
        <span className="block whitespace-pre-wrap">{t("whatWeDoTitle2")}</span>
      </h2>
      <WhatWeDoGrid className="home-what-we-do-panel__grid" staggerFromLg />
    </div>
  );
}
