"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import ChapterPreviewCard from "@/components/chapter-preview-card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { chapterNetworkStats, chapterPreviews } from "@/data/chapter-previews";

// Repeat the small preview set so Embla can keep the same two-card framing.
const carouselChapters = [
  ...chapterPreviews,
  ...chapterPreviews,
  ...chapterPreviews,
];

export default function ChaptersOverview() {
  const [api, setApi] = useState<CarouselApi>();
  const [activeIndex, setActiveIndex] = useState(5);

  useEffect(() => {
    if (!api) return;

    const updateActiveIndex = () => setActiveIndex(api.selectedScrollSnap());
    updateActiveIndex();
    api.on("select", updateActiveIndex);
    api.on("reInit", updateActiveIndex);

    return () => {
      api.off("select", updateActiveIndex);
      api.off("reInit", updateActiveIndex);
    };
  }, [api]);

  useEffect(() => {
    if (!api) return;

    const viewport = api
      .rootNode()
      .querySelector<HTMLElement>('[data-slot="carousel-content"]');
    if (!viewport) return;

    const slides = api.slideNodes();
    let resetFrame: number | undefined;

    const updateTransition = () => {
      if (resetFrame !== undefined) {
        cancelAnimationFrame(resetFrame);
        resetFrame = undefined;
      }

      const viewportRect = viewport.getBoundingClientRect();

      slides.forEach((slide) => {
        const slideRect = slide.getBoundingClientRect();
        const visibleWidth = Math.max(
          0,
          Math.min(slideRect.right, viewportRect.right) -
            Math.max(slideRect.left, viewportRect.left),
        );
        const visibleRatio = slideRect.width
          ? visibleWidth / slideRect.width
          : 1;
        const transitionAmount = 1 - visibleRatio;

        slide.style.transition = "none";
        slide.style.filter = `blur(${transitionAmount * 3}px)`;
        slide.style.opacity = `${1 - transitionAmount * 0.3}`;
      });
    };

    const clearTransition = () => {
      slides.forEach((slide) => {
        slide.style.transition = "none";
        slide.style.filter = "none";
        slide.style.opacity = "1";
      });

      resetFrame = requestAnimationFrame(() => {
        slides.forEach((slide) => {
          slide.style.removeProperty("transition");
          slide.style.removeProperty("filter");
          slide.style.removeProperty("opacity");
        });
        resetFrame = undefined;
      });
    };

    api.on("scroll", updateTransition);
    api.on("settle", clearTransition);
    api.on("reInit", clearTransition);

    return () => {
      api.off("scroll", updateTransition);
      api.off("settle", clearTransition);
      api.off("reInit", clearTransition);
      if (resetFrame !== undefined) cancelAnimationFrame(resetFrame);
      slides.forEach((slide) => {
        slide.style.removeProperty("transition");
        slide.style.removeProperty("filter");
        slide.style.removeProperty("opacity");
      });
    };
  }, [api]);

  return (
    <section
      id="chapters"
      aria-labelledby="chapters-title"
      className="overflow-x-clip bg-[#2050ad] px-4 py-16 text-white sm:px-6 md:px-12 md:py-24"
    >
      <div className="mx-auto grid w-full max-w-[1440px] items-start gap-10 md:grid-cols-[minmax(0,1.65fr)_minmax(240px,0.85fr)] md:gap-5 lg:gap-10">
        <div className="min-w-0 md:order-2">
          <h2
            id="chapters-title"
            className="font-display text-4xl leading-[0.95] sm:text-5xl lg:text-6xl"
          >
            {chapterNetworkStats.schools} schools.
            <br />
            {chapterNetworkStats.organizations} organizations.
          </h2>
          <p className="mt-6 max-w-sm text-sm leading-snug sm:text-base">
            Our chapters connect Filipino student communities across Washington.
            Explore the schools and organizations that make up our statewide
            network.
          </p>
          <Link
            href="/chapters"
            className="mt-7 inline-flex min-h-11 items-center justify-center rounded-full bg-cream px-7 text-sm font-semibold text-ink transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          >
            Explore Chapters
          </Link>
        </div>

        <Carousel
          setApi={setApi}
          opts={{ align: "end", startIndex: 5, loop: true }}
          aria-label="Chapter previews"
          className="chapters-carousel-bleed min-w-0 md:order-1"
        >
          <CarouselContent className="ml-0 items-stretch md:-ml-4">
            {carouselChapters.map((chapter, index) => (
              <CarouselItem
                key={`${chapter.id}-${index}`}
                className="basis-full pl-0 transition-[filter,opacity] duration-500 ease-out motion-reduce:transition-none md:basis-[68%] md:pl-4 lg:basis-[43%]"
              >
                <div className="mx-auto h-full w-[calc(100%-1rem)] md:w-full">
                  <ChapterPreviewCard chapter={chapter} />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="mt-4 flex items-center justify-center gap-3">
            <CarouselPrevious className="static h-9 w-20 translate-none rounded-full border-2 border-white bg-transparent text-white shadow-none hover:bg-white hover:text-[#2050ad]">
              Back
            </CarouselPrevious>
            <span
              className="min-w-9 text-center text-xs font-semibold tabular-nums"
              aria-live="polite"
            >
              {(activeIndex % chapterPreviews.length) + 1}/
              {chapterPreviews.length}
            </span>
            <CarouselNext className="static h-9 w-20 translate-none rounded-full border-2 border-white bg-transparent text-white shadow-none hover:bg-white hover:text-[#2050ad]">
              Next
            </CarouselNext>
          </div>
        </Carousel>
      </div>
    </section>
  );
}
