import { getRequestConfig } from "next-intl/server";
import { defaultLocale, locales } from "./i18n/config";

export default getRequestConfig(async ({ locale }) => {
  const resolvedLocale =
    locale && locales.includes(locale as (typeof locales)[number])
      ? (locale as (typeof locales)[number])
      : defaultLocale;

  return {
    locale: resolvedLocale,
    messages: (await import(`./i18n/messages/${resolvedLocale}.json`)).default
  };
});
