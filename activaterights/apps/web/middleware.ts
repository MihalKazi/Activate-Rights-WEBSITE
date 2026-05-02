import createMiddleware from "next-intl/middleware";
import { defaultLocale, locales } from "./i18n/config";

export default createMiddleware({
  locales,
  defaultLocale,
  localeDetection: true
});

export const config = {
  matcher: [
    "/((?!api|studio|_next|favicon.ico|images|fonts|icons|.*\\..*).*)"
  ]
};
