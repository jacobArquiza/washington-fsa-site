import Link from "next/link";
import EventsCalendar from "@/components/events-calendar";
import { events } from "@/data/events";
import { calendarNow } from "@/lib/event-calendar";

export default function EventsOverview() {
  return (
    <section
      id="events"
      aria-labelledby="events-title"
      className="bg-ivory px-4 py-16 sm:px-6 md:px-12 md:py-24"
    >
      <div className="mx-auto max-w-[1440px]">
        <p className="section-eyebrow">What&apos;s happening</p>
        <h2
          id="events-title"
          className="mt-5 max-w-3xl font-display text-4xl leading-[1.05] sm:text-5xl lg:text-7xl"
        >
          Where community comes together.
        </h2>
        <div className="mt-10 lg:mt-14">
          <EventsCalendar records={events} initialNow={calendarNow()} compact />
        </div>
        <Link href="/events" className="pill-link mt-7">
          Explore the full calendar <span aria-hidden="true">↗</span>
        </Link>
      </div>
    </section>
  );
}
