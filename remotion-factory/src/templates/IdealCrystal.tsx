import React from 'react';
import {random} from 'remotion';
import {lerp, pulse, ramp, useSceneTime} from '../lib/anim';
import {Label, Stage} from '../lib/Frame';
import {MiniCell} from '../lib/icons';
import {cubic, diamond, graphite, type V3} from '../lib/lattices';
import {LatticeView, type A3, type P3, type S3} from '../lib/LatticeView';
import {VisualSlot} from '../lib/Media';
import {COLORS, FONTS} from '../lib/theme';
import type {IdealCrystalProps} from '../lib/types';

const SW = 1728;
const SH = 688;

const ease = (k: number) => k * k * (3 - 2 * k);

/** 4x3x3 atoms drift freely, then lock into a row, a layer, and a 3D lattice. */
const AtomAssembly: React.FC<Extract<IdealCrystalProps, {kind: 'atomAssembly'}>> = ({labels, timeline, endMedia}) => {
  const t = useSceneTime();
  const lat = cubic(4, 3, 3);
  const rowK = ramp(t, timeline.row, 1.8);
  const layerK = ramp(t, timeline.layer, 1.8);
  const latK = ramp(t, timeline.lattice, 1.8);
  const arrowsK = ramp(t, timeline.arrows, 0.8);
  const fade = endMedia ? 1 - ramp(t, endMedia.at, 1) : 1;
  const mediaK = endMedia ? ramp(t, endMedia.at + 0.4, 1) : 0;

  const lockOf = (i: number, j: number, k: number) => (j === 0 && k === 0 ? rowK : k === 0 ? layerK : latK);
  const morph = lat.atoms.map((a, n) => {
    const rx = (random(`ax${n}`) - 0.5) * 7.5;
    const ry = (random(`ay${n}`) - 0.5) * 4.5;
    const rz = (random(`az${n}`) - 0.5) * 4.5;
    const ph = random(`ph${n}`) * 6.28;
    const drift: V3 = [Math.sin(t * 1.3 + ph) * 0.25, Math.cos(t * 1.1 + ph) * 0.25, Math.sin(t * 0.9 + ph * 2) * 0.25];
    const k = ease(lockOf(a.i, a.j, a.k));
    const free: V3 = [rx + drift[0], ry + drift[1], rz + drift[2]];
    const p: V3 = [lerp(free[0], a.p[0], k), lerp(free[1], a.p[1], k), lerp(free[2], a.p[2], k)];
    const anyStageStarted = t >= timeline.row;
    const dim = anyStageStarted ? lerp(0.32, 1, k) : 1;
    return {p, k, dim, a};
  });
  const points: P3[] = morph.map(({p, dim, k}) => ({p, r: 16, opacity: dim * fade, color: k > 0.98 ? COLORS.teal : '#5EA6C8'}));
  const segments: S3[] = lat.bonds.map(([x, y]) => {
    const kk = Math.min(morph[x].k, morph[y].k);
    return {a: morph[x].p, b: morph[y].p, color: COLORS.teal, opacity: kk * 0.7 * fade, width: 3};
  });
  const O: V3 = [-2.3, -1.6, 1.9];
  const arrows: A3[] = [
    {a: O, b: [2.3, -1.6, 1.9], label: labels.x, color: COLORS.rose, opacity: arrowsK * fade},
    {a: O, b: [-2.3, 1.7, 1.9], label: labels.y, color: COLORS.green, opacity: arrowsK * fade},
    {a: O, b: [-2.3, -1.6, -1.9], label: labels.z, color: COLORS.violet, opacity: arrowsK * fade},
  ];
  const stageLabel = t >= timeline.lattice ? labels.lattice : t >= timeline.layer ? labels.layer : t >= timeline.row ? labels.row : '';
  const labelKey = t >= timeline.lattice ? timeline.lattice : t >= timeline.layer ? timeline.layer : timeline.row;
  const labelOn = stageLabel ? ramp(t, labelKey, 0.5) : 0;
  return (
    <Stage>
      <div style={{position: 'absolute', inset: 0, opacity: fade}}>
        <LatticeView width={SW} height={SH} points={points} segments={segments} arrows={arrows} yaw={0.55 + 0.3 * Math.sin(t * 0.35)} pitch={0.45} scale={125} offset={[0, -20]} />
      </div>
      <div style={{position: 'absolute', top: 12, right: 24, opacity: labelOn * fade}}>
        <Label size={54} color={COLORS.amber}>{stageLabel}</Label>
      </div>
      {endMedia ? (
        <div style={{position: 'absolute', left: 344, top: 10, width: 1040, height: 560, opacity: mediaK, transform: `scale(${0.9 + 0.1 * mediaK})`}}>
          <VisualSlot visual={endMedia.visual} />
          {endMedia.caption ? (
            <div style={{position: 'absolute', top: 580, width: '100%', textAlign: 'center'}}><Label size={46} color={COLORS.amber}>{endMedia.caption}</Label></div>
          ) : null}
        </div>
      ) : null}
    </Stage>
  );
};

/** One unit cell (amber) copies itself along x, then y, then z until it has built the lattice. */
const UnitCellRepeat: React.FC<Extract<IdealCrystalProps, {kind: 'unitCellRepeat'}>> = ({unitLabel, latticeLabel, timeline, count}) => {
  const t = useSceneTime();
  const lat = cubic(3, 3, 3);
  const gx = ramp(t, timeline.growX, 2);
  const gy = ramp(t, timeline.growY, 2);
  const gz = ramp(t, timeline.growZ, 2);
  const grow = [gx, gy, gz];
  const shift = count ? ramp(t, count.at, 1) : 0;
  const vis = lat.atoms.map((a) => {
    const idx = [a.i, a.j, a.k];
    let v = 1;
    const p: V3 = [a.p[0], a.p[1], a.p[2]];
    idx.forEach((ix, ax) => {
      if (ix === 2) {
        v = Math.min(v, grow[ax]);
        p[ax] = lerp(lat.atoms[0].p[ax] + 1, a.p[ax], ease(grow[ax]));
      }
    });
    const inUnit = a.i < 2 && a.j < 2 && a.k < 2;
    return {p, v, inUnit};
  });
  const points: P3[] = vis.map(({p, v, inUnit}) => ({p, r: 15, opacity: v, color: inUnit ? COLORS.amber : COLORS.teal}));
  const segments: S3[] = lat.bonds.map(([x, y]) => {
    const inUnit = vis[x].inUnit && vis[y].inUnit;
    return {a: vis[x].p, b: vis[y].p, opacity: Math.min(vis[x].v, vis[y].v) * (inUnit ? 1 : 0.6), color: inUnit ? COLORS.amber : COLORS.teal, width: inUnit ? 5 : 3};
  });
  const unitOn = ramp(t, 0.3, 0.6) * (1 - ramp(t, timeline.label, 0.5));
  const latOn = ramp(t, timeline.label, 0.6);
  const yaw = 0.6 + 0.3 * Math.sin(t * 0.3);
  return (
    <Stage>
      <div style={{position: 'absolute', inset: 0, transform: `translateX(${-360 * shift}px)`}}>
        <LatticeView width={SW} height={SH} points={points} segments={segments} yaw={yaw} pitch={0.42} scale={150} />
      </div>
      <div style={{position: 'absolute', top: 10, right: 24, opacity: unitOn}}>
        <Label size={54} color={COLORS.amber}>{unitLabel}</Label>
      </div>
      <div style={{position: 'absolute', top: 10, right: 24, opacity: latOn, transform: `translateX(${-360 * shift}px)`}}>
        <Label size={54} color={COLORS.teal}>{latticeLabel}</Label>
      </div>
      {count ? (
        <div style={{position: 'absolute', right: 40, top: 110, width: 640, opacity: shift, transform: `translateX(${(1 - shift) * 80}px)`}}>
          <div style={{display: 'flex', alignItems: 'baseline', gap: 24, justifyContent: 'center'}}>
            <div style={{fontFamily: FONTS.display, fontWeight: 700, fontSize: 200, lineHeight: 1, color: COLORS.amber}}>{count.value}</div>
            <Label size={62} color={COLORS.text}>{count.caption}</Label>
          </div>
          <div style={{display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center', marginTop: 24}}>
            {Array.from({length: count.value}, (_, n) => {
              const on = ramp(t, count.at + 0.6 + n * 0.12, 0.4);
              return <div key={n} style={{opacity: on, transform: `scale(${0.6 + 0.4 * on})`}}><MiniCell size={86} variant={n} color={n % 2 ? COLORS.teal : COLORS.violet} /></div>;
            })}
          </div>
        </div>
      ) : null}
    </Stage>
  );
};

/** Diamond vs graphite: same atom (C), two arrangements — drawn side by side in code. */
const CarbonLattices: React.FC<Extract<IdealCrystalProps, {kind: 'carbonLattices'}>> = ({panels, atomLabel, equalsLabel, notEqualsLabel, notEqualsAt}) => {
  const t = useSceneTime();
  const d = diamond(3);
  const g = graphite();
  const yaw = 0.5 + t * 0.35;
  const build = (l: typeof d, color: string, r: number) => ({
    points: l.atoms.map((a): P3 => ({p: a.p, r, color, text: atomLabel})),
    segments: l.bonds.map(([x, y]): S3 => ({a: l.atoms[x].p, b: l.atoms[y].p, color: '#CFE3F2', opacity: 0.85, width: 4})),
  });
  const dv = build(d, COLORS.teal, 17);
  const gv = build(g, COLORS.violet, 17);
  const eqOn = ramp(t, 1, 0.6);
  const neOn = ramp(t, notEqualsAt, 0.6);
  const panel = (title: string, v: ReturnType<typeof build>, scale: number, at: number) => {
    const on = ramp(t, at, 0.7);
    return (
      <div style={{width: 840, height: 640, opacity: on, position: 'relative'}}>
        <div style={{textAlign: 'center'}}><Label size={50} color={COLORS.amber}>{title}</Label></div>
        <div style={{position: 'absolute', top: 60}}>
          <LatticeView width={840} height={560} points={v.points} segments={v.segments} yaw={yaw} pitch={0.4} scale={scale} />
        </div>
      </div>
    );
  };
  return (
    <Stage>
      <div style={{display: 'flex', justifyContent: 'space-between', direction: 'rtl'}}>
        {panel(panels[0].title, dv, 118, 0.2)}
        {panel(panels[1].title, gv, 78, 0.6)}
      </div>
      <div style={{position: 'absolute', left: 0, width: '100%', top: 250, textAlign: 'center'}}>
        <div style={{opacity: eqOn * (1 - neOn), fontFamily: FONTS.display, fontWeight: 700, fontSize: 84, color: COLORS.text, position: 'absolute', width: '100%'}}>{equalsLabel}</div>
        <div style={{opacity: neOn, fontFamily: FONTS.display, fontWeight: 700, fontSize: 150, color: COLORS.rose, transform: `scale(${1 + 0.05 * pulse(t)})`}}>{notEqualsLabel}</div>
      </div>
    </Stage>
  );
};

export const IdealCrystal: React.FC<IdealCrystalProps> = (props) => {
  switch (props.kind) {
    case 'atomAssembly': return <AtomAssembly {...props} />;
    case 'unitCellRepeat': return <UnitCellRepeat {...props} />;
    case 'carbonLattices': return <CarbonLattices {...props} />;
  }
};
