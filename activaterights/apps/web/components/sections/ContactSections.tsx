import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { AboutFooter } from "../layout/AboutFooter";
import { Navbar } from "../layout/Navbar";
import type { Locale } from "../../i18n/config";
import { ContactForm } from "./ContactForm";
import { cn } from "../../lib/utils";

type ContactSectionsProps = {
  locale: Locale;
};

/**
 * Contact / team route — Figma 34:1459 (Share-AR): forest home-surface, cursor art,
 * “let’s talk!”, underlined form, #303ccf Send, footer with forest rule bars.
 */
export async function ContactSections({ locale }: ContactSectionsProps) {
  const t = await getTranslations({ locale, namespace: "contact" });
  const tAbout = await getTranslations({ locale, namespace: "about" });

  return (
    <main className="home-surface flex min-h-screen flex-col text-white">
      {/* Figma 34:1459 — ABOUT…ARTICLES: white fill + black type; CONTACT: white outline only */}
      <Navbar locale={locale} navGreenStyle="default" />

      {/* Hero — cursor + headline */}
      <section
        className={cn(
          "relative z-10 mx-auto flex w-full max-w-[960px] flex-col items-center px-6 pt-4 pb-6 md:pb-10"
        )}
      >
        <div className="relative mx-auto flex w-full max-w-[320px] flex-col items-center md:max-w-[400px]">
          <div className="relative aspect-[289/426] w-[min(72vw,289px)] shrink-0">
            <Image
              src="/images/contact/cursor-hero.png"
              alt=""
              fill
              className="object-contain object-center"
              sizes="289px"
              priority
            />
          </div>
          <h1
            className={cn(
              "home-headline-font relative z-10 -mt-[clamp(3rem,14vw,7.5rem)] text-center text-[clamp(48px,13vw,110px)] font-semibold leading-[0.92] tracking-tight text-white"
            )}
          >
            {t("heroTitle")}
          </h1>
        </div>
      </section>

      <ContactForm
        thanksLabel={t("formThanks")}
        labels={{
          name: t("fieldName"),
          email: t("fieldEmail"),
          story: t("fieldStory"),
          send: t("send")
        }}
      />

      <AboutFooter
        locale={locale}
        emailLabel={tAbout("footerEmail")}
        facebookLabel={tAbout("footerFacebook")}
        twitterLabel={tAbout("footerTwitter")}
        instagramLabel={tAbout("footerInstagram")}
        className="mt-auto bg-transparent pt-8 md:pt-12"
        brandClassName="text-white"
        linksClassName="text-white"
        ruleBarVariant="forest"
      />
    </main>
  );
}
