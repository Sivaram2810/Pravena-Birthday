import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PROMISES } from '../../data/content';

const PlanetOath: React.FC = () => {
  const [revealedPromises, setRevealedPromises] = useState<Set<number>>(new Set());
  const [allRevealed, setAllRevealed] = useState(false);

  const revealPromise = (i: number) => {
    setRevealedPromises(prev => new Set([...prev, i]));
  };

  const revealAll = () => {
    setRevealedPromises(new Set(PROMISES.map((_, i) => i)));
    setAllRevealed(true);
  };

  return (
    <div className="min-h-screen px-4 py-8 flex flex-col items-center gap-8">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <h1
          className="font-cinzel text-3xl md:text-5xl font-bold"
          style={{ color: '#8b0000', textShadow: '0 0 30px rgba(139,0,0,0.6)' }}
        >
          ⚖️ OATH
        </h1>
        <p className="font-cormorant text-lg text-gray-300 mt-2 italic">Promises carved in starlight</p>
      </motion.div>

      {/* Stone wall background */}
      <div
        className="w-full max-w-2xl rounded-3xl p-8 relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #1a0505, #0d0505)',
          border: '1px solid rgba(139,0,0,0.3)',
          boxShadow: '0 0 40px rgba(139,0,0,0.1)',
        }}
      >
        {/* Stone texture */}
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 40px, rgba(139,0,0,0.1) 40px, rgba(139,0,0,0.1) 41px)',
          }}
        />

        {/* Header carving */}
        <div className="text-center mb-8 relative z-10">
          <span className="text-3xl">⚖️</span>
          <h2 className="font-cinzel text-xl font-bold mt-2" style={{ color: '#8b0000' }}>WALL OF WITNESSES</h2>
          <p className="font-cormorant text-sm text-gray-500 italic mt-1">The stars themselves have witnessed these words</p>
        </div>

        {/* Promises */}
        <div className="flex flex-col gap-4 relative z-10">
          {PROMISES.map((promise, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
              onClick={() => revealPromise(i)}
              className="relative group cursor-pointer"
            >
              <div
                className="p-4 rounded-xl transition-all duration-300"
                style={{
                  background: revealedPromises.has(i) ? 'rgba(139,0,0,0.15)' : 'rgba(255,255,255,0.02)',
                  border: `1px solid ${revealedPromises.has(i) ? 'rgba(139,0,0,0.4)' : 'rgba(255,255,255,0.06)'}`,
                  boxShadow: revealedPromises.has(i) ? '0 0 15px rgba(139,0,0,0.15)' : 'none',
                }}
              >
                <div className="flex items-start gap-3">
                  <span className="text-lg flex-shrink-0 mt-0.5">
                    {revealedPromises.has(i) ? '✨' : '🔒'}
                  </span>
                  {revealedPromises.has(i) ? (
                    <motion.p
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="font-cormorant text-base text-gray-200 italic leading-relaxed"
                    >
                      "{promise}"
                    </motion.p>
                  ) : (
                    <p className="font-cormorant text-sm text-gray-600 italic">Click to reveal promise {i + 1}...</p>
                  )}
                </div>

                {/* Carved line decoration */}
                {revealedPromises.has(i) && (
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    className="mt-3 h-px"
                    style={{ background: 'linear-gradient(to right, rgba(139,0,0,0.4), transparent)', transformOrigin: 'left' }}
                  />
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Reveal all button */}
        {!allRevealed && (
          <motion.div className="mt-6 text-center relative z-10">
            <motion.button
              onClick={revealAll}
              className="px-6 py-2 rounded-full font-cinzel text-xs tracking-wider"
              style={{
                background: 'rgba(139,0,0,0.2)',
                border: '1px solid rgba(139,0,0,0.4)',
                color: '#cc4444',
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Reveal all promises
            </motion.button>
          </motion.div>
        )}

        {/* All revealed finale */}
        <AnimatePresence>
          {allRevealed && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 text-center relative z-10"
            >
              <div
                className="rounded-2xl p-4"
                style={{ background: 'rgba(139,0,0,0.1)', border: '1px solid rgba(139,0,0,0.3)' }}
              >
                <span className="text-2xl">🌟</span>
                <p className="font-cinzel text-sm mt-2" style={{ color: '#cc4444' }}>
                  All promises witnessed by the universe
                </p>
                <p className="font-cormorant text-sm text-gray-400 italic mt-1">
                  These words are eternal, Pravena. Every single one.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default PlanetOath;
