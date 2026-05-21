"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Roboto_Mono } from "next/font/google";
import { useLocale, useTranslations } from "next-intl";
import {
  COOKIE_CONSENT_SETTINGS_EVENT,
  readConsent,
  writeConsent,
  type CookieConsentChoice,
  type CookieConsentState
} from "../../lib/cookies/consent";
import { cn } from "../../lib/utils";

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap"
});

function withLocale(locale: string, href: string): string {
  return `/${locale}${href}`;
}

export function CookieConsent() {
  const t = useTranslations("cookies");
  const locale = useLocale();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setOpen(!readConsent());
  }, []);

  useEffect(() => {
    const onSettings = () => setOpen(true);
    window.addEventListener(COOKIE_CONSENT_SETTINGS_EVENT, onSettings);
    return () =>
      window.removeEventListener(COOKIE_CONSENT_SETTINGS_EVENT, onSettings);
  }, []);

  const save = useCallback((choice: CookieConsentChoice) => {
    const state: CookieConsentState = {
      choice,
      updatedAt: new Date().toISOString()
    };
    writeConsent(state);
    setOpen(false);
  }, []);

  if (!mounted || !open) return null;

  return (
    <div
      className="cookie-consent fixed inset-x-0 bottom-0 z-[70] px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3 sm:px-6"
      role="dialog"
      aria-labelledby="cookie-consent-title"
      aria-describedby="cookie-consent-desc"
      aria-modal="false"
    >
      <div
        className={cn(
          "cookie-consent__panel mx-auto flex max-w-[1440px] flex-col gap-5 border-2 border-[#303ccf] bg-white p-5 shadow-[6px_6px_0_#303ccf] sm:flex-row sm:items-center sm:justify-between sm:gap-8 sm:p-6",
          robotoMono.className
        )}
      >
        <div className="min-w-0 flex-1">
          <p
            id="cookie-consent-title"
            className="text-[13px] font-normal uppercase tracking-[0.12em] text-[#303ccf] sm:text-[12px]"
          >
            {t("title")}
          </p>
          <p
            id="cookie-consent-desc"
            className="mt-2 text-[14px] leading-snug text-black/85 sm:text-[15px]"
          >
            {t("description")}{" "}
            <Link
              href={withLocale(locale, "/contact")}
              className="text-[#303ccf] underline underline-offset-2 hover:text-[#2839b5]"
            >
              {t("contactLink")}
            </Link>
            .
          </p>
        </div>

        <div className="flex shrink-0 flex-col gap-2 sm:flex-row sm:items-center">
          <button
            type="button"
            onClick={() => save("essential")}
            className="cookie-consent__btn cookie-consent__btn--secondary px-5 py-3 text-[12px] uppercase tracking-wide"
          >
            {t("essentialOnly")}
          </button>
          <button
            type="button"
            onClick={() => save("all")}
            className="cookie-consent__btn cookie-consent__btn--primary px-5 py-3 text-[12px] uppercase tracking-wide text-white"
          >
            {t("acceptAll")}
          </button>
        </div>
      </div>
    </div>
  );
}
