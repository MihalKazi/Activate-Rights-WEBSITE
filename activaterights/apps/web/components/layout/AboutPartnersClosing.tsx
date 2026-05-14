import Link from "next/link";
import { Roboto_Mono } from "next/font/google";
import { getTranslations } from "next-intl/server";
import { PartnersMarquee } from "../marquee/PartnersMarquee";
import { AboutFooter } from "./AboutFooter";
import type { Locale } from "../../i18n/config";
import { cn } from "../../lib/utils";

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap"
});

type AboutPartnersClosingProps = {
  locale: Locale;
  /** About page uses the tighter footer band. */
  footerCompact?: boolean;
};

/**
 * “We have worked with” partner marquee, team CTA, and site footer — same block as the bottom of `/about`.
 * Used on Projects, Reports, Articles, Events (and their detail pages) for a consistent close.
 */
export async function AboutPartnersClosing({ locale, footerCompact = false }: AboutPartnersClosingProps) {
  const t = await getTranslations({ locale, namespace: "about" });

  return (
    <>
      <section className="projects-grain-blue px-6 py-10 md:px-10 md:py-14 lg:px-[40px] lg:py-16">
        <div className="mx-auto max-w-[1440px]">
          <h2
            className={cn(
              "home-headline-font mb-6 max-w-[min(100%,720px)] text-[clamp(40px,5.2vw,72px)] font-normal leading-[0.92] tracking-tight text-[#fafcff] md:mb-8",
              locale === "en" && "lowercase"
            )}
          >
            <span className="block">{t("partnersTitle1")}</span>
            <span className="block">{t("partnersTitle2")}</span>
          </h2>

          <div className="-mx-6 bg-white py-6 md:-mx-10 md:py-8 lg:-mx-[40px]">
            <PartnersMarquee ariaLabel={t("partnersMarqueeAria")} />
          </div>

          <div className="mt-10 md:mt-12">
            <p className="home-headline-font text-[clamp(17px,2.2vw,22px)] font-normal leading-[1.2] text-white">
              <span className="block">{t("ctaHeading1")}</span>
              <span className="block">{t("ctaHeading2")}</span>
            </p>
            <Link
              href={`/${locale}/team`}
              className={`${robotoMono.className} mt-5 inline-flex bg-white px-4 py-3.5 text-[14px] font-normal uppercase tracking-wide text-black transition-colors hover:bg-neutral-100 md:mt-6 md:px-5 md:py-4 md:text-[15px]`}
            >
              {t("ctaButton")}
            </Link>
          </div>
        </div>
      </section>

      <AboutFooter
        locale={locale}
        emailLabel={t("footerEmail")}
        facebookLabel={t("footerFacebook")}
        twitterLabel={t("footerTwitter")}
        instagramLabel={t("footerInstagram")}
        brandClassName="text-[#06b85c]"
        compact={footerCompact}
      />
    </>
  );
}
