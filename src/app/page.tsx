import Hero from "@/components/hero";
import Mission from "@/components/mission";
import ChaptersOverview from "@/components/chapters-overview";

import EventsOverview from "@/components/events-overview";
import LeadershipOverview from "@/components/leadership-overview";

// Refresh upcoming previews so past events leave the list without a rebuild.
export const revalidate = 3600;

export default function Home() {
  return (
    <main id="main-content" tabIndex={-1}>
      <Hero
        video="jerico_wfsa_smallvid_1"
        subtitle="Washington Filipino Student Alliance"
        title="Connecting WA through community"
        buttonText="Find Your Chapter"
      />
      <Mission />
      <ChaptersOverview />
      <EventsOverview />
      <LeadershipOverview />
    </main>
  );
}
