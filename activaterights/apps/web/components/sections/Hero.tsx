import type { CSSProperties } from "react";

/** Home hero — Figma artboard: 1440×1024 ([Share-AR-WEbsites Home](https://www.figma.com/design/I0NyZe5MGE6UpUYQ7MiqFX)). */
const FIGMA_FRAME = { W: 1440, H: 1024 } as const;
/** Text line vertical centers (px from top of full frame); matches nodes 34:40–44. */
const FIGMA_LINE_Y = [277.5, 389.5, 501.5, 613.5, 725.5] as const;
/** Masked earth fill — node 34:39; top edge in full frame. */
const FIGMA_GLOBE_TOP_PX = 197.09;
/** Extra vs Figma Y — balance: high enough to clear stripes, not so high the top clips. */
const GLOBE_TOP_OFFSET_LG_PX = 18;
/**
 * Figma Y is from the top of the full board (nav + hero). Navbar is outside this
 * section, so we subtract a band and express positions as % of hero height.
 */
const FIGMA_NAV_BAND_PX = 170;

const figmaHeroHeight = FIGMA_FRAME.H - FIGMA_NAV_BAND_PX;

/** Figma mask node 34:37 / 34:39 — exported from MCP; local copy for stable URLs. */
const EARTH_MASK_SRC = "/images/earth-mask.png";

/**
 * Home hero headline sizes:
 * - **Phones / tablets (below `lg`):** edit **`MOBILE_HEADLINE_CLAMPS`** — injected as a `<style>` block in this component so sizes always apply (Tailwind `h1` preflight + vars were unreliable).
 *   - **`base`** — viewport **&lt; 640px**
 *   - **`sm`** — **640px–767px**
 *   - **`md`** — **768px–1023px** (still below `lg`)
 * - **Desktop (`lg`+):** `DESKTOP_HEADLINE_CLAMP` on the `hidden lg:block` headings.
 * Font **family**: `.home-headline-font` in **`app/globals.css`** (Stack Sans Notch).
 */
const MOBILE_HEADLINE_CLAMPS = {
  /** viewport &lt; 640px */
  base: "clamp(36px, 10.5vw, 58px)",
  sm: "clamp(50px, 11.5vw, 66px)",
  md: "clamp(54px, 10.8vw, 72px)"
} as const;

/** Matches `.home-headline-font` — clean bold, no faux outline. */
const MOBILE_HEADLINE_WEIGHT = "700";

/** Injected once per Hero — uses clamps above so edits take effect immediately after save. */
const MOBILE_HEADLINE_STYLE_TAG = `
.hero-home-mobile-lines h1 {
  font-size: ${MOBILE_HEADLINE_CLAMPS.base} !important;
  line-height: 1.02;
  font-weight: ${MOBILE_HEADLINE_WEIGHT} !important;
  letter-spacing: -0.025em;
}
@media (min-width: 640px) {
  .hero-home-mobile-lines h1 {
    font-size: ${MOBILE_HEADLINE_CLAMPS.sm} !important;
    line-height: 1.05;
    font-weight: ${MOBILE_HEADLINE_WEIGHT} !important;
    letter-spacing: -0.02em;
  }
}
@media (min-width: 768px) {
  .hero-home-mobile-lines h1 {
    font-size: ${MOBILE_HEADLINE_CLAMPS.md} !important;
    line-height: 1.06;
    font-weight: ${MOBILE_HEADLINE_WEIGHT} !important;
    letter-spacing: -0.015em;
  }
}
`;

/** Home hero desktop (`lg`+) — five headline lines; tune max / formula here. */
const DESKTOP_HEADLINE_CLAMP =
  "clamp(28px, calc((min(100vw, 1440px) - 100px) / 13.5), 107px)";

export function Hero() {
  const lines = new Array(5).fill("internet demands freedom");
  const lineTopsPct = FIGMA_LINE_Y.map(
    (y) => ((y - FIGMA_NAV_BAND_PX) / figmaHeroHeight) * 100 - 0.6
  );
  const globeTopPctLg =
    ((FIGMA_GLOBE_TOP_PX + GLOBE_TOP_OFFSET_LG_PX - FIGMA_NAV_BAND_PX) /
      figmaHeroHeight) *
    100;

  const globeMask: CSSProperties = {
    WebkitMaskImage: `url('${EARTH_MASK_SRC}')`,
    maskImage: `url('${EARTH_MASK_SRC}')`,
    WebkitMaskRepeat: "no-repeat",
    maskRepeat: "no-repeat",
    WebkitMaskSize: "553px 553px",
    maskSize: "553px 553px",
    WebkitMaskPosition: "51.808px 34.914px",
    maskPosition: "51.808px 34.914px"
  };

  return (
    <section
      className="hero-section relative min-h-0 flex-1 overflow-x-clip overflow-y-visible lg:!pt-4 xl:!pt-6"
      style={
        {
          ["--figma-globe-y-lg" as string]: `${globeTopPctLg}%`
        } as CSSProperties
      }
    >
      <style dangerouslySetInnerHTML={{ __html: MOBILE_HEADLINE_STYLE_TAG }} />
      <div className="relative mx-auto h-full w-full min-h-0 max-w-[1440px]">
        {/* Globe — lg+: lift so bottom arc clears stripe band (gap above stripes) */}
        <div
          className="hero-circle hero-home-globe-mobile pointer-events-none absolute z-20 left-1/2 top-[18%] h-[88vw] w-[88vw] max-h-[440px] max-w-[440px] -translate-x-1/2 sm:top-[16%] sm:h-[82vw] sm:w-[82vw] sm:max-h-[480px] sm:max-w-[480px] md:top-[14%] md:h-[72vw] md:w-[72vw] md:max-h-[520px] md:max-w-[520px] lg:left-[105.19px] lg:top-[var(--figma-globe-y-lg)] lg:h-[717.436px] lg:w-[705.047px] lg:max-h-none lg:max-w-none lg:translate-x-0 lg:-translate-y-12 xl:-translate-y-14 2xl:-translate-y-16"
        >
          <div
            className="hero-globe-fill h-full w-full bg-[#006b40]"
            style={globeMask}
          />
        </div>

        {/* Stripes — node 34:45 */}
        <div className="pointer-events-none absolute inset-0 z-0 lg:hidden">
          <div className="absolute bottom-[22%] left-4 right-4 h-[10px] min-h-[8px] bg-[#075e3b] sm:left-6 sm:right-6 sm:bottom-[20%]" />
          <div className="absolute bottom-0 left-4 right-4 top-[79%] bg-[repeating-linear-gradient(to_bottom,#075e3b_0px,#075e3b_5px,transparent_5px,transparent_12px)] sm:left-6 sm:right-6 sm:top-[81%] sm:bg-[repeating-linear-gradient(to_bottom,#075e3b_0px,#075e3b_5px,transparent_5px,transparent_13px)]" />
        </div>
        {/* Laptop/desktop: anchored low so band sits clearly below globe */}
        <div className="pointer-events-none absolute left-[40px] right-[40px] z-10 hidden lg:block lg:bottom-3 xl:bottom-2 2xl:bottom-1.5">
          <div className="h-4 w-full bg-[#075e3b]" />
          <div className="mt-3 min-h-[120px] w-full bg-[repeating-linear-gradient(to_bottom,#075e3b_0,#075e3b_7px,transparent_7px,transparent_19px)] xl:h-[159px]" />
        </div>

        <div className="absolute inset-0 z-30">
          <div className="hero-home-mobile-lines home-headline-font lowercase text-white lg:hidden">
            {/*
              Below sm: five left-aligned phrases, each full width (two headline lines); sit clear
              of stripe band (~top 79%); smaller type only when needed (< sm). sm+: stacked block layout.
            */}
            <div className="absolute inset-x-4 top-[4.75rem] bottom-[41%] flex flex-col justify-between pb-2 sm:inset-x-6 sm:top-[3%] sm:bottom-auto sm:block sm:space-y-2 sm:pb-0 md:top-[2%] md:space-y-2.5">
              {lines.map((_, index) => (
                <div
                  key={`hero-mobile-block-${index}`}
                  className="w-full min-w-0 text-left"
                >
                  <h1 className="block w-full max-w-none">
                    internet demands
                  </h1>
                  <h1 className="mt-2 block w-full max-w-none sm:mt-1.5">
                    freedom
                  </h1>
                </div>
              ))}
            </div>
          </div>

          {/*
            Figma 34:40: Stack Sans Notch Bold, max 107.019px — fluid clamp so lines never clip (long string).
          */}
          <div className="hidden home-headline-font lowercase text-white lg:block">
            {lines.map((line, index) => (
              <h1
                key={`${line}-${index}`}
                className="absolute left-4 right-10 box-border max-w-full -translate-y-1/2 whitespace-nowrap sm:left-6 sm:right-10 lg:left-[40px] lg:right-10"
                style={{
                  top: `${lineTopsPct[index]}%`,
                  fontSize: DESKTOP_HEADLINE_CLAMP,
                  lineHeight: 0.929
                }}
              >
                {line}
              </h1>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
