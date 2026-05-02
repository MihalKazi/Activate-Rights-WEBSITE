import type { EventItem } from "../../lib/sanity/queries";
import { Badge } from "../ui/Badge";
import { Card } from "../ui/Card";

type EventListProps = {
  locale: "en" | "bn";
  events: EventItem[];
};

export function EventList({ locale, events }: EventListProps) {
  return (
    <section className="bg-[#fafcff] py-16 text-neutral-900">
      <div className="container-shell">
        <div className="mb-8">
          <h2 className="home-headline-font text-3xl font-normal uppercase tracking-tight text-neutral-900">
            Events
          </h2>
        </div>
        <div className="space-y-6">
          {events.map((event) => (
            <Card
              key={event._id}
              className="flex flex-col gap-4 !border-neutral-200 !bg-white/90 hover:!border-[#303ccf]/35 md:flex-row md:items-center md:justify-between"
            >
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
                  {new Date(event.date).toLocaleDateString(locale)}
                </p>
                <h3 className="mt-2 text-2xl font-bold text-neutral-900">{event.title}</h3>
                {event.location ? (
                  <p className="mt-1 text-sm text-neutral-600">{event.location}</p>
                ) : null}
              </div>
              <Badge className="border-[#303ccf]/40 bg-white text-[10px] font-semibold uppercase tracking-wide text-[#303ccf]">
                {event.isOnline ? "Online" : "In Person"}
              </Badge>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
