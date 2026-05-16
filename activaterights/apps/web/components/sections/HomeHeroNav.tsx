"use client";

import Link from "next/link";
import { useState, type MouseEvent } from "react";
import { createPortal } from "react-dom";
import { Roboto_Mono } from "next/font/google";
import { useTranslations } from "next-intl";
import { BrandLogoLink } from "../brand/BrandLogo";
import { cn } from "../../lib/utils";

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap"
});

type HomeHeroNavProps = {
  locale: "en" | "bn";
};

const navDefs = [
  { key: "home" as const, href: "/" },
  { key: "about" as const, href: "/about" },
  { key: "projects" as const, href: "/projects" },
  { key: "reports" as const, href: "/reports" },
  { key: "events" as const, href: "/events" },
  { key: "articles" as const, href: "/articles" },
  { key: "contact" as const, href: "/team" }
] as const;

function withLocale(locale: "en" | "bn", href: string): string {
  return `/${locale}${href}`;
}

export function HomeHeroNav({ locale }: HomeHeroNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations("nav");

  const linkClass =
    "border border-white bg-white px-3 py-2 text-[11px] uppercase text-black transition hover:bg-transparent hover:text-white sm:px-[14px] sm:py-[9px] sm:text-[12px] md:px-[18px] md:py-[10px] md:text-[14px]";

  const openMenu = () => setIsOpen(true);
  const closeMenu = () => setIsOpen(false);

  const handleLeaveMenuZone = (e: MouseEvent, partnerSelector: string) => {
    const next = e.relatedTarget;
    if (next instanceof Element && next.closest(partnerSelector)) {
      return;
    }
    closeMenu();
  };

  const backdrop =
    isOpen && typeof document !== "undefined" ? (
      <div
        className="home-hero-nav-backdrop fixed inset-0 z-[35] bg-[#1a5c47]/40 backdrop-blur-md transition-opacity duration-200 md:hidden"
        aria-hidden
        onMouseEnter={openMenu}
        onMouseLeave={(e) => handleLeaveMenuZone(e, "[data-home-hero-nav-menu]")}
      />
    ) : null;

  return (
    <div className="relative z-40 w-full">
      {backdrop ? createPortal(backdrop, document.body) : null}
      <header className="flex w-full items-start justify-between gap-4">
        <BrandLogoLink
          href={withLocale(locale, "/")}
          size="homeHeader"
          priority
          linkClassName="hover:opacity-90 focus-visible:ring-offset-[#248f6b]"
        />
        <div
          data-home-hero-nav-menu
          className="relative shrink-0 md:hidden"
          onMouseEnter={openMenu}
          onMouseLeave={(e) => handleLeaveMenuZone(e, ".home-hero-nav-backdrop")}
          onFocus={openMenu}
          onBlur={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget)) {
              closeMenu();
            }
          }}
        >
          <button
            type="button"
            className={cn(linkClass, robotoMono.className)}
            onClick={() => setIsOpen((prev) => !prev)}
            aria-expanded={isOpen ? "true" : "false"}
            aria-haspopup="true"
            aria-controls="home-hero-nav-menu"
          >
            MENU
          </button>
          <nav
            id="home-hero-nav-menu"
            className={cn(
              "absolute right-0 top-full z-50 mt-2 flex min-w-[12.5rem] flex-col gap-2 transition-[visibility,opacity] duration-150",
              isOpen ? "visible opacity-100" : "pointer-events-none invisible opacity-0",
              robotoMono.className
            )}
            aria-label="Main menu"
            aria-hidden={!isOpen}
          >
            {navDefs.map((item) => (
              <Link
                key={item.href}
                href={withLocale(locale, item.href)}
                className={linkClass}
                onClick={closeMenu}
              >
                {t(item.key)}
              </Link>
            ))}
          </nav>
        </div>
        <nav
          className={cn("hidden flex-wrap justify-end gap-1 md:flex", robotoMono.className)}
          aria-label="Main"
        >
          {navDefs.map((item) => (
            <Link key={item.href} href={withLocale(locale, item.href)} className={linkClass}>
              {t(item.key)}
            </Link>
          ))}
        </nav>
      </header>
    </div>
  );
}
