import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { Inter, Noto_Sans_Bengali } from "next/font/google";
import { locales, type Locale } from "../../i18n/config";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap"
});

const notoSansBengali = Noto_Sans_Bengali({
  subsets: ["bengali"],
  variable: "--font-bn",
  display: "swap"
});

type LocaleLayoutProps = Readonly<{
  children: ReactNode;
  params: { locale: string };
}>;

export function generateStaticParams(): { locale: Locale }[] {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params
}: LocaleLayoutProps) {
  const locale = params.locale as Locale;

  if (!locales.includes(locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const messages = (
    await import(`../../i18n/messages/${locale}.json`)
  ).default;

  const localeFontClass =
    locale === "bn" ? notoSansBengali.variable : inter.variable;

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <>
        <div
          className={`${inter.variable} ${notoSansBengali.variable} ${localeFontClass} min-h-screen`}
        >
          {children}
        </div>
        <div className="site-film-grain" aria-hidden />
      </>
    </NextIntlClientProvider>
  );
}
