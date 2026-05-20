import Image from "next/image";
import Link from "next/link";
import { Roboto_Mono } from "next/font/google";
import type { Image as SanityImage } from "sanity";
import { getTranslations } from "next-intl/server";
import { AboutPartnersClosing } from "../layout/AboutPartnersClosing";
import { Navbar } from "../layout/Navbar";
import type { Locale } from "../../i18n/config";
import { urlFor } from "../../lib/sanity/image";
import { getAllProjects } from "../../lib/sanity/queries";

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
  body: string | null;
  coverUrl: string | null;
  href: string;
  isExternal: boolean;
};

export async function ProjectsSections({ locale }: ProjectsSectionsProps) {
  const t = await getTranslations({ locale, namespace: "projects" });

  let items: ProjectCard[] = [];
  try {
    const rows = await getAllProjects(locale);
    items = rows
      .filter((p) => p?.slug?.current && typeof p.title === "string")
      .map((p) => {
        const slug = p.slug.current.trim();
        const ext = p.externalUrl?.trim();
        const coverUrl =
          p.coverImage?.asset?._ref != null
            ? urlFor(p.coverImage as SanityImage)
                .width(598)
                .height(468)
                .fit("crop")
                .auto("format")
                .quality(85)
                .url()
            : null;
        const body =
          typeof p.description === "string" && p.description.trim().length > 0
            ? p.description.trim()
            : null;
        const isExternal = Boolean(ext);
        const href = ext ?? `/${locale}/projects/${slug}`;
        return {
          slug,
          title: p.title.trim() || "Project",
          body,
          coverUrl,
          href,
          isExternal
        };
      });
  } catch {
    items = [];
  }

  const cardLinkClass =
    "group block outline-none focus-visible:ring-2 focus-visible:ring-[#303ccf] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f5f4f2]";

  return (
    <main className="flex min-h-screen flex-col overflow-x-clip site-white-section text-neutral-900">
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

      <section className="site-white-section px-6 py-16 md:px-10 md:py-20 lg:px-[40px] lg:py-24">
        <div className="mx-auto grid max-w-[1360px] grid-cols-1 gap-x-[72px] gap-y-14 sm:grid-cols-2 lg:gap-x-[92px] lg:gap-y-16">
          {items.length === 0 ? (
            <p className={`col-span-full text-center text-[17px] text-[#212121]/80 ${robotoMono.className}`}>
              {t("empty")}
            </p>
          ) : null}
          {items.map((item) => {
            const figure = (
              <>
                <div className="relative aspect-[598/468] w-full overflow-hidden bg-[#d9d9d9] transition-colors group-hover:bg-[#cfcfcf]">
                  {item.coverUrl ? (
                    <Image
                      src={item.coverUrl}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, 50vw"
                    />
                  ) : null}
                </div>
                <h2 className="home-headline-font mt-10 text-[28px] font-normal leading-none text-[#212121] md:text-[30px]">
                  {item.title}
                </h2>
                {item.body ? (
                  <p
                    className={`${robotoMono.className} mt-4 max-w-[495px] text-[18px] font-normal leading-[26px] text-[#212121] md:text-[20px]`}
                  >
                    {item.body}
                  </p>
                ) : null}
              </>
            );

            return (
              <article key={`${item.slug}-${item.href}`} className="min-w-0">
                {item.isExternal ? (
                  <a
                    href={item.href}
                    className={cardLinkClass}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {figure}
                  </a>
                ) : (
                  <Link href={item.href} className={cardLinkClass}>
                    {figure}
                  </Link>
                )}
              </article>
            );
          })}
        </div>
      </section>

      <AboutPartnersClosing locale={locale} />
    </main>
  );
}
