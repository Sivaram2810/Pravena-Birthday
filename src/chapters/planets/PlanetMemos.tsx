import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MEMOS } from '../../data/content';

const PlanetMemos: React.FC = () => {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [sortByPinned, setSortByPinned] = useState(true);

  const sorted = sortByPinned
    ? [...MEMOS].sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0))
    : MEMOS;

  return (
    <div className="min-h-screen px-4 py-8 flex flex-col items-center gap-8">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <h1 className="font-cinzel text-3xl md:text-5xl font-bold" style={{ color: '#a8d8ea', textShadow: '0 0 30px rgba(168,216,234,0.5)' }}>
          📝 MEMOS
        </h1>
        <p className="font-cormorant text-lg text-gray-300 mt-2 italic">Little notes, infinite meaning</p>
      </motion.div>

      {/* Sort toggle */}
      <div className="flex gap-3">
        {[
          { label: '📌 Pinned First', value: true },
          { label: '📋 All Notes', value: false },
        ].map(opt => (
          <button
            key={String(opt.value)}
            onClick={() => setSortByPinned(opt.value)}
            className="font-cinzel text-xs px-4 py-2 rounded-full transition-all"
            style={{
              background: sortByPinned === opt.value ? 'rgba(168,216,234,0.15)' : 'rgba(255,255,255,0.03)',
              border: `1px solid rgba(168,216,234,${sortByPinned === opt.value ? 0.4 : 0.15})`,
              color: sortByPinned === opt.value ? '#a8d8ea' : '#666',
            }}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Memo grid */}
      <div className="w-full max-w-lg grid grid-cols-1 gap-3">
        {sorted.map((memo, i) => (
          <motion.div
            key={memo.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            layout
            onClick={() => setExpanded(expanded === memo.id ? null : memo.id)}
            className="cursor-pointer rounded-2xl p-4 relative"
            style={{
              background: `linear-gradient(135deg, ${memo.color}10, ${memo.color}06)`,
              border: `1px solid ${memo.color}${expanded === memo.id ? '44' : '22'}`,
            }}
          >
            {/* Pin badge */}
            {memo.pinned && (
              <div
                className="absolute top-2 right-2 text-xs"
                style={{ color: memo.color, fontSize: 10 }}
                title="Pinned"
              >
                📌
              </div>
            )}

            <div className="flex items-start gap-3">
              <span className="text-xl flex-shrink-0 mt-0.5">{memo.emoji}</span>
              <div className="flex-1 min-w-0">
                <p className="font-cinzel text-sm font-bold truncate" style={{ color: memo.color }}>
                  {memo.title}
                </p>
                <AnimatePresence>
                  {expanded === memo.id ? (
                    <motion.p
                      key="expanded"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="font-cormorant text-sm text-gray-300 italic leading-relaxed mt-1"
                    >
                      {memo.body}
                    </motion.p>
                  ) : (
                    <p className="font-cormorant text-xs text-gray-500 italic truncate mt-0.5">{memo.body}</p>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="font-cormorant text-sm italic text-gray-500 text-center"
      >
        Every detail mattered. Every single one.
      </motion.p>
    </div>
  );
};

export default PlanetMemos;
