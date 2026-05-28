import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PROMISES } from '../../data/content';

const PlanetOath: React.FC = () => {
  const [revealedPromises, setRevealedPromises] = useState<Set<number>>(new Set());
  const [allRevealed, setAllRevealed] = useState(false);

  const revealPromise = (i: number) => {
    const next = new Set(revealedPromises);
    next.add(i);
    setRevealedPromises(next);
    if (next.size >= PROMISES.length) setAllRevealed(true);
  };

  const revealAll = () => {
    setRevealedPromises(new Set(PROMISES.map((_, i) => i)));
    setAllRevealed(true);
  };

  return (
    <div className="min-h-screen px-4 py-8 flex flex-col items-center gap-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1
          className="font-cinzel text-3xl md:text-5xl font-bold"
          style={{ color: '#ffd700', textShadow: '0 0 30px rgba(255,215,0,0.5)' }}
        >
          💛 OATH
        </h1>
        <p className="font-cormorant text-lg text-gray-300 mt-2 italic">
          Promises carved in stone, eternal as stars
        </p>
      </motion.div>

      {/* Monument atmosphere */}
      <div className="w-full max-w-3xl">
        {/* Stone monument effect */}
        <motion.div
          className="relative rounded-3xl overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #1a1510, #0d0b08)',
            border: '2px solid rgba(255,215,0,0.2)',
            boxShadow: '0 0 60px rgba(255,215,0,0.1), inset 0 0 60px rgba(0,0,0,0.5)',
          }}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          {/* Stone texture overlay */}
          <div
            className="absolute inset-0 pointer-events-none opacity-10"
            style={{
              backgroundImage: `repeating-linear-gradient(
                90deg,
                transparent,
                transparent 2px,
                rgba(255,215,0,0.05) 2px,
                rgba(255,215,0,0.05) 4px
              )`,
            }}
          />

          {/* Header carving */}
          <div
            className="text-center py-6 px-6"
            style={{ borderBottom: '1px solid rgba(255,215,0,0.15)' }}
          >
            <div className="text-3xl mb-2">⚖️</div>
            <h2 className="font-cinzel text-xl font-bold" style={{ color: '#ffd700' }}>
              WALL OF WITNESSES
            </h2>
            <p className="font-cormorant text-gray-500 italic text-sm mt-1">
              The stars themselves have witnessed these words
            </p>
          </div>

          {/* Promises */}
          <div className="p-6 grid grid-cols-1 gap-4">
            {PROMISES.map((promise, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                onClick={() => revealPromise(i)}
                className="relative group cursor-pointer"
              >
                <div
                  className="p-4 rounded-xl transition-all"
                  style={{
                    background: revealedPromises.has(i)
                      ? 'rgba(255,215,0,0.08)'
                      : 'rgba(255,255,255,0.02)',
                    border: revealedPromises.has(i)
                      ? '1px solid rgba(255,215,0,0.3)'
                      : '1px solid rgba(255,255,255,0.05)',
                    boxShadow: revealedPromises.has(i)
                      ? '0 0 15px rgba(255,215,0,0.1)'
                      : 'none',
                  }}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-lg flex-shrink-0 mt-0.5">
                      {revealedPromises.has(i) ? '✨' : '🔒'}
                    </span>
                    <AnimatePresence mode="wait">
                      {revealedPromises.has(i) ? (
                        <motion.p
                          key="revealed"
                          initial={{ opacity: 0, filter: 'blur(5px)' }}
                          animate={{ opacity: 1, filter: 'blur(0)' }}
                          className="font-cormorant text-base text-gray-200 leading-relaxed"
                        >
                          {promise}
                        </motion.p>
                      ) : (
                        <motion.p
                          key="hidden"
                          className="font-cormorant text-sm text-gray-600 italic"
                        >
                          Click to reveal promise {i + 1}...
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Carved line decoration */}
                  {revealedPromises.has(i) && (
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: '100%' }}
                      className="h-px mt-3 rounded"
                      style={{ background: 'linear-gradient(to right, rgba(255,215,0,0.3), transparent)' }}
                    />
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Reveal all button */}
          {!allRevealed && (
            <div className="px-6 pb-6 text-center">
              <motion.button
                onClick={revealAll}
                className="px-6 py-2 rounded-full font-cinzel text-sm"
                style={{
                  background: 'rgba(255,215,0,0.1)',
                  border: '1px solid rgba(255,215,0,0.3)',
                  color: '#ffd700',
                }}
                whileHover={{ scale: 1.02, background: 'rgba(255,215,0,0.2)' }}
                whileTap={{ scale: 0.98 }}
              >
                Reveal all promises
              </motion.button>
            </div>
          )}

          {/* All revealed finale */}
          <AnimatePresence>
            {allRevealed && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="px-6 pb-8 text-center"
              >
                <div
                  className="p-4 rounded-2xl"
                  style={{ background: 'rgba(255,215,0,0.08)', border: '1px solid rgba(255,215,0,0.3)' }}
                >
                  <div className="text-3xl mb-2">🌟</div>
                  <p className="font-cinzel text-sm" style={{ color: '#ffd700' }}>
                    All promises witnessed by the universe
                  </p>
                  <p className="font-cormorant text-gray-300 italic text-sm mt-1">
                    These words are eternal, Pravena. Every single one.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Counter */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center"
      >
        <p className="font-cinzel text-sm" style={{ color: '#ffd70088' }}>
          {revealedPromises.size} / {PROMISES.length} promises revealed
        </p>
        <div className="flex gap-1 justify-center mt-2">
          {PROMISES.map((_, i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full transition-all"
              style={{ background: revealedPromises.has(i) ? '#ffd700' : 'rgba(255,215,0,0.2)' }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default PlanetOath;
