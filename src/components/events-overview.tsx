import Image from "next/image";
import Link from "next/link";
import { getUpcomingEvents } from "@/data/events";

export default function EventsOverview() {
  const upcoming = getUpcomingEvents();
  const featuredImage = upcoming.find((event) => event.image)?.image;

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
        <div className="mt-10 grid items-center gap-10 lg:mt-14 lg:grid-cols-[1.15fr_1fr] lg:gap-20">
          {featuredImage ? (
            <div className="relative aspect-[5/4] overflow-hidden rounded-2xl">
              <Image
                src={featuredImage.src}
                alt={featuredImage.alt}
                fill
                sizes="(max-width: 1023px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          ) : (
            <div className="flex aspect-[5/4] flex-col justify-between rounded-2xl bg-dark-cream p-8 sm:p-12">
              <p className="section-eyebrow text-red">
                Connect · Celebrate · Collaborate
              </p>
              <p className="my-12 font-display text-5xl leading-none text-deep-blue sm:text-7xl">
                Shared roots.
                <br />
                <span className="italic text-red">New memories.</span>
              </p>
              <div className="flex items-center justify-between border-t border-ink/20 pt-6 text-xs font-semibold uppercase tracking-widest">
                <span>Across Washington</span>
                <span aria-hidden="true" className="text-3xl text-red">
                  ✳
                </span>
              </div>
            </div>
          )}
          <div className="min-w-0">
            {upcoming.length ? (
              <ol className="border-t border-ink/20">
                {upcoming.map((event) => (
                  <li key={event.id} className="border-b border-ink/20 py-7">
                    <time
                      dateTime={event.startsAt}
                      className="text-sm font-semibold text-deep-blue"
                    >
                      {new Intl.DateTimeFormat("en-US", {
                        timeZone: event.timeZone,
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                        timeZoneName: "short",
                      }).format(new Date(event.startsAt))}
                    </time>
                    <h3 className="mt-3 break-words font-display text-3xl sm:text-4xl">
                      {event.title}
                    </h3>
                    {event.location && (
                      <p className="mt-2 text-sm text-ink/80">
                        {event.location}
                      </p>
                    )}
                    {event.description && (
                      <p className="mt-3 leading-relaxed text-ink/80">
                        {event.description}
                      </p>
                    )}
                    {event.href && (
                      <Link
                        href={event.href}
                        className="mt-4 inline-flex min-h-11 items-center text-sm font-semibold underline underline-offset-4"
                      >
                        Details for {event.title}{" "}
                        <span aria-hidden="true" className="ml-2">
                          ↗
                        </span>
                      </Link>
                    )}
                  </li>
                ))}
              </ol>
            ) : (
              <div className="border-y border-ink/20 py-10 sm:py-14">
                <p className="section-eyebrow text-deep-blue">
                  Our next chapter
                </p>
                <h3 className="mt-5 font-display text-3xl leading-tight sm:text-4xl">
                  New events are on the way.
                </h3>
                <p className="mt-5 max-w-md leading-relaxed text-ink/80">
                  Stay tuned for upcoming opportunities to connect, celebrate,
                  and build community across WFSA.
                </p>
              </div>
            )}
            <Link href="/events" className="pill-link mt-7">
              About future events <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
