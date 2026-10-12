import Link from "next/link";
import { getApprovedOfficers } from "@/data/leadership";

export default function LeadershipOverview() {
  const roster = getApprovedOfficers();

  return (
    <section
      id="leadership"
      aria-labelledby="leadership-title"
      className="bg-dark-cream px-4 py-16 sm:px-6 md:px-12 md:py-24"
    >
      <div className="mx-auto grid max-w-[1440px] gap-12 lg:grid-cols-[1fr_1.05fr] lg:gap-24">
        <div>
          <p className="section-eyebrow">Student leadership</p>
          <h2
            id="leadership-title"
            className="mt-5 max-w-lg font-display text-4xl leading-[1.05] sm:text-5xl lg:text-7xl"
          >
            Built by students.
            <br />
            <span className="italic">For students.</span>
          </h2>
          <p className="mt-6 max-w-md leading-relaxed text-ink/80">
            Meet the student leaders helping Filipino communities connect,
            collaborate, and grow across Washington.
          </p>
          <Link href="/leadership" className="pill-link mt-8">
            About WFSA leadership <span aria-hidden="true">↗</span>
          </Link>
        </div>
        {roster.length ? (
          <ol className="border-t border-ink/20">
            {roster.map((officer) => (
              <li key={officer.id} className="border-b border-ink/20 py-7">
                <h3 className="break-words font-display text-4xl sm:text-5xl">
                  {officer.name}
                </h3>
                <p className="mt-3 text-sm font-medium text-deep-blue">
                  {officer.role}
                </p>
              </li>
            ))}
          </ol>
        ) : (
          <div className="flex flex-col justify-center border-y border-ink/20 py-10 sm:py-14">
            <p className="section-eyebrow text-red">Together, we grow</p>
            <p className="mt-8 font-display text-4xl leading-tight text-deep-blue sm:text-6xl">
              Rooted in culture.
              <br />
              Led with purpose.
              <br />
              <span className="italic">Moving together.</span>
            </p>
            <p className="mt-8 max-w-md text-sm leading-relaxed text-ink/80">
              Our student leadership connects chapters and creates space for the
              next generation to lead. Meet our officers here when the current
              roster is confirmed.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
