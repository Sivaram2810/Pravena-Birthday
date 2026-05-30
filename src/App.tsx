import React, { Suspense, lazy } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppProvider, useApp } from './contexts/AppContext';
import StarField from './components/StarField';
import GlobalCandle from './components/GlobalCandle';
import AudioPlayer from './components/AudioPlayer';
import ProgressMap from './components/ProgressMap';

// Lazy load heavy chapters
const OpeningSignal = lazy(() => import('./chapters/OpeningSignal'));
const SolarSystem = lazy(() => import('./chapters/SolarSystem'));
const PlanetView = lazy(() => import('./chapters/PlanetView'));

const AppContent: React.FC = () => {
  const { phase, goToSolar, goToPlanet } = useApp();

  return (
    <div
      className="relative min-h-screen overflow-x-hidden"
      style={{ background: '#050816' }}
    >
      {/* Persistent starfield — always renders */}
      <StarField />

      {/* Persistent ambient UI */}
      <GlobalCandle />

      {/* Audio & progress map — shown once past opening */}
      {phase !== 'opening' && (
        <>
          <AudioPlayer />
          <ProgressMap />
        </>
      )}

      {/* Main content — phase-gated with cinematic transitions */}
      <Suspense fallback={null}>
        <AnimatePresence mode="wait">
          {phase === 'opening' && (
            <motion.div
              key="opening"
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              style={{ position: 'relative', zIndex: 10 }}
            >
              <OpeningSignal onComplete={goToSolar} />
            </motion.div>
          )}

          {phase === 'solar' && (
            <motion.div
              key="solar"
              className="relative z-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7 }}
            >
              <SolarSystem onPlanetSelect={goToPlanet} />
            </motion.div>
          )}

          {phase === 'planet' && (
            <motion.div
              key="planet"
              className="relative z-10"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.45 }}
            >
              <PlanetView />
            </motion.div>
          )}
        </AnimatePresence>
      </Suspense>
    </div>
  );
};

const App: React.FC = () => (
  <AppProvider>
    <AppContent />
  </AppProvider>
);

export default App;
