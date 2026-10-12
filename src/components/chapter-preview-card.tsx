import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { formatJoinMonth, type ChapterPreview } from "@/data/chapter-previews";

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
            sizes="(max-width: 767px) calc(100vw - 48px), (max-width: 1023px) 42vw, 30vw"
            loading="lazy"
            style={{ objectPosition: chapter.imagePosition ?? "center" }}
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-end bg-dark-cream p-5">
            <span className="font-display text-5xl text-deep-blue/70 sm:text-6xl">
              WFSA
            </span>
          </div>
        )}
      </div>
      <CardContent className="flex flex-1 flex-col px-2 pb-3 pt-3 sm:px-3">
        <div className="flex items-start justify-between gap-2">
          <p className="text-[10px] font-bold tracking-wide sm:text-xs">
            Joined {formatJoinMonth(chapter.joinMonth)}
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
        <h3 className="mt-1 break-words font-display text-2xl font-semibold leading-tight sm:text-3xl">
          {chapter.schoolName}
        </h3>
        {chapter.clubs.length > 0 ? (
          <div className="mt-3 text-sm leading-snug">
            <p className="font-semibold">Affiliated clubs:</p>
            <ul className="mt-1 space-y-1">
              {chapter.clubs.map((organization) => (
                <li key={organization}>{organization}</li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="mt-3 text-sm leading-snug text-ink/75">
            Club details forthcoming
          </p>
        )}
        {chapter.description && (
          <p className="mt-3 text-sm leading-snug">{chapter.description}</p>
        )}
      </CardContent>
    </Card>
  );
}
