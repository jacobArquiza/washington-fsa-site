"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

const navigation = [
  { label: "About", href: "/" },
  { label: "Chapters", href: "/chapters" },
  { label: "Events", href: "/events" },
  { label: "Leadership", href: "/leadership" },
];

export default function SiteHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrollState, setScrollState] = useState({
    pathname: "/",
    pastHero: false,
  });
  const pathname = usePathname();
  const toggleRef = useRef<HTMLButtonElement>(null);
  const lightSurface =
    pathname !== "/" ||
    (scrollState.pathname === pathname && scrollState.pastHero);
  const chapterCtaColors = lightSurface
    ? "bg-deep-blue text-white hover:opacity-90"
    : "bg-cream text-black hover:bg-deep-blue hover:text-white hover:opacity-90";

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (
        event.key === "Escape" &&
        (document
          .getElementById("mobile-navigation")
          ?.contains(document.activeElement) ||
          document.activeElement === toggleRef.current)
      ) {
        toggleRef.current?.focus();
        setIsOpen(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    function updateNavbar() {
      const mission = document.getElementById("mission");
      const hasPassedHero = mission
        ? window.scrollY >= mission.offsetTop - 80
        : true;

      setScrollState((previous) =>
        previous.pathname === pathname && previous.pastHero === hasPassedHero
          ? previous
          : { pathname, pastHero: hasPassedHero },
      );
    }

    const frameId = window.requestAnimationFrame(updateNavbar);
    window.addEventListener("scroll", updateNavbar, { passive: true });
    window.addEventListener("resize", updateNavbar);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("scroll", updateNavbar);
      window.removeEventListener("resize", updateNavbar);
    };
  }, [pathname]);

  return (
    <header className="fixed inset-x-0 top-4 z-50 px-4">
      <div className="mx-auto w-full max-w-[1000px] lg:w-[90%]">
        <nav
          aria-label="Primary navigation"
          className={`relative flex flex-wrap items-center justify-between rounded-[30px] border px-4 py-2 shadow-sm backdrop-blur-xl transition-[background-color,border-color,color] duration-300 sm:px-6 sm:py-3 lg:flex-nowrap lg:rounded-full ${
            lightSurface || isOpen
              ? "border-white/30 bg-black/70 text-white"
              : "border-white/25 bg-black/60 text-white"
          }`}
        >
          <Link
            href="/"
            aria-label="WFSA home"
            className="rounded-sm font-semibold tracking-[0.18em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-deep-blue focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
          >
            WFSA
          </Link>

          <div className="hidden items-center gap-7 lg:flex">
            {navigation.map((item) => {
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
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
              className={`rounded-full px-5 py-2.5 text-sm font-semibold transition-[background-color,color,opacity] duration-300 motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-deep-blue focus-visible:ring-offset-2 focus-visible:ring-offset-cream ${chapterCtaColors}`}
            >
              Explore Chapters
            </Link>
          </div>

          <button
            ref={toggleRef}
            id="mobile-navigation-toggle"
            type="button"
            aria-expanded={isOpen}
            aria-controls="mobile-navigation"
            aria-label={
              isOpen ? "Close navigation menu" : "Open navigation menu"
            }
            onClick={() => setIsOpen((open) => !open)}
            className="relative flex size-11 shrink-0 items-center justify-center rounded-xl border border-current/25 bg-current/5 shadow-sm transition-colors hover:bg-current/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-deep-blue motion-reduce:transition-none lg:hidden"
          >
            <span className="relative size-5">
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                className={`absolute inset-0 size-5 transition-[opacity,transform] duration-300 motion-reduce:transition-none ${
                  isOpen ? "rotate-90 opacity-0" : "rotate-0 opacity-100"
                }`}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <path d="M3 6h18M3 12h18M3 18h18" />
              </svg>
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                className={`absolute inset-0 size-5 transition-[opacity,transform] duration-300 motion-reduce:transition-none ${
                  isOpen ? "rotate-0 opacity-100" : "-rotate-90 opacity-0"
                }`}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </span>
          </button>

          <div
            id="mobile-navigation"
            role="region"
            aria-labelledby="mobile-navigation-toggle"
            aria-hidden={!isOpen}
            inert={!isOpen}
            className={`grid w-full basis-full transition-[grid-template-rows,opacity] duration-300 ease-in-out motion-reduce:transition-none lg:hidden ${
              isOpen
                ? "grid-rows-[1fr] opacity-100"
                : "grid-rows-[0fr] opacity-0"
            }`}
          >
            <div className="min-h-0 overflow-hidden">
              <div className="flex max-h-[calc(100svh-7rem)] flex-col gap-1 overflow-y-auto border-t border-current/20 pt-3 pb-2">
                {navigation.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    aria-current={pathname === item.href ? "page" : undefined}
                    onClick={() => setIsOpen(false)}
                    className="rounded-xl px-4 py-3 font-medium transition-colors hover:bg-current/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-deep-blue"
                  >
                    {item.label}
                  </Link>
                ))}

                <Link
                  href="/chapters"
                  onClick={() => setIsOpen(false)}
                  className={`mt-2 rounded-full px-5 py-3 text-center font-semibold transition-[background-color,color,opacity] duration-300 motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-deep-blue focus-visible:ring-offset-2 focus-visible:ring-offset-cream ${chapterCtaColors}`}
                >
                  Explore Chapters
                </Link>
              </div>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}
