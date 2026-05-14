import type { CSSProperties } from "react";
import Image from "next/image";
import { cn } from "../../lib/utils";

/** Same assets as the home “we have worked with” band. */
export const HOME_PARTNER_LOGOS = [
  { name: "Cinemata", src: "/images/home/partners/cinemata.png" },
  { name: "Tech Tales Youth", src: "/images/home/partners/tech-tales-youth.png" },
  { name: "EngageMedia", src: "/images/home/partners/engagemedia.png" }
] as const;

export const PARTNERS_MARQUEE_LOOP_COUNT = 8;

export type PartnerLogo = { name: string; src: string };

export function PartnersMarqueeSequence({
  items = HOME_PARTNER_LOGOS
}: {
  items?: readonly PartnerLogo[];
}) {
  return (
    <div className="home-partners-marquee__sequence">
      {items.map((partner) => (
        <div
          key={partner.name}
          className="flex h-[72px] w-[min(220px,38vw)] shrink-0 items-center justify-center md:h-[88px] md:w-[260px]"
        >
          <Image
            src={partner.src}
            alt={partner.name}
            width={280}
            height={100}
            className="max-h-16 w-auto object-contain md:max-h-[76px]"
          />
        </div>
      ))}
    </div>
  );
}

type PartnersMarqueeProps = {
  ariaLabel: string;
  className?: string;
  items?: readonly PartnerLogo[];
};

export function PartnersMarquee({ ariaLabel, className, items }: PartnersMarqueeProps) {
  return (
    <div
      className={cn("home-partners-marquee", className)}
      role="region"
      aria-label={ariaLabel}
      style={
        { "--partners-marquee-loops": String(PARTNERS_MARQUEE_LOOP_COUNT) } as CSSProperties
      }
    >
      <div className="home-partners-marquee__track">
        {Array.from({ length: PARTNERS_MARQUEE_LOOP_COUNT }, (_, i) => (
          <PartnersMarqueeSequence key={`partners-marquee-${i}`} items={items} />
        ))}
      </div>
    </div>
  );
}
