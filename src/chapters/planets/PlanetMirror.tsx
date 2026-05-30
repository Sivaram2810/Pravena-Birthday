import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HER_TRAITS, UNIVERSE_NAME } from '../../data/content';

const PlanetMirror: React.FC = () => {
  const [revealedTraits, setRevealedTraits] = useState<Set<number>>(new Set());
  const [allRevealed, setAllRevealed] = useState(false);

  const revealTrait = (i: number) => {
    setRevealedTraits(prev => {
      const next = new Set(prev);
      next.add(i);
      if (next.size === HER_TRAITS.length) setAllRevealed(true);
      return next;
    });
  };

  return (
    <div className="min-h-screen px-4 py-8 flex flex-col items-center gap-8">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <h1 className="font-cinzel text-3xl md:text-5xl font-bold" style={{ color: '#e0c3ff', textShadow: '0 0 30px rgba(224,195,255,0.5)' }}>
          🪞 MIRROR
        </h1>
        <p className="font-cormorant text-lg text-gray-300 mt-2 italic">See yourself through my eyes</p>
        <p className="font-cinzel text-xs text-gray-600 mt-1">Tap each truth to reveal it</p>
      </motion.div>

      {/* Mirror frame */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative w-full max-w-sm rounded-3xl p-6"
        style={{
          background: 'linear-gradient(135deg, rgba(224,195,255,0.08), rgba(155,123,255,0.05))',
          border: '1px solid rgba(224,195,255,0.2)',
          boxShadow: '0 0 60px rgba(155,123,255,0.08)',
        }}
      >
        <p className="font-cinzel text-center text-xs tracking-widest mb-5 text-gray-500">
          {UNIVERSE_NAME.toUpperCase()} — AS I SEE HER
        </p>

        <div className="flex flex-col gap-3">
          {HER_TRAITS.map((trait, i) => (
            <motion.div
              key={i}
              onClick={() => revealTrait(i)}
              className="cursor-pointer rounded-2xl p-4 relative overflow-hidden"
              style={{
                background: revealedTraits.has(i) ? 'rgba(224,195,255,0.1)' : 'rgba(255,255,255,0.02)',
                border: `1px solid rgba(224,195,255,${revealedTraits.has(i) ? 0.35 : 0.1})`,
                transition: 'all 0.4s ease',
              }}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">{trait.icon}</span>
                <span
                  className="font-cinzel text-sm font-bold"
                  style={{
                    color: revealedTraits.has(i) ? '#e0c3ff' : '#555',
                    transition: 'color 0.4s ease',
                  }}
                >
                  {trait.trait}
                </span>
              </div>

              <AnimatePresence>
                {revealedTraits.has(i) && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="font-cormorant text-sm text-gray-300 italic leading-relaxed mt-2"
                  >
                    {trait.detail}
                  </motion.p>
                )}
              </AnimatePresence>

              {!revealedTraits.has(i) && (
                <p className="font-cinzel text-xs mt-1" style={{ color: '#444', fontSize: 8 }}>
                  tap to reveal ›
                </p>
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* All revealed message */}
      <AnimatePresence>
        {allRevealed && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-sm"
          >
            <div className="glass rounded-3xl p-6" style={{ border: '1px solid rgba(224,195,255,0.3)' }}>
              <p className="text-3xl mb-3">🪞</p>
              <p className="font-cinzel text-sm mb-2" style={{ color: '#e0c3ff' }}>You have seen yourself.</p>
              <p className="font-cormorant text-base italic text-gray-300 leading-relaxed">
                This is what I see every time I think of you. Every single time.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PlanetMirror;
