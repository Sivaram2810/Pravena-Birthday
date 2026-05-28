import React, { useState } from 'react';
import { motion } from 'framer-motion';

const echoes = [
  { text: '"You make everything brighter."', delay: 0, x: 20, y: 20 },
  { text: '"I thought of you today."', delay: 0.5, x: 60, y: 35 },
  { text: '"You are exactly enough."', delay: 1, x: 30, y: 60 },
  { text: '"I am so proud of you."', delay: 1.5, x: 70, y: 70 },
  { text: '"Your laugh is my favourite sound."', delay: 2, x: 15, y: 80 },
  { text: '"Thank you for being you."', delay: 2.5, x: 50, y: 15 },
  { text: '"You matter more than you know."', delay: 3, x: 80, y: 50 },
  { text: '"Every version of you is worth loving."', delay: 3.5, x: 40, y: 45 },
];

const PlanetEcho: React.FC = () => {
  const [input, setInput] = useState('');
  const [sentEchoes, setSentEchoes] = useState<{ text: string; id: number }[]>([]);
  const [nextId, setNextId] = useState(0);

  const sendEcho = () => {
    if (!input.trim()) return;
    setSentEchoes(prev => [...prev, { text: `"${input}"`, id: nextId }]);
    setNextId(n => n + 1);
    setInput('');
  };

  return (
    <div className="min-h-screen px-4 py-8 flex flex-col items-center gap-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1
          className="font-cinzel text-3xl md:text-5xl font-bold"
          style={{ color: '#4488ff', textShadow: '0 0 30px rgba(68,136,255,0.4)' }}
        >
          🔵 ECHO
        </h1>
        <p className="font-cormorant text-lg text-gray-300 mt-2 italic">
          Words that resonate across the void
        </p>
      </motion.div>

      {/* Echo space */}
      <div
        className="relative w-full max-w-3xl rounded-3xl overflow-hidden"
        style={{
          height: 400,
          background: 'radial-gradient(ellipse at center, #0a1530 0%, #050816 100%)',
          border: '1px solid rgba(68,136,255,0.2)',
        }}
      >
        {echoes.map((echo, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{ left: `${echo.x}%`, top: `${echo.y}%`, transform: 'translate(-50%, -50%)' }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: [0, 0.8, 0.4, 0.8], scale: [0.8, 1, 0.95, 1] }}
            transition={{ delay: echo.delay, duration: 2, repeat: Infinity, repeatDelay: 3 }}
          >
            <p
              className="font-cormorant text-sm italic text-center"
              style={{ color: '#4488ff', textShadow: '0 0 10px rgba(68,136,255,0.5)', whiteSpace: 'nowrap' }}
            >
              {echo.text}
            </p>
          </motion.div>
        ))}

        {sentEchoes.map(echo => (
          <motion.div
            key={echo.id}
            className="absolute"
            style={{
              left: `${20 + Math.random() * 60}%`,
              top: `${20 + Math.random() * 60}%`,
              transform: 'translate(-50%, -50%)',
            }}
            initial={{ opacity: 1, scale: 0 }}
            animate={{ opacity: [1, 0.6, 0], scale: [0.8, 1.2, 0.8] }}
            transition={{ duration: 4, ease: 'easeOut' }}
          >
            <p className="font-cormorant text-sm italic" style={{ color: '#ff7ab6', textShadow: '0 0 10px rgba(255,122,182,0.5)' }}>
              {echo.text}
            </p>
          </motion.div>
        ))}

        <div className="absolute bottom-4 left-4">
          <p className="font-cinzel text-xs text-gray-700 tracking-widest">ECHO CHAMBER</p>
        </div>
      </div>

      {/* Send echo */}
      <div className="w-full max-w-md flex gap-2">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendEcho()}
          placeholder="Send a thought into the void..."
          className="flex-1 p-3 rounded-xl text-white placeholder-gray-600 font-cormorant text-base"
          style={{ background: 'rgba(68,136,255,0.1)', border: '1px solid rgba(68,136,255,0.3)', outline: 'none' }}
        />
        <motion.button
          onClick={sendEcho}
          className="px-4 py-3 rounded-xl font-cinzel text-sm"
          style={{ background: 'linear-gradient(135deg, #4488ff, #9b7bff)', color: 'white' }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Echo →
        </motion.button>
      </div>

      <p className="font-cormorant text-sm text-gray-500 italic text-center max-w-md">
        Words you send here will echo across the void. Some return changed. Some return exactly as they were.
        Just like love.
      </p>
    </div>
  );
};

export default PlanetEcho;
