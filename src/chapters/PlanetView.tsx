import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { PLANETS } from '../data/content';
import PlanetRouter from './planets/PlanetRouter';

const PlanetView: React.FC = () => {
  const { selectedPlanet, goBack, visitRecords } = useApp();
  const planet = PLANETS.find(p => p.id === selectedPlanet);
  const record = selectedPlanet ? visitRecords.get(selectedPlanet) : undefined;
  const visitCount = record?.count || 1;
  const secretUnlocked = record?.secretUnlocked || false;

  // Scroll to top when entering a planet
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [selectedPlanet]);

  if (!selectedPlanet) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.4 }}
      className="relative min-h-screen"
    >
      {/* Back button */}
      <motion.button
        onClick={goBack}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.15 }}
        className="fixed top-4 left-4 z-50 flex items-center gap-2 px-4 py-2 rounded-full font-cinzel text-xs tracking-wider"
        style={{
          background: 'rgba(5,8,22,0.9)',
          border: `1px solid ${planet?.color ?? '#9b7bff'}44`,
          color: planet?.color ?? '#9b7bff',
          backdropFilter: 'blur(8px)',
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Return to universe"
      >
        <ArrowLeft size={14} />
        <span>Universe</span>
      </motion.button>

      {/* Planet header */}
      <div className="fixed top-4 left-0 right-0 flex justify-center z-40 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center"
        >
          <p
            className="font-cinzel text-xs tracking-widest"
            style={{ color: planet?.color ?? '#9b7bff', opacity: 0.8 }}
          >
            {planet?.label?.toUpperCase() || selectedPlanet.toUpperCase()}
          </p>
          <p className="font-cormorant text-xs text-gray-600 italic">
            {planet?.description || 'A world of its own'}
          </p>
        </motion.div>
      </div>

      {/* Visit count badge */}
      {visitCount > 1 && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="fixed top-4 right-4 z-50"
        >
          <div
            className="px-3 py-1 rounded-full font-cinzel text-xs"
            style={{
              background: `${planet?.color ?? '#9b7bff'}18`,
              border: `1px solid ${planet?.color ?? '#9b7bff'}33`,
              color: planet?.color ?? '#9b7bff',
              fontSize: 9,
            }}
          >
            Visit #{visitCount}
          </div>
        </motion.div>
      )}

      {/* Secret unlock indicator */}
      {secretUnlocked && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="fixed bottom-24 left-4 z-50 pointer-events-none"
        >
          <div
            className="px-3 py-1 rounded-full font-cinzel text-xs flex items-center gap-1"
            style={{
              background: 'rgba(155,123,255,0.1)',
              border: '1px solid rgba(155,123,255,0.3)',
              color: '#9b7bff',
              fontSize: 9,
            }}
          >
            ✦ Secret unlocked
          </div>
        </motion.div>
      )}

      {/* Planet content */}
      <div className="pt-16">
        <PlanetRouter planetId={selectedPlanet} />
      </div>
    </motion.div>
  );
};

export default PlanetView;
