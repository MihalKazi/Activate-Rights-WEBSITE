import { getRequestConfig } from "next-intl/server";
import { defaultLocale, locales } from "./i18n/config";

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !locales.includes(locale as (typeof locales)[number])) {
    locale = defaultLocale;
  }

  const resolvedLocale = locale as (typeof locales)[number];

  return {
    locale: resolvedLocale,
    messages: (await import(`./i18n/messages/${resolvedLocale}.json`)).default
  };
});
