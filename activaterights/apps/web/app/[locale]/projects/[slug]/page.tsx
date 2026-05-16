import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import type { Image as SanityImage } from "sanity";
import { ProjectDetailSections } from "../../../../components/sections/ProjectDetailSections";
import { locales, type Locale } from "../../../../i18n/config";
import { withLocaleSeo } from "../../../../lib/seo/buildPageMetadata";
import { urlFor } from "../../../../lib/sanity/image";
import { getAllProjectSlugs, getProjectBySlug } from "../../../../lib/sanity/queries";

export const revalidate = 120;

type Props = {
  params: { locale: string; slug: string };
};

export async function generateStaticParams() {
  const slugs = await getAllProjectSlugs();
  return locales.flatMap((locale) => slugs.map((slug) => ({ locale, slug })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = params.locale as Locale;
  if (!locales.includes(locale)) {
    return { title: "Project" };
  }

  const t = await getTranslations({ locale, namespace: "projects" });
  const project = await getProjectBySlug(params.slug, locale);

  if (!project) {
    return withLocaleSeo(locale, `/projects/${params.slug}`, {
      title: t("metaTitle"),
      description: t("metaDescription")
    });
  }

  const description =
    project.description?.replace(/\s+/g, " ").trim().slice(0, 200) || t("metaDescription");

  const ogImage = project.coverImage?.asset?._ref
    ? urlFor(project.coverImage as SanityImage).width(1200).height(630).fit("crop").auto("format").url()
    : undefined;

  return withLocaleSeo(locale, `/projects/${params.slug}`, {
    title: `${project.title} — Activate Rights`,
    description,
    ogImage
  });
}

export default async function ProjectSlugPage({ params }: Props) {
  const locale = params.locale as Locale;
  if (!locales.includes(locale)) {
    notFound();
  }

  return <ProjectDetailSections locale={locale} slug={params.slug} />;
}
