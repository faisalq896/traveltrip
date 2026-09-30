// Fixed 1920x1080 frame. Visuals live in STAGE; sentences (screen text, book
// definitions) live only in TEXT_ZONE, which no visual may cover.
export const W = 1920;
export const H = 1080;
export const FPS = 30;

export const STAGE = {x: 96, y: 48, w: 1728, h: 688} as const;
export const TEXT_ZONE = {x: 96, y: 760, w: 1728, h: 272} as const;
