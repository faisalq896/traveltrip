import React from 'react';
import {Img, staticFile} from 'remotion';
import assets from '../../data/assets.json';
import type {AssetEntry, Visual} from './types';
import {COLORS, FONTS} from './theme';

const registry = assets as Record<string, AssetEntry>;

export const assetEntry = (id: string): AssetEntry | undefined => registry[id];

const Placeholder: React.FC<{entry?: AssetEntry; id: string; compact?: boolean}> = ({entry, id, compact}) => (
  <div
    style={{
      width: '100%', height: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', gap: compact ? 4 : 10, textAlign: 'center', padding: compact ? 8 : 24,
      border: `3px dashed ${COLORS.amber}`, borderRadius: 24, background: 'rgba(255,183,3,0.06)',
      fontFamily: FONTS.body, color: COLORS.amber,
    }}
  >
    <div style={{fontFamily: FONTS.display, fontSize: compact ? 24 : 34, fontWeight: 700}}>أصل ناقص</div>
    <div style={{fontSize: compact ? 22 : 30, color: COLORS.text}}>{entry?.label ?? id}</div>
    <div style={{fontSize: compact ? 18 : 24, color: COLORS.textDim}}>
      {entry ? `${entry.kind.toUpperCase()} · ${entry.source}` : `غير مسجّل في assets.json: ${id}`}
    </div>
  </div>
);

const GlassShard: React.FC = () => (
  <svg viewBox="0 0 300 260" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
    <defs>
      <linearGradient id="glass" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#BDE8F5" stopOpacity="0.55" />
        <stop offset="1" stopColor="#5AA9C9" stopOpacity="0.18" />
      </linearGradient>
    </defs>
    <polygon points="40,190 95,40 170,90 255,30 270,150 190,225 105,215" fill="url(#glass)" stroke="#CDEFFA" strokeWidth="3" strokeLinejoin="round" />
    <polyline points="95,40 120,140 190,225" fill="none" stroke="#CDEFFA" strokeOpacity="0.5" strokeWidth="2" />
    <polyline points="170,90 120,140 40,190" fill="none" stroke="#CDEFFA" strokeOpacity="0.5" strokeWidth="2" />
    <polyline points="255,30 210,110 270,150" fill="none" stroke="#CDEFFA" strokeOpacity="0.5" strokeWidth="2" />
    <polygon points="110,70 150,105 118,130" fill="#fff" fillOpacity="0.28" />
  </svg>
);

/** Renders a visual slot. Missing assets show a labelled placeholder — never a silent blank. */
export const VisualSlot: React.FC<{visual: Visual; compact?: boolean}> = ({visual, compact}) => {
  if (visual.kind === 'code') return <GlassShard />;
  const entry = registry[visual.id];
  if (!entry || entry.status !== 'ready' || !entry.file) return <Placeholder entry={entry} id={visual.id} compact={compact} />;
  if (entry.kind === 'image' || entry.kind === 'gif') {
    return <Img src={staticFile(entry.file)} style={{width: '100%', height: '100%', objectFit: 'contain', borderRadius: 20}} />;
  }
  // GLB/video need @remotion/three / <OffthreadVideo> wiring once the real files exist.
  return <Placeholder entry={{...entry, label: `${entry.label} (لم يُربط عارض ${entry.kind.toUpperCase()} بعد)`}} id={visual.id} compact={compact} />;
};
