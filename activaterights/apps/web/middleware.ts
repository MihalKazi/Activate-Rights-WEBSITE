import type { NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { defaultLocale, locales } from "./i18n/config";

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localeDetection: true
});

/** Exposes HTML `lang` + SEO helpers for the root layout (`x-activate-locale`). */
export default function middleware(request: NextRequest) {
  const response = intlMiddleware(request);
  const match = request.nextUrl.pathname.match(/^\/(en|bn)(?=\/|$)/);
  if (match?.[1]) {
    response.headers.set("x-activate-locale", match[1]);
  }
  return response;
}

export const config = {
  matcher: [
    "/((?!api|studio|_next|favicon.ico|images|fonts|icons|.*\\..*).*)"
  ]
};
