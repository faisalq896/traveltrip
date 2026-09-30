# Crystal video factory

Four reusable Remotion templates (`IdealCrystal`, `Compare`, `NaturalSample`, `Definition`) driven by data files.
Video **(أ) — U2-L4-A, 4:55, no audio** is assembled in `data/videos/U2-L4-A.json`.

## Open it in Remotion Studio

```bash
cd remotion-factory
npm install
npm run studio          # = npx remotion studio, opens http://localhost:3000
```

In the left sidebar:

- **`U2-L4-A`** — the whole video (295 s, 8850 frames, 1920×1080, 30 fps).
- **`U2-L4-A-scenes/`** — one composition per scene (`m1` … `m9b`), to review a single scene.

Run `npm run validate` first if you edit any data file. Fonts load from Google Fonts, so Studio needs internet.

## What is still missing

`npm run validate` lists them. Until the files exist, their slots show a dashed "أصل ناقص" placeholder:
GLB specimens (halite, quartz, Meshy quartz, graphite, copper), the amethyst photo (fig. 48) and the opal photo (fig. 26).
GLB slots also need a GLB viewer wired in (`@remotion/three`) once the models are added — `src/lib/Media.tsx`.
