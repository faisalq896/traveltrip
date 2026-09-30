// Review helper: renders PNG stills (never video) of chosen moments, for eyeballing layout.
//   node scripts/review-stills.mjs [sceneId=sec,sec ...]   e.g.  m3=5,20  m8=30
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';
import path from 'node:path';
import fs from 'node:fs';

const browserExecutable = process.env.BROWSER_EXECUTABLE ?? undefined;
const args = process.argv.slice(2).map((a) => {
  const [id, secs] = a.split('=');
  return [id, secs.split(',').map(Number)];
});
const out = path.resolve('out/stills');
fs.mkdirSync(out, {recursive: true});
const serveUrl = await bundle({entryPoint: path.resolve('src/index.ts')});
for (const [id, secs] of args) {
  const composition = await selectComposition({serveUrl, id: `U2-L4-A-${id}`, browserExecutable});
  for (const s of secs) {
    const frame = Math.min(composition.durationInFrames - 1, Math.round(s * composition.fps));
    const output = path.join(out, `${id}_${String(s).replace('.', 'p')}s.png`);
    await renderStill({composition, serveUrl, output, frame, browserExecutable});
    console.log('wrote', output);
  }
}
