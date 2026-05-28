import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TIDE_MESSAGES } from '../../data/content';

const PlanetTide: React.FC = () => {
  const [currentMessage, setCurrentMessage] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!started) return;
    const interval = setInterval(() => {
      setCurrentMessage(m => {
        if (m < TIDE_MESSAGES.length - 1) return m + 1;
        clearInterval(interval);
        return m;
      });
    }, 3500);
    return () => clearInterval(interval);
  }, [started]);

  const msg = TIDE_MESSAGES[currentMessage];
  const phaseColor = msg?.phase === 'before'
    ? { wave: '#006994', sky: '#1a3a4a', text: '#a0c8e0' }
    : msg?.phase === 'turning'
    ? { wave: '#4466aa', sky: '#1a2050', text: '#c0b0ff' }
    : { wave: '#2d1b69', sky: '#050816', text: '#f7d774' };

  return (
    <div
      className="min-h-screen flex flex-col relative overflow-hidden"
      style={{ background: `linear-gradient(to bottom, ${phaseColor.sky}, #020108)`, transition: 'background 2s ease' }}
    >
      {/* Stars (appear in 'after' phase) */}
      {msg?.phase === 'after' && (
        Array.from({ length: 40 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: 1 + Math.random() * 2,
              height: 1 + Math.random() * 2,
              background: 'white',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 40}%`,
            }}
            animate={{ opacity: [0.2, 0.8, 0.2] }}
            transition={{ duration: 2 + Math.random() * 3, repeat: Infinity, delay: Math.random() * 2 }}
          />
        ))
      )}

      {/* Moon */}
      {msg?.phase !== 'before' && (
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 0.8, y: 0 }} className="absolute top-10 right-16">
          <div
            className="w-16 h-16 rounded-full"
            style={{ background: 'radial-gradient(circle at 35% 35%, #fffff0, #c8c8a0)', boxShadow: '0 0 30px rgba(220,220,180,0.3)' }}
          />
        </motion.div>
      )}

      {/* Sun */}
      {msg?.phase === 'before' && (
        <motion.div
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute top-10 right-16"
        >
          <div
            className="w-16 h-16 rounded-full"
            style={{ background: 'radial-gradient(circle, #fff9c4, #ffd700)', boxShadow: '0 0 40px rgba(255,215,0,0.5)' }}
          />
        </motion.div>
      )}

      {/* Title */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center pt-10 z-10 relative">
        <h1
          className="font-cinzel text-3xl md:text-5xl font-bold"
          style={{ color: phaseColor.text, textShadow: `0 0 30px ${phaseColor.wave}88`, transition: 'color 2s ease' }}
        >
          🌊 TIDE
        </h1>
        <p className="font-cormorant text-lg text-gray-300 mt-2 italic">The transformation story</p>
      </motion.div>

      {/* Message display */}
      <div className="flex-1 flex items-center justify-center px-6 z-10 relative">
        {!started ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
            <div className="text-5xl mb-6">🌊</div>
            <p className="font-cormorant text-xl text-gray-300 italic mb-8">Let the tide tell you the story of change</p>
            <motion.button
              onClick={() => setStarted(true)}
              className="px-8 py-3 rounded-full font-cinzel text-sm"
              style={{
                background: 'linear-gradient(135deg, rgba(0,105,148,0.4), rgba(45,27,105,0.4))',
                border: '1px solid rgba(0,105,148,0.6)',
                color: '#a0c8e0',
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Begin the tide
            </motion.button>
          </motion.div>
        ) : (
          <div className="max-w-xl w-full text-center">
            <AnimatePresence mode="wait">
              <motion.p
                key={currentMessage}
                initial={{ opacity: 0, y: 30, filter: 'blur(5px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0)' }}
                exit={{ opacity: 0, y: -20, filter: 'blur(5px)' }}
                transition={{ duration: 0.8 }}
                className="font-cormorant text-2xl md:text-4xl italic leading-relaxed"
                style={{ color: phaseColor.text, transition: 'color 2s ease' }}
              >
                {msg?.text}
              </motion.p>
            </AnimatePresence>

            {/* Phase indicator */}
            <motion.div
              className="mt-8 flex items-center justify-center gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {TIDE_MESSAGES.map((_, i) => (
                <div
                  key={i}
                  className="rounded-full transition-all duration-500"
                  style={{
                    width: i === currentMessage ? 20 : 6,
                    height: 6,
                    background: i <= currentMessage ? phaseColor.wave : 'rgba(255,255,255,0.1)',
                  }}
                />
              ))}
            </motion.div>

            <div className="flex justify-between mt-4 px-4">
              <span className="font-cinzel text-xs text-gray-600">Before</span>
              <span className="font-cinzel text-xs text-gray-600">After</span>
            </div>
          </div>
        )}
      </div>

      {/* Ocean waves */}
      <div className="relative z-10 overflow-hidden" style={{ height: 200 }}>
        {[0, 1, 2].map(layer => (
          <motion.div
            key={layer}
            className="absolute bottom-0 left-0 right-0"
            style={{ height: 200 - layer * 30 }}
          >
            <svg viewBox="0 0 1200 200" preserveAspectRatio="none" className="w-full h-full">
              <motion.path
                d={`M0,${60 + layer * 20} C200,${20 + layer * 15} 400,${100 + layer * 20} 600,${60 + layer * 20} C800,${20 + layer * 15} 1000,${100 + layer * 20} 1200,${60 + layer * 20} L1200,200 L0,200 Z`}
                fill={`${phaseColor.wave}${layer === 0 ? 'dd' : layer === 1 ? 'aa' : '77'}`}
                animate={{
                  d: [
                    `M0,${60 + layer * 20} C200,${20 + layer * 15} 400,${100 + layer * 20} 600,${60 + layer * 20} C800,${20 + layer * 15} 1000,${100 + layer * 20} 1200,${60 + layer * 20} L1200,200 L0,200 Z`,
                    `M0,${80 + layer * 20} C200,${100 + layer * 15} 400,${30 + layer * 20} 600,${70 + layer * 20} C800,${100 + layer * 15} 1000,${40 + layer * 20} 1200,${80 + layer * 20} L1200,200 L0,200 Z`,
                    `M0,${60 + layer * 20} C200,${20 + layer * 15} 400,${100 + layer * 20} 600,${60 + layer * 20} C800,${20 + layer * 15} 1000,${100 + layer * 20} 1200,${60 + layer * 20} L1200,200 L0,200 Z`,
                  ],
                }}
                transition={{ duration: 4 + layer * 1.5, repeat: Infinity, ease: 'easeInOut', delay: layer * 0.5 }}
              />
            </svg>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default PlanetTide;
