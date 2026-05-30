import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RELATIONSHIP_START, BIRTHDAY_DATE, UNIVERSE_NAME, SENDER_NAME } from '../../data/content';

const getTimeSince = (dateStr: string) => {
  const start = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - start.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  return { days, hours, minutes, seconds };
};

const PlanetEternity: React.FC = () => {
  const [elapsed, setElapsed] = useState(getTimeSince(RELATIONSHIP_START));
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const iv = setInterval(() => {
      setElapsed(getTimeSince(RELATIONSHIP_START));
    }, 1000);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setRevealed(true), 1500);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="min-h-screen px-4 py-8 flex flex-col items-center gap-8">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <h1 className="font-cinzel text-3xl md:text-5xl font-bold" style={{ color: '#ffd6b0', textShadow: '0 0 30px rgba(255,214,176,0.5)' }}>
          ♾️ ETERNITY
        </h1>
        <p className="font-cormorant text-lg text-gray-300 mt-2 italic">The place without an end</p>
      </motion.div>

      {/* Live timer */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
        className="w-full max-w-sm"
      >
        <div
          className="glass rounded-3xl p-6 text-center"
          style={{ border: '1px solid rgba(255,214,176,0.3)', boxShadow: '0 0 40px rgba(255,214,176,0.06)' }}
        >
          <p className="font-cinzel text-xs tracking-widest mb-4 text-gray-500">
            TIME SINCE "{UNIVERSE_NAME.toUpperCase()}"
          </p>
          <div className="grid grid-cols-4 gap-2 mb-4">
            {[
              { value: elapsed.days, label: 'DAYS' },
              { value: elapsed.hours, label: 'HRS' },
              { value: elapsed.minutes, label: 'MIN' },
              { value: elapsed.seconds, label: 'SEC' },
            ].map(({ value, label }) => (
              <div key={label} className="flex flex-col items-center">
                <motion.div
                  key={value}
                  className="font-cinzel text-2xl font-bold tabular-nums"
                  style={{ color: '#ffd6b0' }}
                  animate={{ scale: [1.1, 1] }}
                  transition={{ duration: 0.15 }}
                >
                  {String(value).padStart(2, '0')}
                </motion.div>
                <p className="font-cinzel text-xs text-gray-600 mt-0.5" style={{ fontSize: 8, letterSpacing: '0.1em' }}>
                  {label}
                </p>
              </div>
            ))}
          </div>
          <p className="font-cormorant text-xs italic text-gray-500">
            Since {RELATIONSHIP_START}
          </p>
        </div>
      </motion.div>

      {/* Message */}
      <AnimatePresence>
        {revealed && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-sm flex flex-col gap-4"
          >
            {[
              'Every second of this counter is a second I\'ve been grateful.',
              `${elapsed.days} days since everything changed. Not a single one wasted.`,
              'Eternity isn\'t infinite time. It\'s the feeling that some moments could never be long enough.',
              `Between ${SENDER_NAME} and ${UNIVERSE_NAME} — there is no countdown. Only continuation.`,
            ].map((line, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.2 }}
                className="glass rounded-2xl p-4"
                style={{ border: '1px solid rgba(255,214,176,0.15)' }}
              >
                <p className="font-cormorant text-base italic text-gray-300 leading-relaxed">
                  {line.replace('{days}', String(elapsed.days))}
                </p>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Birthday note */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="w-full max-w-sm glass rounded-3xl p-6 text-center"
        style={{ border: '1px solid rgba(255,214,176,0.25)' }}
      >
        <p className="text-3xl mb-2">🌅</p>
        <p className="font-cinzel text-xs mb-1 text-gray-500">CELEBRATING</p>
        <p className="font-cinzel text-sm font-bold" style={{ color: '#ffd6b0' }}>{BIRTHDAY_DATE}</p>
        <p className="font-cormorant text-sm italic text-gray-400 mt-2">
          Another year of being exactly you. The universe celebrates.
        </p>
      </motion.div>
    </div>
  );
};

export default PlanetEternity;
