import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface OpeningSignalProps {
  onComplete: () => void;
}

const NAME_LETTERS = ['P', 'R', 'A', 'V', 'E', 'N', 'A'];

const OpeningSignal: React.FC<OpeningSignalProps> = ({ onComplete }) => {
  const [phase, setPhase] = useState(0);
  // phase 0: black
  // phase 1: signal ping
  // phase 2: transmission text
  // phase 3: glitch
  // phase 4: text1 "SIGNAL DETECTED"
  // phase 5: text2 subtitle
  // phase 6: nebula explosion
  // phase 7: name assembly
  // phase 8: heartbeat
  // phase 9: button

  const [text1, setText1] = useState('');
  const [text2, setText2] = useState('');
  const [revealedLetters, setRevealedLetters] = useState<boolean[]>(Array(7).fill(false));
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
      className="fixed inset-0 flex items-center justify-center overflow-hidden select-none"
      style={{ background: '#000', zIndex: 1000 }}
    >
      {/* CRT scanline overlay */}
      <div
        className="absolute inset-0 pointer-events-none z-50"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.04), rgba(0,0,0,0.04) 1px, transparent 1px, transparent 4px)',
        }}
      />

      {/* Nebula explosion background */}
      <AnimatePresence>
        {phase >= 6 && (
          <motion.div
            key="nebula"
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <div
              className="absolute inset-0"
              style={{
                background: `
                  radial-gradient(ellipse at 50% 50%, rgba(155,123,255,0.25) 0%, transparent 50%),
                  radial-gradient(ellipse at 20% 30%, rgba(255,122,182,0.15) 0%, transparent 40%),
                  radial-gradient(ellipse at 80% 70%, rgba(247,215,116,0.1) 0%, transparent 40%),
                  #050816
                `,
              }}
            />
            {/* Burst particles */}
            {Array.from({ length: 40 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full"
                style={{
                  width: Math.random() * 4 + 1,
                  height: Math.random() * 4 + 1,
                  background: ['#f7d774', '#ff7ab6', '#9b7bff', '#ffffff'][i % 4],
                  left: '50%',
                  top: '50%',
                }}
                initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                animate={{
                  x: (Math.random() - 0.5) * 800,
                  y: (Math.random() - 0.5) * 600,
                  opacity: 0,
                  scale: 0,
                }}
                transition={{ duration: 1.5 + Math.random(), ease: 'easeOut' }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Ambient floating dust */}
      {Array.from({ length: 25 }).map((_, i) => (
        <motion.div
          key={`dust-${i}`}
          className="absolute rounded-full pointer-events-none"
          style={{
            width: Math.random() * 3 + 0.5,
            height: Math.random() * 3 + 0.5,
            background: ['#9b7bff', '#ff7ab6', '#f7d774'][i % 3],
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{ y: [0, -20, 0], opacity: [0, 0.4, 0], scale: [0, 1, 0] }}
          transition={{
            duration: 4 + Math.random() * 4,
            delay: Math.random() * 8,
            repeat: Infinity,
          }}
        />
      ))}

      {/* Signal rings */}
      <AnimatePresence>
        {phase >= 1 && phase < 4 && (
          <motion.div
            key="signal-rings"
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {[1, 2, 3, 4].map(i => (
              <motion.div
                key={i}
                className="absolute rounded-full"
                style={{ border: `1px solid rgba(155,123,255,${0.5 - i * 0.1})` }}
                initial={{ width: 20, height: 20, opacity: 0.9 }}
                animate={{ width: 200 * i, height: 200 * i, opacity: 0 }}
                transition={{
                  duration: 2.5,
                  delay: i * 0.3,
                  repeat: Infinity,
                  ease: 'easeOut',
                }}
              />
            ))}
            <motion.div
              className="w-3 h-3 rounded-full"
              style={{ background: '#9b7bff', boxShadow: '0 0 20px #9b7bff, 0 0 40px #9b7bff44' }}
              animate={{ scale: [1, 1.8, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Transmission text */}
      <AnimatePresence>
        {phase === 2 && (
          <motion.div
            key="transmission"
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <p
              className="font-cinzel text-sm md:text-base tracking-[0.4em]"
              style={{ color: '#9b7bff', textShadow: '0 0 10px #9b7bff' }}
            >
              INCOMING TRANSMISSION
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Glitch lines */}
      <AnimatePresence>
        {phase === 3 && (
          <motion.div
            key="glitch-lines"
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {Array.from({ length: 10 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute h-px"
                style={{
                  left: 0,
                  right: 0,
                  top: `${5 + i * 9}%`,
                  background: `rgba(${i % 2 === 0 ? '155,123,255' : '255,122,182'}, 0.6)`,
                }}
                animate={{
                  scaleX: [0, 1, 0.3, 0.8, 0],
                  opacity: [0, 1, 0.5, 1, 0],
                  x: ['-5%', '0%', '5%', '0%'],
                }}
                transition={{ duration: 0.4, delay: i * 0.06, repeat: 2 }}
              />
            ))}
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              animate={{ x: [-4, 4, -3, 3, 0] }}
              transition={{ duration: 0.3, repeat: 3 }}
            >
              <p
                className="font-cinzel text-2xl md:text-3xl tracking-widest"
                style={{ color: '#ff7ab6', textShadow: '2px 0 #9b7bff, -2px 0 #f7d774' }}
              >
                DECODING...
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content area */}
      <div className="relative z-10 flex flex-col items-center justify-center gap-6 md:gap-10 text-center px-6">

        {/* SIGNAL DETECTED */}
        <AnimatePresence>
          {phase >= 4 && (
            <motion.div
              key="text1"
              initial={{ opacity: 0, letterSpacing: '0.8em', y: -20 }}
              animate={{ opacity: 1, letterSpacing: '0.25em', y: 0 }}
              className="font-cinzel text-xs md:text-sm tracking-[0.25em]"
              style={{ color: '#9b7bff' }}
            >
              {text1}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Source / Distance */}
        <AnimatePresence>
          {phase >= 5 && (
            <motion.div
              key="text2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="font-cormorant text-base md:text-lg text-gray-300 whitespace-pre-line leading-relaxed"
              style={{ fontStyle: 'italic' }}
            >
              {text2}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Name assembly */}
        <AnimatePresence>
          {phase >= 7 && (
            <motion.div key="name" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="flex items-center gap-2 md:gap-4">
                {NAME_LETTERS.map((letter, i) => (
                  <AnimatePresence key={i}>
                    {revealedLetters[i] && (
                      <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.3, filter: 'blur(15px)' }}
                        animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0)' }}
                        transition={{ type: 'spring', stiffness: 180, damping: 14 }}
                        className="font-cinzel font-bold relative"
                        style={{
                          fontSize: 'clamp(28px, 6vw, 72px)',
                          color: '#f7d774',
                          textShadow: '0 0 30px rgba(247,215,116,1), 0 0 60px rgba(247,215,116,0.5), 0 0 100px rgba(247,215,116,0.2)',
                        }}
                      >
                        {letter}
                        {/* Letter particle effect */}
                        <motion.div
                          className="absolute inset-0 flex items-center justify-center pointer-events-none"
                          initial={{ scale: 2, opacity: 0.8 }}
                          animate={{ scale: 0, opacity: 0 }}
                          transition={{ duration: 0.5 }}
                        >
                          <div
                            className="w-full h-full rounded-full"
                            style={{ background: 'rgba(247,215,116,0.4)', filter: 'blur(10px)' }}
                          />
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                ))}
              </div>

              {/* Dots */}
              <AnimatePresence>
                {revealedLetters[6] && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="flex justify-center gap-3 md:gap-6 mt-1 md:mt-2"
                  >
                    {NAME_LETTERS.map((_, i) => (
                      <motion.div
                        key={i}
                        className="w-1 h-1 rounded-full"
                        style={{ background: '#ff7ab6' }}
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 2, delay: i * 0.15, repeat: Infinity }}
                      />
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Heartbeat */}
        <AnimatePresence>
          {phase >= 8 && (
            <motion.div
              key="heartbeat"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
            >
              <motion.span
                className="text-4xl md:text-6xl block"
                animate={heartbeatActive ? { scale: [1, 1.4, 1, 1.25, 1] } : {}}
                transition={{ duration: 0.7, repeat: 4, repeatDelay: 0.3 }}
                style={{ filter: 'drop-shadow(0 0 20px rgba(255,122,182,0.9))' }}
              >
                💛
              </motion.span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* CTA */}
        <AnimatePresence>
          {phase >= 9 && (
            <motion.button
              key="cta"
              initial={{ opacity: 0, y: 40, scale: 0.7 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: 'spring', stiffness: 120, damping: 12 }}
              onClick={onComplete}
              className="relative mt-2 px-8 md:px-12 py-3 md:py-4 rounded-full font-cinzel text-xs md:text-sm tracking-[0.2em] text-black font-bold cursor-pointer overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, #f7d774 0%, #ff7ab6 50%, #9b7bff 100%)',
                boxShadow: '0 0 40px rgba(247,215,116,0.6), 0 0 80px rgba(255,122,182,0.3)',
              }}
              whileHover={{
                scale: 1.06,
                boxShadow: '0 0 60px rgba(247,215,116,0.8), 0 0 100px rgba(255,122,182,0.4)',
              }}
              whileTap={{ scale: 0.97 }}
            >
              I'm ready to feel everything
              {/* Shimmer */}
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{
                  background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)',
                }}
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
              />
              {/* Pulse ring */}
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{ border: '2px solid rgba(247,215,116,0.6)' }}
                animate={{ scale: [1, 1.4], opacity: [0.8, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default OpeningSignal;
