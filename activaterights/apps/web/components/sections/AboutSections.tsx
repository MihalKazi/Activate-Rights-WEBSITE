import Image from "next/image";
import Link from "next/link";
import { Roboto_Mono, Space_Mono } from "next/font/google";
import { getTranslations } from "next-intl/server";
import { AboutFooter } from "../layout/AboutFooter";
import type { Locale } from "../../i18n/config";
import { cardImageUrl } from "../../lib/sanity/image";
import { getAllTeamMembers } from "../../lib/sanity/queries";

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap"
});

const spaceMono = Space_Mono({
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
};

function teamCardBorderClass(index: number) {
  return index % 3 === 2 ? "border-[#212121]" : "border-[#1e64eb]";
}

/** Decorative pixel cluster — Figma About frame right rail (green squares). */
function PixelDecoration() {
  const positions = [
    "right-[30px] top-0",
    "right-[75px] top-[45px]",
    "right-[75px] top-[90px]",
    "right-[75px] top-[135px]",
    "right-[30px] top-[180px]",
    "right-[30px] top-[225px]",
    "right-[75px] top-[225px]",
    "right-[75px] top-[270px]",
    "right-[-15px] top-[90px]",
    "right-[-15px] top-[135px]",
    "right-[-15px] top-[180px]",
    "right-[-15px] top-[225px]",
    "right-[-15px] top-[270px]",
    "right-[30px] top-[90px]"
  ];
  return (
    <div
      className="pointer-events-none absolute right-0 top-8 hidden h-[320px] w-[120px] lg:block"
      aria-hidden
    >
      {positions.map((pos, i) => (
        <div
          key={`pixel-${i}`}
          className={`absolute size-[11px] rotate-90 bg-[#06b85c] md:size-[13px] ${pos}`}
        />
      ))}
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
      imagePhoto
    });
  }

  const workRows = [
    {
      title1: t("workRow1Title1"),
      title2: t("workRow1Title2"),
      body: t("workRow1Body")
    },
    {
      title1: t("workRow2Title1"),
      title2: t("workRow2Title2"),
      body: t("workRow2Body")
    },
    {
      title1: t("workRow3Title1"),
      title2: t("workRow3Title2"),
      body: t("workRow3Body")
    }
  ];

  const rawTeam = t.raw("teamMembers");
  const fromTranslations: TeamMemberEntry[] = Array.isArray(rawTeam)
    ? (rawTeam as TeamMemberEntry[]).filter(
        (m) =>
          m &&
          typeof m.name === "string" &&
          typeof m.role === "string" &&
          typeof m.imageAscii === "string" &&
          typeof m.imagePhoto === "string"
      )
    : [];

  const source = fromSanity.length > 0 ? fromSanity : fromTranslations;
  const teamMembers = [...source].sort((a, b) =>
    a.name.localeCompare(b.name, locale, { sensitivity: "base" })
  );

  return (
    <>
      {/* Hero — Figma 34:77 blue band — same grain tile as Projects `.projects-grain-blue` */}
      <section className="projects-grain-blue relative overflow-hidden pb-0 pt-2 md:pb-0">
        <div className="relative mx-auto max-w-[1440px] px-6 lg:px-[40px]">
          <div className="relative pb-24 pt-8 md:pb-28 md:pt-12 lg:pb-32 lg:pt-16">
            <h1 className="home-headline-font relative z-10 max-w-[1015px] whitespace-pre-wrap text-[clamp(36px,7.5vw,77px)] font-bold leading-[1.05] text-white">
              <span className="block">
                <span className="text-white">// </span>
                {t("heroLine1")}
              </span>
              <span className="mt-1 block">{t("heroLine2")}</span>
              <span className="mt-2 flex flex-wrap items-center gap-3 md:mt-3 md:gap-4">
                <span className="inline-flex items-center gap-2 md:gap-3">
                  <span className="inline-block size-[52px] shrink-0 bg-neutral-300 md:size-[62px]" aria-hidden />
                  <span className="inline-block size-[52px] shrink-0 bg-[#06b85c] md:size-[62px]" aria-hidden />
                </span>
                <span>{t("heroLine3")}</span>
              </span>
              <span className="mt-2 flex flex-wrap items-center gap-3 md:mt-3 md:gap-4">
                <span className="inline-block size-[52px] shrink-0 bg-neutral-300 md:size-[62px]" aria-hidden />
                <span>{t("heroLine4")}</span>
              </span>
            </h1>
          </div>
        </div>

        {/* Glitch strip — masked dark blue fill (Figma 34:80–82) */}
        <div className="relative h-[min(28vw,200px)] w-full overflow-hidden md:h-[min(22vw,278px)]">
          <div
            className="absolute inset-0 bg-[#1423cb]"
            style={{
              WebkitMaskImage: "url(/images/about/hero-mask.png)",
              maskImage: "url(/images/about/hero-mask.png)",
              WebkitMaskRepeat: "no-repeat",
              maskRepeat: "no-repeat",
              WebkitMaskPosition: "center bottom",
              maskPosition: "center bottom",
              WebkitMaskSize: "min(100%, 900px) 100%",
              maskSize: "min(100%, 900px) 100%"
            }}
          />
        </div>
      </section>

      {/* What do we do — Figma white / #fafcff */}
      <section className="relative overflow-x-clip bg-[#fafcff] px-6 py-16 text-[#303ccf] md:px-10 md:py-20 lg:px-[40px] lg:py-24">
        <PixelDecoration />

        <div className="relative z-10 mx-auto max-w-[1440px]">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,340px)_1fr] lg:gap-16 xl:grid-cols-[380px_1fr]">
            <h2 className="home-headline-font text-[clamp(52px,10vw,109px)] font-semibold leading-[0.92] text-[#05b557]">
              <span className="block whitespace-pre-wrap">{t("whatWeDoTitle1")}</span>
              <span className="block whitespace-pre-wrap">{t("whatWeDoTitle2")}</span>
            </h2>

            <div className="flex max-w-[804px] flex-col gap-10 lg:pt-4">
              {workRows.map((row) => (
                <div
                  key={row.title1}
                  className="flex flex-col gap-6 border-b border-[#303ccf]/15 pb-10 last:border-0 last:pb-0 md:flex-row md:items-start md:justify-between md:gap-8"
                >
                  <div className="shrink-0 uppercase">
                    <p className="home-headline-font text-[clamp(22px,3.5vw,30px)] font-normal leading-[1.1]">
                      <span className="text-[#05b557]">// </span>
                      <span>{row.title1}</span>
                    </p>
                    <p className="home-headline-font mt-1 text-[clamp(22px,3.5vw,30px)] font-normal leading-[1.1]">
                      {row.title2}
                    </p>
                  </div>
                  <p
                    className={`${spaceMono.className} max-w-[495px] text-[clamp(18px,2vw,24px)] leading-relaxed`}
                  >
                    {row.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Dotted rule — Figma 34:145 */}
      <div className="bg-[#fafcff] px-6 md:px-10 lg:px-[40px]">
        <div className="mx-auto max-w-[1360px]">
          <Image
            src="/images/about/dotted-rule.png"
            alt=""
            width={1354}
            height={4}
            className="h-auto w-full max-h-[6px] object-cover opacity-80"
          />
        </div>
      </div>

      {/* Who are we + team cards */}
      <section className="bg-[#fafcff] px-6 py-16 md:px-10 md:py-20 lg:px-[40px] lg:py-24">
        <div className="mx-auto max-w-[1440px]">
          <h2 className="home-headline-font mb-12 text-right text-[clamp(52px,10vw,109px)] font-semibold leading-[0.92] text-[#303ccf] md:mb-16">
            {t("whoWeAreTitle")}
          </h2>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 lg:gap-5">
            {teamMembers.map((member, index) => (
              <article
                key={member._id ?? `${member.name}-${index}`}
                tabIndex={0}
                className={`group flex flex-col border border-solid pb-6 outline-none transition-shadow focus-visible:ring-2 focus-visible:ring-[#303ccf] focus-visible:ring-offset-2 focus-visible:ring-offset-[#fafcff] ${teamCardBorderClass(index)}`}
              >
                <div className="mt-4 px-4">
                  <div className="relative mx-auto aspect-square w-full max-w-[408px] overflow-hidden bg-neutral-200">
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
                  </div>
                </div>
                <div className="mt-6 px-4">
                  <p className="home-headline-font text-[24px] font-normal text-black">
                    <span className="text-[#303ccf]">/</span> {member.name}
                  </p>
                  <p className={`${robotoMono.className} mt-2 text-[22px] text-black md:text-[24px]`}>
                    {member.role}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Partners — blue band + white logo rail (Figma 34:411–445) */}
      <section className="projects-grain-blue px-6 py-16 md:px-10 md:py-20 lg:px-[40px] lg:py-24">
        <div className="mx-auto max-w-[1440px]">
          <h2 className="home-headline-font mb-10 max-w-[520px] text-[clamp(52px,9vw,109px)] font-normal leading-[0.92] text-[#fafcff] md:mb-14">
            <span className="block">{t("partnersTitle1")}</span>
            <span className="block">{t("partnersTitle2")}</span>
          </h2>

          <div className="overflow-x-auto bg-white px-6 py-10 md:px-10">
            <div className="flex min-w-min flex-wrap items-center justify-center gap-12 md:gap-16 lg:justify-between lg:gap-8">
              <div className="relative h-[67px] w-[260px] shrink-0">
                <Image
                  src="/images/about/partner-frame.png"
                  alt=""
                  fill
                  className="object-contain object-left"
                />
              </div>
              <div className="relative h-[57px] w-[350px] shrink-0">
                <Image
                  src="/images/about/partner-em.png"
                  alt={t("partnerEngageMediaAlt")}
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          </div>

          <div className="mt-14 md:mt-20">
            <p className="home-headline-font text-[clamp(24px,4vw,32px)] font-normal leading-snug text-white">
              <span className="block">{t("ctaHeading1")}</span>
              <span className="block">{t("ctaHeading2")}</span>
            </p>
            <Link
              href={`/${locale}/team`}
              className={`${robotoMono.className} mt-8 inline-flex bg-white px-5 py-5 text-[18px] font-normal uppercase text-black transition-colors hover:bg-neutral-100`}
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
      />
    </>
  );
}
