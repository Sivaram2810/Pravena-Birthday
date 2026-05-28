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
import PlanetGeneric from './PlanetGeneric';

interface PlanetRouterProps {
  planetId: string;
}

const PlanetRouter: React.FC<PlanetRouterProps> = ({ planetId }) => {
  switch (planetId) {
    case 'memos': return <PlanetMemos />;
    case 'echo': return <PlanetEcho />;
    case 'voices': return (
      <PlanetGeneric
        emoji="🟣"
        title="VOICES"
        subtitle="Words whispered across the distance"
        color="#9b7bff"
        content={`In every voice note, in every typed word, in every message sent across miles —\nthe voice of someone who cares never really goes silent.\n\nIt lives in the spaces between conversations.\nIn the way a song sounds different after someone you love mentions it.\nIn the echo of a laugh you remember.\n\nYou are present even in your absence.\nAnd that presence is one of the most beautiful things I know.`}
        features={[
          { icon: '💬', title: 'First Words', desc: 'The conversation that started everything — still alive in memory' },
          { icon: '🌙', title: 'Midnight Messages', desc: 'When everyone else sleeps, some conversations begin' },
          { icon: '🎙️', title: 'Voice Notes', desc: 'Your voice is a whole frequency I never want to stop hearing' },
          { icon: '💌', title: 'Unsent Drafts', desc: 'Some things were felt but never sent — they were still true' },
        ]}
      />
    );
    case 'atlas': return (
      <PlanetGeneric
        emoji="🟡"
        title="ATLAS"
        subtitle="The map of every moment between us"
        color="#f7d774"
        content={`Every memory has coordinates.\n\nOur first date: a location in time that I return to constantly.\nYour childhood picture: somewhere in the early chapters of your story.\nThe day you wore the top I gave you: a landmark I visit every time I need to smile.\n\nIf I could map every moment we have shared, it would be the most beautiful map ever drawn.\nNot because of where we went.\nBut because of who we were when we got there.`}
        features={[
          { icon: '📍', title: 'First Date', desc: 'The coordinates of where everything truly began' },
          { icon: '🎂', title: 'Birthday Dates', desc: 'Every birthday we shared became a landmark in our story' },
          { icon: '🎁', title: 'Gifted Moments', desc: 'The places where I could make you feel loved in small ways' },
          { icon: '🌅', title: 'Future Destinations', desc: 'Every place we have not been yet — but will be' },
        ]}
      />
    );
    case 'chrono': return (
      <PlanetGeneric
        emoji="🌊"
        title="CHRONO"
        subtitle="Frozen moments that never fade"
        color="#00bfff"
        content={`Time is strange.\n\nSome moments feel like they lasted years.\nOther years feel like moments.\n\nThe moments I remember most clearly:\n\nThe first time I saw your childhood photo — the girl who would become my universe.\nThe look in your eyes in that AI image, the one that felt more real than real.\nEvery tiny detail of our last meetup.\n\nTime keeps moving.\nBut some moments are frozen inside me,\nperfectly preserved,\nuntouched by anything that comes after.`}
        features={[
          { icon: '⏸️', title: 'Frozen', desc: 'The moments so good that time paused for a second' },
          { icon: '🔄', title: 'Recurring', desc: 'The memories that come back no matter what' },
          { icon: '📸', title: 'Captured', desc: 'Every photograph holds more than light — it holds truth' },
          { icon: '⏳', title: 'Still Running', desc: 'Some clocks never stop once they start for you' },
        ]}
      />
    );
    case 'void': return <PlanetVoid />;
    case 'bloom': return <PlanetBloom />;
    case 'oath': return <PlanetOath />;
    case 'eternity': return <PlanetEternity />;
    case 'planetx': return <PlanetX />;
    case 'frequency': return <PlanetFrequency />;
    case 'mirror': return <PlanetMirror />;
    case 'play': return <PlanetPlay />;
    case 'scroll': return <PlanetScroll />;
    case 'tide': return <PlanetTide />;
    case 'core': return (
      <PlanetGeneric
        emoji="🧬"
        title="CORE"
        subtitle="The essence of who you are"
        color="#ff6b35"
        content={`At the core of everything you are:\n\nKindness that does not ask for permission.\nStrength that does not need to announce itself.\nBeauty that existed before anyone noticed it.\nIntelligence that moves quietly but goes everywhere.\nA heart that gives more than it takes.\n\nYou are not complicated.\nYou are complete.\n\nAnd the world is richer for every day you exist in it.`}
        features={[
          { icon: '❤️', title: 'Heart', desc: 'Generous beyond measure, soft beyond reason' },
          { icon: '🧠', title: 'Mind', desc: 'Sharp, perceptive, and quietly brilliant' },
          { icon: '🌟', title: 'Spirit', desc: 'The energy that changes every room she enters' },
          { icon: '💎', title: 'Soul', desc: 'Rare. Irreplaceable. Worth more than anything.' },
        ]}
      />
    );
    case 'rewind': return (
      <PlanetGeneric
        emoji="🕰️"
        title="REWIND"
        subtitle="Moments played back in slow motion"
        color="#8b6914"
        features={[
          { icon: '👧', title: 'Little Pravena', desc: 'The childhood photo that made my heart fold in half' },
          { icon: '📱', title: 'First Phone', desc: 'The first picture she sent — the beginning of her digital world and mine' },
          { icon: '👘', title: 'The Saree', desc: 'The moment I saw her in that saree and time genuinely stopped' },
          { icon: '🎂', title: 'Birthday Date', desc: 'Her birthday — when she still made time for a small date with me' },
          { icon: '🎁', title: 'The Gift', desc: 'Seeing her wear what I gave her — no feeling compares' },
          { icon: '📸', title: 'Last Meetup', desc: 'My birthday, her presence — the most treasured memory I carry' },
        ]}
      />
    );
    case 'spectrum': return (
      <PlanetGeneric
        emoji="🌈"
        title="SPECTRUM"
        subtitle="Every colour of who she is"
        color="#ff0080"
        features={[
          { icon: '🔴', title: 'Passion', desc: 'The intensity she brings to everything she cares about' },
          { icon: '🟠', title: 'Warmth', desc: 'The way she makes people feel seen and safe' },
          { icon: '🟡', title: 'Joy', desc: 'Her laugh. Her smile. The brightness she radiates.' },
          { icon: '🟢', title: 'Growth', desc: 'The constant evolution — every version better than the last' },
          { icon: '🔵', title: 'Depth', desc: 'The quiet complexity beneath the surface' },
          { icon: '🟣', title: 'Mystery', desc: 'The parts still being discovered. Still worth discovering.' },
          { icon: '⚪', title: 'Purity', desc: 'An honesty and realness that is rare in this world' },
          { icon: '✨', title: 'All of it', desc: 'Together — she is the full spectrum. Nothing missing.' },
        ]}
      />
    );
    default:
      return (
        <PlanetGeneric
          emoji="🌌"
          title={planetId.toUpperCase()}
          subtitle="A world still being explored"
          color="#9b7bff"
          content="This world is still forming. Check back soon — the universe is always expanding."
        />
      );
  }
};

export default PlanetRouter;
