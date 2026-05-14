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
  const title = locale === "bn" ? `রিপোর্ট — ${params.slug}` : `Report — ${params.slug}`;
  const description =
    locale === "bn"
      ? "অ্যাক্টিভেট রাইটসের রিপোর্ট ও প্রকাশনা।"
      : "Reports and publications from Activate Rights.";

  return withLocaleSeo(locale, `/reports/${params.slug}`, {
    title,
    description
  });
}

export default async function ReportSlugPage({ params }: Props) {
  const locale = params.locale as Locale;
  if (!locales.includes(locale)) {
    notFound();
  }

  return (
    <>
      <main className="container-shell bg-[#fafcff] py-16 text-neutral-900">
        <p className="text-neutral-600">
          Report &quot;{params.slug}&quot; — full publication page coming soon.
        </p>
      </main>
      <AboutPartnersClosing locale={locale} />
    </>
  );
}
