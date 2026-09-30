// Builds RECORDING_SHEET.md from the video data — rerun after any data change:
//   npm run sheet
import fs from 'node:fs';
import definitions from '../data/definitions/U2-L4.json';
import a from '../data/videos/U2-L4-A.json';
import type {DefinitionEntry, Scene, VideoData} from '../src/lib/types';

const video = a as unknown as VideoData;
const book = definitions as Record<string, DefinitionEntry>;

const mmss = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
const group = (id: string) => id.replace(/[a-z]$/, ''); // m4a, m4b -> m4

const onScreen = (s: Scene): string => {
  const p: any = s.props;
  const parts: string[] = [];
  switch (s.template) {
    case 'Compare':
      parts.push(p.mode === 'table'
        ? `جدول مقارنة: ${p.sides[0].title} | ${p.sides[1].title} (${p.rows?.length ?? 0} صفوف تظهر بالتتابع)`
        : `مقارنة: ${p.sides[0].title} | ${p.sides[1].title}`);
      if (p.verdicts) parts.push(`الحكم: ${p.verdicts.values.join(' / ')}`);
      if (p.callout) parts.push(`«${p.callout.text}»`);
      break;
    case 'TitleCard': parts.push(`العنوان: ${p.title} ${p.subtitle}`); break;
    case 'IdealCrystal':
      if (p.kind === 'atomAssembly') parts.push(`شكل مثالي: ذرّات تترتّب ${p.labels.row} ← ${p.labels.layer} ← ${p.labels.lattice}${p.endMedia ? `، ثم صورة: ${p.endMedia.caption ?? ''}` : ''}`);
      if (p.kind === 'unitCellRepeat') parts.push(`شكل مثالي: ${p.unitLabel} تتكرّر ← ${p.latticeLabel}${p.count ? `، ثم ${p.count.value} ${p.count.caption}` : ''}`);
      if (p.kind === 'carbonLattices') parts.push(`شكل مثالي: شبكتا ${p.panels[0].title} و${p.panels[1].title}، ${p.equalsLabel} ثم ${p.notEqualsLabel}`);
      break;
    case 'NaturalSample':
      parts.push(p.layout === 'single'
        ? `${p.title}: ${p.sample.name}`
        : `${p.tag ? `[${p.tag}] ` : ''}بطاقات: ${p.cards.map((c: any) => `${c.name} (${c.bond})`).join('، ')}`);
      break;
    case 'Definition': parts.push(`${p.term}${p.keywords?.length ? ` + ${p.keywords.map((k: any) => k.text).join(' • ')}` : ''}`); break;
    case 'LessonMap': parts.push(`خريطة الدرس، الفرع (${p.highlight}) مضاء`); break;
    case 'Quiz': parts.push(`${p.questions.length} أسئلة (عدّاد ${p.countdownSec} ث) ثم الواجب`); break;
  }
  if (s.screenText) parts.push(`نص الشاشة: «${s.screenText}»`);
  return parts.join('؛ ');
};

const star = (id: string) => {
  const e = book[id];
  return e ? `⭐ «${e.text}»` : `⭐ [تعريف غير موجود: ${id}]`;
};

/** Narration with each [قراءة ...] marker replaced by the verbatim definition(s) of that scene. */
const script = (s: Scene): string[] => {
  const ids = (s.definition?.items ?? []).map((i) => i.id);
  const lines: string[] = [];
  let used = 0;
  for (const piece of s.narration.split(/(\[قراءة[^\]]*\])/)) {
    if (/^\[قراءة/.test(piece)) {
      if (used < ids.length) lines.push(star(ids[used++]));
    } else if (piece.trim()) lines.push(piece.trim());
  }
  for (const id of ids.slice(used)) lines.push(`${star(id)} — يظهر على الشاشة، بدون موضع قراءة في النص`);
  return lines;
};

const groups = new Map<string, Scene[]>();
for (const s of video.scenes) groups.set(group(s.id), [...(groups.get(group(s.id)) ?? []), s]);

const unverified = Object.entries(book).filter(([, e]) => !e.verifiedAgainstBook).map(([id]) => id);
const out: string[] = [
  `# ورقة التسجيل — ${video.title}`,
  '',
  `${video.id} · ${mmss(video.durationSec)} · مولّدة من \`data/\` بـ \`npm run sheet\` — لا تعدّلها يدويًا.`,
  '',
  '⭐ = تعريف من الكتاب، يُقرأ حرفيًا بالفصحى كما يظهر على الشاشة.',
  '',
];
if (unverified.length) out.push(`> ⚠️ تعريفات لم تُطابَق مع المرجع بعد: ${unverified.join('، ')}`, '');

for (const [g, scenes] of groups) {
  const first = scenes[0];
  const last = scenes[scenes.length - 1];
  out.push('---', '', `## م${g.slice(1)} · ${mmss(first.start)}–${mmss(last.end)}`, '');
  out.push('**على الشاشة:**', '');
  for (const s of scenes) out.push(`- ${scenes.length > 1 ? `\`${s.id}\` ` : ''}${onScreen(s)}`);
  out.push('', '**النص:**', '');
  const lines = scenes.flatMap(script);
  out.push(...(lines.length ? lines.map((l) => `> ${l}`) : ['> —']), '');
}

fs.writeFileSync('RECORDING_SHEET.md', out.join('\n'));
console.log(`wrote RECORDING_SHEET.md (${groups.size} scenes)`);
