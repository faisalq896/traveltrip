import React from 'react';
import definitions from '../../data/definitions/U2-L4.json';
import {ramp, useSceneTime} from './anim';
import {TextZone} from './Frame';
import {BookIcon} from './icons';
import type {DefinitionEntry, DefinitionRef} from './types';
import {COLORS, FONTS} from './theme';

const book = definitions as Record<string, DefinitionEntry>;

export const bookText = (id: string) => book[id]?.text;

/** The term is only prefixed when the book sentence itself does not name it. */
export const needsTermLabel = (e: DefinitionEntry) => !e.text.includes(e.term);

const renderWithHighlights = (text: string, highlights: {text: string; at: number}[], t: number) => {
  // Split on the highlight substrings; the visible characters stay exactly the book's.
  const marks = highlights
    .map((h) => ({...h, idx: text.indexOf(h.text)}))
    .filter((h) => h.idx >= 0)
    .sort((a, b) => a.idx - b.idx);
  const out: React.ReactNode[] = [];
  let cursor = 0;
  marks.forEach((m, n) => {
    if (m.idx < cursor) return;
    out.push(text.slice(cursor, m.idx));
    const on = ramp(t, m.at, 0.5);
    out.push(
      <span key={n} style={{
        color: on > 0.01 ? COLORS.amber : 'inherit', fontWeight: 700,
        background: `rgba(255,183,3,${0.16 * on})`, borderRadius: 8, padding: '0 6px',
      }}>{m.text}</span>,
    );
    cursor = m.idx + m.text.length;
  });
  out.push(text.slice(cursor));
  return out;
};

/**
 * Book definitions are shown exactly as stored in data/definitions — never retyped in a scene.
 * One definition at a time: a later item replaces the earlier one, so the text zone never overflows.
 */
export const DefinitionPanel: React.FC<{definition: DefinitionRef}> = ({definition}) => {
  const t = useSceneTime();
  const items = definition.items;
  const active = items.reduce((acc, it, n) => (t >= it.at ? n : acc), 0);
  const it = items[active];
  const entry = book[it.id];
  if (!entry) return <TextZone><div style={{color: COLORS.rose, fontSize: 30}}>تعريف غير موجود: {it.id}</div></TextZone>;
  const on = ramp(t, it.at, 0.6);
  const label = needsTermLabel(entry) ? entry.term : null;
  const len = entry.text.length + (label?.length ?? 0);
  const size = len < 130 ? 46 : len < 200 ? 40 : 36;
  return (
    <TextZone>
      <div style={{
        opacity: on, transform: `translateY(${(1 - on) * 24}px)`, display: 'flex', gap: 18, alignItems: 'flex-start',
        background: 'rgba(21,50,77,0.85)', border: `2px solid ${COLORS.panelEdge}`, borderRadius: 22, padding: '14px 26px',
      }}>
        <div style={{flex: 'none', marginTop: 8}}><BookIcon size={size * 0.8} /></div>
        <div style={{fontFamily: FONTS.body, fontWeight: 400, fontSize: size, lineHeight: 1.55, direction: 'rtl'}}>
          {label ? <span style={{fontWeight: 700, color: COLORS.teal}}>{label}: </span> : null}
          {renderWithHighlights(entry.text, it.highlights ?? [], t)}
        </div>
      </div>
    </TextZone>
  );
};

export const ScreenText: React.FC<{text: string}> = ({text}) => {
  const t = useSceneTime();
  const on = ramp(t, 0.4, 0.7);
  return (
    <TextZone style={{alignItems: 'center'}}>
      <div style={{
        opacity: on, transform: `scale(${0.96 + 0.04 * on})`, fontFamily: FONTS.display, fontWeight: 700, fontSize: 64,
        lineHeight: 1.4, textAlign: 'center', color: COLORS.text,
      }}>{text}</div>
    </TextZone>
  );
};
