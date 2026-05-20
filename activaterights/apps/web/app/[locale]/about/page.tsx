import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { AboutSections } from "../../../components/sections/AboutSections";
import { Navbar } from "../../../components/layout/Navbar";
import { locales, type Locale } from "../../../i18n/config";
import { withLocaleSeo } from "../../../lib/seo/buildPageMetadata";

type AboutPageProps = {
  params: {
    locale: string;
  };
};

export async function generateMetadata({ params }: AboutPageProps): Promise<Metadata> {
  const locale = params.locale as Locale;
  const t = await getTranslations({ locale, namespace: "about" });

  return withLocaleSeo(locale, "/about", {
    title: t("metaTitle"),
    description: t("metaDescription")
  });
}

export default async function AboutPage({ params }: AboutPageProps) {
  const locale = params.locale as Locale;

  if (!locales.includes(locale)) {
    notFound();
  }

  return (
    <main className="site-white-section flex min-h-screen flex-col overflow-x-clip text-neutral-900">
      <div className="projects-grain-blue">
        <Navbar locale={locale} />
      </div>
      <AboutSections locale={locale} />
    </main>
  );
}
