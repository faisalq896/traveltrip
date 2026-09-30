import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {fadeInOut} from './anim';
import {STAGE, TEXT_ZONE} from './layout';
import {COLORS, FONTS} from './theme';

export const SceneFrame: React.FC<{children: React.ReactNode}> = ({children}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(1200px 700px at 50% 30%, ${COLORS.bgSoft}, ${COLORS.bg})`,
        fontFamily: FONTS.body,
        color: COLORS.text,
        direction: 'rtl',
        opacity: fadeInOut(frame, durationInFrames, 6),
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

export const Stage: React.FC<{children: React.ReactNode; style?: React.CSSProperties}> = ({children, style}) => (
  <div style={{position: 'absolute', left: STAGE.x, top: STAGE.y, width: STAGE.w, height: STAGE.h, ...style}}>
    {children}
  </div>
);

/** The reserved band for sentences. Visuals never draw here. */
export const TextZone: React.FC<{children?: React.ReactNode; style?: React.CSSProperties}> = ({children, style}) => (
  <div
    style={{
      position: 'absolute',
      left: TEXT_ZONE.x,
      top: TEXT_ZONE.y,
      width: TEXT_ZONE.w,
      height: TEXT_ZONE.h,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      ...style,
    }}
  >
    {children}
  </div>
);

export const Label: React.FC<{children: React.ReactNode; color?: string; size?: number; weight?: number; style?: React.CSSProperties}> = ({
  children, color = COLORS.text, size = 40, weight = 700, style,
}) => (
  <div style={{fontFamily: FONTS.display, fontSize: size, fontWeight: weight, color, lineHeight: 1.35, ...style}}>{children}</div>
);
