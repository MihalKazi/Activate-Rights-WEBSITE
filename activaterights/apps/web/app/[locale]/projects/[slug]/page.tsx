import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Project"
};

type Props = {
  params: { slug: string };
};

export default function ProjectSlugPage({ params }: Props) {
  return (
    <main className="container-shell py-16">
      <p className="text-text-secondary">
        Project &quot;{params.slug}&quot; coming soon.
      </p>
    </main>
  );
}
