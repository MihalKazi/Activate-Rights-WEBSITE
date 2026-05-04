import Image from "next/image";
import type { Image as SanityImageSource } from "sanity";
import { Roboto_Mono } from "next/font/google";
import { cn } from "../../lib/utils";
import { urlFor } from "../../lib/sanity/image";
import type { EventItem } from "../../lib/sanity/queries";
import type { Locale } from "../../i18n/config";

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
  const d = new Date(iso);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}.${month}.${year}`;
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

function EventCell({ event, isFeatured }: EventCellProps) {
  const desc = (event.description ?? "").trim();
  const excerpt = isFeatured && desc ? truncateExcerpt(desc, 160) : null;
  const dateStr = formatListingDate(event.date);
  const href = event.registrationUrl?.trim();
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
          alt={href ? "" : event.title}
          fill
          className="object-cover transition-opacity group-hover:opacity-95"
          sizes="(max-width: 1024px) 100vw, 631px"
        />
      </div>
    ) : null;

  return (
    <div className="group flex min-w-0 flex-col gap-11 lg:max-w-[670px]">
      {href ? (
        <a
          href={href}
          className="flex w-full max-w-[631px] flex-col gap-6"
          target="_blank"
          rel="noopener noreferrer"
        >
          {coverBlock}
          {titleInner}
        </a>
      ) : (
        <div className="flex max-w-[631px] flex-col gap-6">
          {coverBlock}
          {titleInner}
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

export function EventList({ locale: _locale, events }: EventListProps) {
  const globalFeaturedIndex = events.findIndex((e) => (e.description ?? "").trim().length > 0);
  const rows = chunkPairs(events);

  return (
    <section className="relative bg-[#fafcff] text-neutral-900">
      <div className="articles-listing-grain pointer-events-none absolute inset-0" aria-hidden />
      <div className="relative z-10 mx-auto max-w-[1440px] px-6 pb-20 pt-12 md:px-10 md:pt-14 lg:px-[40px]">
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
                  <EventCell event={left} isFeatured={leftFeatured} />
                  {right ? <EventCell event={right} isFeatured={rightFeatured} /> : <div className="hidden lg:block" aria-hidden />}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
