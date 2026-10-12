"use client";

import Link from "next/link";
import { Pause, Play } from "lucide-react";
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
      id="hero"
      aria-label="Welcome to WFSA"
      className="relative isolate h-svh min-h-[520px] overflow-hidden bg-deep-blue bg-[url(/hero/wfsa-poster.svg)] bg-cover bg-center"
    >
      <video
        ref={videoRef}
        poster="/hero/wfsa-poster.svg"
        preload="none"
        aria-hidden="true"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEmptied={() => setIsPlaying(false)}
        onError={() => {
          setHasFailed(true);
          setIsPlaying(false);
        }}
        muted
        loop
        playsInline
        tabIndex={-1}
        disablePictureInPicture
        className={`pointer-events-none absolute inset-0 h-full w-full border-0 object-cover blur-[1px] ${hasFailed ? "hidden" : ""}`}
      />

      <div className="absolute inset-0 z-10 flex items-center bg-black/20 px-6 pt-16 sm:px-10 md:ml-12 md:bg-transparent md:px-12 md:pt-0">
        <div className="w-full max-w-2xl min-w-0 text-white">
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
          aria-label={
            isPlaying ? "Pause background video" : "Play background video"
          }
          onClick={() => {
            const player = videoRef.current;
            if (!player) return;
            if (!player.paused) player.pause();
            else {
              if (!player.getAttribute("src"))
                player.src = player.canPlayType("video/webm")
                  ? `/hero/${video}.webm`
                  : `/hero/${video}.mp4`;
              void player.play().catch(() => setIsPlaying(false));
            }
          }}
          className="absolute bottom-6 right-6 z-20 flex size-11 items-center justify-center rounded-full bg-black/45 text-white backdrop-blur-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
        >
          {isPlaying ? (
            <Pause aria-hidden="true" className="size-5" />
          ) : (
            <Play aria-hidden="true" className="size-5" />
          )}
        </button>
      )}
    </section>
  );
}
