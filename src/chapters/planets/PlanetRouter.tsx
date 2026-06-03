import React, { Suspense, lazy } from 'react';

const components: Record<string, React.LazyExoticComponent<React.FC>> = {
  atlas: lazy(() => import('./PlanetAtlas')),
  bloom: lazy(() => import('./PlanetBloom')),
  frequency: lazy(() => import('./PlanetFrequency')),
  echo: lazy(() => import('./PlanetEcho')),
  tide: lazy(() => import('./PlanetTide')),
  mirror: lazy(() => import('./PlanetMirror')),
  oath: lazy(() => import('./PlanetOath')),
  voices: lazy(() => import('./PlanetVoices')),
  memos: lazy(() => import('./PlanetMemos')),
  void: lazy(() => import('./PlanetVoid')),
  play: lazy(() => import('./PlanetPlay')),
  eternity: lazy(() => import('./PlanetEternity')),
  scroll: lazy(() => import('./PlanetScroll')),
  vault: lazy(() => import('./PlanetVault')),
  return: lazy(() => import('./PlanetReturn')),
};

const Fallback: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="flex flex-col items-center gap-4">
      <div className="flex gap-1.5">
        {[0, 1, 2].map(i => (
          <div
            key={i}
            className="w-2 h-2 rounded-full animate-pulse"
            style={{ background: '#9b7bff', animationDelay: `${i * 0.2}s` }}
          />
        ))}
      </div>
      <p className="font-cinzel text-xs text-gray-600" style={{ letterSpacing: '0.1em' }}>
        ENTERING WORLD...
      </p>
    </div>
  </div>
);

interface PlanetRouterProps {
  planetId: string;
}

const PlanetRouter: React.FC<PlanetRouterProps> = ({ planetId }) => {
  const Component = components[planetId];
  if (!Component) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="font-cormorant text-xl italic text-gray-500">
          This world is still forming...
        </p>
      </div>
    );
  }
  return (
    <Suspense fallback={<Fallback />}>
      <Component />
    </Suspense>
  );
};

export default PlanetRouter;
