import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MIRROR_WORDS } from '../../data/content';

const FINAL_MESSAGE = `"When you look in the mirror, I hope you see what I see every time I look at you.

Someone who is radiant without trying. Who is strong in the quietest ways. Who makes every room better just by being in it.

You are not just beautiful — you are the kind of beautiful that changes people.

Happy birthday, Pravena. The mirror doesn't lie.

— Sivaram 💛"`;

const PlanetMirror: React.FC = () => {
  const [hoveredWord, setHoveredWord] = useState<string | null>(null);
  const [revealFinal, setRevealFinal] = useState(false);

  const wordPositions = useMemo(() => {
    return MIRROR_WORDS.map((_, i) => ({
      left: 5 + (i * 37 + i * 13) % 85,
      top: 5 + (i * 29 + i * 17) % 85,
      size: 10 + Math.floor(Math.random() * 10),
      color: ['#9b7bff', '#ff7ab6', '#f7d774', '#aaddff', '#c0c0ff'][i % 5],
    }));
  }, []);

  return (
    <div className="min-h-screen px-4 py-8 flex flex-col items-center gap-8">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <h1
          className="font-cinzel text-3xl md:text-5xl font-bold"
          style={{ color: '#aaddff', textShadow: '0 0 30px rgba(170,221,255,0.5)' }}
        >
          🪞 MIRROR
        </h1>
        <p className="font-cormorant text-lg text-gray-300 mt-2 italic">See yourself through my eyes</p>
      </motion.div>

      {/* Mirror */}
      <div
        className="relative w-full max-w-2xl rounded-3xl overflow-hidden"
        style={{
          height: 450,
          background: 'linear-gradient(135deg, #0a1520, #050812)',
          border: '2px solid rgba(170,221,255,0.2)',
          boxShadow: '0 0 40px rgba(170,221,255,0.1), inset 0 0 60px rgba(170,221,255,0.05)',
        }}
      >
        {/* Mirror reflection shimmer */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, transparent 50%, rgba(255,255,255,0.02) 100%)' }}
        />

        {/* Floating words */}
        <div className="absolute inset-0">
          {MIRROR_WORDS.map((word, i) => {
            const pos = wordPositions[i];
            return (
              <motion.div
                key={word}
                className="absolute cursor-pointer"
                style={{ left: `${pos.left}%`, top: `${pos.top}%` }}
                initial={{ opacity: 0 }}
                animate={{ opacity: hoveredWord === word ? 1 : 0.4 }}
                transition={{ delay: i * 0.05 }}
                onMouseEnter={() => setHoveredWord(word)}
                onMouseLeave={() => setHoveredWord(null)}
              >
                <motion.span
                  className="font-cinzel font-bold"
                  style={{
                    fontSize: `${pos.size}px`,
                    color: pos.color,
                    textShadow: hoveredWord === word ? `0 0 20px ${pos.color}` : 'none',
                    cursor: 'pointer',
                  }}
                  whileHover={{ scale: 1.3 }}
                >
                  {word}
                </motion.span>
              </motion.div>
            );
          })}

          {/* Center reflection */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <motion.div
              animate={{ opacity: [0.1, 0.3, 0.1] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              <span className="text-6xl">🌟</span>
            </motion.div>
          </div>

          {/* Depth lines */}
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="absolute"
              style={{
                top: `${20 + i * 15}%`,
                left: '5%',
                right: '5%',
                height: 1,
                background: `rgba(170,221,255,${0.02 + i * 0.01})`,
              }}
            />
          ))}
        </div>

        {/* Mirror frame decoration */}
        <div
          className="absolute inset-0 rounded-3xl pointer-events-none"
          style={{ border: '1px solid rgba(170,221,255,0.08)' }}
        />
      </div>

      {/* Hover instruction */}
      <div className="text-center h-16 flex flex-col items-center justify-center">
        {!hoveredWord && (
          <motion.p
            animate={{ opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="font-cormorant text-sm text-gray-500 italic"
          >
            Hover over the words to feel them
          </motion.p>
        )}
        {hoveredWord && (
          <motion.div
            key={hoveredWord}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <p className="font-cinzel text-2xl font-bold" style={{ color: '#aaddff', textShadow: '0 0 20px rgba(170,221,255,0.6)' }}>
              {hoveredWord}
            </p>
            <p className="font-cormorant text-sm text-gray-500 italic">This is what the mirror shows</p>
          </motion.div>
        )}
      </div>

      {/* Reveal button */}
      <motion.button
        onClick={() => setRevealFinal(true)}
        className="mt-2 px-6 py-3 rounded-full font-cinzel text-sm z-10"
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
            style={{ background: 'rgba(0,0,0,0.92)' }}
            onClick={() => setRevealFinal(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="max-w-lg w-full rounded-3xl p-8 text-center"
              style={{
                background: 'linear-gradient(135deg, #0a1520, #050812)',
                border: '1px solid rgba(170,221,255,0.3)',
                boxShadow: '0 0 60px rgba(170,221,255,0.1)',
              }}
              onClick={e => e.stopPropagation()}
            >
              <span className="text-4xl">🪞</span>
              <p
                className="font-cormorant text-base text-gray-200 italic leading-relaxed mt-6 whitespace-pre-line"
              >
                {FINAL_MESSAGE}
              </p>
              <motion.button
                onClick={() => setRevealFinal(false)}
                className="mt-6 px-4 py-2 rounded-full font-cinzel text-xs"
                style={{ border: '1px solid rgba(170,221,255,0.3)', color: '#aaddff' }}
                whileHover={{ scale: 1.05 }}
              >
                Close
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PlanetMirror;
