# Chapter photo inventory

These 21 school-building photographs were supplied locally for this integration. Filename-to-school mappings follow the canonical chapter records, with a contact-sheet inspection to confirm exterior-building subjects. This is not independent verification of every building's identity or of publication rights.

No source URLs were supplied in repository documentation or found in the files' macOS download-source attributes. Author/license fields below are embedded metadata clues, not verified grants of permission. No license or source was inferred from local availability. Resolve the original source, publication permissions, and required attribution before production publication. This task does not deploy the photographs.

| School                                  | Local filename in `public/chapters/` | Dimensions  | Known source URL   | License / permission / attribution status                                                                             |
| --------------------------------------- | ------------------------------------ | ----------- | ------------------ | --------------------------------------------------------------------------------------------------------------------- |
| Mariner High School                     | `mariner.jpg`                        | 1024 × 683  | Not supplied/found | Not documented; permission and required attribution pending                                                           |
| Archbishop Murphy High School           | `archbishop-murphy.jpg`              | 1600 × 700  | Not supplied/found | Not documented; permission and required attribution pending                                                           |
| Bishop Blanchet High School             | `bishop-blanchet.jpg`                | 2560 × 1707 | Not supplied/found | Not documented; permission and required attribution pending                                                           |
| Bothell High School                     | `bothell.jpg`                        | 1920 × 1080 | Not supplied/found | Not documented; permission and required attribution pending                                                           |
| Edmonds-Woodway High School             | `edmonds-woodway.webp`               | 1024 × 768  | Not supplied/found | Not documented; permission and required attribution pending                                                           |
| Everett High School                     | `everett.jpg`                        | 1280 × 960  | Not supplied/found | Not documented; permission and required attribution pending                                                           |
| Forest Ridge School of the Sacred Heart | `forest-ridge.webp`                  | 2500 × 1406 | Not supplied/found | Not documented; permission and required attribution pending                                                           |
| Hazen High School                       | `hazen.webp`                         | 1760 × 1172 | Not supplied/found | Not documented; permission and required attribution pending                                                           |
| Inglemoor High School                   | `inglemoor.png`                      | 1280 × 853  | Not supplied/found | Not documented; permission and required attribution pending                                                           |
| Interlake High School                   | `interlake.webp`                     | 1066 × 800  | Not supplied/found | Not documented; permission and required attribution pending                                                           |
| Juanita High School                     | `juanita.jpg`                        | 4032 × 3024 | Not supplied/found | Not documented; permission and required attribution pending                                                           |
| Kamiak High School                      | `kamiak.jpg`                         | 1280 × 838  | Not supplied/found | Embedded artist: Bruce Englehardt; copyright field: CC-BY-SA 4.0. Source/license verification and attribution pending |
| Kennedy Catholic High School            | `kennedy-catholic.jpg`               | 1797 × 1128 | Not supplied/found | Embedded creator: Alex Halverson. License/permission and required attribution pending                                 |
| Lynnwood High School                    | `lynnwood.jpg`                       | 580 × 289   | Not supplied/found | Not documented; permission and required attribution pending                                                           |
| Meadowdale High School                  | `meadowdale.jpg`                     | 1280 × 960  | Not supplied/found | Not documented; permission and required attribution pending                                                           |
| Mountlake Terrace High School           | `mountlake-terrace.jpg`              | 3646 × 2115 | Not supplied/found | Not documented; permission and required attribution pending                                                           |
| O'Dea High School                       | `odea.jpg`                           | 1280 × 960  | Not supplied/found | Not documented; permission and required attribution pending                                                           |
| Sammamish High School                   | `sammamish.jpg`                      | 1200 × 900  | Not supplied/found | Not documented; permission and required attribution pending                                                           |
| Seattle Preparatory School              | `seattle-prep.jpg`                   | 640 × 425   | Not supplied/found | Not documented; permission and required attribution pending                                                           |
| Shorecrest High School                  | `shorecrest.jpg`                     | 1878 × 1039 | Not supplied/found | Not documented; permission and required attribution pending                                                           |
| Shoreline College                       | `shoreline-college.jpg`              | 3264 × 2448 | Not supplied/found | Not documented; permission and required attribution pending                                                           |

`mariner-high.jpg` is an existing, byte-identical copy of `mariner.jpg`. It remains on disk for preservation, but only `mariner.jpg` is assigned as Mariner's primary image. There are 22 files on disk and 21 distinct primary image references; no school shares another school's image.

## Maintenance

- Update `image`, `imageAlt`, and optional `imagePosition` in `src/data/chapter-previews.ts`. Keep canonical names, clubs, stable IDs, and month-precision join dates intact.
- Paths retain their supplied extensions. Images are decoded locally for verification; originals are not resized, renamed, or converted.
- Cards use Next.js Image with `fill`, responsive `sizes`, lazy loading, `object-cover`, and a fixed 1.5 aspect ratio. Optional `imagePosition` supplies CSS object-position, defaulting to center. The existing branded fallback remains available when an image reference is absent.
- Record verified source URLs, permission evidence, required credit wording, and any crop restrictions here as they become available. Embedded metadata alone does not clear publication rights.
- The carousel remains one 21-school dataset with native Embla looping. Browser checks at 375, 768, 1024, and 1440px remain outstanding because browser tooling is unavailable in this environment.
