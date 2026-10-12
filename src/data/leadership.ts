export type Officer = {
  id: string;
  name: string | null;
  vacant?: boolean;
  role: string;
  displayOrder: number;
  publicationStatus: "draft" | "approved";
  isCurrent: boolean;
};

// Founder-confirmed roles and publication authorization for this preview.
export const officers: readonly Officer[] = [
  {
    id: "jerico-magat",
    name: "Jerico Magat",
    role: "Commissioner / Executive Director",
    displayOrder: 0,
    publicationStatus: "approved",
    isCurrent: true,
  },
  {
    id: "alice-pham",
    name: "Alice Pham",
    role: "Vice President",
    displayOrder: 1,
    publicationStatus: "approved",
    isCurrent: true,
  },
  {
    id: "jeohnavi-bandoy",
    name: "Jeohnavi Bandoy",
    role: "PR Director",
    displayOrder: 2,
    publicationStatus: "approved",
    isCurrent: true,
  },
  {
    id: "finance-director",
    name: null,
    vacant: true,
    role: "Finance Director",
    displayOrder: 3,
    publicationStatus: "approved",
    isCurrent: true,
  },
  {
    id: "oliver-casimiro",
    name: "Oliver Casimiro",
    role: "Chief of Staff",
    displayOrder: 4,
    publicationStatus: "approved",
    isCurrent: true,
  },
];

export function getApprovedOfficers(
  records: readonly Officer[] = officers,
): Officer[] {
  return records
    .filter(
      (officer) =>
        officer.publicationStatus === "approved" && officer.isCurrent,
    )
    .sort(
      (a, b) => a.displayOrder - b.displayOrder || a.id.localeCompare(b.id),
    );
}

export type OrganizationLevel = {
  id: string;
  label: string;
  description?: string;
  officerId?: string;
  roles?: readonly { id: string; label: string; officerId?: string }[];
  emphasis?: boolean;
};

// Structure references the approved roster without duplicating personal names.
export const organizationHierarchy: readonly OrganizationLevel[] = [
  {
    id: "commissioner",
    label: "Commissioner / Executive Director",
    officerId: "jerico-magat",
    emphasis: true,
  },
  {
    id: "executive-team",
    label: "Executive Team",
    roles: [
      {
        id: "vice-president",
        label: "Vice President",
        officerId: "alice-pham",
      },
      { id: "pr", label: "PR Director", officerId: "jeohnavi-bandoy" },
      {
        id: "finance",
        label: "Finance Director",
        officerId: "finance-director",
      },
      { id: "cultural-chiefs", label: "Cultural Chiefs" },
    ],
  },
  {
    id: "regional-senate",
    label: "Regional Senate",
    description: "Two representatives per chapter",
  },
  { id: "campus-officers", label: "Campus Chapter Officers" },
  { id: "general-body", label: "General Body" },
];

// Visible alongside the chart; no reporting line or exact placement is inferred.
export const additionalExecutiveOfficerIds: readonly string[] = [
  "oliver-casimiro",
];
