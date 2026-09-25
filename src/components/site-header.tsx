"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const navigation = [
  { label: "About", href: "/" },
  { label: "Chapters", href: "/chapters" },
  { label: "Events", href: "/events" },
  { label: "Leadership", href: "/leadership" },
];

export default function SiteHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <header className="sticky top-4 z-50 px-4">
      <div className="mx-auto w-[90%] max-w-[1000px]">
        <nav
          aria-label="Primary navigation"
          className="
            flex items-center justify-between
            rounded-full
            border border-white/30
            bg-white/60
            px-6 py-3
            backdrop-blur-xl
            shadow-sm
          "
        >
          <Link
            href="/"
            aria-label="WFSA home"
            className="rounded-sm font-semibold tracking-[0.18em] text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-deep-blue focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
          >
            WFSA
          </Link>

          <div className="hidden items-center gap-7 md:flex">
            {navigation.map((item) => {
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`text-sm font-medium ${
                    isActive ? "underline underline-offset-4" : ""
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}

            <Link
              href="/chapters"
              className="rounded-full bg-deep-blue px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-deep-blue focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
            >
              Explore Chapters
            </Link>
          </div>

          <button
            type="button"
            aria-expanded={isOpen}
            aria-controls="mobile-navigation"
            aria-label={
              isOpen ? "Close navigation menu" : "Open navigation menu"
            }
            onClick={() => setIsOpen((open) => !open)}
            className="flex size-10 items-center justify-center rounded-full text-ink transition-colors hover:bg-ink/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-deep-blue md:hidden"
          >
            {isOpen ? (
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                className="size-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            ) : (
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                className="size-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            )}
          </button>

          {isOpen && (
            <div
              id="mobile-navigation"
              className="absolute left-0 right-0 top-[calc(100%+0.75rem)] rounded-[28px] border border-ink/10 bg-cream p-4 shadow-lg md:hidden"
            >
              <div className="flex flex-col gap-1">
                {navigation.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="rounded-xl px-4 py-3 font-medium text-ink transition-colors hover:bg-ink/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-deep-blue"
                  >
                    {item.label}
                  </Link>
                ))}

                <Link
                  href="/#chapters"
                  onClick={() => setIsOpen(false)}
                  className="mt-2 rounded-full bg-deep-blue px-5 py-3 text-center font-semibold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-deep-blue focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
                >
                  Explore Chapters
                </Link>
              </div>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
