import { groq } from "next-sanity";
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
  excerpt: string;
  coverImage: SanityImage;
  publishedAt: string;
};

export type ArticleDetail = ArticleListItem & {
  body: unknown[];
  category?: string;
  author?: {
    _id: string;
    name: string;
    role?: string;
  };
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

const articleListQuery = groq`
  *[_type == "article"] | order(publishedAt desc) {
    _id,
    "title": title[$locale],
    slug,
    "excerpt": excerpt[$locale],
    coverImage,
    publishedAt
  }
`;

const articleBySlugQuery = groq`
  *[_type == "article" && slug.current == $slug][0] {
    _id,
    "title": title[$locale],
    slug,
    "excerpt": excerpt[$locale],
    "body": body[$locale],
    category,
    coverImage,
    publishedAt,
    author->{
      _id,
      "name": name[$locale],
      "role": role[$locale]
    }
  }
`;

const featuredArticlesQuery = groq`
  *[_type == "article" && featured == true] | order(publishedAt desc)[0...3] {
    _id,
    "title": title[$locale],
    slug,
    "excerpt": excerpt[$locale],
    coverImage,
    publishedAt
  }
`;

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
  return sanityClient.fetch(articleBySlugQuery, { slug, locale });
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

export async function getActiveCampaigns(locale: Locale): Promise<CampaignItem[]> {
  return sanityClient.fetch(activeCampaignsQuery, { locale });
}

export async function getSiteSettings(locale: Locale): Promise<SiteSettings | null> {
  return sanityClient.fetch(siteSettingsQuery, { locale });
}
