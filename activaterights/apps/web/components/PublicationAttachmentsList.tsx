import { cn } from "../lib/utils";
import type { PublicationFileAttachment } from "../lib/sanity/queries";
import {
  PublicationAttachmentEmbed,
  type PublicationAttachmentLabels
} from "./PublicationAttachmentEmbed";

type PublicationAttachmentsListProps = {
  attachments?: PublicationFileAttachment[] | null;
  labels: PublicationAttachmentLabels;
  className?: string;
  /** Extra top margin when rendered below portable text body */
  spacedBelowBody?: boolean;
};

export function PublicationAttachmentsList({
  attachments,
  labels,
  className,
  spacedBelowBody = false
}: PublicationAttachmentsListProps) {
  const items = (attachments ?? []).filter(
    (p): p is PublicationFileAttachment & { url: string } =>
      Boolean(p?.url && typeof p.url === "string")
  );

  if (items.length === 0) return null;

  return (
    <div
      className={cn(
        spacedBelowBody ? "mt-10 space-y-10 md:mt-12 md:space-y-12" : "space-y-10 md:space-y-12",
        className
      )}
    >
      {items.map((file, i) => (
        <PublicationAttachmentEmbed key={`${file.url}-${i}`} attachment={file} labels={labels} />
      ))}
    </div>
  );
}

export function hasPublicationAttachments(
  attachments?: PublicationFileAttachment[] | null
): boolean {
  return (attachments ?? []).some((p) => Boolean(p?.url && typeof p.url === "string"));
}
