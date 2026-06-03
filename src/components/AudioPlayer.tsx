import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Volume2, VolumeX, Music } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { MUSIC_TRACK } from '../data/content';

const AudioPlayer: React.FC = () => {
  const { audioPlaying, audioMuted, toggleAudio, toggleMute } = useApp();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio(MUSIC_TRACK.url);
    audioRef.current.loop = true;
    audioRef.current.volume = 0.3;
    return () => {
      audioRef.current?.pause();
      audioRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!audioRef.current) return;
    if (audioPlaying) {
      audioRef.current.play().catch(() => {});
    } else {
      audioRef.current.pause();
    }
  }, [audioPlaying]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = audioMuted;
    }
  }, [audioMuted]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="fixed bottom-6 right-4 z-50 flex items-center gap-2"
    >
      <motion.button
        onClick={toggleMute}
        className="p-2 rounded-full"
        style={{
          background: 'rgba(5,8,22,0.85)',
          border: '1px solid rgba(247,215,116,0.2)',
          color: '#f7d774',
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        title={audioMuted ? 'Unmute' : 'Mute'}
      >
        {audioMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
      </motion.button>

      <motion.button
        onClick={toggleAudio}
        className="flex items-center gap-2 px-3 py-2 rounded-full font-cinzel text-xs"
        style={{
          background: audioPlaying ? 'rgba(247,215,116,0.12)' : 'rgba(5,8,22,0.85)',
          border: `1px solid rgba(247,215,116,${audioPlaying ? 0.4 : 0.2})`,
          color: '#f7d774',
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Music size={12} />
        <span style={{ fontSize: 9, letterSpacing: '0.08em' }}>
          {audioPlaying ? 'PLAYING' : 'MUSIC'}
        </span>
        {audioPlaying && (
          <div className="flex gap-0.5 items-end" style={{ height: 10 }}>
            {[0, 1, 2].map(i => (
              <motion.div
                key={i}
                className="w-0.5 rounded-full"
                style={{ background: '#f7d774' }}
                animate={{ height: ['4px', '10px', '4px'] }}
                transition={{ duration: 0.6, delay: i * 0.15, repeat: Infinity }}
              />
            ))}
          </div>
        )}
      </motion.button>
    </motion.div>
  );
};

export default AudioPlayer;
