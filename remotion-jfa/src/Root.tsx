import {Composition} from 'remotion';
import {Film} from './Film';

// 30 s, vertical 9:16 (iPhone), 30 fps.
export const RemotionRoot: React.FC = () => (
  <Composition id="EnergiaQueViraSom" component={Film} durationInFrames={900} fps={30} width={1080} height={1920} />
);
