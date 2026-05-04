import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Navbar } from "../../components/layout/Navbar";
import { Hero } from "../../components/sections/Hero";
import { HomeEventsStrip } from "../../components/sections/HomeEventsStrip";
import { locales, type Locale } from "../../i18n/config";

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

  return {
    title: isBangla ? "অ্যাক্টিভেট রাইটস" : "Activate Rights",
    description: isBangla
      ? "বাংলাদেশে ডিজিটাল অধিকার রক্ষায় কাজ করে অ্যাক্টিভেট রাইটস।"
      : "Activate Rights is a digital rights NGO based in Bangladesh."
  };
}

export default async function HomePage({ params }: HomePageProps) {
  const locale = params.locale as Locale;

  if (!locales.includes(locale)) {
    notFound();
  }

  return (
    <main className="home-surface flex h-screen min-h-0 flex-col overflow-x-clip overflow-y-visible">
      <Navbar locale={locale} />
      <Hero />
      <HomeEventsStrip locale={locale} />
    </main>
  );
}
