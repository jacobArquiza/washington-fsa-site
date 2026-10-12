"use client";

import Lenis from "lenis";
import { useEffect } from "react";

export default function SmoothScroll() {
  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let lenis: Lenis | undefined;
    const updateScrolling = () => {
      lenis?.destroy();
      lenis = undefined;
      if (preference.matches) return;
      try {
        lenis = new Lenis({
          autoRaf: true,
          allowNestedScroll: true,
          duration: 1.1,
          smoothWheel: true,
        });
      } catch {
        // Back-to-top can still use native smooth scrolling.
      }
    };
    const handleBackToTop = (event: MouseEvent) => {
      const target = event.target;
      if (
        !(target instanceof Element) ||
        !target.closest("a[data-scroll-top]") ||
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      )
        return;
      event.preventDefault();
      const focusStart = () =>
        document.getElementById("main-content")?.focus({ preventScroll: true });
      if (preference.matches) {
        window.scrollTo({ top: 0, behavior: "instant" });
        focusStart();
      } else if (lenis) {
        lenis.scrollTo(0, { onComplete: focusStart });
      } else {
        // Native fallback only when the shared controller is unavailable.
        window.scrollTo({ top: 0, behavior: "smooth" });
        focusStart();
      }
    };
    updateScrolling();
    document.addEventListener("click", handleBackToTop);
    preference.addEventListener("change", updateScrolling);
    return () => {
      lenis?.destroy();
      document.removeEventListener("click", handleBackToTop);
      preference.removeEventListener("change", updateScrolling);
    };
  }, []);

  return null;
}
