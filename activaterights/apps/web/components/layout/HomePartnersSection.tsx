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
    <section className={cn("home-paper-marketing-section py-14 text-black md:py-20 xl:py-24", className)}>
      <div className={`mx-auto max-w-[1440px] ${HOME_PAD_155}`}>
        <h2 className="home-headline-font home-partners-heading max-w-[min(100%,720px)] text-left text-[clamp(40px,6vw,109px)] lowercase text-[#2d74fd] xl:text-[109px]">
          <span className="block">we have</span>
          <span className="block">worked with</span>
        </h2>
        <PartnersMarquee
          className={`${HOME_NEG_155} mt-16 xl:mt-[100px]`}
          ariaLabel="Organizations we have worked with"
        />
      </div>
    </section>
  );
}
