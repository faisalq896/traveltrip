// Enforces the script's rules on the data before anything renders.
//   npm run validate
import assets from '../data/assets.json';
import definitions from '../data/definitions/U2-L4.json';
import a from '../data/videos/U2-L4-A.json';
import type {AssetEntry, DefinitionEntry, Scene, VideoData, Visual} from '../src/lib/types';

const FPS = 30;
const videos = [a as unknown as VideoData];
const registry = assets as Record<string, AssetEntry>;
const book = definitions as Record<string, DefinitionEntry>;

let errors = 0;
const fail = (where: string, msg: string) => {
  errors++;
  console.error(`✗ ${where}: ${msg}`);
};

const visualsOf = (s: Scene): Visual[] => {
  const p: any = s.props;
  const out: Visual[] = [];
  if (p.visual) out.push(p.visual);
  if (p.sides) out.push(...p.sides.map((x: any) => x.visual));
  if (p.sample) out.push(p.sample.visual);
  if (p.cards) out.push(...p.cards.map((x: any) => x.visual));
  if (p.endMedia) out.push(p.endMedia.visual);
  return out;
};

const missing = new Map<string, string[]>();

for (const v of videos) {
  // 1. Timing: contiguous, in order, exactly the script's total.
  let cursor = 0;
  for (const s of v.scenes) {
    if (s.start !== cursor) fail(`${v.id}/${s.id}`, `starts at ${s.start}s but previous scene ended at ${cursor}s`);
    if (s.end <= s.start) fail(`${v.id}/${s.id}`, 'end must be after start');
    cursor = s.end;
  }
  if (cursor !== v.durationSec) fail(v.id, `scenes end at ${cursor}s, video is ${v.durationSec}s`);
  if (!Number.isInteger(v.durationSec * FPS)) fail(v.id, 'duration is not a whole number of frames');

  const idealTopics = new Set<string>();
  for (const s of v.scenes) {
    const where = `${v.id}/${s.id}`;
    const dur = s.end - s.start;

    // 2. Ideal shape first: a real sample only after an ideal scene with the same topic.
    if (s.template === 'IdealCrystal' && s.topic) idealTopics.add(s.topic);
    if (s.template === 'NaturalSample') {
      const p = s.props;
      if (p.standalone) {
        if (!p.standaloneReason) fail(where, 'standalone NaturalSample needs standaloneReason');
      } else if (!s.topic || !idealTopics.has(s.topic)) {
        fail(where, `real sample shown before an IdealCrystal scene with topic "${s.topic}"`);
      }
    }

    // 3. Book definitions: referenced by id, never inlined, highlights are exact substrings.
    if (s.template === 'Definition' && !s.definition) fail(where, 'Definition scene has no scene.definition');
    for (const it of s.definition?.items ?? []) {
      const entry = book[it.id];
      if (!entry) { fail(where, `unknown definition id "${it.id}"`); continue; }
      if (it.at >= dur) fail(where, `definition "${it.id}" appears at ${it.at}s, after the scene ends (${dur}s)`);
      for (const h of it.highlights ?? []) {
        if (!entry.text.includes(h.text)) fail(where, `highlight "${h.text}" is not in the book text of "${it.id}"`);
        if (h.at >= dur) fail(where, `highlight "${h.text}" at ${h.at}s is after the scene ends`);
      }
    }
    if ((s.props as any).text || (s.props as any).definitionText) fail(where, 'inline definition text — use scene.definition');

    // 3b. Simplified models carry the CLAUDE.md caption.
    const hasModel = s.template === 'IdealCrystal' || (s.template === 'Compare' && s.props.sides.some((x) => x.backdrop));
    if (hasModel && !s.modelNote) fail(where, 'simplified model on screen without modelNote (نموذج توضيحي، الأحجام النسبية تقريبية)');

    // 4. Assets used by the scene exist in the manifest.
    for (const vis of visualsOf(s)) {
      if (vis.kind !== 'asset') continue;
      const e = registry[vis.id];
      if (!e) { fail(where, `asset "${vis.id}" is not in data/assets.json`); continue; }
      if (e.status !== 'ready') missing.set(vis.id, [...(missing.get(vis.id) ?? []), s.id]);
    }
  }
}

for (const d of Object.entries(book)) if (!d[1].verifiedAgainstBook) console.warn(`! definition "${d[0]}" not yet checked against the printed book`);
for (const [id, scenes] of missing) console.warn(`! missing asset ${id} (${registry[id].label} — ${registry[id].source}) used in: ${[...new Set(scenes)].join(', ')}`);

if (errors) { console.error(`\n${errors} error(s)`); process.exit(1); }
console.log(`\n✓ ${videos.length} video(s) valid`);
