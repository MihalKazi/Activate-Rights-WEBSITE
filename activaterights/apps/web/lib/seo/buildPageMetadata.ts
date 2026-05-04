import type { Metadata } from "next";
import { locales, type Locale } from "../../i18n/config";
import { getSiteUrl } from "./site";

/** Path after locale: `"/"`, `"/about"`, `"/articles/slug"`. Always normalized to start with `/`. */
function normalizePath(path: string): "/" | `/${string}` {
  const p = path.trim();
  if (p === "" || p === "/") return "/";
  return (p.startsWith("/") ? p : `/${p}`) as `/${string}`;
}

function suffix(path: "/" | `/${string}`): string {
  return path === "/" ? "" : path;
}

function absoluteUrl(locale: string, path: "/" | `/${string}`): string {
  return `${getSiteUrl()}/${locale}${suffix(path)}`;
}

/**
 * Adds `alternates` (canonical + hreflang), default `openGraph.url`, and Twitter card hints.
 * Pass `openGraph` / `twitter` in `meta` to merge; `ogImage` becomes absolute OG + Twitter image.
 */
export function withLocaleSeo(
  locale: Locale,
  path: string,
  meta: Metadata & { ogImage?: string | null }
): Metadata {
  const pathname = normalizePath(path);
  const { ogImage, openGraph: ogIn, twitter: twIn, ...rest } = meta;
  const base = getSiteUrl();
  const languages: Record<string, string> = {};
  for (const loc of locales) {
    languages[loc] = absoluteUrl(loc, pathname);
  }
  languages["x-default"] = absoluteUrl("en", pathname);

  const imageUrl =
    typeof ogImage === "string" && ogImage.length > 0
      ? ogImage.startsWith("http")
        ? ogImage
        : `${base}${ogImage.startsWith("/") ? ogImage : `/${ogImage}`}`
      : undefined;

  const titleForAlt = typeof rest.title === "string" ? rest.title : undefined;
  const ogImages =
    imageUrl !== undefined
      ? [{ url: imageUrl, width: 1200, height: 630, ...(titleForAlt ? { alt: titleForAlt } : {}) }]
      : undefined;

  return {
    ...rest,
    alternates: {
      ...rest.alternates,
      canonical: absoluteUrl(locale, pathname),
      languages
    },
    openGraph: {
      type: "website",
      siteName: "Activate Rights",
      url: absoluteUrl(locale, pathname),
      locale: locale === "bn" ? "bn_BD" : "en_US",
      alternateLocale: locale === "bn" ? ["en_US"] : ["bn_BD"],
      ...ogIn,
      ...(ogImages ? { images: ogImages } : {})
    },
    twitter: {
      card: "summary_large_image",
      ...twIn,
      ...(imageUrl ? { images: [imageUrl] } : {})
    }
  };
}
