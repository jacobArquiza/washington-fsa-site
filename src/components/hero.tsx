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
    <main className="">
      <div className="w-full overflow-hidden bg-black max-h-dvh">
        <video
          autoPlay
          muted
          loop
          playsInline
          tabIndex={-1}
          disablePictureInPicture
          className="pointer-events-none block h-auto w-full scale-[1.01] border-0 blur-[1px]"
        >
          <source src={`/hero/${video}.webm`} type="video/webm" />
          <source src={`/hero/${video}.mp4`} type="video/mp4" />
        </video>

        <div className="absolute inset-0 z-10 flex items-center ml-12 px-6 md:px-12">
          <div className="max-w-2xl text-white">
            <p className="mb-3 text-sm font-semibold tracking-[0.2em] uppercase">
              {subtitle}
            </p>
            <h1 className="font-display text-5xl leading-none md:text-7xl">
              {title}
            </h1>
            <button className="mt-4 rounded-full bg-cream px-7 py-3 text-l font-semibold text-ink transition hover:bg-deep-blue hover:text-ivory">
              {buttonText}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
