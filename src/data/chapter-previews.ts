export type ChapterPreview = {
  id: string;
  schoolName: string;
  clubs: readonly string[];
  /** Month precision only; no exact joining day is known. */
  joinMonth: string;
  image?: string;
  imageAlt?: string;
  /** CSS object-position, for verified individual crop adjustments. */
  imagePosition?: string;
  description?: string;
  href?: string;
};

// Founder-supplied inventory: Mariner first, then alphabetical by school.
// Shorecrest FASA / SC FSU is one affiliation; see docs/chapters-content.md.
export const chapterPreviews: readonly ChapterPreview[] = [
  {
    id: "mariner",
    schoolName: "Mariner High School",
    clubs: ["PUSO", "ASU", "PI Club"],
    joinMonth: "2026-06",
    image: "/chapters/mariner.jpg",
    imageAlt: "Exterior of Mariner High School",
  },
  {
    id: "archbishop-murphy",
    schoolName: "Archbishop Murphy High School",
    clubs: ["API"],
    joinMonth: "2026-06",
    image: "/chapters/archbishop-murphy.jpg",
    imageAlt: "Exterior of Archbishop Murphy High School",
  },
  {
    id: "bishop-blanchet",
    schoolName: "Bishop Blanchet High School",
    clubs: ["AAPISU"],
    joinMonth: "2026-06",
    image: "/chapters/bishop-blanchet.jpg",
    imageAlt: "Exterior of Bishop Blanchet High School",
  },
  {
    id: "bothell",
    schoolName: "Bothell High School",
    clubs: [],
    joinMonth: "2026-06",
    image: "/chapters/bothell.jpg",
    imageAlt: "Exterior of Bothell High School",
  },
  {
    id: "edmonds-woodway",
    schoolName: "Edmonds-Woodway High School",
    clubs: ["ASU"],
    joinMonth: "2026-06",
    image: "/chapters/edmonds-woodway.webp",
    imageAlt: "Exterior of Edmonds-Woodway High School",
  },
  {
    id: "everett",
    schoolName: "Everett High School",
    clubs: ["FSU"],
    joinMonth: "2026-06",
    image: "/chapters/everett.jpg",
    imageAlt: "Exterior of Everett High School",
  },
  {
    id: "forest-ridge",
    schoolName: "Forest Ridge School of the Sacred Heart",
    clubs: ["AAPISU"],
    joinMonth: "2026-06",
    image: "/chapters/forest-ridge.webp",
    imageAlt: "Exterior of Forest Ridge School of the Sacred Heart",
  },
  {
    id: "hazen",
    schoolName: "Hazen High School",
    clubs: [],
    joinMonth: "2026-06",
    image: "/chapters/hazen.webp",
    imageAlt: "Exterior of Hazen High School",
  },
  {
    id: "inglemoor",
    schoolName: "Inglemoor High School",
    clubs: ["AAPI", "FASA"],
    joinMonth: "2026-06",
    image: "/chapters/inglemoor.png",
    imageAlt: "Exterior of Inglemoor High School",
  },
  {
    id: "interlake",
    schoolName: "Interlake High School",
    clubs: ["FASA"],
    joinMonth: "2026-06",
    image: "/chapters/interlake.webp",
    imageAlt: "Exterior of Interlake High School",
  },
  {
    id: "juanita",
    schoolName: "Juanita High School",
    clubs: ["Vietnamese Club"],
    joinMonth: "2026-06",
    image: "/chapters/juanita.jpg",
    imageAlt: "Exterior of Juanita High School",
  },
  {
    id: "kamiak",
    schoolName: "Kamiak High School",
    clubs: ["FSU"],
    joinMonth: "2026-06",
    image: "/chapters/kamiak.jpg",
    imageAlt: "Exterior of Kamiak High School",
  },
  {
    id: "kennedy-catholic",
    schoolName: "Kennedy Catholic High School",
    clubs: [],
    joinMonth: "2026-06",
    image: "/chapters/kennedy-catholic.jpg",
    imageAlt: "Exterior of Kennedy Catholic High School",
  },
  {
    id: "lynnwood",
    schoolName: "Lynnwood High School",
    clubs: ["ASU"],
    joinMonth: "2026-06",
    image: "/chapters/lynnwood.jpg",
    imageAlt: "Exterior of Lynnwood High School",
  },
  {
    id: "meadowdale",
    schoolName: "Meadowdale High School",
    clubs: ["FASA", "ASU"],
    joinMonth: "2026-06",
    image: "/chapters/meadowdale.jpg",
    imageAlt: "Exterior of Meadowdale High School",
  },
  {
    id: "mountlake-terrace",
    schoolName: "Mountlake Terrace High School",
    clubs: ["FASA", "ASU"],
    joinMonth: "2026-06",
    image: "/chapters/mountlake-terrace.jpg",
    imageAlt: "Exterior of Mountlake Terrace High School",
  },
  {
    id: "odea",
    schoolName: "O'Dea High School",
    clubs: [],
    joinMonth: "2026-06",
    image: "/chapters/odea.jpg",
    imageAlt: "Exterior of O'Dea High School",
  },
  {
    id: "sammamish",
    schoolName: "Sammamish High School",
    clubs: ["Filipino Club"],
    joinMonth: "2026-06",
    image: "/chapters/sammamish.jpg",
    imageAlt: "Exterior of Sammamish High School",
  },
  {
    id: "seattle-prep",
    schoolName: "Seattle Preparatory School",
    clubs: ["APIC"],
    joinMonth: "2026-06",
    image: "/chapters/seattle-prep.jpg",
    imageAlt: "Exterior of Seattle Preparatory School",
  },
  {
    id: "shorecrest",
    schoolName: "Shorecrest High School",
    clubs: ["SC FSU"],
    joinMonth: "2026-06",
    image: "/chapters/shorecrest.jpg",
    imageAlt: "Exterior of Shorecrest High School",
  },
  {
    id: "shoreline-community-college",
    schoolName: "Shoreline College",
    clubs: ["FASA"],
    joinMonth: "2026-06",
    image: "/chapters/shoreline-college.jpg",
    imageAlt: "Exterior of Shoreline College",
  },
];

export const knownAffiliationCount = chapterPreviews.reduce(
  (total, school) => total + new Set(school.clubs).size,
  0,
);

export const chapterNetworkStats = {
  schools: chapterPreviews.length,
  // Conservative public wording until the complete affiliation inventory is approved.
  organizations: "20+",
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
