import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TANGLISH_CHAT, UNIVERSE_NAME } from '../../data/content';

const PlanetTide: React.FC = () => {
  const [visibleCount, setVisibleCount] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [finished, setFinished] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (!isPlaying || visibleCount >= TANGLISH_CHAT.length) return;

    const delay = visibleCount === 0 ? 500 : 800 + Math.random() * 600;
    timerRef.current = setTimeout(() => {
      setVisibleCount(prev => {
        const next = prev + 1;
        if (next >= TANGLISH_CHAT.length) setFinished(true);
        return next;
      });
    }, delay);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isPlaying, visibleCount]);

  useEffect(() => {
    scrollToBottom();
  }, [visibleCount]);

  const restart = () => {
    setVisibleCount(0);
    setFinished(false);
    setIsPlaying(true);
  };

  return (
    <div className="min-h-screen px-4 py-8 flex flex-col items-center gap-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <h1 className="font-cinzel text-3xl md:text-5xl font-bold" style={{ color: '#74c7f7', textShadow: '0 0 30px rgba(116,199,247,0.5)' }}>
          🌊 TIDE
        </h1>
        <p className="font-cormorant text-lg text-gray-300 mt-2 italic">The pull between two hearts</p>
        <p className="font-cinzel text-xs text-gray-600 mt-1">A night we talked till the world went quiet</p>
      </motion.div>

      {/* Chat container */}
      <div className="w-full max-w-sm">
        <div
          className="rounded-3xl overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(116,199,247,0.05), rgba(5,8,22,0.9))',
            border: '1px solid rgba(116,199,247,0.2)',
            minHeight: '60vh',
            maxHeight: '65vh',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Chat header */}
          <div
            className="px-4 py-3 flex items-center gap-3"
            style={{ borderBottom: '1px solid rgba(116,199,247,0.15)', background: 'rgba(5,8,22,0.6)' }}
          >
            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'rgba(116,199,247,0.2)' }}>
              <span className="text-sm">🌊</span>
            </div>
            <div>
              <p className="font-cinzel text-xs font-bold" style={{ color: '#74c7f7' }}>{UNIVERSE_NAME}</p>
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#4ade80' }} />
                <p className="font-cinzel text-xs text-gray-500" style={{ fontSize: 8 }}>online</p>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-3 py-4 flex flex-col gap-2" style={{ minHeight: 0 }}>
            {!isPlaying && visibleCount === 0 && (
              <div className="flex-1 flex items-center justify-center">
                <p className="font-cormorant text-sm text-gray-600 italic text-center">
                  A night where everything became clear...
                </p>
              </div>
            )}

            {TANGLISH_CHAT.slice(0, visibleCount).map((msg, i) => {
              const isMe = msg.from === 'him';
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                  className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                >
                  <div style={{ maxWidth: '78%' }}>
                    <div
                      className="px-3.5 py-2 rounded-2xl font-cormorant text-sm"
                      style={{
                        background: isMe
                          ? 'linear-gradient(135deg, rgba(116,199,247,0.25), rgba(116,199,247,0.15))'
                          : 'rgba(255,255,255,0.06)',
                        border: isMe
                          ? '1px solid rgba(116,199,247,0.35)'
                          : '1px solid rgba(255,255,255,0.1)',
                        color: isMe ? '#cce9fb' : '#ddd',
                        borderBottomRightRadius: isMe ? 4 : undefined,
                        borderBottomLeftRadius: !isMe ? 4 : undefined,
                      }}
                    >
                      {msg.text}
                    </div>
                    <p
                      className="font-cinzel mt-0.5 px-1"
                      style={{
                        fontSize: 8,
                        color: '#444',
                        textAlign: isMe ? 'right' : 'left',
                        letterSpacing: '0.05em',
                      }}
                    >
                      {msg.time}
                    </p>
                  </div>
                </motion.div>
              );
            })}

            {/* Typing indicator */}
            {isPlaying && !finished && visibleCount > 0 && visibleCount < TANGLISH_CHAT.length && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-start"
              >
                <div
                  className="px-3 py-2 rounded-2xl flex items-center gap-1"
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
                >
                  {[0, 1, 2].map(i => (
                    <motion.div
                      key={i}
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ background: '#74c7f7' }}
                      animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
                      transition={{ duration: 0.8, delay: i * 0.2, repeat: Infinity }}
                    />
                  ))}
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Finished message */}
          <AnimatePresence>
            {finished && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="px-4 py-3 text-center"
                style={{ borderTop: '1px solid rgba(116,199,247,0.15)' }}
              >
                <p className="font-cormorant text-sm italic text-gray-400">
                  That night... everything felt right. 💛
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-3 mt-4">
          {!isPlaying && !finished && (
            <motion.button
              onClick={() => setIsPlaying(true)}
              className="px-6 py-2.5 rounded-full font-cinzel text-xs tracking-wider"
              style={{
                background: 'linear-gradient(135deg, rgba(116,199,247,0.2), rgba(116,199,247,0.1))',
                border: '1px solid rgba(116,199,247,0.45)',
                color: '#74c7f7',
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              ▶ Play this memory
            </motion.button>
          )}

          {finished && (
            <motion.button
              onClick={restart}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="px-5 py-2 rounded-full font-cinzel text-xs"
              style={{
                border: '1px solid rgba(116,199,247,0.3)',
                color: '#74c7f7',
              }}
              whileHover={{ scale: 1.05 }}
            >
              ↺ Replay
            </motion.button>
          )}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-center max-w-sm"
      >
        <p className="font-cormorant text-base italic text-gray-500 leading-relaxed">
          Tanglish — because some feelings only make sense in the language closest to the heart.
        </p>
      </motion.div>
    </div>
  );
};

export default PlanetTide;
