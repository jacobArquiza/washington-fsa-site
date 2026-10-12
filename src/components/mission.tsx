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
      className="relative isolate overflow-hidden bg-cream px-4 py-16 sm:px-6 md:px-12 md:py-24"
    >
      <div className="relative z-10 mx-auto grid w-full max-w-[1440px] items-start gap-8 md:gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)] lg:gap-20">
        <div className="min-w-0">
          <h2
            id="mission-title"
            className="font-display text-4xl text-ink sm:text-5xl lg:text-7xl"
          >
            WFSA Mission
          </h2>

          <div className="relative isolate mt-8 lg:mt-10">
            <div aria-hidden="true" className="mission-motif-anchor">
              <span className="section-motif mission-motif" />
            </div>
            <MotionConfig
              reducedMotion="user"
              transition={{ type: "spring", bounce: 0.18, duration: 0.45 }}
            >
              <Accordion.Root
                type="single"
                value={activePillar}
                onValueChange={(value) => value && setActivePillar(value)}
                className="relative z-10 space-y-1"
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
        </div>

        <div className="relative flex min-h-[380px] min-w-0 flex-col justify-between overflow-hidden rounded-2xl bg-deep-blue p-8 text-cream sm:p-12 lg:aspect-[0.97]">
          <span
            aria-hidden="true"
            className="absolute -right-20 -top-20 size-80 rounded-full border border-gold/40"
          />
          <span
            aria-hidden="true"
            className="absolute -right-32 -top-32 size-[26rem] rounded-full border border-gold/30"
          />
          <p className="relative text-xs font-semibold uppercase tracking-[0.2em]">
            Many chapters. One community.
          </p>
          <p className="relative my-16 max-w-sm font-display text-5xl leading-[1.05] sm:text-6xl">
            A place to belong.
            <br />
            <span className="text-gold">A space to grow.</span>
          </p>
          <p className="relative border-t border-cream/25 pt-6 text-sm">
            Washington Filipino Student Alliance
          </p>
        </div>
      </div>
    </section>
  );
}
