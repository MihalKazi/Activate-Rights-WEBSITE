"use client";

import { useTranslations } from "next-intl";
import { COOKIE_CONSENT_SETTINGS_EVENT } from "../../lib/cookies/consent";

type CookieSettingsLinkProps = {
  className?: string;
};

export function CookieSettingsLink({ className }: CookieSettingsLinkProps) {
  const t = useTranslations("cookies");

  return (
    <button
      type="button"
      className={className}
      onClick={() =>
        window.dispatchEvent(new CustomEvent(COOKIE_CONSENT_SETTINGS_EVENT))
      }
    >
      {t("settings")}
    </button>
  );
}
