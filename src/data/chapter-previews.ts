export type ChapterPreview = {
  id: string;
  title: string;
  eyebrow: string;
  description?: string;
  image?: string;
  imageAlt?: string;
  organizations?: string[];
  href?: string;
};

export const chapterNetworkStats = {
  schools: "18",
  organizations: "20+",
};

// Replace the two preview placeholders as WFSA confirms more chapter details.
export const chapterPreviews: ChapterPreview[] = [
  {
    id: "across-washington",
    title: "Across Washington",
    eyebrow: "MORE CHAPTER STORIES COMING SOON",
    description:
      "We are gathering school and organization details for the full chapter directory.",
  },
  {
    id: "mariner",
    title: "Mariner Chapter",
    eyebrow: "MARINER CHAPTER | JOINED JUN 2026",
    image: "/chapters/mariner-high.jpg",
    imageAlt: "The entrance to Mariner High School in Everett, Washington",
    organizations: ["PUSO", "ASU"],
    href: "/chapters",
  },
  {
    id: "more-to-explore",
    title: "More to explore",
    eyebrow: "CHAPTER DIRECTORY IN PROGRESS",
    description:
      "More chapter spotlights will appear as their information is confirmed.",
  },
];
