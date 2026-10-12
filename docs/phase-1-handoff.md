## Summary

Complete the six-section WFSA landing page with intentional editorial presentations while confirmed event content is pending and the founder-authorized officer roster is displayed. Preserve the existing video introduction, four mission pillars, and blue chapter carousel. No dependencies, backend services, or management features are added.

Branch: `feat/complete-landing-page`

PR title: `feat: complete WFSA landing page and responsive polish`

Based on the latest fetched `main`, commit `877de1b`, which incorporates dependency-security PR #14. The original working tree was clean.

## Sections and behavior

- **Hero:** preserve video, headline, and chapter CTA; replace nested button/link with one Link. Provide a branded poster, readable overlay, explicit pause/play control, codec selection, and static fallback when playback fails. Reduced-motion visitors receive the poster without automatic video loading. Mobile retains viewport-height cropping.
- **Mission:** retain the accordion, pillars, and animations; finish the right column with a deep-blue, gold-accented typography composition. Align the section to the 1440px container and stack the composition below the accordion on mobile. Suppress tap/height motion under reduced-motion preferences.
- **Chapters:** retain the carousel in the canonical deep blue, with 21 unique schools and 22 known school-club affiliations. Render the approved inventory once using native Embla looping, Mariner first and the remaining schools alphabetically. Each card displays Joined June 2026 at month precision, known clubs or an intentional forthcoming label, and the school's approved photo or branded fallback. The counter reports 21 logical schools; the school count derives from the dataset and public organization wording remains a conservative 20+.
- **Events:** replace the promotional composition with a functional shared monthly calendar on the homepage and `/events`. Preserve the editorial heading; support previous/next month, Washington-local today, date selection, event markers, multiple and spanning events, and intentional empty states. Preserve selections across navigation. Both views use the typed date/time dataset and the same timezone-aware logic. The homepage's default upcoming panel shows three events; selected-date details show all matches. The full page provides the expanded listing. No production records are invented.
- **Leadership:** preserve the editorial introduction and connected five-level chart. The founder confirms Commissioner and Executive Director are the same position: Jerico Magat. Executive branches show Alice Pham (Vice President), Jeohnavi Bandoy (PR Director), Finance Director (Vacant), Cultural Chiefs (Name pending confirmation), and Oliver Casimiro (Chief of Staff), all within the Executive Team. No reporting relationship beyond executive membership is inferred. Regional Senate (two representatives per chapter), Campus Chapter Officers, and General Body remain connected below. The old terminology warning is removed.
- **Footer:** add deep-blue global navigation, “Stay connected.”, organization description/name, restrained WFSA wordmark (44–56px mobile, 80–96px desktop), current build-year copyright, and a keyboard-accessible back-to-top link on all public routes. Its enhanced click handler uses the existing Lenis instance; reduced motion scrolls immediately. No duplicate instance, hash navigation, or competing browser animation is introduced. Focus returns to the main content after scrolling.
- **Shared accessibility:** add a skip link and main targets on every public route, visible focus outlines, current-page navigation semantics, higher-contrast navigation backgrounds, and Escape focus recovery for the mobile menu. Respect live reduced-motion changes in smooth scrolling and video playback.

## Files

Created:

- `src/components/events-overview.tsx`
- `src/components/events-calendar.tsx`
- `src/lib/event-calendar.ts`
- `tests/event-calendar.test.mjs`
- `docs/events-calendar.md`
- `src/components/leadership-overview.tsx`
- `src/components/organization-chart.tsx`
- `src/components/site-footer.tsx`
- `src/data/events.ts`
- `src/data/leadership.ts`
- `public/hero/wfsa-poster.svg`
- `docs/phase-1-handoff.md`

Modified:

- `src/app/page.tsx`, `src/app/layout.tsx`, `src/app/globals.css`
- `src/app/chapters/page.tsx`, `src/app/events/page.tsx`, `src/app/leadership/page.tsx`
- `src/components/hero.tsx`, `src/components/mission.tsx`, `src/components/mission-card.tsx`
- `src/components/chapters-overview.tsx`, `src/components/ui/carousel.tsx`
- `src/components/site-header.tsx`, `src/components/smooth-scroll.tsx`

## Content maintenance

Add approved events to `src/data/events.ts` using `startDate`/`endDate` (`YYYY-MM-DD`), optional `startTime`/`endTime` (`HH:mm`), and an IANA `timeZone`, normally `America/Los_Angeles`. Stable ID and confirmed title are required. Only verified locations, descriptions, and registration URLs belong in public records. Draft/cancelled/invalid records are omitted. See [events-calendar.md](events-calendar.md) for exact date semantics, DST handling, keyboard behavior, and deployment instructions. The shared calendar automatically places markers and renders details without component changes.

Maintain structure in `organizationHierarchy` and officer records in `officers` in `src/data/leadership.ts`. Structural roles refer to officer IDs so names are not duplicated in JSX. The roster is now founder-authorized for public display. Commissioner / Executive Director is one combined position, occupied by Jerico Magat. Finance is explicitly vacant rather than assigned a fictional person. Cultural Chiefs names remain pending confirmation. Chief of Staff is a confirmed executive-level function in the connected Executive Team, without an additional reporting relationship. Future officer edits retain publication/current status checks.

Pending client content:

- Confirmed upcoming event titles, dates/times, locations, and destination links.
- Cultural Chiefs names; the named executive roster and Chief of Staff executive membership are approved.
- Approved contact and social destinations. None were fabricated.
- Approved community/event still photography. Local assets contain the existing hero video, logo, and Mariner school entrance photo, but no suitable community stills for Mission or Events. Mission uses a branded composition; Events now uses its functional calendar rather than photography. The Mariner photo remains assigned only to Mariner.

## Verification

- `npm run qa`: lint, TypeScript, and formatting passed; the default Turbopack build failed because the execution environment prevents its internal local port binding (`Operation not permitted`). Retrying with elevated execution produced the same restriction.
- `npx next build --webpack`: production build passed, including compilation, TypeScript, and static generation of all public routes. No build-script changes were made.
- `git diff --check`: passed.
- Temporary Node assertions: passed for empty/single/multiple event datasets, chronological ordering and three-event limit, rejection of past/invalid/local-time/invalid-timezone records, and officer approval/current/order filtering. Fixtures were not committed.
- Generated production HTML: inspected for main/footer/navigation landmarks, one H1 per route, six homepage sections, non-nested hero CTA, the event empty state, and valid internal destinations. The follow-up checks also inspect the organization chart roles, accessible lists and officer names, footer scroll target, and responsive CSS.
- Existing GitHub Actions configuration was reviewed; its quality job checks lint, types, formatting, and the default production build. CI results are pending PR creation.

## Review still required

The in-app browser Node execution tool is unavailable. A local Playwright/Chrome launch was attempted and terminated with a macOS permission error; the local server also cannot bind port 3000 in this environment. No browser protections were bypassed and no browser visual review is claimed.

Manual review is still required at **375, 768, 1024, 1280, and 1440px**, including horizontal overflow/wrapping, cropping, spacing, contrast over the actual video, keyboard focus and skip navigation, mobile-menu open/close/Escape, accordion interaction, carousel controls/arrow keys/touch/counter, reduced-motion behavior, back-to-top, and internal links. Layouts and semantics were reviewed in source; rendered responsiveness and interactions remain unverified.

GitHub CI and a stakeholder review of the final Vercel preview remain required before merge. No production deployment is claimed.

## Phase 1 issue coverage

Related to #3, #4, #5, #6, #7, #8, #9, and #10.

- #4 and #5 are already closed; this PR refines their existing navigation/hero/mission implementations.
- #6 retains the delivered chapter preview and improves its accessibility/motion handling.
- #7 implements both preview sections and maintainable content modules.
- #8 implements the global footer and internal navigation; external/contact links await approval.
- #9 and #10 receive accessibility/responsive implementation improvements, but rendered QA, CI, and Vercel review are outstanding.
- #3 receives the complete landing-page implementation; its deployment/review completion criteria remain outstanding.

No automatic issue-closing keywords are used because these issues include pending CI, browser, preview, or deployment acceptance criteria. Do not merge or close issues until those criteria have been verified.

## Visual regression and hierarchy polish

- The navbar regression came from replacing translucent backgrounds with opaque/deep-blue fills. Restore the original hero glass and translucent open-menu treatment while using ivory glass/ink text over light content and secondary routes. Preserve blur, borders, scroll transitions, current-page semantics, and Escape focus recovery.
- Sizing audit: no root-font override, global scaling, or oversized container was found. The full-screen hero is intentional; desktop section padding is 96px, headings top out at 72px, and content is capped at 1440px. The footer wordmark was a confirmed outlier (23vw up to 352px; about 294px at 1280px). Reduce it to the requested range. The broader browser-zoom report could not be reproduced without browser access; avoid speculative global resizing.
- Replace the leadership typography fallback with the typed connected hierarchy specified above. The chart uses the supplied textual structure. Founder-authorized officer names now appear in the preview.
- The back-to-top regression came from a native hash anchor bypassing Lenis. A delegated handler in the existing scroll controller now animates through its existing instance, respects live reduced-motion preferences, avoids navigation, and returns focus to the main landmark.
- Browser visual checks remain outstanding, including navbar at initial load, through Mission and secondary routes; chart at all review widths; and back-to-top from the bottom of a long page. No blocked macOS browser/helper is force-opened.

Follow-up verification: lint, typecheck, and format check passed. The requested default `npm run build` reproduced the Turbopack internal-port restriction; the final `npx next build --webpack` passed separately, including static generation of all public routes. Temporary mocked scroll-controller assertions passed for one Lenis instance, smooth dispatch, reduced-motion immediate scroll, focus restoration, unrelated-link/modifier isolation, and listener cleanup. These assertions do not verify live animation or visual appearance.

Final generated-HTML assertions passed for initial navbar glass on the homepage and secondary routes, one H1 per route, footer wordmark bounds and scroll target, all hierarchy labels, nested role-list semantics, and the leadership roster. Built CSS includes the chart connector rules and tablet breakpoint. `git diff --check` passed. These checks verify output structure, not rendered layout or scroll states.

## Shared events calendar follow-up

- Add a real seven-column monthly calendar to both homepage and Events route using one implementation and one empty production dataset. Date-only values are never parsed in the visitor's local timezone. Timed records are resolved in their IANA timezone and displayed on Washington dates.
- Use the existing Node/React/TypeScript tools for focused tests; add `npm test` to the existing QA command and GitHub quality job. No dependencies are added.
- Preserve the prior glass-navbar, organizational-chart, reduced footer wordmark, and smooth Lenis controls. Improve the native scrolling fallback if Lenis cannot initialize.
- Source review found no inflated root font, viewport override, or scaling hack. The prior footer outlier is already fixed, and the oversized Events promotional card is now removed. Overall browser zoom and rendered laptop scale remain unverified rather than attributed to a browser setting without evidence.
- The named executive roster and combined Commissioner / Executive Director title are approved. Chief of Staff belongs to the Executive Team. Cultural Chiefs names remain pending confirmation. No additional relationships or names are inferred.

The final calendar follow-up also ties navbar boundary state to its route, preventing stale secondary-route scroll state from briefly carrying onto the hero. The new controller test exercises Lenis initialization failure/native fallback and live reduced-motion changes without claiming browser animation review.

Final calendar QA: 18 focused tests passed under the default environment plus Honolulu and Tokyo visitor timezones. Lint, typecheck, format check, and whitespace checks passed. The requested default `npm run build` failed because Turbopack cannot bind its internal local port; the final supported webpack build passed separately. Calendar data/rendering and isolated interaction/controller behavior are verified automatically. Browser visual layout, real focus/scroll behavior, zoom settings, and CI/Vercel preview remain unverified. No missing event time is presented as a confirmed all-day duration.

## Approved leadership and full chapter inventory

Populate the founder-authorized roster and replace the three-record chapter preview with all 21 schools. The canonical deep-blue token is used only for this chapter-section refinement. Mariner retains its existing local image; no descriptions, club names, photos, or school URLs are invented. See [chapters-content.md](chapters-content.md) for the 22 known affiliations, four unnamed clubs, and source discrepancies. Every join month is June 2026 at month precision. Native carousel looping replaces manual dataset repetition.

Content-completion verification: all 23 tests passed, including exact school/club inventory, join-month precision, unique IDs, approved roster/vacancy, chart rendering, 21-card rendering, and selected-snap counter updates/wraparound/reinitialization. Lint, typecheck, formatting, and `git diff --check` passed. The default Turbopack build reproduced the environment's internal-port restriction; the supported webpack build passed separately. Generated production HTML confirms 21 unique cards, 21 June 2026 labels, four unknown-club treatments, the 1/21 counter, derived statistics, deep-blue chapter styling, and approved leadership names without the obsolete warning. Live carousel touch/keyboard/looping and chart layout remain unverified in a browser at 375, 768, 1024, and 1440px.

Files for this content pass: `src/data/leadership.ts`, `src/components/organization-chart.tsx`, `src/data/chapter-previews.ts`, `src/components/chapter-preview-card.tsx`, `src/components/chapters-overview.tsx`, `tests/organization-content.test.mjs`, `docs/chapters-content.md`, and this handoff. Hero, Mission, calendar, navbar, footer, shared scrolling, and global styles are preserved.

## Final hierarchy and canonical school refinements

Chief of Staff is now inside the five-function Executive Team rather than a separate aside. The five numbered tiers retain decorative connectors and semantic ordered/nested lists. Occupied nodes show names first in semibold Manrope, with smaller role labels. Jerico Magat leads the single Commissioner / Executive Director node. Finance says Vacant; Cultural Chiefs says Name pending confirmation. Deep blue, muted red, gold, and neutral treatments distinguish the levels without relying on color alone. Executive nodes stack on mobile, use two columns from 640px, and three from 1280px.

School cards use the full canonical names and Shorecrest's SC FSU display name. All 21 unique records retain June 2026 month precision, with 22 known affiliations and conservative public wording of 20+ organizations. No school links or additional images are invented. The card titles wrap without reducing their editorial size.

Verification: all 23 tests, lint, typecheck, formatting, and whitespace checks passed. The default Turbopack build remains blocked by the environment's internal port-binding restriction; `npx next build --webpack` passed separately, including static generation of all public routes. Built-output assertions also passed for five tiers, five executive functions, approved names/statuses, 21 chapter cards, and compiled chart styles. Browser tooling is unavailable, so rendered chart/card layouts at 375, 768, 1024, and 1440px, live swipe/navigation, focus behavior, and overflow still need manual review.
