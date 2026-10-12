# Chapters content reconciliation

The founder-provided school inventory supersedes the old 18-school preview. It contains **21 unique schools and 22 known school-club affiliations**. The affiliation count counts each club once per school; the same acronym at different schools represents separate affiliations. Public network statistics show **21 schools / 22+ organizations**, a lower bound rather than an assertion that all club names are known.

Source: the inventory supplied for this implementation, describing the newer Google Drive folder structure, plus the explicitly identified earlier founder information for Archbishop Murphy. The Drive folders were not independently fetched during this pass.

- Mariner: PUSO, ASU, PI Club.
- Mountlake Terrace and Meadowdale: FASA, ASU at each school.
- Kamiak and Everett: FSU at each school.
- Shorecrest: FASA appears once. Its source document also says SC FSU; do not count this as a second club without confirmation.
- Lynnwood and Edmonds-Woodway: ASU at each school.
- Inglemoor: AAPI, FASA, following the newer inventory rather than the earlier ASU label.
- Sammamish: Filipino Club.
- Shoreline Community College: FASA.
- Juanita: Vietnamese Club.
- Seattle Prep: APIC.
- Bishop Blanchet: AAPISU, following the newer spelling rather than earlier APISU.
- Archbishop Murphy: API, from the earlier founder message.
- Interlake: FASA.
- Forest Ridge: AAPISU.
- O'Dea, Bothell, Hazen, and Kennedy Catholic: no supplied club names; cards say “Club details forthcoming.”

Every school uses month-level `joinMonth: "2026-06"`, authorized by the founder. Month labels are formatted directly from the month/year; no exact joining day or timestamp is created.

Maintain the inventory in `src/data/chapter-previews.ts`. Stable IDs also serve as future directory slugs. Keep Mariner first, then use alphabetical school order. Use only verified image paths, meaningful alt text, approved descriptions, and verified destinations. Mariner is the only school with a locally available approved image; no school-specific URLs or descriptions have been fabricated.

The carousel maps these 21 records once and relies on Embla's native loop. Its selected-snap counter displays the real logical total. No repeated placeholders or tripled data remain. Live control/swipe/keyboard and layout review still need a browser at 375, 768, 1024, and 1440px.
