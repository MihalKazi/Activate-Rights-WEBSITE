import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HomePartnersSection } from "../../../components/layout/HomePartnersSection";
import { HomeSiteFooter } from "../../../components/layout/HomeSiteFooter";
import { locales, type Locale } from "../../../i18n/config";
import { withLocaleSeo } from "../../../lib/seo/buildPageMetadata";

type CampaignsPageProps = {
  params: { locale: string };
};

export async function generateMetadata({ params }: CampaignsPageProps): Promise<Metadata> {
  const locale = params.locale as Locale;
  const title = locale === "bn" ? "ক্যাম্পেইন — অ্যাক্টিভেট রাইটস" : "Campaigns — Activate Rights";
  const description =
    locale === "bn"
      ? "অ্যাক্টিভেট রাইটসের ডিজিটাল অধিকার ও ইন্টারনেট স্বাধীনতা ক্যাম্পেইন।"
      : "Campaigns from Activate Rights for digital rights and internet freedom in Bangladesh.";

  return withLocaleSeo(locale, "/campaigns", {
    title,
    description
  });
}

export default function CampaignsPage({ params }: CampaignsPageProps) {
  const locale = params.locale as Locale;
  if (!locales.includes(locale)) {
    notFound();
  }

  return (
    <main className="site-white-section flex min-h-screen flex-col">
      <div className="container-shell flex-1 py-16">
        <p className="text-text-secondary">Campaigns listing coming soon.</p>
      </div>
      <HomePartnersSection />
      <HomeSiteFooter locale={locale} />
    </main>
  );
}
