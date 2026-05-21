"use client";

import type { CSSProperties, ElementType, ReactNode } from "react";
import { cn } from "../../lib/utils";

export type ScrollRevealVariant =
  | "fade-up"
  | "fade-down"
  | "fade"
  | "fade-left"
  | "fade-right"
  | "fade-up-left"
  | "fade-up-right"
  | "fade-down-left"
  | "fade-down-right";

type ScrollRevealProps = {
  children: ReactNode;
  className?: string;
  variant?: ScrollRevealVariant;
  /** Milliseconds — maps to `--scroll-reveal-delay` */
  delay?: number;
  as?: ElementType;
};

/**
 * Client wrapper that marks content for scroll reveal (paired with ScrollRevealObserver).
 */
export function ScrollReveal({
  children,
  className,
  variant = "fade-up",
  delay = 0,
  as: Component = "div"
}: ScrollRevealProps) {
  return (
    <Component
      data-scroll-reveal={variant}
      className={cn("scroll-reveal", className)}
      style={
        delay > 0
          ? ({ "--scroll-reveal-delay": `${delay}ms` } as CSSProperties)
          : undefined
      }
    >
      {children}
    </Component>
  );
}
