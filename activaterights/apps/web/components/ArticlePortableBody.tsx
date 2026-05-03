import { PortableText, type PortableTextComponents } from "@portabletext/react";
import { ArticlePdfEmbed } from "./ArticlePdfEmbed";
import { cn } from "../lib/utils";
import { extractPdfOnlyParagraphUrl, isPdfUrl } from "../lib/portableText/pdfEmbed";

export type ArticlePdfLabels = {
  document: string;
  open: string;
  download: string;
};

const writingWrap =
  "article-writing space-y-7 font-[\'Stack Sans Notch\',sans-serif] text-[clamp(17px,2.65vw,21px)] leading-[1.72] tracking-[0.011em] text-[#2d2d2d] selection:bg-[#303ccf]/12 selection:text-[#1e1b4b] md:leading-[1.75]";

function makeComponents(labels: ArticlePdfLabels): PortableTextComponents {
  return {
    block: {
      normal: ({ children, value }) => {
        const pdfUrl = extractPdfOnlyParagraphUrl(value);
        if (pdfUrl) {
          return (
            <ArticlePdfEmbed
              url={pdfUrl}
              documentLabel={labels.document}
              openLabel={labels.open}
              downloadLabel={labels.download}
              className="!my-6 md:!my-8"
            />
          );
        }
        return (
          <p className="text-pretty text-[1em] leading-[inherit] text-[#2d2d2d] [&_strong]:text-[#1a1a1a]">
            {children}
          </p>
        );
      },
      h2: ({ children }) => (
        <h2
          className={cn(
            "scroll-mt-24 border-b border-[#303ccf]/14 pb-3 text-[clamp(22px,4.2vw,30px)] font-semibold leading-[1.2] tracking-tight text-[#243c84]",
            "first:mt-0"
          )}
        >
          {children}
        </h2>
      ),
      h3: ({ children }) => (
        <h3 className="text-[clamp(19px,3.2vw,23px)] font-semibold leading-snug tracking-tight text-[#303ccf]">
          {children}
        </h3>
      ),
      blockquote: ({ children }) => (
        <blockquote className="relative my-2 rounded-br-xl rounded-tr-xl border border-[#303ccf]/12 bg-gradient-to-br from-[#f6f8ff] to-[#fafcff] py-5 pl-6 pr-5 text-[1.05em] italic leading-[1.65] text-neutral-700 shadow-[inset_3px_0_0_0_rgba(48,60,207,0.55)] md:py-6 md:pl-7 [&_p]:mb-3 [&_p:last-child]:mb-0">
          {children}
        </blockquote>
      )
    },
    list: {
      bullet: ({ children }) => (
        <ul className="my-2 list-disc space-y-2.5 pl-7 marker:text-[#303ccf]">{children}</ul>
      ),
      number: ({ children }) => (
        <ol className="my-2 list-decimal space-y-2.5 pl-8 marker:font-medium marker:text-[#303ccf] [&>li]:pl-2">
          {children}
        </ol>
      )
    },
    listItem: {
      bullet: ({ children }) => (
        <li className="leading-[inherit] [&_p]:inline [&_p]:leading-[inherit]">{children}</li>
      ),
      number: ({ children }) => (
        <li className="leading-[inherit] [&_p]:inline [&_p]:leading-[inherit]">{children}</li>
      )
    },
    marks: {
      link: ({ children, value }) => {
        const v = value as { href?: string; url?: string } | undefined;
        const href = v?.href ?? v?.url;
        if (isPdfUrl(href)) {
          return (
            <a
              href={href}
              className="inline-flex max-w-full items-center gap-2 rounded-lg border border-[#303ccf]/25 bg-[#303ccf]/[0.06] px-3 py-1.5 text-[0.95em] font-medium leading-snug text-[#303ccf] no-underline transition-colors hover:border-[#303ccf]/40 hover:bg-[#303ccf]/10"
              rel="noopener noreferrer"
              target="_blank"
            >
              <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded bg-[#303ccf]/15 text-[10px] font-bold tracking-wide">
                PDF
              </span>
              <span className="break-words">{children}</span>
            </a>
          );
        }
        return (
          <a
            href={href}
            className="font-medium text-[#303ccf] underline decoration-[#303ccf]/35 underline-offset-[5px] transition hover:text-[#2839b5] hover:decoration-[#2839b5]/50"
            rel="noopener noreferrer"
            target={href?.startsWith("http") ? "_blank" : undefined}
          >
            {children}
          </a>
        );
      },
      strong: ({ children }) => <strong className="font-semibold text-[#1a1a1a]">{children}</strong>,
      em: ({ children }) => <em className="italic text-neutral-800">{children}</em>,
      underline: ({ children }) => (
        <span className="underline decoration-neutral-400 underline-offset-[3px]">{children}</span>
      )
    }
  };
}

type ArticlePortableBodyProps = {
  value: unknown[] | null | undefined;
  className?: string;
  pdfLabels: ArticlePdfLabels;
};

export function ArticlePortableBody({ value, className, pdfLabels }: ArticlePortableBodyProps) {
  if (!value?.length) return null;
  const components = makeComponents(pdfLabels);
  return (
    <div className={cn(writingWrap, className)}>
      <PortableText value={value as never} components={components} />
    </div>
  );
}
