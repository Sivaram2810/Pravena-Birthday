import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BIRTHDAY_WISHES, UNIVERSE_NAME, BIRTHDAY_DATE } from '../../data/content';

const PlanetVoices: React.FC = () => {
  const [openedWishes, setOpenedWishes] = useState<Set<number>>(new Set());
  const openWish = (i: number) => {
    setOpenedWishes(prev => new Set([...prev, i]));
  };

  return (
    <div className="min-h-screen px-4 py-8 flex flex-col items-center gap-8">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <h1 className="font-cinzel text-3xl md:text-5xl font-bold" style={{ color: '#ffb3d9', textShadow: '0 0 30px rgba(255,179,217,0.5)' }}>
          💌 VOICES
        </h1>
        <p className="font-cormorant text-lg text-gray-300 mt-2 italic">Birthday wishes from across the universe</p>
        <p className="font-cinzel text-xs text-gray-600 mt-1">Open each envelope</p>
      </motion.div>

      <div className="w-full max-w-sm flex flex-col gap-4">
        {BIRTHDAY_WISHES.map((wish, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            {!openedWishes.has(i) ? (
              /* Sealed envelope */
              <motion.button
                onClick={() => openWish(i)}
                className="w-full rounded-2xl p-5 text-left relative overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,179,217,0.08), rgba(255,179,217,0.04))',
                  border: '1px solid rgba(255,179,217,0.25)',
                }}
                whileHover={{ scale: 1.01, borderColor: 'rgba(255,179,217,0.5)' }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">💌</span>
                    <div>
                      <p className="font-cinzel text-xs" style={{ color: '#ffb3d9', letterSpacing: '0.08em' }}>
                        WISH #{String(i + 1).padStart(2, '0')}
                      </p>
                      <p className="font-cormorant text-xs text-gray-500 italic">For {UNIVERSE_NAME} · {BIRTHDAY_DATE}</p>
                    </div>
                  </div>
                  <span className="font-cinzel text-xs text-gray-600" style={{ fontSize: 9 }}>tap to open</span>
                </div>
              </motion.button>
            ) : (
              /* Opened envelope */
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="rounded-2xl p-5"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,179,217,0.12), rgba(155,123,255,0.06))',
                  border: '1px solid rgba(255,179,217,0.3)',
                }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg">✨</span>
                  <span className="font-cinzel text-xs" style={{ color: '#ffb3d9', fontSize: 9, letterSpacing: '0.08em' }}>WISH #{String(i + 1).padStart(2, '0')}</span>
                </div>
                <p className="font-cormorant text-base italic text-gray-200 leading-relaxed">{wish}</p>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>

      {/* All opened */}
      <AnimatePresence>
        {openedWishes.size === BIRTHDAY_WISHES.length && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-sm glass rounded-3xl p-6 text-center"
            style={{ border: '1px solid rgba(255,179,217,0.35)' }}
          >
            <p className="text-3xl mb-3">🎂</p>
            <p className="font-cinzel text-sm" style={{ color: '#ffb3d9' }}>Happy Birthday, {UNIVERSE_NAME}.</p>
            <p className="font-cormorant text-base italic text-gray-300 mt-2 leading-relaxed">
              Every single one of these is meant. Not just today — but every day you wake up and choose to be the remarkable person you are.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PlanetVoices;
