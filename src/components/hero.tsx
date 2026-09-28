import Link from "next/link";

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
  return (
    <section className="relative isolate h-svh min-h-[520px] overflow-hidden bg-black md:h-auto md:min-h-0 md:max-h-dvh">
      <video
        autoPlay
        muted
        loop
        playsInline
        tabIndex={-1}
        disablePictureInPicture
        className="pointer-events-none absolute inset-0 h-full w-full scale-[1.01] border-0 object-cover blur-[1px] md:relative md:h-auto md:max-h-dvh"
      >
        <source src={`/hero/${video}.webm`} type="video/webm" />
        <source src={`/hero/${video}.mp4`} type="video/mp4" />
      </video>

      <div className="absolute inset-0 z-10 flex items-center bg-black/20 px-6 pt-16 sm:px-10 md:ml-12 md:bg-transparent md:px-12 md:pt-0">
        <div className="max-w-2xl min-w-0 text-white">
          <p className="mb-3 text-xs font-semibold tracking-[0.16em] uppercase sm:text-sm sm:tracking-[0.2em]">
            {subtitle}
          </p>
          <h1 className="font-display text-[clamp(2.75rem,11vw,4rem)] leading-[1.05] md:text-7xl md:leading-none">
            {title}
          </h1>
          <button className="mt-6 min-h-11 rounded-full bg-cream px-7 py-3 text-base font-semibold text-ink transition hover:bg-deep-blue hover:text-ivory md:mt-4">
            <Link href="/chapters">{buttonText}</Link>
          </button>
        </div>
      </div>
    </section>
  );
}
