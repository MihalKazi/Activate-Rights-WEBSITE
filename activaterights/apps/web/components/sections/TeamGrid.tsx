import Image from "next/image";
import Link from "next/link";
import type { TeamMember } from "../../lib/sanity/queries";
import { Card } from "../ui/Card";

type TeamGridProps = {
  locale: "en" | "bn";
  members: TeamMember[];
};

export function TeamGrid({ locale, members }: TeamGridProps) {
  return (
    <section className="container-shell py-16">
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-3xl font-bold uppercase">Team</h2>
        <Link href={`/${locale}/team`} className="text-sm font-semibold text-white/80 hover:text-white">
          View all
        </Link>
      </div>
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {members.map((member) => (
          <Card key={member._id}>
            <div className="relative mb-4 h-56 overflow-hidden rounded-sm">
              <Image
                src="/images/home-reference.png"
                alt={member.name}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 25vw"
              />
            </div>
            <h3 className="text-xl font-bold">{member.name}</h3>
            <p className="mt-1 text-sm text-white/80">{member.role}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}
