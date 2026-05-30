import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../contexts/AppContext';
import { UNIVERSE_NAME, BIRTHDAY_DATE } from '../data/content';

const NAME_LETTERS = UNIVERSE_NAME.split('');

interface OpeningSignalProps {
  onComplete: () => void;
}

const OpeningSignal: React.FC<OpeningSignalProps> = ({ onComplete }) => {
  const { sessionCount } = useApp();
  const [phase, setPhase] = useState(0);
  const [text1, setText1] = useState('');
  const [text2, setText2] = useState('');
  const [revealedLetters, setRevealedLetters] = useState(Array(NAME_LETTERS.length).fill(false));
  const [heartbeatActive, setHeartbeatActive] = useState(false);
  const [showSkip, setShowSkip] = useState(false);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const intervalsRef = useRef<ReturnType<typeof setInterval>[]>([]);
  const completedRef = useRef(false);

  const sched = useCallback((fn: () => void, d: number) => {
    const t = setTimeout(fn, d);
    timeoutsRef.current.push(t);
  }, []);

  const clearAll = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout);
    intervalsRef.current.forEach(clearInterval);
    timeoutsRef.current = [];
    intervalsRef.current = [];
  }, []);

  const complete = useCallback(() => {
    if (completedRef.current) return;
    completedRef.current = true;
    clearAll();
    onComplete();
  }, [clearAll, onComplete]);

  // Return visitor — faster opening
  const baseDelay = sessionCount > 1 ? 0.6 : 1;

  useEffect(() => {
    // Show skip button after 2s
    sched(() => setShowSkip(true), 2000);

    sched(() => setPhase(1), 1800 * baseDelay);
    sched(() => setPhase(2), 3200 * baseDelay);
    sched(() => setPhase(3), 4800 * baseDelay);
    sched(() => setPhase(4), 5800 * baseDelay);
    sched(() => setPhase(5), 8000 * baseDelay);
    sched(() => setPhase(6), 10000 * baseDelay);
    sched(() => setPhase(7), 11200 * baseDelay);
    sched(() => setPhase(8), 13800 * baseDelay);
    sched(() => setPhase(9), 15800 * baseDelay);
    sched(() => complete(), 17500 * baseDelay);

    return clearAll;
  }, []);

  // Typewriter text 1
  useEffect(() => {
    if (phase === 4) {
      const txt = '— SIGNAL DETECTED —';
      let i = 0;
      const iv = setInterval(() => {
        setText1(txt.slice(0, ++i));
        if (i >= txt.length) clearInterval(iv);
      }, 65);
      intervalsRef.current.push(iv);
    }
  }, [phase]);

  // Typewriter text 2
  useEffect(() => {
    if (phase === 5) {
      const txt = `Source: Someone who loves you unconditionally\nDistance: Irrelevant\nDate: ${BIRTHDAY_DATE}`;
      let i = 0;
      const iv = setInterval(() => {
        setText2(txt.slice(0, ++i));
        if (i >= txt.length) clearInterval(iv);
      }, 28);
      intervalsRef.current.push(iv);
    }
  }, [phase]);

  // Name reveal — staggered
  useEffect(() => {
    if (phase === 7) {
      NAME_LETTERS.forEach((_, i) => {
        sched(() => {
          setRevealedLetters(prev => {
            const n = [...prev];
            n[i] = true;
            return n;
          });
        }, i * 240 + 80);
      });
    }
  }, [phase]);

  // Heartbeat
  useEffect(() => {
    if (phase === 8) setHeartbeatActive(true);
  }, [phase]);

  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center overflow-hidden vignette"
      style={{ background: '#050816', zIndex: 100 }}
    >
      {/* CRT scanline overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.025) 2px, rgba(0,0,0,0.025) 4px)',
          zIndex: 10,
        }}
      />

      {/* Nebula burst background */}
      <div className="absolute inset-0 flex items-center justify-center">
        {phase >= 6 && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.8 }}
            className="relative"
          >
            {/* Core glow */}
            <motion.div
              className="absolute rounded-full pointer-events-none"
              style={{
                width: 700, height: 700,
                background: 'radial-gradient(ellipse, rgba(155,123,255,0.09) 0%, rgba(247,215,116,0.05) 40%, transparent 70%)',
                left: '50%', top: '50%', transform: 'translate(-50%, -50%)',
              }}
              animate={{ scale: [1, 1.08, 1], rotate: [0, 8, 0] }}
              transition={{ duration: 10, repeat: Infinity }}
            />

            {/* Starburst particles */}
            {Array.from({ length: 48 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full pointer-events-none"
                style={{
                  width: 2 + Math.random() * 3,
                  height: 2 + Math.random() * 3,
                  background: i % 3 === 0 ? '#f7d774' : i % 3 === 1 ? '#ff7ab6' : '#9b7bff',
                  left: '50%', top: '50%',
                }}
                initial={{ opacity: 0, x: 0, y: 0 }}
                animate={{
                  opacity: [0, 0.9, 0],
                  x: Math.cos((i / 48) * Math.PI * 2) * (120 + Math.random() * 220),
                  y: Math.sin((i / 48) * Math.PI * 2) * (120 + Math.random() * 220),
                }}
                transition={{
                  duration: 2.2 + Math.random() * 2,
                  delay: Math.random() * 0.4,
                  repeat: Infinity,
                  repeatDelay: 3.5,
                }}
              />
            ))}
          </motion.div>
        )}
      </div>

      {/* Ambient dust particles */}
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full pointer-events-none"
          style={{
            width: 1 + Math.random() * 2,
            height: 1 + Math.random() * 2,
            background: ['#f7d774', '#ff7ab6', '#9b7bff', '#ffffff'][Math.floor(Math.random() * 4)],
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{ opacity: [0, 0.5, 0], y: [0, -40 - Math.random() * 30, 0] }}
          transition={{ duration: 3 + Math.random() * 4, delay: Math.random() * 5, repeat: Infinity }}
        />
      ))}

      {/* Signal rings */}
      {phase >= 1 && phase < 4 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {[0, 1, 2].map(i => (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{ border: '1px solid rgba(155,123,255,0.4)' }}
              initial={{ width: 0, height: 0, opacity: 0.8 }}
              animate={{ width: 400 + i * 160, height: 400 + i * 160, opacity: 0 }}
              transition={{ duration: 3, delay: i * 1, repeat: Infinity, ease: 'easeOut' }}
            />
          ))}
        </div>
      )}

      {/* Content layers */}
      <div className="relative z-20 flex flex-col items-center gap-6 px-6 max-w-xl w-full">

        {/* Phase 1: Signal origin */}
        <AnimatePresence>
          {phase >= 1 && phase <= 3 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center"
            >
              <p className="font-cinzel text-xs tracking-widest" style={{ color: '#9b7bff', letterSpacing: '0.3em' }}>
                INCOMING TRANSMISSION
              </p>
              <motion.div
                className="mt-3 w-12 h-px mx-auto"
                style={{ background: 'linear-gradient(to right, transparent, #9b7bff, transparent)' }}
                animate={{ scaleX: [0, 1, 0.8, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Phase 2: Signal source */}
        <AnimatePresence>
          {phase >= 2 && phase <= 4 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="font-cormorant text-center text-gray-400 italic"
              style={{ fontSize: '1.1rem', lineHeight: '1.8' }}
            >
              Somewhere across space and time,<br />
              a message is finding its way to you.
            </motion.div>
          )}
        </AnimatePresence>

        {/* Phase 3: Loading indicator */}
        <AnimatePresence>
          {phase === 3 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex gap-1.5"
            >
              {[0, 1, 2, 3, 4].map(i => (
                <motion.div
                  key={i}
                  className="rounded-full"
                  style={{ width: 4, height: 4, background: '#9b7bff' }}
                  animate={{ opacity: [0.2, 1, 0.2] }}
                  transition={{ duration: 1, delay: i * 0.15, repeat: Infinity }}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Phase 4: Signal header */}
        <AnimatePresence>
          {phase >= 4 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center font-cinzel"
              style={{ color: '#f7d774', letterSpacing: '0.25em', fontSize: '0.85rem' }}
            >
              {text1}
              {phase === 4 && text1.length < '— SIGNAL DETECTED —'.length && (
                <span className="opacity-70">|</span>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Phase 5: Signal details */}
        <AnimatePresence>
          {phase >= 5 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass rounded-2xl p-4 text-left w-full max-w-xs"
              style={{ borderColor: 'rgba(155,123,255,0.3)' }}
            >
              {text2.split('\n').map((line, i) => (
                <p key={i} className="font-cormorant text-sm text-gray-300 italic leading-relaxed">
                  {line}
                </p>
              ))}
              {phase === 5 && (
                <span className="opacity-70 text-yellow-300">|</span>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Phase 7: Name reveal */}
        <AnimatePresence>
          {phase >= 7 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-1 md:gap-2"
            >
              {NAME_LETTERS.map((letter, i) => (
                <motion.span
                  key={i}
                  className="font-cinzel font-bold"
                  style={{
                    fontSize: 'clamp(2.5rem, 8vw, 4.5rem)',
                    color: revealedLetters[i] ? '#f7d774' : 'transparent',
                    textShadow: revealedLetters[i] ? '0 0 40px rgba(247,215,116,0.7), 0 0 80px rgba(247,215,116,0.3)' : 'none',
                    transition: 'color 0.3s ease, text-shadow 0.5s ease',
                    WebkitTextStroke: revealedLetters[i] ? '0px' : '1px rgba(155,123,255,0.3)',
                  }}
                >
                  {letter}
                </motion.span>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Phase 8: Heartbeat subtitle */}
        <AnimatePresence>
          {heartbeatActive && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <p className="font-cormorant text-xl italic text-gray-300">
                A universe built for you.
              </p>
              <motion.div
                className="mt-2 text-2xl"
                animate={heartbeatActive ? { scale: [1, 1.3, 1, 1.2, 1] } : {}}
                transition={{ duration: 1.4, repeat: Infinity }}
              >
                ♥
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Phase 9: Enter button */}
        <AnimatePresence>
          {phase >= 9 && (
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={complete}
              className="font-cinzel tracking-widest px-10 py-4 rounded-full text-sm relative overflow-hidden group"
              style={{
                background: 'linear-gradient(135deg, rgba(247,215,116,0.15), rgba(155,123,255,0.15))',
                border: '1px solid rgba(247,215,116,0.4)',
                color: '#f7d774',
              }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <motion.div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ background: 'linear-gradient(135deg, rgba(247,215,116,0.1), rgba(155,123,255,0.1))' }}
              />
              <span className="relative z-10">✦ ENTER THE UNIVERSE ✦</span>
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Skip button */}
      <AnimatePresence>
        {showSkip && phase < 9 && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={complete}
            className="fixed bottom-6 right-6 font-cinzel text-xs text-gray-600 hover:text-gray-400 transition-colors z-30"
            style={{ fontSize: 10, letterSpacing: '0.1em' }}
          >
            skip →
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default OpeningSignal;
