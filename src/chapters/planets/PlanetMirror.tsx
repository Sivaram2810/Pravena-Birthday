import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HER_TRAITS, UNIVERSE_NAME } from '../../data/content';

const FLOATING_WORDS = [
  'radiant', 'kind', 'real', 'warm', 'rare', 'beautiful',
  'brave', 'funny', 'gentle', 'genuine', 'magical', 'luminous',
  'tender', 'vivid', 'graceful', 'precious', 'cherished', 'extraordinary',
];

const FloatingWord: React.FC<{ word: string; index: number; active: boolean }> = ({ word, index, active }) => {
  const angle = (index / FLOATING_WORDS.length) * 360;
  const radius = 130 + (index % 3) * 40;
  const x = Math.cos((angle * Math.PI) / 180) * radius;
  const y = Math.sin((angle * Math.PI) / 180) * radius * 0.6;

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
          animate={{
            opacity: [0, 0.85, 0.6],
            scale: [0, 1, 0.92],
            x: x,
            y: y,
          }}
          exit={{ opacity: 0, scale: 0, x: 0, y: 0 }}
          transition={{
            duration: 1.2,
            delay: index * 0.06,
            opacity: { repeat: Infinity, duration: 3 + index * 0.3, repeatType: 'reverse' },
          }}
          className="absolute font-cinzel pointer-events-none"
          style={{
            left: '50%',
            top: '50%',
            transform: `translate(-50%, -50%)`,
            color: ['#f7d774', '#ff7ab6', '#9b7bff', '#7be3ff', '#e0c3ff'][index % 5],
            fontSize: 9 + (index % 3) * 2,
            letterSpacing: '0.06em',
            textShadow: `0 0 10px ${['rgba(247,215,116,0.6)', 'rgba(255,122,182,0.6)', 'rgba(155,123,255,0.6)', 'rgba(123,227,255,0.6)', 'rgba(224,195,255,0.6)'][index % 5]}`,
          }}
        >
          {word}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const PlanetMirror: React.FC = () => {
  const [activated, setActivated] = useState(false);
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
      </motion.div>

      {/* Enchanted Mirror */}
      <motion.div
        className="relative flex items-center justify-center"
        style={{ width: 320, height: 320 }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, type: 'spring' }}
      >
        {/* Floating words */}
        {FLOATING_WORDS.map((word, i) => (
          <FloatingWord key={word} word={word} index={i} active={activated} />
        ))}

        {/* Mirror glass frame */}
        <motion.div
          className="relative cursor-pointer"
          onClick={() => setActivated(prev => !prev)}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          style={{ width: 200, height: 240, zIndex: 10 }}
        >
          {/* Outer glow border */}
          <motion.div
            className="absolute inset-0 rounded-3xl"
            style={{
              border: '2px solid rgba(224,195,255,0.4)',
              borderRadius: 24,
            }}
            animate={activated ? {
              boxShadow: [
                '0 0 20px rgba(224,195,255,0.3), 0 0 40px rgba(155,123,255,0.15)',
                '0 0 40px rgba(224,195,255,0.5), 0 0 80px rgba(155,123,255,0.3)',
                '0 0 20px rgba(224,195,255,0.3), 0 0 40px rgba(155,123,255,0.15)',
              ],
            } : {}}
            transition={{ duration: 2, repeat: Infinity }}
          />

          {/* Glass panel */}
          <div
            className="w-full h-full rounded-3xl flex flex-col items-center justify-center gap-3 relative overflow-hidden"
            style={{
              background: activated
                ? 'linear-gradient(135deg, rgba(224,195,255,0.12), rgba(155,123,255,0.08), rgba(247,215,116,0.06))'
                : 'linear-gradient(135deg, rgba(224,195,255,0.06), rgba(155,123,255,0.04))',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(224,195,255,0.2)',
              transition: 'all 0.8s ease',
            }}
          >
            {/* Inner shimmer */}
            {activated && (
              <motion.div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: 'linear-gradient(135deg, transparent 40%, rgba(255,255,255,0.05) 50%, transparent 60%)',
                }}
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 3, repeat: Infinity, repeatDelay: 1 }}
              />
            )}

            <motion.div
              className="text-6xl"
              animate={activated ? { rotate: [0, -5, 5, 0] } : {}}
              transition={{ duration: 4, repeat: Infinity }}
            >
              🪞
            </motion.div>

            <div className="text-center px-4">
              <p className="font-cinzel text-xs" style={{ color: '#e0c3ff', opacity: 0.8, letterSpacing: '0.12em', fontSize: 9 }}>
                {activated ? `${UNIVERSE_NAME.toUpperCase()} — AS I SEE YOU` : 'TAP TO SEE'}
              </p>
              {!activated && (
                <p className="font-cormorant text-sm italic text-gray-500 mt-1">
                  Touch the mirror
                </p>
              )}
            </div>
          </div>
        </motion.div>

        {/* Decorative corner gems */}
        {activated && [0, 1, 2, 3].map(i => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: 8, height: 8,
              background: ['#f7d774', '#ff7ab6', '#9b7bff', '#7be3ff'][i],
              top: i < 2 ? 8 : 'auto',
              bottom: i >= 2 ? 8 : 'auto',
              left: i % 2 === 0 ? 8 : 'auto',
              right: i % 2 === 1 ? 8 : 'auto',
              boxShadow: `0 0 12px ${['rgba(247,215,116,0.8)', 'rgba(255,122,182,0.8)', 'rgba(155,123,255,0.8)', 'rgba(123,227,255,0.8)'][i]}`,
            }}
            animate={{ scale: [1, 1.4, 1], opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 2, delay: i * 0.3, repeat: Infinity }}
          />
        ))}
      </motion.div>

      {/* Trait cards */}
      {activated && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm"
        >
          <p className="font-cinzel text-xs text-center text-gray-500 mb-4" style={{ letterSpacing: '0.1em', fontSize: 9 }}>
            TAP EACH TRUTH TO REVEAL IT
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
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                {revealedTraits.has(i) && (
                  <motion.div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: 'linear-gradient(135deg, transparent 60%, rgba(224,195,255,0.05) 100%)',
                    }}
                  />
                )}
                <div className="flex items-center gap-3">
                  <span className="text-xl">{trait.icon}</span>
                  <span className="font-cinzel text-sm font-bold" style={{ color: revealedTraits.has(i) ? '#e0c3ff' : '#555', transition: 'color 0.4s ease' }}>
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
                  <p className="font-cinzel text-xs mt-1" style={{ color: '#444', fontSize: 8 }}>tap to reveal ›</p>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      <AnimatePresence>
        {allRevealed && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-sm w-full"
          >
            <div className="glass rounded-3xl p-6" style={{ border: '1px solid rgba(224,195,255,0.3)', boxShadow: '0 0 40px rgba(155,123,255,0.08)' }}>
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
