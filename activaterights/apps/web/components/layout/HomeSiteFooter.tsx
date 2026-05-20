import Link from "next/link";
import Image from "next/image";
import { Roboto_Mono } from "next/font/google";
import { BrandLogoLink } from "../brand/BrandLogo";
import { SOCIAL_LINKS } from "../../lib/constants/socialLinks";
import type { Locale } from "../../i18n/config";
import { cn } from "../../lib/utils";

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap"
});

type HomeSiteFooterProps = {
  locale: Locale;
  /** Set false only if a page needs footer without the contact column. */
  showContact?: boolean;
};

function withLocale(locale: Locale, href: string): string {
  return `/${locale}${href}`;
}

export function HomeSiteFooter({ locale, showContact = true }: HomeSiteFooterProps) {
  return (
    <footer className="home-footer pb-16 pt-12 text-white md:pb-20 md:pt-16">
      <div className="relative z-10 mx-auto max-w-[1440px] px-6 md:px-10">
        <div className="grid grid-cols-1 gap-14 min-[900px]:grid-cols-2 min-[900px]:items-start min-[900px]:gap-x-16 lg:gap-x-24">
          <div className="flex min-w-0 flex-col gap-10">
            <Image
              src="/images/home-footer-ascii-overlay.png"
              alt=""
              width={670}
              height={176}
              className="home-footer-ascii-banner h-auto w-[670px] max-w-full shrink-0 object-contain object-left"
              sizes="670px"
            />
            <div className="mt-auto flex flex-col gap-6 pt-2">
              <BrandLogoLink
                href={withLocale(locale, "/")}
                size="homeFooter"
                linkClassName="home-headline-font leading-none hover:opacity-90 focus-visible:ring-offset-[#2d74fd]"
              />
              <p className={`text-[13px] lowercase text-white/70 ${robotoMono.className}`}>
                © Activate Rights. All rights reserved.
              </p>
            </div>
          </div>

          <div className="flex min-w-0 flex-col gap-12">
            <div>
              <p className="home-headline-font text-[clamp(32px,4.2vw,52px)] lowercase leading-[1.05] text-white">
                want to work with us on our fight for digital freedom?
              </p>
              <Link
                href={withLocale(locale, "/team")}
                className={`mt-8 inline-block w-fit bg-white px-8 py-4 text-[14px] font-normal uppercase tracking-wide text-black transition hover:bg-white/90 ${robotoMono.className}`}
              >
                Let&apos;s Collab!
              </Link>
            </div>

            <div
              className={cn(
                "grid grid-cols-1 gap-10 border-t border-white/20 pt-10 sm:gap-8 sm:border-t-0 sm:pt-0",
                showContact ? "sm:grid-cols-3" : "sm:grid-cols-2"
              )}
            >
              <div>
                <p className={`mb-4 text-[12px] uppercase tracking-[0.2em] text-white/75 ${robotoMono.className}`}>
                  About
                </p>
                <ul className={`space-y-3 text-[16px] lowercase leading-snug ${robotoMono.className}`}>
                  <li>
                    <Link href={withLocale(locale, "/about")} className="hover:underline">
                      About Us
                    </Link>
                  </li>
                  <li>
                    <Link href={withLocale(locale, "/projects")} className="hover:underline">
                      Our Projects
                    </Link>
                  </li>
                  <li>
                    <Link href={withLocale(locale, "/reports")} className="hover:underline">
                      Our Publications
                    </Link>
                  </li>
                  <li>
                    <Link href={withLocale(locale, "/articles")} className="hover:underline">
                      Updates
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <p className={`mb-4 text-[12px] uppercase tracking-[0.2em] text-white/75 ${robotoMono.className}`}>
                  Connect
                </p>
                <ul className={`space-y-3 text-[16px] lowercase ${robotoMono.className}`}>
                  <li>
                    <a
                      href={SOCIAL_LINKS.facebook}
                      className="hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Facebook
                    </a>
                  </li>
                  <li>
                    <a
                      href={SOCIAL_LINKS.linkedIn}
                      className="hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      LinkedIn
                    </a>
                  </li>
                  <li>
                    <a
                      href={SOCIAL_LINKS.instagram}
                      className="hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Instagram
                    </a>
                  </li>
                </ul>
              </div>
              {showContact ? (
                <div>
                  <p className={`mb-4 text-[12px] uppercase tracking-[0.2em] text-white/75 ${robotoMono.className}`}>
                    Get in touch
                  </p>
                  <a
                    href="mailto:info@activaterights.org"
                    className={`block text-[16px] lowercase underline-offset-2 hover:underline ${robotoMono.className}`}
                  >
                    info@activaterights.org
                  </a>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
