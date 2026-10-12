import Link from "next/link";
import OrganizationChart from "@/components/organization-chart";

export default function LeadershipOverview() {
  return (
    <section
      id="leadership"
      aria-labelledby="leadership-title"
      className="relative isolate overflow-hidden bg-dark-cream px-4 py-16 sm:px-6 md:px-12 md:py-24"
    >
      <div className="mx-auto grid max-w-[1440px] items-start gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        <div className="relative z-10">
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
            See how student leadership connects our statewide alliance, campus
            chapters, and Filipino communities across Washington.
          </p>
          <Link href="/leadership" className="pill-link mt-8">
            About WFSA leadership <span aria-hidden="true">↗</span>
          </Link>
        </div>
        <div className="leadership-motif-anchor min-w-0">
          <span aria-hidden="true" className="section-motif leadership-motif" />
          <div className="relative z-10">
            <OrganizationChart />
          </div>
        </div>
      </div>
    </section>
  );
}
