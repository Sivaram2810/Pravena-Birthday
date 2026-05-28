import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { PLANETS } from '../data/content';
import PlanetRouter from './planets/PlanetRouter';

interface PlanetViewProps {
  planetId: string;
  onBack: () => void;
}

const PlanetView: React.FC<PlanetViewProps> = ({ planetId, onBack }) => {
  const planet = PLANETS.find(p => p.id === planetId);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4 }}
      className="relative min-h-screen"
    >
      {/* Back button */}
      <motion.button
        onClick={onBack}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="fixed top-4 left-4 z-50 flex items-center gap-2 px-4 py-2 rounded-full font-cinzel text-xs tracking-wider"
        style={{
          background: 'rgba(5,8,22,0.9)',
          border: `1px solid ${planet?.color ?? '#9b7bff'}44`,
          color: planet?.color ?? '#9b7bff',
          backdropFilter: 'blur(8px)',
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <ArrowLeft size={14} />
        <span>Universe</span>
      </motion.button>

      {/* Planet name header */}
      <div className="fixed top-4 left-0 right-0 flex justify-center z-40 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center"
        >
          <p
            className="font-cinzel text-xs tracking-widest"
            style={{ color: planet?.color ?? '#9b7bff', opacity: 0.7 }}
          >
            {planet?.label?.toUpperCase() || planetId.toUpperCase()}
          </p>
          <p className="font-cormorant text-xs text-gray-600 italic">
            {planet?.description || 'A world of its own'}
          </p>
        </motion.div>
      </div>

      {/* Planet content */}
      <div className="pt-16">
        <PlanetRouter planetId={planetId} />
      </div>
    </motion.div>
  );
};

export default PlanetView;
