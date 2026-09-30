import React from 'react';
import {project, type V3} from './lattices';
import {COLORS, FONTS} from './theme';

export type P3 = {p: V3; r?: number; color?: string; opacity?: number; text?: string};
export type S3 = {a: V3; b: V3; color?: string; opacity?: number; width?: number; dashed?: boolean};
export type A3 = {a: V3; b: V3; label: string; color: string; opacity: number};

type Props = {
  width: number;
  height: number;
  points: P3[];
  segments?: S3[];
  arrows?: A3[];
  yaw: number;
  pitch?: number;
  scale: number;
  offset?: [number, number];
};

/** Tiny SVG "3D": orthographic projection, painter's-order depth sort. Enough for ideal lattices. */
export const LatticeView: React.FC<Props> = ({width, height, points, segments = [], arrows = [], yaw, pitch = 0.5, scale, offset = [0, 0]}) => {
  const cx = width / 2 + offset[0];
  const cy = height / 2 + offset[1];
  const pr = (p: V3) => project(p, yaw, pitch, scale, cx, cy);
  const pts = points.map((pt) => ({pt, q: pr(pt.p)})).sort((a, b) => a.q.depth - b.q.depth);
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{overflow: 'visible'}}>
      {segments.map((s, n) => {
        const a = pr(s.a), b = pr(s.b);
        return (
          <line key={`s${n}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={s.color ?? COLORS.panelEdge}
            strokeOpacity={s.opacity ?? 0.9} strokeWidth={s.width ?? 3} strokeDasharray={s.dashed ? '8 8' : undefined} strokeLinecap="round" />
        );
      })}
      {pts.map(({pt, q}, n) => {
        const depthShade = 0.75 + 0.25 * Math.tanh(q.depth / (scale * 2));
        return (
          <g key={`p${n}`} opacity={(pt.opacity ?? 1) * depthShade}>
            <circle cx={q.x} cy={q.y} r={(pt.r ?? 14) * (0.9 + 0.1 * depthShade)} fill={pt.color ?? COLORS.teal} />
            <circle cx={q.x - (pt.r ?? 14) * 0.3} cy={q.y - (pt.r ?? 14) * 0.3} r={(pt.r ?? 14) * 0.28} fill="#fff" fillOpacity={0.45} />
            {pt.text ? (
              <text x={q.x} y={q.y + 6} textAnchor="middle" fontFamily={FONTS.display} fontWeight={800} fontSize={(pt.r ?? 14) * 1.1} fill={COLORS.bg}>{pt.text}</text>
            ) : null}
          </g>
        );
      })}
      {arrows.map((ar, n) => {
        const a = pr(ar.a), b = pr(ar.b);
        const ang = Math.atan2(b.y - a.y, b.x - a.x);
        const hx = (d: number) => b.x - 16 * Math.cos(ang + d);
        const hy = (d: number) => b.y - 16 * Math.sin(ang + d);
        return (
          <g key={`a${n}`} opacity={ar.opacity}>
            <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={ar.color} strokeWidth={4} strokeLinecap="round" />
            <polygon points={`${b.x},${b.y} ${hx(0.45)},${hy(0.45)} ${hx(-0.45)},${hy(-0.45)}`} fill={ar.color} />
            <text x={b.x + 44 * Math.cos(ang)} y={b.y + 34 * Math.sin(ang) + 10} textAnchor="middle" fontFamily={FONTS.display} fontWeight={700} fontSize={34} fill={ar.color} stroke={COLORS.bg} strokeWidth={7} paintOrder="stroke">{ar.label}</text>
          </g>
        );
      })}
    </svg>
  );
};
