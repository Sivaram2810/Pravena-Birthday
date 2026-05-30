import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FREQUENCY_SIGNALS, UNIVERSE_NAME } from '../../data/content';

const PlanetFrequency: React.FC = () => {
  const [activeSignal, setActiveSignal] = useState<number | null>(null);
  const [scanningLine, setScanningLine] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const timeRef = useRef(0);

  // Waveform canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const draw = () => {
      timeRef.current += 0.04;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw 3 waveforms
      const waves = [
        { color: '#9b7bff', amp: 20, freq: 2, phase: 0 },
        { color: '#ff7ab6', amp: 14, freq: 3.5, phase: 1 },
        { color: '#f7d774', amp: 28, freq: 1.2, phase: 2 },
      ];

      waves.forEach(wave => {
        ctx.beginPath();
        ctx.strokeStyle = wave.color + '88';
        ctx.lineWidth = 1.5;
        for (let x = 0; x < canvas.width; x += 2) {
          const y = canvas.height / 2 +
            Math.sin((x / canvas.width) * Math.PI * 2 * wave.freq + timeRef.current + wave.phase) * wave.amp +
            Math.sin((x / canvas.width) * Math.PI * 2 * (wave.freq * 2.1) + timeRef.current * 1.3) * (wave.amp * 0.3);
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      });

      // Center line
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(255,255,255,0.08)';
      ctx.lineWidth = 1;
      ctx.moveTo(0, canvas.height / 2);
      ctx.lineTo(canvas.width, canvas.height / 2);
      ctx.stroke();

      animRef.current = requestAnimationFrame(draw);
    };
    animRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  // Scanning line
  useEffect(() => {
    const iv = setInterval(() => {
      setScanningLine(prev => (prev + 1) % 100);
    }, 50);
    return () => clearInterval(iv);
  }, []);

  return (
    <div className="min-h-screen px-4 py-8 flex flex-col items-center gap-8">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <h1 className="font-cinzel text-3xl md:text-5xl font-bold" style={{ color: '#9b7bff', textShadow: '0 0 30px rgba(155,123,255,0.5)' }}>
          📡 FREQUENCY
        </h1>
        <p className="font-cormorant text-lg text-gray-300 mt-2 italic">Things only we understand</p>
      </motion.div>

      {/* Live waveform */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full max-w-lg relative rounded-2xl overflow-hidden"
        style={{ border: '1px solid rgba(155,123,255,0.3)', height: 120 }}
      >
        <canvas ref={canvasRef} className="w-full h-full" style={{ display: 'block' }} />

        {/* Scanning line overlay */}
        <div
          className="absolute top-0 bottom-0 w-px pointer-events-none"
          style={{
            left: `${scanningLine}%`,
            background: 'linear-gradient(to bottom, transparent, rgba(155,123,255,0.6), transparent)',
          }}
        />

        <div className="absolute top-2 left-3">
          <span className="font-cinzel text-xs" style={{ color: '#9b7bff', fontSize: 9, letterSpacing: '0.1em' }}>
            ◉ LIVE SIGNAL
          </span>
        </div>
      </motion.div>

      {/* Frequency cards */}
      <div className="w-full max-w-lg grid grid-cols-1 gap-4">
        {FREQUENCY_SIGNALS.map((signal, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            onClick={() => setActiveSignal(activeSignal === i ? null : i)}
            className="cursor-pointer rounded-2xl p-4 relative overflow-hidden"
            style={{
              background: activeSignal === i ? 'rgba(155,123,255,0.12)' : 'rgba(155,123,255,0.05)',
              border: `1px solid rgba(155,123,255,${activeSignal === i ? 0.4 : 0.2})`,
            }}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="font-cinzel text-2xl font-bold" style={{ color: '#9b7bff' }}>{signal.freq}</span>
                  <span className="font-cinzel text-xs" style={{ color: '#9b7bff', opacity: 0.7 }}>{signal.label}</span>
                </div>
              </div>
              <motion.div
                animate={{ rotate: activeSignal === i ? 90 : 0 }}
                className="text-gray-500"
              >
                ›
              </motion.div>
            </div>

            <AnimatePresence>
              {activeSignal === i && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="font-cormorant text-sm text-gray-300 italic leading-relaxed mt-3"
                >
                  {signal.meaning}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      {/* Final signal */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="w-full max-w-lg glass rounded-3xl p-6 text-center"
        style={{ border: '1px solid rgba(155,123,255,0.3)' }}
      >
        <p className="font-cinzel text-xs tracking-widest text-gray-500 mb-3">STRONGEST SIGNAL DETECTED</p>
        <p className="font-cormorant text-2xl italic" style={{ color: '#9b7bff' }}>
          The sound of your name<br />
          in a quiet room.
        </p>
        <p className="font-cinzel text-xs mt-3 text-gray-500">— Tuned in to {UNIVERSE_NAME}, always</p>
      </motion.div>
    </div>
  );
};

export default PlanetFrequency;
