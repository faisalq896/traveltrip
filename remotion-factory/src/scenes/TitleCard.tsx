import React from 'react';
import {ramp, useSceneTime} from '../lib/anim';
import {Label, Stage} from '../lib/Frame';
import {COLORS, FONTS} from '../lib/theme';
import type {TitleCardProps} from '../lib/types';

export const TitleCard: React.FC<TitleCardProps> = ({title, subtitle, code}) => {
  const t = useSceneTime();
  const a = ramp(t, 0.2, 0.9);
  const b = ramp(t, 0.9, 0.9);
  return (
    <Stage style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 28}}>
      <div style={{opacity: a, transform: `translateY(${(1 - a) * 30}px)`}}><Label size={104} weight={700}>{title}</Label></div>
      <div style={{width: 260 * a, height: 6, background: COLORS.amber, borderRadius: 3}} />
      <div style={{opacity: b, transform: `translateY(${(1 - b) * 30}px)`}}><Label size={76} weight={700} color={COLORS.amber}>{subtitle}</Label></div>
      <div style={{opacity: b, fontFamily: FONTS.display, fontSize: 32, color: COLORS.textDim, letterSpacing: 4}}>{code}</div>
    </Stage>
  );
};
