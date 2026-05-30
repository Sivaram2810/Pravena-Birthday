import React from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../contexts/AppContext';

const GlobalCandle: React.FC = () => {
  const { candleCarried } = useApp();
  if (!candleCarried) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0 }}
      className="fixed bottom-6 left-6 z-50 flex flex-col items-center pointer-events-none"
      style={{ filter: 'drop-shadow(0 0 12px rgba(247,215,116,0.6))' }}
      aria-hidden="true"
    >
      {/* Flame */}
      <motion.div
        style={{
          width: 10,
          height: 18,
          background: 'radial-gradient(ellipse at 50% 70%, #fff7e0 20%, #f7d774 50%, #ff7ab6 85%, transparent 100%)',
          borderRadius: '50% 50% 30% 30% / 60% 60% 40% 40%',
          marginBottom: 1,
        }}
        animate={{
          scaleX: [1, 0.85, 1.1, 0.9, 1],
          scaleY: [1, 1.1, 0.95, 1.05, 1],
          rotate: [-2, 2, -1, 3, -2],
        }}
        transition={{ duration: 0.8, repeat: Infinity, ease: 'easeInOut' }}
      />
      {/* Wick */}
      <div style={{ width: 1.5, height: 4, background: '#555', borderRadius: 1 }} />
      {/* Candle body */}
      <div
        style={{
          width: 12,
          height: 28,
          background: 'linear-gradient(to right, #f0e8d8, #e8d8bc, #d4c4a0)',
          borderRadius: '0 0 2px 2px',
          boxShadow: 'inset -2px 0 4px rgba(0,0,0,0.2)',
        }}
      />
      {/* Base */}
      <div
        style={{
          width: 18,
          height: 4,
          borderRadius: 9999,
          background: 'linear-gradient(to right, #c0a060, #a08040, #c0a060)',
        }}
      />
      <span
        className="font-cinzel mt-1"
        style={{ fontSize: 7, color: '#f7d774', letterSpacing: '0.05em', opacity: 0.8 }}
      >
        flame
      </span>
    </motion.div>
  );
};

export default GlobalCandle;
