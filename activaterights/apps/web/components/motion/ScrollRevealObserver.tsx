"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const REVEALED_CLASS = "is-scroll-revealed";

/**
 * Observes `[data-scroll-reveal]` and adds `.is-scroll-revealed` when elements enter view.
 * Respects prefers-reduced-motion (reveals immediately).
 */
export function ScrollRevealObserver() {
  const pathname = usePathname();

  useEffect(() => {
    let intersectionObserver: IntersectionObserver | null = null;
    let mutationObserver: MutationObserver | null = null;
    let mutationTimer: ReturnType<typeof setTimeout> | null = null;

    const bind = () => {
      const elements = Array.from(
        document.querySelectorAll<HTMLElement>(
          `[data-scroll-reveal]:not(.${REVEALED_CLASS}), [data-scroll-reveal-stagger]:not(.${REVEALED_CLASS})`
        )
      );
      if (elements.length === 0) return;

      const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (prefersReduced) {
        elements.forEach((el) => el.classList.add(REVEALED_CLASS));
        return;
      }

      intersectionObserver?.disconnect();

      intersectionObserver = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting && entry.target instanceof HTMLElement) {
              entry.target.classList.add(REVEALED_CLASS);
              intersectionObserver?.unobserve(entry.target);
            }
          }
        },
        { root: null, rootMargin: "0px 0px -4% 0px", threshold: 0.08 }
      );

      for (const el of elements) {
        intersectionObserver.observe(el);
      }
    };

    bind();

    mutationObserver = new MutationObserver(() => {
      if (mutationTimer) clearTimeout(mutationTimer);
      mutationTimer = setTimeout(bind, 80);
    });
    mutationObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      if (mutationTimer) clearTimeout(mutationTimer);
      mutationObserver?.disconnect();
      intersectionObserver?.disconnect();
    };
  }, [pathname]);

  return null;
}
