import React from 'react';
import {AbsoluteFill, Sequence} from 'remotion';
import {DefinitionPanel, ScreenText} from './lib/DefinitionPanel';
import {SceneFrame} from './lib/Frame';
import {FPS} from './lib/layout';
import {COLORS} from './lib/theme';
import type {Scene, VideoData} from './lib/types';
import {Compare} from './templates/Compare';
import {Definition} from './templates/Definition';
import {IdealCrystal} from './templates/IdealCrystal';
import {NaturalSample} from './templates/NaturalSample';
import {LessonMap} from './scenes/LessonMap';
import {Quiz} from './scenes/Quiz';
import {TitleCard} from './scenes/TitleCard';

export const frameRange = (s: Pick<Scene, 'start' | 'end'>) => {
  // Round the boundaries, not the durations, so scenes stay contiguous with no drift.
  const from = Math.round(s.start * FPS);
  return {from, durationInFrames: Math.round(s.end * FPS) - from};
};

export const SceneView: React.FC<{scene: Scene}> = ({scene}) => (
  <SceneFrame>
    {scene.template === 'IdealCrystal' && <IdealCrystal {...scene.props} />}
    {scene.template === 'Compare' && <Compare {...scene.props} />}
    {scene.template === 'NaturalSample' && <NaturalSample {...scene.props} />}
    {scene.template === 'Definition' && <Definition {...scene.props} />}
    {scene.template === 'TitleCard' && <TitleCard {...scene.props} />}
    {scene.template === 'LessonMap' && <LessonMap {...scene.props} />}
    {scene.template === 'Quiz' && <Quiz {...scene.props} />}
    {scene.definition ? <DefinitionPanel definition={scene.definition} /> : null}
    {scene.screenText ? <ScreenText text={scene.screenText} /> : null}
  </SceneFrame>
);

export const VideoComposition: React.FC<{video: VideoData}> = ({video}) => (
  <AbsoluteFill style={{background: COLORS.bg}}>
    {video.scenes.map((scene) => {
      const {from, durationInFrames} = frameRange(scene);
      return (
        <Sequence key={scene.id} from={from} durationInFrames={durationInFrames} name={`${scene.id} · ${scene.template}`} layout="none">
          <SceneView scene={scene} />
        </Sequence>
      );
    })}
  </AbsoluteFill>
);

export const SingleScene: React.FC<{scene: Scene}> = ({scene}) => <SceneView scene={scene} />;
