import React from 'react';
import { motion } from 'framer-motion';

interface PlanetGenericProps {
  emoji: string;
  title: string;
  subtitle: string;
  color: string;
  content?: string;
  features?: { icon: string; title: string; desc: string }[];
}

const PlanetGeneric: React.FC<PlanetGenericProps> = ({
  emoji, title, subtitle, color, content, features
}) => {
  return (
    <div className="min-h-screen px-4 py-8 flex flex-col items-center gap-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1
          className="font-cinzel text-3xl md:text-5xl font-bold"
          style={{ color, textShadow: `0 0 30px ${color}66` }}
        >
          {emoji} {title}
        </h1>
        <p className="font-cormorant text-lg text-gray-300 mt-2 italic">{subtitle}</p>
      </motion.div>

      {content && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="w-full max-w-2xl glass rounded-3xl p-8"
        >
          <p className="font-cormorant text-lg text-gray-200 leading-relaxed italic whitespace-pre-line">
            {content}
          </p>
        </motion.div>
      )}

      {features && (
        <div className="w-full max-w-3xl grid grid-cols-1 md:grid-cols-2 gap-4">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.1 }}
              className="glass rounded-2xl p-5"
              style={{ border: `1px solid ${color}22` }}
            >
              <div className="text-3xl mb-2">{f.icon}</div>
              <h3 className="font-cinzel text-sm font-bold mb-1" style={{ color }}>{f.title}</h3>
              <p className="font-cormorant text-sm text-gray-400 italic">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      )}

      {/* Ambient particles */}
      {Array.from({ length: 12 }).map((_, i) => (
        <motion.div
          key={i}
          className="fixed rounded-full pointer-events-none"
          style={{
            width: 2 + Math.random() * 3,
            height: 2 + Math.random() * 3,
            background: color,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            opacity: 0,
          }}
          animate={{ opacity: [0, 0.4, 0], y: [0, -30, 0] }}
          transition={{ duration: 4 + Math.random() * 4, delay: Math.random() * 5, repeat: Infinity }}
        />
      ))}
    </div>
  );
};

export default PlanetGeneric;
