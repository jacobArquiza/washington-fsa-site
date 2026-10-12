import type { Metadata } from "next";
import EventsCalendar from "@/components/events-calendar";
import { events } from "@/data/events";
import { calendarNow } from "@/lib/event-calendar";

export const metadata: Metadata = {
  title: "Events | Washington Filipino Student Alliance",
};
export const revalidate = 3600;

export default function EventsPage() {
  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="min-h-screen bg-ivory px-4 pb-20 pt-36 sm:px-6 md:px-12"
    >
      <div className="mx-auto max-w-[1440px]">
        <p className="section-eyebrow">What&apos;s happening</p>
        <h1 className="mt-5 font-display text-5xl text-ink sm:text-7xl">
          WFSA Events
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink/80">
          Find opportunities to connect, celebrate, and build community across
          Washington. Browse months or select a date for event details.
        </p>
        <div className="mt-10">
          <EventsCalendar records={events} initialNow={calendarNow()} />
        </div>
      </div>
    </main>
  );
}
