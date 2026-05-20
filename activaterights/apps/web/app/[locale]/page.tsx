import type { Metadata } from "next";
import type { Image as SanityImage } from "sanity";
import { notFound } from "next/navigation";
import { HomeJsonLd } from "../../components/seo/HomeJsonLd";
import {
  HomeFullLayout,
  type HomeFeaturedProjectCard,
  type HomeInitiativeCard,
  type HomeFeaturedReportCard
} from "../../components/sections/HomeFullLayout";
import { locales, type Locale } from "../../i18n/config";
import { mapArticleToHomeRow, type HomeArticleCard } from "../../lib/articles/mapArticleCard";
import { formatCalendarDayMonthYear } from "../../lib/datetime/formatCalendarDisplay";
import { urlFor } from "../../lib/sanity/image";
import { formatReportCardDate } from "../../lib/reports/formatReportDate";
import { mapReportRowsToListingCards } from "../../lib/reports/mapReportListingCards";
import {
  getArticlesForHome,
  getHomePageInitiatives,
  getHomePageProjects,
  getReportsForHome
} from "../../lib/sanity/queries";
import { withLocaleSeo } from "../../lib/seo/buildPageMetadata";

type HomePageProps = {
  params: {
    locale: string;
  };
};

function formatLaunchDate(iso: string | null | undefined, locale: Locale): string | null {
  if (!iso || typeof iso !== "string") return null;
  const trimmed = iso.trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return null;
  const label = formatCalendarDayMonthYear(`${trimmed}T12:00:00Z`, locale);
  return label === "—" ? null : label;
}

function toHomeReportCards(
  locale: Locale,
  reports: Awaited<ReturnType<typeof getReportsForHome>>
): HomeFeaturedReportCard[] {
  return mapReportRowsToListingCards(reports)
    .filter((r) => r.date.length > 0)
    .map((r) => ({
      slug: r.slug,
      title: r.title,
      titleLeadingSlash: r.titleLeadingSlash,
      dateLabel: formatReportCardDate(r.date, locale),
      imageUrl: r.coverUrl,
      excerpt: r.excerpt
    }));
}

function toFeaturedProjectCards(locale: Locale, projects: Awaited<ReturnType<typeof getHomePageProjects>>): HomeFeaturedProjectCard[] {
  return projects.map((p) => {
    const slug = p.slug?.current?.trim();
    const ext = p.externalUrl?.trim();
    const imageUrl =
      p.coverImage?.asset?._ref != null
        ? urlFor(p.coverImage as SanityImage)
            .width(1200)
            .height(936)
            .fit("crop")
            .auto("format")
            .quality(85)
            .url()
        : null;
    const isExternal = Boolean(ext);
    const href = ext ?? (slug ? `/${locale}/projects/${slug}` : `/${locale}/projects`);
    return {
      title: (p.title && String(p.title).trim()) || "Project",
      href,
      isExternal,
      imageUrl,
      dateLabel: formatLaunchDate(p.launchDate, locale)
    };
  });
}

function toInitiativeCards(
  locale: Locale,
  projects: Awaited<ReturnType<typeof getHomePageInitiatives>>
): HomeInitiativeCard[] {
  return projects.map((p) => {
    const slug = p.slug?.current?.trim();
    const ext = p.externalUrl?.trim();
    const imageUrl =
      p.coverImage?.asset?._ref != null
        ? urlFor(p.coverImage as SanityImage)
            .width(1130)
            .height(626)
            .fit("crop")
            .auto("format")
            .quality(85)
            .url()
        : null;
    const isExternal = Boolean(ext);
    const href = ext ?? (slug ? `/${locale}/projects/${slug}` : `/${locale}/projects`);
    const description =
      typeof p.description === "string" && p.description.trim().length > 0
        ? p.description.trim()
        : null;
    return {
      title: (p.title && String(p.title).trim()) || "Project",
      description,
      href,
      isExternal,
      imageUrl
    };
  });
}

export async function generateMetadata({
  params
}: HomePageProps): Promise<Metadata> {
  const locale = params.locale as Locale;
  const isBangla = locale === "bn";

  const title = isBangla ? "অ্যাক্টিভেট রাইটস" : "Activate Rights";
  const description = isBangla
    ? "বাংলাদেশে ইন্টারনেট স্বাধীনতা, ডিজিটাল অধিকার, গোপনীয়তা ও মানবাধিকার রক্ষায় কাজ করে অ্যাক্টিভেট রাইটস।"
    : "Activate Rights works in Bangladesh for internet freedom, digital rights, privacy, censorship resistance, shutdown monitoring, and human rights online and offline.";

  return withLocaleSeo(locale, "/", {
    title,
    description,
    ogImage: "/images/home-background.png",
    openGraph: {
      type: "website"
    }
  });
}

export default async function HomePage({ params }: HomePageProps) {
  const locale = params.locale as Locale;

  if (!locales.includes(locale)) {
    notFound();
  }

  let featuredProjects: HomeFeaturedProjectCard[] = [];
  try {
    const rows = await getHomePageProjects(locale);
    featuredProjects = toFeaturedProjectCards(locale, rows);
  } catch {
    featuredProjects = [];
  }

  let initiatives: HomeInitiativeCard[] = [];
  try {
    const rows = await getHomePageInitiatives(locale);
    initiatives = toInitiativeCards(locale, rows);
  } catch {
    initiatives = [];
  }

  let homeReports: HomeFeaturedReportCard[] = [];
  try {
    const reportRows = await getReportsForHome(locale);
    homeReports = toHomeReportCards(locale, reportRows);
  } catch {
    homeReports = [];
  }

  let homeArticles: HomeArticleCard[] = [];
  try {
    const articleRows = await getArticlesForHome(locale);
    homeArticles = articleRows
      .filter((r) => r.slug?.current && String(r.slug.current).trim().length > 0)
      .map((r) => mapArticleToHomeRow(r, locale));
  } catch {
    homeArticles = [];
  }

  return (
    <>
      <HomeJsonLd locale={locale} />
      <HomeFullLayout
        locale={locale}
        featuredProjects={featuredProjects}
        initiatives={initiatives}
        reports={homeReports}
        articles={homeArticles}
      />
    </>
  );
}
