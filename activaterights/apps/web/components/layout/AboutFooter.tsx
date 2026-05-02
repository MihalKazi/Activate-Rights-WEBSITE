import Link from "next/link";
import { Roboto_Mono } from "next/font/google";
import { cn } from "../../lib/utils";
import type { Locale } from "../../i18n/config";

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
  /** Wordmark color (defaults to #06b85c) */
  brandClassName?: string;
  /** Email + social row (defaults to #303ccf) */
  linksClassName?: string;
  /** Contact page — forest stripes (#075e3b); default gray bars */
  ruleBarVariant?: "neutral" | "forest";
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
  ruleBarVariant = "neutral"
}: AboutFooterProps) {
  const mail = "mailto:contact@activaterights.org";
  const barClass = ruleBarVariant === "forest" ? "bg-[#075e3b]" : "bg-[#d9d9d9]";

  return (
    <footer className={cn("pb-6 pt-14 text-neutral-900", className ?? "bg-[#fafcff]")}>
      <div className="relative z-10 mx-auto flex max-w-[1440px] flex-col gap-10 px-6 md:flex-row md:items-start md:justify-between md:px-10 lg:px-[40px]">
        <Link
          href={`/${locale}`}
          className={cn(
            "font-extrabold leading-none tracking-tight hover:opacity-90",
            brandClassName ?? "text-[#06b85c]"
          )}
        >
          <span className="block text-[14px] lowercase md:text-[16px]">activate</span>
          <span className="block text-[14px] lowercase md:text-[16px]">rights//</span>
        </Link>

        <div
          className={cn(
            robotoMono.className,
            "flex flex-wrap items-center gap-x-8 gap-y-2 text-[16px] font-light leading-normal md:justify-end",
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
      <div className="relative z-10 mx-auto mt-12 max-w-[1360px] space-y-[7px] px-10 lg:px-[40px]">
        <div className={cn("h-4 w-full", barClass)} />
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={`about-footer-rule-${i}`} className={cn("h-[7px] w-full", barClass)} />
        ))}
      </div>
    </footer>
  );
}
