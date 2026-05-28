import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LETTERS } from '../../data/content';
import { X, Lock, Unlock } from 'lucide-react';

const PlanetMemos: React.FC = () => {
  const [selectedLetter, setSelectedLetter] = useState<typeof LETTERS[0] | null>(null);
  const [sealBroken, setSealBroken] = useState(false);

  const letterColors = ['#9b7bff', '#ff7ab6', '#f7d774'];

  return (
    <div className="min-h-screen px-4 py-8 flex flex-col items-center gap-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1
          className="font-cinzel text-3xl md:text-5xl font-bold"
          style={{ color: '#ff4444', textShadow: '0 0 30px rgba(255,68,68,0.4)' }}
        >
          🔴 MEMOS
        </h1>
        <p className="font-cormorant text-lg text-gray-300 mt-2 italic">
          Letters written from the heart
        </p>
      </motion.div>

      {/* Letters stack */}
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-6">
        {LETTERS.map((letter, i) => (
          <motion.div
            key={letter.id}
            initial={{ opacity: 0, y: 30, rotate: (i - 1) * 2 }}
            animate={{ opacity: 1, y: 0, rotate: (i - 1) * 1 }}
            transition={{ delay: i * 0.15 }}
            whileHover={{ rotate: 0, y: -5, scale: 1.02 }}
            className="relative cursor-pointer"
            onClick={() => { if (!letter.sealed || sealBroken) setSelectedLetter(letter); }}
          >
            {/* Envelope */}
            <div
              className="rounded-2xl overflow-hidden shadow-2xl"
              style={{
                background: `linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03))`,
                border: `1px solid ${letterColors[i % letterColors.length]}44`,
                boxShadow: `0 8px 32px rgba(0,0,0,0.3), 0 0 20px ${letterColors[i % letterColors.length]}22`,
              }}
            >
              {/* Envelope top flap */}
              <div
                className="h-12 relative flex items-center justify-center"
                style={{
                  background: `linear-gradient(135deg, ${letterColors[i % letterColors.length]}33, ${letterColors[i % letterColors.length]}11)`,
                  borderBottom: `1px solid ${letterColors[i % letterColors.length]}22`,
                }}
              >
                <div
                  className="absolute top-2 w-16 h-0.5 rounded"
                  style={{ background: letterColors[i % letterColors.length] + '66' }}
                />
                {letter.sealed ? (
                  <div className="flex items-center gap-2">
                    <Lock size={12} style={{ color: '#f7d774' }} />
                    <span className="font-cinzel text-xs" style={{ color: '#f7d774' }}>SEALED</span>
                  </div>
                ) : (
                  <span className="text-lg">✉️</span>
                )}
              </div>

              {/* Letter content preview */}
              <div className="p-4">
                <div
                  className="w-8 h-0.5 mb-3 rounded"
                  style={{ background: letter.ink + '88' }}
                />
                <h3 className="font-cinzel text-sm font-bold text-white mb-1">{letter.title}</h3>
                <p className="font-cormorant text-xs text-gray-400 italic mb-3">{letter.date}</p>
                <div
                  className="h-px w-full mb-3"
                  style={{ background: `linear-gradient(to right, ${letter.ink}44, transparent)` }}
                />
                <p className="font-cormorant text-xs text-gray-400 italic leading-relaxed line-clamp-3">
                  {letter.content.substring(0, 100)}...
                </p>

                <div className="mt-3 flex items-center justify-between">
                  {letter.sealed && !sealBroken ? (
                    <span className="text-xs font-cinzel" style={{ color: '#f7d774' }}>Click to break seal</span>
                  ) : (
                    <span className="text-xs font-cinzel text-gray-500">Click to read</span>
                  )}
                  <span
                    className="text-xs px-2 py-0.5 rounded-full"
                    style={{ background: `${letterColors[i % letterColors.length]}22`, color: letterColors[i % letterColors.length] }}
                  >
                    {i + 1}/{LETTERS.length}
                  </span>
                </div>
              </div>
            </div>

            {/* Wax seal */}
            {letter.sealed && !sealBroken && (
              <motion.div
                className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full flex items-center justify-center z-10 cursor-pointer"
                style={{
                  background: 'radial-gradient(circle, #dc143c, #8b0000)',
                  boxShadow: '0 0 10px rgba(220,20,60,0.4)',
                }}
                whileHover={{ scale: 1.2 }}
                onClick={(e) => { e.stopPropagation(); setSealBroken(true); setSelectedLetter(letter); }}
              >
                <span className="text-white font-cinzel font-bold text-xs">💌</span>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Watermark background text */}
      <div
        className="fixed inset-0 flex items-center justify-center pointer-events-none opacity-3 z-0"
        style={{ transform: 'rotate(-45deg)' }}
      >
        <p className="font-cinzel text-9xl font-bold text-white opacity-5 select-none">
          PRAVENA
        </p>
      </div>

      {/* Letter modal */}
      <AnimatePresence>
        {selectedLetter && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
            style={{ background: 'rgba(0,0,0,0.92)' }}
            onClick={() => setSelectedLetter(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, rotateY: -90 }}
              animate={{ scale: 1, opacity: 1, rotateY: 0 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 150, damping: 20 }}
              className="max-w-2xl w-full max-h-[85vh] overflow-y-auto custom-scroll rounded-3xl relative"
              style={{
                background: 'linear-gradient(135deg, #1a0f0f, #0d0a20)',
                border: `1px solid ${selectedLetter.ink}44`,
                boxShadow: `0 0 60px rgba(0,0,0,0.8), 0 0 30px ${selectedLetter.ink}22`,
              }}
              onClick={e => e.stopPropagation()}
            >
              {/* Paper texture overlay */}
              <div
                className="absolute inset-0 rounded-3xl pointer-events-none"
                style={{
                  backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 28px, rgba(255,255,255,0.02) 28px, rgba(255,255,255,0.02) 29px)',
                }}
              />

              <div className="relative z-10 p-8">
                <button
                  onClick={() => setSelectedLetter(null)}
                  className="absolute top-4 right-4 glass rounded-full p-2"
                >
                  <X size={16} className="text-gray-400" />
                </button>

                {/* Header */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-1">
                    {selectedLetter.sealed && (
                      <Unlock size={12} style={{ color: '#f7d774' }} />
                    )}
                    <span className="font-cinzel text-xs tracking-widest text-gray-500">
                      {selectedLetter.date}
                    </span>
                  </div>
                  <h2
                    className="font-cinzel text-2xl font-bold"
                    style={{ color: selectedLetter.ink }}
                  >
                    {selectedLetter.title}
                  </h2>
                  <div
                    className="h-0.5 mt-3 w-24 rounded"
                    style={{ background: selectedLetter.ink + '66' }}
                  />
                </div>

                {/* Letter body */}
                <div className="font-cormorant text-base md:text-lg text-gray-200 leading-relaxed whitespace-pre-line">
                  {selectedLetter.content}
                </div>

                {/* Bottom flourish */}
                <div className="mt-8 text-center">
                  <div
                    className="inline-flex items-center gap-2 px-4 py-1 rounded-full text-xs font-cinzel"
                    style={{
                      background: `${selectedLetter.ink}11`,
                      border: `1px solid ${selectedLetter.ink}33`,
                      color: selectedLetter.ink + 'cc',
                    }}
                  >
                    💌 Written with love
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PlanetMemos;
