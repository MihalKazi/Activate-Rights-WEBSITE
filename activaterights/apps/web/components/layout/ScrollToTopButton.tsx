"use client";

import { useCallback, useEffect, useState } from "react";
import { Roboto_Mono } from "next/font/google";
import { useTranslations } from "next-intl";
import { cn } from "../../lib/utils";

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap"
});

const SHOW_AFTER_PX = 360;

export function ScrollToTopButton() {
  const t = useTranslations("common");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > SHOW_AFTER_PX);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const goTop = useCallback(() => {
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: prefersReduced ? "auto" : "smooth" });
  }, []);

  return (
    <button
      type="button"
      onClick={goTop}
      aria-label={t("scrollToTopAria")}
      title={t("scrollToTop")}
      className={cn(
        robotoMono.className,
        "fixed z-[60] flex h-12 min-w-[3rem] items-center justify-center gap-1.5 border border-transparent bg-[#303ccf] px-3 py-2 text-[11px] font-normal uppercase leading-none tracking-wide text-white shadow-[0_4px_18px_rgba(48,60,207,0.38)] transition-[opacity,transform,visibility] duration-200 ease-out sm:min-w-[3.25rem] sm:text-[12px]",
        "hover:bg-[#2839b5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#303ccf] focus-visible:ring-offset-2 focus-visible:ring-offset-white",
        "md:h-14 md:min-w-[3.5rem] md:px-4 md:text-[13px]",
        "bottom-[max(1.25rem,env(safe-area-inset-bottom))] right-[max(1.25rem,env(safe-area-inset-right))] md:bottom-10 md:right-10",
        visible
          ? "pointer-events-auto translate-y-0 opacity-100"
          : "pointer-events-none translate-y-2 opacity-0"
      )}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.25"
        strokeLinecap="square"
        className="shrink-0 sm:h-[18px] sm:w-[18px]"
        aria-hidden
      >
        <path d="M12 20V4M6 11l6-6 6 6" />
      </svg>
      <span className="hidden pl-0.5 sm:inline">{t("scrollToTop")}</span>
    </button>
  );
}
