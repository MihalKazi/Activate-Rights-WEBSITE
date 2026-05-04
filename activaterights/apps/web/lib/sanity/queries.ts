import { groq } from "next-sanity";
import { normalizeArticleSlugParam } from "../articles/slug";
import { sanityClient } from "./client";
import type { Locale } from "../../i18n/config";

type Slug = { current: string };
type SanityImage = {
  asset?: {
    _ref: string;
    _type: "reference";
  };
};

export type ArticleListItem = {
  _id: string;
  title: string;
  slug: Slug;
  excerpt: string | null;
  coverImage: SanityImage;
  publishedAt: string;
  category?: string | null;
  featured?: boolean;
  /** Resolved display name: team member or guest author */
  authorName?: string | null;
};

export type ArticlePdfAttachment = {
  title?: string | null;
  url: string | null;
};

export type ArticleDetail = ArticleListItem & {
  body: unknown[] | null;
  category?: string;
  guestAuthor?: string | null;
  /** Curated picks from Sanity; shown at bottom of article page */
  relatedArticles?: ArticleListItem[];
  /** Uploaded PDFs from Studio */
  pdfAttachments?: ArticlePdfAttachment[];
};

export type ProjectItem = {
  _id: string;
  title: string;
  slug: Slug;
  description: string;
  status: "active" | "completed" | "ongoing";
  coverImage: SanityImage;
  externalUrl?: string;
  order: number;
};

export type TeamMember = {
  _id: string;
  name: string;
  role: string;
  bio?: string;
  /** Stylized / ASCII-style image for About cards (default layer). */
  asciiPhoto?: SanityImage;
  /** Real photo (revealed on hover/focus on About). */
  photo?: SanityImage;
  socialLinks: { platform: string; url: string }[];
};

export type EventItem = {
  _id: string;
  title: string;
  slug: Slug;
  description?: string;
  date: string;
  location?: string;
  isOnline: boolean;
  registrationUrl?: string;
  coverImage: SanityImage;
};

export type CampaignItem = {
  _id: string;
  title: string;
  slug: Slug;
  summary?: string;
  body?: unknown[];
  status: "active" | "ended";
  coverImage: SanityImage;
  startDate?: string;
  endDate?: string;
};

export type SiteSettings = {
  siteName: string;
  siteDescription?: string;
  navLinks: { label?: string; href?: string }[];
  footerText?: string;
  socialLinks: { platform?: string; url?: string }[];
  seoDefaults?: {
    metaTitle?: string;
    metaDescription?: string;
    ogImage?: SanityImage;
  };
};

/** Prefer locale, then other language — skips empty strings (coalesce alone keeps ""). */
const localizedArticleTitle = `
select(
  $locale == "en" && defined(title.en) && title.en != "" => title.en,
  $locale == "en" && defined(title.bn) && title.bn != "" => title.bn,
  $locale == "bn" && defined(title.bn) && title.bn != "" => title.bn,
  $locale == "bn" && defined(title.en) && title.en != "" => title.en,
  defined(title.en) && title.en != "" => title.en,
  defined(title.bn) && title.bn != "" => title.bn,
  ""
)
`.trim();

const localizedArticleExcerpt = `
select(
  $locale == "en" && defined(excerpt.en) && excerpt.en != "" => excerpt.en,
  $locale == "en" && defined(excerpt.bn) && excerpt.bn != "" => excerpt.bn,
  $locale == "bn" && defined(excerpt.bn) && excerpt.bn != "" => excerpt.bn,
  $locale == "bn" && defined(excerpt.en) && excerpt.en != "" => excerpt.en,
  defined(excerpt.en) && excerpt.en != "" => excerpt.en,
  defined(excerpt.bn) && excerpt.bn != "" => excerpt.bn,
  ""
)
`.trim();

/** Prefer locale with blocks, then fall back — coalesce([]) wrongly kept empty arrays. */
const localizedArticleBody = `
select(
  $locale == "en" && count(coalesce(body.en, [])) > 0 => body.en,
  $locale == "en" && count(coalesce(body.bn, [])) > 0 => body.bn,
  $locale == "bn" && count(coalesce(body.bn, [])) > 0 => body.bn,
  $locale == "bn" && count(coalesce(body.en, [])) > 0 => body.en,
  count(coalesce(body.en, [])) > 0 => body.en,
  count(coalesce(body.bn, [])) > 0 => body.bn,
  []
)
`.trim();

const articleListQuery = groq`
  *[_type == "article"] | order(publishedAt desc) {
    _id,
    "title": ${localizedArticleTitle},
    slug,
    "excerpt": ${localizedArticleExcerpt},
    coverImage,
    publishedAt,
    category,
    featured,
    "authorName": coalesce(author->name[$locale], author->name.en, author->name.bn, guestAuthor)
  }
`;

const articleBySlugQuery = groq`
  *[_type == "article" && slug.current == $slug][0] {
    _id,
    "title": ${localizedArticleTitle},
    slug,
    "excerpt": ${localizedArticleExcerpt},
    "body": ${localizedArticleBody},
    category,
    coverImage,
    publishedAt,
    featured,
    guestAuthor,
    "authorName": coalesce(author->name[$locale], author->name.en, author->name.bn, guestAuthor),
    "pdfAttachments": pdfAttachments[]{
      title,
      "url": file.asset->url
    },
    "relatedArticles": relatedArticles[]->{
      _id,
      "title": ${localizedArticleTitle},
      slug,
      "excerpt": ${localizedArticleExcerpt},
      coverImage,
      publishedAt,
      category,
      featured,
      "authorName": coalesce(author->name[$locale], author->name.en, author->name.bn, guestAuthor)
    }
  }
`;

const featuredArticlesQuery = groq`
  *[_type == "article" && featured == true] | order(publishedAt desc)[0...3] {
    _id,
    "title": ${localizedArticleTitle},
    slug,
    "excerpt": ${localizedArticleExcerpt},
    coverImage,
    publishedAt
  }
`;

const allArticleSlugsQuery = groq`*[_type == "article" && defined(slug.current)].slug.current`;

const allProjectsQuery = groq`
  *[_type == "project"] | order(order asc) {
    _id,
    "title": title[$locale],
    slug,
    "description": description[$locale],
    status,
    coverImage,
    externalUrl,
    order
  }
`;

const projectBySlugQuery = groq`
  *[_type == "project" && slug.current == $slug][0] {
    _id,
    "title": title[$locale],
    slug,
    "description": description[$locale],
    status,
    coverImage,
    externalUrl,
    order
  }
`;

const allTeamMembersQuery = groq`
  *[_type == "teamMember"] {
    _id,
    "name": name[$locale],
    "role": role[$locale],
    "bio": bio[$locale],
    asciiPhoto,
    photo,
    socialLinks
  }
`;

const upcomingEventsQuery = groq`
  *[_type == "event" && date >= now()] | order(date asc) {
    _id,
    "title": title[$locale],
    slug,
    "description": description[$locale],
    date,
    "location": location[$locale],
    isOnline,
    registrationUrl,
    coverImage
  }
`;

/** Listing page (Figma events grid): recent first, includes past events. */
const listedEventsQuery = groq`
  *[_type == "event"] | order(date desc) [0...47] {
    _id,
    "title": title[$locale],
    slug,
    "description": description[$locale],
    date,
    "location": location[$locale],
    isOnline,
    registrationUrl,
    coverImage
  }
`;

const activeCampaignsQuery = groq`
  *[_type == "campaign" && status == "active"] | order(startDate desc) {
    _id,
    "title": title[$locale],
    slug,
    "summary": summary[$locale],
    "body": body[$locale],
    status,
    coverImage,
    startDate,
    endDate
  }
`;

const siteSettingsQuery = groq`
  *[_type == "siteSettings"][0] {
    siteName,
    "siteDescription": siteDescription[$locale],
    "navLinks": navLinks[]{
      "label": label[$locale],
      href
    },
    "footerText": footerText[$locale],
    socialLinks,
    "seoDefaults": {
      "metaTitle": seoDefaults.metaTitle[$locale],
      "metaDescription": seoDefaults.metaDescription[$locale],
      "ogImage": seoDefaults.ogImage
    }
  }
`;

export async function getAllArticles(locale: Locale): Promise<ArticleListItem[]> {
  return sanityClient.fetch(articleListQuery, { locale });
}

export async function getArticleBySlug(
  slug: string,
  locale: Locale
): Promise<ArticleDetail | null> {
  const normalized = normalizeArticleSlugParam(slug);
  return sanityClient.fetch(articleBySlugQuery, { slug: normalized, locale });
}

export async function getFeaturedArticles(locale: Locale): Promise<ArticleListItem[]> {
  return sanityClient.fetch(featuredArticlesQuery, { locale });
}

export async function getAllProjects(locale: Locale): Promise<ProjectItem[]> {
  return sanityClient.fetch(allProjectsQuery, { locale });
}

export async function getProjectBySlug(
  slug: string,
  locale: Locale
): Promise<ProjectItem | null> {
  return sanityClient.fetch(projectBySlugQuery, { slug, locale });
}

export async function getAllTeamMembers(locale: Locale): Promise<TeamMember[]> {
  return sanityClient.fetch(allTeamMembersQuery, { locale });
}

export async function getUpcomingEvents(locale: Locale): Promise<EventItem[]> {
  return sanityClient.fetch(upcomingEventsQuery, { locale });
}

export async function getListedEvents(locale: Locale): Promise<EventItem[]> {
  return sanityClient.fetch(listedEventsQuery, { locale });
}

export async function getActiveCampaigns(locale: Locale): Promise<CampaignItem[]> {
  return sanityClient.fetch(activeCampaignsQuery, { locale });
}

export async function getSiteSettings(locale: Locale): Promise<SiteSettings | null> {
  return sanityClient.fetch(siteSettingsQuery, { locale });
}

export async function getAllArticleSlugs(): Promise<string[]> {
  return sanityClient.fetch(allArticleSlugsQuery);
}
