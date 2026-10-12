export type Officer = {
  id: string;
  name: string;
  role: string;
  displayOrder: number;
  publicationStatus: "draft" | "approved";
  isCurrent: boolean;
};

// Add names only after WFSA confirms the current roster and approves publication.
export const officers: readonly Officer[] = [];

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
  roles?: readonly { id: string; label: string }[];
  terminologyPending?: boolean;
};

// Structural preview only; no individual is assigned to an unconfirmed title.
export const organizationHierarchy: readonly OrganizationLevel[] = [
  { id: "commissioner", label: "Commissioner", terminologyPending: true },
  {
    id: "executive-team",
    label: "Executive Team",
    roles: [
      { id: "vice-president", label: "Vice President" },
      { id: "pr", label: "PR" },
      { id: "finance", label: "Finance" },
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

export const organizationTerminologyNote =
  "Commissioner is the structural label used in this preview. Historical records also use Executive Director; the title and relationship between these roles require WFSA confirmation before publication.";
