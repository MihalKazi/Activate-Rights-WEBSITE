import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { ProjectsSections } from "../../../components/sections/ProjectsSections";
import { locales, type Locale } from "../../../i18n/config";
import { withLocaleSeo } from "../../../lib/seo/buildPageMetadata";

export const revalidate = 120;

type ProjectsPageProps = {
  params: {
    locale: string;
  };
};

export async function generateMetadata({
  params
}: ProjectsPageProps): Promise<Metadata> {
  const locale = params.locale as Locale;
  const t = await getTranslations({ locale, namespace: "projects" });

  return withLocaleSeo(locale, "/projects", {
    title: t("metaTitle"),
    description: t("metaDescription")
  });
}

export default async function ProjectsPage({ params }: ProjectsPageProps) {
  const locale = params.locale as Locale;

  if (!locales.includes(locale)) {
    notFound();
  }

  return <ProjectsSections locale={locale} />;
}
