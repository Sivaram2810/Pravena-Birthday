import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Home } from 'lucide-react';
import { useAppContext } from '../contexts/AppContext';
import { PLANETS } from '../data/content';
import PlanetRouter from './planets/PlanetRouter';

interface PlanetViewProps {
  planetId: string;
  onBack: () => void;
}

const PlanetView: React.FC<PlanetViewProps> = ({ planetId, onBack }) => {
  const { visitPlanet, setCurrentPlanet } = useAppContext();
  const planet = PLANETS.find(p => p.id === planetId);

  useEffect(() => {
    visitPlanet(planetId);
    setCurrentPlanet(planetId);
    window.scrollTo(0, 0);
    return () => setCurrentPlanet(null);
  }, [planetId, visitPlanet, setCurrentPlanet]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen relative"
    >
      {/* Planet-specific ambient glow */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse at 50% -10%, ${planet?.color || '#9b7bff'}20 0%, transparent 55%),
            radial-gradient(ellipse at 0% 50%, ${planet?.color || '#9b7bff'}08 0%, transparent 40%)
          `,
          zIndex: 1,
        }}
      />

      {/* Navigation bar */}
      <motion.div
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3 glass-dark"
      >
        {/* Back button */}
        <motion.button
          onClick={onBack}
          className="flex items-center gap-2 font-cinzel text-xs tracking-widest text-gray-400 hover:text-white transition-colors"
          whileHover={{ x: -3 }}
          whileTap={{ scale: 0.95 }}
        >
          <ArrowLeft size={15} />
          <span className="hidden sm:inline tracking-[0.2em]">SOLAR SYSTEM</span>
        </motion.button>

        {/* Planet name */}
        <motion.div
          className="flex items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <motion.span
            className="text-xl"
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity, delay: 1 }}
          >
            {planet?.emoji || '🌌'}
          </motion.span>
          <div>
            <p
              className="font-cinzel text-sm font-bold tracking-[0.2em] leading-none"
              style={{ color: planet?.color || '#9b7bff' }}
            >
              {planet?.label?.toUpperCase() || planetId.toUpperCase()}
            </p>
            <p className="font-cormorant text-xs text-gray-500 italic leading-none mt-0.5">
              {planet?.description || 'A world of its own'}
            </p>
          </div>
        </motion.div>

        {/* Home */}
        <motion.button
          onClick={onBack}
          className="flex items-center gap-1 text-gray-500 hover:text-gray-200 transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          title="Back to Solar System"
        >
          <Home size={15} />
        </motion.button>
      </motion.div>

      {/* Planet content */}
      <div className="relative z-10 pt-16">
        <PlanetRouter planetId={planetId} />
      </div>

      {/* Bottom back button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="fixed bottom-20 left-4 z-40"
      >
        <motion.button
          onClick={onBack}
          className="flex items-center gap-1 px-3 py-2 rounded-full font-cinzel text-xs glass"
          style={{ color: planet?.color || '#9b7bff', border: `1px solid ${planet?.color || '#9b7bff'}44` }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ArrowLeft size={12} />
          Universe
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default PlanetView;
