import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { UNIVERSE_NAME, SENDER_NAME } from '../../data/content';

const TIDE_MESSAGES = [
  { from: SENDER_NAME, text: 'Some days the distance feels like trying to hold water.', delay: 0 },
  { from: UNIVERSE_NAME, text: 'And some days it feels like the distance doesn\'t exist at all.', delay: 0.4 },
  { from: SENDER_NAME, text: 'Those days are everything.', delay: 0.8 },
  { from: UNIVERSE_NAME, text: 'Tell me you\'ll remember them.', delay: 1.2 },
  { from: SENDER_NAME, text: 'I remember every single one.', delay: 1.6 },
  { from: UNIVERSE_NAME, text: 'Good. So do I.', delay: 2.0 },
];

const PlanetTide: React.FC = () => {
  const [visibleCount, setVisibleCount] = useState(0);
  const [heartbeatSize, setHeartbeatSize] = useState(1);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const timeRef = useRef(0);

  // Wave animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    canvas.width = canvas.offsetWidth;
    canvas.height = 120;

    const draw = () => {
      timeRef.current += 0.025;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const waves = [
        { color: 'rgba(116,199,247,0.35)', amp: 22, freq: 1.8, speed: 1, offset: 0 },
        { color: 'rgba(155,123,255,0.25)', amp: 16, freq: 2.5, speed: 1.3, offset: 1 },
        { color: 'rgba(116,199,247,0.2)', amp: 28, freq: 1.2, speed: 0.7, offset: 2 },
      ];

      waves.forEach(wave => {
        ctx.beginPath();
        ctx.fillStyle = wave.color;
        ctx.moveTo(0, canvas.height);
        for (let x = 0; x <= canvas.width; x += 3) {
          const y = canvas.height / 2 +
            Math.sin((x / canvas.width) * Math.PI * 2 * wave.freq + timeRef.current * wave.speed + wave.offset) * wave.amp;
          ctx.lineTo(x, y);
        }
        ctx.lineTo(canvas.width, canvas.height);
        ctx.closePath();
        ctx.fill();
      });

      animRef.current = requestAnimationFrame(draw);
    };
    animRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  // Reveal messages progressively
  useEffect(() => {
    const t = setTimeout(() => {
      if (visibleCount < TIDE_MESSAGES.length) {
        setVisibleCount(v => v + 1);
      }
    }, visibleCount === 0 ? 500 : 1200);
    return () => clearTimeout(t);
  }, [visibleCount]);

  // Heartbeat
  useEffect(() => {
    const iv = setInterval(() => {
      setHeartbeatSize(1.25);
      setTimeout(() => setHeartbeatSize(1), 200);
    }, 1400);
    return () => clearInterval(iv);
  }, []);

  return (
    <div className="min-h-screen px-4 py-8 flex flex-col items-center gap-8">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <h1 className="font-cinzel text-3xl md:text-5xl font-bold" style={{ color: '#74c7f7', textShadow: '0 0 30px rgba(116,199,247,0.5)' }}>
          🌊 TIDE
        </h1>
        <p className="font-cormorant text-lg text-gray-300 mt-2 italic">The pull between two hearts</p>
      </motion.div>

      {/* Wave visual */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full max-w-lg rounded-2xl overflow-hidden"
        style={{ border: '1px solid rgba(116,199,247,0.2)', height: 120 }}
      >
        <canvas ref={canvasRef} className="w-full" />
      </motion.div>

      {/* Chat messages */}
      <div className="w-full max-w-sm flex flex-col gap-3">
        {TIDE_MESSAGES.slice(0, visibleCount).map((msg, i) => {
          const isMe = msg.from === SENDER_NAME;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: isMe ? -20 : 20, y: 10 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 22 }}
              className={`flex ${isMe ? 'justify-start' : 'justify-end'}`}
            >
              <div
                className="max-w-xs px-4 py-3 rounded-2xl"
                style={{
                  background: isMe ? 'rgba(116,199,247,0.15)' : 'rgba(155,123,255,0.15)',
                  border: `1px solid ${isMe ? 'rgba(116,199,247,0.3)' : 'rgba(155,123,255,0.3)'}`,
                  borderRadius: isMe ? '4px 18px 18px 18px' : '18px 4px 18px 18px',
                }}
              >
                <p className="font-cinzel text-xs mb-1 opacity-60" style={{ color: isMe ? '#74c7f7' : '#9b7bff', fontSize: 8, letterSpacing: '0.08em' }}>
                  {msg.from.toUpperCase()}
                </p>
                <p className="font-cormorant text-sm text-gray-200 italic leading-relaxed">{msg.text}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Heartbeat */}
      <motion.div className="text-center mt-4">
        <motion.div
          className="text-4xl inline-block"
          animate={{ scale: heartbeatSize }}
          transition={{ duration: 0.15, ease: 'easeInOut' }}
        >
          🌊
        </motion.div>
        <p className="font-cormorant text-lg italic text-gray-400 mt-2">
          The tide always finds its way back.
        </p>
      </motion.div>
    </div>
  );
};

export default PlanetTide;
