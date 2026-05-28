import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppContext } from '../../contexts/AppContext';

const PlanetVoid: React.FC = () => {
  const { candleCarried, setCandle } = useAppContext();
  const [candleLit, setCandleLit] = useState(false);
  const [flickerIntensity, setFlickerIntensity] = useState(1);
  const [phaseText, setPhaseText] = useState(0);

  const voidTexts = [
    "In the space between stars, there is silence.",
    "Not emptiness. Not nothing.",
    "Just the quiet that holds everything together.",
    "You were my light in the void.",
    "And some flames cannot be extinguished.",
    "No matter the distance.",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setFlickerIntensity(0.8 + Math.random() * 0.4);
    }, 200);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (candleLit) {
      const interval = setInterval(() => {
        setPhaseText(p => {
          if (p < voidTexts.length - 1) return p + 1;
          clearInterval(interval);
          return p;
        });
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [candleLit]);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
      style={{ background: 'radial-gradient(ellipse at center, #0a0510 0%, #020105 100%)' }}
    >
      {/* Void overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(45,27,105,0.2) 0%, transparent 70%)' }}
      />

      {/* Sparse stars */}
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: 1 + Math.random() * 2,
            height: 1 + Math.random() * 2,
            background: 'white',
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            opacity: 0.2 + Math.random() * 0.3,
          }}
          animate={{ opacity: [0.1, 0.4, 0.1] }}
          transition={{ duration: 3 + Math.random() * 4, repeat: Infinity, delay: Math.random() * 3 }}
        />
      ))}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
        className="text-center mb-12 px-4"
      >
        <h1
          className="font-cinzel text-3xl md:text-5xl font-bold"
          style={{ color: '#aaaacc', textShadow: '0 0 20px rgba(155,123,255,0.3)' }}
        >
          ⚫ VOID
        </h1>
        <p className="font-cormorant text-gray-400 mt-2 italic">The silence between heartbeats</p>
      </motion.div>

      {/* Text sequence */}
      <div className="text-center mb-16 px-4 max-w-lg min-h-32">
        <AnimatePresence mode="wait">
          {voidTexts.slice(0, candleLit ? phaseText + 1 : 1).map((text, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: i === (candleLit ? phaseText : 0) ? 1 : 0.3, y: 0 }}
              className="font-cormorant text-xl md:text-2xl text-gray-300 italic mb-3"
            >
              {text}
            </motion.p>
          ))}
        </AnimatePresence>
        {!candleLit && (
          <motion.p
            animate={{ opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="font-cormorant text-gray-600 italic text-sm mt-4"
          >
            Light the candle to continue
          </motion.p>
        )}
      </div>

      {/* Candle */}
      <div className="flex flex-col items-center gap-8">
        <motion.div
          className="relative flex flex-col items-center cursor-pointer"
          onClick={() => !candleLit && setCandleLit(true)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
        >
          {/* Flame */}
          <AnimatePresence>
            {candleLit && (
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative mb-1 flex items-end justify-center"
                style={{ height: '60px' }}
              >
                <motion.div
                  className="absolute rounded-full"
                  style={{
                    width: 50, height: 50,
                    background: 'radial-gradient(circle, rgba(247,215,116,0.2) 0%, transparent 70%)',
                    bottom: 0,
                  }}
                  animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
                <motion.div
                  style={{
                    width: 20, height: 45,
                    background: 'radial-gradient(ellipse at 50% 70%, #fff7e0 20%, #f7d774 50%, #ff7ab6 80%, transparent 100%)',
                    borderRadius: '50% 50% 30% 30% / 60% 60% 40% 40%',
                    filter: 'blur(0.5px)',
                    boxShadow: '0 0 20px rgba(247,215,116,0.8), 0 0 40px rgba(255,122,182,0.4)',
                    opacity: flickerIntensity,
                    transformOrigin: 'bottom center',
                  }}
                  animate={{ scaleX: [1, 0.85, 1.1, 0.9, 1], scaleY: [1, 1.1, 0.95, 1.05, 1], rotate: [-2, 2, -1, 3, -2] }}
                  transition={{ duration: 0.8, repeat: Infinity, ease: 'easeInOut' }}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Unlit flame indicator */}
          {!candleLit && (
            <div className="mb-1 flex items-end justify-center" style={{ height: '60px' }}>
              <motion.div
                style={{
                  width: 20, height: 45,
                  background: 'radial-gradient(ellipse at 50% 70%, rgba(155,123,255,0.3) 0%, transparent 70%)',
                  borderRadius: '50% 50% 30% 30% / 60% 60% 40% 40%',
                  border: '1px solid rgba(155,123,255,0.2)',
                }}
                animate={{ opacity: [0.3, 0.7, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
          )}

          <div className="w-0.5 h-3 rounded-t" style={{ background: '#555' }} />
          <div
            className="w-10 h-28 rounded-b-sm relative overflow-hidden"
            style={{
              background: 'linear-gradient(to right, #f0e8d8, #e8d8bc, #d4c4a0)',
              boxShadow: 'inset -4px 0 8px rgba(0,0,0,0.2), 0 0 20px rgba(247,215,116,0.1)',
            }}
          >
            <div
              className="absolute top-2 right-1"
              style={{ width: 6, height: 20, background: '#e8d8bc', borderRadius: '0 0 50% 50%' }}
            />
          </div>
          <div className="w-16 h-2 rounded-full" style={{ background: 'linear-gradient(to right, #c0a060, #a08040, #c0a060)' }} />
        </motion.div>

        {!candleLit && (
          <motion.p
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="font-cinzel text-xs tracking-widest"
            style={{ color: '#9b7bff' }}
          >
            CLICK TO LIGHT
          </motion.p>
        )}

        {/* Carry flame button */}
        {candleLit && phaseText >= voidTexts.length - 1 && !candleCarried && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={() => setCandle(true)}
            className="px-6 py-3 rounded-full font-cinzel text-sm tracking-wider"
            style={{
              background: 'linear-gradient(135deg, rgba(247,215,116,0.15), rgba(255,122,182,0.1))',
              border: '1px solid rgba(247,215,116,0.4)',
              color: '#f7d774',
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            🕯️ Carry this flame
          </motion.button>
        )}

        {candleCarried && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="font-cormorant text-sm text-gray-400 italic"
          >
            ✓ The flame travels with you now
          </motion.p>
        )}
      </div>
    </div>
  );
};

export default PlanetVoid;
