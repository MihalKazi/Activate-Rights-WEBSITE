"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Roboto_Mono } from "next/font/google";
import { useState } from "react";
import { cn } from "../../lib/utils";

/** Matches Figma Home nav (Roboto Mono Regular, 14px, uppercase). */
const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap"
});

type NavbarProps = {
  locale: "en" | "bn";
  /** Set `false` to hide HOME (rare); default is full nav including HOME. */
  showHomeLink?: boolean;
  /**
   * Kept for API compatibility. All items (incl. HOME) share one pill system:
   * rest = white fill + black type; hover = white outline + transparent + white type.
   */
  navGreenStyle?: "default" | "outlined";
  /**
   * `"heroOverlay"` — nav on full-bleed image/cyan hero: logo reads light on photo;
   * pills get a light shadow on the outline state for contrast.
   */
  variant?: "default" | "heroOverlay";
};

const navItems = [
  { label: "HOME", href: "/" },
  { label: "ABOUT", href: "/about" },
  { label: "PROJECTS", href: "/projects" },
  { label: "REPORTS", href: "/reports" },
  { label: "ARTICLES", href: "/articles" },
  { label: "EVENTS", href: "/events" },
  { label: "CONTACT", href: "/team" }
] as const;

function withLocale(locale: "en" | "bn", href: string): string {
  return `/${locale}${href}`;
}

/** Path without locale prefix, e.g. /en/projects → /projects */
function pathWithoutLocale(pathname: string | null): string {
  if (!pathname) return "/";
  const stripped = pathname.replace(/^\/(en|bn)(?=\/|$)/, "");
  if (stripped === "") return "/";
  return stripped.startsWith("/") ? stripped : `/${stripped}`;
}

function isNavActive(pathname: string | null, locale: "en" | "bn", href: string): boolean {
  const current = pathWithoutLocale(pathname);
  if (href === "/") return current === "/" || current === "";
  return current === href || current.startsWith(`${href}/`);
}

export function Navbar({
  locale,
  showHomeLink = true,
  variant = "default"
}: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const links = showHomeLink ? navItems : navItems.filter((item) => item.label !== "HOME");

  const onHero = variant === "heroOverlay";

  const navLinkBase =
    "inline-flex items-center justify-center rounded-none px-[18px] py-[10px] text-[14px] font-normal uppercase leading-none tracking-normal transition-colors";

  /** Rest: solid pill (HOME-style). Hover: outline on bar (CONTACT-style). Hero: light shadow on outline hover. */
  const outlineOnHover = onHero
    ? "hover:border-white hover:bg-transparent hover:text-white hover:drop-shadow-[0_1px_2px_rgba(0,0,0,0.45)]"
    : "hover:border-white hover:bg-transparent hover:text-white";

  const navPillClass = (active: boolean) =>
    cn(
      navLinkBase,
      onHero && "shadow-sm",
      "border border-white transition-colors",
      active
        ? cn("border-white bg-neutral-100 text-black", outlineOnHover)
        : cn("border-white bg-white text-black", outlineOnHover)
    );

  return (
    <header className="relative z-40">
      <nav className="mx-auto flex max-w-[1440px] items-start justify-between gap-6 px-6 pt-5 md:px-10 md:pt-10 lg:px-[40px]">
        <Link
          href={withLocale(locale, "/")}
          className={cn(
            "font-extrabold leading-none tracking-tight",
            onHero ? "text-[#dff6ff] drop-shadow-[0_1px_2px_rgba(0,0,0,0.35)]" : "text-white"
          )}
        >
          <span className="block text-[14px] lowercase md:text-[16px]">activate</span>
          <span className="block text-[14px] lowercase md:text-[16px]">rights//</span>
        </Link>

        <button
          type="button"
          className={cn(
            robotoMono.className,
            "inline-flex rounded-none border border-white bg-white px-[18px] py-[10px] text-[14px] font-normal uppercase leading-none text-black transition-colors md:hidden",
            onHero
              ? "hover:border-white hover:bg-transparent hover:text-white hover:drop-shadow-[0_1px_2px_rgba(0,0,0,0.45)]"
              : "hover:border-white hover:bg-transparent hover:text-white"
          )}
          onClick={() => setIsOpen((prev) => !prev)}
          aria-label="Toggle menu"
        >
          MENU
        </button>

        <div className={cn("hidden items-stretch gap-1 md:flex", robotoMono.className)}>
          {links.map((item) => {
            const active = isNavActive(pathname, locale, item.href);
            return (
              <Link
                key={item.label}
                href={withLocale(locale, item.href)}
                aria-current={active ? "page" : undefined}
                className={navPillClass(active)}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>

      <div className={cn("mx-auto max-w-[1440px] px-6 pb-4 md:hidden lg:px-[40px]", !isOpen && "hidden")}>
        <div className={cn("flex flex-col gap-1", robotoMono.className)}>
          {links.map((item) => {
            const active = isNavActive(pathname, locale, item.href);
            return (
              <Link
                key={item.label}
                href={withLocale(locale, item.href)}
                aria-current={active ? "page" : undefined}
                className={navPillClass(active)}
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
    </header>
  );
}
