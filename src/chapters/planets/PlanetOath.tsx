import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PROMISES, SENDER_NAME, UNIVERSE_NAME } from '../../data/content';

const PlanetOath: React.FC = () => {
  const [sealedCount, setSealedCount] = useState(0);
  const [allSealed, setAllSealed] = useState(false);

  const sealPromise = (i: number) => {
    if (i === sealedCount) {
      const next = sealedCount + 1;
      setSealedCount(next);
      if (next === PROMISES.length) setAllSealed(true);
    }
  };

  return (
    <div className="min-h-screen px-4 py-8 flex flex-col items-center gap-8">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <h1 className="font-cinzel text-3xl md:text-5xl font-bold" style={{ color: '#ffe4a0', textShadow: '0 0 30px rgba(255,228,160,0.5)' }}>
          🕯️ OATH
        </h1>
        <p className="font-cormorant text-lg text-gray-300 mt-2 italic">Promises written in starlight</p>
        <p className="font-cinzel text-xs text-gray-600 mt-1">Seal each promise in order</p>
      </motion.div>

      <div className="flex gap-2">
        {PROMISES.map((_, i) => (
          <div
            key={i}
            className="rounded-full transition-all duration-500"
            style={{
              width: 8, height: 8,
              background: i < sealedCount ? '#ffe4a0' : 'rgba(255,255,255,0.1)',
              boxShadow: i < sealedCount ? '0 0 8px rgba(255,228,160,0.6)' : 'none',
            }}
          />
        ))}
      </div>

      <div className="w-full max-w-lg flex flex-col gap-4">
        {PROMISES.map((promise, i) => {
          const sealed = i < sealedCount;
          const current = i === sealedCount;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => sealPromise(i)}
              className={`rounded-2xl p-5 relative overflow-hidden transition-all duration-500 ${current ? 'cursor-pointer' : sealed ? 'cursor-default' : 'cursor-not-allowed'}`}
              style={{
                background: sealed ? 'rgba(255,228,160,0.1)' : current ? 'rgba(255,228,160,0.04)' : 'rgba(255,255,255,0.02)',
                border: `1px solid rgba(255,228,160,${sealed ? 0.4 : current ? 0.2 : 0.06})`,
                opacity: !sealed && !current ? 0.4 : 1,
              }}
              whileHover={current ? { scale: 1.01 } : {}}
              whileTap={current ? { scale: 0.99 } : {}}
            >
              <div className="flex items-start gap-4">
                <span className="text-2xl flex-shrink-0">{promise.icon}</span>
                <div className="flex-1">
                  <p className="font-cormorant text-base text-gray-200 italic leading-relaxed">{promise.text}</p>
                  {current && (
                    <p className="font-cinzel text-xs mt-2" style={{ color: '#ffe4a0', fontSize: 9, opacity: 0.7 }}>
                      tap to seal this oath →
                    </p>
                  )}
                  {sealed && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center gap-1.5 mt-2"
                    >
                      <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#ffe4a0' }} />
                      <span className="font-cinzel text-xs" style={{ color: '#ffe4a0', fontSize: 8, letterSpacing: '0.1em' }}>SEALED</span>
                    </motion.div>
                  )}
                </div>
              </div>

              {sealed && (
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  initial={{ opacity: 0.5 }}
                  animate={{ opacity: 0 }}
                  transition={{ duration: 1 }}
                  style={{ background: 'rgba(255,228,160,0.15)' }}
                />
              )}
            </motion.div>
          );
        })}
      </div>

      <AnimatePresence>
        {allSealed && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="w-full max-w-lg glass rounded-3xl p-6 text-center"
            style={{ border: '1px solid rgba(255,228,160,0.4)', boxShadow: '0 0 40px rgba(255,228,160,0.08)' }}
          >
            <p className="text-3xl mb-3">🕯️</p>
            <p className="font-cinzel text-sm font-bold mb-2" style={{ color: '#ffe4a0' }}>
              {PROMISES.length} oaths. Sealed. Witnessed by the stars.
            </p>
            <p className="font-cormorant text-base italic text-gray-300 leading-relaxed">
              These are not empty words.<br />
              They are {SENDER_NAME}'s promises to {UNIVERSE_NAME}.<br />
              Kept. Always.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PlanetOath;
