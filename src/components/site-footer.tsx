import Link from "next/link";
import Image from "next/image";

const navigation = [
  { label: "Home", href: "/" },
  { label: "Chapters", href: "/chapters" },
  { label: "Events", href: "/events" },
  { label: "Leadership", href: "/leadership" },
];

export default function SiteFooter() {
  return (
    <footer className="overflow-hidden bg-deep-blue px-4 pb-8 pt-16 text-cream sm:px-6 md:px-12 md:pt-24">
      <div className="mx-auto max-w-[1440px]">
        <div className="grid gap-10 md:grid-cols-[1.5fr_1fr] md:gap-16">
          <div>
            <h2 className="font-display text-5xl leading-none sm:text-6xl lg:text-7xl">
              Stay connected.
            </h2>
            <p className="mt-6 max-w-md text-sm leading-relaxed text-cream/85 sm:text-base">
              Rooted in Filipino heritage, the Washington Filipino Student
              Alliance connects AAPI student communities across Washington
              through culture, collaboration, and student leadership.
            </p>
          </div>
          <nav
            aria-label="Footer navigation"
            className="grid grid-cols-2 content-start gap-x-6 gap-y-2 md:pt-2"
          >
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex min-h-11 items-center text-sm underline-offset-4 hover:underline"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <p
          aria-hidden="true"
          className="mt-10 select-none whitespace-nowrap font-display text-[clamp(2.75rem,8vw,3.5rem)] leading-none md:text-[clamp(5rem,6.5vw,6rem)] tracking-[-0.055em]"
        >
          WFSA
        </p>
        <div className="mt-8 flex flex-col gap-6 border-t border-cream/25 pt-7 text-xs leading-relaxed sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <span className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-ivory">
              <Image
                src="/branding/wfsa-logo.png"
                alt=""
                width={60}
                height={60}
                className="object-contain"
              />
            </span>
            <div>
              <p>Washington Filipino Student Alliance</p>
              <p className="mt-1 text-cream/75">
                © {new Date().getFullYear()} WFSA. All rights reserved.
              </p>
            </div>
          </div>
          <a
            href="#top"
            data-scroll-top
            className="inline-flex min-h-11 w-fit items-center gap-3 rounded-full border border-cream/40 px-5 text-sm transition-colors hover:bg-cream hover:text-deep-blue"
          >
            Back to top <span aria-hidden="true">↑</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
