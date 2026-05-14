import type { MetadataRoute } from "next";
import { locales } from "../i18n/config";
import { getSiteUrl } from "../lib/seo/site";
import {
  getAllArticleSlugs,
  getAllCampaignSlugs,
  getAllEventSlugs,
  getAllProjectSlugs,
  getAllReportSlugs
} from "../lib/sanity/queries";

/** Fresh URLs for crawlers when Sanity is available at request time. */
export const dynamic = "force-dynamic";

const STATIC_PATHS = [
  "/",
  "/about",
  "/articles",
  "/events",
  "/projects",
  "/reports",
  "/team",
  "/campaigns"
] as const;

async function safeSlugs(fetcher: () => Promise<string[]>): Promise<string[]> {
  try {
    return await fetcher();
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl();
  const [articleSlugs, eventSlugs, projectSlugs, campaignSlugs, reportSlugs] = await Promise.all([
    safeSlugs(getAllArticleSlugs),
    safeSlugs(getAllEventSlugs),
    safeSlugs(getAllProjectSlugs),
    safeSlugs(getAllCampaignSlugs),
    safeSlugs(getAllReportSlugs)
  ]);

  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const path of STATIC_PATHS) {
      const suffix = path === "/" ? "" : path;
      entries.push({
        url: `${base}/${locale}${suffix}`,
        lastModified: new Date(),
        changeFrequency: path === "/" ? "weekly" : "monthly",
        priority: path === "/" ? 1 : path === "/articles" ? 0.95 : 0.85
      });
    }

    for (const slug of articleSlugs) {
      entries.push({
        url: `${base}/${locale}/articles/${encodeURIComponent(slug)}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.75
      });
    }

    for (const slug of eventSlugs) {
      entries.push({
        url: `${base}/${locale}/events/${encodeURIComponent(slug)}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.72
      });
    }

    for (const slug of projectSlugs) {
      entries.push({
        url: `${base}/${locale}/projects/${encodeURIComponent(slug)}`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.65
      });
    }

    for (const slug of campaignSlugs) {
      entries.push({
        url: `${base}/${locale}/campaigns/${encodeURIComponent(slug)}`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.65
      });
    }

    for (const slug of reportSlugs) {
      entries.push({
        url: `${base}/${locale}/reports/${encodeURIComponent(slug)}`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.72
      });
    }
  }

  return entries;
}
