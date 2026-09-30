import React from 'react';
import {COLORS} from './theme';

export const BookIcon: React.FC<{size?: number; color?: string}> = ({size = 30, color = COLORS.amber}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.8} strokeLinejoin="round" strokeLinecap="round">
    <path d="M12 6c-1.6-1.3-4-2-8-2v14c4 0 6.4.7 8 2 1.6-1.3 4-2 8-2V4c-4 0-6.4.7-8 2z" />
    <path d="M12 6v14" />
  </svg>
);

export const PencilIcon: React.FC<{size?: number; color?: string}> = ({size = 40, color = COLORS.amber}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.8} strokeLinejoin="round" strokeLinecap="round">
    <path d="M4 20l1-4L17 4l3 3L8 19z" />
    <path d="M14 7l3 3" />
  </svg>
);

export const CheckIcon: React.FC<{size?: number; color?: string}> = ({size = 40, color = COLORS.green}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 12.5l5 5L20 6.5" />
  </svg>
);

export const CrossIcon: React.FC<{size?: number; color?: string}> = ({size = 40, color = COLORS.rose}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.6} strokeLinecap="round">
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
);

/** Small isometric cube glyph — used as the "one of 14" lattice icon. */
export const MiniCell: React.FC<{size?: number; color?: string; variant?: number}> = ({size = 64, color = COLORS.teal, variant = 0}) => {
  const c = size / 2;
  const r = size * 0.36;
  const top = [c, c - r], tr = [c + r * 0.87, c - r / 2], br = [c + r * 0.87, c + r / 2];
  const bot = [c, c + r], bl = [c - r * 0.87, c + r / 2], tl = [c - r * 0.87, c - r / 2], mid = [c, c];
  const line = (a: number[], b: number[]) => <line x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke={color} strokeWidth={1.8} />;
  const dots = [top, tr, br, bot, bl, tl, mid];
  const extra = [
    [], [mid], [], [[c, c - r / 2], [c, c + r / 2]], [[c - r * 0.43, c], [c + r * 0.43, c]],
  ][variant % 5] as number[][];
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {line(top, tr)}{line(tr, br)}{line(br, bot)}{line(bot, bl)}{line(bl, tl)}{line(tl, top)}
      {line(mid, top)}{line(mid, bl)}{line(mid, br)}
      {dots.map((d, n) => <circle key={n} cx={d[0]} cy={d[1]} r={size * 0.04} fill={color} />)}
      {extra.map((d, n) => <circle key={`e${n}`} cx={d[0]} cy={d[1]} r={size * 0.05} fill={COLORS.amber} />)}
    </svg>
  );
};
