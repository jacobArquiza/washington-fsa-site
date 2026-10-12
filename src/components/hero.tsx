"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type HeroProps = {
  video: string;
  subtitle: string;
  title: string;
  buttonText: string;
};

export default function Hero({
  video,
  subtitle,
  title,
  buttonText,
}: HeroProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasFailed, setHasFailed] = useState(false);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const player = videoRef.current;
    if (!player) return;
    const updatePlayback = () => {
      if (preference.matches) {
        player.pause();
        player.removeAttribute("src");
        player.querySelectorAll("source").forEach((source) => source.remove());
        player.load();
      } else {
        player.src = player.canPlayType("video/webm")
          ? `/hero/${video}.webm`
          : `/hero/${video}.mp4`;
        void player.play().catch(() => setIsPlaying(false));
      }
    };
    updatePlayback();
    preference.addEventListener("change", updatePlayback);
    return () => preference.removeEventListener("change", updatePlayback);
  }, [video]);

  return (
    <section
      aria-label="Welcome to WFSA"
      className="relative isolate h-svh min-h-[520px] overflow-hidden bg-deep-blue"
    >
      <video
        ref={videoRef}
        poster="/hero/wfsa-poster.svg"
        preload="none"
        aria-hidden="true"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onError={() => {
          setHasFailed(true);
          setIsPlaying(false);
        }}
        muted
        loop
        playsInline
        tabIndex={-1}
        disablePictureInPicture
        className="pointer-events-none absolute inset-0 h-full w-full border-0 object-cover blur-[1px]"
      >
        <source src={`/hero/${video}.webm`} type="video/webm" />
        <source src={`/hero/${video}.mp4`} type="video/mp4" />
      </video>

      <div className="absolute inset-0 z-10 flex items-center bg-black/35 px-6 pt-16 sm:px-10 md:px-12 md:pt-0">
        <div className="mx-auto w-full max-w-[1440px] min-w-0 text-white">
          <p className="mb-3 text-xs font-semibold tracking-[0.16em] uppercase sm:text-sm sm:tracking-[0.2em]">
            {subtitle}
          </p>
          <h1 className="max-w-2xl font-display text-[clamp(2.75rem,11vw,4rem)] leading-[1.05] md:text-7xl md:leading-none">
            {title}
          </h1>
          <Link
            href="/chapters"
            className="mt-6 inline-flex min-h-11 items-center rounded-full bg-cream px-7 py-3 text-base font-semibold text-ink transition-colors hover:bg-deep-blue hover:text-ivory md:mt-4"
          >
            {buttonText}
          </Link>
        </div>
      </div>
      {!hasFailed && (
        <button
          type="button"
          onClick={() => {
            const player = videoRef.current;
            if (!player) return;
            if (isPlaying) player.pause();
            else {
              if (!player.getAttribute("src"))
                player.src = `/hero/${video}.webm`;
              void player.play().catch(() => setIsPlaying(false));
            }
          }}
          className="absolute bottom-6 right-6 z-20 min-h-11 rounded-full border border-white/60 bg-deep-blue/80 px-5 text-sm text-white"
        >
          {isPlaying ? "Pause background video" : "Play background video"}
        </button>
      )}
    </section>
  );
}
