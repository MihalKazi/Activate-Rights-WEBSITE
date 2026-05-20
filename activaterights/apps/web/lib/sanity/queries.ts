import { groq } from "next-sanity";
import { normalizeArticleSlugParam } from "../articles/slug";
import { REPORTS_ON_HOME_DOCUMENT_ID } from "../../sanity/schemas/reportsOnHome";
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
  attachments?: PublicationFileAttachment[];
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
  /** ISO date string (YYYY-MM-DD) from Sanity `date` type */
  launchDate?: string | null;
};

export type ProjectDetail = ProjectItem & {
  body: unknown[] | null;
  attachments?: PublicationFileAttachment[];
};

export type ReportItem = {
  _id: string;
  title: string;
  slug: Slug;
  /** YYYY-MM-DD from Sanity `date` */
  publishedDate: string;
  coverImage: SanityImage;
  titleLeadingSlash?: boolean;
  excerpt?: string | null;
};

export type PublicationFileAttachment = {
  title?: string | null;
  kind?: string | null;
  url: string | null;
  mimeType?: string | null;
  filename?: string | null;
};

export type ReportDetail = ReportItem & {
  body: unknown[] | null;
  attachments?: PublicationFileAttachment[];
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

export type EventDetail = EventItem & {
  body: unknown[] | null;
  attachments?: PublicationFileAttachment[];
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

const publicationAttachmentProjection = `
  title,
  kind,
  "url": file.asset->url,
  "mimeType": file.asset->mimeType,
  "filename": file.asset->originalFilename
`;

const publicationAttachmentsGroq = `
"attachments": select(
  count(coalesce(attachments, [])) > 0 => attachments[]{${publicationAttachmentProjection}},
  pdfAttachments[]{${publicationAttachmentProjection}}
)
`.trim();

const localizedProjectBody = `
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

/** Home “updates and blog” preview — same fields as article list, newest first. */
const homeLatestArticlesQuery = groq`
  *[_type == "article"] | order(publishedAt desc)[0...3] {
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
    ${publicationAttachmentsGroq},
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
    order,
    launchDate
  }
`;

const projectBySlugQuery = groq`
  *[_type == "project" && slug.current == $slug][0] {
    _id,
    "title": title[$locale],
    slug,
    "description": description[$locale],
    "body": ${localizedProjectBody},
    status,
    coverImage,
    externalUrl,
    order,
    launchDate,
    ${publicationAttachmentsGroq}
  }
`;

/** Curated list from Site Settings; order = CMS array order. */
const homePageProjectsQuery = groq`
  *[_type == "siteSettings"][0]{
    "projects": coalesce(homeFeaturedProjects[]->{
      _id,
      "title": coalesce(title[$locale], title.en, title.bn, ""),
      slug,
      "description": description[$locale],
      status,
      coverImage,
      externalUrl,
      order,
      launchDate
    }, [])
  }.projects
`;

const localizedReportExcerpt = `
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

const localizedReportBody = `
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

const allReportsQuery = groq`
  *[_type == "report"] | order(publishedDate desc) {
    _id,
    "title": coalesce(title[$locale], title.en, title.bn, ""),
    slug,
    publishedDate,
    coverImage,
    titleLeadingSlash,
    "excerpt": ${localizedReportExcerpt}
  }
`;

const reportBySlugQuery = groq`
  *[_type == "report" && slug.current == $slug][0] {
    _id,
    "title": coalesce(title[$locale], title.en, title.bn, ""),
    slug,
    publishedDate,
    coverImage,
    titleLeadingSlash,
    "excerpt": ${localizedReportExcerpt},
    "body": ${localizedReportBody},
    ${publicationAttachmentsGroq}
  }
`;

/** Singleton `reportsOnHome` — curated initiatives for home; empty picks → first 2 projects. */
const reportsOnHomePickedInitiativesQuery = groq`
  *[_type == "reportsOnHome" && _id == $reportsOnHomeId][0]{
    "initiatives": coalesce(initiatives[]->{
      _id,
      "title": coalesce(title[$locale], title.en, title.bn, ""),
      slug,
      "description": description[$locale],
      status,
      coverImage,
      externalUrl,
      order,
      launchDate
    }, [])
  }.initiatives
`;

/** Singleton `reportsOnHome` — curated order for home; empty picks → use all reports. */
const reportsOnHomePickedQuery = groq`
  *[_type == "reportsOnHome" && _id == $reportsOnHomeId][0]{
    "reports": coalesce(reports[]->{
      _id,
      "title": coalesce(title[$locale], title.en, title.bn, ""),
      slug,
      publishedDate,
      coverImage,
      titleLeadingSlash,
      "excerpt": ${localizedReportExcerpt}
    }, [])
  }.reports
`;

/** Same singleton — curated articles for home “updates and blog”; empty → 3 newest articles. */
const reportsOnHomePickedArticlesQuery = groq`
  *[_type == "reportsOnHome" && _id == $reportsOnHomeId][0]{
    "articles": coalesce(articles[]->{
      _id,
      "title": ${localizedArticleTitle},
      slug,
      "excerpt": ${localizedArticleExcerpt},
      coverImage,
      publishedAt,
      category,
      featured,
      "authorName": coalesce(author->name[$locale], author->name.en, author->name.bn, guestAuthor)
    }, [])
  }.articles
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

const localizedEventDescription = `
select(
  $locale == "en" && defined(description.en) && description.en != "" => description.en,
  $locale == "en" && defined(description.bn) && description.bn != "" => description.bn,
  $locale == "bn" && defined(description.bn) && description.bn != "" => description.bn,
  $locale == "bn" && defined(description.en) && description.en != "" => description.en,
  defined(description.en) && description.en != "" => description.en,
  defined(description.bn) && description.bn != "" => description.bn,
  ""
)
`.trim();

const localizedEventBody = `
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

const localizedEventLocation = `
coalesce(
  select(
    $locale == "en" && defined(location.en) && location.en != "" => location.en,
    $locale == "en" && defined(location.bn) && location.bn != "" => location.bn,
    $locale == "bn" && defined(location.bn) && location.bn != "" => location.bn,
    $locale == "bn" && defined(location.en) && location.en != "" => location.en,
    defined(location.en) && location.en != "" => location.en,
    defined(location.bn) && location.bn != "" => location.bn,
    ""
  ),
  ""
)
`.trim();

const upcomingEventsQuery = groq`
  *[_type == "event" && date >= now()] | order(date asc) {
    _id,
    "title": coalesce(title[$locale], title.en, title.bn, ""),
    slug,
    "description": ${localizedEventDescription},
    date,
    "location": ${localizedEventLocation},
    isOnline,
    registrationUrl,
    coverImage
  }
`;

/** Listing page (Figma events grid): recent first, includes past events. */
const listedEventsQuery = groq`
  *[_type == "event"] | order(date desc) [0...47] {
    _id,
    "title": coalesce(title[$locale], title.en, title.bn, ""),
    slug,
    "description": ${localizedEventDescription},
    date,
    "location": ${localizedEventLocation},
    isOnline,
    registrationUrl,
    coverImage
  }
`;

const eventBySlugQuery = groq`
  *[_type == "event" && slug.current == $slug][0] {
    _id,
    "title": coalesce(title[$locale], title.en, title.bn, ""),
    slug,
    "description": ${localizedEventDescription},
    "body": ${localizedEventBody},
    ${publicationAttachmentsGroq},
    date,
    "location": ${localizedEventLocation},
    isOnline,
    registrationUrl,
    coverImage
  }
`;

const allEventSlugsQuery = groq`*[_type == "event" && defined(slug.current)].slug.current`;

const allProjectSlugsQuery = groq`*[_type == "project" && defined(slug.current)].slug.current`;

const allReportSlugsQuery = groq`*[_type == "report" && defined(slug.current)].slug.current`;

const allCampaignSlugsQuery = groq`*[_type == "campaign" && defined(slug.current)].slug.current`;

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

export async function getLatestArticlesForHome(locale: Locale): Promise<ArticleListItem[]> {
  return sanityClient.fetch(homeLatestArticlesQuery, { locale });
}

/** Home “updates and blog”: order from Reports on Home singleton if set, else 3 newest articles. */
export async function getArticlesForHome(locale: Locale): Promise<ArticleListItem[]> {
  const picked = await sanityClient.fetch<ArticleListItem[] | null>(reportsOnHomePickedArticlesQuery, {
    locale,
    reportsOnHomeId: REPORTS_ON_HOME_DOCUMENT_ID
  });
  const list = Array.isArray(picked) ? picked : [];
  const cleaned = list.filter(
    (a) =>
      a &&
      typeof a._id === "string" &&
      a.slug &&
      typeof a.slug.current === "string" &&
      a.slug.current.trim().length > 0
  );
  if (cleaned.length > 0) {
    return cleaned.slice(0, 3);
  }
  return getLatestArticlesForHome(locale);
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

/** Up to 3 projects for the home page: Site Settings picks, else first 3 by `order`. */
export async function getHomePageProjects(locale: Locale): Promise<ProjectItem[]> {
  const picked = await sanityClient.fetch<ProjectItem[] | null>(homePageProjectsQuery, { locale });
  const list = Array.isArray(picked) ? picked : [];
  const cleaned = list.filter(
    (p) =>
      p &&
      typeof p._id === "string" &&
      p.slug &&
      typeof p.slug.current === "string" &&
      p.slug.current.length > 0
  );
  if (cleaned.length > 0) {
    return cleaned.slice(0, 3);
  }
  const all = await getAllProjects(locale);
  return all.slice(0, 3);
}

/** Up to 2 initiatives for the home page: Reports on Home singleton, else first 2 by `order`. */
export async function getHomePageInitiatives(locale: Locale): Promise<ProjectItem[]> {
  const picked = await sanityClient.fetch<ProjectItem[] | null>(reportsOnHomePickedInitiativesQuery, {
    locale,
    reportsOnHomeId: REPORTS_ON_HOME_DOCUMENT_ID
  });
  const list = Array.isArray(picked) ? picked : [];
  const cleaned = list.filter(
    (p) =>
      p &&
      typeof p._id === "string" &&
      p.slug &&
      typeof p.slug.current === "string" &&
      p.slug.current.length > 0
  );
  if (cleaned.length > 0) {
    return cleaned.slice(0, 2);
  }
  const all = await getAllProjects(locale);
  return all.slice(0, 2);
}

export async function getAllReports(locale: Locale): Promise<ReportItem[]> {
  return sanityClient.fetch(allReportsQuery, { locale });
}

export async function getReportBySlug(slug: string, locale: Locale): Promise<ReportDetail | null> {
  const normalized = normalizeArticleSlugParam(slug);
  return sanityClient.fetch(reportBySlugQuery, { slug: normalized, locale });
}

/** Home published-reports band: order from Reports on Home singleton if set, else all reports by date. */
export async function getReportsForHome(locale: Locale): Promise<ReportItem[]> {
  const picked = await sanityClient.fetch<ReportItem[] | null>(reportsOnHomePickedQuery, {
    locale,
    reportsOnHomeId: REPORTS_ON_HOME_DOCUMENT_ID
  });
  const list = Array.isArray(picked) ? picked : [];
  const cleaned = list.filter(
    (r) =>
      r &&
      typeof r._id === "string" &&
      r.slug &&
      typeof r.slug.current === "string" &&
      r.slug.current.trim().length > 0
  );
  if (cleaned.length > 0) {
    return cleaned.slice(0, 3);
  }
  return getAllReports(locale);
}

export async function getProjectBySlug(
  slug: string,
  locale: Locale
): Promise<ProjectDetail | null> {
  const normalized = normalizeArticleSlugParam(slug);
  return sanityClient.fetch(projectBySlugQuery, { slug: normalized, locale });
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

export async function getEventBySlug(slug: string, locale: Locale): Promise<EventDetail | null> {
  const normalized = normalizeArticleSlugParam(slug);
  return sanityClient.fetch(eventBySlugQuery, { slug: normalized, locale });
}

export async function getAllEventSlugs(): Promise<string[]> {
  return sanityClient.fetch(allEventSlugsQuery);
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

export async function getAllProjectSlugs(): Promise<string[]> {
  return sanityClient.fetch(allProjectSlugsQuery);
}

export async function getAllReportSlugs(): Promise<string[]> {
  return sanityClient.fetch(allReportSlugsQuery);
}

export async function getAllCampaignSlugs(): Promise<string[]> {
  return sanityClient.fetch(allCampaignSlugsQuery);
}
