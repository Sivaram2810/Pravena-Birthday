import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { STAR_MESSAGES } from '../../data/content';

const PlanetEternity: React.FC = () => {
  const [hoveredStar, setHoveredStar] = useState<number | null>(null);
  const [lanternsReleased, setLanternsReleased] = useState(false);
  const [constellationDrawn, setConstellationDrawn] = useState(false);
  const [showFinal, setShowFinal] = useState(false);
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    if (lanternsReleased && constellationDrawn) {
      const t = setTimeout(() => setShowFinal(true), 1500);
      return () => clearTimeout(t);
    }
  }, [lanternsReleased, constellationDrawn]);

  const lanterns = Array.from({ length: 8 }).map((_, i) => ({
    id: i,
    delay: i * 0.5,
    x: 10 + i * 10,
    color: ['#f7d774', '#ff7ab6', '#9b7bff', '#f7d774', '#ff7ab6', '#aaddff', '#f7d774', '#ff7ab6'][i],
  }));

  const phases = [
    'The final destination.',
    'Where every journey ends and begins.',
    "The constellation of everything we've been.",
    'Eternity is not a length of time.',
    'It is the quality of a moment so beautiful it never really leaves.',
    'Happy birthday, Pravena.',
    'You are the whole sky.',
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setPhase(p => {
        if (p < phases.length - 1) return p + 1;
        clearInterval(interval);
        return p;
      });
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="min-h-screen flex flex-col items-center relative overflow-hidden"
      style={{ background: 'radial-gradient(ellipse at center bottom, #0a0520 0%, #020108 100%)' }}
    >
      {/* Deep space background */}
      {Array.from({ length: 80 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: 1 + Math.random() * 2,
            height: 1 + Math.random() * 2,
            background: 'white',
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 80}%`,
          }}
          animate={{ opacity: [0.2, 0.8, 0.2] }}
          transition={{ duration: 2 + Math.random() * 4, delay: Math.random() * 5, repeat: Infinity }}
        />
      ))}

      {/* Nebula */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 30% 40%, rgba(155,123,255,0.12) 0%, transparent 50%), radial-gradient(ellipse at 70% 60%, rgba(255,122,182,0.08) 0%, transparent 40%)',
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center pt-10 pb-6 z-10 relative"
      >
        <h1
          className="font-cinzel text-3xl md:text-5xl font-bold"
          style={{ color: '#c0c0ff', textShadow: '0 0 30px rgba(192,192,255,0.5)' }}
        >
          🌠 ETERNITY
        </h1>
        <p className="font-cormorant text-lg text-gray-300 mt-2 italic">
          The final chapter. The infinite beginning.
        </p>
      </motion.div>

      {/* Phase text */}
      <div className="z-10 relative text-center px-6 min-h-28 flex items-center justify-center mb-6">
        <AnimatePresence mode="wait">
          <motion.p
            key={phase}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="font-cormorant text-xl md:text-3xl text-gray-200 italic max-w-xl"
          >
            {phases[phase]}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* Star Map */}
      <div className="w-full max-w-3xl px-4 z-10 relative">
        <div
          className="relative w-full rounded-3xl overflow-hidden"
          style={{
            height: '320px',
            background: 'radial-gradient(ellipse at center, #0d0520 0%, #020108 100%)',
            border: '1px solid rgba(192,192,255,0.2)',
            boxShadow: '0 0 40px rgba(155,123,255,0.1)',
          }}
        >
          {/* Stars with messages */}
          {STAR_MESSAGES.map((star, i) => (
            <motion.div
              key={i}
              className="absolute cursor-pointer"
              style={{ left: `${star.x}%`, top: `${star.y}%` }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.2 }}
              onMouseEnter={() => setHoveredStar(i)}
              onMouseLeave={() => setHoveredStar(null)}
            >
              <motion.div
                className="relative"
                animate={{ scale: [1, 1.4, 1] }}
                transition={{ duration: 2 + i * 0.3, repeat: Infinity, ease: 'easeInOut' }}
              >
                <div
                  className="rounded-full"
                  style={{
                    width: 6 + star.brightness * 4,
                    height: 6 + star.brightness * 4,
                    background: 'white',
                    boxShadow: `0 0 ${8 + star.brightness * 8}px rgba(192,192,255,${star.brightness})`,
                  }}
                />
              </motion.div>

              <AnimatePresence>
                {hoveredStar === i && (
                  <motion.div
                    initial={{ opacity: 0, y: 5, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 5, scale: 0.8 }}
                    className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-1 rounded-lg z-20"
                    style={{
                      background: 'rgba(5,8,22,0.9)',
                      border: '1px solid rgba(192,192,255,0.3)',
                    }}
                  >
                    <p className="font-cinzel text-xs" style={{ color: '#c0c0ff' }}>{star.message}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}

          {/* Constellation lines */}
          <AnimatePresence>
            {constellationDrawn && (
              <motion.svg
                className="absolute inset-0 w-full h-full pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {STAR_MESSAGES.slice(0, -1).map((star, i) => {
                  const next = STAR_MESSAGES[i + 1];
                  return (
                    <motion.line
                      key={i}
                      x1={`${star.x}%`}
                      y1={`${star.y}%`}
                      x2={`${next.x}%`}
                      y2={`${next.y}%`}
                      stroke="rgba(192,192,255,0.3)"
                      strokeWidth="1"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 1 }}
                      transition={{ duration: 1, delay: i * 0.2 }}
                    />
                  );
                })}
              </motion.svg>
            )}
          </AnimatePresence>

          {/* Center label */}
          <div className="absolute bottom-4 left-4">
            <p className="font-cinzel text-xs text-gray-600 tracking-widest">PRAVENA'S CONSTELLATION</p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex gap-3 mt-4 justify-center flex-wrap">
          <motion.button
            onClick={() => setConstellationDrawn(true)}
            className="px-4 py-2 rounded-full font-cinzel text-xs"
            style={{
              background: constellationDrawn ? 'rgba(192,192,255,0.2)' : 'rgba(192,192,255,0.1)',
              border: '1px solid rgba(192,192,255,0.3)',
              color: '#c0c0ff',
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {constellationDrawn ? '✓ Constellation revealed' : '✨ Draw constellation'}
          </motion.button>

          <motion.button
            onClick={() => setLanternsReleased(true)}
            className="px-4 py-2 rounded-full font-cinzel text-xs"
            style={{
              background: lanternsReleased ? 'rgba(247,215,116,0.2)' : 'rgba(247,215,116,0.1)',
              border: '1px solid rgba(247,215,116,0.3)',
              color: '#f7d774',
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {lanternsReleased ? '✓ Lanterns released' : '🏮 Release lanterns'}
          </motion.button>
        </div>
      </div>

      {/* Lanterns */}
      <div className="fixed inset-0 pointer-events-none z-20 overflow-hidden">
        <AnimatePresence>
          {lanternsReleased && lanterns.map(lantern => (
            <motion.div
              key={lantern.id}
              className="absolute"
              style={{ left: `${lantern.x}%`, bottom: '-10%' }}
              initial={{ y: 0, opacity: 0.9 }}
              animate={{ y: '-120vh', opacity: [0.9, 0.7, 0.3, 0] }}
              transition={{ duration: 8 + lantern.id * 0.5, delay: lantern.delay, ease: 'easeOut' }}
            >
              <div className="flex flex-col items-center">
                <div
                  className="w-8 h-10 rounded-lg flex items-center justify-center text-xs relative"
                  style={{
                    background: `${lantern.color}33`,
                    border: `1px solid ${lantern.color}88`,
                    boxShadow: `0 0 15px ${lantern.color}66`,
                  }}
                >
                  🏮
                  <div
                    className="absolute bottom-full left-1/2 -translate-x-1/2 w-0.5 h-3 rounded"
                    style={{ background: `${lantern.color}66` }}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Final message */}
      <AnimatePresence>
        {showFinal && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="z-10 relative text-center px-6 mt-8 max-w-2xl"
          >
            <div
              className="p-6 rounded-3xl"
              style={{
                background: 'linear-gradient(135deg, rgba(155,123,255,0.15), rgba(255,122,182,0.1))',
                border: '1px solid rgba(192,192,255,0.3)',
                boxShadow: '0 0 40px rgba(155,123,255,0.2)',
              }}
            >
              <div className="text-4xl mb-4">🌠</div>
              <h3 className="font-cinzel text-xl font-bold mb-3" style={{ color: '#c0c0ff' }}>
                The End. The Beginning.
              </h3>
              <p className="font-cormorant text-lg text-gray-200 italic leading-relaxed">
                "Every star in this map is a moment I am grateful for.
                Every lantern carries a wish for your future.
                And every single one of them has your name written in light.
                <br /><br />
                Happy birthday, Pravena.
                <br />
                You are not just loved.
                <br />
                You are the reason love exists at all."
              </p>
              <p className="font-cinzel text-sm mt-4" style={{ color: '#f7d774' }}>
                — From the universe, with love 🌌
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="h-20" />
    </div>
  );
};

export default PlanetEternity;
