import type { WFSAEvent } from "../data/events";

export const WASHINGTON_TIME_ZONE = "America/Los_Angeles";
const DAY = 86_400_000;

/** Build/request timestamp for the calendar hydration snapshot. */
export function calendarNow(): number {
  return Date.now();
}

export function isValidDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T12:00:00Z`);
  return (
    Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value
  );
}

export function dateInZone(
  timestamp: number,
  timeZone = WASHINGTON_TIME_ZONE,
): string {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(timestamp);
  const get = (type: string) => parts.find((part) => part.type === type)?.value;
  return `${get("year")}-${get("month")}-${get("day")}`;
}

/** Resolve a local wall-clock time without depending on the visitor's timezone.
 * Nonexistent DST times are rejected; repeated times resolve to the earlier occurrence.
 */
export function zonedTimestamp(
  date: string,
  time: string,
  timeZone: string,
): number {
  if (!isValidDate(date) || !/^([01]\d|2[0-3]):[0-5]\d$/.test(time)) return NaN;
  const desired = Date.parse(`${date}T${time}:00Z`);
  try {
    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hourCycle: "h23",
    });
    const wallTime = (timestamp: number) => {
      const parts = formatter.formatToParts(timestamp);
      const get = (type: string) =>
        parts.find((part) => part.type === type)?.value;
      return Date.parse(
        `${get("year")}-${get("month")}-${get("day")}T${get("hour")}:${get("minute")}:${get("second")}Z`,
      );
    };
    // Offsets on both sides cover daylight-saving changes and repeated hours.
    const candidates = [-DAY, 0, DAY]
      .map((shift) => {
        const probe = desired + shift;
        return desired - (wallTime(probe) - probe);
      })
      .filter((candidate) => wallTime(candidate) === desired);
    return candidates.length ? Math.min(...candidates) : NaN;
  } catch {
    return NaN;
  }
}

export function eventDateRange(event: WFSAEvent): {
  start: string;
  end: string;
} {
  return {
    start: event.startTime
      ? dateInZone(
          zonedTimestamp(event.startDate, event.startTime, event.timeZone),
        )
      : event.startDate,
    end: event.endTime
      ? dateInZone(
          zonedTimestamp(
            event.endDate ?? event.startDate,
            event.endTime,
            event.timeZone,
          ),
        )
      : (event.endDate ??
        (event.startTime
          ? dateInZone(
              zonedTimestamp(event.startDate, event.startTime, event.timeZone),
            )
          : event.startDate)),
  };
}

export function isPublicEvent(event: WFSAEvent): boolean {
  if (
    !event.timeZone ||
    !event.id.trim() ||
    !event.title.trim() ||
    event.status === "draft" ||
    event.status === "cancelled" ||
    !isValidDate(event.startDate) ||
    (event.endDate !== undefined &&
      (!isValidDate(event.endDate) || event.endDate < event.startDate))
  )
    return false;
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: event.timeZone }).format(0);
  } catch {
    return false;
  }
  const validTime = (value: string) => /^([01]\d|2[0-3]):[0-5]\d$/.test(value);
  if (
    (event.startTime !== undefined && !validTime(event.startTime)) ||
    (event.endTime !== undefined && !validTime(event.endTime)) ||
    (event.endTime !== undefined && event.startTime === undefined)
  )
    return false;
  const start = event.startTime
    ? zonedTimestamp(event.startDate, event.startTime, event.timeZone)
    : 0;
  const end = event.endTime
    ? zonedTimestamp(
        event.endDate ?? event.startDate,
        event.endTime,
        event.timeZone,
      )
    : start;
  return Number.isFinite(start) && Number.isFinite(end) && end >= start;
}

export function sortEvents(records: readonly WFSAEvent[]): WFSAEvent[] {
  return records.filter(isPublicEvent).sort((a, b) => {
    const aDate = eventDateRange(a).start;
    const bDate = eventDateRange(b).start;
    return (
      aDate.localeCompare(bDate) ||
      (a.startTime
        ? zonedTimestamp(a.startDate, a.startTime, a.timeZone)
        : -Infinity) -
        (b.startTime
          ? zonedTimestamp(b.startDate, b.startTime, b.timeZone)
          : -Infinity) ||
      a.id.localeCompare(b.id)
    );
  });
}

export function eventsOnDate(
  records: readonly WFSAEvent[],
  date: string,
): WFSAEvent[] {
  if (!isValidDate(date)) return [];
  return sortEvents(records).filter((event) => {
    const range = eventDateRange(event);
    return range.start <= date && range.end >= date;
  });
}

export function eventsInMonth(
  records: readonly WFSAEvent[],
  month: string,
): WFSAEvent[] {
  const { lastDate } = monthGrid(month);
  return sortEvents(records).filter((event) => {
    const range = eventDateRange(event);
    return range.start <= lastDate && range.end >= `${month}-01`;
  });
}

export function upcomingEvents(
  records: readonly WFSAEvent[],
  now = Date.now(),
): WFSAEvent[] {
  return sortEvents(records).filter((event) => {
    const endDate = event.endDate ?? event.startDate;
    if (event.endTime || (!event.endDate && event.startTime))
      return (
        zonedTimestamp(
          endDate,
          event.endTime ?? event.startTime!,
          event.timeZone,
        ) >= now
      );
    return endDate >= dateInZone(now, event.timeZone);
  });
}

export function monthGrid(month: string): {
  weeks: (string | null)[][];
  lastDate: string;
} {
  if (!/^\d{4}-\d{2}$/.test(month) || !isValidDate(`${month}-01`))
    throw new RangeError("Invalid calendar month");
  const first = new Date(`${month}-01T12:00:00Z`);
  const next = new Date(first);
  next.setUTCMonth(next.getUTCMonth() + 1);
  const days = Math.round((next.getTime() - first.getTime()) / DAY);
  const offset = first.getUTCDay();
  const cells = Array.from(
    { length: Math.ceil((offset + days) / 7) * 7 },
    (_, index) => {
      const day = index - offset + 1;
      return day >= 1 && day <= days
        ? `${month}-${String(day).padStart(2, "0")}`
        : null;
    },
  );
  return {
    weeks: Array.from({ length: cells.length / 7 }, (_, index) =>
      cells.slice(index * 7, index * 7 + 7),
    ),
    lastDate: `${month}-${String(days).padStart(2, "0")}`,
  };
}

export function moveMonth(month: string, offset: number): string {
  monthGrid(month);
  const date = new Date(`${month}-01T12:00:00Z`);
  date.setUTCMonth(date.getUTCMonth() + offset);
  return date.toISOString().slice(0, 7);
}

export function formatDate(
  date: string,
  options: Intl.DateTimeFormatOptions = {
    month: "long",
    day: "numeric",
    year: "numeric",
  },
): string {
  return new Intl.DateTimeFormat("en-US", {
    ...options,
    timeZone: "UTC",
  }).format(new Date(`${date}T12:00:00Z`));
}

export function formatEventSchedule(event: WFSAEvent): string {
  const range = eventDateRange(event);
  const dateLabel =
    formatDate(range.start) +
    (range.end !== range.start ? ` – ${formatDate(range.end)}` : "");
  if (!event.startTime) return `${dateLabel} · Time to be confirmed`;
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: WASHINGTON_TIME_ZONE,
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  });
  return `${dateLabel} · ${formatter.format(zonedTimestamp(event.startDate, event.startTime, event.timeZone))}${event.endTime ? ` – ${formatter.format(zonedTimestamp(event.endDate ?? event.startDate, event.endTime, event.timeZone))}` : ""}`;
}
