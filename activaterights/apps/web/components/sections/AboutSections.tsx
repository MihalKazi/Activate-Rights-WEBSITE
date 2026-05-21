import Image from "next/image";
import { Roboto_Mono } from "next/font/google";
import { getTranslations } from "next-intl/server";
import { AboutPartnersClosing } from "../layout/AboutPartnersClosing";
import { Navbar } from "../layout/Navbar";
import type { Locale } from "../../i18n/config";
import { cardImageUrl } from "../../lib/sanity/image";
import { getAllTeamMembers } from "../../lib/sanity/queries";
import { CollectiveZineHeadline } from "./CollectiveZineHeadline";
import { WhatWeDoSection } from "./WhatWeDoSection";

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap"
});

type AboutSectionsProps = {
  locale: Locale;
};

type TeamMemberEntry = {
  /** Sanity document id when loaded from CMS */
  _id?: string;
  name: string;
  role: string;
  imageAscii: string;
  imagePhoto: string;
  linkedInUrl?: string;
};

function linkedInUrlFromSocialLinks(
  socialLinks?: { platform?: string; url?: string }[]
): string | undefined {
  if (!socialLinks?.length) return undefined;
  for (const { platform, url } of socialLinks) {
    if (!url) continue;
    if (/linkedin/i.test(platform ?? "") || /linkedin\.com/i.test(url)) return url;
  }
  return undefined;
}

function teamCardBorderClass(index: number) {
  return index % 3 === 2 ? "border-[#212121]" : "border-[#1e64eb]";
}

/** Home initiatives pixel accent — rotated vertical for About “what we do” right rail (Figma). */
function AboutPixelRail() {
  return (
    <div className="about-pixel-rail" aria-hidden>
      <Image
        src="/images/home-initiatives-pixel-accent.png"
        alt=""
        width={315}
        height={135}
        className="about-pixel-rail__img"
        sizes="120px"
      />
    </div>
  );
}

export async function AboutSections({ locale }: AboutSectionsProps) {
  const t = await getTranslations({ locale, namespace: "about" });

  const cmsMembers = await getAllTeamMembers(locale);
  const fromSanity: TeamMemberEntry[] = [];
  for (const m of cmsMembers) {
    const asciiUrl = cardImageUrl(m.asciiPhoto);
    const photoUrl = cardImageUrl(m.photo);
    const imageAscii = asciiUrl ?? photoUrl;
    const imagePhoto = photoUrl ?? asciiUrl;
    if (!imageAscii || !imagePhoto) continue;
    fromSanity.push({
      _id: m._id,
      name: m.name,
      role: m.role,
      imageAscii,
      imagePhoto,
      linkedInUrl: linkedInUrlFromSocialLinks(m.socialLinks)
    });
  }

  const rawTeam = t.raw("teamMembers");
  const fromTranslations: TeamMemberEntry[] = Array.isArray(rawTeam)
    ? (rawTeam as TeamMemberEntry[])
        .filter(
          (m) =>
            m &&
            typeof m.name === "string" &&
            typeof m.role === "string" &&
            typeof m.imageAscii === "string" &&
            typeof m.imagePhoto === "string"
        )
        .map((m) => ({
          ...m,
          linkedInUrl:
            typeof m.linkedInUrl === "string" && m.linkedInUrl.length > 0 ? m.linkedInUrl : undefined
        }))
    : [];

  const source = fromSanity.length > 0 ? fromSanity : fromTranslations;
  const teamMembers = [...source].sort((a, b) =>
    a.name.localeCompare(b.name, locale, { sensitivity: "base" })
  );

  return (
    <>
      {/* Hero — nav + blue band in one block (same pattern as Projects/Reports headers) */}
      <header className="projects-grain-blue relative overflow-x-clip pb-0 text-white">
        <div className="relative z-10">
          <Navbar locale={locale} />
          <div className="relative mx-auto max-w-[1440px] px-6 lg:px-[40px]">
            <div className="about-hero-zine-wrap relative pb-12 pt-2 md:pb-14 md:pt-4 lg:pb-16 lg:pt-5">
              <div className="home-collective-zine__stack relative z-10 max-w-[min(100%,1180px)]">
                <CollectiveZineHeadline
                  as="h1"
                  lines={{
                    line1: t("heroLine1"),
                    line2: t("heroLine2"),
                    line3: t("heroLine3"),
                    line4Start: t("heroLine4Start"),
                    line4End: t("heroLine4End")
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Glitch strip — masked dark blue fill (Figma 34:80–82) */}
        <div className="relative h-[min(20vw,140px)] w-full overflow-hidden md:h-[min(16vw,190px)]">
          <div
            className="absolute inset-0 bg-[#1423cb]"
            style={{
              WebkitMaskImage: "url(/images/about/hero-mask.png)",
              maskImage: "url(/images/about/hero-mask.png)",
              WebkitMaskRepeat: "no-repeat",
              maskRepeat: "no-repeat",
              WebkitMaskPosition: "right bottom",
              maskPosition: "right bottom",
              WebkitMaskSize: "min(100%, 900px) 100%",
              maskSize: "min(100%, 900px) 100%"
            }}
          />
        </div>
      </header>

      {/* What do we do — paper tile; pixel rail sits top-right just below hero glitch */}
      <section className="about-what-we-do-section relative site-white-section px-6 pb-6 pt-4 text-[#303ccf] md:px-10 md:pb-8 md:pt-5 lg:px-[40px] lg:pb-10 lg:pt-6">
        <div className="about-what-we-do-inner relative z-10 mx-auto max-w-[1440px]">
          <AboutPixelRail />
          <WhatWeDoSection
            titleClassName="text-[clamp(28px,3.8vw,52px)] leading-[0.9] md:text-[clamp(32px,4vw,64px)]"
          />
        </div>
      </section>

      {/* Dotted rule before “who we are” — 1px dark green dotted (Figma ref), full content width */}
      <div className="site-white-section px-6 md:px-10 lg:px-[40px]">
        <div className="mx-auto max-w-[1440px]">
          <hr
            className="w-full border-0 border-t border-dotted border-[#006837]"
            aria-hidden
          />
        </div>
      </div>

      {/* Who are we + team cards */}
      <section
        className="site-white-section px-6 py-10 md:px-10 md:py-14 lg:px-[40px] lg:py-16"
        data-scroll-reveal="fade-up"
      >
        <div className="mx-auto max-w-[1440px]">
          <h2 className="home-headline-font mb-6 text-right text-[clamp(28px,4.8vw,62px)] font-semibold leading-[0.96] tracking-tight text-[#303ccf] md:mb-8">
            {t("whoWeAreTitle")}
          </h2>

          <div
            className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 lg:gap-4"
            data-scroll-reveal-stagger="straight"
          >
            {teamMembers.map((member, index) => (
              <article
                key={member._id ?? `${member.name}-${index}`}
                tabIndex={0}
                className={`group flex flex-col border border-solid pb-5 outline-none transition-shadow focus-visible:ring-2 focus-visible:ring-[#303ccf] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f5f4f2] ${teamCardBorderClass(index)}`}
              >
                <div className="mt-3 px-3 md:px-4">
                  <div className="relative mx-auto aspect-square w-full max-w-[320px] overflow-hidden bg-neutral-200 lg:max-w-[300px]">
                    {/* ASCII art — default; photo reveals on hover / focus-within / active (touch) */}
                    <Image
                      src={member.imageAscii}
                      alt=""
                      aria-hidden
                      fill
                      className="object-cover opacity-100 transition-opacity duration-300 ease-out group-hover:opacity-0 group-focus-within:opacity-0 group-active:opacity-0"
                      sizes="(max-width:768px) 100vw, (max-width:1280px) 50vw, 25vw"
                    />
                    <Image
                      src={member.imagePhoto}
                      alt={member.name}
                      fill
                      className="object-cover opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-100 group-focus-within:opacity-100 group-active:opacity-100"
                      sizes="(max-width:768px) 100vw, (max-width:1280px) 50vw, 25vw"
                    />
                    {member.linkedInUrl ? (
                      <a
                        href={member.linkedInUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`${robotoMono.className} absolute bottom-3 right-3 z-10 inline-flex h-9 min-w-9 items-center justify-center border border-[#303ccf] bg-[color-mix(in_srgb,var(--site-white-section-bg)_95%,transparent)] px-2 text-[13px] font-normal leading-none text-[#303ccf] opacity-0 transition-opacity duration-300 ease-out hover:bg-[#303ccf] hover:text-white focus-visible:opacity-100 group-hover:opacity-100 group-focus-within:opacity-100 group-active:opacity-100`}
                        aria-label={`${member.name} on LinkedIn`}
                      >
                        in
                      </a>
                    ) : null}
                  </div>
                </div>
                <div className="mt-4 px-3 md:mt-5 md:px-4">
                  <p className="home-headline-font text-[clamp(16px,1.6vw,19px)] font-normal leading-snug text-black">
                    <span className="text-[#303ccf]">/</span> {member.name}
                  </p>
                  <p className={`${robotoMono.className} mt-1.5 text-[clamp(13px,1.2vw,15px)] leading-snug text-black`}>
                    {member.role}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <AboutPartnersClosing locale={locale} />
    </>
  );
}
