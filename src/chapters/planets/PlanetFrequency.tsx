import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play } from 'lucide-react';
import { FRIEND_VIDEOS } from '../../data/content';

const BIRTHDAY_MESSAGES = [
  {
    id: 'msg1',
    from: 'From Someone Who Cares',
    emoji: '💜',
    color: '#9b7bff',
    message: 'Hey Pravena! Wishing you the most magical birthday. You deserve all the happiness the universe can offer. Have an amazing year ahead! 🎉',
    type: 'text',
  },
  {
    id: 'msg2',
    from: 'A Birthday Wish',
    emoji: '🌟',
    color: '#f7d774',
    message: 'Happy Birthday! May every single day this year bring you joy, laughter, and all your favourite things. You are truly special. ✨',
    type: 'text',
  },
  {
    id: 'msg3',
    from: 'A Surprise Note',
    emoji: '🎂',
    color: '#ff7ab6',
    message: 'Pravena — you light up every room you walk into. Thank you for being you. Wishing you the birthday you deserve! 💖',
    type: 'text',
  },
];

const PlanetFrequency: React.FC = () => {
  const [selectedVideo, setSelectedVideo] = useState<typeof FRIEND_VIDEOS[0] | null>(null);
  const [expandedMessage, setExpandedMessage] = useState<string | null>(null);
  const [revealedCards, setRevealedCards] = useState<Set<string>>(new Set());

  const revealCard = (id: string) => {
    setRevealedCards(prev => new Set([...prev, id]));
  };

  return (
    <div className="min-h-screen px-4 py-8 flex flex-col items-center gap-10">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <h1
          className="font-cinzel text-3xl md:text-5xl font-bold"
          style={{ color: '#00ffcc', textShadow: '0 0 30px rgba(0,255,204,0.5)' }}
        >
          📡 FREQUENCY
        </h1>
        <p className="font-cormorant text-lg text-gray-300 mt-2 italic">
          Birthday wishes transmitted from across the galaxy
        </p>
      </motion.div>

      {/* Signal animation */}
      <motion.div className="relative flex items-center justify-center" style={{ height: 60 }}>
        {[1, 2, 3, 4, 5].map(i => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{ border: '1px solid rgba(0,255,204,0.3)' }}
            initial={{ width: 0, height: 0, opacity: 0.8 }}
            animate={{ width: i * 40, height: i * 40, opacity: 0 }}
            transition={{ duration: 2, delay: i * 0.3, repeat: Infinity, ease: 'easeOut' }}
          />
        ))}
        <div className="text-2xl z-10">📡</div>
      </motion.div>

      {/* Video Messages Section */}
      <div className="w-full max-w-3xl">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-6 text-center"
        >
          <h2 className="font-cinzel text-lg tracking-widest" style={{ color: '#00ffcc' }}>
            🎬 VIDEO MESSAGES
          </h2>
          <p className="font-cormorant text-sm text-gray-400 italic mt-1">
            Friends sent their love — tap to view
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          {FRIEND_VIDEOS.map((video, i) => (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
              className="rounded-2xl overflow-hidden cursor-pointer relative"
              style={{
                background: video.placeholder
                  ? 'linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02))'
                  : `linear-gradient(135deg, ${video.color}22, ${video.color}08)`,
                border: `1px solid ${video.color}44`,
                minHeight: 160,
              }}
              whileHover={{ scale: 1.02, borderColor: video.color + '88' }}
              whileTap={{ scale: 0.98 }}
              onClick={() => video.videoUrl ? setSelectedVideo(video) : null}
            >
              {/* Thumbnail / Placeholder */}
              <div
                className="w-full flex items-center justify-center relative"
                style={{ minHeight: 110, background: video.placeholder ? 'rgba(0,0,0,0.3)' : 'transparent' }}
              >
                {video.placeholder ? (
                  <motion.div
                    className="flex flex-col items-center gap-2"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <span className="text-4xl">{video.emoji}</span>
                    <span className="font-cinzel text-xs" style={{ color: video.color }}>COMING SOON</span>
                  </motion.div>
                ) : (
                  <>
                    {video.thumbnail && (
                      <img src={video.thumbnail} alt={video.name} className="w-full h-full object-cover absolute inset-0" />
                    )}
                    <div className="absolute inset-0 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.4)' }}>
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center"
                        style={{ background: `${video.color}cc` }}
                      >
                        <Play size={20} className="text-white" fill="white" />
                      </div>
                    </div>
                  </>
                )}
              </div>

              <div className="p-3">
                <p className="font-cinzel text-xs font-bold" style={{ color: video.color }}>{video.name}</p>
                <p className="font-cormorant text-xs text-gray-400 italic mt-1">{video.message}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Add video note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="rounded-2xl p-4 mb-10"
          style={{
            background: 'rgba(0,255,204,0.04)',
            border: '1px dashed rgba(0,255,204,0.2)',
          }}
        >
          <p className="font-cinzel text-xs text-center tracking-widest" style={{ color: 'rgba(0,255,204,0.5)' }}>
            📌 VIDEO LINKS WILL BE ADDED HERE
          </p>
          <p className="font-cormorant text-xs text-center text-gray-600 italic mt-1">
            When friends send their videos, they'll appear above
          </p>
        </motion.div>

        {/* Birthday Wish Cards */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mb-6 text-center"
        >
          <h2 className="font-cinzel text-lg tracking-widest" style={{ color: '#ff7ab6' }}>
            💌 BIRTHDAY WISHES
          </h2>
          <p className="font-cormorant text-sm text-gray-400 italic mt-1">
            Tap a card to reveal the message inside
          </p>
        </motion.div>

        <div className="flex flex-col gap-4">
          {BIRTHDAY_MESSAGES.map((msg, i) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              className="rounded-2xl overflow-hidden cursor-pointer"
              style={{
                background: revealedCards.has(msg.id)
                  ? `linear-gradient(135deg, ${msg.color}12, ${msg.color}06)`
                  : 'rgba(255,255,255,0.04)',
                border: `1px solid ${msg.color}${revealedCards.has(msg.id) ? '66' : '33'}`,
                boxShadow: revealedCards.has(msg.id) ? `0 0 20px ${msg.color}22` : 'none',
              }}
              onClick={() => {
                if (!revealedCards.has(msg.id)) revealCard(msg.id);
                setExpandedMessage(prev => prev === msg.id ? null : msg.id);
              }}
            >
              <div className="p-4 flex items-center gap-4">
                <motion.div
                  className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 text-2xl"
                  style={{ background: `${msg.color}22`, border: `1px solid ${msg.color}44` }}
                  whileHover={{ scale: 1.1 }}
                >
                  {msg.emoji}
                </motion.div>

                <div className="flex-1">
                  <p className="font-cinzel text-xs font-bold" style={{ color: msg.color }}>{msg.from}</p>
                  {!revealedCards.has(msg.id) && (
                    <motion.p
                      className="font-cormorant text-xs text-gray-500 italic mt-1"
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      ✨ Tap to reveal birthday wish...
                    </motion.p>
                  )}
                  {revealedCards.has(msg.id) && (
                    <p className="font-cormorant text-xs text-gray-400 italic mt-1 line-clamp-1">{msg.message}</p>
                  )}
                </div>

                <span className="text-gray-600 text-xs">{expandedMessage === msg.id ? '▲' : '▼'}</span>
              </div>

              <AnimatePresence>
                {expandedMessage === msg.id && revealedCards.has(msg.id) && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-5 pt-1" style={{ borderTop: `1px solid ${msg.color}22` }}>
                      <p
                        className="font-cormorant text-base italic text-gray-200 leading-relaxed"
                        style={{ paddingLeft: '56px' }}
                      >
                        {msg.message}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* Surprise Clips section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-10 rounded-3xl p-6 text-center"
          style={{
            background: 'linear-gradient(135deg, rgba(247,215,116,0.06), rgba(0,255,204,0.06))',
            border: '1px solid rgba(247,215,116,0.2)',
          }}
        >
          <div className="text-4xl mb-3">🎁</div>
          <h3 className="font-cinzel text-sm tracking-widest mb-2" style={{ color: '#f7d774' }}>
            MORE SURPRISES LOADING...
          </h3>
          <p className="font-cormorant text-sm text-gray-400 italic">
            Memorable moments, surprise clips, and more are being prepared for you.
            Every signal is a reminder: you are deeply loved. 💛
          </p>
          <motion.div
            className="flex justify-center gap-1 mt-4"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            {[0, 1, 2].map(i => (
              <div key={i} className="w-2 h-2 rounded-full" style={{ background: '#f7d774' }} />
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Video modal */}
      <AnimatePresence>
        {selectedVideo && selectedVideo.videoUrl && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
            style={{ background: 'rgba(0,0,0,0.95)' }}
            onClick={() => setSelectedVideo(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="relative max-w-2xl w-full rounded-2xl overflow-hidden"
              onClick={e => e.stopPropagation()}
              style={{ border: `1px solid ${selectedVideo.color}44` }}
            >
              <button
                onClick={() => setSelectedVideo(null)}
                className="absolute top-3 right-3 z-10 p-2 rounded-full"
                style={{ background: 'rgba(0,0,0,0.6)' }}
              >
                <X size={18} className="text-white" />
              </button>
              <video
                src={selectedVideo.videoUrl}
                controls
                autoPlay
                className="w-full rounded-2xl"
                style={{ maxHeight: '70vh' }}
              />
              <div className="p-4" style={{ background: 'rgba(5,8,22,0.95)' }}>
                <p className="font-cinzel text-sm font-bold" style={{ color: selectedVideo.color }}>{selectedVideo.name}</p>
                <p className="font-cormorant text-sm text-gray-400 italic mt-1">{selectedVideo.message}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PlanetFrequency;
