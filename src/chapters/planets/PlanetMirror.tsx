import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MIRROR_WORDS } from '../../data/content';

const PlanetMirror: React.FC = () => {
  const [hoveredWord, setHoveredWord] = useState<string | null>(null);
  const [revealFinal, setRevealFinal] = useState(false);
  const [wordPositions, setWordPositions] = useState<{ x: number; y: number; size: number; color: string; delay: number }[]>([]);

  const colors = ['#f7d774', '#ff7ab6', '#9b7bff', '#ffffff', '#aaddff'];

  useEffect(() => {
    const positions = MIRROR_WORDS.map((_, i) => ({
      x: 5 + Math.random() * 80,
      y: 5 + Math.random() * 80,
      size: 12 + Math.floor(Math.random() * 14),
      color: colors[Math.floor(Math.random() * colors.length)],
      delay: i * 0.1,
    }));
    setWordPositions(positions);
  }, []);

  const FINAL_MESSAGE = "She is not just beautiful. She is the kind of beautiful that makes the word feel insufficient.\n\nIn every mirror, in every reflection, in every light — she is the most extraordinary thing in the room.\n\nAnd she always will be.";

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8 relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8 z-20 relative"
      >
        <h1
          className="font-cinzel text-3xl md:text-5xl font-bold"
          style={{ color: '#aaddff', textShadow: '0 0 30px rgba(170,221,255,0.5)' }}
        >
          🪞 MIRROR
        </h1>
        <p className="font-cormorant text-lg text-gray-300 mt-2 italic">
          How the universe sees you
        </p>
      </motion.div>

      {/* Mirror surface */}
      <motion.div
        className="relative w-full max-w-2xl"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
      >
        {/* Mirror frame */}
        <div
          className="relative rounded-3xl overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(170,221,255,0.15), rgba(155,123,255,0.1))',
            border: '2px solid rgba(170,221,255,0.4)',
            boxShadow: '0 0 40px rgba(170,221,255,0.2), inset 0 0 60px rgba(170,221,255,0.05)',
            minHeight: '500px',
          }}
        >
          {/* Mirror reflection shimmer */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, transparent 40%, rgba(255,255,255,0.03) 100%)',
            }}
          />
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.03) 50%, transparent 70%)',
            }}
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'linear', repeatDelay: 3 }}
          />

          {/* Floating words */}
          <div className="relative w-full" style={{ minHeight: '500px' }}>
            {MIRROR_WORDS.map((word, i) => {
              const pos = wordPositions[i];
              if (!pos) return null;

              return (
                <motion.div
                  key={word}
                  className="absolute cursor-pointer select-none font-cormorant font-semibold"
                  style={{
                    left: `${pos.x}%`,
                    top: `${pos.y}%`,
                    fontSize: `${pos.size}px`,
                    color: hoveredWord === word ? '#fff' : pos.color,
                    textShadow: hoveredWord === word
                      ? `0 0 20px ${pos.color}, 0 0 40px ${pos.color}`
                      : `0 0 8px ${pos.color}44`,
                    transform: 'translate(-50%, -50%)',
                    opacity: 0.7,
                    zIndex: hoveredWord === word ? 20 : 10,
                  }}
                  initial={{ opacity: 0, scale: 0, y: 20 }}
                  animate={{
                    opacity: hoveredWord === word ? 1 : 0.7,
                    scale: hoveredWord === word ? 1.2 : 1,
                    y: [0, -5, 0],
                  }}
                  transition={{
                    opacity: { delay: pos.delay },
                    scale: { delay: pos.delay },
                    y: { duration: 3 + Math.random() * 2, repeat: Infinity, ease: 'easeInOut', delay: Math.random() * 2 },
                  }}
                  onMouseEnter={() => setHoveredWord(word)}
                  onMouseLeave={() => setHoveredWord(null)}
                >
                  {word}
                </motion.div>
              );
            })}

            {/* Center reflection */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <motion.div
                className="w-32 h-32 rounded-full flex items-center justify-center"
                style={{
                  background: 'radial-gradient(circle, rgba(170,221,255,0.1), transparent 70%)',
                  border: '1px solid rgba(170,221,255,0.2)',
                }}
                animate={{ scale: [1, 1.05, 1], opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                <span className="text-4xl">🌟</span>
              </motion.div>
            </div>
          </div>

          {/* Depth lines */}
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="absolute left-0 right-0 h-px pointer-events-none"
              style={{
                top: `${20 + i * 15}%`,
                background: `linear-gradient(to right, transparent, rgba(170,221,255,${0.02 + i * 0.01}), transparent)`,
              }}
            />
          ))}
        </div>

        {/* Mirror frame decoration */}
        <div
          className="absolute -inset-2 rounded-3xl pointer-events-none"
          style={{
            background: 'linear-gradient(135deg, rgba(170,221,255,0.3), rgba(155,123,255,0.2), rgba(255,122,182,0.2), rgba(170,221,255,0.3))',
            mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            maskComposite: 'exclude',
            WebkitMaskComposite: 'xor',
            padding: '2px',
          }}
        />
      </motion.div>

      {/* Hover instruction */}
      <AnimatePresence>
        {!hoveredWord && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            className="mt-6 font-cormorant text-gray-400 italic text-center z-10"
          >
            Hover over the words to feel them
          </motion.p>
        )}
        {hoveredWord && (
          <motion.div
            key={hoveredWord}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-6 text-center z-10"
          >
            <p className="font-cinzel text-2xl font-bold" style={{ color: '#aaddff', textShadow: '0 0 20px rgba(170,221,255,0.8)' }}>
              {hoveredWord}
            </p>
            <p className="font-cormorant text-gray-300 italic text-sm mt-1">This is what the mirror shows</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reveal button */}
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5 }}
        onClick={() => setRevealFinal(true)}
        className="mt-8 px-6 py-3 rounded-full font-cinzel text-sm z-10"
        style={{
          background: 'linear-gradient(135deg, rgba(170,221,255,0.2), rgba(155,123,255,0.2))',
          border: '1px solid rgba(170,221,255,0.4)',
          color: '#aaddff',
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        ✨ Reveal the final reflection
      </motion.button>

      {/* Final message modal */}
      <AnimatePresence>
        {revealFinal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
            style={{ background: 'rgba(0,0,0,0.9)' }}
            onClick={() => setRevealFinal(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="max-w-lg w-full rounded-3xl p-8 text-center"
              style={{
                background: 'linear-gradient(135deg, rgba(170,221,255,0.15), rgba(155,123,255,0.1))',
                border: '1px solid rgba(170,221,255,0.4)',
                boxShadow: '0 0 60px rgba(170,221,255,0.2)',
              }}
              onClick={e => e.stopPropagation()}
            >
              <div className="text-5xl mb-6">🪞</div>
              <p className="font-cormorant text-xl text-gray-100 italic leading-relaxed whitespace-pre-line">
                {FINAL_MESSAGE}
              </p>
              <button
                onClick={() => setRevealFinal(false)}
                className="mt-6 px-4 py-2 rounded-full text-sm font-cinzel"
                style={{ color: '#aaddff', border: '1px solid rgba(170,221,255,0.3)' }}
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PlanetMirror;
