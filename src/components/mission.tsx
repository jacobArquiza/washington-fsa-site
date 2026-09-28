"use client";

import { useState } from "react";
import MissionCard from "@/components/mission-card";
import { UsersIcon } from "@heroicons/react/24/solid";
import * as Accordion from "@radix-ui/react-accordion";
import { MotionConfig } from "motion/react";

type MissionPillar = {
  title: string;
  description: string;
};

const missionPillars: MissionPillar[] = [
  {
    title: "Build community",
    description:
      "Create a welcoming statewide network where Filipino students can find belonging, support, and people who feel like home.",
  },
  {
    title: "Strengthen connection",
    description:
      "Bring chapters together through shared experiences, collaboration, and opportunities to learn from one another.",
  },
  {
    title: "Celebrate culture",
    description:
      "Honor Filipino stories, traditions, and identities while making space for every student to express their own.",
  },
  {
    title: "Grow future leaders",
    description:
      "Equip students with the confidence, relationships, and skills to lead both on campus and beyond graduation.",
  },
];

export default function Mission() {
  const [activePillar, setActivePillar] = useState("mission-0");

  return (
    <section
      id="mission"
      aria-labelledby="mission-title"
      className="relative isolate min-h-screen overflow-hidden bg-cream px-4 py-16 sm:px-6 md:px-12"
    >
      <div className="mx-auto grid w-full max-w-[1840px] items-start gap-8 md:gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)] lg:gap-[7vw]">
        <div className="min-w-0">
          <h2
            id="mission-title"
            className="font-display text-4xl text-ink sm:text-5xl lg:text-7xl"
          >
            WFSA Mission
          </h2>

          <MotionConfig
            reducedMotion="user"
            transition={{ type: "spring", bounce: 0.18, duration: 0.45 }}
          >
            <Accordion.Root
              type="single"
              value={activePillar}
              onValueChange={(value) => value && setActivePillar(value)}
              className="mt-8 space-y-1 lg:mt-10"
            >
              {missionPillars.map((pillar, index) => {
                const value = `mission-${index}`;

                return (
                  <MissionCard
                    key={pillar.title}
                    {...pillar}
                    value={value}
                    icon={<UsersIcon className="size-6 shrink-0" />}
                    isActive={activePillar === value}
                  />
                );
              })}
            </Accordion.Root>
          </MotionConfig>
        </div>

        <div
          aria-label="Mission photo gallery"
          className="aspect-[0.97] min-w-0 overflow-hidden rounded-xl bg-ivory shadow-sm ring-1 ring-ink/10"
        />
      </div>
    </section>
  );
}
