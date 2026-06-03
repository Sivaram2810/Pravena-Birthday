import React, { Suspense, lazy } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppProvider, useApp } from './contexts/AppContext';
import StarField from './components/StarField';
import AudioPlayer from './components/AudioPlayer';
import ProgressMap from './components/ProgressMap';

const OpeningSignal = lazy(() => import('./chapters/OpeningSignal'));
const SolarSystem = lazy(() => import('./chapters/SolarSystem'));
const PlanetView = lazy(() => import('./chapters/PlanetView'));

const AppContent: React.FC = () => {
  const { phase, goToSolar, goToPlanet } = useApp();

  return (
    <div className="relative min-h-screen" style={{ background: '#050816' }}>
      {/* Persistent space background */}
      <StarField />

      {/* Persistent UI layer */}
      {phase !== 'opening' && (
        <>
          <AudioPlayer />
          <ProgressMap />
        </>
      )}

      {/* Phase-gated content */}
      <div className="relative z-10">
        <AnimatePresence mode="wait">
          {phase === 'opening' && (
            <motion.div key="opening" exit={{ opacity: 0 }} transition={{ duration: 0.8 }}>
              <Suspense fallback={null}>
                <OpeningSignal onComplete={goToSolar} />
              </Suspense>
            </motion.div>
          )}

          {phase === 'solar' && (
            <motion.div
              key="solar"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Suspense fallback={null}>
                <SolarSystem onPlanetSelect={goToPlanet} />
              </Suspense>
            </motion.div>
          )}

          {phase === 'planet' && (
            <motion.div
              key="planet"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Suspense fallback={null}>
                <PlanetView />
              </Suspense>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const App: React.FC = () => (
  <AppProvider>
    <AppContent />
  </AppProvider>
);

export default App;
