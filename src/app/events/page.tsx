export default function Home() {
  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="min-h-screen bg-cream px-4 pb-20 pt-36 sm:px-6 md:px-12"
    >
      <div className="mx-auto max-w-[1440px]">
        <h1 className="font-display text-5xl text-ink sm:text-7xl">Events</h1>
        <p className="mt-6 max-w-xl text-lg text-ink/80">
          New events are on the way. Confirmed dates and details will appear
          here when they are ready. Stay tuned for opportunities to connect,
          celebrate, and build community across WFSA.
        </p>
      </div>
    </main>
  );
}
