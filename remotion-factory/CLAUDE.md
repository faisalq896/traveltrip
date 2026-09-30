# Crystal video factory — working rules

Reusable Remotion templates for the U2-L4 crystal-form series. Data lives in files; templates hold no lesson text.

> These rules are taken from the script's own "قواعد الصحة العلمية" and "الأصول" sections
> (`script_crystal_form_4videos.pdf`, pp. 2–3). The project `CLAUDE.md` from `D:\ZARRA_REMOTION_TEST`
> was not available when this was built — replace this file with it, then re-check the rules below against it.

## Rules and where they are enforced

| Rule | Where |
|---|---|
| **Ideal shape first.** Every symmetry/lattice concept is explained on a code-drawn ideal shape; the real specimen follows under "شكلها في الطبيعة" and is never used to explain. | `scripts/validate.ts` — a `NaturalSample` needs an earlier `IdealCrystal` with the same `topic` (or `standalone` + `standaloneReason`). |
| **Reserved text zone.** Sentences (screen text, book definitions) only in `TEXT_ZONE` (y 760–1032); visuals only in `STAGE` (y 48–736). Nothing else draws over the zone. | `src/lib/layout.ts`, `Stage` / `TextZone` in `src/lib/Frame.tsx`. Checked by eye in the review stills — there is no automatic overflow check. |
| **Definitions verbatim from the book.** Scenes reference a definition by id; the text is never typed in a scene. Highlights must be exact substrings. | `data/definitions/U2-L4.json`, `DefinitionPanel`, `validate.ts`. |
| **Script timings.** Scenes are contiguous and add up to the script's duration (A = 295 s). | `validate.ts`, `frameRange()` in `src/VideoComposition.tsx`. |
| **Templates read data files.** | `data/videos/*.json`, `data/assets.json`, `data/definitions/*.json`. |
| **Missing assets are visible.** An unregistered/missing asset draws a labelled dashed placeholder, never a blank. | `src/lib/Media.tsx`, `validate.ts` warnings. |
| Semi-precious stones: never shown. Pyrite: not used for the cubic axis. Quartz: hexagonal axis only after the explanation; beryl: "as in nature" only. | Content rules for videos ب–د — not exercised by video A. |

## Layout

- `src/templates/` — `IdealCrystal`, `Compare`, `NaturalSample`, `Definition` (the four reusable templates).
- `src/scenes/` — `TitleCard`, `LessonMap`, `Quiz` (small motion-graphic scenes the script also needs).
- `src/lib/` — layout, theme, fonts, lattice geometry, media slot, definition panel.
- `data/` — everything the videos say and show.

## Commands

- `npm run studio` — open Remotion Studio.
- `npm run validate` — check the rules above against the data.
- `npm run typecheck`
- No MP4 is rendered in this pass. `scripts/review-stills.mjs` renders PNG stills only.
