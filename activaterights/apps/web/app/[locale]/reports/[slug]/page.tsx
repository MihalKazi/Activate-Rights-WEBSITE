import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Report"
};

type Props = {
  params: { slug: string };
};

export default function ReportSlugPage({ params }: Props) {
  return (
    <main className="container-shell bg-[#fafcff] py-16 text-neutral-900">
      <p className="text-neutral-600">
        Report &quot;{params.slug}&quot; — full publication page coming soon.
      </p>
    </main>
  );
}
