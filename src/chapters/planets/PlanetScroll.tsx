import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { SCROLL_LETTER_LINES, UNIVERSE_NAME, SENDER_NAME } from '../../data/content';

const PlanetScroll: React.FC = () => {
  const [lineIndex, setLineIndex] = useState(0);
  const [auto, setAuto] = useState(false);

  useEffect(() => {
    if (!auto) return;
    if (lineIndex >= SCROLL_LETTER_LINES.length - 1) return;
    const t = setTimeout(() => setLineIndex(l => l + 1), 500);
    return () => clearTimeout(t);
  }, [auto, lineIndex]);

  return (
    <div className="min-h-screen px-4 py-8 flex flex-col items-center gap-8">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <h1 className="font-cinzel text-3xl md:text-5xl font-bold" style={{ color: '#d4b8ff', textShadow: '0 0 30px rgba(212,184,255,0.5)' }}>
          📖 SCROLL
        </h1>
        <p className="font-cormorant text-lg text-gray-300 mt-2 italic">A letter written across universes</p>
        <p className="font-cinzel text-xs text-gray-500 mt-1">
          For {UNIVERSE_NAME.toUpperCase()} — from {SENDER_NAME.toUpperCase()}
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg rounded-3xl overflow-hidden"
        style={{
          background: 'linear-gradient(180deg, rgba(212,184,255,0.06), rgba(5,8,22,0.9))',
          border: '1px solid rgba(212,184,255,0.2)',
        }}
      >
        {/* Header */}
        <div
          className="px-6 py-4 flex items-center justify-between"
          style={{ borderBottom: '1px solid rgba(212,184,255,0.12)', background: 'rgba(212,184,255,0.04)' }}
        >
          <p className="font-cinzel text-xs text-gray-600" style={{ fontSize: 8, letterSpacing: '0.15em' }}>
            PERSONAL TRANSMISSION — ENCRYPTED
          </p>
          <p className="font-cinzel text-xs text-gray-600" style={{ fontSize: 8 }}>
            {Math.min(lineIndex + 1, SCROLL_LETTER_LINES.length)}/{SCROLL_LETTER_LINES.length} lines
          </p>
        </div>

        {/* Letter content */}
        <div className="px-6 py-5 min-h-64">
          {SCROLL_LETTER_LINES.slice(0, lineIndex + 1).map((line, i) => {
            const isEmpty = line === '';
            const isHeader = line.startsWith('Dear') || line.startsWith('—') || line.startsWith('P.S.');
            const isSignature = line.startsWith('— ');
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {isEmpty ? (
                  <div className="h-3" />
                ) : (
                  <p
                    className="font-cormorant leading-relaxed"
                    style={{
                      color: isSignature ? '#d4b8ff' : isHeader ? '#f0e6ff' : '#d0c8e0',
                      fontStyle: 'italic',
                      fontSize: isHeader ? '1.1rem' : '1rem',
                      fontWeight: isHeader ? 600 : 400,
                    }}
                  >
                    {line}
                  </p>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Controls */}
        <div
          className="px-6 py-4 flex items-center justify-between gap-3"
          style={{ borderTop: '1px solid rgba(212,184,255,0.1)' }}
        >
          <div className="flex gap-2">
            <motion.button
              onClick={() => setLineIndex(l => Math.max(0, l - 1))}
              disabled={lineIndex === 0}
              className="px-3 py-1.5 rounded-full font-cinzel text-xs"
              style={{
                border: '1px solid rgba(212,184,255,0.2)',
                color: lineIndex === 0 ? '#333' : '#d4b8ff',
                opacity: lineIndex === 0 ? 0.4 : 1,
              }}
              whileHover={lineIndex > 0 ? { scale: 1.05 } : {}}
            >
              ← Prev
            </motion.button>
            <motion.button
              onClick={() => setLineIndex(l => Math.min(SCROLL_LETTER_LINES.length - 1, l + 1))}
              disabled={lineIndex >= SCROLL_LETTER_LINES.length - 1}
              className="px-3 py-1.5 rounded-full font-cinzel text-xs"
              style={{
                border: '1px solid rgba(212,184,255,0.3)',
                color: '#d4b8ff',
                opacity: lineIndex >= SCROLL_LETTER_LINES.length - 1 ? 0.4 : 1,
              }}
              whileHover={lineIndex < SCROLL_LETTER_LINES.length - 1 ? { scale: 1.05 } : {}}
            >
              Next →
            </motion.button>
          </div>
          <motion.button
            onClick={() => { setAuto(a => !a); }}
            className="px-3 py-1.5 rounded-full font-cinzel text-xs"
            style={{
              background: auto ? 'rgba(212,184,255,0.15)' : 'transparent',
              border: '1px solid rgba(212,184,255,0.25)',
              color: '#d4b8ff',
            }}
            whileHover={{ scale: 1.05 }}
          >
            {auto ? '⏸ Pause' : '▶ Auto-read'}
          </motion.button>
        </div>
      </motion.div>

      {lineIndex >= SCROLL_LETTER_LINES.length - 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <p className="font-cormorant text-lg italic" style={{ color: '#d4b8ff' }}>
            The letter has found you. ✨
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default PlanetScroll;
