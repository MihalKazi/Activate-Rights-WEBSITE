import Link from "next/link";
import { Roboto_Mono } from "next/font/google";
import { cn } from "../../lib/utils";
import type { Locale } from "../../i18n/config";
import { BrandLogo } from "../brand/BrandLogo";

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  weight: ["300", "400"],
  display: "swap"
});

type AboutFooterProps = {
  locale: Locale;
  emailLabel: string;
  facebookLabel: string;
  twitterLabel: string;
  instagramLabel: string;
  /** e.g. Projects mockup uses pure white footer */
  className?: string;
  /** Optional extra classes on the logo link (e.g. `text-white` on dark footers). */
  brandClassName?: string;
  /** Email + social row (defaults to #303ccf) */
  linksClassName?: string;
  /** Contact page — forest stripes (#075e3b); default gray bars */
  ruleBarVariant?: "neutral" | "forest";
  /** Tighter spacing + slightly smaller type (e.g. About page) */
  compact?: boolean;
};

export function AboutFooter({
  locale,
  emailLabel,
  facebookLabel,
  twitterLabel,
  instagramLabel,
  className,
  brandClassName,
  linksClassName,
  ruleBarVariant = "neutral",
  compact = false
}: AboutFooterProps) {
  const mail = "mailto:contact@activaterights.org";
  const barClass = ruleBarVariant === "forest" ? "bg-[#075e3b]" : "bg-[#d9d9d9]";

  return (
    <footer
      className={cn(
        "text-neutral-900",
        compact ? "pb-5 pt-10" : "pb-6 pt-14",
        className ?? "bg-[#fafcff]"
      )}
    >
      <div
        className={cn(
          "relative z-10 mx-auto flex max-w-[1440px] flex-col px-6 md:flex-row md:items-start md:justify-between md:px-10 lg:px-[40px]",
          compact ? "gap-6" : "gap-10"
        )}
      >
        <Link
          href={`/${locale}`}
          className={cn(
            "inline-block shrink-0 outline-none hover:opacity-90 focus-visible:ring-2 focus-visible:ring-[#303ccf] focus-visible:ring-offset-2",
            brandClassName
          )}
        >
          <BrandLogo size={compact ? "compact" : "nav"} />
        </Link>

        <div
          className={cn(
            robotoMono.className,
            "flex flex-wrap items-center gap-x-8 gap-y-2 font-light leading-normal md:justify-end",
            compact ? "text-[14px]" : "text-[16px]",
            linksClassName ?? "text-[#303ccf]"
          )}
        >
          <a href={mail} className="hover:underline">
            {emailLabel}
          </a>
          <a href="https://facebook.com" className="hover:underline" target="_blank" rel="noreferrer noopener">
            {facebookLabel}
          </a>
          <a href="https://x.com" className="hover:underline" target="_blank" rel="noreferrer noopener">
            {twitterLabel}
          </a>
          <a href="https://instagram.com" className="hover:underline" target="_blank" rel="noreferrer noopener">
            {instagramLabel}
          </a>
        </div>
      </div>

      {/* Figma — neutral #d9d9d9 bars; Contact uses forest #075e3b */}
      <div
        className={cn(
          "relative z-10 mx-auto max-w-[1360px] space-y-[7px] px-10 lg:px-[40px]",
          compact ? "mt-8" : "mt-12"
        )}
      >
        <div className={cn("h-4 w-full", barClass)} />
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={`about-footer-rule-${i}`} className={cn("h-[7px] w-full", barClass)} />
        ))}
      </div>
    </footer>
  );
}
