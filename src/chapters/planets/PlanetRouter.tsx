import React from 'react';
import PlanetMemos from './PlanetMemos';
import PlanetEcho from './PlanetEcho';
import PlanetBloom from './PlanetBloom';
import PlanetOath from './PlanetOath';
import PlanetEternity from './PlanetEternity';
import PlanetX from './PlanetX';
import PlanetFrequency from './PlanetFrequency';
import PlanetMirror from './PlanetMirror';
import PlanetPlay from './PlanetPlay';
import PlanetScroll from './PlanetScroll';
import PlanetTide from './PlanetTide';
import PlanetVoid from './PlanetVoid';
import PlanetAtlas from './PlanetAtlas';
import PlanetVoices from './PlanetVoices';
import PlanetGeneric from './PlanetGeneric';

interface PlanetRouterProps {
  planetId: string;
}

const PlanetRouter: React.FC<PlanetRouterProps> = ({ planetId }) => {
  switch (planetId) {
    case 'memos':
      return <PlanetMemos />;
    case 'echo':
      return <PlanetEcho />;
    case 'voices':
      return <PlanetVoices />;
    case 'bloom':
      return <PlanetBloom />;
    case 'oath':
      return <PlanetOath />;
    case 'eternity':
      return <PlanetEternity />;
    case 'planetx':
      return <PlanetX />;
    case 'frequency':
      return <PlanetFrequency />;
    case 'mirror':
      return <PlanetMirror />;
    case 'play':
      return <PlanetPlay />;
    case 'scroll':
      return <PlanetScroll />;
    case 'tide':
      return <PlanetTide />;
    case 'void':
      return <PlanetVoid />;
    case 'atlas':
      return <PlanetAtlas />;
    default:
      return (
        <PlanetGeneric
          emoji="🌌"
          title={planetId.toUpperCase()}
          subtitle="A world of its own"
          color="#9b7bff"
          content="This world is still forming. Check back soon."
        />
      );
  }
};

export default PlanetRouter;
