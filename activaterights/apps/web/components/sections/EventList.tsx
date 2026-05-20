import Image from "next/image";
import Link from "next/link";
import type { Image as SanityImageSource } from "sanity";
import { Roboto_Mono } from "next/font/google";
import { cn } from "../../lib/utils";
import { urlFor } from "../../lib/sanity/image";
import type { EventItem } from "../../lib/sanity/queries";
import type { Locale } from "../../i18n/config";
import { formatCalendarDdMmYyyyUtc } from "../../lib/datetime/formatCalendarDisplay";

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap"
});

type EventListProps = {
  locale: Locale;
  events: EventItem[];
};

function formatListingDate(iso: string): string {
  return formatCalendarDdMmYyyyUtc(iso);
}

function truncateExcerpt(text: string, max: number): string {
  const t = text.trim();
  if (t.length <= max) return t;
  return `${t.slice(0, max).trimEnd()}…`;
}

function chunkPairs<T>(items: T[]): [T, T | undefined][] {
  const out: [T, T | undefined][] = [];
  for (let i = 0; i < items.length; i += 2) {
    out.push([items[i], items[i + 1]]);
  }
  return out;
}

type EventCellProps = {
  event: EventItem;
  isFeatured: boolean;
  locale: Locale;
};

function eventCoverSrc(event: EventItem): string | null {
  if (!event.coverImage?.asset?._ref) return null;
  return urlFor(event.coverImage as SanityImageSource)
    .width(1262)
    .height(760)
    .fit("crop")
    .auto("format")
    .url();
}

function EventCell({ event, isFeatured, locale }: EventCellProps) {
  const desc = (event.description ?? "").trim();
  const excerpt = isFeatured && desc ? truncateExcerpt(desc, 160) : null;
  const dateStr = formatListingDate(event.date);
  const slug = event.slug?.current?.trim();
  const coverSrc = eventCoverSrc(event);

  const titleClass = cn(
    "home-headline-font text-[30px] font-normal leading-[1.15] tracking-tight transition-colors",
    isFeatured ? "text-[#303ccf]" : "text-[#1c1c1c] group-hover:text-[#303ccf]"
  );

  const titleInner = <span className={titleClass}>{event.title}</span>;

  const coverBlock =
    coverSrc !== null ? (
      <div className="relative aspect-[631/380] w-full max-w-[631px] overflow-hidden bg-neutral-200">
        <Image
          src={coverSrc}
          alt={event.title}
          fill
          className="object-cover transition-opacity group-hover:opacity-95"
          sizes="(max-width: 1024px) 100vw, 631px"
        />
      </div>
    ) : null;

  const detailInner = (
    <>
      {coverBlock}
      {titleInner}
    </>
  );

  return (
    <div className="group flex min-w-0 flex-col gap-11 lg:max-w-[670px]">
      {slug ? (
        <Link href={`/${locale}/events/${slug}`} className="flex w-full max-w-[631px] flex-col gap-6">
          {detailInner}
        </Link>
      ) : (
        <div className="flex max-w-[631px] flex-col gap-6">
          {detailInner}
        </div>
      )}
      <p className={cn(robotoMono.className, "text-[14px] font-normal leading-[26px] text-[#212121]")}>
        {dateStr}
      </p>
      {excerpt ? (
        <p
          className={cn(
            robotoMono.className,
            "max-w-[631px] text-[20px] font-normal leading-[26px] text-[#212121]"
          )}
        >
          {excerpt}
        </p>
      ) : null}
    </div>
  );
}

export function EventList({ locale, events }: EventListProps) {
  const globalFeaturedIndex = events.findIndex((e) => (e.description ?? "").trim().length > 0);
  const rows = chunkPairs(events);

  return (
    <section className="site-white-section px-6 py-16 text-neutral-900 md:px-10 md:py-20 lg:px-[40px] lg:py-24">
      <div className="mx-auto max-w-[1440px] pb-4 pt-0 md:pb-6">
        <div className="flex flex-col">
          {rows.map((pair, rowIndex) => {
            const [left, right] = pair;
            const leftIndex = rowIndex * 2;
            const rightIndex = rowIndex * 2 + 1;
            const leftFeatured = leftIndex === globalFeaturedIndex;
            const rightFeatured = right !== undefined && rightIndex === globalFeaturedIndex;

            return (
              <div key={left._id}>
                <div className="h-px w-full bg-[#303ccf]/25" aria-hidden />
                <div className="grid grid-cols-1 gap-y-12 pt-[30px] pb-12 lg:grid-cols-2 lg:gap-x-5 lg:gap-y-0 lg:pb-14">
                  <EventCell event={left} isFeatured={leftFeatured} locale={locale} />
                  {right ? (
                    <EventCell event={right} isFeatured={rightFeatured} locale={locale} />
                  ) : (
                    <div className="hidden lg:block" aria-hidden />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
