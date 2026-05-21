import Image from "next/image";
import type { ElementType, ReactNode } from "react";
import { cn } from "../../lib/utils";

export type CollectiveZineLines = {
  line1: string;
  line2: string;
  line3: string;
  line4Start: string;
  line4End: string;
};

type CollectiveZineHeadlineProps = {
  lines: CollectiveZineLines;
  /** `h1` for About hero (uses spans); `div` for Home (uses paragraphs) */
  as?: "h1" | "div";
  className?: string;
};

const typeClass =
  "home-headline-font home-collective-zine__type text-[clamp(40px,5.4vw,77px)] font-bold lowercase tracking-[-0.02em] text-white";

function ZineLine({
  as: Tag,
  className,
  children
}: {
  as: "h1" | "div";
  className?: string;
  children: ReactNode;
}) {
  const LineTag: ElementType = Tag === "h1" ? "span" : "p";
  return (
    <LineTag className={cn("home-collective-zine__line", Tag === "h1" && "block", className)}>
      {children}
    </LineTag>
  );
}

/** Shared “// we are a collective…” zine headline (Home collective + About hero). */
export function CollectiveZineHeadline({
  lines,
  as: Tag = "div",
  className
}: CollectiveZineHeadlineProps) {
  return (
    <Tag className={cn(typeClass, className)}>
      <ZineLine as={Tag}>
        <span className="text-white">// </span>
        {lines.line1}
      </ZineLine>
      <ZineLine as={Tag} className="home-collective-zine__line--fighting mt-[0.08em]">
        {lines.line2}{" "}
        <span className="home-collective-zine__picsPair" aria-hidden>
          <span className="home-collective-zine__picWrap">
            <Image
              src="/images/home-collective-zine-ear.png"
              alt=""
              fill
              sizes="2em"
              className="object-contain object-center"
            />
          </span>
          <span className="home-collective-zine__picWrap">
            <Image
              src="/images/home-collective-zine-mouth.png"
              alt=""
              fill
              sizes="2em"
              className="object-contain object-center"
            />
          </span>
        </span>
      </ZineLine>
      <ZineLine as={Tag} className="mt-[0.06em]">
        {lines.line3}
      </ZineLine>
      <ZineLine as={Tag} className="home-collective-zine__line--open mt-[0.06em]">
        {lines.line4Start}{" "}
        <span className="home-collective-zine__picWrap home-collective-zine__picWrap--narrow" aria-hidden>
          <Image
            src="/images/home-collective-zine-eye.png"
            alt=""
            fill
            sizes="2em"
            className="object-contain object-center"
          />
        </span>{" "}
        {lines.line4End}
      </ZineLine>
    </Tag>
  );
}
