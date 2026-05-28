import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX, Disc3, Music2 } from 'lucide-react';
import { VINYL_RECORDS, MUSIC_TRACK } from '../../data/content';

const PlanetFrequency: React.FC = () => {
  const [selectedRecord, setSelectedRecord] = useState<typeof VINYL_RECORDS[0] | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handleSelectRecord = (record: typeof VINYL_RECORDS[0]) => {
    setSelectedRecord(record);
    setIsPlaying(false);
    setProgress(0);
  };

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().catch(console.error);
      setIsPlaying(true);
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const update = () => {
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100);
        setCurrentTime(audio.currentTime);
        setDuration(audio.duration);
      }
    };
    audio.addEventListener('timeupdate', update);
    audio.addEventListener('loadedmetadata', update);
    return () => {
      audio.removeEventListener('timeupdate', update);
      audio.removeEventListener('loadedmetadata', update);
    };
  }, [selectedRecord]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  const specialRecord = VINYL_RECORDS.find(r => r.isSpecial);

  return (
    <div className="min-h-screen px-4 py-8 flex flex-col items-center gap-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1
          className="font-cinzel text-3xl md:text-5xl font-bold"
          style={{ color: '#f7d774', textShadow: '0 0 30px rgba(247,215,116,0.5)' }}
        >
          🎵 FREQUENCY
        </h1>
        <p className="font-cormorant text-lg text-gray-300 mt-2 italic">
          Music that holds every memory
        </p>
      </motion.div>

      <div className="w-full max-w-6xl flex flex-col lg:flex-row gap-8">
        {/* Record player */}
        <motion.div
          className="flex-1 glass rounded-3xl p-6 flex flex-col items-center gap-6"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          {/* Turntable base */}
          <div className="relative w-64 h-64">
            {/* Base */}
            <div
              className="absolute inset-0 rounded-full"
              style={{ background: 'linear-gradient(135deg, #1a1a2e, #16213e)', boxShadow: 'inset 0 4px 20px rgba(0,0,0,0.5)' }}
            />

            {/* Vinyl record */}
            <motion.div
              className="absolute inset-4 rounded-full overflow-hidden"
              animate={{ rotate: isPlaying ? 360 : 0 }}
              transition={{ duration: 2, repeat: isPlaying ? Infinity : 0, ease: 'linear' }}
            >
              <div
                className="w-full h-full rounded-full flex items-center justify-center"
                style={{
                  background: selectedRecord
                    ? `conic-gradient(from 0deg, ${selectedRecord.color}44, #111, ${selectedRecord.color}22, #000, ${selectedRecord.color}33, #111, #000)`
                    : 'conic-gradient(from 0deg, #222, #111, #333, #000, #222)',
                }}
              >
                {/* Grooves */}
                {[30, 45, 60, 75, 90].map(r => (
                  <div
                    key={r}
                    className="absolute rounded-full border"
                    style={{
                      width: `${r}%`,
                      height: `${r}%`,
                      borderColor: 'rgba(255,255,255,0.03)',
                    }}
                  />
                ))}
                {/* Center label */}
                <div
                  className="absolute w-16 h-16 rounded-full flex items-center justify-center text-center z-10"
                  style={{
                    background: selectedRecord?.isSpecial
                      ? 'radial-gradient(circle, #f7d774, #d4a800)'
                      : `radial-gradient(circle, ${selectedRecord?.color || '#9b7bff'}, ${selectedRecord?.color || '#6644cc'}88)`,
                  }}
                >
                  <div>
                    <Disc3 size={14} className="mx-auto mb-0.5 text-white" />
                    <p className="text-white font-cinzel leading-none" style={{ fontSize: '6px' }}>
                      {selectedRecord?.title || 'SELECT'}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Tonearm */}
            <motion.div
              className="absolute top-4 right-4 origin-top-right"
              animate={{ rotate: isPlaying ? -15 : -30 }}
              transition={{ duration: 0.5 }}
            >
              <div className="w-20 h-0.5 bg-gray-400 origin-top-right rounded" />
              <div className="absolute bottom-0 right-0 w-1.5 h-1.5 rounded-full bg-gray-300" />
            </motion.div>
          </div>

          {/* Audio element */}
          {selectedRecord?.isSpecial && (
            <audio ref={audioRef} src={MUSIC_TRACK.url} preload="metadata" />
          )}

          {/* Now playing info */}
          <AnimatePresence mode="wait">
            {selectedRecord ? (
              <motion.div
                key={selectedRecord.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-center"
              >
                {selectedRecord.isSpecial && (
                  <span
                    className="inline-block px-2 py-0.5 rounded-full text-xs font-cinzel mb-2"
                    style={{ background: 'rgba(247,215,116,0.2)', color: '#f7d774', border: '1px solid rgba(247,215,116,0.3)' }}
                  >
                    ⭐ Our Song
                  </span>
                )}
                <h3
                  className="font-cinzel text-xl font-bold"
                  style={{ color: selectedRecord.isSpecial ? '#f7d774' : selectedRecord.color }}
                >
                  {selectedRecord.title}
                </h3>
                <p className="font-cormorant text-gray-300 italic">{selectedRecord.artist}</p>
                <p className="font-inter text-xs text-gray-500 mt-1">{selectedRecord.description}</p>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center"
              >
                <Music2 className="mx-auto mb-2 text-gray-600" size={32} />
                <p className="font-cormorant text-gray-400 italic">Select a record to play</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Controls */}
          {selectedRecord && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full flex flex-col gap-3">
              {/* Progress bar — only for Our Song */}
              {selectedRecord.isSpecial && (
                <div className="w-full">
                  <div
                    className="w-full h-1 rounded-full cursor-pointer overflow-hidden"
                    style={{ background: 'rgba(255,255,255,0.1)' }}
                    onClick={e => {
                      const audio = audioRef.current;
                      if (!audio) return;
                      const rect = e.currentTarget.getBoundingClientRect();
                      const ratio = (e.clientX - rect.left) / rect.width;
                      audio.currentTime = ratio * audio.duration;
                    }}
                  >
                    <motion.div
                      className="h-full rounded-full"
                      style={{
                        width: `${progress}%`,
                        background: 'linear-gradient(to right, #f7d774, #ff7ab6)',
                      }}
                    />
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-xs text-gray-500">{formatTime(currentTime)}</span>
                    <span className="text-xs text-gray-500">{formatTime(duration)}</span>
                  </div>
                </div>
              )}

              {/* Waveform visualization */}
              <div className="flex items-center justify-center gap-1 h-8">
                {Array.from({ length: 20 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-1 rounded-full"
                    style={{ background: selectedRecord.isSpecial ? '#f7d774' : selectedRecord.color }}
                    animate={isPlaying ? { height: [`${4 + Math.random() * 4}px`, `${12 + Math.random() * 20}px`, `${4 + Math.random() * 4}px`] } : { height: '4px' }}
                    transition={{ duration: 0.5 + Math.random() * 0.5, repeat: Infinity, delay: i * 0.05 }}
                  />
                ))}
              </div>

              {/* Play/Mute buttons — only for Our Song */}
              {selectedRecord.isSpecial && (
                <div className="flex items-center justify-center gap-4">
                  <button
                    onClick={() => {
                      const audio = audioRef.current;
                      if (!audio) return;
                      audio.muted = !isMuted;
                      setIsMuted(!isMuted);
                    }}
                    className="p-2 rounded-full glass"
                  >
                    {isMuted ? <VolumeX size={16} className="text-gray-400" /> : <Volume2 size={16} className="text-gray-400" />}
                  </button>
                  <motion.button
                    onClick={togglePlay}
                    className="w-14 h-14 rounded-full flex items-center justify-center"
                    style={{ background: 'linear-gradient(135deg, #f7d774, #ff7ab6)', boxShadow: '0 0 20px rgba(247,215,116,0.4)' }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {isPlaying ? <Pause size={22} className="text-black" /> : <Play size={22} className="text-black" />}
                  </motion.button>
                </div>
              )}
              {!selectedRecord.isSpecial && (
                <p className="text-center font-cormorant text-sm text-gray-500 italic">
                  "This melody lives in memory..."
                </p>
              )}
            </motion.div>
          )}
        </motion.div>

        {/* Records shelf */}
        <motion.div
          className="flex-1 glass rounded-3xl p-6"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="font-cinzel text-lg mb-4" style={{ color: '#ff7ab6' }}>Record Collection</h2>
          <div className="grid grid-cols-2 gap-3 custom-scroll overflow-y-auto max-h-96">
            {VINYL_RECORDS.map((record, i) => (
              <motion.button
                key={record.id}
                onClick={() => handleSelectRecord(record)}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className="relative flex flex-col items-center p-3 rounded-xl cursor-pointer transition-all"
                style={{
                  background: selectedRecord?.id === record.id
                    ? `rgba(${record.color === '#f7d774' ? '247,215,116' : '155,123,255'}, 0.15)`
                    : 'rgba(255,255,255,0.03)',
                  border: selectedRecord?.id === record.id
                    ? `1px solid ${record.color}88`
                    : '1px solid rgba(255,255,255,0.08)',
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {record.isSpecial && (
                  <span className="absolute -top-1 -right-1 text-xs">⭐</span>
                )}
                {/* Mini record */}
                <div
                  className="w-12 h-12 rounded-full mb-2 flex items-center justify-center relative"
                  style={{
                    background: `conic-gradient(from 0deg, ${record.color}66, #111, ${record.color}33, #000)`,
                    boxShadow: `0 0 10px ${record.color}44`,
                  }}
                >
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ background: record.isSpecial ? '#f7d774' : record.color }}
                  />
                </div>
                <p className="font-cinzel text-xs text-center leading-tight" style={{ color: record.color, fontSize: '10px' }}>
                  {record.title}
                </p>
                <p className="font-cormorant text-gray-500 text-center" style={{ fontSize: '10px' }}>
                  {record.artist}
                </p>
              </motion.button>
            ))}
          </div>

          {/* Special gold record callout */}
          {specialRecord && (
            <motion.div
              className="mt-4 p-3 rounded-xl"
              style={{ background: 'rgba(247,215,116,0.08)', border: '1px solid rgba(247,215,116,0.3)' }}
              animate={{ boxShadow: ['0 0 10px rgba(247,215,116,0.1)', '0 0 20px rgba(247,215,116,0.3)', '0 0 10px rgba(247,215,116,0.1)'] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <p className="font-cinzel text-xs" style={{ color: '#f7d774' }}>✨ Gold Record — "{specialRecord.title}"</p>
              <p className="font-cormorant text-xs text-gray-400 italic mt-1">
                This is the one. The song that holds everything.
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default PlanetFrequency;
