# Chapters content reconciliation

The founder's canonical inventory contains **21 unique schools and 22 known school-club affiliations**. Each club is counted once per school. Public statistics deliberately retain **21 schools. 20+ organizations.** until the full affiliation inventory is approved.

Source: the reconciled inventory supplied for this implementation, describing the newer Google Drive folders and founder corrections. Drive folders were not independently fetched during this pass.

| School                                  | Known clubs        |
| --------------------------------------- | ------------------ |
| Mariner High School                     | PUSO, ASU, PI Club |
| Mountlake Terrace High School           | FASA, ASU          |
| Meadowdale High School                  | FASA, ASU          |
| Kamiak High School                      | FSU                |
| Everett High School                     | FSU                |
| Shorecrest High School                  | SC FSU             |
| Lynnwood High School                    | ASU                |
| Edmonds-Woodway High School             | ASU                |
| Inglemoor High School                   | AAPI, FASA         |
| Sammamish High School                   | Filipino Club      |
| Shoreline College                       | FASA               |
| Juanita High School                     | Vietnamese Club    |
| Seattle Preparatory School              | APIC               |
| O'Dea High School                       | Not supplied       |
| Bishop Blanchet High School             | AAPISU             |
| Archbishop Murphy High School           | API                |
| Interlake High School                   | FASA               |
| Forest Ridge School of the Sacred Heart | AAPISU             |
| Bothell High School                     | Not supplied       |
| Hazen High School                       | Not supplied       |
| Kennedy Catholic High School            | Not supplied       |

Shorecrest's document says Shorecrest Filipino Student Union (SC FSU), while its containing folder says FASA. Display SC FSU and count one affiliation; client confirmation of the folder discrepancy remains pending. Inglemoor uses AAPI rather than the earlier ASU label; Bishop Blanchet uses the newer AAPISU spelling. Neither older label is counted as an additional club. The four schools without club names use empty arrays and “Club details forthcoming.”

Shoreline College was formerly Shoreline Community College; its existing stable ID is retained. Bothell refers to the high school, and Sammamish refers to the high school in Bellevue. Full canonical school names are used in cards, including Forest Ridge School of the Sacred Heart.

Every school uses month-level `joinMonth: "2026-06"`, authorized by the founder. Labels are formatted directly from month/year; no exact joining day or timestamp is created.

Maintain records in `src/data/chapter-previews.ts`, with Mariner first and remaining schools alphabetically ordered. All 21 schools use the supplied local building photographs, matched by filename without renaming or conversion. Descriptions and school URLs are not invented. See [chapter-photo-inventory.md](chapter-photo-inventory.md) for file mappings, embedded author/license clues, and unresolved publication permissions. Stable IDs support a future directory.

The carousel maps the 21 records once and uses Embla's native loop. Its counter uses the selected logical snap and actual record count. Automated rendering and counter checks cover all cards and wraparound; live controls, swipe, keyboard behavior, and layout still require browser review at 375, 768, 1024, and 1440px.
