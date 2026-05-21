import type { CSSProperties } from "react";
import { PartnersMarquee } from "../marquee/PartnersMarquee";
import { cn } from "../../lib/utils";

const HOME_PAD_155 = "px-4 sm:px-6 md:px-10 lg:px-16 xl:px-[155px]";
const HOME_NEG_155 = "-mx-4 sm:-mx-6 md:-mx-10 lg:-mx-16 xl:-mx-[155px]";

type HomePartnersSectionProps = {
  className?: string;
};

/** Home “we have worked with” band — shared before the site footer on inner pages. */
export function HomePartnersSection({ className }: HomePartnersSectionProps) {
  return (
    <section
      className={cn("home-paper-section py-10 text-black md:py-14 xl:py-16", className)}
      data-scroll-reveal="fade-up"
    >
      <div className={`mx-auto max-w-[1440px] ${HOME_PAD_155}`}>
        <h2
          className="home-headline-font home-partners-heading max-w-[min(100%,520px)] text-left text-[clamp(28px,5vw,52px)] lowercase leading-[0.92] text-[#303ccf]"
          data-scroll-reveal="fade-left"
        >
          <span className="block">we have</span>
          <span className="block">worked with</span>
        </h2>
        <div
          className="mt-6 sm:mt-8 md:mt-10"
          data-scroll-reveal="fade-up-right"
          style={{ "--scroll-reveal-delay": "120ms" } as CSSProperties}
        >
          <PartnersMarquee
            className={HOME_NEG_155}
            ariaLabel="Organizations we have worked with"
          />
        </div>
      </div>
    </section>
  );
}
