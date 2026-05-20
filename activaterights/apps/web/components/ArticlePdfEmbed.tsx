import { cn } from "../lib/utils";
import { pdfFileLabel } from "../lib/portableText/pdfEmbed";

type ArticlePdfEmbedProps = {
  url: string;
  documentLabel: string;
  openLabel: string;
  downloadLabel: string;
  className?: string;
  /** Optional heading; defaults to filename parsed from the URL */
  headingTitle?: string;
};

function PdfGlyph({ className }: { className?: string }) {
  return (
    <svg
      className={cn("h-8 w-8 shrink-0 text-[#303ccf]", className)}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M14 2H8a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V8l-6-6Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M14 2v6h6" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path
        d="M10 13h4M10 17h4M10 9h2"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function ArticlePdfEmbed({
  url,
  documentLabel,
  openLabel,
  downloadLabel,
  className,
  headingTitle
}: ArticlePdfEmbedProps) {
  const name = headingTitle?.trim() || pdfFileLabel(url);

  return (
    <figure
      className={cn(
        "not-prose my-10 w-full overflow-hidden rounded-2xl border border-[#303ccf]/25 bg-white shadow-[0_12px_40px_rgba(48,60,207,0.1)]",
        className
      )}
    >
      <figcaption className="flex flex-col gap-4 border-b border-[#e8eaf8] bg-gradient-to-r from-[#f5f4f2] via-white to-[#f5f4f2] px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5 sm:py-4">
        <div className="flex min-w-0 items-start gap-3 sm:items-center">
          <PdfGlyph className="hidden sm:block" />
          <div className="min-w-0">
            <p className="truncate text-[15px] font-semibold leading-snug text-[#303ccf] sm:text-[17px]">
              {name}
            </p>
            <p className="mt-0.5 text-[13px] leading-snug text-neutral-500 sm:text-[14px]">
              {documentLabel}
            </p>
          </div>
        </div>
        <div className="flex shrink-0 flex-wrap gap-2 sm:justify-end">
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-lg border border-[#303ccf]/30 bg-white px-4 py-2.5 text-[13px] font-medium uppercase tracking-wide text-[#303ccf] transition-colors hover:border-[#303ccf]/50 hover:bg-[#f5f4f2] sm:text-[14px]"
          >
            {openLabel}
          </a>
          <a
            href={url}
            download
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-lg bg-[#303ccf] px-4 py-2.5 text-[13px] font-medium uppercase tracking-wide text-white transition-colors hover:bg-[#2839b5] sm:text-[14px]"
          >
            {downloadLabel}
          </a>
        </div>
      </figcaption>

      <div className="relative w-full bg-neutral-100">
        <div className="relative aspect-[16/11] min-h-[min(72vh,640px)] w-full sm:aspect-[16/10] sm:min-h-[520px]">
          <iframe
            src={url}
            title={name}
            className="absolute left-0 top-0 h-full w-full border-0"
            loading="lazy"
          />
        </div>
      </div>
    </figure>
  );
}
