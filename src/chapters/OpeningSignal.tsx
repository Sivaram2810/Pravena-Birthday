import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const NAME_LETTERS = ['P', 'R', 'A', 'V', 'E', 'N', 'A'];

interface OpeningSignalProps {
  onComplete: () => void;
}

const OpeningSignal: React.FC<OpeningSignalProps> = ({ onComplete }) => {
  const [phase, setPhase] = useState(0);
  const [text1, setText1] = useState('');
  const [text2, setText2] = useState('');
  const [revealedLetters, setRevealedLetters] = useState(Array(7).fill(false));
  const [heartbeatActive, setHeartbeatActive] = useState(false);
  const timeouts = useRef<ReturnType<typeof setTimeout>[]>([]);
  const intervals = useRef<ReturnType<typeof setInterval>[]>([]);

  const sched = (fn: () => void, d: number) => {
    const t = setTimeout(fn, d);
    timeouts.current.push(t);
  };

  useEffect(() => {
    sched(() => setPhase(1), 2000);
    sched(() => setPhase(2), 3500);
    sched(() => setPhase(3), 5000);
    sched(() => setPhase(4), 6200);
    sched(() => setPhase(5), 8500);
    sched(() => setPhase(6), 10800);
    sched(() => setPhase(7), 11800);
    sched(() => setPhase(8), 14500);
    sched(() => setPhase(9), 16500);

    return () => {
      timeouts.current.forEach(clearTimeout);
      intervals.current.forEach(clearInterval);
    };
  }, []);

  // Typewriter text1
  useEffect(() => {
    if (phase === 4) {
      const txt = '— SIGNAL DETECTED —';
      let i = 0;
      const iv = setInterval(() => {
        setText1(txt.slice(0, ++i));
        if (i >= txt.length) clearInterval(iv);
      }, 70);
      intervals.current.push(iv);
    }
  }, [phase]);

  // Typewriter text2
  useEffect(() => {
    if (phase === 5) {
      const txt = 'Source: Someone who loves you unconditionally\nDistance: Irrelevant';
      let i = 0;
      const iv = setInterval(() => {
        setText2(txt.slice(0, ++i));
        if (i >= txt.length) clearInterval(iv);
      }, 35);
      intervals.current.push(iv);
    }
  }, [phase]);

  // Name reveal
  useEffect(() => {
    if (phase === 7) {
      NAME_LETTERS.forEach((_, i) => {
        sched(() => {
          setRevealedLetters(prev => {
            const n = [...prev];
            n[i] = true;
            return n;
          });
        }, i * 280 + 100);
      });
    }
  }, [phase]);

  // Heartbeat
  useEffect(() => {
    if (phase === 8) {
      setHeartbeatActive(true);
    }
  }, [phase]);

  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center overflow-hidden"
      style={{ background: '#050816', zIndex: 100 }}
    >
      {/* CRT scanline overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)',
          zIndex: 10,
        }}
      />

      {/* Nebula explosion background */}
      <div className="absolute inset-0 flex items-center justify-center">
        {phase >= 6 && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5 }}
            className="relative"
          >
            <motion.div
              className="absolute rounded-full"
              style={{
                width: 600,
                height: 600,
                background: 'radial-gradient(ellipse, rgba(155,123,255,0.08) 0%, rgba(247,215,116,0.05) 40%, transparent 70%)',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
              }}
              animate={{ scale: [1, 1.1, 1], rotate: [0, 5, 0] }}
              transition={{ duration: 8, repeat: Infinity }}
            />
            {Array.from({ length: 40 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full"
                style={{
                  width: 2 + Math.random() * 3,
                  height: 2 + Math.random() * 3,
                  background: i % 3 === 0 ? '#f7d774' : i % 3 === 1 ? '#ff7ab6' : '#9b7bff',
                  left: '50%',
                  top: '50%',
                }}
                initial={{ opacity: 0, x: 0, y: 0 }}
                animate={{
                  opacity: [0, 0.8, 0],
                  x: Math.cos((i / 40) * Math.PI * 2) * (100 + Math.random() * 200),
                  y: Math.sin((i / 40) * Math.PI * 2) * (100 + Math.random() * 200),
                }}
                transition={{ duration: 2 + Math.random() * 2, delay: Math.random() * 0.5, repeat: Infinity, repeatDelay: 3 }}
              />
            ))}
          </motion.div>
        )}
      </div>

      {/* Ambient floating dust */}
      {Array.from({ length: 25 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full pointer-events-none"
          style={{
            width: 1 + Math.random() * 2,
            height: 1 + Math.random() * 2,
            background: ['#f7d774', '#ff7ab6', '#9b7bff', '#ffffff'][Math.floor(Math.random() * 4)],
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            opacity: 0,
          }}
          animate={{ opacity: [0, 0.6, 0], y: [0, -30 - Math.random() * 30, 0] }}
          transition={{ duration: 3 + Math.random() * 4, delay: Math.random() * 5, repeat: Infinity }}
        />
      ))}

      {/* Signal rings */}
      <div className="absolute inset-0 flex items-center justify-center">
        {phase >= 1 && phase < 4 && (
          <div className="relative flex items-center justify-center">
            {[1, 2, 3, 4].map(i => (
              <motion.div
                key={i}
                className="absolute rounded-full"
                style={{ border: '1px solid rgba(155,123,255,0.4)' }}
                initial={{ width: 0, height: 0, opacity: 0.8 }}
                animate={{ width: i * 120, height: i * 120, opacity: 0 }}
                transition={{ duration: 2, delay: i * 0.3, repeat: Infinity, ease: 'easeOut' }}
              />
            ))}
            <motion.div
              className="rounded-full"
              style={{ width: 12, height: 12, background: '#9b7bff', boxShadow: '0 0 20px #9b7bff' }}
              animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          </div>
        )}
      </div>

      {/* Transmission text */}
      <div className="absolute inset-0 flex items-center justify-center">
        {phase === 2 && (
          <motion.div
            initial={{ opacity: 0, letterSpacing: '0.5em' }}
            animate={{ opacity: 1, letterSpacing: '0.3em' }}
            exit={{ opacity: 0 }}
            className="text-center"
          >
            <p
              className="font-cinzel text-sm tracking-widest"
              style={{ color: '#9b7bff', textShadow: '0 0 20px rgba(155,123,255,0.8)' }}
            >
              INCOMING TRANSMISSION
            </p>
          </motion.div>
        )}
      </div>

      {/* Glitch lines */}
      <div className="absolute inset-0 flex items-center justify-center">
        {phase === 3 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full">
            {Array.from({ length: 10 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute"
                style={{
                  top: `${10 + i * 8}%`,
                  left: `${Math.random() * 40}%`,
                  width: `${20 + Math.random() * 40}%`,
                  height: 1,
                  background: `rgba(155,123,255,${0.1 + Math.random() * 0.4})`,
                }}
                animate={{ opacity: [0, 1, 0], x: [0, 10, 0] }}
                transition={{ duration: 0.3, delay: i * 0.1, repeat: Infinity }}
              />
            ))}
            <motion.div
              className="text-center"
              animate={{ opacity: [0, 1, 0, 1, 0, 1] }}
              transition={{ duration: 0.8, repeat: 3 }}
            >
              <p className="font-cinzel text-xs tracking-widest" style={{ color: '#ff7ab6' }}>DECODING...</p>
            </motion.div>
          </motion.div>
        )}
      </div>

      {/* Main content area */}
      <div className="relative z-10 text-center px-4 flex flex-col items-center gap-6">
        {/* SIGNAL DETECTED */}
        <div className="h-8">
          {phase >= 4 && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="font-cinzel text-sm tracking-widest"
              style={{ color: '#f7d774', textShadow: '0 0 10px rgba(247,215,116,0.6)' }}
            >
              {text1}
            </motion.p>
          )}
        </div>

        {/* Source / Distance */}
        <div className="h-12">
          {phase >= 5 && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="font-cormorant text-base text-gray-400 italic whitespace-pre-line leading-relaxed"
            >
              {text2}
            </motion.p>
          )}
        </div>

        {/* Name assembly */}
        <div className="min-h-32">
          {phase >= 7 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center gap-4">
              <div className="flex items-center gap-1 md:gap-2">
                {NAME_LETTERS.map((letter, i) => (
                  <div key={i} className="relative" style={{ width: 48, height: 72, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {revealedLetters[i] && (
                      <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.5 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                      >
                        <span
                          className="font-cinzel font-bold"
                          style={{
                            fontSize: '2.5rem',
                            color: '#f7d774',
                            textShadow: '0 0 30px rgba(247,215,116,0.8), 0 0 60px rgba(247,215,116,0.4)',
                          }}
                        >
                          {letter}
                        </span>
                        {/* Letter particle */}
                        <motion.div
                          className="absolute inset-0 rounded-full pointer-events-none"
                          style={{ background: 'radial-gradient(circle, rgba(247,215,116,0.2), transparent)' }}
                          animate={{ scale: [0, 2], opacity: [0.8, 0] }}
                          transition={{ duration: 0.6 }}
                        />
                      </motion.div>
                    )}
                  </div>
                ))}
              </div>

              {/* Dots */}
              <div className="flex gap-2">
                {revealedLetters[6] && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                    className="flex gap-1.5"
                  >
                    {NAME_LETTERS.map((_, i) => (
                      <motion.div
                        key={i}
                        className="rounded-full"
                        style={{ width: 4, height: 4, background: '#f7d774' }}
                        animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
                        transition={{ duration: 2, delay: i * 0.15, repeat: Infinity }}
                      />
                    ))}
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </div>

        {/* Heartbeat */}
        <div className="h-16 flex items-center justify-center">
          {phase >= 8 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <motion.span
                className="text-4xl"
                animate={heartbeatActive ? {
                  scale: [1, 1.4, 1, 1.2, 1],
                } : {}}
                transition={{ duration: 0.8, repeat: Infinity, repeatDelay: 0.5 }}
              >
                💛
              </motion.span>
            </motion.div>
          )}
        </div>

        {/* CTA — No skip button, just enter button */}
        <div className="h-20 flex items-center justify-center">
          {phase >= 9 && (
            <motion.button
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              onClick={onComplete}
              className="relative px-8 py-4 rounded-full font-cinzel text-sm tracking-widest overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, rgba(247,215,116,0.15), rgba(155,123,255,0.15))',
                border: '1px solid rgba(247,215,116,0.4)',
                color: '#f7d774',
                boxShadow: '0 0 30px rgba(247,215,116,0.1)',
              }}
              whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(247,215,116,0.3)' }}
              whileTap={{ scale: 0.97 }}
            >
              I'm ready to feel everything
              {/* Shimmer */}
              <motion.div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
                  translateX: '-100%',
                }}
                animate={{ translateX: ['−100%', '200%'] }}
                transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
              />
              {/* Pulse ring */}
              <motion.div
                className="absolute inset-0 rounded-full pointer-events-none"
                style={{ border: '1px solid rgba(247,215,116,0.3)' }}
                animate={{ scale: [1, 1.05, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OpeningSignal;
