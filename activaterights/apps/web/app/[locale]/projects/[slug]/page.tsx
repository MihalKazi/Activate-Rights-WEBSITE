import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AboutPartnersClosing } from "../../../../components/layout/AboutPartnersClosing";
import { locales, type Locale } from "../../../../i18n/config";
import { withLocaleSeo } from "../../../../lib/seo/buildPageMetadata";

type Props = {
  params: { locale: string; slug: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = params.locale as Locale;
  const title = locale === "bn" ? `প্রকল্প — ${params.slug}` : `Project — ${params.slug}`;
  const description =
    locale === "bn"
      ? "অ্যাক্টিভেট রাইটসের প্রকল্প ও উদ্যোগ।"
      : "Projects and initiatives from Activate Rights in Bangladesh.";

  return withLocaleSeo(locale, `/projects/${params.slug}`, {
    title,
    description
  });
}

export default async function ProjectSlugPage({ params }: Props) {
  const locale = params.locale as Locale;
  if (!locales.includes(locale)) {
    notFound();
  }

  return (
    <>
      <main className="container-shell bg-[#fafcff] py-16 text-neutral-900">
        <p className="text-text-secondary">
          Project &quot;{params.slug}&quot; coming soon.
        </p>
      </main>
      <AboutPartnersClosing locale={locale} />
    </>
  );
}
