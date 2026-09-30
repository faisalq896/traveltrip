import React, {useEffect, useState} from 'react';
import {cancelRender, Composition, continueRender, delayRender, Folder} from 'remotion';
import {loadFonts} from './lib/fonts';
import {FPS, H, W} from './lib/layout';
import {frameRange, SingleScene, VideoComposition} from './VideoComposition';
import {videos} from './videos';

const useFonts = () => {
  const [handle] = useState(() => delayRender('fonts'));
  useEffect(() => {
    loadFonts().then(() => continueRender(handle)).catch((e) => cancelRender(e));
  }, [handle]);
};

export const RemotionRoot: React.FC = () => {
  useFonts();
  return (
    <>
      {videos.map((video) => (
        <React.Fragment key={video.id}>
          <Composition
            id={video.id}
            component={VideoComposition}
            durationInFrames={Math.round(video.durationSec * FPS)}
            fps={FPS}
            width={W}
            height={H}
            defaultProps={{video}}
          />
          {/* One composition per scene, for reviewing a template in isolation. */}
          <Folder name={`${video.id}-scenes`}>
            {video.scenes.map((scene) => (
              <Composition
                key={scene.id}
                id={`${video.id}-${scene.id}`}
                component={SingleScene}
                durationInFrames={frameRange(scene).durationInFrames}
                fps={FPS}
                width={W}
                height={H}
                defaultProps={{scene}}
              />
            ))}
          </Folder>
        </React.Fragment>
      ))}
    </>
  );
};
