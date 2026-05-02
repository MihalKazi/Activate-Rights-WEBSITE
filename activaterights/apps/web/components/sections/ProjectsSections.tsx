import Image from "next/image";
import Link from "next/link";
import { Roboto_Mono } from "next/font/google";
import { getTranslations } from "next-intl/server";
import { AboutFooter } from "../layout/AboutFooter";
import { Navbar } from "../layout/Navbar";
import type { Locale } from "../../i18n/config";

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap"
});

type ProjectsSectionsProps = {
  locale: Locale;
};

type ProjectCard = {
  slug: string;
  title: string;
  titleLeadingSlash: boolean;
  body: string;
};

export async function ProjectsSections({ locale }: ProjectsSectionsProps) {
  const t = await getTranslations({ locale, namespace: "projects" });
  const tAbout = await getTranslations({ locale, namespace: "about" });

  const rawItems = t.raw("items");
  const items: ProjectCard[] = Array.isArray(rawItems)
    ? (rawItems as ProjectCard[]).filter(
        (item) =>
          item &&
          typeof item.slug === "string" &&
          typeof item.title === "string" &&
          typeof item.body === "string" &&
          typeof item.titleLeadingSlash === "boolean"
      )
    : [];

  return (
    <main className="flex min-h-screen flex-col overflow-x-clip bg-[#fafcff] text-neutral-900">
      <header className="projects-grain-green text-white">
        <div className="relative z-10">
          <Navbar locale={locale} />
          <div className="mx-auto max-w-[1440px] px-6 pb-14 pt-2 md:px-10 md:pb-16 lg:px-[40px] lg:pb-20">
            <h1 className="projects-hero-title home-headline-font max-w-[min(100%,900px)] text-left text-[clamp(56px,10vw,109px)] leading-[0.92] tracking-tight md:leading-[100px]">
              <span className="block">{t("heroLine1")}</span>
              <span className="block">{t("heroLine2")}</span>
            </h1>
          </div>
        </div>
      </header>

      <section className="bg-[#fafcff] px-6 py-16 md:px-10 md:py-20 lg:px-[40px] lg:py-24">
        <div className="mx-auto grid max-w-[1360px] grid-cols-1 gap-x-[72px] gap-y-14 sm:grid-cols-2 lg:gap-x-[92px] lg:gap-y-16">
          {items.map((item, index) => (
            <article key={`${item.slug}-${index}`} className="min-w-0">
              <Link
                href={`/${locale}/projects/${item.slug}`}
                className="group block outline-none focus-visible:ring-2 focus-visible:ring-[#303ccf] focus-visible:ring-offset-2 focus-visible:ring-offset-[#fafcff]"
              >
                <div className="relative aspect-[598/468] w-full overflow-hidden bg-[#d9d9d9] transition-colors group-hover:bg-[#cfcfcf]" />
                <h2 className="home-headline-font mt-10 text-[28px] font-normal leading-none text-[#212121] md:text-[30px]">
                  {item.titleLeadingSlash ? (
                    <>
                      <span className="text-[#05b557]">/</span>
                      <span>{` ${item.title}`}</span>
                    </>
                  ) : (
                    item.title
                  )}
                </h2>
                <p
                  className={`${robotoMono.className} mt-4 max-w-[495px] text-[18px] font-normal leading-[26px] text-[#212121] md:text-[20px]`}
                >
                  {item.body}
                </p>
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="projects-grain-blue px-6 py-16 md:px-10 md:py-20 lg:px-[40px] lg:py-24">
        <div className="relative z-10 mx-auto max-w-[1440px]">
          <h2 className="home-headline-font mb-10 max-w-[min(100%,720px)] text-left text-[clamp(52px,9vw,109px)] font-normal leading-[0.92] text-[#fafcff] md:mb-14">
            <span className="block">{tAbout("partnersTitle1")}</span>
            <span className="block">{tAbout("partnersTitle2")}</span>
          </h2>

          <div className="overflow-x-auto bg-white px-6 py-10 md:px-10">
            <div className="mx-auto flex min-w-min max-w-[1145px] flex-wrap items-center justify-center gap-x-12 gap-y-10 md:gap-x-20 lg:justify-between lg:gap-x-[137px]">
              <div className="relative h-[67px] w-[260px] shrink-0">
                <Image
                  src="/images/about/partner-frame.png"
                  alt=""
                  fill
                  className="object-contain object-left"
                />
              </div>
              <div className="home-headline-font flex min-h-[56px] shrink-0 flex-col justify-center text-center text-[11px] font-bold uppercase leading-[1.05] tracking-tight text-black sm:text-xs md:text-sm">
                <span className="block">{t("partnerTechTalesLine1")}</span>
                <span className="block">{t("partnerTechTalesLine2")}</span>
              </div>
              <div className="relative h-[57px] w-[350px] shrink-0">
                <Image
                  src="/images/about/partner-em.png"
                  alt={tAbout("partnerEngageMediaAlt")}
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          </div>

          <div className="mt-14 md:mt-20">
            <p className="home-headline-font text-[clamp(24px,4vw,32px)] font-normal leading-snug text-white">
              <span className="block">{tAbout("ctaHeading1")}</span>
              <span className="block">{tAbout("ctaHeading2")}</span>
            </p>
            <Link
              href={`/${locale}/team`}
              className={`${robotoMono.className} mt-8 inline-flex bg-white px-5 py-5 text-[18px] font-normal uppercase text-black transition-colors hover:bg-neutral-100`}
            >
              {tAbout("ctaButton")}
            </Link>
          </div>
        </div>
      </section>

      <AboutFooter
        locale={locale}
        emailLabel={tAbout("footerEmail")}
        facebookLabel={tAbout("footerFacebook")}
        twitterLabel={tAbout("footerTwitter")}
        instagramLabel={tAbout("footerInstagram")}
        className="bg-[#fafcff]"
        brandClassName="text-[#06b85c]"
      />
    </main>
  );
}
