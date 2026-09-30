import {Easing, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';

/** Seconds since the current scene started (Sequence resets the frame counter). */
export const useSceneTime = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return frame / fps;
};

export const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

/** 0 → 1 over [from, from+dur] seconds, eased. */
export const ramp = (t: number, from: number, dur = 0.6) =>
  Easing.bezier(0.22, 0.61, 0.36, 1)(clamp01((t - from) / dur));

export const lerp = (a: number, b: number, k: number) => a + (b - a) * k;

export const pulse = (t: number, period = 1.6) => 0.5 + 0.5 * Math.sin((t / period) * Math.PI * 2);

export const fadeInOut = (frame: number, total: number, edge = 8) =>
  interpolate(frame, [0, edge, total - edge, total], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
