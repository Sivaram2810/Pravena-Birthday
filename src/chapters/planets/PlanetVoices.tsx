import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const voiceNotes = [
  {
    id: 1,
    label: 'First Words',
    duration: '0:42',
    color: '#9b7bff',
    transcript: '"You make everything brighter. I just wanted you to know that."',
    emoji: '💜',
  },
  {
    id: 2,
    label: 'Late Night Thought',
    duration: '1:15',
    color: '#ff7ab6',
    transcript: '"I was thinking about you and couldn\'t sleep. So I recorded this instead of texting."',
    emoji: '🌙',
  },
  {
    id: 3,
    label: 'Something I Noticed',
    duration: '0:58',
    color: '#f7d774',
    transcript: '"The way you smile when you talk about things you love — it\'s the most beautiful thing."',
    emoji: '✨',
  },
  {
    id: 4,
    label: 'Birthday Message',
    duration: '2:30',
    color: '#f7d774',
    transcript: '"Happy birthday, Sara. You deserve the entire universe and I\'m going to spend every birthday reminding you of that."',
    emoji: '🎂',
    special: true,
  },
  {
    id: 5,
    label: 'Distance Note',
    duration: '1:05',
    color: '#aaddff',
    transcript: '"Miles don\'t change anything. Not for us. Not even a little."',
    emoji: '🌌',
  },
];

const WaveformBar: React.FC<{ active: boolean; color: string; delay: number }> = ({ active, color, delay }) => (
  <motion.div
    className="rounded-full"
    style={{ width: 3, background: color, minHeight: 4 }}
    animate={active ? { height: [4, 20 + Math.random() * 16, 4] } : { height: 4 }}
    transition={active ? { duration: 0.5, repeat: Infinity, delay, ease: 'easeInOut' } : {}}
  />
);

const PlanetVoices: React.FC = () => {
  const [playingId, setPlayingId] = useState<number | null>(null);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const handlePlay = (id: number) => {
    setPlayingId(prev => prev === id ? null : id);
    setExpandedId(id);
  };

  return (
    <div className="min-h-screen px-4 py-8 flex flex-col items-center gap-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1
          className="font-cinzel text-3xl md:text-5xl font-bold"
          style={{ color: '#9b7bff', textShadow: '0 0 30px rgba(155,123,255,0.5)' }}
        >
          🟣 VOICES
        </h1>
        <p className="font-cormorant text-lg text-gray-300 mt-2 italic">
          Words whispered across the distance
        </p>
      </motion.div>

      {/* Voice note cards */}
      <div className="w-full max-w-2xl flex flex-col gap-4">
        {voiceNotes.map((note, i) => (
          <motion.div
            key={note.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="rounded-2xl overflow-hidden"
            style={{
              background: note.special
                ? 'linear-gradient(135deg, rgba(247,215,116,0.12), rgba(155,123,255,0.08))'
                : 'rgba(255,255,255,0.04)',
              border: `1px solid ${note.color}44`,
              boxShadow: playingId === note.id ? `0 0 30px ${note.color}33` : 'none',
            }}
          >
            <div className="p-4 flex items-center gap-4">
              {/* Play button */}
              <motion.button
                onClick={() => handlePlay(note.id)}
                className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                style={{
                  background: `linear-gradient(135deg, ${note.color}88, ${note.color}44)`,
                  border: `1px solid ${note.color}88`,
                  boxShadow: playingId === note.id ? `0 0 20px ${note.color}66` : 'none',
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <span className="text-xl">{playingId === note.id ? '⏸' : '▶'}</span>
              </motion.button>

              {/* Waveform */}
              <div className="flex-1 flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span className="font-cinzel text-xs" style={{ color: note.color }}>
                    {note.special && '⭐ '}{note.label}
                  </span>
                  <span className="font-inter text-xs text-gray-600">{note.duration}</span>
                </div>
                <div className="flex items-center gap-0.5" style={{ height: 28 }}>
                  {Array.from({ length: 32 }).map((_, j) => (
                    <WaveformBar
                      key={j}
                      active={playingId === note.id}
                      color={note.color}
                      delay={j * 0.04}
                    />
                  ))}
                </div>
              </div>

              {/* Emoji */}
              <span className="text-2xl flex-shrink-0">{note.emoji}</span>
            </div>

            {/* Transcript */}
            <AnimatePresence>
              {expandedId === note.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div
                    className="px-4 pb-4"
                    style={{ borderTop: `1px solid ${note.color}22` }}
                  >
                    <p
                      className="font-cormorant text-sm italic text-gray-300 leading-relaxed mt-3"
                      style={{ paddingLeft: '56px' }}
                    >
                      {note.transcript}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      {/* Ambient message */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="max-w-md text-center"
      >
        <p className="font-cormorant text-base text-gray-500 italic leading-relaxed">
          "A voice that loves you sounds different from any other.
          It carries weight. It carries warmth.
          It sounds like home even when home is far away."
        </p>
      </motion.div>
    </div>
  );
};

export default PlanetVoices;
