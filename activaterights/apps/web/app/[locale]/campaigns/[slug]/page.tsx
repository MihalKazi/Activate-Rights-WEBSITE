import type { Metadata } from "next";
import { HomePartnersSection } from "../../../../components/layout/HomePartnersSection";
import { HomeSiteFooter } from "../../../../components/layout/HomeSiteFooter";
import type { Locale } from "../../../../i18n/config";
import { withLocaleSeo } from "../../../../lib/seo/buildPageMetadata";

type Props = {
  params: { locale: string; slug: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = params.locale as Locale;
  const title = locale === "bn" ? `ক্যাম্পেইন — ${params.slug}` : `Campaign — ${params.slug}`;
  const description =
    locale === "bn"
      ? "অ্যাক্টিভেট রাইটসের ডিজিটাল অধিকার ক্যাম্পেইন।"
      : "Digital rights campaigns from Activate Rights.";

  return withLocaleSeo(locale, `/campaigns/${params.slug}`, {
    title,
    description
  });
}

export default function CampaignSlugPage({ params }: Props) {
  const locale = params.locale as Locale;

  return (
    <main className="site-white-section flex min-h-screen flex-col">
      <div className="container-shell flex-1 py-16">
        <p className="text-text-secondary">
          Campaign &quot;{params.slug}&quot; coming soon.
        </p>
      </div>
      <HomePartnersSection />
      <HomeSiteFooter locale={locale} showContact={false} />
    </main>
  );
}
