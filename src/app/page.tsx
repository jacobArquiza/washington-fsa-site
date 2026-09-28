import Hero from "@/components/hero";
import Mission from "@/components/mission";
import ChaptersOverview from "@/components/chapters-overview";

export default function Home() {
  return (
    <main className="">
      <Hero
        video="jerico_wfsa_smallvid_1"
        subtitle="Washington Filipino Student Alliance"
        title="Connecting WA through community"
        buttonText="Find Your Chapter"
      />
      <Mission />
      <ChaptersOverview />
    </main>
  );
}
