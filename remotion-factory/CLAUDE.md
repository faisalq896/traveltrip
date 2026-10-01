# Crystal video factory — working rules

Reusable Remotion templates for the U2-L4 crystal-form series. Data lives in files; templates hold no lesson text.
The rules below come from the ZARRA `CLAUDE.md` (work rules, science rules, visual language) and from the
script's "قواعد الصحة العلمية". Where a rule is checkable, it is checked by `npm run validate`.

## Rules and where they are enforced

| Rule | Source | Where |
|---|---|---|
| Ideal shape first: concepts are explained on a code-drawn ideal shape; the real specimen comes after and never explains. | script | `validate.ts` — `NaturalSample` needs an earlier `IdealCrystal` with the same `topic` (or `standalone` + `standaloneReason`). |
| Reserved text zone: speech/sentences only in `TEXT_ZONE` (y 760–1032), no model enters it, models stay whole inside `STAGE` (y 48–736). | CLAUDE.md, visual language | `src/lib/layout.ts`, `Stage` / `TextZone`. Checked by eye in review stills — no automatic overflow check. |
| Book definitions verbatim; highlights are exact substrings. | script | `data/definitions/U2-L4.json`, `DefinitionPanel`, `validate.ts`. |
| Simplified models carry "نموذج توضيحي، الأحجام النسبية تقريبية". | CLAUDE.md, science rules | `scene.modelNote` + `data/rules.json`; `validate.ts` requires it on every `IdealCrystal` and on `Compare` scenes with a backdrop. |
| Script timings: scenes contiguous, total = script (A = 295 s). | script | `validate.ts`, `frameRange()`. |
| Font: IBM Plex Sans Arabic via `@remotion/google-fonts`. RTL, dark scientific stage. | CLAUDE.md | `src/lib/fonts.ts`, `SceneFrame`. |
| Little on-screen text; the voice explains. | CLAUDE.md | Only script-specified text is on screen; narration is stored in data, not rendered. |
| No invented tools; libraries from the approved list. | CLAUDE.md #7 | Remotion + React only. GLB viewer (Three.js) not wired yet. |
| Sources/licences recorded for every external asset. | CLAUDE.md | `CREDITS.md`, `data/assets.json`. |
| UTF-8 without BOM. | CLAUDE.md | all files. |
| Suspended content (incl. gemstones pp. 59–62) never appears; semi-precious stones never shown. | CLAUDE.md, script | Nothing to check in video A; keep in mind for B–D. |
| Missing assets are visible: a labelled dashed placeholder, never a blank. | — | `src/lib/Media.tsx`, `validate.ts` warnings. |

## بداية كل فيديو

ترتيب بداية كل فيديو ثابت: التشويق (15-20 ث) ثم الشعار (3 ث) ثم العنوان.
ونوع التشويق يتغير حسب الدرس من IDEAS.md.

## Layout

- `src/templates/` — `IdealCrystal`, `Compare`, `NaturalSample`, `Definition`.
- `src/scenes/` — `TitleCard`, `LessonMap`, `Quiz` (small motion-graphic scenes the script also needs).
- `src/lib/` — layout, theme, fonts, lattice geometry, media slot, definition panel.
- `data/` — everything the videos say and show.

## Commands

- `npm run studio` — Remotion Studio. `npm run validate` — the rules above. `npm run typecheck`.
- No MP4 is rendered. `scripts/review-stills.mjs` renders PNG stills only.
