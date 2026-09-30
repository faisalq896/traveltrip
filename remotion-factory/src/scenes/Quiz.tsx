import React from 'react';
import {ramp, useSceneTime} from '../lib/anim';
import {Label, Stage, TextZone} from '../lib/Frame';
import {PencilIcon} from '../lib/icons';
import {COLORS, FONTS} from '../lib/theme';
import type {QuizProps} from '../lib/types';

/** Quick questions with a per-question countdown, then the answer, then the homework card. */
export const Quiz: React.FC<QuizProps> = ({questions, countdownSec, answerSec, homework}) => {
  const t = useSceneTime();
  const per = countdownSec + answerSec;
  const qIndex = Math.min(questions.length - 1, Math.floor(t / per));
  const inQuiz = t < per * questions.length;
  const local = t - qIndex * per;
  const counting = local < countdownSec;
  const remaining = Math.max(1, Math.ceil(countdownSec - local));
  const q = questions[qIndex];
  const qOn = ramp(local, 0, 0.5);
  const aOn = ramp(local, countdownSec, 0.5);
  const hwOn = ramp(t, per * questions.length + 0.2, 0.7);
  return (
    <>
      <Stage>
        {inQuiz ? (
          <div style={{position: 'absolute', inset: 0, opacity: qOn, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 34}}>
            <div style={{fontFamily: FONTS.display, fontSize: 40, color: COLORS.textDim}}>سؤال {qIndex + 1} / {questions.length}</div>
            <div style={{maxWidth: 1500, textAlign: 'center'}}><Label size={72}>{q.q}</Label></div>
            {counting ? (
              <div style={{width: 180, height: 180, borderRadius: '50%', border: `8px solid ${COLORS.amber}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONTS.display, fontWeight: 700, fontSize: 110, color: COLORS.amber}}>{remaining}</div>
            ) : (
              <div style={{opacity: aOn, transform: `scale(${0.9 + 0.1 * aOn})`, padding: '14px 44px', borderRadius: 30, border: `4px solid ${COLORS.green}`, background: 'rgba(74,222,128,0.12)'}}>
                <Label size={62} color={COLORS.green}>{q.a}</Label>
              </div>
            )}
          </div>
        ) : null}
        {!inQuiz && homework ? (
          <div style={{position: 'absolute', inset: 0, opacity: hwOn, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 30}}>
            <PencilIcon size={120} />
            <Label size={64} color={COLORS.amber}>{homework.label}</Label>
            <div style={{maxWidth: 1400, textAlign: 'center'}}><Label size={58} weight={600}>{homework.text}</Label></div>
          </div>
        ) : null}
      </Stage>
      <TextZone />
    </>
  );
};
