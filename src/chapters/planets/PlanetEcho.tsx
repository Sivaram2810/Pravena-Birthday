import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ECHO_MESSAGES } from '../../data/content';

const PlanetEcho: React.FC = () => {
  const [revealed, setRevealed] = useState<Set<number>>(new Set());

  const toggle = (i: number) => {
    setRevealed(prev => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i); else next.add(i);
      return next;
    });
  };

  return (
    <div className="min-h-screen px-4 py-8 flex flex-col items-center gap-8">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <h1 className="font-cinzel text-3xl md:text-5xl font-bold" style={{ color: '#7be3ff', textShadow: '0 0 30px rgba(123,227,255,0.5)' }}>
          🎵 ECHO
        </h1>
        <p className="font-cormorant text-lg text-gray-300 mt-2 italic">Words that changed everything</p>
        <p className="font-cinzel text-xs text-gray-600 mt-1">Tap a message to hear its weight</p>
      </motion.div>

      <div className="w-full max-w-lg flex flex-col gap-5">
        {ECHO_MESSAGES.map((msg, i) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            onClick={() => toggle(i)}
            className="cursor-pointer"
          >
            <div className="flex items-center gap-2 mb-2 ml-2">
              <div className="w-2 h-2 rounded-full" style={{ background: msg.color }} />
              <span className="font-cinzel text-xs" style={{ color: msg.color, fontSize: 9, letterSpacing: '0.1em' }}>
                {msg.speaker.toUpperCase()}
              </span>
            </div>

            <motion.div
              className="rounded-2xl p-5"
              style={{
                background: revealed.has(i) ? `${msg.color}18` : 'rgba(255,255,255,0.03)',
                border: `1px solid ${msg.color}${revealed.has(i) ? '55' : '22'}`,
              }}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <p
                className="font-cormorant text-xl italic leading-relaxed"
                style={{
                  color: revealed.has(i) ? msg.color : '#666',
                  filter: revealed.has(i) ? 'none' : 'blur(5px)',
                  transition: 'all 0.4s ease',
                  userSelect: 'none',
                }}
              >
                {msg.text}
              </p>

              <AnimatePresence>
                {revealed.has(i) && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mt-3 border-t pt-3"
                    style={{ borderColor: `${msg.color}22` }}
                  >
                    <p className="font-cinzel text-xs text-gray-500 mb-1" style={{ fontSize: 9, letterSpacing: '0.05em' }}>
                      {msg.context}
                    </p>
                    <p className="font-cormorant text-sm text-gray-400 italic">{msg.weight}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              {!revealed.has(i) && (
                <p className="font-cinzel text-xs mt-2" style={{ color: msg.color, fontSize: 9, opacity: 0.6 }}>
                  tap to reveal
                </p>
              )}
            </motion.div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="text-center mt-4"
      >
        <p className="font-cormorant text-lg italic text-gray-400">
          Some words carry entire universes inside them.
        </p>
        <p className="font-cormorant text-sm italic text-gray-600 mt-1">
          Yours did.
        </p>
      </motion.div>
    </div>
  );
};

export default PlanetEcho;
