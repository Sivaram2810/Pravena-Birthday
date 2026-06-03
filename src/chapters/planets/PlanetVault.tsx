import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock } from 'lucide-react';

const SECRET_CODE = 'SARA';

const VAULT_CONTENTS = [
  {
    id: 'secret1',
    emoji: '💛',
    title: 'The Truth About That Biology Exam',
    content: 'I wrote barely enough to pass. But honestly? Worth it. Every single second of staring at you while you focused on your paper was a memory I chose to keep over a good grade. You were worth more than any exam. You always are.',
  },
  {
    id: 'secret2',
    emoji: '🌙',
    title: 'The 3AM Confession',
    content: 'There were nights I couldn\'t sleep because I was thinking about whether you thought of me the same way. I never told you that. I would just text "still awake?" and hope. And sometimes, you were.',
  },
  {
    id: 'secret3',
    emoji: '📱',
    title: 'The Meme Strategy',
    content: 'Every meme I sent you — every single one — I chose deliberately. I searched for things you would like, things that might make you laugh, things that might start a conversation. It was never random. You were always the thought behind it.',
  },
  {
    id: 'secret4',
    emoji: '💌',
    title: 'What I Felt on Dec 19th',
    content: 'When you said "Love you" at 5:30 AM — I sat completely still for what felt like minutes. My heart was doing things I\'d never felt before. I read it seven times. I didn\'t reply immediately because I had to make sure I wasn\'t dreaming.',
  },
];

const PlanetVault: React.FC = () => {
  const [unlocked, setUnlocked] = useState(false);
  const [codeInput, setCodeInput] = useState('');
  const [codeError, setCodeError] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [openedSecrets, setOpenedSecrets] = useState<Set<string>>(new Set());

  const handleUnlock = () => {
    if (codeInput.toUpperCase() === SECRET_CODE) {
      setUnlocked(true);
      setCodeError(false);
    } else {
      setCodeError(true);
      setTimeout(() => setCodeError(false), 1500);
    }
  };

  const toggleSecret = (id: string) => {
    setOpenedSecrets(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="min-h-screen px-4 py-8 flex flex-col items-center gap-8">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <h1
          className="font-cinzel text-3xl md:text-5xl font-bold"
          style={{ color: '#cc4444', textShadow: '0 0 30px rgba(204,68,68,0.6)' }}
        >
          🔐 VAULT
        </h1>
        <p className="font-cormorant text-lg text-gray-300 mt-2 italic">Secrets locked in the dark</p>
      </motion.div>

      {!unlocked ? (
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md">
          <div
            className="rounded-3xl p-8 flex flex-col items-center gap-6"
            style={{
              background: 'linear-gradient(135deg, #1a0000, #0d0000)',
              border: '2px solid rgba(204,68,68,0.4)',
              boxShadow: '0 0 40px rgba(204,68,68,0.1)',
            }}
          >
            <div className="relative">
              <motion.div
                className="w-24 h-24 rounded-full flex items-center justify-center"
                style={{ background: 'radial-gradient(circle, #1a0000, #0d0000)', border: '2px solid rgba(204,68,68,0.5)' }}
                animate={{ boxShadow: ['0 0 20px rgba(204,68,68,0.2)', '0 0 40px rgba(204,68,68,0.4)', '0 0 20px rgba(204,68,68,0.2)'] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Lock size={36} style={{ color: '#cc4444' }} />
              </motion.div>
              {[0, 90, 180, 270].map(deg => (
                <div
                  key={deg}
                  className="absolute w-3 h-3 rounded-full"
                  style={{
                    background: '#cc4444',
                    top: '50%',
                    left: '50%',
                    transform: `rotate(${deg}deg) translate(42px, -50%)`,
                    opacity: 0.6,
                  }}
                />
              ))}
            </div>

            <div className="text-center">
              <h2 className="font-cinzel text-xl font-bold" style={{ color: '#cc4444' }}>VAULT ACCESS</h2>
              <p className="font-cormorant text-sm text-gray-500 italic mt-1">Enter the secret code to unlock</p>
            </div>

            <div className="w-full">
              <input
                type="text"
                value={codeInput}
                onChange={e => setCodeInput(e.target.value.toUpperCase())}
                onKeyDown={e => e.key === 'Enter' && handleUnlock()}
                placeholder="Enter code..."
                className="w-full p-4 rounded-xl text-center font-cinzel text-xl text-white placeholder-gray-600 tracking-widest"
                style={{
                  background: codeError ? 'rgba(255,0,0,0.1)' : 'rgba(255,255,255,0.05)',
                  border: `2px solid ${codeError ? 'rgba(255,0,0,0.5)' : 'rgba(204,68,68,0.3)'}`,
                  outline: 'none',
                }}
                maxLength={10}
              />
            </div>

            <AnimatePresence>
              {codeError && (
                <motion.p
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="font-cinzel text-xs tracking-widest"
                  style={{ color: '#ff4444' }}
                >
                  ACCESS DENIED
                </motion.p>
              )}
            </AnimatePresence>

            {showHint && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-cormorant text-sm text-gray-400 italic">
                Hint: It's what he calls you 💛
              </motion.p>
            )}

            <motion.button
              onClick={handleUnlock}
              className="w-full py-3 rounded-xl font-cinzel text-sm tracking-wider flex items-center justify-center gap-2"
              style={{
                background: 'linear-gradient(135deg, rgba(204,68,68,0.4), rgba(160,0,0,0.4))',
                border: '1px solid rgba(204,68,68,0.5)',
                color: '#cc4444',
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Lock size={14} />
              UNLOCK VAULT
            </motion.button>

            {!showHint && (
              <motion.button
                onClick={() => setShowHint(true)}
                className="font-cormorant text-xs text-gray-600 italic hover:text-gray-400"
                whileHover={{ scale: 1.05 }}
              >
                Need a hint?
              </motion.button>
            )}
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-2xl flex flex-col gap-6"
        >
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-center">
            <div className="text-4xl mb-2">🔓</div>
            <p className="font-cinzel text-sm tracking-widest" style={{ color: '#f7d774' }}>VAULT UNLOCKED</p>
            <p className="font-cormorant text-sm text-gray-400 italic mt-1">These are the things I never quite said out loud</p>
          </motion.div>

          {VAULT_CONTENTS.map((secret, i) => (
            <motion.div
              key={secret.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="rounded-2xl overflow-hidden cursor-pointer"
              style={{
                background: openedSecrets.has(secret.id)
                  ? 'linear-gradient(135deg, rgba(247,215,116,0.08), rgba(204,68,68,0.06))'
                  : 'rgba(255,255,255,0.03)',
                border: `1px solid ${openedSecrets.has(secret.id) ? 'rgba(247,215,116,0.3)' : 'rgba(204,68,68,0.2)'}`,
              }}
              onClick={() => toggleSecret(secret.id)}
            >
              <div className="p-4 flex items-center gap-4">
                <span className="text-2xl flex-shrink-0">{secret.emoji}</span>
                <div className="flex-1">
                  <p className="font-cinzel text-sm font-bold" style={{ color: '#f7d774' }}>{secret.title}</p>
                </div>
                <span className="text-gray-600">{openedSecrets.has(secret.id) ? '▲' : '▼'}</span>
              </div>

              <AnimatePresence>
                {openedSecrets.has(secret.id) && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-5" style={{ borderTop: '1px solid rgba(247,215,116,0.1)' }}>
                      <p className="font-cormorant text-base text-gray-200 italic leading-relaxed pt-4">
                        {secret.content}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default PlanetVault;
