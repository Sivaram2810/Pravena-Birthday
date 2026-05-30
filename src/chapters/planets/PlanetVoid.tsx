import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../../contexts/AppContext';
import { VOID_CONFESSIONS } from '../../data/content';

const PlanetVoid: React.FC = () => {
  const { voidIndex, nextVoidConfession } = useApp();
  const [typewriterText, setTypewriterText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [localIndex, setLocalIndex] = useState(voidIndex % VOID_CONFESSIONS.length);
  const [klickCount, setKlickCount] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const currentText = VOID_CONFESSIONS[localIndex];

  const typeText = (text: string) => {
    setIsTyping(true);
    setTypewriterText('');
    let i = 0;
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setTypewriterText(text.slice(0, ++i));
      if (i >= text.length) {
        clearInterval(intervalRef.current!);
        setIsTyping(false);
      }
    }, 30);
  };

  useEffect(() => {
    typeText(currentText);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [localIndex, currentText]);

  const nextConfession = () => {
    if (isTyping) {
      // Skip typing — show full text
      if (intervalRef.current) clearInterval(intervalRef.current);
      setTypewriterText(currentText);
      setIsTyping(false);
      return;
    }
    setKlickCount(prev => prev + 1);
    nextVoidConfession();
    const next = (localIndex + 1) % VOID_CONFESSIONS.length;
    setLocalIndex(next);
  };

  return (
    <div className="min-h-screen px-4 py-8 flex flex-col items-center justify-center gap-8">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <h1 className="font-cinzel text-3xl md:text-5xl font-bold" style={{ color: '#8888aa', textShadow: '0 0 30px rgba(136,136,170,0.5)' }}>
          🌑 VOID
        </h1>
        <p className="font-cormorant text-lg text-gray-400 mt-2 italic">The space between stars — where I keep the truest things</p>
      </motion.div>

      {/* Confession display */}
      <motion.div
        className="w-full max-w-md relative"
        onClick={nextConfession}
      >
        <div
          className="glass rounded-3xl p-8 text-center cursor-pointer relative overflow-hidden"
          style={{
            border: '1px solid rgba(136,136,170,0.25)',
            minHeight: 160,
          }}
        >
          {/* Ambient glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `radial-gradient(ellipse at center, rgba(136,136,170,${0.04 + klickCount * 0.005}) 0%, transparent 70%)`,
            }}
          />

          <p
            className="font-cormorant text-xl italic leading-relaxed relative z-10"
            style={{ color: '#c0c0d8' }}
          >
            {typewriterText}
            {isTyping && <span className="opacity-70" style={{ color: '#8888aa' }}>|</span>}
          </p>

          {!isTyping && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              transition={{ delay: 0.8 }}
              className="font-cinzel text-xs mt-4 text-gray-600"
              style={{ fontSize: 9, letterSpacing: '0.1em' }}
            >
              tap for next confession
            </motion.p>
          )}

          {/* Confession counter */}
          <div className="absolute top-3 right-3 flex gap-1">
            {VOID_CONFESSIONS.map((_, i) => (
              <div
                key={i}
                className="rounded-full transition-all duration-300"
                style={{
                  width: 5, height: 5,
                  background: i === localIndex ? '#8888aa' : 'rgba(136,136,170,0.2)',
                }}
              />
            ))}
          </div>
        </div>
      </motion.div>

      {/* Depth layer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="text-center max-w-sm"
      >
        <p className="font-cormorant text-base italic text-gray-500 leading-relaxed">
          {klickCount >= VOID_CONFESSIONS.length
            ? 'You have heard every whisper from the void. It remembers you now.'
            : `${VOID_CONFESSIONS.length - (klickCount % VOID_CONFESSIONS.length)} confessions remaining.`}
        </p>
      </motion.div>

      {/* Easter egg — after cycling through all */}
      <AnimatePresence>
        {klickCount >= VOID_CONFESSIONS.length && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-3xl p-6 max-w-sm w-full text-center"
            style={{ border: '1px solid rgba(155,123,255,0.3)' }}
          >
            <p className="text-2xl mb-2">🌌</p>
            <p className="font-cinzel text-xs tracking-widest mb-2" style={{ color: '#9b7bff' }}>VOID FULLY EXPLORED</p>
            <p className="font-cormorant text-sm italic text-gray-400">
              The void is not empty. It is full of everything I didn't say out loud. Thank you for listening.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PlanetVoid;
