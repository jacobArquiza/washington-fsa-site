# Maintaining WFSA events

The homepage and `/events` render the same `EventsCalendar` with the same `src/data/events.ts` dataset and `src/lib/event-calendar.ts` date logic. Add approved events to the `events` array, run `npm test` and the quality checks, then publish through the normal deployment workflow. No component changes are needed.

## Event fields

| Field                     | Format / behavior                                                                   |
| ------------------------- | ----------------------------------------------------------------------------------- |
| `id`                      | Unique stable string                                                                |
| `title`                   | Confirmed public event title                                                        |
| `startDate`               | Required `YYYY-MM-DD`, in the event timezone                                        |
| `endDate`                 | Optional inclusive last date, `YYYY-MM-DD`                                          |
| `startTime`               | Optional local 24-hour `HH:mm`; omit when the time is unconfirmed                   |
| `endTime`                 | Optional local `HH:mm`; requires `startTime`. Overnight events also need `endDate`. |
| `timeZone`                | Required IANA timezone, normally `America/Los_Angeles`                              |
| `location`, `description` | Optional verified public information                                                |
| `registrationUrl`         | Optional verified HTTPS destination or internal path                                |
| `status`                  | `confirmed`, `draft`, or `cancelled`; omitted status is treated as confirmed        |

The production dataset is intentionally empty. Fixtures live only in `tests/`.

## Date and display behavior

- Calendar dates, today, and timed-event labels use Washington/Pacific time regardless of the visitor's timezone. Date-only records keep their literal calendar dates.
- Missing times display “Time to be confirmed”; a date-only record is not assumed to be an all-day event.
- Dates are validated before rendering; impossible dates, invalid times/timezones, reversed ranges, draft records, and cancelled records are omitted.
- Multi-day events mark each included date. End dates are inclusive, including a timed event ending at midnight on that date.
- Daylight-saving gaps (such as a nonexistent 02:30 during spring-forward) are invalid. A repeated fall-back hour resolves to its earlier occurrence. Confirm ambiguous times with the organizer before publication.
- Upcoming lists include ongoing multi-day events. Without a known end date/time, timed events leave the upcoming list when their start time passes. Date-only events remain through their last local calendar date.
- Events are sorted chronologically, with date-only events first on the same date. Selecting a date shows every event on it; the homepage's unselected upcoming panel shows at most three. The full Events page shows all upcoming records for the viewed month.
- Month navigation preserves the selected date, even if it is in another month. The date is shown explicitly in the details heading. “Show this month's upcoming events” returns to the viewed month's list.
- The hydrated calendar starts on the current Washington month and updates its clock every minute and on window focus, even if the server-rendered page was cached. Data edits still require deployment; hourly page regeneration does not fetch new organizational data.

## Keyboard and manual QA

Previous/next and today controls work with keyboard activation. Tab enters the date table once; arrow keys move within the visible month, Home/End move within its week, and Enter/Space select the focused date. Month controls navigate across month boundaries. Date buttons announce event counts, today, and selected state. Live announcements summarize the month and selected date.

`npm test` uses Node's test runner, React server rendering, and the existing TypeScript compiler. Fixtures verify month alignment, leap years, four/five/six rows, sorting, multiple/empty events, timezone/DST boundaries, spanning/overnight events, invalid records, statuses, rendered markers/metadata, both calendar variants, and isolated navigation/selection handlers. A separate controller test covers smooth Lenis dispatch, immediate reduced-motion behavior, native fallback, focus, and cleanup. These tests do not verify actual browser layout, focus movement, or animation.

Manual review is still needed at 375, 768, 1024, 1280, and 1440px: calendar wrapping/overflow, date/control targets, month navigation, date selection, arrow-key focus, today, empty/multiple-event details, live announcements, navbar scroll states, chart connectors, reduced motion, mobile menu, and footer scrolling. In-app browser execution is unavailable and a previous local browser launch was blocked; no macOS protections are bypassed.
