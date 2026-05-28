import React from 'react';
import { motion } from 'framer-motion';
import { useAppContext } from '../contexts/AppContext';

const GlobalCandle: React.FC = () => {
  const { candleCarried } = useAppContext();
  if (!candleCarried) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      className="fixed bottom-6 left-6 z-50 flex flex-col items-center"
      title="Carrying the flame"
    >
      <div className="relative w-8 h-10 flex flex-col items-center">
        {/* Flame */}
        <div className="flame-anim absolute -top-5 w-4 h-6 flex items-center justify-center">
          <div
            className="w-3 h-5 rounded-full"
            style={{
              background: 'radial-gradient(ellipse at 50% 70%, #fff7e0 20%, #f7d774 50%, #ff7ab6 80%, transparent 100%)',
              filter: 'blur(0.5px)',
              boxShadow: '0 0 10px rgba(247, 215, 116, 0.8), 0 0 20px rgba(255, 122, 182, 0.4)',
            }}
          />
        </div>
        {/* Candle body */}
        <div
          className="absolute bottom-0 w-4 h-8 rounded-sm"
          style={{
            background: 'linear-gradient(to right, #f0e0c0, #e8d4a8, #d4b896)',
            boxShadow: 'inset -2px 0 4px rgba(0,0,0,0.2)',
          }}
        />
        {/* Wick */}
        <div className="absolute bottom-7 w-0.5 h-2 bg-gray-700 rounded" />
      </div>
      <span className="text-xs mt-1 font-cinzel" style={{ color: '#f7d774', fontSize: '8px' }}>
        flame
      </span>
    </motion.div>
  );
};

export default GlobalCandle;
