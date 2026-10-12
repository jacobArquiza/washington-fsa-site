"use client";

import Link from "next/link";
import { useId, useRef, useState, useSyncExternalStore } from "react";
import type { WFSAEvent } from "@/data/events";
import {
  dateInZone,
  eventDateRange,
  eventsInMonth,
  eventsOnDate,
  formatDate,
  formatEventSchedule,
  monthGrid,
  moveMonth,
  upcomingEvents,
} from "@/lib/event-calendar";

const weekdays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
function subscribeClock(update: () => void) {
  const timer = window.setInterval(update, 60_000);
  window.addEventListener("focus", update);
  return () => {
    window.clearInterval(timer);
    window.removeEventListener("focus", update);
  };
}

export default function EventsCalendar({
  records,
  initialNow,
  compact = false,
}: {
  records: readonly WFSAEvent[];
  initialNow: number;
  compact?: boolean;
}) {
  const now = useSyncExternalStore(
    subscribeClock,
    () => Math.floor(Date.now() / 60_000) * 60_000,
    () => initialNow,
  );
  const today = dateInZone(now);
  const [viewMonth, setViewMonth] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [focusedDate, setFocusedDate] = useState<string | null>(null);
  const tableRef = useRef<HTMLTableElement>(null);
  const id = useId();
  const PanelHeading = compact ? "h3" : "h2";
  const EventHeading = compact ? "h4" : "h3";
  const month = viewMonth ?? today.slice(0, 7);
  const { weeks } = monthGrid(month);
  const monthLabel = formatDate(`${month}-01`, {
    month: "long",
    year: "numeric",
  });
  const inMonth = eventsInMonth(records, month);
  const dateRanges = inMonth.map(eventDateRange);
  const selectedEvents = selectedDate
    ? eventsOnDate(records, selectedDate)
    : [];
  const relevant = selectedDate ? selectedEvents : upcomingEvents(inMonth, now);
  const visible = compact && !selectedDate ? relevant.slice(0, 3) : relevant;
  const tabDate =
    [focusedDate, selectedDate, today].find((date) =>
      date?.startsWith(month),
    ) ?? `${month}-01`;

  return (
    <div className="events-calendar grid min-w-0 gap-8 rounded-2xl border border-deep-blue/15 bg-cream p-2 sm:p-6 lg:grid-cols-[minmax(0,1.65fr)_minmax(0,1fr)] lg:gap-10 lg:p-8">
      <div className="min-w-0">
        <div className="flex items-center justify-between gap-2">
          <PanelHeading
            id={`${id}-month`}
            className="font-display text-2xl leading-tight sm:text-4xl"
          >
            {monthLabel}
          </PanelHeading>
          <div className="flex shrink-0 gap-1 sm:gap-2">
            <button
              type="button"
              aria-label={`Previous month, ${formatDate(`${moveMonth(month, -1)}-01`, { month: "long", year: "numeric" })}`}
              onClick={() => setViewMonth(moveMonth(month, -1))}
              className="flex size-11 items-center justify-center rounded-full border border-deep-blue/30 text-deep-blue hover:bg-deep-blue hover:text-cream"
            >
              <span aria-hidden="true">←</span>
            </button>
            <button
              type="button"
              aria-label={`Next month, ${formatDate(`${moveMonth(month, 1)}-01`, { month: "long", year: "numeric" })}`}
              onClick={() => setViewMonth(moveMonth(month, 1))}
              className="flex size-11 items-center justify-center rounded-full border border-deep-blue/30 text-deep-blue hover:bg-deep-blue hover:text-cream"
            >
              <span aria-hidden="true">→</span>
            </button>
          </div>
        </div>
        <p className="mt-3 text-xs leading-relaxed text-ink/75">
          Washington dates · Times shown in Pacific time
        </p>
        <table
          ref={tableRef}
          aria-labelledby={`${id}-month`}
          className="mt-5 w-full table-fixed border-collapse text-center"
          onKeyDown={(event) => {
            const target = event.target;
            if (!(target instanceof HTMLButtonElement) || !target.dataset.date)
              return;
            const date = new Date(`${target.dataset.date}T12:00:00Z`);
            const offsets: Record<string, number> = {
              ArrowLeft: -1,
              ArrowRight: 1,
              ArrowUp: -7,
              ArrowDown: 7,
              Home: -date.getUTCDay(),
              End: 6 - date.getUTCDay(),
            };
            if (!(event.key in offsets)) return;
            event.preventDefault();
            date.setUTCDate(date.getUTCDate() + offsets[event.key]);
            tableRef.current
              ?.querySelector<HTMLButtonElement>(
                `button[data-date="${date.toISOString().slice(0, 10)}"]`,
              )
              ?.focus();
          }}
        >
          <thead>
            <tr>
              {weekdays.map((day) => (
                <th
                  key={day}
                  scope="col"
                  className="pb-3 text-[11px] font-semibold text-deep-blue sm:text-xs"
                >
                  <abbr title={day} className="no-underline">
                    {day.slice(0, 3)}
                  </abbr>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {weeks.map((week, index) => (
              <tr key={index}>
                {week.map((date, column) => {
                  if (!date) return <td key={`empty-${column}`} />;
                  const count = dateRanges.filter(
                    (range) => range.start <= date && range.end >= date,
                  ).length;
                  const selected = date === selectedDate;
                  return (
                    <td key={date} className="p-0.5 sm:p-1">
                      <button
                        type="button"
                        data-date={date}
                        tabIndex={date === tabDate ? 0 : -1}
                        onFocus={() => setFocusedDate(date)}
                        onClick={() => setSelectedDate(date)}
                        aria-pressed={selected}
                        aria-current={date === today ? "date" : undefined}
                        aria-label={`${formatDate(date, { weekday: "long", month: "long", day: "numeric", year: "numeric" })}${date === today ? ", today" : ""}, ${count ? `${count} ${count === 1 ? "event" : "events"}` : "no events"}`}
                        className={`calendar-date relative flex min-h-11 w-full flex-col items-center justify-center rounded-lg border text-sm sm:min-h-14 ${selected ? "border-deep-blue bg-deep-blue font-semibold text-cream" : date === today ? "border-red bg-ivory font-semibold text-ink" : "border-transparent text-ink hover:bg-dark-cream"}`}
                      >
                        <span>{Number(date.slice(-2))}</span>
                        {count > 0 && (
                          <span
                            aria-hidden="true"
                            className={`absolute bottom-1 size-1.5 rounded-full ${selected ? "bg-gold" : "bg-deep-blue"}`}
                          />
                        )}
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-1 border-t border-ink/15 pt-3 text-xs text-ink/75">
          <span className="inline-flex items-center gap-2">
            <span
              aria-hidden="true"
              className="size-2 rounded-full bg-deep-blue"
            />
            Event scheduled
          </span>
          <span className="inline-flex items-center gap-2">
            <span
              aria-hidden="true"
              className="size-3 rounded border border-red"
            />
            Today
          </span>
          <button
            type="button"
            onClick={() => {
              setViewMonth(today.slice(0, 7));
              setSelectedDate(today);
            }}
            className="min-h-11 font-semibold underline underline-offset-4"
          >
            Go to today
          </button>
        </div>
      </div>
      <div className="min-w-0 border-t border-ink/15 pt-6 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
        <p className="section-eyebrow text-deep-blue">
          {selectedDate ? "Selected date" : "Coming together"}
        </p>
        <PanelHeading className="mt-3 font-display text-3xl leading-tight">
          {selectedDate ? formatDate(selectedDate) : "Upcoming this month"}
        </PanelHeading>
        <p
          role="status"
          aria-live="polite"
          aria-atomic="true"
          className="sr-only"
        >
          {monthLabel}.{" "}
          {selectedDate
            ? `${formatDate(selectedDate)}: ${selectedEvents.length} events.`
            : `${inMonth.length} events scheduled this month.`}
        </p>
        {selectedDate && (
          <button
            type="button"
            onClick={() => setSelectedDate(null)}
            className="mt-2 min-h-11 text-sm font-semibold underline underline-offset-4"
          >
            Show this month&apos;s upcoming events
          </button>
        )}
        {visible.length ? (
          <ol className="mt-4 divide-y divide-ink/15">
            {visible.map((event) => (
              <li key={event.id} className="py-5">
                <EventHeading className="break-words font-display text-2xl leading-tight">
                  {event.title}
                </EventHeading>
                <p className="mt-2 text-xs font-semibold leading-relaxed text-deep-blue">
                  {formatEventSchedule(event)}
                </p>
                {event.location && (
                  <p className="mt-3 break-words text-sm text-ink/80">
                    {event.location}
                  </p>
                )}
                {event.description && (
                  <p className="mt-3 break-words text-sm leading-relaxed text-ink/80">
                    {event.description}
                  </p>
                )}
                {event.registrationUrl &&
                  /^(https:\/\/|\/(?!\/))/.test(event.registrationUrl) && (
                    <Link
                      href={event.registrationUrl}
                      className="mt-3 inline-flex min-h-11 items-center text-sm font-semibold underline underline-offset-4"
                    >
                      Details and registration for {event.title}{" "}
                      <span aria-hidden="true" className="ml-2">
                        ↗
                      </span>
                    </Link>
                  )}
              </li>
            ))}
          </ol>
        ) : (
          <div className="mt-6 border-y border-ink/15 py-8">
            <p className="font-display text-2xl">
              {selectedDate
                ? "No events scheduled for this date."
                : inMonth.length
                  ? "No upcoming events this month."
                  : "No events scheduled this month."}
            </p>
            <p className="mt-4 text-sm leading-relaxed text-ink/75">
              Upcoming WFSA events will appear here as dates are confirmed.
            </p>
          </div>
        )}
        {compact && !selectedDate && relevant.length > 3 && (
          <p className="mt-4 text-sm text-ink/75">
            Select a date to see all its events, or explore the full calendar.
          </p>
        )}
      </div>
    </div>
  );
}
