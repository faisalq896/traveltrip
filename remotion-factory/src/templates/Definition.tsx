import React from 'react';
import {ramp, useSceneTime} from '../lib/anim';
import {Label, Stage} from '../lib/Frame';
import {VisualSlot} from '../lib/Media';
import {COLORS, FONTS} from '../lib/theme';
import type {DefinitionProps} from '../lib/types';

/**
 * Stage side of a definition scene: the term, its keyword chips and an optional specimen.
 * The book text itself comes from scene.definition (data/definitions) and is drawn in the text zone.
 */
export const Definition: React.FC<DefinitionProps> = ({term, keywords = [], visual}) => {
  const t = useSceneTime();
  const termOn = ramp(t, 0.2, 0.7);
  return (
    <Stage>
      {visual ? (
        <div style={{position: 'absolute', left: 0, top: 0, width: 760, height: 688, opacity: termOn}}><VisualSlot visual={visual} /></div>
      ) : null}
      <div style={{position: 'absolute', right: 0, top: 0, width: visual ? 920 : 1728, height: 688, display: 'flex', flexDirection: 'column', alignItems: visual ? 'flex-start' : 'center', justifyContent: 'center', gap: 34}}>
        <div style={{opacity: termOn, transform: `translateY(${(1 - termOn) * 20}px)`}}>
          <Label size={110} weight={800} color={COLORS.amber}>{term}</Label>
        </div>
        <div style={{display: 'flex', flexDirection: visual ? 'column' : 'row', gap: 22, alignItems: 'center'}}>
          {keywords.map((k, n) => {
            const on = ramp(t, k.at, 0.6);
            return (
              <React.Fragment key={k.text}>
                {n > 0 && !visual ? <div style={{opacity: on, color: COLORS.textDim, fontSize: 40}}>•</div> : null}
                <div style={{
                  opacity: on, transform: `scale(${0.85 + 0.15 * on})`, padding: '14px 38px', borderRadius: 60,
                  border: `3px solid ${COLORS.teal}`, background: 'rgba(46,196,182,0.12)', fontFamily: FONTS.display, fontWeight: 700, fontSize: 56,
                }}>{k.text}</div>
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </Stage>
  );
};
