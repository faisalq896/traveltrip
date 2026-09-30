import {loadFont} from '@remotion/google-fonts/IBMPlexSansArabic';

// The project font (CLAUDE.md: IBM Plex Sans Arabic via @remotion/google-fonts).
export const loadFonts = () =>
  loadFont('normal', {weights: ['400', '600', '700'], subsets: ['arabic', 'latin']}).waitUntilDone();
