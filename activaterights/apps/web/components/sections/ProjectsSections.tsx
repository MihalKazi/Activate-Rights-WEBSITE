import { Space_Mono } from "next/font/google";
import type { Image as SanityImage } from "sanity";
import { getTranslations } from "next-intl/server";
import { AboutPartnersClosing } from "../layout/AboutPartnersClosing";
import { Navbar } from "../layout/Navbar";
import type { Locale } from "../../i18n/config";
import { formatProjectLaunchDate } from "../../lib/projects/formatProjectLaunchDate";
import { truncateExcerpt } from "../../lib/publication/truncateExcerpt";
import { urlFor } from "../../lib/sanity/image";
import { getAllProjects } from "../../lib/sanity/queries";
import { cn } from "../../lib/utils";
import { PublicationListClient, type PublicationListItem } from "./PublicationListClient";

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap"
});

type ProjectsSectionsProps = {
  locale: Locale;
};

export async function ProjectsSections({ locale }: ProjectsSectionsProps) {
  const t = await getTranslations({ locale, namespace: "projects" });

  let items: PublicationListItem[] = [];
  try {
    const rows = await getAllProjects(locale);
    items = rows
      .filter((p) => p?.slug?.current && typeof p.title === "string")
      .map((p, index) => {
        const slug = p.slug.current.trim();
        const title = p.title.trim() || "Project";
        const ext = p.externalUrl?.trim();
        const coverUrl =
          p.coverImage?.asset?._ref != null
            ? urlFor(p.coverImage as SanityImage)
                .width(1200)
                .height(800)
                .fit("crop")
                .auto("format")
                .quality(85)
                .url()
            : null;
        const isExternal = Boolean(ext);
        const href = ext ?? `/${locale}/projects/${slug}`;
        const ctaLabel = isExternal ? t("externalLink") : t("viewProject");
        const ctaAria = isExternal
          ? `${t("externalLinkAria")}: ${title}`
          : `${t("viewProjectAria")}: ${title}`;

        return {
          key: `${slug}-${href}`,
          title,
          indexLabel: String(index + 1).padStart(2, "0"),
          href,
          isExternal,
          coverUrl,
          dateLabel: formatProjectLaunchDate(p.launchDate, locale),
          excerpt: truncateExcerpt(p.description),
          ctaLabel,
          ctaAria
        };
      });
  } catch {
    items = [];
  }

  return (
    <main className="flex min-h-screen flex-col overflow-x-clip site-white-section text-neutral-900">
      <header className="projects-grain-green text-white">
        <div className="relative z-10">
          <Navbar locale={locale} />
          <div className="mx-auto max-w-[1440px] px-6 pb-14 pt-2 md:px-10 md:pb-16 lg:px-[40px] lg:pb-20">
            <h1 className="projects-hero-title home-headline-font max-w-[min(100%,900px)] text-left text-[clamp(56px,10vw,109px)] leading-[0.92] tracking-tight md:leading-[100px]">
              <span className="block lowercase">{t("heroLine1")}</span>
              <span className="block lowercase">{t("heroLine2")}</span>
            </h1>
            <p
              className={cn(
                "mt-6 max-w-[min(100%,560px)] text-[clamp(14px,1.6vw,18px)] font-normal leading-[1.55] text-white/88 md:mt-8",
                spaceMono.className
              )}
            >
              {t("listingIntro")}
            </p>
          </div>
        </div>
      </header>

      <section className="site-white-section px-6 py-12 md:px-10 md:py-16 lg:px-[40px] lg:py-20">
        <div className="mx-auto w-full max-w-[1200px]">
          <PublicationListClient
            items={items}
            labels={{
              empty: t("empty"),
              loadMore: t("loadMore"),
              kindLabel: t("projectLabel")
            }}
          />
        </div>
      </section>

      <AboutPartnersClosing locale={locale} />
    </main>
  );
}
