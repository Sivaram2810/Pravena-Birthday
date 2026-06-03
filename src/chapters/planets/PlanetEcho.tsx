import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ANNIVERSARY_DATE, UNIVERSE_NAME, SENDER_NAME } from '../../data/content';

const getElapsed = (from: Date) => {
  const now = new Date();
  const diff = now.getTime() - from.getTime();
  const totalSeconds = Math.floor(diff / 1000);
  const seconds = totalSeconds % 60;
  const minutes = Math.floor(totalSeconds / 60) % 60;
  const hours = Math.floor(totalSeconds / 3600) % 24;
  const days = Math.floor(totalSeconds / 86400);
  return { days, hours, minutes, seconds };
};

const PlanetEternity: React.FC = () => {
  const [elapsed, setElapsed] = useState(getElapsed(ANNIVERSARY_DATE));

  useEffect(() => {
    const iv = setInterval(() => setElapsed(getElapsed(ANNIVERSARY_DATE)), 1000);
    return () => clearInterval(iv);
  }, []);

  return (
    <div className="min-h-screen px-4 py-8 flex flex-col items-center gap-8">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <h1 className="font-cinzel text-3xl md:text-5xl font-bold" style={{ color: '#ffd6b0', textShadow: '0 0 30px rgba(255,214,176,0.5)' }}>
          ♾️ ETERNITY
        </h1>
        <p className="font-cormorant text-lg text-gray-300 mt-2 italic">The place without an end</p>
      </motion.div>

      {/* Countup since Dec 19, 2022 */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="w-full max-w-md rounded-3xl p-8 text-center"
        style={{
          background: 'linear-gradient(135deg, rgba(255,214,176,0.08), rgba(255,214,176,0.04))',
          border: '1px solid rgba(255,214,176,0.25)',
          boxShadow: '0 0 40px rgba(255,214,176,0.06)',
        }}
      >
        <p className="font-cinzel text-xs tracking-widest mb-2" style={{ color: '#ffd6b0', opacity: 0.7, letterSpacing: '0.2em' }}>
          TOGETHER SINCE DEC 19, 2022
        </p>
        <p className="font-cormorant text-base italic text-gray-400 mb-6">
          ...and every second since has mattered.
        </p>

        <div className="grid grid-cols-4 gap-3">
          {[
            { value: elapsed.days, label: 'DAYS' },
            { value: elapsed.hours, label: 'HRS' },
            { value: elapsed.minutes, label: 'MIN' },
            { value: elapsed.seconds, label: 'SEC' },
          ].map(({ value, label }) => (
            <motion.div
              key={label}
              className="rounded-2xl p-3 flex flex-col items-center gap-1"
              style={{ background: 'rgba(255,214,176,0.08)', border: '1px solid rgba(255,214,176,0.15)' }}
              animate={{ scale: label === 'SEC' ? [1, 1.04, 1] : 1 }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <span className="font-cinzel text-2xl font-bold" style={{ color: '#ffd6b0' }}>
                {String(value).padStart(2, '0')}
              </span>
              <span className="font-cinzel text-gray-600" style={{ fontSize: 7, letterSpacing: '0.1em' }}>{label}</span>
            </motion.div>
          ))}
        </div>

        <motion.p
          className="font-cormorant text-sm italic text-gray-500 mt-6"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          ♾️ Counting up. Never counting down.
        </motion.p>
      </motion.div>

      {/* Quote section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="w-full max-w-md rounded-3xl p-6 text-center"
        style={{ background: 'rgba(255,214,176,0.04)', border: '1px solid rgba(255,214,176,0.15)' }}
      >
        <p className="font-cormorant text-xl italic text-gray-200 leading-relaxed">
          "Every day I've known you has been one I would choose again."
        </p>
        <p className="font-cinzel text-xs mt-3 text-gray-600" style={{ fontSize: 9 }}>
          — {SENDER_NAME}, to {UNIVERSE_NAME}
        </p>
      </motion.div>

      {/* Milestones */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="w-full max-w-md"
      >
        <p className="font-cinzel text-xs text-center mb-4" style={{ color: '#ffd6b0', opacity: 0.7, letterSpacing: '0.15em' }}>
          MILESTONES OF FOREVER
        </p>
        {[
          { icon: '🌅', label: '100 Days Together', sub: 'We hit triple digits without even noticing' },
          { icon: '🌙', label: '365 Days', sub: 'A full year of you. Of us. Of this.' },
          { icon: '⭐', label: 'Every Morning After', sub: 'The day I first thought of you before anything else' },
        ].map((m, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 + i * 0.1 }}
            className="flex items-center gap-4 mb-3 p-3 rounded-xl"
            style={{ background: 'rgba(255,214,176,0.05)', border: '1px solid rgba(255,214,176,0.12)' }}
          >
            <span className="text-xl">{m.icon}</span>
            <div>
              <p className="font-cinzel text-xs font-bold" style={{ color: '#ffd6b0' }}>{m.label}</p>
              <p className="font-cormorant text-xs italic text-gray-500">{m.sub}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default PlanetEternity;
