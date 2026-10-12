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
