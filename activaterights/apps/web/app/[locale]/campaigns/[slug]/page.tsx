import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Campaign"
};

type Props = {
  params: { slug: string };
};

export default function CampaignSlugPage({ params }: Props) {
  return (
    <main className="container-shell py-16">
      <p className="text-text-secondary">
        Campaign &quot;{params.slug}&quot; coming soon.
      </p>
    </main>
  );
}
