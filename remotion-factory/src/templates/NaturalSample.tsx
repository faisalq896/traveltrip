import React from 'react';
import {ramp, useSceneTime} from '../lib/anim';
import {Label, Stage, TextZone} from '../lib/Frame';
import {VisualSlot} from '../lib/Media';
import {COLORS, FONTS} from '../lib/theme';
import type {NaturalSampleProps, SampleCard} from '../lib/types';

/** Real specimens. Shown only after the ideal shape has explained the concept (see scripts/validate.ts). */
export const NaturalSample: React.FC<NaturalSampleProps> = (p) => {
  const t = useSceneTime();
  if (p.layout === 'single') {
    const on = ramp(t, 0.3, 0.8);
    return (
      <Stage>
        <div style={{position: 'absolute', top: 0, width: '100%', textAlign: 'center', opacity: on}}>
          <Label size={64} color={COLORS.amber}>{p.title}</Label>
        </div>
        <div style={{position: 'absolute', left: 420, top: 100, width: 888, height: 490, opacity: on, transform: `scale(${0.94 + 0.06 * on})`}}>
          <VisualSlot visual={p.sample.visual} />
        </div>
        <div style={{position: 'absolute', bottom: 0, width: '100%', textAlign: 'center', opacity: on}}>
          <Label size={54}>{p.sample.name}</Label>
        </div>
      </Stage>
    );
  }

  const active = p.flipAt.reduce((acc, at, n) => (t >= at ? n : acc), -1);
  const cardW = 408;
  const card = (c: SampleCard, n: number) => {
    const flip = ramp(t, p.flipAt[n] ?? 999, 0.8);
    const isActive = n === active;
    return (
      <div key={c.name} style={{width: cardW, height: 600, perspective: 1400, opacity: 0.35 + 0.65 * Math.max(flip, 0)}}>
        <div style={{
          width: '100%', height: '100%', transform: `rotateY(${(1 - flip) * 180}deg) scale(${isActive ? 1.03 : 1})`, transformStyle: 'preserve-3d', position: 'relative',
        }}>
          <div style={{position: 'absolute', inset: 0, backfaceVisibility: 'hidden', borderRadius: 28, background: COLORS.panel, border: `3px solid ${isActive ? COLORS.amber : COLORS.panelEdge}`, overflow: 'hidden'}}>
            <div style={{textAlign: 'center', paddingTop: 14}}><Label size={44} color={COLORS.amber}>{c.name}</Label></div>
            <div style={{position: 'absolute', left: 16, right: 16, top: 70, height: 190}}><VisualSlot visual={c.visual} compact /></div>
            <div style={{position: 'absolute', left: 20, right: 20, top: 276, display: 'flex', flexDirection: 'column', gap: 8}}>
              {(c.properties ?? []).map((pr) => (
                <div key={pr} style={{fontSize: 30, fontWeight: 600, textAlign: 'center', background: 'rgba(255,255,255,0.06)', borderRadius: 14, padding: '6px 10px'}}>{pr}</div>
              ))}
            </div>
            {c.bond ? (
              <div style={{position: 'absolute', bottom: 14, width: '100%', textAlign: 'center', fontFamily: FONTS.display, fontWeight: 700, fontSize: 32, color: COLORS.teal}}>
                {p.bondLabel}: {c.bond}
              </div>
            ) : null}
          </div>
          <div style={{position: 'absolute', inset: 0, backfaceVisibility: 'hidden', transform: 'rotateY(180deg)', borderRadius: 28, background: COLORS.bgSoft, border: `3px solid ${COLORS.panelEdge}`}} />
        </div>
      </div>
    );
  };
  const tagOn = ramp(t, 0.2, 0.6);
  return (
    <>
      <Stage>
        {p.tag ? (
          <div style={{position: 'absolute', top: -4, right: 0, opacity: tagOn, padding: '8px 30px', borderRadius: 40, background: COLORS.amber, color: COLORS.bg}}>
            <Label size={34} color={COLORS.bg}>{p.tag}</Label>
          </div>
        ) : null}
        <div style={{position: 'absolute', top: 80, left: 0, width: '100%', display: 'flex', justifyContent: 'space-between', direction: 'rtl'}}>
          {p.cards.map(card)}
        </div>
      </Stage>
      <TextZone />
    </>
  );
};
