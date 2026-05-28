import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SURPRISE_CARDS = [
  {
    id: 's1',
    emoji: '🎬',
    title: 'Video Greetings',
    color: '#9b7bff',
    content: 'Friends and loved ones recorded special video messages just for you. Each one is a piece of someone\'s heart sent your way. Check back when the links arrive! 💜',
    type: 'upcoming',
  },
  {
    id: 's2',
    emoji: '🌟',
    title: 'A Note from the Universe',
    color: '#f7d774',
    content: 'The universe conspired to bring you into this world on this exact day. And every single person who loves you is grateful it did. Happy Birthday, Pravena. 💛',
    type: 'revealed',
  },
  {
    id: 's3',
    emoji: '🎂',
    title: 'Birthday Countdown Memory',
    color: '#ff7ab6',
    content: 'Every year, this day comes around as a reminder of how lucky we are to know you. Your birthday isn\'t just a celebration — it\'s a reminder that you exist. And that matters more than you know. 🌸',
    type: 'revealed',
  },
  {
    id: 's4',
    emoji: '💌',
    title: 'Surprise Message Loading...',
    color: '#00ffcc',
    content: 'Something special is being prepared. A clip, a memory, a wish — coming soon from someone who loves you. Stay tuned. ✨',
    type: 'upcoming',
  },
];

const TIMELINE_MEMORIES = [
  { year: '2022', memory: 'The dare that started it all', emoji: '🎲' },
  { year: '2022', memory: 'First time she laughed at my meme', emoji: '😄' },
  { year: '2022', memory: 'The night conversation just flowed', emoji: '💬' },
  { year: '2022', memory: 'Dec 18 — The proposal', emoji: '💍' },
  { year: '2022', memory: 'Dec 19, 5:30AM — Love you', emoji: '🌅' },
  { year: '2023', memory: 'First date — everything changed', emoji: '🌟' },
  { year: '2024', memory: 'Her birthday — tiny perfect date', emoji: '🎂' },
  { year: '2024', memory: 'My birthday — last meetup', emoji: '💙' },
  { year: '2026', memory: 'This birthday — this app', emoji: '🚀' },
];

const PlanetVoices: React.FC = () => {
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [revealedCards, setRevealedCards] = useState<Set<string>>(new Set(['s2', 's3']));
  const [timelineVisible, setTimelineVisible] = useState(false);

  const revealCard = (id: string) => {
    setRevealedCards(prev => new Set([...prev, id]));
  };

  return (
    <div className="min-h-screen px-4 py-8 flex flex-col items-center gap-10">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <h1
          className="font-cinzel text-3xl md:text-5xl font-bold"
          style={{ color: '#9b7bff', textShadow: '0 0 30px rgba(155,123,255,0.5)' }}
        >
          🟣 VOICES
        </h1>
        <p className="font-cormorant text-lg text-gray-300 mt-2 italic">
          Memories, moments & surprises
        </p>
      </motion.div>

      {/* Surprise cards */}
      <div className="w-full max-w-2xl flex flex-col gap-4">
        {SURPRISE_CARDS.map((card, i) => (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="rounded-2xl overflow-hidden cursor-pointer"
            style={{
              background: revealedCards.has(card.id)
                ? `linear-gradient(135deg, ${card.color}12, ${card.color}06)`
                : 'rgba(255,255,255,0.03)',
              border: `1px solid ${card.color}${revealedCards.has(card.id) ? '55' : '22'}`,
              boxShadow: expandedCard === card.id ? `0 0 25px ${card.color}22` : 'none',
            }}
            onClick={() => {
              if (!revealedCards.has(card.id)) revealCard(card.id);
              setExpandedCard(prev => prev === card.id ? null : card.id);
            }}
          >
            <div className="p-4 flex items-center gap-4">
              {/* Icon */}
              <motion.div
                className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 text-xl"
                style={{ background: `${card.color}20`, border: `1px solid ${card.color}44` }}
                animate={card.type === 'upcoming' && !revealedCards.has(card.id)
                  ? { opacity: [0.5, 1, 0.5] }
                  : {}}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {card.emoji}
              </motion.div>

              <div className="flex-1">
                <p className="font-cinzel text-xs font-bold" style={{ color: card.color }}>{card.title}</p>
                {!revealedCards.has(card.id) ? (
                  <motion.p
                    className="font-cormorant text-xs text-gray-500 italic mt-0.5"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    ✨ Tap to reveal...
                  </motion.p>
                ) : (
                  <p className="font-cormorant text-xs text-gray-400 italic mt-0.5 line-clamp-1">{card.content}</p>
                )}
              </div>

              <div className="flex items-center gap-2">
                {card.type === 'upcoming' && (
                  <span className="font-cinzel text-xs px-2 py-0.5 rounded-full" style={{ background: `${card.color}22`, color: card.color }}>
                    SOON
                  </span>
                )}
                <span className="text-gray-600 text-xs">{expandedCard === card.id ? '▲' : '▼'}</span>
              </div>
            </div>

            <AnimatePresence>
              {expandedCard === card.id && revealedCards.has(card.id) && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="px-5 pb-5" style={{ borderTop: `1px solid ${card.color}22` }}>
                    <p className="font-cormorant text-base italic text-gray-200 leading-relaxed pt-3 pl-16">
                      {card.content}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      {/* "Remember When" Timeline */}
      <div className="w-full max-w-2xl">
        <motion.button
          onClick={() => setTimelineVisible(v => !v)}
          className="w-full rounded-2xl p-4 text-left flex items-center justify-between"
          style={{
            background: 'linear-gradient(135deg, rgba(155,123,255,0.08), rgba(247,215,116,0.04))',
            border: '1px solid rgba(155,123,255,0.2)',
          }}
          whileHover={{ borderColor: 'rgba(155,123,255,0.4)' }}
          whileTap={{ scale: 0.99 }}
        >
          <div>
            <p className="font-cinzel text-sm font-bold" style={{ color: '#9b7bff' }}>🕰️ "Remember When" Moments</p>
            <p className="font-cormorant text-xs text-gray-500 italic mt-0.5">A timeline of our story</p>
          </div>
          <span className="text-gray-600">{timelineVisible ? '▲' : '▼'}</span>
        </motion.button>

        <AnimatePresence>
          {timelineVisible && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-2 rounded-2xl overflow-hidden" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(155,123,255,0.15)' }}>
                {TIMELINE_MEMORIES.map((mem, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center gap-4 p-3"
                    style={{ borderBottom: i < TIMELINE_MEMORIES.length - 1 ? '1px solid rgba(155,123,255,0.08)' : 'none' }}
                  >
                    <span className="font-cinzel text-xs text-gray-600 flex-shrink-0" style={{ minWidth: '36px' }}>{mem.year}</span>
                    <span className="text-base flex-shrink-0">{mem.emoji}</span>
                    <p className="font-cormorant text-sm text-gray-300 italic">{mem.memory}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Ambient message */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="max-w-md text-center"
      >
        <p className="font-cormorant text-base text-gray-500 italic leading-relaxed">
          "Every memory is a signal. Every moment is a frequency.
          And all of them are tuned to the same station —
          the one that plays your name."
        </p>
      </motion.div>
    </div>
  );
};

export default PlanetVoices;
