import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, Music, Pause } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { MUSIC_TRACK } from '../data/content';

const AudioPlayer: React.FC = () => {
  const { audioPlaying, audioMuted, toggleAudio, toggleMute, setAudioPlaying } = useApp();
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [error, setError] = useState(false);
  const [_loaded, setLoaded] = useState(false);
  const [volume] = useState(0.25);
  const expandTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Initialize audio element
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = volume;
    audio.loop = true;
    audio.preload = 'none';

    const onCanPlay = () => setLoaded(true);
    const onError = () => setError(true);
    const onEnded = () => setAudioPlaying(false);

    audio.addEventListener('canplaythrough', onCanPlay);
    audio.addEventListener('error', onError);
    audio.addEventListener('ended', onEnded);

    return () => {
      audio.removeEventListener('canplaythrough', onCanPlay);
      audio.removeEventListener('error', onError);
      audio.removeEventListener('ended', onEnded);
    };
  }, [setAudioPlaying, volume]);

  // Sync play state
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audioPlaying) {
      audio.play().catch(() => {
        setError(true);
        setAudioPlaying(false);
      });
    } else {
      audio.pause();
    }
  }, [audioPlaying, setAudioPlaying]);

  // Sync mute state
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = audioMuted;
  }, [audioMuted]);

  // Auto-collapse expanded panel
  const handleMouseEnter = () => {
    if (expandTimerRef.current) clearTimeout(expandTimerRef.current);
    setIsExpanded(true);
  };
  const handleMouseLeave = () => {
    expandTimerRef.current = setTimeout(() => setIsExpanded(false), 1500);
  };

  useEffect(() => {
    return () => {
      if (expandTimerRef.current) clearTimeout(expandTimerRef.current);
    };
  }, []);

  const handleTogglePlay = () => {
    toggleAudio();
    setIsExpanded(true);
  };

  return (
    <div
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <audio
        ref={audioRef}
        src={MUSIC_TRACK.url}
        preload="none"
      />

      <AnimatePresence>
        {isExpanded && !error && (
          <motion.div
            initial={{ opacity: 0, x: 20, width: 0 }}
            animate={{ opacity: 1, x: 0, width: 'auto' }}
            exit={{ opacity: 0, x: 20, width: 0 }}
            className="glass rounded-full px-4 py-2 flex items-center gap-3 overflow-hidden"
          >
            {/* Track info */}
            <div className="flex flex-col" style={{ minWidth: 100 }}>
              <span className="font-cinzel text-xs whitespace-nowrap" style={{ color: '#f7d774', fontSize: 10, letterSpacing: '0.05em' }}>
                {MUSIC_TRACK.title}
              </span>
              <span className="font-cormorant text-xs whitespace-nowrap" style={{ color: '#888', fontSize: 9 }}>
                {MUSIC_TRACK.artist}
              </span>
            </div>

            {/* Waveform bars */}
            {audioPlaying && !audioMuted && (
              <div className="flex items-center gap-0.5 h-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="rounded-full"
                    style={{ width: 2, backgroundColor: '#f7d774' }}
                    animate={{ height: ['4px', `${8 + i * 2}px`, '4px'] }}
                    transition={{
                      duration: 0.6 + i * 0.1,
                      repeat: Infinity,
                      delay: i * 0.12,
                      ease: 'easeInOut',
                    }}
                  />
                ))}
              </div>
            )}

            {/* Mute */}
            <button
              onClick={toggleMute}
              className="text-gray-400 hover:text-white transition-colors p-1 rounded-full"
              aria-label={audioMuted ? 'Unmute' : 'Mute'}
            >
              {audioMuted ? <VolumeX size={12} /> : <Volume2 size={12} />}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main play/pause button */}
      <motion.button
        onClick={handleTogglePlay}
        className="relative rounded-full p-3 flex items-center justify-center"
        style={{
          background: 'linear-gradient(135deg, #f7d774, #ff7ab6)',
          boxShadow: audioPlaying
            ? '0 0 25px rgba(247,215,116,0.5), 0 0 50px rgba(255,122,182,0.2)'
            : '0 0 12px rgba(247,215,116,0.2)',
        }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        aria-label={audioPlaying ? 'Pause music' : 'Play music'}
      >
        {audioPlaying
          ? <Pause size={15} className="text-black" />
          : <Music size={15} className="text-black" />
        }

        {/* Pulse ring when playing */}
        {audioPlaying && (
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{ border: '2px solid rgba(247,215,116,0.5)' }}
            animate={{ scale: [1, 1.8], opacity: [0.6, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
          />
        )}
      </motion.button>

      {/* Error fallback */}
      {error && (
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="font-cinzel text-xs absolute -bottom-6 right-0 whitespace-nowrap"
          style={{ color: '#ff7ab6', fontSize: 9 }}
        >
          ♪ no audio
        </motion.span>
      )}
    </div>
  );
};

export default AudioPlayer;
