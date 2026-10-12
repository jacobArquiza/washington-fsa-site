import {
  organizationHierarchy,
  organizationTerminologyNote,
} from "@/data/leadership";

export default function OrganizationChart() {
  return (
    <figure
      aria-labelledby="organization-chart-title"
      aria-describedby="organization-terminology"
      className="min-w-0"
    >
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
              className={`org-node ${level.terminologyPending ? "org-node-emphasis" : ""}`}
            >
              <h3 className="font-display text-xl leading-tight sm:text-2xl">
                {level.label}
                {level.terminologyPending && <span aria-hidden="true"> *</span>}
              </h3>
              {level.description && (
                <p className="mt-1 text-xs leading-relaxed">
                  {level.description}
                </p>
              )}
              {level.terminologyPending && (
                <p className="mt-1 text-xs">Title pending confirmation</p>
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
                      <div className="org-node h-full text-sm font-medium">
                        {role.label}
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
      <p
        id="organization-terminology"
        className="mt-6 text-xs leading-relaxed text-ink/75"
      >
        * {organizationTerminologyNote}
      </p>
    </figure>
  );
}
