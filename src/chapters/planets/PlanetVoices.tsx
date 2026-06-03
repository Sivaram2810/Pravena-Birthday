import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FRIENDS_VIDEOS, UNIVERSE_NAME } from '../../data/content';

const VideoCard: React.FC<{
  friend: typeof FRIENDS_VIDEOS[0];
  index: number;
}> = ({ friend, index }) => {
  const [expanded, setExpanded] = useState(false);

  const colors = ['#ffb3d9', '#f7d774', '#9b7bff', '#7be3ff', '#ff7ab6', '#ffe4a0', '#a8d8ea', '#e0c3ff', '#b4f7a0', '#ffb3d9', '#f7d774'];
  const color = colors[index % colors.length];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07 }}
      className="rounded-2xl overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${color}10, ${color}06)`,
        border: `1px solid ${color}35`,
      }}
    >
      {/* Video frame */}
      <div
        className="relative aspect-video flex items-center justify-center cursor-pointer group"
        style={{ background: `linear-gradient(135deg, ${color}12, rgba(5,8,22,0.9))` }}
        onClick={() => {
          if (friend.videoUrl) {
            window.open(friend.videoUrl, '_blank');
          } else {
            setExpanded(prev => !prev);
          }
        }}
      >
        {/* Play button */}
        <motion.div
          className="w-14 h-14 rounded-full flex items-center justify-center relative z-10"
          style={{
            background: friend.videoUrl ? `${color}33` : 'rgba(255,255,255,0.06)',
            border: `2px solid ${color}${friend.videoUrl ? '66' : '22'}`,
          }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="text-2xl">
            {friend.videoUrl ? '▶' : '💌'}
          </span>
        </motion.div>

        {/* Grid lines decoration */}
        <div
          className="absolute inset-0 pointer-events-none opacity-10"
          style={{
            backgroundImage: `linear-gradient(${color}40 1px, transparent 1px), linear-gradient(90deg, ${color}40 1px, transparent 1px)`,
            backgroundSize: '20px 20px',
          }}
        />

        {/* Status indicator */}
        <div className="absolute top-3 right-3">
          <div
            className="px-2 py-0.5 rounded-full font-cinzel"
            style={{
              background: friend.videoUrl ? `${color}22` : 'rgba(255,255,255,0.06)',
              border: `1px solid ${friend.videoUrl ? color + '44' : 'rgba(255,255,255,0.1)'}`,
              fontSize: 7,
              color: friend.videoUrl ? color : '#555',
              letterSpacing: '0.06em',
            }}
          >
            {friend.videoUrl ? 'WATCH' : 'SOON'}
          </div>
        </div>

        {/* Name overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-3" style={{ background: 'linear-gradient(to top, rgba(5,8,22,0.9), transparent)' }}>
          <p className="font-cinzel text-xs font-bold" style={{ color, letterSpacing: '0.1em' }}>
            {friend.name.toUpperCase()}
          </p>
        </div>
      </div>

      {/* Wish text */}
      <div className="p-3">
        <AnimatePresence>
          {expanded || friend.videoUrl ? (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="font-cormorant text-sm text-gray-300 italic leading-relaxed"
            >
              {friend.wishText}
            </motion.p>
          ) : (
            <motion.button
              onClick={() => setExpanded(true)}
              className="font-cinzel text-xs"
              style={{ color: color, fontSize: 8, letterSpacing: '0.08em', opacity: 0.7 }}
              whileHover={{ opacity: 1 }}
            >
              tap to read wish ›
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

const PlanetVoices: React.FC = () => {
  return (
    <div className="min-h-screen px-4 py-8 flex flex-col items-center gap-8">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <h1 className="font-cinzel text-3xl md:text-5xl font-bold" style={{ color: '#ffb3d9', textShadow: '0 0 30px rgba(255,179,217,0.5)' }}>
          💌 VOICES
        </h1>
        <p className="font-cormorant text-lg text-gray-300 mt-2 italic">Birthday wishes from those who love you</p>
        <p className="font-cinzel text-xs text-gray-600 mt-1">{FRIENDS_VIDEOS.length} friends. One big universe of love.</p>
      </motion.div>

      <div className="w-full max-w-2xl grid grid-cols-2 md:grid-cols-3 gap-4">
        {FRIENDS_VIDEOS.map((friend, i) => (
          <VideoCard key={friend.name} friend={friend} index={i} />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="w-full max-w-2xl glass rounded-3xl p-6 text-center"
        style={{ border: '1px solid rgba(255,179,217,0.35)' }}
      >
        <p className="text-3xl mb-3">🎂</p>
        <p className="font-cinzel text-sm" style={{ color: '#ffb3d9' }}>Happy Birthday, {UNIVERSE_NAME}.</p>
        <p className="font-cormorant text-base italic text-gray-300 mt-2 leading-relaxed">
          Every single one of these is meant. Not just today — but every day you wake up and choose to be the remarkable person you are.
        </p>
      </motion.div>
    </div>
  );
};

export default PlanetVoices;
