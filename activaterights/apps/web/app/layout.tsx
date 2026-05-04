import type { ReactNode } from "react";
import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";
import { getSiteUrl } from "../lib/seo/site";

type RootLayoutProps = Readonly<{
  children: ReactNode;
}>;

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Activate Rights — Digital rights & internet freedom",
    /** CMS strings already include “— Activate Rights” where needed. */
    template: "%s"
  },
  description:
    "Activate Rights works in Bangladesh for internet freedom, digital rights, privacy, censorship resistance, shutdown monitoring, policy, and human rights online and offline.",
  applicationName: "Activate Rights",
  keywords: [
    "Activate Rights",
    "digital rights",
    "internet freedom",
    "Bangladesh",
    "human rights",
    "privacy",
    "censorship",
    "internet shutdown",
    "online safety",
    "digital rights NGO"
  ],
  authors: [{ name: "Activate Rights", url: siteUrl }],
  creator: "Activate Rights",
  publisher: "Activate Rights",
  formatDetection: {
    email: false,
    address: false,
    telephone: false
  },
  openGraph: {
    type: "website",
    siteName: "Activate Rights",
    url: siteUrl,
    locale: "en_US",
    alternateLocale: ["bn_BD"],
    images: [
      {
        url: "/images/home-background.png",
        width: 1920,
        height: 1080,
        alt: "Activate Rights"
      }
    ]
  },
  twitter: {
    card: "summary_large_image"
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1
    }
  },
  ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? {
        verification: {
          google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
        }
      }
    : {})
};

export default async function RootLayout({ children }: RootLayoutProps) {
  const locale = headers().get("x-activate-locale");
  const htmlLang = locale === "bn" ? "bn" : "en";

  return (
    <html lang={htmlLang} suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
