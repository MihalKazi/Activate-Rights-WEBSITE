import { HomePartnersSection } from "./HomePartnersSection";
import { HomeSiteFooter } from "./HomeSiteFooter";
import type { Locale } from "../../i18n/config";

type AboutPartnersClosingProps = {
  locale: Locale;
};

/**
 * Home “we have worked with” band + site footer.
 * Used at the bottom of About, Projects, Reports, Articles, Events (and detail pages).
 */
export function AboutPartnersClosing({ locale }: AboutPartnersClosingProps) {
  return (
    <>
      <HomePartnersSection />
      <HomeSiteFooter locale={locale} />
    </>
  );
}
