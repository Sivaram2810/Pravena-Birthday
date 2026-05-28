import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, Music, Pause } from 'lucide-react';
import { MUSIC_TRACK } from '../data/content';

const AudioPlayer: React.FC = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = 0.3;
    audio.loop = true;
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().then(() => setIsPlaying(true)).catch(() => setError(true));
    }
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <audio
        ref={audioRef}
        src={MUSIC_TRACK.url}
        onError={() => setError(true)}
        preload="metadata"
      />

      <motion.div
        className="flex items-center gap-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2 }}
      >
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, x: 20, width: 0 }}
              animate={{ opacity: 1, x: 0, width: 'auto' }}
              exit={{ opacity: 0, x: 20, width: 0 }}
              className="glass rounded-full px-3 py-2 flex items-center gap-2 overflow-hidden"
            >
              <span className="text-xs font-cinzel whitespace-nowrap" style={{ color: '#f7d774' }}>
                {MUSIC_TRACK.title}
              </span>
              {/* Waveform bars */}
              {isPlaying && (
                <div className="flex items-center gap-0.5 h-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <motion.div
                      key={i}
                      className="w-0.5 rounded-full"
                      style={{ backgroundColor: '#f7d774' }}
                      animate={{ height: ['4px', '16px', '4px'] }}
                      transition={{
                        duration: 0.8,
                        repeat: Infinity,
                        delay: i * 0.15,
                        ease: 'easeInOut',
                      }}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center gap-1">
          <motion.button
            onClick={toggleMute}
            className="glass rounded-full p-2 text-white hover:text-yellow-300 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
          </motion.button>

          <motion.button
            onClick={() => { togglePlay(); setIsExpanded(true); }}
            className="rounded-full p-3 flex items-center justify-center relative"
            style={{
              background: 'linear-gradient(135deg, #f7d774, #ff7ab6)',
              boxShadow: '0 0 20px rgba(247, 215, 116, 0.4)',
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onMouseEnter={() => setIsExpanded(true)}
            onMouseLeave={() => setIsExpanded(false)}
          >
            {isPlaying ? <Pause size={16} className="text-black" /> : <Music size={16} className="text-black" />}
            {isPlaying && (
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{ border: '2px solid rgba(247, 215, 116, 0.5)' }}
                animate={{ scale: [1, 1.5], opacity: [0.8, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            )}
          </motion.button>
        </div>
      </motion.div>

      {error && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xs text-center mt-1"
          style={{ color: '#ff7ab6' }}
        >
          ♪ load music
        </motion.p>
      )}
    </div>
  );
};

export default AudioPlayer;
