import type { ReactNode } from "react";
import { ArticlePdfEmbed } from "./ArticlePdfEmbed";
import { cn } from "../lib/utils";
import {
  attachmentDisplayName,
  resolveAttachmentKind,
  type PublicationAttachmentInput
} from "../lib/attachments/resolveAttachmentKind";

export type PublicationAttachmentLabels = {
  pdfDocument: string;
  imageDocument: string;
  videoDocument: string;
  audioDocument: string;
  fileDocument: string;
  open: string;
  download: string;
};

type PublicationAttachmentEmbedProps = {
  attachment: PublicationAttachmentInput & { title?: string | null; url: string };
  labels: PublicationAttachmentLabels;
  className?: string;
};

function AttachmentShell({
  name,
  documentLabel,
  url,
  openLabel,
  downloadLabel,
  className,
  children
}: {
  name: string;
  documentLabel: string;
  url: string;
  openLabel: string;
  downloadLabel: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <figure
      className={cn(
        "not-prose my-10 w-full overflow-hidden rounded-2xl border border-[#303ccf]/25 bg-white shadow-[0_12px_40px_rgba(48,60,207,0.1)]",
        className
      )}
    >
      <figcaption className="flex flex-col gap-4 border-b border-[#e8eaf8] bg-gradient-to-r from-[#f5f4f2] via-white to-[#f5f4f2] px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5 sm:py-4">
        <div className="min-w-0">
          <p className="truncate text-[15px] font-semibold leading-snug text-[#303ccf] sm:text-[17px]">{name}</p>
          <p className="mt-0.5 text-[13px] leading-snug text-neutral-500 sm:text-[14px]">{documentLabel}</p>
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
      {children}
    </figure>
  );
}

function kindDocumentLabel(
  kind: ReturnType<typeof resolveAttachmentKind>,
  labels: PublicationAttachmentLabels
): string {
  switch (kind) {
    case "pdf":
      return labels.pdfDocument;
    case "image":
      return labels.imageDocument;
    case "video":
      return labels.videoDocument;
    case "audio":
      return labels.audioDocument;
    default:
      return labels.fileDocument;
  }
}

export function PublicationAttachmentEmbed({
  attachment,
  labels,
  className
}: PublicationAttachmentEmbedProps) {
  const url = attachment.url;
  const kind = resolveAttachmentKind(attachment);
  const name = attachmentDisplayName(attachment);
  const documentLabel = kindDocumentLabel(kind, labels);

  if (kind === "pdf") {
    return (
      <ArticlePdfEmbed
        url={url}
        headingTitle={name}
        documentLabel={documentLabel}
        openLabel={labels.open}
        downloadLabel={labels.download}
        className={className}
      />
    );
  }

  if (kind === "image") {
    return (
      <AttachmentShell
        name={name}
        documentLabel={documentLabel}
        url={url}
        openLabel={labels.open}
        downloadLabel={labels.download}
        className={className}
      >
        <div className="relative w-full bg-neutral-100">
          {/* Sanity file CDN — not in next/image remotePatterns */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={url}
            alt={name}
            className="mx-auto block h-auto max-h-[min(85vh,960px)] w-full object-contain"
            loading="lazy"
          />
        </div>
      </AttachmentShell>
    );
  }

  if (kind === "video") {
    return (
      <AttachmentShell
        name={name}
        documentLabel={documentLabel}
        url={url}
        openLabel={labels.open}
        downloadLabel={labels.download}
        className={className}
      >
        <div className="relative w-full bg-black">
          <video
            src={url}
            controls
            playsInline
            preload="metadata"
            className="mx-auto block max-h-[min(85vh,720px)] w-full"
          >
            <a href={url} target="_blank" rel="noopener noreferrer" className="text-white underline">
              {labels.open}
            </a>
          </video>
        </div>
      </AttachmentShell>
    );
  }

  if (kind === "audio") {
    return (
      <AttachmentShell
        name={name}
        documentLabel={documentLabel}
        url={url}
        openLabel={labels.open}
        downloadLabel={labels.download}
        className={className}
      >
        <div className="site-white-section px-4 py-8 sm:px-6">
          <audio src={url} controls preload="metadata" className="w-full">
            <a href={url} target="_blank" rel="noopener noreferrer">
              {labels.open}
            </a>
          </audio>
        </div>
      </AttachmentShell>
    );
  }

  return (
    <AttachmentShell
      name={name}
      documentLabel={documentLabel}
      url={url}
      openLabel={labels.open}
      downloadLabel={labels.download}
      className={className}
    >
      <div className="site-white-section flex items-center justify-center px-6 py-14 text-center text-[15px] leading-relaxed text-neutral-600">
        {labels.open} / {labels.download}
      </div>
    </AttachmentShell>
  );
}
