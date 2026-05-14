import Image from "next/image";
import { Roboto_Mono, Space_Mono } from "next/font/google";
import { getTranslations } from "next-intl/server";
import { AboutPartnersClosing } from "../layout/AboutPartnersClosing";
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
          <div className="relative pb-16 pt-5 md:pb-20 md:pt-7 lg:pb-24 lg:pt-8">
            <h1 className="home-headline-font home-collective-zine__type relative z-10 max-w-[min(100%,1180px)] text-[clamp(40px,6.5vw,96px)] font-bold lowercase leading-[0.98] tracking-[-0.02em] text-white">
              <span className="home-collective-zine__line m-0 block whitespace-pre-wrap">
                <span className="text-white">// </span>
                {t("heroLine1")}
              </span>
              <span className="home-collective-zine__line home-collective-zine__line--fighting m-0 mt-[0.08em] flex flex-wrap items-end gap-x-[min(0.45em,16px)] gap-y-3 md:gap-x-[0.5em]">
                <span className="shrink-0">{t("heroLine2")}</span>
                <span className="home-collective-zine__picsPair shrink-0" aria-hidden>
                  <span className="home-collective-zine__picWrap">
                    <Image
                      src="/images/home-collective-zine-ear.png"
                      alt=""
                      fill
                      sizes="97px"
                      className="object-cover object-center"
                    />
                  </span>
                  <span className="home-collective-zine__picWrap">
                    <Image
                      src="/images/home-collective-zine-mouth.png"
                      alt=""
                      fill
                      sizes="97px"
                      className="object-cover object-center"
                    />
                  </span>
                </span>
              </span>
              <span className="home-collective-zine__line m-0 mt-[0.06em] block">{t("heroLine3")}</span>
              <span className="home-collective-zine__line home-collective-zine__line--open m-0 mt-[0.06em] flex flex-wrap items-end gap-x-[min(0.45em,16px)] gap-y-3 md:gap-x-[0.5em]">
                <span className="shrink-0">{t("heroLine4Start")}</span>
                <span
                  className="home-collective-zine__picWrap home-collective-zine__picWrap--narrow shrink-0"
                  aria-hidden
                >
                  <Image
                    src="/images/home-collective-zine-eye.png"
                    alt=""
                    fill
                    sizes="97px"
                    className="object-cover object-center"
                  />
                </span>
                <span className="shrink-0">{t("heroLine4End")}</span>
              </span>
            </h1>
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
      </section>

      {/* What do we do — Figma white / #fafcff */}
      <section className="relative overflow-x-clip bg-[#fafcff] px-6 py-10 text-[#303ccf] md:px-10 md:py-14 lg:px-[40px] lg:py-16">
        <PixelDecoration />

        <div className="relative z-10 mx-auto max-w-[1440px]">
          <div className="grid gap-7 lg:grid-cols-[minmax(0,260px)_1fr] lg:gap-10 xl:grid-cols-[minmax(0,300px)_1fr]">
            <h2 className="home-headline-font text-[clamp(28px,4.8vw,62px)] font-semibold leading-[0.96] tracking-tight text-[#05b557]">
              <span className="block whitespace-pre-wrap">{t("whatWeDoTitle1")}</span>
              <span className="block whitespace-pre-wrap">{t("whatWeDoTitle2")}</span>
            </h2>

            <div className="flex max-w-[720px] flex-col gap-7 lg:pt-0">
              {workRows.map((row) => (
                <div
                  key={row.title1}
                  className="flex flex-col gap-4 border-b border-[#303ccf]/15 pb-7 last:border-0 last:pb-0 md:flex-row md:items-start md:justify-between md:gap-5"
                >
                  <div className="shrink-0 uppercase">
                    <p className="home-headline-font text-[clamp(17px,2.2vw,22px)] font-normal leading-[1.12]">
                      <span className="text-[#05b557]">// </span>
                      <span>{row.title1}</span>
                    </p>
                    <p className="home-headline-font mt-0.5 text-[clamp(17px,2.2vw,22px)] font-normal leading-[1.12]">
                      {row.title2}
                    </p>
                  </div>
                  <p
                    className={`${spaceMono.className} max-w-[460px] text-[clamp(14px,1.35vw,18px)] leading-[1.55]`}
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
      <section className="bg-[#fafcff] px-6 py-10 md:px-10 md:py-14 lg:px-[40px] lg:py-16">
        <div className="mx-auto max-w-[1440px]">
          <h2 className="home-headline-font mb-6 text-right text-[clamp(28px,4.8vw,62px)] font-semibold leading-[0.96] tracking-tight text-[#303ccf] md:mb-8">
            {t("whoWeAreTitle")}
          </h2>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 lg:gap-4">
            {teamMembers.map((member, index) => (
              <article
                key={member._id ?? `${member.name}-${index}`}
                tabIndex={0}
                className={`group flex flex-col border border-solid pb-5 outline-none transition-shadow focus-visible:ring-2 focus-visible:ring-[#303ccf] focus-visible:ring-offset-2 focus-visible:ring-offset-[#fafcff] ${teamCardBorderClass(index)}`}
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

      <AboutPartnersClosing locale={locale} footerCompact />
    </>
  );
}
