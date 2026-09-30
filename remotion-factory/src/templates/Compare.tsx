import React from 'react';
import {random} from 'remotion';
import {ramp, useSceneTime} from '../lib/anim';
import {Label, Stage, TextZone} from '../lib/Frame';
import {CheckIcon, CrossIcon, PencilIcon} from '../lib/icons';
import {cubic, type V3} from '../lib/lattices';
import {LatticeView, type P3, type S3} from '../lib/LatticeView';
import {VisualSlot} from '../lib/Media';
import {COLORS, FONTS} from '../lib/theme';
import type {CompareProps, CompareSide} from '../lib/types';

/** Faint code-drawn backdrop: an ordered lattice, or scattered atoms with no order. */
const Backdrop: React.FC<{kind: 'ordered' | 'scattered'; w: number; h: number}> = ({kind, w, h}) => {
  const t = useSceneTime();
  const lat = cubic(4, 3, 3);
  const points: P3[] = lat.atoms.map((a, n) => {
    if (kind === 'ordered') return {p: a.p, r: 11, opacity: 0.45, color: COLORS.teal};
    const p: V3 = [(random(`bx${n}`) - 0.5) * 6, (random(`by${n}`) - 0.5) * 4, (random(`bz${n}`) - 0.5) * 4];
    const ph = random(`bp${n}`) * 6.28;
    return {p: [p[0] + Math.sin(t * 1.2 + ph) * 0.2, p[1] + Math.cos(t + ph) * 0.2, p[2]], r: 11, opacity: 0.4, color: COLORS.rose};
  });
  const segments: S3[] = kind === 'ordered' ? lat.bonds.map(([x, y]) => ({a: lat.atoms[x].p, b: lat.atoms[y].p, color: COLORS.teal, opacity: 0.3, width: 2})) : [];
  return <LatticeView width={w} height={h} points={points} segments={segments} yaw={0.5 + t * 0.1} pitch={0.4} scale={Math.min(w, h) / 6} />;
};

const Panel: React.FC<{side: CompareSide; w: number; h: number; pushIn?: boolean; verdict?: {text: string; ok: boolean; on: number}; qOn?: number}> = ({side, w, h, pushIn, verdict, qOn = 0}) => {
  const t = useSceneTime();
  const zoom = pushIn ? 1 + 0.06 * Math.min(1, t / 8) : 1;
  return (
    <div style={{width: w, height: h, position: 'relative', borderRadius: 28, background: 'rgba(21,50,77,0.6)', border: `2px solid ${COLORS.panelEdge}`, overflow: 'hidden'}}>
      {side.backdrop ? <div style={{position: 'absolute', inset: 0}}><Backdrop kind={side.backdrop} w={w} h={h} /></div> : null}
      <div style={{position: 'absolute', left: 30, right: 30, top: 84, bottom: verdict ? 100 : 30, transform: `scale(${zoom})`}}><VisualSlot visual={side.visual} compact={h < 400} /></div>
      <div style={{position: 'absolute', top: 12, width: '100%', textAlign: 'center'}}><Label size={40} color={COLORS.amber}>{side.title}</Label></div>
      {qOn > 0 ? (
        <div style={{position: 'absolute', top: 40, left: 36, opacity: qOn, transform: `scale(${0.6 + 0.4 * qOn})`, fontFamily: FONTS.display, fontWeight: 700, fontSize: 120, color: COLORS.amber}}>؟</div>
      ) : null}
      {verdict ? (
        <div style={{
          position: 'absolute', bottom: 22, left: '50%', transform: `translateX(-50%) scale(${0.8 + 0.2 * verdict.on})`, opacity: verdict.on,
          display: 'flex', alignItems: 'center', gap: 14, padding: '10px 34px', borderRadius: 60,
          background: verdict.ok ? 'rgba(74,222,128,0.18)' : 'rgba(239,71,111,0.18)', border: `3px solid ${verdict.ok ? COLORS.green : COLORS.rose}`,
        }}>
          {verdict.ok ? <CheckIcon size={44} /> : <CrossIcon size={44} />}
          <Label size={50} color={verdict.ok ? COLORS.green : COLORS.rose}>{verdict.text}</Label>
        </div>
      ) : null}
    </div>
  );
};

export const Compare: React.FC<CompareProps> = (p) => {
  const t = useSceneTime();
  const qOn = p.questionMarkAt !== undefined ? ramp(t, p.questionMarkAt, 0.6) : 0;
  const verdictOn = p.verdicts ? ramp(t, p.verdicts.at, 0.6) : 0;
  const verdict = (i: 0 | 1) => (p.verdicts ? {text: p.verdicts.values[i], ok: p.verdicts.marks[i], on: verdictOn} : undefined);
  const callOn = p.callout ? ramp(t, p.callout.at, 0.7) : 0;

  if (p.mode === 'hero') {
    return (
      <>
        <Stage>
          <div style={{display: 'flex', justifyContent: 'space-between', direction: 'rtl'}}>
            <Panel side={p.sides[0]} w={840} h={688} pushIn={p.pushIn} verdict={verdict(0)} qOn={qOn} />
            <Panel side={p.sides[1]} w={840} h={688} pushIn={p.pushIn} verdict={verdict(1)} />
          </div>
        </Stage>
        {p.callout ? <Callout text={p.callout.text} on={callOn} /> : null}
      </>
    );
  }

  const rows = p.rows ?? [];
  const start = p.rowsAt?.start ?? 0;
  const every = p.rowsAt?.every ?? 1;
  const cols = '560px 584px 584px';
  return (
    <>
      <Stage>
        <div style={{display: 'grid', gridTemplateColumns: cols, direction: 'rtl', height: 300}}>
          <div />
          <div style={{padding: '0 8px'}}><Panel side={p.sides[0]} w={568} h={290} /></div>
          <div style={{padding: '0 8px'}}><Panel side={p.sides[1]} w={568} h={290} /></div>
        </div>
        <div style={{marginTop: 10, borderRadius: 24, overflow: 'hidden', border: `2px solid ${COLORS.panelEdge}`, direction: 'rtl'}}>
          {rows.map((row, n) => {
            const on = ramp(t, start + n * every, 0.6);
            return (
              <div key={n} style={{
                display: 'grid', gridTemplateColumns: cols, opacity: on, transform: `translateY(${(1 - on) * 18}px)`,
                background: n % 2 ? 'rgba(21,50,77,0.55)' : 'rgba(21,50,77,0.85)', minHeight: 80, alignItems: 'center',
              }}>
                <div style={{padding: '8px 24px', fontFamily: FONTS.display, fontWeight: 700, fontSize: 30, color: COLORS.textDim}}>{row.label}</div>
                {row.values.map((v, i) => (
                  <div key={i} style={{padding: '8px 16px', textAlign: 'center', fontSize: 32, fontWeight: 600, color: i === 0 ? COLORS.green : COLORS.rose}}>{v}</div>
                ))}
              </div>
            );
          })}
        </div>
      </Stage>
      {p.callout ? <Callout text={p.callout.text} on={callOn} /> : null}
    </>
  );
};

const Callout: React.FC<{text: string; on: number}> = ({text, on}) => (
  <TextZone style={{alignItems: 'center'}}>
    <div style={{opacity: on, transform: `translateY(${(1 - on) * 20}px)`, display: 'flex', alignItems: 'center', gap: 22, padding: '18px 44px', borderRadius: 60, border: `3px solid ${COLORS.amber}`, background: 'rgba(255,183,3,0.1)'}}>
      <PencilIcon size={64} />
      <Label size={58} color={COLORS.amber}>{text}</Label>
    </div>
  </TextZone>
);
