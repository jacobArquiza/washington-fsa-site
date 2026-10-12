export type ChapterPreview = {
  id: string;
  schoolName: string;
  clubs: readonly string[];
  /** Month precision only; no exact joining day is known. */
  joinMonth: string;
  image?: string;
  imageAlt?: string;
  description?: string;
  href?: string;
};

// Founder-supplied inventory: Mariner first, then alphabetical by school.
// Shorecrest FASA / SC FSU is one affiliation; see docs/chapters-content.md.
export const chapterPreviews: readonly ChapterPreview[] = [
  {
    id: "mariner",
    schoolName: "Mariner",
    clubs: ["PUSO", "ASU", "PI Club"],
    joinMonth: "2026-06",
    image: "/chapters/mariner-high.jpg",
    imageAlt: "The entrance to Mariner High School in Everett, Washington",
  },
  {
    id: "archbishop-murphy",
    schoolName: "Archbishop Murphy",
    clubs: ["API"],
    joinMonth: "2026-06",
  },
  {
    id: "bishop-blanchet",
    schoolName: "Bishop Blanchet",
    clubs: ["AAPISU"],
    joinMonth: "2026-06",
  },
  {
    id: "bothell",
    schoolName: "Bothell",
    clubs: [],
    joinMonth: "2026-06",
  },
  {
    id: "edmonds-woodway",
    schoolName: "Edmonds-Woodway",
    clubs: ["ASU"],
    joinMonth: "2026-06",
  },
  {
    id: "everett",
    schoolName: "Everett",
    clubs: ["FSU"],
    joinMonth: "2026-06",
  },
  {
    id: "forest-ridge",
    schoolName: "Forest Ridge",
    clubs: ["AAPISU"],
    joinMonth: "2026-06",
  },
  {
    id: "hazen",
    schoolName: "Hazen",
    clubs: [],
    joinMonth: "2026-06",
  },
  {
    id: "inglemoor",
    schoolName: "Inglemoor",
    clubs: ["AAPI", "FASA"],
    joinMonth: "2026-06",
  },
  {
    id: "interlake",
    schoolName: "Interlake",
    clubs: ["FASA"],
    joinMonth: "2026-06",
  },
  {
    id: "juanita",
    schoolName: "Juanita",
    clubs: ["Vietnamese Club"],
    joinMonth: "2026-06",
  },
  {
    id: "kamiak",
    schoolName: "Kamiak",
    clubs: ["FSU"],
    joinMonth: "2026-06",
  },
  {
    id: "kennedy-catholic",
    schoolName: "Kennedy Catholic",
    clubs: [],
    joinMonth: "2026-06",
  },
  {
    id: "lynnwood",
    schoolName: "Lynnwood",
    clubs: ["ASU"],
    joinMonth: "2026-06",
  },
  {
    id: "meadowdale",
    schoolName: "Meadowdale",
    clubs: ["FASA", "ASU"],
    joinMonth: "2026-06",
  },
  {
    id: "mountlake-terrace",
    schoolName: "Mountlake Terrace",
    clubs: ["FASA", "ASU"],
    joinMonth: "2026-06",
  },
  {
    id: "odea",
    schoolName: "O'Dea",
    clubs: [],
    joinMonth: "2026-06",
  },
  {
    id: "sammamish",
    schoolName: "Sammamish",
    clubs: ["Filipino Club"],
    joinMonth: "2026-06",
  },
  {
    id: "seattle-prep",
    schoolName: "Seattle Prep",
    clubs: ["APIC"],
    joinMonth: "2026-06",
  },
  {
    id: "shorecrest",
    schoolName: "Shorecrest",
    clubs: ["FASA"],
    joinMonth: "2026-06",
  },
  {
    id: "shoreline-community-college",
    schoolName: "Shoreline Community College",
    clubs: ["FASA"],
    joinMonth: "2026-06",
  },
];

export const knownAffiliationCount = chapterPreviews.reduce(
  (total, school) => total + new Set(school.clubs).size,
  0,
);

export const chapterNetworkStats = {
  schools: chapterPreviews.length,
  // A lower bound: four schools have not supplied their club names.
  organizations: `${knownAffiliationCount}+`,
};

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
export function formatJoinMonth(value: string): string {
  if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(value))
    throw new RangeError("Invalid join month");
  const [year, month] = value.split("-");
  return `${monthNames[Number(month) - 1]} ${year}`;
}
