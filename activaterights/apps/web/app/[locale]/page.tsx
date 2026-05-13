import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HomeJsonLd } from "../../components/seo/HomeJsonLd";
import { HomeFullLayout } from "../../components/sections/HomeFullLayout";
import { locales, type Locale } from "../../i18n/config";
import { withLocaleSeo } from "../../lib/seo/buildPageMetadata";

type HomePageProps = {
  params: {
    locale: string;
  };
};

export async function generateMetadata({
  params
}: HomePageProps): Promise<Metadata> {
  const locale = params.locale as Locale;
  const isBangla = locale === "bn";

  const title = isBangla ? "অ্যাক্টিভেট রাইটস" : "Activate Rights";
  const description = isBangla
    ? "বাংলাদেশে ইন্টারনেট স্বাধীনতা, ডিজিটাল অধিকার, গোপনীয়তা ও মানবাধিকার রক্ষায় কাজ করে অ্যাক্টিভেট রাইটস।"
    : "Activate Rights works in Bangladesh for internet freedom, digital rights, privacy, censorship resistance, shutdown monitoring, and human rights online and offline.";

  return withLocaleSeo(locale, "/", {
    title,
    description,
    ogImage: "/images/home-background.png",
    openGraph: {
      type: "website"
    }
  });
}

export default async function HomePage({ params }: HomePageProps) {
  const locale = params.locale as Locale;

  if (!locales.includes(locale)) {
    notFound();
  }

  return (
    <>
      <HomeJsonLd locale={locale} />
      <HomeFullLayout locale={locale} />
    </>
  );
}
