import { organizationHierarchy, getApprovedOfficers } from "@/data/leadership";

export default function OrganizationChart() {
  const byId = new Map(
    getApprovedOfficers().map((officer) => [officer.id, officer]),
  );
  const officerName = (id?: string) => {
    const officer = id ? byId.get(id) : undefined;
    return officer?.vacant ? "Vacant" : officer?.name;
  };
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
        {organizationHierarchy.map((level, index) => (
          <li key={level.id} className="org-level" data-tier={level.id}>
            <div
              className={`org-node ${level.roles ? "org-executive-group" : ""}`}
            >
              <p className="org-tier-label">Tier {index + 1}</p>
              {officerName(level.officerId) && (
                <p className="org-person-name">
                  {officerName(level.officerId)}
                </p>
              )}
              <h3
                className={
                  level.officerId ? "org-role-title" : "org-level-title"
                }
              >
                {level.label}
              </h3>
              {level.description && (
                <p className="mt-2 text-sm leading-relaxed">
                  {level.description}
                </p>
              )}
              {level.roles && (
                <ul
                  aria-label={`${level.label} roles`}
                  className="org-branches"
                >
                  {level.roles.map((role) => (
                    <li key={role.id} className="org-branch">
                      <div className="org-officer-node">
                        <p className="org-person-name">
                          {officerName(role.officerId) ??
                            (role.personnelStatus === "pending"
                              ? "Name pending confirmation"
                              : "")}
                        </p>
                        <h4 className="org-role-title">{role.label}</h4>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </li>
        ))}
      </ol>
    </figure>
  );
}
