import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { STAR_MESSAGES } from '../../data/content';

const PlanetEternity: React.FC = () => {
  const [hoveredStar, setHoveredStar] = useState<number | null>(null);
  const [constellationDrawn, setConstellationDrawn] = useState(false);
  const [lanternsReleased, setLanternsReleased] = useState(false);
  const [selectedStar, setSelectedStar] = useState<number | null>(null);

  return (
    <div className="min-h-screen px-4 py-8 flex flex-col items-center gap-8">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <h1
          className="font-cinzel text-3xl md:text-5xl font-bold"
          style={{ color: '#c0c0ff', textShadow: '0 0 30px rgba(192,192,255,0.5)' }}
        >
          🌠 ETERNITY
        </h1>
        <p className="font-cormorant text-lg text-gray-300 mt-2 italic">A constellation mapped just for you</p>
      </motion.div>

      {/* Star map */}
      <div
        className="relative w-full max-w-3xl rounded-3xl overflow-hidden"
        style={{
          height: 400,
          background: 'radial-gradient(ellipse at 50% 50%, #0a0a20 0%, #020108 100%)',
          border: '1px solid rgba(192,192,255,0.15)',
        }}
      >
        {/* Stars with messages */}
        {STAR_MESSAGES.map((star, i) => (
          <motion.div
            key={i}
            className="absolute cursor-pointer"
            style={{ left: `${star.x}%`, top: `${star.y}%`, transform: 'translate(-50%, -50%)' }}
            onMouseEnter={() => setHoveredStar(i)}
            onMouseLeave={() => setHoveredStar(null)}
            onClick={() => setSelectedStar(prev => prev === i ? null : i)}
          >
            <motion.div
              className="rounded-full"
              style={{
                width: star.size * 4,
                height: star.size * 4,
                background: 'radial-gradient(circle, #ffffff, #c0c0ff)',
                boxShadow: `0 0 ${star.size * 4}px rgba(192,192,255,0.8)`,
              }}
              animate={{ scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2 + i * 0.3, repeat: Infinity }}
            />

            <AnimatePresence>
              {(hoveredStar === i || selectedStar === i) && (
                <motion.div
                  initial={{ opacity: 0, y: 5, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 pointer-events-none"
                  style={{ zIndex: 50, minWidth: '180px' }}
                >
                  <div
                    className="px-3 py-2 rounded-xl text-center"
                    style={{
                      background: 'rgba(5,8,22,0.95)',
                      border: '1px solid rgba(192,192,255,0.4)',
                      boxShadow: '0 0 15px rgba(192,192,255,0.2)',
                    }}
                  >
                    <p className="font-cormorant text-xs text-gray-200 italic">{star.message}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}

        {/* Constellation lines */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          {constellationDrawn && (
            <>
              {STAR_MESSAGES.slice(0, -1).map((star, i) => {
                const next = STAR_MESSAGES[i + 1];
                return (
                  <motion.line
                    key={i}
                    x1={star.x}
                    y1={star.y}
                    x2={next.x}
                    y2={next.y}
                    stroke="rgba(192,192,255,0.3)"
                    strokeWidth="0.3"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 0.5, delay: i * 0.15 }}
                  />
                );
              })}
            </>
          )}
        </svg>

        {/* Floating lanterns */}
        {lanternsReleased && Array.from({ length: 8 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-xl pointer-events-none"
            style={{ left: `${10 + i * 12}%`, bottom: '10%' }}
            initial={{ y: 0, opacity: 0 }}
            animate={{ y: -350, opacity: [0, 1, 1, 0] }}
            transition={{ duration: 4 + i * 0.5, delay: i * 0.3, ease: 'easeOut' }}
          >
            🏮
          </motion.div>
        ))}

        {/* Center label */}
        <div className="absolute bottom-3 left-0 right-0 text-center">
          <p className="font-cinzel text-xs text-gray-700 tracking-widest">PRAVENA'S CONSTELLATION</p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-3 flex-wrap justify-center">
        <motion.button
          onClick={() => setConstellationDrawn(true)}
          className="px-4 py-2 rounded-full font-cinzel text-xs"
          style={{
            background: constellationDrawn ? 'rgba(192,192,255,0.2)' : 'rgba(192,192,255,0.1)',
            border: '1px solid rgba(192,192,255,0.3)',
            color: '#c0c0ff',
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {constellationDrawn ? '✓ Constellation revealed' : '✨ Draw constellation'}
        </motion.button>

        <motion.button
          onClick={() => setLanternsReleased(true)}
          className="px-4 py-2 rounded-full font-cinzel text-xs"
          style={{
            background: lanternsReleased ? 'rgba(247,215,116,0.2)' : 'rgba(247,215,116,0.1)',
            border: '1px solid rgba(247,215,116,0.3)',
            color: '#f7d774',
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {lanternsReleased ? '✓ Lanterns released' : '🏮 Release lanterns'}
        </motion.button>
      </div>

      <p className="font-cormorant text-sm text-gray-500 italic text-center max-w-md">
        Each star holds a memory of us. Hover over the stars to read our story written in the sky.
      </p>
    </div>
  );
};

export default PlanetEternity;
