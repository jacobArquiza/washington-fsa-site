import {
  organizationHierarchy,
  additionalExecutiveOfficerIds,
  getApprovedOfficers,
} from "@/data/leadership";

export default function OrganizationChart() {
  const roster = getApprovedOfficers();
  const byId = new Map(roster.map((officer) => [officer.id, officer]));
  const officerName = (id?: string) => {
    const officer = id ? byId.get(id) : undefined;
    return officer?.vacant ? "Vacant" : officer?.name;
  };
  const additionalOfficers = roster.filter((officer) =>
    additionalExecutiveOfficerIds.includes(officer.id),
  );
  return (
    <figure aria-labelledby="organization-chart-title" className="min-w-0">
      <figcaption
        id="organization-chart-title"
        className="section-eyebrow mb-7 text-deep-blue"
      >
        Our statewide structure
      </figcaption>
      <ol
        aria-label="WFSA hierarchy, from statewide leadership to the general body"
        className="org-chart"
      >
        {organizationHierarchy.map((level) => (
          <li key={level.id} className="org-level">
            <div
              className={`org-node ${level.emphasis ? "org-node-emphasis" : ""}`}
            >
              <h3 className="font-display text-xl leading-tight sm:text-2xl">
                {level.label}
              </h3>
              {level.description && (
                <p className="mt-1 text-xs leading-relaxed">
                  {level.description}
                </p>
              )}
              {officerName(level.officerId) && (
                <p className="mt-2 font-display text-xl leading-tight sm:text-2xl">
                  {officerName(level.officerId)}
                </p>
              )}
            </div>
            {level.roles && (
              <>
                <ul
                  aria-label={`${level.label} roles`}
                  className="org-branches"
                >
                  {level.roles.map((role) => (
                    <li key={role.id} className="org-branch">
                      <div className="org-node h-full flex-col gap-2 text-sm font-medium">
                        <span>{role.label}</span>
                        {officerName(role.officerId) && (
                          <span className="block font-display text-lg leading-tight">
                            {officerName(role.officerId)}
                          </span>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
                <span aria-hidden="true" className="org-join" />
              </>
            )}
          </li>
        ))}
      </ol>
      {additionalOfficers.length > 0 && (
        <aside
          aria-label="Additional executive leadership"
          className="mt-6 border-t border-deep-blue/20 pt-5"
        >
          <p className="section-eyebrow text-deep-blue">
            Also serving in executive leadership
          </p>
          <ul className="mt-3 space-y-3">
            {additionalOfficers.map((officer) => (
              <li key={officer.id}>
                <p className="text-sm font-medium text-deep-blue">
                  {officer.role}
                </p>
                <p className="mt-1 font-display text-2xl">{officer.name}</p>
              </li>
            ))}
          </ul>
        </aside>
      )}
    </figure>
  );
}
