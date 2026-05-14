import Image from "next/image";
import Link from "next/link";
import { cn } from "../../lib/utils";

/** Raster wordmark from design (351×141, white on black). */
export const BRAND_LOGO_PATH = "/images/brand-logo.png" as const;
const BRAND_W = 351;
const BRAND_H = 141;

export type BrandLogoSize = "nav" | "homeHeader" | "homeFooter" | "footer" | "compact";

const SIZE_CLASS: Record<BrandLogoSize, string> = {
  nav: "w-[90px] sm:w-[100px] md:w-[117px]",
  homeHeader: "w-[100px] sm:w-[120px] md:w-[140px]",
  homeFooter: "w-[130px] md:w-[160px]",
  footer: "w-[180px] sm:w-[220px] max-w-full",
  compact: "w-[72px] md:w-[88px]"
};

type BrandLogoProps = {
  size?: BrandLogoSize;
  className?: string;
  priority?: boolean;
};

export function BrandLogo({ size = "nav", className, priority }: BrandLogoProps) {
  return (
    <Image
      src={BRAND_LOGO_PATH}
      alt="Activate Rights"
      width={BRAND_W}
      height={BRAND_H}
      className={cn("h-auto shrink-0 object-contain object-left", SIZE_CLASS[size], className)}
      priority={priority}
      sizes="(max-width: 768px) 120px, 240px"
    />
  );
}

type BrandLogoLinkProps = BrandLogoProps & {
  href: string;
  linkClassName?: string;
};

export function BrandLogoLink({ href, size, className, linkClassName, priority }: BrandLogoLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-block shrink-0 leading-none outline-none focus-visible:ring-2 focus-visible:ring-[#303ccf] focus-visible:ring-offset-2",
        linkClassName
      )}
    >
      <BrandLogo size={size} className={className} priority={priority} />
    </Link>
  );
}
