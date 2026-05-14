import type { Locale } from "../../i18n/config";
import { getSiteUrl } from "../../lib/seo/site";

type HomeJsonLdProps = {
  locale: Locale;
};

export function HomeJsonLd({ locale }: HomeJsonLdProps) {
  const base = getSiteUrl();
  const descriptionEn =
    "Activate Rights is a digital rights organization in Bangladesh working for internet freedom, privacy, anti-censorship, shutdown monitoring, and human rights online and offline.";
  const descriptionBn =
    "বাংলাদেশে ডিজিটাল অধিকার, ইন্টারনেট স্বাধীনতা, গোপনীয়তা, সেন্সরশিপ ও শাটডাউন পর্যবেক্ষণসহ অনলাইন ও অফলাইন মানবাধিকার নিয়ে কাজ করে অ্যাক্টিভেট রাইটস।";

  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${base}/#organization`,
        name: "Activate Rights",
        url: base,
        logo: `${base}/images/brand-logo.png`,
        description: locale === "bn" ? descriptionBn : descriptionEn,
        areaServed: { "@type": "Country", name: "Bangladesh" },
        knowsAbout: [
          "Digital rights",
          "Internet freedom",
          "Human rights",
          "Privacy",
          "Censorship",
          "Internet shutdowns"
        ],
        inLanguage: ["en", "bn"]
      },
      {
        "@type": "WebSite",
        "@id": `${base}/#website`,
        url: base,
        name: "Activate Rights",
        description: locale === "bn" ? descriptionBn : descriptionEn,
        publisher: { "@id": `${base}/#organization` },
        inLanguage: ["en", "bn"]
      }
    ]
  };

  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }} />
  );
}
