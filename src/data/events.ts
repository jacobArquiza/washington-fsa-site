export type WFSAEvent = {
  id: string;
  title: string;
  /** ISO 8601 with an explicit UTC offset or Z, never a local wall-clock date. */
  startsAt: string;
  /** IANA timezone used for public date/time labels. */
  timeZone: string;
  location?: string;
  description?: string;
  image?: { src: string; alt: string };
  /** Add only a verified internal path or HTTPS destination. */
  href?: string;
};

// Only confirmed public events belong here. No sample records in production.
export const events: readonly WFSAEvent[] = [];

export function getUpcomingEvents(
  records: readonly WFSAEvent[] = events,
  now: number = Date.now(),
): WFSAEvent[] {
  return records
    .filter((event) => {
      const timestamp = Date.parse(event.startsAt);
      if (
        !/(Z|[+-]\d{2}:\d{2})$/.test(event.startsAt) ||
        !Number.isFinite(timestamp) ||
        timestamp < now
      )
        return false;
      try {
        new Intl.DateTimeFormat("en-US", { timeZone: event.timeZone }).format(
          timestamp,
        );
        return true;
      } catch {
        return false;
      }
    })
    .sort((a, b) => Date.parse(a.startsAt) - Date.parse(b.startsAt))
    .slice(0, 3);
}
