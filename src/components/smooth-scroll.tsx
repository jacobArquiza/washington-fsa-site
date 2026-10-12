"use client";

import Lenis from "lenis";
import { useEffect } from "react";

export default function SmoothScroll() {
  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let lenis: Lenis | undefined;
    const updateScrolling = () => {
      lenis?.destroy();
      lenis = preference.matches
        ? undefined
        : new Lenis({
            autoRaf: true,
            allowNestedScroll: true,
            duration: 1.1,
            smoothWheel: true,
          });
    };
    updateScrolling();
    preference.addEventListener("change", updateScrolling);
    return () => {
      lenis?.destroy();
      preference.removeEventListener("change", updateScrolling);
    };
  }, []);

  return null;
}
