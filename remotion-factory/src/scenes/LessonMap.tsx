import React from 'react';
import {pulse, ramp, useSceneTime} from '../lib/anim';
import {Label, Stage} from '../lib/Frame';
import {COLORS, FONTS} from '../lib/theme';
import type {LessonMapProps} from '../lib/types';

/** Lesson map: root + four branches; one branch glows, and its children can fill in later. */
export const LessonMap: React.FC<LessonMapProps> = ({root, branches, highlight, highlightLabel, fillChildrenAt}) => {
  const t = useSceneTime();
  const rootOn = ramp(t, 0.2, 0.6);
  const n = branches.length;
  const bw = 380;
  const gap = (1728 - n * bw) / (n - 1);
  const xOf = (i: number) => 1728 - bw - i * (bw + gap); // index 0 at the right (RTL)
  return (
    <Stage>
      <div style={{position: 'absolute', left: 1728 / 2 - 380, width: 760, top: 10, opacity: rootOn, textAlign: 'center', padding: '20px 0', borderRadius: 28, background: COLORS.panel, border: `3px solid ${COLORS.panelEdge}`}}>
        <Label size={58}>{root}</Label>
      </div>
      <svg width={1728} height={688} style={{position: 'absolute', inset: 0}}>
        {branches.map((b, i) => {
          const on = ramp(t, 0.6 + i * 0.25, 0.5);
          const hot = b.key === highlight;
          return <path key={b.key} d={`M 864 118 C 864 190, ${xOf(i) + bw / 2} 170, ${xOf(i) + bw / 2} 236`} stroke={hot ? COLORS.amber : COLORS.panelEdge} strokeWidth={hot ? 6 : 4} fill="none" opacity={on} />;
        })}
      </svg>
      {branches.map((b, i) => {
        const on = ramp(t, 0.8 + i * 0.25, 0.6);
        const hot = b.key === highlight;
        const glow = hot ? ramp(t, 3, 0.8) * (0.6 + 0.4 * pulse(t)) : 0;
        const fill = hot && fillChildrenAt !== undefined ? ramp(t, fillChildrenAt, 0.8) : 0;
        return (
          <div key={b.key} style={{position: 'absolute', left: xOf(i), top: 236, width: bw, opacity: on, transform: `translateY(${(1 - on) * 24}px)`}}>
            <div style={{
              padding: '22px 12px', textAlign: 'center', borderRadius: 26, background: hot ? `rgba(255,183,3,${0.12 + 0.12 * glow})` : COLORS.panel,
              border: `4px solid ${hot ? COLORS.amber : COLORS.panelEdge}`, boxShadow: hot ? `0 0 ${50 * glow}px ${COLORS.amber}` : 'none',
            }}>
              <div style={{fontFamily: FONTS.display, fontWeight: 800, fontSize: 60, color: hot ? COLORS.amber : COLORS.textDim}}>({b.key})</div>
              <Label size={44}>{b.label}</Label>
            </div>
            {hot && highlightLabel ? (
              <div style={{textAlign: 'center', marginTop: 16, opacity: glow}}><Label size={40} color={COLORS.amber}>{highlightLabel}</Label></div>
            ) : null}
            {hot && b.children ? (
              <div style={{marginTop: 26, display: 'flex', flexDirection: 'column', gap: 14}}>
                {b.children.map((c, ci) => (
                  <div key={c} style={{
                    textAlign: 'center', padding: '12px 10px', borderRadius: 18, fontSize: 38, fontWeight: 600,
                    border: `3px dashed ${COLORS.teal}`, background: `rgba(46,196,182,${0.2 * ramp(t, (fillChildrenAt ?? 999) + ci * 0.6, 0.6)})`,
                    color: fill > 0 ? COLORS.text : COLORS.textDim, opacity: 0.45 + 0.55 * ramp(t, (fillChildrenAt ?? 999) + ci * 0.6, 0.6),
                  }}>{c}</div>
                ))}
              </div>
            ) : null}
          </div>
        );
      })}
    </Stage>
  );
};
