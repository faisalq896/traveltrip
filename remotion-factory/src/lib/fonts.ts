import {loadFont} from '@remotion/fonts';
import {staticFile} from 'remotion';

const faces = [
  ['Noto Kufi Arabic', 400], ['Noto Kufi Arabic', 700], ['Noto Kufi Arabic', 800],
  ['IBM Plex Sans Arabic', 400], ['IBM Plex Sans Arabic', 600],
] as const;

const files: Record<string, string> = {
  'Noto Kufi Arabic': 'noto-kufi-arabic',
  'IBM Plex Sans Arabic': 'ibm-plex-sans-arabic',
};

// Latin subset first, Arabic second: unicode-range keeps each glyph on the right face.
const ranges = {
  arabic: 'U+0600-06FF, U+0750-077F, U+0870-088E, U+0890-0891, U+0897-08E1, U+08E3-08FF, U+200C-200E, U+2010-2011, U+204F, U+2E41, U+FB50-FDFF, U+FE70-FE74, U+FE76-FEFC',
  latin: 'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD',
};

export const loadFonts = () =>
  Promise.all(
    faces.flatMap(([family, weight]) =>
      (['arabic', 'latin'] as const).map((subset) =>
        loadFont({
          family,
          weight: String(weight),
          url: staticFile(`fonts/${files[family]}-${subset}-${weight}-normal.woff2`),
          unicodeRange: ranges[subset],
        }),
      ),
    ),
  );
