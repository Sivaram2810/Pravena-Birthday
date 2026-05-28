import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppProvider } from './contexts/AppContext';
import StarField from './components/StarField';
import GlobalCandle from './components/GlobalCandle';
import AudioPlayer from './components/AudioPlayer';
import OpeningSignal from './chapters/OpeningSignal';
import SolarSystem from './chapters/SolarSystem';
import PlanetView from './chapters/PlanetView';

type AppPhase = 'opening' | 'solar' | 'planet';

const AppContent: React.FC = () => {
  const [phase, setPhase] = useState<AppPhase>('opening');
  const [selectedPlanet, setSelectedPlanet] = useState<string | null>(null);

  const handleOpeningComplete = useCallback(() => {
    setPhase('solar');
  }, []);

  const handlePlanetSelect = useCallback((id: string) => {
    setSelectedPlanet(id);
    setPhase('planet');
  }, []);

  const handleBackToSolar = useCallback(() => {
    setSelectedPlanet(null);
    setPhase('solar');
  }, []);

  return (
    <div className="relative min-h-screen" style={{ background: '#050816' }}>
      {/* Persistent starfield background */}
      <StarField />

      {/* Global persistent UI */}
      <GlobalCandle />
      {phase !== 'opening' && <AudioPlayer />}

      {/* Main content */}
      <AnimatePresence mode="wait">
        {phase === 'opening' && (
          <motion.div key="opening" exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
            <OpeningSignal onComplete={handleOpeningComplete} />
          </motion.div>
        )}

        {phase === 'solar' && (
          <motion.div
            key="solar"
            className="relative z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            <SolarSystem onPlanetSelect={handlePlanetSelect} />
          </motion.div>
        )}

        {phase === 'planet' && selectedPlanet && (
          <motion.div
            key={`planet-${selectedPlanet}`}
            className="relative z-10"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.5 }}
          >
            <PlanetView planetId={selectedPlanet} onBack={handleBackToSolar} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;
