import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import type { ChapterPreview } from "@/data/chapter-previews";

export default function ChapterPreviewCard({
  chapter,
}: {
  chapter: ChapterPreview;
}) {
  return (
    <Card className="h-full gap-0 rounded-2xl border-0 bg-cream p-1.5 text-ink shadow-none">
      <div className="relative aspect-[1.5] overflow-hidden rounded-xl bg-[#d7dfe7]">
        {chapter.image ? (
          <Image
            src={chapter.image}
            alt={chapter.imageAlt ?? ""}
            fill
            sizes="(max-width: 640px) 85vw, (max-width: 1024px) 55vw, 38vw"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-end bg-gradient-to-br from-[#a9c6d7] via-[#d7e5e6] to-[#91aab6] p-5">
            <span className="font-display text-5xl text-deep-blue/70 sm:text-6xl">
              WFSA
            </span>
          </div>
        )}
      </div>
      <CardContent className="flex flex-1 flex-col px-2 pb-3 pt-3 sm:px-3">
        <div className="flex items-start justify-between gap-2">
          <p className="text-[10px] font-bold tracking-wide sm:text-xs">
            {chapter.eyebrow}
          </p>
          {chapter.href && (
            <Link
              href={chapter.href}
              className="shrink-0 rounded-full border border-ink px-2.5 py-0.5 text-[10px] transition-colors hover:bg-ink hover:text-cream focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-deep-blue sm:text-xs"
            >
              Learn More
            </Link>
          )}
        </div>
        <h3 className="mt-1 font-display text-2xl font-semibold leading-tight sm:text-3xl">
          {chapter.title}
        </h3>
        {chapter.organizations ? (
          <div className="mt-3 text-sm leading-snug">
            <p className="font-semibold">Participating Organizations:</p>
            <ul className="mt-1 space-y-1">
              {chapter.organizations.map((organization) => (
                <li key={organization}>{organization}</li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="mt-3 text-sm leading-snug">{chapter.description}</p>
        )}
      </CardContent>
    </Card>
  );
}
